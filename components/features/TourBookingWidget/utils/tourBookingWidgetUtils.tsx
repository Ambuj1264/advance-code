import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, getOrElse, isSome, map, none, Option, toUndefined } from "fp-ts/lib/Option";
import { findFirst, range } from "fp-ts/lib/Array";
import { addDays, format, parse } from "date-fns";

import BookingWidgetView, { OrderBookingWidgetView } from "../types/enums";
import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";
import {
  checkIsTravelerExperience,
  getExperiencePrice,
  getPriceIndex,
} from "../Experiences/experiencesUtils";

import { BookingWidgetState } from "components/features/TourBookingWidget/BookingWidgetState";
import { getFixedSelectedDatesFromLocalStorage } from "utils/localStorageUtils";
import { shouldSetInitalSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { yearMonthDayFormat } from "utils/dateUtils";
import { BookingWidgetFormError, TransportPickup } from "types/enums";
import { getNumberOfDays, getTravelerPriceText } from "utils/helperUtils";

export const constructPluralText = (
  numberOfPersons: number,
  singleText: string,
  pluralText: string
) => {
  if (numberOfPersons === 0) {
    return "";
  }
  return `${numberOfPersons} ${numberOfPersons === 1 ? singleText : pluralText}`;
};

export const constructDates = (
  { min, max, unavailableDates, availableDates }: TourBookingWidgetTypes.QueryDates,
  isAdmin = false
) => {
  const currentDate = new Date();
  return {
    min:
      !isAdmin && typeof min === "string" ? parse(min, yearMonthDayFormat, currentDate) : undefined,
    max: typeof max === "string" ? parse(max, yearMonthDayFormat, currentDate) : undefined,
    unavailableDates: unavailableDates.map(date => parse(date, yearMonthDayFormat, currentDate)),
    availableDates: availableDates.map(date => parse(date, yearMonthDayFormat, currentDate)),
  };
};

export const constructBookingWidgetTourData = ({
  tour,
  livePriceBasePrice,
  isLivePricing,
}: {
  tour?: QueryTour;
  livePriceBasePrice?: number;
  isLivePricing?: boolean;
}): TourBookingWidgetTypes.BookingWidgetTourData | null => {
  if (!tour) {
    return null;
  }

  const { basePrice, durationInSeconds } = tour;

  return {
    basePrice: isLivePricing && livePriceBasePrice ? livePriceBasePrice : basePrice,
    lengthOfTour: getNumberOfDays(durationInSeconds),
  };
};

export const constructPrices = (
  adults: number,
  teenagers: number,
  children: number
): TourBookingWidgetTypes.Prices => ({
  adults,
  teenagers,
  children,
});

export const constructOptionPrices = (
  prices: TourBookingWidgetTypes.QueryOptionPrice[]
): TourBookingWidgetTypes.OptionPrice[] =>
  prices.map(price => ({
    price: Number(price.price),
    disabled: price.disabled === 1,
  }));

export const constructOptions = (
  options: TourBookingWidgetTypes.QueryOption[]
): TourBookingWidgetTypes.Option[] =>
  options.map(option => {
    const prices = constructOptionPrices(option.prices);
    return {
      id: option.id,
      prices,
      disabled: prices[0].disabled,
      included: option.included === 1,
    };
  });

export const constructTourExtras = (
  extras: TourBookingWidgetTypes.QueryExtra[]
): TourBookingWidgetTypes.Extra[] => {
  return extras.map(extra => {
    const options = constructOptions(extra.options || []);
    return {
      id: String(extra.id),
      disabled:
        extra.disabled === 1 || (options.length > 0 && options.every(option => option.disabled)),
      options,
      price: parseInt(extra.price, 10),
    };
  });
};

export const constructGTIVpExtras = (
  options?: TourBookingWidgetTypes.QueryVpOptions[]
): TourBookingWidgetTypes.Extra[] => {
  return options
    ? options.map(option => {
        return {
          id: String(option.id),
          disabled: false,
          price: option.price?.value || 0,
          discountValue: option.price?.discount,
          options: option.items.map(optionItem => {
            const { price: optionPrice } = optionItem;
            const { discount: optionDiscount } = optionPrice || {};

            return {
              id: optionItem.id,
              disabled: false,
              included: optionItem.isIncluded,
              prices: optionPrice
                ? [
                    {
                      price: optionPrice.value,
                      disabled: false,
                      discountValue: optionDiscount,
                    },
                  ]
                : [
                    {
                      price: 0,
                      disabled: false,
                    },
                  ],
            };
          }),
        };
      })
    : [];
};

export const filterOutUnavailableTimes = (availableTimes: TourBookingWidgetTypes.Time[]) =>
  availableTimes.filter(time => time.maxNumberOfTravelers !== 0 && time.available);

export const constructPickupPrices = (
  pickupPricedPerPerson: boolean,
  pricePickup: number,
  pricePickupTeenager: number,
  pricePickupChild: number
): TourBookingWidgetTypes.PickupPrices => ({
  pickupPricedPerPerson,
  prices: constructPrices(pricePickup, pricePickupTeenager, pricePickupChild),
});

export const constructFlexibleAvailableTime = (
  times: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>,
  flexibleText: string,
  availableTimes: TourBookingWidgetTypes.Time[]
) => {
  const isFlexible = times.some(time => Boolean(time.isFlexible));
  const maybeFlexibleOption =
    isFlexible && availableTimes.length > 0
      ? [
          {
            ...availableTimes[0],
            time: flexibleText,
            departureTime: flexibleText,
            pickupPrices: constructPickupPrices(
              availableTimes[0].pickupPrices.pickupPricedPerPerson,
              availableTimes[0].pickupPrices.prices.adults,
              availableTimes[0].pickupPrices.prices.teenagers,
              availableTimes[0].pickupPrices.prices.children
            ),
          },
        ]
      : [];

  return { isFlexible, maybeFlexibleOption };
};

export const constructTourTimesAvailability = (
  times: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>,
  flexibleText: string
): TourBookingWidgetTypes.AvailableTimes => {
  const availableTimes = times.map(availableTime => ({
    time: availableTime.time,
    extras: constructTourExtras(availableTime.extras),
    minNumberOfTravelers: availableTime.minNumberOfTravelers,
    maxNumberOfTravelers: availableTime.maxNumberOfTravelers,
    available: availableTime.available,
    departureTime: availableTime.departureTime,
    isPickupAvailable: availableTime.isPickupAvailable,
    prices: [
      constructPrices(
        availableTime.priceAdult,
        availableTime.priceTeenager,
        availableTime.priceChild
      ),
      constructPrices(
        availableTime.priceAdult2,
        availableTime.priceTeenager2,
        availableTime.priceChild2
      ),
      constructPrices(
        availableTime.priceAdult3,
        availableTime.priceTeenager3,
        availableTime.priceChild3
      ),
      constructPrices(
        availableTime.priceAdult4,
        availableTime.priceTeenager4,
        availableTime.priceChild4
      ),
      constructPrices(
        availableTime.priceAdult5,
        availableTime.priceTeenager5,
        availableTime.priceChild5
      ),
    ],
    pickupPrices: constructPickupPrices(
      availableTime.pickupPrices.pickup_priced_per_person,
      availableTime.pickupPrices.price_pickup,
      availableTime.pickupPrices.price_pickup_teenager,
      availableTime.pickupPrices.price_pickup_child
    ),
  }));

  const { isFlexible, maybeFlexibleOption } = constructFlexibleAvailableTime(
    times,
    flexibleText,
    availableTimes
  );
  return {
    isFlexible,
    times: [...maybeFlexibleOption, ...availableTimes],
  };
};

export const constructGTIVpTimesAvailability = (
  times: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData>,
  flexibleText: string
): TourBookingWidgetTypes.AvailableTimes => {
  const availableTimes = times.map(availableTime => ({
    time: availableTime.time,
    minNumberOfTravelers: availableTime.minNumberOfTravelers,
    maxNumberOfTravelers: availableTime.maxNumberOfTravelers,
    available: availableTime.available,
    departureTime: availableTime.departureTime,
    isPickupAvailable: availableTime.isPickupAvailable,
    prices: [],
    pickupPrices: constructPickupPrices(
      availableTime.pickupPrices.pickup_priced_per_person,
      availableTime.pickupPrices.price_pickup,
      availableTime.pickupPrices.price_pickup_teenager,
      availableTime.pickupPrices.price_pickup_child
    ),
  }));

  const { isFlexible, maybeFlexibleOption } = constructFlexibleAvailableTime(
    times,
    flexibleText,
    availableTimes
  );
  return {
    isFlexible,
    times: [...maybeFlexibleOption, ...availableTimes],
  };
};

export const getSelectedExperienceTotalPrice = (
  price: number,
  numberOfTravelers: number,
  calculatePricePerPerson?: boolean
) => (calculatePricePerPerson ? price * numberOfTravelers : price);

export const updateTravelerExperiences = (
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  experiences: TourBookingWidgetTypes.SelectedExperiences
) => {
  const totalNumberOfTravelers = getTotalNumberOfTravelers(numberOfTravelers);
  return experiences.map(experience => {
    return checkIsTravelerExperience(experience)
      ? {
          ...experience,
          count: Math.min(experience.count, totalNumberOfTravelers),
        }
      : experience;
  });
};
export const getExperiencePrices = (
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences,
  numberOfTravelers: SharedTypes.NumberOfTravelers
) => {
  return selectedExperiences.reduce((acc, experience) => {
    if (checkIsTravelerExperience(experience)) {
      if (experience.count > 0) {
        return (
          getSelectedExperienceTotalPrice(
            experience.price,
            experience.count,
            experience.calculatePricePerPerson
          ) + acc
        );
      }
      return acc;
    }
    return (
      getSelectedExperienceTotalPrice(
        getExperiencePrice(experience.prices, numberOfTravelers),
        getTotalNumberOfTravelers(numberOfTravelers),
        experience.calculatePricePerPerson
      ) + acc
    );
  }, 0);
};

const findFirstPickupTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  selectedPickupTime?: string
) =>
  findFirst(
    (availableTime: TourBookingWidgetTypes.Time) => availableTime.time === selectedPickupTime
  )(availableTimes);

const findFirstDepartureTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  selectedPickupTime?: string
) =>
  findFirst(
    (availableTime: TourBookingWidgetTypes.Time) =>
      availableTime.departureTime === selectedPickupTime
  )(availableTimes);

const findFirstMatchingTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  hasPickup: boolean,
  selectedPickupTime?: string
) => {
  const departureTime = findFirstDepartureTime(availableTimes, selectedPickupTime);
  const time = findFirstPickupTime(availableTimes, selectedPickupTime);
  if (hasPickup) {
    if (isSome(time)) {
      return time;
    }
    return departureTime;
  }
  if (isSome(departureTime)) {
    return departureTime;
  }
  return time;
};

type ConstructTravelerPricesInput = {
  availableTimes: TourBookingWidgetTypes.Time[];
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  selectedPickupTime?: string;
  hasPickup: boolean;
  isLivePricing: boolean;
};

export const constructTravelerPrices = ({
  availableTimes,
  numberOfTravelers: { adults, teenagers, children },
  selectedPickupTime,
  hasPickup,
  isLivePricing,
}: ConstructTravelerPricesInput): TourBookingWidgetTypes.Prices => {
  if (isLivePricing) {
    return {
      adults: 0,
      teenagers: 0,
      children: 0,
    };
  }

  const prices = pipe(
    findFirstMatchingTime(availableTimes, hasPickup, selectedPickupTime),
    map(time => time.prices),
    getOrElse(() => [{ adults: 0, teenagers: 0, children: 0 }])
  );

  const pricePerAdult = prices[getPriceIndex(adults, prices.length)].adults;
  const pricePerTeenagers = prices[getPriceIndex(teenagers, prices.length)].teenagers;
  const pricePerChildren = prices[getPriceIndex(children, prices.length)].children;
  return {
    adults: pricePerAdult,
    teenagers: pricePerTeenagers,
    children: pricePerChildren,
  };
};

export const getPickupPrices = (
  availableTimes: TourBookingWidgetTypes.Time[],
  selectedPickupTime?: string
) =>
  pipe(
    availableTimes,
    findFirst(availableTime => availableTime.time === selectedPickupTime),
    map(time => time.pickupPrices),
    getOrElse(() => ({
      pickupPricedPerPerson: true,
      prices: {
        adults: 0,
        teenagers: 0,
        children: 0,
      },
    }))
  );

export const calculatePickupPrice = (
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  availableTimes: TourBookingWidgetTypes.Time[],
  selectedPickupTime?: string
) => {
  const pickupPrices = getPickupPrices(availableTimes, selectedPickupTime);
  const {
    adults: numberOfAdults,
    teenagers: numberOfTeenagers,
    children: numberOfChildren,
  } = numberOfTravelers;
  if (pickupPrices.pickupPricedPerPerson === false) return pickupPrices.prices.adults;
  return (
    numberOfAdults * pickupPrices.prices.adults +
    numberOfTeenagers * pickupPrices.prices.teenagers +
    numberOfChildren * pickupPrices.prices.children
  );
};

export const calculatePrivateOptionsPrice = (
  options: TourBookingWidgetTypes.PrivateOption[]
): number => {
  return options.reduce((acc: number, option) => acc + option.price, 0);
};

export const getPrivateOptionPricePerPerson = (
  options: TourBookingWidgetTypes.PrivateOption[],
  numberOfTravelers: SharedTypes.NumberOfTravelers
): number => {
  const totalNumberOfTravelers = getTotalNumberOfTravelers(numberOfTravelers);
  const optionsPrice = calculatePrivateOptionsPrice(options);
  return optionsPrice / totalNumberOfTravelers;
};

export const getTourDiscountPrice = (price: number, discount: Option<number>) =>
  pipe(
    discount,
    map(value => price * ((100 - value) / 100)),
    getOrElse(() => price)
  );

export const calculateTourTotalPrice = ({
  numberOfTravelers,
  availableTimes,
  selectedExperiences,
  hasPickup,
  isFullPriceDiscount,
  discount,
  selectedPickupTime,
  isPrivate,
  selectedPrivateOptions,
}: {
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  availableTimes: TourBookingWidgetTypes.Time[];
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  hasPickup: boolean;
  isFullPriceDiscount: boolean;
  discount: Option<number>;
  selectedPickupTime?: string;
  isPrivate: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
}) => {
  const {
    adults: numberOfAdults,
    teenagers: numberOfTeenagers,
    children: numberOfChildren,
  } = numberOfTravelers;
  const {
    adults: pricePerAdult,
    teenagers: pricePerTeenager,
    children: pricePerChild,
  } = constructTravelerPrices({
    availableTimes,
    numberOfTravelers,
    selectedPickupTime,
    hasPickup,
    isLivePricing: false,
  });
  const basePrice =
    pricePerAdult * numberOfAdults +
    pricePerTeenager * numberOfTeenagers +
    pricePerChild * numberOfChildren;

  const basePriceWithDiscount = getTourDiscountPrice(basePrice, discount);
  const pickupPrice = hasPickup
    ? calculatePickupPrice(numberOfTravelers, availableTimes, selectedPickupTime)
    : 0;
  const experiencePrices = getExperiencePrices(selectedExperiences, numberOfTravelers);
  const privateOptionsPrice = isPrivate ? calculatePrivateOptionsPrice(selectedPrivateOptions) : 0;
  const restPrice = pickupPrice + experiencePrices + privateOptionsPrice;
  const restDiscount = isFullPriceDiscount ? discount : none;
  const restPriceWithDiscount = getTourDiscountPrice(restPrice, restDiscount);

  return [basePriceWithDiscount + restPriceWithDiscount, basePrice + restPrice];
};

export const getDefaultGroupExperiencesAnswers = (
  experiences?: ExperiencesTypes.Experience[][]
) => {
  const groupExperiences =
    experiences && experiences.length
      ? (experiences[0] as ExperiencesTypes.MultiSelectionExperience[])
      : [];

  return groupExperiences.map(
    experience => experience.answers.find(answer => answer.included) || experience.answers[0]
  );
};

// https://travelshift.slite.com/app/docs/bZbo6by1Kq8dR7
export const calculateGTIVpTotalPrice = ({
  selectedExperiences,
  basePrice,
  baseDiscountValue = 0,
  experiences,
}: {
  basePrice: number;
  baseDiscountValue?: number;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  experiences?: ExperiencesTypes.Experience[][];
}) => {
  const defaultGroupExperienceAnswers = getDefaultGroupExperiencesAnswers(experiences);

  return selectedExperiences.reduce(
    (result, extraOption, index) => {
      const isTravelerExperience = checkIsTravelerExperience(extraOption);
      const defaultOptionForCurrentExperiences = !isTravelerExperience
        ? defaultGroupExperienceAnswers[index]
        : undefined;
      const isDefaultExperience =
        !isTravelerExperience &&
        defaultOptionForCurrentExperiences &&
        defaultOptionForCurrentExperiences.id === extraOption.answerId;
      const travelerExperienceOptionPrice =
        isTravelerExperience && extraOption.count
          ? getSelectedExperienceTotalPrice(
              extraOption.price,
              extraOption.count,
              extraOption.calculatePricePerPerson
            )
          : 0;
      const hasDefaultOptionData =
        !isTravelerExperience && defaultOptionForCurrentExperiences && !isDefaultExperience;
      const groupExperienceOptionPrice = hasDefaultOptionData
        ? extraOption.prices[0] - defaultOptionForCurrentExperiences.prices[0]
        : 0;
      const groupExperienceOptionDiscount =
        hasDefaultOptionData &&
        extraOption.vpPrice.discountValue &&
        defaultOptionForCurrentExperiences.vpPrice.discountValue
          ? extraOption.vpPrice.discountValue -
            defaultOptionForCurrentExperiences.vpPrice.discountValue
          : 0;
      const extraPrice = isTravelerExperience
        ? travelerExperienceOptionPrice
        : groupExperienceOptionPrice;
      const travelerExperienceOptionDiscount =
        isTravelerExperience && extraOption.count && extraOption.discountValue
          ? getSelectedExperienceTotalPrice(
              extraOption.discountValue,
              extraOption.count,
              extraOption.calculatePricePerPerson
            )
          : 0;

      const extraDiscount = isTravelerExperience
        ? travelerExperienceOptionDiscount
        : groupExperienceOptionDiscount;

      const { price: currentBasePrice, discountValue: currentDiscountValue } = result;

      return {
        price: currentBasePrice + extraPrice,
        discountValue: currentDiscountValue + extraDiscount,
      };
    },
    { price: basePrice, discountValue: baseDiscountValue }
  );
};

type ConstructFormDataInput = {
  tourId: number;
  selectedDates: SharedTypes.SelectedDates;
  childrenAges: number[];
  selectedPickupTime?: string;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  isFlexible: boolean;
  pickupType: string;
  pickupPlace: string;
  pickupPlaceId: number;
  hasPickup: boolean;
  isPrivate: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  livePricingUuid?: string;
  livePricingNonDefaultUuid?: string;
};

export const getTourPickup = (pickupType: string, hasPickup: boolean) => {
  if (pickupType === "not_available") return false;
  if (hasPickup) return true;
  return false;
};

export const constructFormData = ({
  tourId,
  selectedDates,
  selectedPickupTime = "",
  numberOfTravelers,
  childrenAges,
  isFlexible,
  pickupType,
  pickupPlace,
  pickupPlaceId,
  hasPickup,
  isPrivate,
  selectedPrivateOptions,
  livePricingUuid,
  livePricingNonDefaultUuid,
}: ConstructFormDataInput): TourBookingWidgetTypes.FormData => {
  const { adults, teenagers, children } = numberOfTravelers;
  const date = pipe(
    selectedDates.from,
    fromNullable,
    map(fromDate => format(fromDate, yearMonthDayFormat)),
    getOrElse(() => "")
  );
  const time = pipe(
    selectedPickupTime,
    fromNullable,
    map(selectedTime => (selectedTime === "Flexible" ? "" : selectedTime)),
    getOrElse(() => "")
  );

  const selectedPrivateOptionsIds = selectedPrivateOptions.map(option => option.id.toString());

  return {
    date,
    time,
    departureFlex: isFlexible ? "1" : "0",
    adults: adults.toString(),
    teenagers: teenagers.toString(),
    children: children.toString(),
    childrenAges,
    pickupType,
    tourPickup: getTourPickup(pickupType, hasPickup) ? "1" : "0",
    tourId: tourId.toString(),
    pickupPlace,
    pickupPlaceId,
    pickupName: pickupType === TransportPickup.List ? "place_name" : "pickup",
    ...(isPrivate ? { privateOptionsIds: selectedPrivateOptionsIds } : {}),
    livePricingUuid,
    livePricingNonDefaultUuid,
  };
};

export const getExtrasFromSelectedPickupTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  hasPickup: boolean,
  selectedPickupTime?: string
) =>
  pipe(
    findFirstMatchingTime(availableTimes, hasPickup, selectedPickupTime),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map(time => time.extras!),
    getOrElse(() => [] as TourBookingWidgetTypes.Extra[])
  );

export const getSelectedPickupTimeMaxTravelers = (
  availableTimes: TourBookingWidgetTypes.Time[],
  hasPickup: boolean,
  selectedPickupTime?: string
) =>
  pipe(
    findFirstMatchingTime(availableTimes, hasPickup, selectedPickupTime),
    map(time => time.maxNumberOfTravelers),
    getOrElse(() => 0 as number)
  );

export const getSelectedPickupTimeMinTravelers = (
  availableTimes: TourBookingWidgetTypes.Time[],
  hasPickup: boolean,
  selectedPickupTime?: string
) =>
  pipe(
    findFirstMatchingTime(availableTimes, hasPickup, selectedPickupTime),
    map(time => time.minNumberOfTravelers),
    getOrElse(() => 0 as number)
  );

export const constructFormErrors = (
  selectedDates: SharedTypes.SelectedDates,
  transportRequired: boolean,
  transportPickup: TransportPickup,
  selectedTransportLocationName: string,
  availableTimes: TourBookingWidgetTypes.Time[],
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  hasPickup: boolean,
  selectedPickupTime?: string
): BookingWidgetFormError[] => {
  const totalNumberOfTravelers = getTotalNumberOfTravelers(numberOfTravelers);
  return [
    ...(!(selectedDates.from && selectedDates.to) ? [BookingWidgetFormError.EMPTY_DATES] : []),
    ...(transportRequired &&
    selectedTransportLocationName === "" &&
    (transportPickup === TransportPickup.List || transportPickup === TransportPickup.Address)
      ? [BookingWidgetFormError.EMPTY_PICKUP]
      : []),
    ...(getSelectedPickupTimeMaxTravelers(availableTimes, hasPickup, selectedPickupTime) <
    totalNumberOfTravelers
      ? [BookingWidgetFormError.NO_PICKUP_TIME]
      : []),
    ...(getSelectedPickupTimeMinTravelers(availableTimes, hasPickup, selectedPickupTime) >
    totalNumberOfTravelers
      ? [BookingWidgetFormError.MIN_TRAVELERS]
      : []),
  ];
};

export const getPickupLocationId = (transport: PickupTransport, name: string) =>
  pipe(
    transport.places,
    findFirst(place => place.name === name),
    map(({ id }) => id),
    getOrElse(() => 0)
  );

export const getPickupLocationName = (transport: PickupTransport, id: number) =>
  pipe(
    transport.places,
    findFirst(place => place.id === id),
    map(({ name }) => name),
    getOrElse(() => "")
  );

export const getFormErrorText = (
  formErrors: BookingWidgetFormError[],
  t: TFunction,
  minNumberOfTravelers: number
): string => {
  if (formErrors.includes(BookingWidgetFormError.EMPTY_DATES)) {
    return t("Please choose a date");
  }
  if (formErrors.includes(BookingWidgetFormError.NO_PICKUP_TIME)) {
    return t("Selected pick up time is fully booked");
  }
  if (formErrors.includes(BookingWidgetFormError.EMPTY_PICKUP)) return t("Choose pickup location");
  if (formErrors.includes(BookingWidgetFormError.MIN_TRAVELERS)) {
    return t("Minimum {minNumberOfTravelers} person need to be selected", {
      minNumberOfTravelers,
    });
  }
  return t("Please fill in the required fields");
};

export const shouldShowDepartureNote = (
  pickupType: string,
  hasPickup: boolean,
  departureNote?: string
) =>
  Boolean(departureNote) &&
  (!hasPickup || (pickupType !== TransportPickup.Address && pickupType !== TransportPickup.List));

export const getBookingWidgetInitialState = ({
  basePrice,
  transportPickup,
  isTransportRequired,
  lengthOfTour,
  adults,
  teenagers,
  children,
  dateFrom,
  childrenAges,
  isLivePricing,
  selectedTransportLocation,
}: {
  basePrice: number;
  transportPickup: TransportPickup;
  isTransportRequired: boolean;
  lengthOfTour: number;
  adults: number;
  teenagers: number;
  children: number;
  dateFrom?: string;
  childrenAges: number[];
  isLivePricing: boolean;
  selectedTransportLocation?: PickupLocation;
}): BookingWidgetState => ({
  selectedDates: {
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateFrom ? addDays(new Date(dateFrom), lengthOfTour - 1) : undefined,
  },
  datesInitialized: false,
  bookingWidgetView: BookingWidgetView.Default,
  orderBookingWidgetView: OrderBookingWidgetView.TravelInformation,
  numberOfTravelers: { adults, teenagers, children },
  childrenAges,
  selectedPickupTime: undefined,
  selectedTransportLocation: selectedTransportLocation || {
    id: 0,
    name: "",
  },
  price: basePrice,
  availableTimes: { isFlexible: false, times: [] },
  selectedExperiences: [],
  isPriceLoading: true,
  formErrors: [],
  hasPickup: transportPickup !== TransportPickup.NotAvailable,
  discount: none,
  isFullPriceDiscount: false,
  fullPrice: basePrice,
  basePrice,
  transportPickup,
  isTransportRequired,
  options: [],
  optionsInitialized: false,
  extras: [],
  orderPrice: 0,
  contactInformation: {
    name: "",
    email: "",
    phone: "",
    country: "",
  },
  pickupInformation: {
    pickupType: "",
    pickupTime: "",
    pickupAddress: "",
    placeId: 0,
    pickupFlightNumber: "",
    dropoffTime: "",
    dropoffPlaceId: 0,
    dropoffAddress: "",
    dropoffType: "",
    dropoffFlightNumber: "",
    specialRequest: "",
  },
  isPrivate: false,
  availablePrivateOptions: [],
  selectedPrivateOptions: [],
  experiences: [[], [], [], []],
  isLivePricing,
  isLivePricingBasePriceLoaded: false,
});

export const onDateAvailabilityComplete = (
  lengthOfTour: number,
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void,
  dates?: TourBookingWidgetTypes.QueryDates,
  editItem?: TourBookingWidgetTypes.EditItem
) => {
  let selectedDates: SharedTypes.SelectedDates = { from: undefined, to: undefined };
  if (editItem) {
    selectedDates = {
      from: editItem.date,
      to: lengthOfTour > 1 ? addDays(editItem.date, lengthOfTour - 1) : editItem.date,
    };
  }
  if (dates) {
    const lsSelectedDates = getFixedSelectedDatesFromLocalStorage(lengthOfTour);
    if (shouldSetInitalSelectedDates(lsSelectedDates, constructDates(dates))) {
      selectedDates = lsSelectedDates;
    }
  }

  onDateSelection(selectedDates);
};

export const getSelectedPickupTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  previousSelectedPickupTime?: string
) => {
  const totalTravelers = getTotalNumberOfTravelers(numberOfTravelers);
  const stillOldAvailableTime = availableTimes.find(
    time => time.time === previousSelectedPickupTime && time.maxNumberOfTravelers >= totalTravelers
  );
  const nextAvailableTime = pipe(
    availableTimes,
    findFirst(availableTime => availableTime.maxNumberOfTravelers >= totalTravelers),
    map(time => time.time),
    toUndefined
  );
  if (availableTimes.length > 0)
    return stillOldAvailableTime?.time || nextAvailableTime || availableTimes[0].time;
  return undefined;
};

export const getSelectedPickupTimeDepartureTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  selectedPickupTime = ""
) =>
  pipe(
    findFirstMatchingTime(availableTimes, false, selectedPickupTime),
    map(time => time.departureTime),
    getOrElse(() => selectedPickupTime)
  );

export const getSelectedTime = (
  availableTimes: TourBookingWidgetTypes.Time[],
  hasPickup: boolean,
  selectedPickupTime = ""
) =>
  pipe(
    findFirstMatchingTime(availableTimes, hasPickup, selectedPickupTime),
    map(time => time.time),
    getOrElse(() => selectedPickupTime)
  );

export const isValidMobileFormError = (
  formErrors: BookingWidgetFormError[],
  bookingWidgetView: BookingWidgetView
) =>
  formErrors.length > 0 &&
  formErrors.some(
    element =>
      (element === BookingWidgetFormError.EMPTY_DATES &&
        bookingWidgetView === BookingWidgetView.Dates) ||
      (bookingWidgetView !== BookingWidgetView.Dates &&
        (element === BookingWidgetFormError.EMPTY_PICKUP ||
          element === BookingWidgetFormError.NO_PICKUP_TIME ||
          element === BookingWidgetFormError.MIN_TRAVELERS ||
          element === BookingWidgetFormError.EMPTY_ANSWER))
  );

export const travelerText = (
  t: TFunction,
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  lowestPriceGroupSize: number
) => {
  const travelerPriceText = getTravelerPriceText(numberOfTravelers, t);
  if (!numberOfTravelers.adults) {
    if (lowestPriceGroupSize > 1) {
      return t("per person if {lowestPriceGroupSize} travelers", {
        lowestPriceGroupSize,
      });
    }
    return "";
  }
  return travelerPriceText;
};

export const getDropoffType = (dropoffAirportId?: number) => {
  if (dropoffAirportId !== undefined) {
    if (dropoffAirportId === 1) return "package_airport";
    return "package_address";
  }
  return "";
};

export const constructTimeArray = () => {
  const quarterHours = ["00", "30"];
  const times: string[] = [];
  return times.concat(
    ...range(0, 23).map((_, index) =>
      times.concat(
        // eslint-disable-next-line no-shadow
        ...range(0, 1).map((__, i) => {
          if (index < 10) {
            return `0${index}:${quarterHours[i]}`;
          }
          return `${index}:${quarterHours[i]}`;
        })
      )
    )
  );
};

type NumberOfCarsPerId = { [carOptionId: string]: number };
const initializeNumberOfCarsPerId = (
  carOptions: TourBookingWidgetTypes.PrivateOption[]
): NumberOfCarsPerId => {
  return carOptions.reduce((acc: NumberOfCarsPerId, option) => {
    // eslint-disable-next-line functional/immutable-data
    acc[option.id] = 0;
    return acc;
  }, {});
};

const getIndexOfFirstMinimumElement = (elementList: number[]) => {
  let indexOfMinimumElement = 0;
  for (let index = 0; index < elementList.length; index += 1) {
    if (elementList[index] < elementList[indexOfMinimumElement]) {
      indexOfMinimumElement = index;
    }
  }

  return indexOfMinimumElement;
};

export const calculateOptimalAmountOfPrivateOptions = (
  carOptions: TourBookingWidgetTypes.PrivateOption[],
  numberOfTravelers: number,
  numberOfCarsPerCarId?: {
    [carId: string]: number;
  }
): {
  [carId: string]: number;
} => {
  const numberOfCarsPerId = numberOfCarsPerCarId
    ? { ...numberOfCarsPerCarId }
    : initializeNumberOfCarsPerId(carOptions);

  // best option is an option which left less seats after it's been applied to numberOfTravelers
  const seatsLeftPerCarForCurrentNumberOfTravelers = carOptions.map(
    option => numberOfTravelers - option.travellers
  );
  // taking an absolute of difference
  const absoluteOfSeatsLeftPerCar = seatsLeftPerCarForCurrentNumberOfTravelers.map(Math.abs);
  // option with minimum absolute value suites better
  let indexOfBestCarOptionWithMinimumSeatsLeft =
    getIndexOfFirstMinimumElement(absoluteOfSeatsLeftPerCar);

  // if previous car option can take all travellers we have and current option can't we'll
  // prefer option with bigger amount of seats
  const isBestCarOptionIsNotFirstOption = indexOfBestCarOptionWithMinimumSeatsLeft !== 0;
  const seatsInBiggerCar = carOptions[indexOfBestCarOptionWithMinimumSeatsLeft - 1]?.travellers;
  const seatsInSmallerCar = carOptions[indexOfBestCarOptionWithMinimumSeatsLeft].travellers;
  const isBiggerCarCanTakeAllAvailableTravelers =
    isBestCarOptionIsNotFirstOption &&
    numberOfTravelers < seatsInBiggerCar &&
    numberOfTravelers > seatsInSmallerCar;
  if (isBiggerCarCanTakeAllAvailableTravelers) {
    // choose bigger car option
    indexOfBestCarOptionWithMinimumSeatsLeft -= 1;
  }

  // if next car option x 2 can occupy all left travelers we should prefer that
  // instead of current car option with more seats and smaller car
  // ex: We have three options for 8 and 6 and 4 seats. numberOfTravelers is 12
  // we can choose: 1) cars with 8 and 4 seats or 2) two cars with 6 seats.
  // we will take two cars with 6 seats.
  const haveTravelersAfterOptionApplied =
    seatsLeftPerCarForCurrentNumberOfTravelers[indexOfBestCarOptionWithMinimumSeatsLeft] > 0 &&
    indexOfBestCarOptionWithMinimumSeatsLeft !== carOptions.length - 1;
  if (haveTravelersAfterOptionApplied) {
    const nextCarOptionCanFillAllLeftSeatsIfDouble =
      seatsLeftPerCarForCurrentNumberOfTravelers[indexOfBestCarOptionWithMinimumSeatsLeft + 1] ===
      carOptions[indexOfBestCarOptionWithMinimumSeatsLeft + 1].travellers;

    if (nextCarOptionCanFillAllLeftSeatsIfDouble) {
      const betterOption = carOptions[indexOfBestCarOptionWithMinimumSeatsLeft + 1];

      // eslint-disable-next-line functional/immutable-data
      numberOfCarsPerId[betterOption.id] += 2;
      return numberOfCarsPerId;
    }
  }

  const bestCarOption = carOptions[indexOfBestCarOptionWithMinimumSeatsLeft];
  // eslint-disable-next-line functional/immutable-data
  numberOfCarsPerId[bestCarOption.id] += 1;

  const numberOfTravelersLeft =
    seatsLeftPerCarForCurrentNumberOfTravelers[indexOfBestCarOptionWithMinimumSeatsLeft];
  if (numberOfTravelersLeft <= 0) {
    return numberOfCarsPerId;
  }

  return calculateOptimalAmountOfPrivateOptions(
    carOptions,
    numberOfTravelersLeft,
    numberOfCarsPerId
  );
};

const generateSelectedOptionsFromNumberOfOptions = (
  options: TourBookingWidgetTypes.PrivateOption[],
  numberOfOptionsPerOptionId: NumberOfCarsPerId
): TourBookingWidgetTypes.PrivateOption[] => {
  const selectedOptions: TourBookingWidgetTypes.PrivateOption[] = [];

  for (let optionIndex = 0; optionIndex < options.length; optionIndex += 1) {
    const selectedOption = options[optionIndex];
    const optionNumberToRepeat = numberOfOptionsPerOptionId[selectedOption.id] ?? 0;

    // duplicate car options optionNumberToRepeat times
    for (
      let indexOfRepeatedOptions = 0;
      indexOfRepeatedOptions < optionNumberToRepeat;
      indexOfRepeatedOptions += 1
    ) {
      // eslint-disable-next-line functional/immutable-data
      selectedOptions.push(selectedOption);
    }
  }

  return selectedOptions;
};

export const getSelectedPrivateOptions = (
  availablePrivateOptions: TourBookingWidgetTypes.PrivateOption[],
  numberOfTravelers: SharedTypes.NumberOfTravelers
): TourBookingWidgetTypes.PrivateOption[] => {
  if (availablePrivateOptions.length === 0) {
    return [];
  }

  const totalNumberOfTravelers = getTotalNumberOfTravelers(numberOfTravelers);
  const descSortedOptions = [...availablePrivateOptions].sort((optionA, optionB) =>
    optionA.travellers >= optionB.travellers ? -1 : 1
  );

  const numberOfOptionsPerOptionId = calculateOptimalAmountOfPrivateOptions(
    descSortedOptions,
    totalNumberOfTravelers
  );

  const selectedOptions = generateSelectedOptionsFromNumberOfOptions(
    descSortedOptions,
    numberOfOptionsPerOptionId
  );

  return selectedOptions;
};

export const updateSelectedExperiencePrices = (
  experiences: ExperiencesTypes.Experience[][],
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences,
  extras: TourBookingWidgetTypes.Extra[]
) =>
  selectedExperiences.map(experience => {
    // Experiences contains 4 arrays of different types of experiences, we need to get first one for dropdown experiences
    // See sortExperiences util for more details.
    const multiSelectionExperiences = experiences.length
      ? (experiences[0] as unknown as ExperiencesTypes.MultiSelectionExperience[])
      : undefined;
    const currentExperience = multiSelectionExperiences?.find(
      experienceItem => experienceItem.id === experience.experienceId
    );
    const defaultExperienceAnswer = currentExperience?.answers.find(answer => answer.included);
    const selectedExtra = extras.find(extra => extra.id === experience.experienceId);
    const selectedExtrasAnswer = selectedExtra?.options.find(option => {
      const groupExperiences = experience as TourBookingWidgetTypes.SelectedGroupExperience;

      return option.id === groupExperiences.answerId;
    });

    return {
      ...experience,
      ...(checkIsTravelerExperience(experience)
        ? {
            price: selectedExtra ? selectedExtra.price : experience.price,
            discountValue: selectedExtra ? selectedExtra.discountValue : experience.discountValue,
          }
        : {
            prices: selectedExtrasAnswer
              ? [selectedExtrasAnswer.prices[0].price]
              : experience.prices,
            vpPrice:
              selectedExtrasAnswer && defaultExperienceAnswer
                ? {
                    selectedOptionDiff: 0,
                    discountValue: selectedExtrasAnswer.prices[0].discountValue,
                  }
                : {
                    selectedOptionDiff: 0,
                    discountValue: selectedExtrasAnswer
                      ? selectedExtrasAnswer.prices[0].discountValue
                      : undefined,
                  },
          }),
    };
  });

export const normalizeLivePricingCachedData = (
  priceCachedData?: TourBookingWidgetTypes.QueryVpPrices,
  livePriceDefaultOptionsData?: TourBookingWidgetTypes.QueryVpPrices
) =>
  priceCachedData && livePriceDefaultOptionsData
    ? {
        monolithVacationPackage: {
          ...livePriceDefaultOptionsData.monolithVacationPackage,
          price: livePriceDefaultOptionsData.monolithVacationPackage.price,
          options: livePriceDefaultOptionsData.monolithVacationPackage.options.map(
            livePricePackageOptionItem => {
              const cachedResponseRestOptionsItem =
                priceCachedData.monolithVacationPackage.options
                  .find(cachedOption => cachedOption.id === livePricePackageOptionItem.id)
                  ?.items.filter(item => item.id !== livePricePackageOptionItem.items[0].id) || [];

              return {
                ...livePricePackageOptionItem,
                items: livePricePackageOptionItem.items.length
                  ? [livePricePackageOptionItem.items[0], ...cachedResponseRestOptionsItem]
                  : [],
              };
            }
          ),
        },
      }
    : priceCachedData;

export const normalizeLivePricingData = (
  livePriceDefaultOptionsData?: TourBookingWidgetTypes.QueryVpPrices,
  livePriceRestOptionsData?: TourBookingWidgetTypes.QueryVpPrices
) =>
  livePriceRestOptionsData && livePriceDefaultOptionsData
    ? {
        monolithVacationPackage: {
          ...livePriceRestOptionsData.monolithVacationPackage,
          price: livePriceDefaultOptionsData.monolithVacationPackage.price,
          options: livePriceDefaultOptionsData.monolithVacationPackage.options.map(
            packageOptionItem => {
              const restOptionItems =
                livePriceRestOptionsData.monolithVacationPackage.options.find(
                  packageRestOption => packageRestOption.id === packageOptionItem.id
                )?.items || [];

              return {
                ...packageOptionItem,
                items: packageOptionItem.items.length
                  ? [packageOptionItem.items[0], ...restOptionItems]
                  : [],
              };
            }
          ),
        },
      }
    : livePriceDefaultOptionsData;
