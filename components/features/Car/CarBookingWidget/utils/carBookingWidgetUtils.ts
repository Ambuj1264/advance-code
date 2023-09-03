import { BookingWidgetFormError } from "types/enums";
import { getTranslationByKey, getCarnectKey } from "utils/sharedCarUtils";

export const constructCalculateInput = (
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[],
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[]
): {
  // eslint-disable-next-line camelcase
  extras: { id: number; count: number }[];
  insurances: string[];
} => ({
  extras: selectedExtras
    .filter(extra => extra.count > 0)
    .map(({ id, count }) => ({
      id: Number(id),
      count,
    })),
  insurances: selectedInsurances.reduce(
    (insurancesIds, insurance) =>
      insurance.selected ? [...insurancesIds, insurance.code] : insurancesIds,
    [] as Array<string>
  ),
});

export const getFormError = (formErrors: BookingWidgetFormError[], t: TFunction) => {
  if (formErrors.includes(BookingWidgetFormError.EMPTY_ANSWER)) {
    return t("Please fill in the required fields");
  }
  return undefined;
};

export const constructFormError = ({
  selectedExtras,
  pickupSpecify,
  dropoffSpecify,
  isHotelPickup,
  isHotelDropoff,
  isCarnect,
}: {
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  pickupSpecify: string;
  dropoffSpecify: string;
  isHotelPickup?: boolean;
  isHotelDropoff?: boolean;
  isCarnect?: boolean;
}): BookingWidgetFormError[] => {
  const hasSomeEmptyAnswers = selectedExtras.some(extra =>
    extra.questionAnswers.find(question => question.answer === "")
  );
  const notCarnectCar = isCarnect !== undefined && !isCarnect;
  if (
    hasSomeEmptyAnswers ||
    (isHotelPickup && notCarnectCar && pickupSpecify === "") ||
    (isHotelDropoff && notCarnectCar && dropoffSpecify === "")
  ) {
    return [BookingWidgetFormError.EMPTY_ANSWER];
  }
  return [];
};

export const constructPriceBreakdownItems = (
  items: CarBookingWidgetTypes.PriceBreakdownItem[],
  carnectT: TFunction
) =>
  items.map(item => {
    const nameKey = getCarnectKey(item.translationKeys, "name");
    return {
      ...item,
      name: nameKey ? getTranslationByKey(nameKey, carnectT) : item.name,
    };
  });

export const getCarLocationKeyId = (location?: CarTypes.AvailableLocationPickupOrDropOff) =>
  `${location?.locationType}${location?.name}`;
// offer0: Paris Airport => London
// offer1: Paris => London
// offer2: Paris => London Airport
// offer3: Paris => London Train Station
// in 1st dropdown the only one "Paris" should be available
export const getCarUniquePickupLocations = (
  locations?: CarTypes.AvailableLocation[],
  selectedLocation?: CarTypes.AvailableLocation
) => {
  const uniquePickups =
    locations?.reduce((pickups, location) => {
      const key = getCarLocationKeyId(location.pickupLocation);
      if (pickups[key]) return pickups;
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      pickups[key] = location;
      return pickups;
    }, {} as { [key: string]: CarTypes.AvailableLocation }) || {};

  const uniquePickupLocations = Object.values(uniquePickups);

  return uniquePickupLocations?.length
    ? uniquePickupLocations
    : ([selectedLocation] as CarTypes.AvailableLocation[]);
};

// availability of dropoff locations is based on chosen pickup location.
// as they have 1:1 relation, and can't be mixed
// offer1: Paris => London Airport
// offer2: Paris => London Train Station
// offer3: Paris Airport => London Subway Station
// if "Paris" is chosen in pickup location, the dropoff should be displaying dropoffs from offer1 or offer2
// if "Paris Airport" is chosen, the dropoff "London Subway Station" is displayed only
export const getCarTiedReturnLocations = (
  locations?: CarTypes.AvailableLocation[],
  selectedLocation?: CarTypes.AvailableLocation
) => {
  const tiedLocations = locations?.filter(
    loc =>
      loc.pickupLocation.locationType === selectedLocation?.pickupLocation.locationType &&
      loc.pickupLocation.name === selectedLocation.pickupLocation.name
  );

  return tiedLocations?.length
    ? tiedLocations
    : ([selectedLocation] as CarTypes.AvailableLocation[]);
};

export const pickupOrFlightNumber = (car: OrderTypes.QueryCarRental) =>
  car?.pickupSpecify || car?.flightNumber;

const createIdAndCountMap = (preSelectedExtras: OrderTypes.QueryCarCartAddon[] | undefined) => {
  const extraMap = new Map<string, number>();
  preSelectedExtras?.forEach(extra => extraMap.set(extra?.id || "", extra?.count));
  return extraMap;
};

const createExtraItem = (
  extra: CarBookingWidgetTypes.SelectedExtra,
  idAndCountMap: Map<string, number>
) => {
  return {
    id: extra.id || "",
    count: idAndCountMap.get(`${extra.id}`) || 0,
    questionAnswers: extra.questionAnswers,
  };
};

export const setInitializeExtras = (
  extras: CarBookingWidgetTypes.SelectedExtra[],
  preSelectedExtras: OrderTypes.QueryCarCartAddon[] | undefined
) => {
  const extraMap = createIdAndCountMap(preSelectedExtras);
  return extras?.map(extra => createExtraItem(extra, extraMap));
};

const createOnSelectedInsuranceInputs = (insurances: OrderTypes.QueryCarCartAddon[]) =>
  insurances.map(insurance => ({
    id: insurance.id || "",
    selected: insurance.count > 0,
  }));

export const setSelectedInsurces = (
  insurances: OrderTypes.QueryCarCartAddon[],
  setSelectedInsurance: (selectedInsurance: CarBookingWidgetTypes.OnSelectedInsuranceInput) => void
) =>
  createOnSelectedInsuranceInputs(insurances).forEach(element => {
    setSelectedInsurance(element);
  });

export const setSelectedExtras = (
  extras: CarBookingWidgetTypes.SelectedExtra[],
  selectedExtras: OrderTypes.QueryCarCartAddon[],
  setSelectedExtra: (selectedExtra: CarBookingWidgetTypes.SelectedExtra) => void
) => setInitializeExtras(extras, selectedExtras).forEach(element => setSelectedExtra(element));
