import { VacationSearchQueryParamsType } from "./useVacationSearchQueryParams";
import {
  getFlightCodeFromId,
  constructVPSearchQueryVariables,
  doesVpHasAllRequiredSearchQueryParams,
} from "./vacationPackagesUtils";
import { VacationPackageVpTypeEnum } from "./vacationSearchFilterUtils";

import { OrderBy, OrderDirection } from "types/enums";

describe("getFlightCodeFromId", () => {
  it("returns code for country input", () => {
    expect(getFlightCodeFromId("FR")).toEqual("FR");
  });

  it("returns code for flight input", () => {
    expect(getFlightCodeFromId("airport:KEF")).toEqual("KEF");
  });

  it("returns code for city input", () => {
    expect(getFlightCodeFromId("city:LON")).toEqual("LON");
  });
});

describe("constructVPSearchQueryVariables", () => {
  let queryParamsWithFlightIncluded: VacationSearchQueryParamsType;
  let expectedInput = {};

  beforeEach(() => {
    queryParamsWithFlightIncluded = {
      dateFrom: "2022-11-01",
      dateTo: "2022-11-28",
      occupancies: ["2_9-1"],
      destinationId: "city:KEF",
      destinationName: "Keflavik",
      includeFlights: true,
      originId: "airport:NY",
      originName: "New York",
    };

    expectedInput = {
      paxMix: [
        {
          numberOfAdults: 2,
          childrenAges: [9, 1],
        },
      ],
      flightFrom: "airport:NY",
      from: "2022-11-01",
      startingPoint: "KEF",
      to: "2022-11-28",
      filter: {
        types: undefined,
        priceVariations: undefined,
        variations: undefined,
        attractions: undefined,
        destinations: undefined,
        countries: undefined,
        numberOfDays: undefined,
        take: 24,
        skip: 0,
        order: undefined,
      },
    };
  });

  it("should not fail when queryParams is an empty object", () => {
    expect(constructVPSearchQueryVariables({ queryParams: {} })).toEqual({
      input: {
        from: undefined,
        to: undefined,
        paxMix: [],
        flightFrom: "",
        startingPoint: "",
        filter: {
          types: undefined,
          priceVariations: undefined,
          variations: undefined,
          attractions: undefined,
          destinations: undefined,
          countries: undefined,
          numberOfDays: undefined,
          take: 24,
          skip: 0,
          order: undefined,
        },
      },
    });
  });

  it("supports requestId to the search input", () => {
    expect(
      constructVPSearchQueryVariables({
        queryParams: {},
        requestId: "1234-5678",
      })
    ).toEqual({
      input: {
        from: undefined,
        to: undefined,
        paxMix: [],
        flightFrom: "",
        startingPoint: "",
        requestId: "1234-5678",
        filter: {
          types: undefined,
          priceVariations: undefined,
          variations: undefined,
          attractions: undefined,
          destinations: undefined,
          countries: undefined,
          numberOfDays: undefined,
          take: 24,
          skip: 0,
          order: undefined,
        },
      },
    });
  });

  it("returns constructed GraphQL variables and sets ASC sorting order", () => {
    expect(
      constructVPSearchQueryVariables({
        queryParams: queryParamsWithFlightIncluded,
      })
    ).toEqual({
      input: expectedInput,
    });
  });

  it("skips the selected flight if includeFlights is false", () => {
    expect(
      constructVPSearchQueryVariables({
        queryParams: {
          ...queryParamsWithFlightIncluded,
          includeFlights: false,
        },
      })
    ).toEqual({
      input: {
        from: "2022-11-01",
        to: "2022-11-28",
        paxMix: [
          {
            numberOfAdults: 2,
            childrenAges: [9, 1],
          },
        ],
        flightFrom: "",
        startingPoint: "KEF",
        filter: {
          types: undefined,
          priceVariations: undefined,
          variations: undefined,
          attractions: undefined,
          destinations: undefined,
          countries: undefined,
          numberOfDays: undefined,
          take: 24,
          skip: 0,
          order: undefined,
        },
      },
    });
  });

  describe("sorting and filters", () => {
    it("keeps the provided sorting order", () => {
      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
            orderBy: OrderBy.DURATION,
            orderDirection: OrderDirection.DESC,
          },
        })
      ).toEqual({
        input: {
          paxMix: [
            {
              numberOfAdults: 2,
              childrenAges: [9, 1],
            },
          ],
          flightFrom: "airport:NY",
          from: "2022-11-01",
          startingPoint: "KEF",
          to: "2022-11-28",
          filter: {
            types: undefined,
            priceVariations: undefined,
            variations: undefined,
            attractions: undefined,
            destinations: undefined,
            countries: undefined,
            numberOfDays: undefined,
            take: 24,
            skip: 0,
            order: "DURATION_DESC",
          },
        },
      });
    });

    it("keeps the provided filters", () => {
      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
            activityIds: ["activity1"],
            destinationIds: [1, 2],
            price: [100, 200],
          },
        })
      ).toEqual({
        input: {
          paxMix: [
            {
              numberOfAdults: 2,
              childrenAges: [9, 1],
            },
          ],
          flightFrom: "airport:NY",
          from: "2022-11-01",
          startingPoint: "KEF",
          to: "2022-11-28",
          filter: {
            types: undefined,
            priceVariations: undefined,
            variations: undefined,
            priceFrom: 100,
            priceTo: 200,
            attractions: ["activity1"],
            destinations: [1, 2],
            countries: undefined,
            numberOfDays: undefined,
            take: 24,
            skip: 0,
            order: undefined,
          },
        },
      });
    });
  });

  describe("pagination", () => {
    it("keeps the forward pagination index", () => {
      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
          },
        })
      ).toEqual({
        input: expectedInput,
      });
    });

    it("keeps the backward pagination index", () => {
      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
          },
        })
      ).toEqual({
        input: expectedInput,
      });
    });

    it("constructs the type, omitting default vp top level", () => {
      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
          },
          type: "RoadTrip",
          fromLandingPage: true,
        }).input.filter.types
      ).toEqual([VacationPackageVpTypeEnum.RoadTrip]);

      expect(
        constructVPSearchQueryVariables({
          queryParams: {
            ...queryParamsWithFlightIncluded,
          },
          type: "VpTopLevel",
        }).input.filter.types
      ).toEqual(undefined);
    });
  });
});

describe("doesVpHasAllRequiredSearchQueryParams", () => {
  const validQueryParamsWithoutFlightEnabled: VacationSearchQueryParamsType = {
    dateFrom: "2022-11-01",
    dateTo: "2022-11-20",
    destinationId: "city:KEF",
    destinationName: "Keflavik",
    occupancies: ["1"],
  };

  const validQueryParamsWithFlightEnabled: VacationSearchQueryParamsType = {
    ...validQueryParamsWithoutFlightEnabled,
    originId: "city:KEF",
    originName: "Keflavik",
    includeFlights: true,
  };

  it("returns true for required fields with missing origin/originId when includeFlights is false", () => {
    expect(
      doesVpHasAllRequiredSearchQueryParams(validQueryParamsWithoutFlightEnabled)
    ).toBeTruthy();
  });

  it("requires all fields including originId/originName when includeFlights is true", () => {
    expect(doesVpHasAllRequiredSearchQueryParams(validQueryParamsWithFlightEnabled)).toBeTruthy();
  });

  it("returns false when some of required fields are not available", () => {
    const originIdFieldIsMissing = {
      validQueryParamsWithFlightEnabled,
      originId: undefined,
    };

    const destinationIdFieldIsMissing = {
      validQueryParamsWithFlightEnabled,
      destinationId: undefined,
    };

    const dateFromIsMissing = {
      validQueryParamsWithFlightEnabled,
      dateFrom: undefined,
    };

    expect(doesVpHasAllRequiredSearchQueryParams(originIdFieldIsMissing)).toBeFalsy();

    expect(doesVpHasAllRequiredSearchQueryParams(destinationIdFieldIsMissing)).toBeFalsy();

    expect(doesVpHasAllRequiredSearchQueryParams(dateFromIsMissing)).toBeFalsy();
  });
});
