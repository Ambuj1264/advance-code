import {
  encodeAccomodationQueryParams,
  encodeTourQueryParams,
  encodeVacationSearchQueryParams,
} from "./frontUtils";

import { AutoCompleteType, OrderBy } from "types/enums";
import {
  defaultState,
  FrontSearchStateContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";

describe("encodeTourQueryParams", () => {
  it("should query encode context object for Tour search page", () => {
    expect(
      encodeTourQueryParams({
        ...defaultState,
        adults: 5,
        childs: 2,
        childrenAges: [5, 6],
        dateFrom: "date-from",
        dateTo: "date-to",
        tripStartingLocationId: "loc-01",
        tripStartingLocationName: "location-name",
      })
    ).toEqual(
      "?adults=5" +
        "&children=2" +
        "&childrenAges=5&childrenAges=6" +
        "&dateFrom=date-from" +
        "&dateTo=date-to" +
        "&startingLocationId=loc-01" +
        "&startingLocationName=location-name"
    );
  });

  it("should support any number of context keys", () => {
    expect(
      encodeTourQueryParams({
        ...defaultState,
        adults: 5,
        dateTo: "date-to",
      })
    ).toEqual("?adults=5&dateTo=date-to");
  });

  it("should handle default state", () => {
    expect(
      encodeTourQueryParams({
        ...defaultState,
      })
    ).toEqual("?adults=2");
  });
});

describe("encodeAccomodationQueryParams", () => {
  it("should query encode context object for Accommodation page", () => {
    expect(
      encodeAccomodationQueryParams({
        ...defaultState,
        accommodationAddress: "acc-addr",
        adults: 5,
        childrenAges: [5, 6],
        dateFrom: "date-from",
        dateTo: "date-to",
        accommodationId: "53519",
        accommodationType: AutoCompleteType.HOTEL,
        accommodationRooms: 5,
      })
    ).toEqual(
      "?address=acc-addr" +
        "&adults=5" +
        "&children=5&children=6" +
        "&dateFrom=date-from" +
        "&dateTo=date-to" +
        "&id=53519" +
        "&occupancies=2" +
        "&orderBy=popularity" +
        "&orderDirection=desc" +
        "&rooms=5" +
        `&type=${AutoCompleteType.HOTEL}`
    );
  });

  it("should support any number of context keys", () => {
    expect(
      encodeAccomodationQueryParams({
        ...defaultState,
        adults: 5,
        accommodationRooms: 3,
      })
    ).toEqual("?adults=5&occupancies=2&orderBy=popularity&orderDirection=desc&rooms=3");
  });

  it("should handle default state", () => {
    expect(
      encodeAccomodationQueryParams({
        ...defaultState,
      })
    ).toEqual("?adults=2&occupancies=2&orderBy=popularity&orderDirection=desc&rooms=1");
  });

  it("should use value from the default sorting order param", () => {
    expect(
      encodeAccomodationQueryParams(
        {
          ...defaultState,
        },
        OrderBy.POPULARITY
      )
    ).toEqual("?adults=2&occupancies=2&orderBy=popularity&orderDirection=desc&rooms=1");
  });
});

describe("encodeVacationSearchQueryParams", () => {
  let defaultSearchContext: FrontSearchStateContext;

  beforeEach(() => {
    defaultSearchContext = {
      ...defaultState,
      occupancies: [
        {
          numberOfAdults: 1,
          childrenAges: [9, 12],
        },
      ],
      vacationDestinationId: "1",
      vacationDestinationName: "Paris",
      vacationOriginName: "Portu",
      vacationOriginId: "2",
    };
  });

  it("constructs query for vacationPackagesSearch page with the exact return and selected dates", () => {
    const context: FrontSearchStateContext = {
      ...defaultSearchContext,
      vacationDates: {
        from: new Date("2023-12-01T00:00:00.000Z"),
      },
    };
    expect(encodeVacationSearchQueryParams(context)).toEqual(
      "?dateFrom=2023-12-01&destinationId=1&destinationName=Paris&includeFlights=1&occupancies=1_9-12&originId=2&originName=Portu"
    );
  });

  it("constructs query for vacationPackagesSearch page with the date range", () => {
    const context: FrontSearchStateContext = {
      ...defaultSearchContext,
      vacationDates: {
        from: new Date("2020-11-01T00:00:00.000Z"),
        to: new Date("2020-11-10T00:00:00.000Z"),
      },
    };
    expect(encodeVacationSearchQueryParams(context)).toEqual(
      "?dateFrom=2020-11-01&dateTo=2020-11-10&destinationId=1&destinationName=Paris&includeFlights=1&occupancies=1_9-12&originId=2&originName=Portu"
    );
  });
});
