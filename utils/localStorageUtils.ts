import { addDays, isValid, fromUnixTime, isBefore } from "date-fns";
import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, map, none, some, chain, toUndefined, fold } from "fp-ts/lib/Option";

export const lsKeyGuestsChildrenAges = "travelshift-guestsChildrenAges";
export const lsKeyNumberOfAdults = "travelshift-numberOfAdults";
export const lsKeyStartDate = "travelshift-startDate";
export const lsKeyEndDate = "travelshift-endDate";
export const lsKeyNumberOfRooms = "travelshift-numberOfRooms";
export const lsKeyDriverAge = "travelshift-driverAge";
export const lsKeyDriverCountry = "travelshift-driverCountry";
export const lsKeyListLayout = "travelshift-listLayout";
export const lsKeyActiveTab = "travelshift-activeTab";
export const lsKeyPickupLocationId = "travelshift-pickupLocationId";
export const lsKeyDropoffLocationId = "travelshift-dropoffLocationId";
export const lsKeyPickupGeoLocation = "travelshift-pickupGeoLocation";
export const lsKeyDropoffGeoLocation = "travelshift-dropoffGeoLocation";
export const lsKeyPickupLocationName = "travelshift-pickupLocationName";
export const lsKeyDropoffLocationName = "travelshift-dropoffLocationName";
export const lsKeyAccommodationLocation = "travelshift-accommodation-location";
export const lsKeyToursLocation = "travelshift-tours-location";
export const lsKeyVpDestinationLocation = "travelshift-vp-destination-location";
export const lsKeyVpIncludesFlight = "travelshift-vp-includes-flight";

export const isLocalStorageAvailable = () => {
  let storage;
  if (typeof window === "undefined") return false;
  try {
    storage = window.localStorage;
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

export const getNumberOfChildren = (travelerAges: number[], maxAge: number) =>
  travelerAges.filter(age => age < maxAge + 1).length;

export const getNumberOfTeenagers = (travelerAges: number[], minAge: number, maxAge: number) =>
  travelerAges.filter(age => age > minAge && age < maxAge + 1).length;

export const getNumberOfAdults = (adults: number, travelerAges: number[], minAge: number) =>
  adults + travelerAges.filter(age => age > minAge).length;

export const getTravelersFromLocalStorage = ({
  childrenMaxAge,
  teenagerMaxAge,
}: {
  childrenMaxAge?: number;
  teenagerMaxAge?: number;
}): SharedTypes.NumberOfTravelers => {
  if (!isLocalStorageAvailable()) {
    return { adults: 0, teenagers: 0, children: 0 };
  }
  const travelerAges: number[] = JSON.parse(
    window.localStorage.getItem(lsKeyGuestsChildrenAges) || "[]"
  );
  const adults: number = getNumberOfAdults(
    Number(window.localStorage.getItem(lsKeyNumberOfAdults)),
    travelerAges,
    teenagerMaxAge || childrenMaxAge || 0
  );
  const hasChildrenMaxAgeNumber = Number.isInteger(<number>childrenMaxAge);
  const teenagers =
    hasChildrenMaxAgeNumber && Number.isInteger(<number>teenagerMaxAge)
      ? getNumberOfTeenagers(travelerAges, childrenMaxAge!, teenagerMaxAge!)
      : 0;
  const children = hasChildrenMaxAgeNumber ? getNumberOfChildren(travelerAges, childrenMaxAge!) : 0;
  return {
    adults,
    teenagers,
    children,
  };
};

export const getDateFromLocalStorageString = (dateString: string | null) =>
  pipe(
    dateString,
    fromNullable,
    map(date => (date ? fromUnixTime(Number(date) / 1000) : undefined)),
    chain(date => (isValid(date) ? some(date) : none))
  );

export const getSelectedDatesFromLocalStorage = (): SharedTypes.SelectedDates => {
  if (!isLocalStorageAvailable()) {
    return { from: undefined, to: undefined };
  }

  const from = pipe(window.localStorage.getItem(lsKeyStartDate), getDateFromLocalStorageString);

  const to = pipe(window.localStorage.getItem(lsKeyEndDate), getDateFromLocalStorageString);

  return {
    from: toUndefined(from),
    to: toUndefined(to),
  };
};

export const getFixedSelectedDatesFromLocalStorage = (
  fixedLength: number
): SharedTypes.SelectedDates => {
  if (!isLocalStorageAvailable()) {
    return { from: undefined, to: undefined };
  }

  const from = pipe(window.localStorage.getItem(lsKeyStartDate), getDateFromLocalStorageString);
  const to = pipe(
    from,
    chain(date => {
      if (date) {
        return fixedLength > 1 ? some(addDays(date, fixedLength - 1)) : none;
      }
      return none;
    }),
    fold(
      () => from,
      date => some(date)
    )
  );

  return {
    from: toUndefined(from),
    to: toUndefined(to),
  };
};

export const getStringifiedChildrenTeenagerAges = (
  numberOfTeens: number,
  numberOfChildren: number,
  teenMaxAge: number,
  childMaxAge: number
) => {
  const teenAges = new Array(numberOfTeens).fill(teenMaxAge);
  const childAges = new Array(numberOfChildren).fill(childMaxAge);
  return JSON.stringify(teenAges.concat(childAges));
};

export const setTravelersInLocalStorage = (
  numberOfTravelers: SharedTypes.NumberOfTravelers,
  travelerType: SharedTypes.TravelerType,
  newValue: number,
  { childrenMaxAge, teenagerMaxAge }: { childrenMaxAge: number; teenagerMaxAge: number }
) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  const { teenagers, children } = numberOfTravelers;
  switch (travelerType) {
    case "adults":
      window.localStorage.setItem(lsKeyNumberOfAdults, newValue.toString());
      break;
    case "teenagers":
      window.localStorage.setItem(
        lsKeyGuestsChildrenAges,
        getStringifiedChildrenTeenagerAges(newValue, children, teenagerMaxAge, childrenMaxAge)
      );
      break;
    case "children":
      window.localStorage.setItem(
        lsKeyGuestsChildrenAges,
        getStringifiedChildrenTeenagerAges(teenagers, newValue, teenagerMaxAge, childrenMaxAge)
      );
      break;
    default:
      break;
  }
};

export const setDatesInLocalStorage = ({ from, to }: SharedTypes.SelectedDates) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  if (from) {
    window.localStorage.setItem(lsKeyStartDate, from.getTime().toString());
  }
  if (to) {
    window.localStorage.setItem(lsKeyEndDate, to.getTime().toString());
  }
};

export const writeTravelersUrlParamToLocalStorage = (maxAges: {
  childrenMaxAge: number;
  teenagerMaxAge: number;
}) => {
  const urlParams = window.location.search.substring(1).split("&");
  const [shouldPushToLocalStorage, travelers] = urlParams.reduce(
    ([accumlatedShouldPushToLocalStorage, accumalatedTravelers], urlParam) => {
      const [key, value] = urlParam.split("=");
      if (key === "adults" || key === "teenagers" || key === "children") {
        const numberOfTravellerType = Number(value);
        if (!Number.isNaN(numberOfTravellerType)) {
          if (key === "adults") {
            window.localStorage.setItem(lsKeyNumberOfAdults, value);
            return [
              accumlatedShouldPushToLocalStorage,
              { ...accumalatedTravelers, [key]: numberOfTravellerType },
            ];
          }
          return [true, { ...accumalatedTravelers, [key]: numberOfTravellerType }];
        }
      }
      return [accumlatedShouldPushToLocalStorage, accumalatedTravelers];
    },
    [false, { adults: 0, children: 0, teenagers: 0 }]
  );
  if (travelers.adults > 0) {
    setTravelersInLocalStorage(
      travelers,
      "children",
      shouldPushToLocalStorage ? travelers.children : 0,
      maxAges
    );
  }
};

export const writeDateUrlParamToLocalStorage = (dateFrom?: string) => {
  const dateToWrite = dateFrom ? new Date(dateFrom) : undefined;
  if (dateFrom && isValid(dateToWrite)) {
    setDatesInLocalStorage({ from: dateToWrite, to: undefined });
  }
};

export const getNumberOfRoomsFromLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }
  return Number(window.localStorage.getItem(lsKeyNumberOfRooms));
};

export const setNumberOfRoomsInLocalStorage = (value: number) => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(lsKeyNumberOfRooms, value.toString());
  }
};

export const setNumberOfGuestsInLocalStorage = ({
  adults,
  children,
}: SharedTypes.NumberOfGuests) => {
  if (isLocalStorageAvailable()) {
    window.localStorage.setItem(lsKeyNumberOfAdults, adults.toString());
    window.localStorage.setItem(lsKeyGuestsChildrenAges, JSON.stringify(children));
  }
  return Number(window.localStorage.getItem(lsKeyNumberOfRooms));
};

export const getGuestsFromLocalStorage = (): SharedTypes.NumberOfGuests => {
  if (!isLocalStorageAvailable()) {
    return { adults: 0, children: [] };
  }
  const adults = Number(window.localStorage.getItem(lsKeyNumberOfAdults));
  const children = JSON.parse(window.localStorage.getItem(lsKeyGuestsChildrenAges) || "[]");
  const childrenAges = children ? children.map((child: string) => Number(child)) : [];
  return {
    adults,
    children: childrenAges,
  };
};

export const setDriverAgeInLocalStorage = (driverAge: string) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  window.localStorage.setItem(lsKeyDriverAge, driverAge);
};

export const setDriverCountryInLocalStorage = (driverCountry: string) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  window.localStorage.setItem(lsKeyDriverCountry, driverCountry);
};

export const getDriverAgeFromLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return 45;
  }
  return Number(window.localStorage.getItem(lsKeyDriverAge));
};

export const getDriverCountryFromLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return undefined;
  }
  return window.localStorage.getItem(lsKeyDriverCountry);
};

export const clearDatesInLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return undefined;
  }
  window.localStorage.removeItem(lsKeyStartDate);
  return window.localStorage.removeItem(lsKeyEndDate);
};

export const clearEndDateInLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return undefined;
  }
  return window.localStorage.removeItem(lsKeyEndDate);
};

export const getAdjustedDatesInLocalStorage = (
  currentDate: Date = new Date()
): SharedTypes.SelectedDates => {
  if (!isLocalStorageAvailable()) {
    return { from: undefined, to: undefined };
  }

  const { from, to } = getSelectedDatesFromLocalStorage();
  const currentDateWithoutTime = currentDate.setHours(0, 0, 0, 0);

  // clear out of dates
  if (
    (from && isBefore(from, currentDateWithoutTime)) ||
    (to && isBefore(to, currentDateWithoutTime)) ||
    (from && to && isBefore(to, from))
  ) {
    clearDatesInLocalStorage();
    return { from: undefined, to: undefined };
  }

  return { from, to };
};

export const setListLayoutInLocalStorage = (lsKey: string, activeLayout: string) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  window.localStorage.setItem(lsKey, activeLayout);
};

export const getListLayoutFromLocalStorage = (lsKey: string) => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  return window.localStorage.getItem(lsKey);
};

export const setActiveTabInLocalStorage = (activeTab: string) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  window.localStorage.setItem(lsKeyActiveTab, activeTab);
};

export const getActiveTabFromLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  return window.localStorage.getItem(lsKeyActiveTab);
};

export const setFlightsTravellersInLocalstorage = ({
  newValue,
  passengerType,
  infantMaxAge,
  childrenMaxAge,
  numberOfChildren,
  numberOfInfants,
}: {
  newValue: number;
  passengerType: string;
  childrenMaxAge: number;
  infantMaxAge: number;
  numberOfChildren: number;
  numberOfInfants: number;
}) => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  switch (passengerType) {
    case "adults":
      window.localStorage.setItem(lsKeyNumberOfAdults, newValue.toString());
      break;
    case "children":
      window.localStorage.setItem(
        lsKeyGuestsChildrenAges,
        getStringifiedChildrenTeenagerAges(newValue, numberOfInfants, childrenMaxAge, infantMaxAge)
      );
      break;
    case "infants":
      window.localStorage.setItem(
        lsKeyGuestsChildrenAges,
        getStringifiedChildrenTeenagerAges(numberOfChildren, newValue, childrenMaxAge, infantMaxAge)
      );
      break;
    default:
      break;
  }
};

export const setPickUpDropOffLocations = ({
  pickupId,
  dropoffId,
  pickupGeoLocation,
  dropoffGeoLocation,
  pickupLocationName,
  dropoffLocationName,
}: {
  pickupId?: string;
  dropoffId?: string;
  pickupGeoLocation?: string;
  dropoffGeoLocation?: string;
  pickupLocationName?: string;
  dropoffLocationName?: string;
}) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  if (pickupId) window.localStorage.setItem(lsKeyPickupLocationId, pickupId);
  if (dropoffId) window.localStorage.setItem(lsKeyDropoffLocationId, dropoffId);
  if (pickupGeoLocation) window.localStorage.setItem(lsKeyPickupGeoLocation, pickupGeoLocation);
  if (dropoffGeoLocation) window.localStorage.setItem(lsKeyDropoffGeoLocation, dropoffGeoLocation);
  if (pickupLocationName) window.localStorage.setItem(lsKeyPickupLocationName, pickupLocationName);
  if (dropoffLocationName)
    window.localStorage.setItem(lsKeyDropoffLocationName, dropoffLocationName);
};

export const getPickUpDropOffLocations = () => {
  if (!isLocalStorageAvailable()) {
    return {
      pickupId: undefined,
      dropoffId: undefined,
      carPickupGeoLocation: undefined,
      carDropoffGeoLocation: undefined,
      pickupLocationName: undefined,
      dropoffLocationName: undefined,
    };
  }

  return {
    pickupId: window.localStorage.getItem(lsKeyPickupLocationId),
    dropoffId: window.localStorage.getItem(lsKeyDropoffLocationId),
    carPickupGeoLocation: window.localStorage.getItem(lsKeyPickupGeoLocation),
    carDropoffGeoLocation: window.localStorage.getItem(lsKeyDropoffGeoLocation),
    pickupLocationName: window.localStorage.getItem(lsKeyPickupLocationName),
    dropoffLocationName: window.localStorage.getItem(lsKeyDropoffLocationName),
  };
};

export const setAccommodationLocation = (location?: AccommodationSearchTypes.LocationObject) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    if (location) {
      window.localStorage.setItem(lsKeyAccommodationLocation, JSON.stringify(location));
    } else {
      window.localStorage.setItem(lsKeyAccommodationLocation, "");
    }

    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const getAccommodationLocation = (): AccommodationSearchTypes.LocationObject | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const location = window.localStorage.getItem(lsKeyAccommodationLocation);

    if (location) {
      return JSON.parse(location);
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const setToursLocation = (location?: { id?: string; name?: string }) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    if (location) {
      window.localStorage.setItem(lsKeyToursLocation, JSON.stringify(location));
    } else {
      window.localStorage.setItem(lsKeyToursLocation, "");
    }

    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const getToursLocation = () => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const location = window.localStorage.getItem(lsKeyToursLocation);

    if (location) {
      return JSON.parse(location);
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const setVpDestinationLocation = (location?: { id?: string; name?: string }) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    if (location) {
      window.localStorage.setItem(lsKeyVpDestinationLocation, JSON.stringify(location));
    } else {
      window.localStorage.setItem(lsKeyVpDestinationLocation, "");
    }

    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const getVpDestinationLocation = () => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const location = window.localStorage.getItem(lsKeyVpDestinationLocation);

    if (location) {
      return JSON.parse(location);
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const setVpIncludesFlight = (isFlightIncluded: boolean) => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(lsKeyVpIncludesFlight, JSON.stringify(isFlightIncluded));

    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const getVpIncludesFlight = () => {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const isIncludedFlight = window.localStorage.getItem(lsKeyVpIncludesFlight);

    if (isIncludedFlight) {
      return JSON.parse(isIncludedFlight);
    }

    return null;
  } catch (e) {
    return null;
  }
};
