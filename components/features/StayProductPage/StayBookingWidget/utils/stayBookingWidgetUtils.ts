import CheckIcon from "@travelshift/ui/icons/checkmark.svg";
import { flatten } from "fp-ts/lib/Array";
import { parse, differenceInDays, format, addDays, max } from "date-fns";
import CloseIcon from "@travelshift/ui/icons/close.svg";

import { OrderStayCancellationType, MealType, RoomType, BedType } from "../types/enums";
import { getRoomAmenities } from "../../utils/stayAmenityUtils";
import { constructAmenities } from "../../utils/stayUtils";

import currencyFormatter from "utils/currencyFormatUtils";
import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import PersonsIcon from "components/icons/travellers.svg";
import BedIcon from "components/icons/hotel-bedroom.svg";
import ShowerIcon from "components/icons/bathroom-shower.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import {
  SupportedLanguages,
  Availability,
  AccommodationCategoryTypes,
  AccommodationCategoryNames,
} from "types/enums";
import {
  getFormattedDate,
  hourMinuteFormat,
  getShortMonthNumbericDateFormat,
  yearMonthDayFormat,
} from "utils/dateUtils";
import BreakfastIcon from "components/icons/coffee-cup.svg";
import MealIcon from "components/icons/restaurant-fork-knife.svg";
import { convertImage, getImgixImageFromGraphCMS } from "utils/imageUtils";
import { getStayAvailabilityName } from "components/ui/LandingPages/utils/productSectionLandingPageUtils";
import {
  getTotalGuests,
  getTotalNumberOfGuests,
} from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

export const getIncludedCancellation = (
  locale: SupportedLanguages,
  t: TFunction,
  cancellationType: OrderStayCancellationType,
  freeCancellationUntil?: Date,
  skipTimeDisplay = true
) => {
  const nonRefundable = [
    {
      Icon: CloseIcon,
      title: t("Non-refundable"),
      isIncluded: false,
      shortTitle: t("No cancellation"),
    },
  ];

  if (
    cancellationType === OrderStayCancellationType.UNKNOWN ||
    cancellationType === OrderStayCancellationType.NON_REFUNDABLE
  )
    return nonRefundable;

  if (cancellationType === OrderStayCancellationType.FREE) {
    return [
      {
        Icon: CheckIcon,
        title: t("Free cancellation"),
        isIncluded: true,
        shortTitle: t("Free cancellation"),
      },
    ];
  }
  if (freeCancellationUntil) {
    const cancellationTime = getFormattedDate(freeCancellationUntil, hourMinuteFormat);
    const title =
      !skipTimeDisplay && cancellationTime !== "00:00"
        ? t("Free cancellation before {date} at {time}", {
            date: getShortMonthNumbericDateFormat(freeCancellationUntil, locale),
            time: cancellationTime,
          })
        : t("Free cancellation before {date}", {
            date: getShortMonthNumbericDateFormat(freeCancellationUntil, locale),
          });
    return [
      {
        Icon: CheckIcon,
        title,
        isIncluded: true,
        shortTitle: t("Conditional cancellation"),
      },
    ];
  }

  return nonRefundable;
};

export const getIncludedMeal = (mealType: MealType, t: TFunction) => {
  switch (mealType) {
    case MealType.ALL_INCLUSIVE:
    case MealType.ALL_INCLUSIVE_LIGHT:
    case MealType.ALL_INCLUSIVE_ULTRA:
      return [
        {
          Icon: MealIcon,
          title: t("All inclusive"),
          isIncluded: true,
          shortTitle: t("All inclusive"),
        },
      ];
    case MealType.DINNER_ONLY:
      return [
        {
          Icon: MealIcon,
          title: t("Dinner included"),
          isIncluded: true,
          shortTitle: t("Dinner"),
        },
      ];
    case MealType.FULL_BOARD:
    case MealType.FULL_BOARD_PLUS:
      return [
        {
          Icon: MealIcon,
          title: t("Full board included"),
          isIncluded: true,
          shortTitle: t("Full board"),
        },
      ];
    case MealType.HALF_BOARD:
    case MealType.HALF_BOARD_PLUS:
      return [
        {
          Icon: MealIcon,
          title: t("Half board included"),
          isIncluded: true,
          shortTitle: t("Half board"),
        },
      ];
    case MealType.LUNCH_ONLY:
      return [
        {
          Icon: MealIcon,
          title: t("Lunch included"),
          isIncluded: true,
          shortTitle: t("Lunch"),
        },
      ];
    case MealType.BED_AND_BREAKFAST:
      return [
        {
          Icon: BreakfastIcon,
          title: t("Breakfast included"),
          isIncluded: true,
          shortTitle: t("Breakfast"),
        },
      ];
    default:
      return [
        {
          Icon: MealIcon,
          title: t("No meal included"),
          isIncluded: false,
          shortTitle: t("No meal"),
        },
      ];
  }
};

const getNumberOfCartSelectedRooms = (
  detailedRoom: StayBookingWidgetTypes.QueryDetailedRoom,
  cartItem?: StayBookingWidgetTypes.CartStay
) => {
  return (
    cartItem?.rooms.reduce((count, item) => {
      if (
        detailedRoom.rates.some(rate =>
          item.roomBookings.some(
            room => (room.mesh || "") === rate.mesh && room.masterRateCode === rate.rateReference
          )
        )
      ) {
        return count + 1;
      }
      return count;
    }, 0 as number) ?? 0
  );
};
const getNumberOfSelectedRooms = (
  suggestedRates: string[],
  room: StayBookingWidgetTypes.QueryDetailedRoom
) =>
  room.rates.reduce((totalRooms, rate) => {
    if (suggestedRates.some(suggested => suggested === rate.mesh)) {
      return totalRooms + 1;
    }
    return totalRooms;
  }, 0 as number);

export const getIncludedItems = (
  locale: SupportedLanguages,
  t: TFunction,
  mealType: MealType,
  cancellationType: OrderStayCancellationType,
  freeCancellationUntil?: Date
) => {
  return [
    ...getIncludedMeal(mealType, t),
    ...getIncludedCancellation(locale, t, cancellationType, freeCancellationUntil),
  ];
};

export const sortRoomTypesByPriceASC = (roomTypes: StayBookingWidgetTypes.RoomType[]) =>
  [...roomTypes].sort((a, b) => (a.fromPriceObject.price > b.fromPriceObject.price ? 1 : -1));

export const getSelectedRoomTypeCount = (roomType: StayBookingWidgetTypes.RoomType) =>
  roomType.roomOffers.reduce(
    (count: number, room: StayBookingWidgetTypes.RoomOffer) =>
      room.isSelected ? count + room.numberOfSelectedRooms : count,
    0 as number
  );

export const getTotalSelectedRoomTypesCount = (roomTypes: StayBookingWidgetTypes.RoomType[]) =>
  roomTypes.reduce(
    (count: number, room: StayBookingWidgetTypes.RoomType) =>
      count + getSelectedRoomTypeCount(room),
    0 as number
  );

export const getRoomTypePrice = (fromPrice: number, roomType: StayBookingWidgetTypes.RoomType) => {
  const price = roomType.roomOffers.reduce(
    (totalPrice: number, room: StayBookingWidgetTypes.RoomOffer) => {
      if (room.isSelected) {
        return totalPrice + room.numberOfSelectedRooms * room.priceObject.price;
      }
      return totalPrice;
    },
    0 as number
  );
  if (price === 0) {
    return fromPrice;
  }
  return price;
};

export const getTotalPrice = (roomTypes: StayBookingWidgetTypes.RoomType[]) => {
  const roomTypePrice = roomTypes.reduce(
    (totalPrice: number, roomType: StayBookingWidgetTypes.RoomType) => {
      return totalPrice + getRoomTypePrice(0, roomType);
    },
    0 as number
  );
  return roomTypePrice;
};

export const getCancellationLabel = (
  policy: StayBookingWidgetTypes.CancellationPolicy,
  locale: SupportedLanguages
) => {
  const dateTo = new Date(policy.dateTo);
  return `Cancellation before ${getShortMonthNumbericDateFormat(
    dateTo,
    locale
  )} at ${getFormattedDate(dateTo, hourMinuteFormat)}`;
};

export const getPriceSubtext = (
  price: number,
  occupancies: StayBookingWidgetTypes.Occupancy[],
  { from, to }: SharedTypes.SelectedDates,
  t: TFunction
) => {
  if (price === 0 || !from || !to) {
    return "";
  }
  const totalGuests = getTotalNumberOfGuests(occupancies);
  const totalNights = differenceInDays(
    new Date(to).setHours(0, 0, 0, 0),
    new Date(from).setHours(0, 0, 0, 0)
  );
  return t("Price for {totalGuests} guests, {totalNights} nights", {
    totalGuests,
    totalNights,
  });
};

export const getRoomTypeGuests = (roomType: StayBookingWidgetTypes.RoomType) =>
  roomType.roomOffers.reduce((totalGuests: number, room: StayBookingWidgetTypes.RoomOffer) => {
    if (room.isSelected) {
      return totalGuests + room.numberOfSelectedRooms * (roomType.numberOfPersons || 2);
    }
    return totalGuests;
  }, 0 as number);

export const getTotalGuestsInRooms = (roomTypes: StayBookingWidgetTypes.RoomType[]) =>
  roomTypes.reduce((totalGuests: number, roomType: StayBookingWidgetTypes.RoomType) => {
    return totalGuests + getRoomTypeGuests(roomType);
  }, 0 as number);

const getNumberOfGuestsNotInARoom = (
  roomTypes: StayBookingWidgetTypes.RoomType[],
  roomCombinations: StayBookingWidgetTypes.RoomCombination[],
  occupancies: StayBookingWidgetTypes.Occupancy[]
) => {
  const hasRoomCombinationSelected = roomCombinations.some(
    roomCombination => roomCombination.isSelected
  );
  if (hasRoomCombinationSelected) {
    return 0;
  }
  const totalGuestsInSelectedRooms = getTotalGuestsInRooms(roomTypes);
  const numberOfGuests = getTotalGuests(occupancies);
  const totalGuests = numberOfGuests.numberOfAdults + numberOfGuests.childrenAges.length;
  return Math.max(totalGuests - totalGuestsInSelectedRooms, 0);
};

export const getFormErrorText = (
  selectedDates: SharedTypes.SelectedDates,
  price: number,
  roomTypes: StayBookingWidgetTypes.RoomType[],
  roomCombinations: StayBookingWidgetTypes.RoomCombination[],
  occupancies: StayBookingWidgetTypes.Occupancy[],
  t: TFunction
): string | undefined => {
  if (!selectedDates.from || !selectedDates.to) {
    return t("Please choose a check in date");
  }
  if (price === 0) {
    return t("Please select at least one room");
  }
  const missingGuests = getNumberOfGuestsNotInARoom(roomTypes, roomCombinations, occupancies);
  if (missingGuests > 0) {
    return t("You still need to fit {numberOfGuests} more guests", {
      numberOfGuests: missingGuests,
    });
  }
  return undefined;
};

export const constructGuestsAndRooms = (
  guests: SharedTypes.NumberOfGuests,
  onlyGuestSelection: boolean
) => {
  const onlyRooms: SharedTypes.RoomGuestGroup[] = [
    {
      id: "rooms",
      defaultNumberOfType: 1,
    },
  ];
  const defaultNumberOfPersonRoomType = (guest: string) => {
    if (guest === "adults") return 2;
    return 0;
  };
  const onlyGuests = Object.keys(guests).map(guest => {
    return {
      id: guest,
      defaultNumberOfType: defaultNumberOfPersonRoomType(guest),
      type: guest as SharedTypes.GuestType,
    };
  });
  if (onlyGuestSelection) {
    return onlyGuests;
  }
  return [...onlyGuests, ...onlyRooms];
};

// Recusively searches for the first unavailable after the fromDate by adding 1 day to the date. If we find that date we return that date which will then be removed
// If we don't we keep recursing untill we have passed got a bigger date than the last unavailableDate in the unavailableDate array.
const recursivelySearchForFirstUnavailableDate = (
  currentDate: Date,
  unavailableDates: string[]
): string | null => {
  const newDateString = format(addDays(currentDate, 1), yearMonthDayFormat);
  const newDate = new Date(newDateString);
  if (unavailableDates.includes(newDateString)) {
    return newDateString;
  }

  if (
    !unavailableDates[unavailableDates.length - 1] ||
    differenceInDays(newDate, new Date(unavailableDates[unavailableDates.length - 1])) > 0
  ) {
    return null;
  }
  return recursivelySearchForFirstUnavailableDate(newDate, unavailableDates);
};

export const getUnavailableDates = ({
  selectedDates,
  unavailableDates,
}: {
  selectedDates?: SharedTypes.SelectedDates;
  unavailableDates: string[];
}) => {
  if (!selectedDates?.from || (selectedDates?.from && selectedDates?.to)) return unavailableDates;
  const dateToRemove = recursivelySearchForFirstUnavailableDate(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectedDates.from!,
    unavailableDates
  );
  return unavailableDates.filter(date => date !== dateToRemove);
};

export const constructDates = (
  { min, max: maxDate, unavailableDates }: StayBookingWidgetTypes.AvailableDates,
  selectedDates?: SharedTypes.SelectedDates,
  isAdmin = false
): SharedTypes.Dates => {
  const today = new Date();
  const minDate = min ? new Date(min) : today;
  const formattedMinDate = getFormattedDate(max([minDate, today]), yearMonthDayFormat);
  return {
    min: !isAdmin && min ? parse(formattedMinDate, yearMonthDayFormat, new Date()) : undefined,
    max: maxDate ? parse(maxDate, yearMonthDayFormat, new Date()) : undefined,
    unavailableDates: getUnavailableDates({
      selectedDates,
      unavailableDates,
    }).map(date => parse(date, yearMonthDayFormat, new Date())),
  };
};

export const getRoomTypeId = (name: string, roomType: RoomType) =>
  `${roomType}-${name.replace(/ /g, "-")}`;

export const getRoomOfferReference = (reference: string, mesh: string) => `${reference}-${mesh}`;

export const constructGroupedRatesToStayData = (
  t: TFunction,
  groupedRates: StayBookingWidgetTypes.QueryGroupedRate[],
  suggestedRates: string[],
  rooms: StayTypes.Room[],
  cartItem?: StayBookingWidgetTypes.CartStay
): StayBookingWidgetTypes.RoomType[] =>
  sortRoomTypesByPriceASC(
    groupedRates.map(groupedRate => {
      const sameRoom = rooms.find(room => room.name === groupedRate.title);
      const [roomRate] = groupedRate.detailedRooms[0].rates[0].roomRates;
      const { roomType } = roomRate.room[0];
      return {
        roomTypeId: getRoomTypeId(groupedRate.title, roomType),
        roomTypeName: groupedRate.title,
        roomType,
        fromPriceObject: {
          price: groupedRate.fromPrice,
          currency: groupedRate.detailedRooms[0].rates[0].price.currency,
          priceDisplayValue: currencyFormatter(groupedRate.fromPrice) || "",
        },
        totalAvailableRooms: groupedRate.maxAvailableRooms,
        images: sameRoom?.images ?? [],
        numberOfPersons: groupedRate.maxOccupancy,
        productSpecs: sameRoom?.information ?? [],
        roomDetails: constructAmenities(t, sameRoom?.roomDetails ?? []),
        roomOffers: groupedRate.detailedRooms.map(room => {
          const dateFrom = room.rates[0].cancellationPolicies?.[0]?.dateFrom ?? undefined;
          const numberOfSelectedRooms = cartItem
            ? getNumberOfCartSelectedRooms(room, cartItem)
            : getNumberOfSelectedRooms(suggestedRates, room);
          return {
            roomOfferName: room.rates[0].roomRates[0].roomRateName,
            roomOfferRateReference: getRoomOfferReference(
              room.rates[0].rateReference,
              room.rates[0].mesh
            ),
            availableRooms: room.availableRooms,
            priceObject: {
              price: room.rates[0].price.value,
              currency: room.rates[0].price.currency,
              priceDisplayValue: currencyFormatter(room.rates[0].price.value) || "",
            },
            mealType: room.rates[0].roomRates[0].meal.mealType,
            cancellationType: room.rates[0].roomRates[0].cancellationType,
            freeCancellationUntil: dateFrom ? new Date(dateFrom) : undefined,
            availabilityIds: room.rates.map(rate => rate.mesh),
            isSelected: numberOfSelectedRooms > 0,
            numberOfSelectedRooms,
          };
        }),
      };
    })
  );

const getBedTypeTitle = (bedType: BedType, t: TFunction) => {
  switch (bedType) {
    case BedType.DOUBLE:
      return t("Double bed");
    case BedType.SINGLE:
      return t("Single bed");
    case BedType.KING:
      return t("King size bed");
    case BedType.QUEEN:
      return t("Queen size bed");
    default:
      return t("bed");
  }
};

const getBedTypeValue = (beds: StayBookingWidgetTypes.QueryRoomBed[], t: TFunction) =>
  beds.map(bed => `${bed.count}x ${getBedTypeTitle(bed.bedType, t)}`).join(", ");

const constructRoomProductSpecs = (
  t: TFunction,
  beds: StayBookingWidgetTypes.QueryRoomBed[],
  wifiAvailability?: Availability,
  numberOfPersons?: number,
  roomSize?: number,
  privateShower?: boolean
) => {
  return [
    ...(numberOfPersons
      ? [
          {
            Icon: PersonsIcon,
            value: t("{numberOfPersons} persons", { numberOfPersons }),
          },
        ]
      : []),
    ...(roomSize
      ? [
          {
            Icon: RoomSizeIcon,
            value: t("{roomSize}m\u00B2", { roomSize }),
          },
        ]
      : []),
    ...(beds.length > 0
      ? [
          {
            Icon: BedIcon,
            value: getBedTypeValue(beds, t),
          },
        ]
      : []),
    {
      Icon: ShowerIcon,
      value: privateShower ? t("Private") : t("Shared"),
    },
    ...(wifiAvailability
      ? [
          {
            Icon: WifiIcon,
            value: getStayAvailabilityName(wifiAvailability, t),
          },
        ]
      : []),
  ];
};

const handleRoomImage = (image: SharedTypes.GraphCMSAsset) => {
  const { id, handle, caption } = image;
  const imageHasUrl = handle?.includes("http://") || handle?.includes("https://");
  if (imageHasUrl) {
    const queryImage: QueryImage = {
      id,
      url: handle,
      name: caption,
    };
    return convertImage(queryImage);
  }
  return getImgixImageFromGraphCMS(image);
};

const handleRoomImages = (images: SharedTypes.GraphCMSAsset[]) =>
  images.map(image => handleRoomImage(image)).filter(image => image !== undefined);

const getRoomCombinationBedTypes = (
  bedTypes: StayBookingWidgetTypes.QueryRoomBed[],
  currentBeds: StayBookingWidgetTypes.QueryRoomBed[]
) => {
  if (bedTypes.length === 0) return currentBeds;
  return currentBeds.reduce((combinedBeds, currentBed) => {
    const alreadyHasBed = combinedBeds.find(bed => bed.bedType === currentBed.bedType);
    if (alreadyHasBed) {
      return combinedBeds.map(bed => {
        if (bed.bedType === currentBed.bedType) {
          return {
            ...bed,
            count: bed.count + currentBed.count,
          };
        }
        return bed;
      });
    }
    return [...combinedBeds, currentBed];
  }, bedTypes as StayBookingWidgetTypes.QueryRoomBed[]);
};

export const constructRoomCombinationProductSpecs = (
  rooms: StayBookingWidgetTypes.QueryRoomCombinationRoom[],
  t: TFunction
) => {
  const combinedSpecValues = rooms.reduce(
    (
      { numberOfPersons, numberOfRooms, bedTypes, roomSizes, privateShowers, wifiAvailabilities },
      room
    ) => {
      const {
        numberOfPersons: nrOfPersons = 0,
        roomSize = 0,
        privateShower = false,
        beds = [],
        wifiAvailability = Availability.NOT_AVAILABLE,
      } = room;
      return {
        numberOfPersons: numberOfPersons + nrOfPersons,
        numberOfRooms: numberOfRooms + 1,
        bedTypes: getRoomCombinationBedTypes(beds, bedTypes),
        roomSizes: [...roomSizes, roomSize],
        privateShowers: [...privateShowers, privateShower],
        wifiAvailabilities: [...wifiAvailabilities, wifiAvailability],
      };
    },
    {
      numberOfPersons: 0 as number,
      numberOfRooms: 0 as number,
      bedTypes: [] as StayBookingWidgetTypes.QueryRoomBed[],
      roomSizes: [] as number[],
      privateShowers: [] as boolean[],
      wifiAvailabilities: [] as Availability[],
    }
  );

  const roomSizeValue = combinedSpecValues.roomSizes
    .filter(size => size > 0)
    .map(roomSize => t("{roomSize}m\u00B2", { roomSize }))
    .join(" + ");
  const bedTypeValue = getBedTypeValue(combinedSpecValues.bedTypes, t);
  const privateShowerValue = combinedSpecValues.privateShowers
    .map(privateShower => (privateShower ? t("Private") : t("Shared")))
    .join(", ");
  const wifiAvailabilityValue = combinedSpecValues.wifiAvailabilities
    .map(wifi => getStayAvailabilityName(wifi, t))
    .join(", ");
  return [
    ...(combinedSpecValues.numberOfPersons > 0
      ? [
          {
            Icon: PersonsIcon,
            value: t(`{numberOfPersons} persons, {numberOfRooms} rooms`, {
              numberOfPersons: combinedSpecValues.numberOfPersons,
              numberOfRooms: combinedSpecValues.numberOfRooms,
            }),
          },
        ]
      : []),
    ...(roomSizeValue !== ""
      ? [
          {
            Icon: RoomSizeIcon,
            value: roomSizeValue,
          },
        ]
      : []),
    ...(combinedSpecValues.bedTypes.length > 0
      ? [
          {
            Icon: BedIcon,
            value: bedTypeValue,
          },
        ]
      : []),
    {
      Icon: ShowerIcon,
      value: privateShowerValue,
    },
    {
      Icon: WifiIcon,
      value: wifiAvailabilityValue,
    },
  ];
};

export const getRoomCombinationTitle = (
  roomCombination: StayBookingWidgetTypes.QueryRoomCombination
) => {
  const rooms = roomCombination.rooms.reduce(
    (totalRooms, currentRoom) => {
      const alreadyHasRoom = totalRooms.find(room => room.roomName === currentRoom.roomName);
      if (alreadyHasRoom) {
        return totalRooms.map(room => {
          if (room.roomName === currentRoom.roomName) {
            return {
              ...room,
              nrOfRooms: room.nrOfRooms + 1,
            };
          }
          return room;
        });
      }
      return [
        ...totalRooms,
        {
          roomName: currentRoom.roomName,
          nrOfRooms: 1,
        },
      ];
    },
    [] as {
      roomName: string;
      nrOfRooms: number;
    }[]
  );
  const roomNameArray = rooms.map(room => {
    if (room.nrOfRooms > 1) {
      return `${room.nrOfRooms}x ${room.roomName}`;
    }
    return room.roomName;
  });
  return roomNameArray.join(" + ");
};

export const constructRoomCombinationImages = (
  rooms: StayBookingWidgetTypes.QueryRoomCombinationRoom[]
) => {
  const queryImages = flatten(
    rooms
      .map((room: StayBookingWidgetTypes.QueryRoomCombinationRoom) => room.images)
      .filter(image => Boolean(image))
  );
  return handleRoomImages(queryImages);
};

const getRoomCombinationId = (
  queryRoomCombination: StayBookingWidgetTypes.QueryRoomCombination
) => {
  const roomNameIdArray = queryRoomCombination.rooms.map(room => room.roomName.replace(" ", "-"));
  return roomNameIdArray.join("-");
};

export const constructRoomCombinations = (
  queryRoomCombinations: StayBookingWidgetTypes.QueryRoomCombination[],
  t: TFunction
) =>
  queryRoomCombinations.map(queryRoomCombination => {
    const isSelected = queryRoomCombination.availabilities.some(
      availability => availability.isSelected
    );
    return {
      roomCombinationId: getRoomCombinationId(queryRoomCombination),
      title: getRoomCombinationTitle(queryRoomCombination),
      images: constructRoomCombinationImages(queryRoomCombination.rooms),
      productSpecs: constructRoomCombinationProductSpecs(queryRoomCombination.rooms, t),
      isSelected,
      rooms: queryRoomCombination.rooms.map(room => {
        const {
          numberOfPersons,
          roomSize,
          privateShower,
          wifiAvailability,
          beds,
          images,
          amenities,
        } = room;
        return {
          roomName: room.roomName,
          images: handleRoomImages(images),
          numberOfPersons,
          productSpecs: constructRoomProductSpecs(
            t,
            beds || [],
            wifiAvailability,
            numberOfPersons,
            roomSize,
            privateShower
          ),
          roomDetails: getRoomAmenities(amenities || [], t),
        };
      }),
      availabilities: queryRoomCombination.availabilities
        .map(availability => ({
          ...availability,
          freeCancellationUntil: availability.freeCancellationUntil
            ? new Date(availability.freeCancellationUntil)
            : undefined,
        }))
        .sort((a, b) => a.priceObject.price - b.priceObject.price),
    };
  });

export const constructStaticRooms = (
  queryStaticRooms: StayBookingWidgetTypes.QueryStaticRoom[],
  t: TFunction
) =>
  queryStaticRooms.map(room => ({
    roomTypeId: getRoomTypeId(room.roomTypeName, room.roomType),
    roomTypeName: room.roomTypeName,
    roomType: room.roomType,
    images: handleRoomImages(room.roomTypeInfo.images),
    productSpecs: constructRoomProductSpecs(
      t,
      room.roomTypeInfo.beds,
      room.roomTypeInfo.wifiAvailability,
      room.roomTypeInfo.numberOfPersons,
      room.roomTypeInfo.roomSize,
      room.roomTypeInfo.privateShower
    ),
    roomDetails: getRoomAmenities(room.roomTypeInfo.amenities, t),
  }));

export const getAccommodationTitle = (categoryId: number | undefined) => {
  if (categoryId === AccommodationCategoryTypes.COTTAGE) return AccommodationCategoryNames.COTTAGE;
  if (categoryId === AccommodationCategoryTypes.APARTMENT)
    return AccommodationCategoryNames.APARTMENT;
  return "Select rooms";
};

export const getSelectedRoomCombinationPrice = (
  roomCombinations: StayBookingWidgetTypes.RoomCombination[]
) => {
  const selectedRoomCombination = roomCombinations.find(
    (roomCombination: StayBookingWidgetTypes.RoomCombination) => roomCombination.isSelected
  );
  return selectedRoomCombination
    ? selectedRoomCombination.availabilities.find(
        (availability: StayBookingWidgetTypes.RoomCombinationAvailability) =>
          availability.isSelected
      )
    : undefined;
};
