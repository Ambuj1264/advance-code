/* eslint-disable functional/immutable-data */
import {
  getDateFromLocalStorageString,
  setDatesInLocalStorage,
  clearDatesInLocalStorage,
  clearEndDateInLocalStorage,
  getNumberOfChildren,
  getNumberOfTeenagers,
  getNumberOfAdults,
  getStringifiedChildrenTeenagerAges,
  getFixedSelectedDatesFromLocalStorage,
  writeTravelersUrlParamToLocalStorage,
  writeDateUrlParamToLocalStorage,
  setPickUpDropOffLocations,
  getPickUpDropOffLocations,
  setAccommodationLocation,
  getAccommodationLocation,
  setToursLocation,
  getToursLocation,
  setVpIncludesFlight,
  getVpIncludesFlight,
  setVpDestinationLocation,
  getVpDestinationLocation,
  lsKeyGuestsChildrenAges,
  lsKeyNumberOfAdults,
  lsKeyStartDate,
  lsKeyEndDate,
  lsKeyDropoffLocationId,
  lsKeyPickupLocationId,
  lsKeyPickupGeoLocation,
  lsKeyDropoffGeoLocation,
  lsKeyAccommodationLocation,
  lsKeyToursLocation,
  lsKeyVpIncludesFlight,
  lsKeyVpDestinationLocation,
} from "../localStorageUtils";

import { getPriceGroupsMaxAge } from "components/features/TourBookingWidget/Travelers/utils/travelersUtils";
import { localStorageMock } from "__mocks__/mocks";
import { AutoCompleteType } from "types/enums";

const teenMaxAge = 12;
const childMaxAge = 6;

describe("getNumberOfChildren", () => {
  test("Should return correct number elements that are 6 or less", () => {
    const travelerAges = [1, 2, 3, 4, 8, 9, 10, 2, 5, 12];

    expect(getNumberOfChildren(travelerAges, childMaxAge)).toEqual(6);
  });
  test("Should return 0 when every element is higher then 6", () => {
    const travelerAges = [7, 7, 7];

    expect(getNumberOfChildren(travelerAges, childMaxAge)).toEqual(0);
  });
});

describe("getNumberOfTeenagers", () => {
  test("Should return correct number elements that are between 6 and 13", () => {
    const travelerAges = [1, 2, 3, 4, 8, 9, 10, 2, 5, 12];

    expect(getNumberOfTeenagers(travelerAges, childMaxAge, teenMaxAge)).toEqual(4);
  });
  test("Should return 0 when every element is higher then 12 or lower then 7", () => {
    const travelerAges = [13, 13, 13, 6, 6, 6];

    expect(getNumberOfTeenagers(travelerAges, childMaxAge, teenMaxAge)).toEqual(0);
  });
});

describe("getNumberOfAdults", () => {
  test("Should return correct number elements that are higher then 12 and number of adults is 5", () => {
    const travelerAges = [1, 2, 3, 4, 8, 9, 15, 14, 13, 12];

    expect(getNumberOfAdults(5, travelerAges, teenMaxAge)).toEqual(8);
  });
  test("Should return 0 when every element is lower then 13 and number of adults is 0", () => {
    const travelerAges = [12, 12, 12, 6, 6, 6];

    expect(getNumberOfAdults(0, travelerAges, teenMaxAge)).toEqual(0);
  });
});

describe("getStringifiedChildrenTeenagerAges", () => {
  test("Should return correct stringified array from number of travelers", () => {
    const stringifiedArray = "[12,12,12,12,12,6,6,6]";

    expect(getStringifiedChildrenTeenagerAges(5, 3, teenMaxAge, childMaxAge)).toEqual(
      stringifiedArray
    );
  });
  test("Should only contain teenager ages", () => {
    const stringifiedArray = "[12,12,12,12,12]";

    expect(getStringifiedChildrenTeenagerAges(5, 0, teenMaxAge, childMaxAge)).toEqual(
      stringifiedArray
    );
  });
  test("Should only contain children ages", () => {
    const stringifiedArray = "[6,6,6]";

    expect(getStringifiedChildrenTeenagerAges(0, 3, teenMaxAge, childMaxAge)).toEqual(
      stringifiedArray
    );
  });
});

describe("writeTravelersUrlParamToLocalStorage", () => {
  const { location } = window;

  /* eslint-disable functional/immutable-data */
  const setLocationSearch = (search: string) => {
    window.location = {
      ...location,
      search,
    };
  };

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
  });

  afterAll(() => {
    window.location = location;
  });
  /* eslint-enable functional/immutable-data */

  const priceGroup1 = {
    defaultNumberOfTravelerType: null,
    minAge: 0,
    maxAge: 12,
  };

  const priceGroup2 = {
    defaultNumberOfTravelerType: null,
    minAge: 18,
    maxAge: null,
  };

  const priceGroup3 = {
    defaultNumberOfTravelerType: null,
    minAge: 13,
    maxAge: 17,
  };

  const priceGroups = {
    adults: priceGroup2,
    children: priceGroup1,
    teenagers: priceGroup3,
  };

  test("Should not write anything to localStorage", () => {
    setLocationSearch("");
    writeTravelersUrlParamToLocalStorage(getPriceGroupsMaxAge(priceGroups));
    expect(window.localStorage.getItem(lsKeyNumberOfAdults)).toBeNull();
    expect(window.localStorage.getItem(lsKeyGuestsChildrenAges)).toBeNull();
  });
  test("Should write correct adults, children to localStorage", () => {
    setLocationSearch("?date=2020-03-15&adults=4&teenagers=2&children=4");
    writeTravelersUrlParamToLocalStorage(getPriceGroupsMaxAge(priceGroups));
    expect(window.localStorage.getItem(lsKeyNumberOfAdults)).toBe("4");
    expect(window.localStorage.getItem(lsKeyGuestsChildrenAges)).toBe("[17,17,12,12,12,12]");
  });
  test("Should clear out children ages from localstorage since query parameters do not include children", () => {
    window.localStorage.setItem(lsKeyGuestsChildrenAges, "[]");
    setLocationSearch("?date=2020-03-15&adults=4");
    writeTravelersUrlParamToLocalStorage(getPriceGroupsMaxAge(priceGroups));
    expect(window.localStorage.getItem(lsKeyNumberOfAdults)).toBe("4");
    expect(window.localStorage.getItem(lsKeyGuestsChildrenAges)).toBe("[]");
  });
});

describe("writeDateUrlParamToLocalStorage", () => {
  test("Should not write anything to localStorage", () => {
    writeDateUrlParamToLocalStorage("");
    expect(window.localStorage.getItem(lsKeyStartDate)).toBeNull();

    writeDateUrlParamToLocalStorage();
    expect(window.localStorage.getItem(lsKeyStartDate)).toBeNull();
  });
  test("Should write correct start- and endDate to localStorage", () => {
    writeDateUrlParamToLocalStorage("2020-03-15");
    expect(window.localStorage.getItem(lsKeyStartDate)).toBe("1584230400000");
  });
});

describe("getSelectedDatesFromLocalStorage", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });
  test("returns the from date", () => {
    window.localStorage.setItem(lsKeyStartDate, "455155200000");
    expect(getFixedSelectedDatesFromLocalStorage(1)).toEqual({
      from: new Date("1984-06-04"),
      to: new Date("1984-06-04"),
    });
  });
  test("returns a two day range", () => {
    window.localStorage.setItem(lsKeyStartDate, "455155200000");
    expect(getFixedSelectedDatesFromLocalStorage(2)).toEqual({
      from: new Date("1984-06-04"),
      to: new Date("1984-06-05"),
    });
  });
  test("handles `null` value in local storage", () => {
    window.localStorage.setItem(lsKeyStartDate, "null");
    expect(getFixedSelectedDatesFromLocalStorage(0)).toEqual({
      from: undefined,
      to: undefined,
    });
  });
  test("handles invalid dates in local storage", () => {
    window.localStorage.setItem(lsKeyStartDate, "df4fd1-df");
    expect(getFixedSelectedDatesFromLocalStorage(0)).toEqual({
      from: undefined,
      to: undefined,
    });
  });
});

describe("setPickUpDropOffLocations", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const pickupId = "1,123";
  const dropoffId = "9,876";

  test("should save pickup and dropoff locations", () => {
    setPickUpDropOffLocations({
      pickupId,
      dropoffId,
    });

    expect(window.localStorage.getItem(lsKeyPickupLocationId)).toBe(pickupId);
    expect(window.localStorage.getItem(lsKeyDropoffLocationId)).toBe(dropoffId);
  });

  test("should save only dropoff location", () => {
    window.localStorage.setItem(lsKeyPickupLocationId, "");

    setPickUpDropOffLocations({
      pickupId: undefined,
      dropoffId,
    });

    expect(window.localStorage.getItem(lsKeyPickupLocationId)).toBe(null);
    expect(window.localStorage.getItem(lsKeyDropoffLocationId)).toBe(dropoffId);
  });

  test("should save only pickup location", () => {
    window.localStorage.setItem(lsKeyDropoffLocationId, "");

    setPickUpDropOffLocations({
      pickupId,
      dropoffId: undefined,
    });

    expect(window.localStorage.getItem(lsKeyPickupLocationId)).toBe(pickupId);
    expect(window.localStorage.getItem(lsKeyDropoffLocationId)).toBe(null);
  });

  test("should clear pickup & dropoff location", () => {
    window.localStorage.setItem(lsKeyPickupLocationId, "");
    window.localStorage.setItem(lsKeyDropoffLocationId, "");

    setPickUpDropOffLocations({
      pickupId: "",
      dropoffId: "",
    });

    expect(window.localStorage.getItem(lsKeyPickupLocationId)).toBe(null);
    expect(window.localStorage.getItem(lsKeyDropoffLocationId)).toBe(null);
  });
});

describe("getPickUpDropOffLocations", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockPickupId = "2,456";
  const mockDropoffId = "7,321";
  const mockPickupGeo = "51.5085;-0.12574,3";
  const mockDropoffGeo = "51.5085;-0.12574,3";

  test("should get pickup & dropoff locations from local storage", () => {
    window.localStorage.setItem(lsKeyPickupLocationId, mockPickupId);
    window.localStorage.setItem(lsKeyDropoffLocationId, mockDropoffId);
    window.localStorage.setItem(lsKeyPickupGeoLocation, mockPickupGeo);
    window.localStorage.setItem(lsKeyDropoffGeoLocation, mockDropoffGeo);

    expect(getPickUpDropOffLocations()).toEqual({
      carDropoffGeoLocation: mockDropoffGeo,
      carPickupGeoLocation: mockPickupGeo,
      pickupId: mockPickupId,
      dropoffId: mockDropoffId,
      pickupLocationName: null,
      dropoffLocationName: null,
    });
  });

  test("should get only pickup from local storage", () => {
    window.localStorage.setItem(lsKeyPickupLocationId, mockPickupId);
    window.localStorage.setItem(lsKeyPickupGeoLocation, mockPickupGeo);
    window.localStorage.setItem(lsKeyDropoffLocationId, "");
    window.localStorage.setItem(lsKeyDropoffGeoLocation, "");

    expect(getPickUpDropOffLocations()).toEqual({
      carDropoffGeoLocation: null,
      carPickupGeoLocation: mockPickupGeo,
      pickupId: mockPickupId,
      dropoffId: null,
      pickupLocationName: null,
      dropoffLocationName: null,
    });
  });

  test("should get only dropoff from local storage", () => {
    window.localStorage.setItem(lsKeyPickupLocationId, "");
    window.localStorage.setItem(lsKeyPickupGeoLocation, "");
    window.localStorage.setItem(lsKeyDropoffLocationId, mockDropoffId);
    window.localStorage.setItem(lsKeyDropoffGeoLocation, mockDropoffGeo);

    expect(getPickUpDropOffLocations()).toEqual({
      carDropoffGeoLocation: mockDropoffGeo,
      carPickupGeoLocation: null,
      pickupId: null,
      dropoffId: mockDropoffId,
      pickupLocationName: null,
      dropoffLocationName: null,
    });
  });
});

describe("setAccommodationLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    id: "53852",
    address: "Reykjavík, Iceland",
    type: AutoCompleteType.CITY,
  };

  test("should save accommodation location", () => {
    setAccommodationLocation(mockLocation);

    expect(JSON.parse(window.localStorage.getItem(lsKeyAccommodationLocation) as string)).toEqual(
      mockLocation
    );
  });

  test("should clear accommodation location", () => {
    setAccommodationLocation(undefined);

    expect(JSON.parse(window.localStorage.getItem(lsKeyAccommodationLocation) as string)).toEqual(
      null
    );
  });
});

describe("getAccommodationLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    latitude: 64.146582,
    longitude: -21.9426354,
    address: "Reykjavík, Iceland",
    distance: 30,
  };

  test("should get accommodations location from local storage", () => {
    window.localStorage.setItem(lsKeyAccommodationLocation, JSON.stringify(mockLocation));

    expect(getAccommodationLocation()).toEqual(mockLocation);
  });

  test("should get empty accommodations location from local storage", () => {
    window.localStorage.setItem(lsKeyAccommodationLocation, "");

    expect(getAccommodationLocation()).toEqual(null);
  });
});

describe("setToursLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    id: "1",
    name: "Reykjavík, Iceland",
  };

  test("should save tour location", () => {
    setToursLocation(mockLocation);

    expect(JSON.parse(window.localStorage.getItem(lsKeyToursLocation) as string)).toEqual(
      mockLocation
    );
  });

  test("should clear accommodation location", () => {
    setToursLocation(undefined);

    expect(JSON.parse(window.localStorage.getItem(lsKeyToursLocation) as string)).toEqual(null);
  });
});

describe("getToursLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    id: "1",
    name: "Reykjavík, Iceland",
  };

  test("should get tours location from local storage", () => {
    window.localStorage.setItem(lsKeyToursLocation, JSON.stringify(mockLocation));

    expect(getToursLocation()).toEqual(mockLocation);
  });

  test("should get empty tours location from local storage", () => {
    window.localStorage.setItem(lsKeyToursLocation, "");

    expect(getToursLocation()).toEqual(null);
  });
});

describe("getDateFromLocalStorageString", () => {
  test("should return date from string", () => {
    expect(getDateFromLocalStorageString("1626771600000")).toEqual({
      _tag: "Some",
      value: new Date("2021-07-20T09:00:00.000Z"),
    });
  });
  test("should return empty results in case if no date in localstorage", () => {
    expect(getDateFromLocalStorageString("")).toEqual({ _tag: "None" });
  });
});

describe("setDatesInLocalStorage", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  test("should save dates into local storage", () => {
    const mockDates = {
      from: new Date("2021-05-31"),
      to: new Date("2021-06-20"),
    };

    setDatesInLocalStorage(mockDates);

    expect(JSON.parse(window.localStorage.getItem(lsKeyStartDate) as string)).toEqual(
      mockDates.from.getTime()
    );
    expect(JSON.parse(window.localStorage.getItem(lsKeyEndDate) as string)).toEqual(
      mockDates.to.getTime()
    );
  });

  test("should save only 'from' date into local storage", () => {
    window.localStorage.removeItem(lsKeyEndDate);

    const mockDates = {
      from: new Date("2021-05-31"),
    };

    setDatesInLocalStorage(mockDates);

    expect(JSON.parse(window.localStorage.getItem(lsKeyStartDate) as string)).toEqual(
      mockDates.from.getTime()
    );
    expect(JSON.parse(window.localStorage.getItem(lsKeyEndDate) as string)).toEqual(null);
  });

  test("should save only 'to' date into local storage", () => {
    window.localStorage.removeItem(lsKeyStartDate);

    const mockDates = {
      to: new Date("2021-05-31"),
    };

    setDatesInLocalStorage(mockDates);

    expect(JSON.parse(window.localStorage.getItem(lsKeyEndDate) as string)).toEqual(
      mockDates.to.getTime()
    );
    expect(JSON.parse(window.localStorage.getItem(lsKeyStartDate) as string)).toEqual(null);
  });
});

describe("clearDatesInLocalStorage", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  test("should clear dates from local storage", () => {
    const mockDates = {
      from: new Date("2021-05-31"),
      to: new Date("2021-06-20"),
    };
    window.localStorage.setItem(lsKeyStartDate, mockDates.from.getTime().toString());
    window.localStorage.setItem(lsKeyEndDate, mockDates.to.getTime().toString());

    clearDatesInLocalStorage();

    expect(JSON.parse(window.localStorage.getItem(lsKeyStartDate) as string)).toEqual(null);
    expect(JSON.parse(window.localStorage.getItem(lsKeyEndDate) as string)).toEqual(null);
  });
});

describe("clearEndDateInLocalStorage", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  test("should remove end date from local storage", () => {
    const mockDates = {
      from: new Date("2021-05-31"),
      to: new Date("2021-06-20"),
    };
    window.localStorage.setItem(lsKeyStartDate, mockDates.from.getTime().toString());
    window.localStorage.setItem(lsKeyEndDate, mockDates.to.getTime().toString());

    clearEndDateInLocalStorage();

    expect(JSON.parse(window.localStorage.getItem(lsKeyStartDate) as string)).toEqual(
      mockDates.from.getTime()
    );
    expect(JSON.parse(window.localStorage.getItem(lsKeyEndDate) as string)).toEqual(null);
  });
});

describe("setVpDestinationLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    id: "1",
    name: "Reykjavík, Iceland",
  };

  test("should save vp destination location", () => {
    setVpDestinationLocation(mockLocation);

    expect(JSON.parse(window.localStorage.getItem(lsKeyVpDestinationLocation) as string)).toEqual(
      mockLocation
    );
  });

  test("should vp destination location", () => {
    setVpDestinationLocation(undefined);

    expect(JSON.parse(window.localStorage.getItem(lsKeyVpDestinationLocation) as string)).toEqual(
      null
    );
  });
});

describe("getVpDestinationLocation", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  const mockLocation = {
    id: "1",
    name: "Reykjavík, Iceland",
  };

  test("should get vp destination location from local storage", () => {
    window.localStorage.setItem(lsKeyVpDestinationLocation, JSON.stringify(mockLocation));

    expect(getVpDestinationLocation()).toEqual(mockLocation);
  });

  test("should get empty vp destination location from local storage", () => {
    window.localStorage.setItem(lsKeyVpDestinationLocation, "");

    expect(getVpDestinationLocation()).toEqual(null);
  });
});

describe("setVpIncludesFlight", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  test("should save vp flights flag", () => {
    const mockVpIncludedFlight = true;
    setVpIncludesFlight(mockVpIncludedFlight);

    expect(JSON.parse(window.localStorage.getItem(lsKeyVpIncludesFlight) as string)).toEqual(
      mockVpIncludedFlight
    );

    const mockVpIncludedFlight1 = false;
    setVpIncludesFlight(mockVpIncludedFlight1);

    expect(JSON.parse(window.localStorage.getItem(lsKeyVpIncludesFlight) as string)).toEqual(
      mockVpIncludedFlight1
    );
  });
});

describe("getVpIncludesFlight", () => {
  beforeAll(() => {
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
      writable: true,
    });
    /* eslint-enable functional/immutable-data */
  });

  test("should get vp flights flag from local storage", () => {
    const mockVpIncludedFlight = true;
    window.localStorage.setItem(lsKeyVpIncludesFlight, JSON.stringify(mockVpIncludedFlight));

    expect(getVpIncludesFlight()).toEqual(mockVpIncludedFlight);
  });

  test("should get empty vp flights flag from local storage", () => {
    window.localStorage.setItem(lsKeyVpIncludesFlight, "");

    expect(getVpIncludesFlight()).toEqual(null);
  });
});
