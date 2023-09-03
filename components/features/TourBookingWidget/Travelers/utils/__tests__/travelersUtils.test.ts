import {
  constructPriceGroups,
  getAddMoreTravelersButtonText,
  getTotalNumberOfTravelers,
  shouldExpandTravelers,
  getAdultText,
  getAgeText,
  getPriceGroupMaxAge,
  getTotalNumberOfTravelersWithPriceGroups,
  constructTravelersByPriceGroups,
  getChildrenAgesFromPriceGroups,
  getTotalNumberOfGTIVpTravelers,
  checkIfCanIncrement,
} from "../travelersUtils";
import {
  mockPriceGroups0,
  mockPriceGroups1,
  mockPriceGroups2,
  mockQueryPriceGroups0,
  mockQueryPriceGroups1,
} from "../mockTravelersData";

const t = (key: string) => key;

describe("constructPriceGroups", () => {
  test("should return correctly construced priceGroup with 3 price groups", () => {
    expect(constructPriceGroups(mockQueryPriceGroups0)).toEqual(mockPriceGroups0);
  });
  test("should return correctly construced priceGroup with only a single price group", () => {
    expect(constructPriceGroups(mockQueryPriceGroups1)).toEqual(mockPriceGroups1);
  });
});

describe("getAddMoreTravelersButtonText", () => {
  test("should return undefined if the priceGroup array is empty", () => {
    expect(getAddMoreTravelersButtonText([])).toEqual(undefined);
  });
  test("should return undefined if the priceGroup contains only adults", () => {
    expect(getAddMoreTravelersButtonText(mockPriceGroups1)).toEqual(undefined);
  });
  test("should return the correct text with only teenagers", () => {
    expect(getAddMoreTravelersButtonText(mockPriceGroups2)).toEqual("Add teenagers");
  });
  test("should return the correct text with both teenagers and children", () => {
    expect(getAddMoreTravelersButtonText(mockPriceGroups0)).toEqual("Add teenagers/children");
  });
});

describe("getTotalNumberOfTravelers", () => {
  const numberOfTravelers0: SharedTypes.NumberOfTravelers = {
    adults: 4,
    teenagers: 2,
    children: 1,
  };
  test("Should return the correct number of travelers", () => {
    expect(getTotalNumberOfTravelers(numberOfTravelers0)).toEqual(7);
  });
});

describe("shouldExpandTravelers", () => {
  test("Should return true if teenagers is greater than 0", () => {
    const teenagers = 5;
    const children = 0;
    expect(shouldExpandTravelers(teenagers, children)).toEqual(true);
  });
  test("Should return true if children is greater than 0", () => {
    const teenagers = 0;
    const children = 5;
    expect(shouldExpandTravelers(teenagers, children)).toEqual(true);
  });
  test("Should return false if teenagers and children is 0 and isExpanded is false", () => {
    const teenagers = 0;
    const children = 0;
    expect(shouldExpandTravelers(teenagers, children)).toEqual(false);
  });
});

describe("getAdultText", () => {
  test("Should return correct text for adults", () => {
    const singlePriceGroup = true;
    const minAge = 8;
    expect(getAdultText(singlePriceGroup, minAge, t as TFunction)).toEqual(
      "Persons {minAge} years+"
    );
  });
  test("Should return correct text for adults", () => {
    const singlePriceGroup = true;
    const minAge = 0;
    expect(getAdultText(singlePriceGroup, minAge, t as TFunction)).toEqual("Persons");
  });
  test("Should return correct text for adults", () => {
    const singlePriceGroup = false;
    const minAge = 8;
    expect(getAdultText(singlePriceGroup, minAge, t as TFunction)).toEqual("Adults");
  });
});

describe("getAgeText", () => {
  test("Should return correct text for traveler type", () => {
    const singlePriceGroup = true;
    const minAge = 0;
    expect(getAgeText(singlePriceGroup, "children", minAge, t as TFunction, 12)).toEqual(
      "{travelerType} aged {minAge} - {maxAge}"
    );
  });
  test("Should return correct text for traveler type", () => {
    const singlePriceGroup = true;
    const minAge = 8;
    expect(getAgeText(singlePriceGroup, "adults", minAge, t as TFunction, null)).toEqual(
      "Persons {minAge} years+"
    );
  });
});

describe("getPriceGroupMaxAge", () => {
  test("Should return correct max age if it's not null", () => {
    const priceGroup = {
      defaultNumberOfTravelerType: null,
      minAge: 0,
      maxAge: 12,
    };
    expect(getPriceGroupMaxAge(priceGroup)).toEqual(12);
  });
  test("Should return 0 if max age is null", () => {
    const priceGroup = {
      defaultNumberOfTravelerType: null,
      minAge: 0,
      maxAge: null,
    };
    expect(getPriceGroupMaxAge(priceGroup)).toEqual(0);
  });
});

describe("getTotalNumberOfTravelersWithPriceGroups returns number of travellers for available price groups only", () => {
  it("returns only adults count when only adults price groups", () => {
    expect(
      getTotalNumberOfTravelersWithPriceGroups({ adults: 3, children: 2, teenagers: 1 }, [
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "adults",
          minAge: 0,
          maxAge: null,
        },
      ])
    ).toEqual(3);
  });

  it("returns only children count when only children price groups", () => {
    expect(
      getTotalNumberOfTravelersWithPriceGroups({ adults: 3, children: 2, teenagers: 1 }, [
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "children",
          minAge: 0,
          maxAge: null,
        },
      ])
    ).toEqual(2);
  });

  it("returns only teenagers count when only teenager price groups", () => {
    expect(
      getTotalNumberOfTravelersWithPriceGroups({ adults: 3, children: 2, teenagers: 1 }, [
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "teenagers",
          minAge: 0,
          maxAge: null,
        },
      ])
    ).toEqual(1);
  });

  it("returns only adults+teenagers count when only adults+teenager price groups", () => {
    expect(
      getTotalNumberOfTravelersWithPriceGroups({ adults: 3, children: 2, teenagers: 1 }, [
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "adults",
          minAge: 0,
          maxAge: null,
        },
        {
          id: "2",
          defaultNumberOfTravelerType: 0,
          travelerType: "teenagers",
          minAge: 0,
          maxAge: null,
        },
      ])
    ).toEqual(4);
  });

  it("returns only total count when only all price groups are available", () => {
    expect(
      getTotalNumberOfTravelersWithPriceGroups({ adults: 3, children: 2, teenagers: 1 }, [
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "adults",
          minAge: 0,
          maxAge: null,
        },
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "children",
          minAge: 0,
          maxAge: null,
        },
        {
          id: "1",
          defaultNumberOfTravelerType: 0,
          travelerType: "teenagers",
          minAge: 0,
          maxAge: null,
        },
      ])
    ).toEqual(6);
  });
});

describe(
  "constructTravelersByPriceGroups - sets childrenAges to the specific" +
    "travelerType according to the childrenAges and priceGroup",
  () => {
    const numberOfTravelers = {
      adults: 1,
      teenagers: 1,
      children: 1,
    };

    it("returns unchanged travelers if no price group", () => {
      const childrenAges = [1, 2, 3];
      const priceGroups = undefined;
      expect(constructTravelersByPriceGroups(numberOfTravelers, priceGroups, childrenAges)).toEqual(
        {
          adults: {
            count: 1,
            childrenAges: [],
          },
          teenagers: {
            count: 1,
            childrenAges: [],
          },
          children: {
            count: 1,
            childrenAges: [],
          },
        }
      );
    });
    it("returns unchanged travelers if no children ages provided", () => {
      expect(
        constructTravelersByPriceGroups(numberOfTravelers, [
          {
            id: "1",
            minAge: 0,
            maxAge: null,
            travelerType: "children",
            defaultNumberOfTravelerType: 1,
          },
        ])
      ).toEqual({
        adults: {
          count: 1,
          childrenAges: [],
        },
        teenagers: {
          count: 1,
          childrenAges: [],
        },
        children: {
          count: 1,
          childrenAges: [],
        },
      });
    });

    it("adjusts count of adults/teenaers/children considering the priceGroup category and children age", () => {
      const kids = [0, 3, 6];
      const teenagers = [14, 15, 17];
      const childrenAges = [...kids, ...teenagers];

      expect(
        constructTravelersByPriceGroups(
          {
            adults: 1,
            teenagers: 0,
            children: 6,
          },
          [
            {
              id: "1",
              minAge: 0,
              maxAge: 6,
              travelerType: "children",
              defaultNumberOfTravelerType: 1,
            },
            {
              id: "1",
              minAge: 14,
              maxAge: 15,
              travelerType: "teenagers",
              defaultNumberOfTravelerType: 1,
            },
            {
              id: "1",
              minAge: 16,
              maxAge: null,
              travelerType: "adults",
              defaultNumberOfTravelerType: 1,
            },
          ],
          childrenAges
        )
      ).toEqual({
        adults: {
          count: 2,
          childrenAges: [17],
        },
        children: {
          count: 3,
          childrenAges: kids,
        },
        teenagers: {
          count: 2,
          childrenAges: [14, 15],
        },
      });
    });

    it("sets up children if meets pricegroup children age ", () => {
      const childrenAges = [1, 2, 3];
      expect(
        constructTravelersByPriceGroups(
          numberOfTravelers,
          [
            {
              id: "1",
              minAge: 0,
              maxAge: 7,
              travelerType: "children",
              defaultNumberOfTravelerType: 1,
            },
          ],
          childrenAges
        )
      ).toEqual({
        adults: {
          count: numberOfTravelers.adults,
          childrenAges: [],
        },
        teenagers: {
          count: 0,
          childrenAges: [],
        },
        children: {
          count: 3,
          childrenAges: [1, 2, 3],
        },
      });
    });
    it("sets up children as teenagers if meets pricegroup teenagers age ", () => {
      const toddlers = [1, 2, 3];
      const teenagers = [14, 15];
      const childrenAges = [...toddlers, ...teenagers];
      expect(
        constructTravelersByPriceGroups(
          numberOfTravelers,
          [
            {
              id: "1",
              minAge: 0,
              maxAge: 3,
              travelerType: "children",
              defaultNumberOfTravelerType: 1,
            },
            {
              id: "1",
              minAge: 3,
              maxAge: 15,
              travelerType: "teenagers",
              defaultNumberOfTravelerType: 1,
            },
          ],
          childrenAges
        )
      ).toEqual({
        adults: {
          count: numberOfTravelers.adults,
          childrenAges: [],
        },
        teenagers: {
          count: 2,
          childrenAges: [14, 15],
        },
        children: {
          count: 3,
          childrenAges: [1, 2, 3],
        },
      });
    });
    it("sets up children as adults if meets pricegroup age of adults and no teenagers/children pricegroups", () => {
      const toddlers = [1, 2, 3];
      const teenagers = [14, 15];
      const childrenAges = [...toddlers, ...teenagers];
      expect(
        constructTravelersByPriceGroups(
          numberOfTravelers,
          [
            {
              id: "1",
              minAge: 0,
              maxAge: null,
              travelerType: "adults",
              defaultNumberOfTravelerType: 1,
            },
          ],
          childrenAges
        )
      ).toEqual({
        adults: {
          count: numberOfTravelers.adults + childrenAges.length,
          childrenAges: [...childrenAges],
        },
        teenagers: {
          count: 0,
          childrenAges: [],
        },
        children: {
          count: 0,
          childrenAges: [],
        },
      });
    });

    it("skips some of children if it does not meet priceGroup age range", () => {
      const kids = [1, 2, 3, 4, 5];
      const teenagers = [14, 15];
      const childrenAges = [...kids, ...teenagers];
      expect(
        constructTravelersByPriceGroups(
          numberOfTravelers,
          [
            {
              id: "1",
              minAge: 15,
              maxAge: null,
              travelerType: "adults",
              defaultNumberOfTravelerType: 1,
            },
            {
              id: "2",
              minAge: 13,
              maxAge: 14,
              travelerType: "teenagers",
              defaultNumberOfTravelerType: 1,
            },
          ],
          childrenAges
        )
      ).toEqual({
        adults: {
          count: numberOfTravelers.adults + 1,
          childrenAges: [15],
        },
        teenagers: {
          count: 1,
          childrenAges: [14],
        },
        children: {
          count: 0,
          childrenAges: [],
        },
      });
    });
  }
);

describe("getTotalNumberOfVpTravelers", () => {
  it("returns correct total number of travellers", () => {
    expect(
      getTotalNumberOfGTIVpTravelers({
        adults: 1,
        childrenAges: [1, 2],
      })
    ).toEqual(3);
    expect(
      getTotalNumberOfGTIVpTravelers({
        adults: 1,
        childrenAges: [],
      })
    ).toEqual(1);
  });
});

describe("checkIfCanIncrement", () => {
  it("should return true if maxTravelers was not provided", () => {
    expect(checkIfCanIncrement({ totalTravellers: 9 })).toEqual(true);
  });
  it("should return true if maxTravelers is 0", () => {
    expect(checkIfCanIncrement({ maxTravelers: 0, totalTravellers: 9 })).toEqual(true);
  });
  it("should return true when max travellers is bigger then travelers count", () => {
    expect(checkIfCanIncrement({ maxTravelers: 10, totalTravellers: 9 })).toEqual(true);

    expect(checkIfCanIncrement({ maxTravelers: 10, totalTravellers: 1 })).toEqual(true);
  });
  it("should return false when total number is bigger or equal than max travellers", () => {
    expect(checkIfCanIncrement({ maxTravelers: 10, totalTravellers: 10 })).toEqual(false);
    expect(checkIfCanIncrement({ maxTravelers: 10, totalTravellers: 11 })).toEqual(false);
  });
});

describe("getChildrenAgesFromPriceGroups", () => {
  it("returns children ages from teenagers and children only", () => {
    expect(
      getChildrenAgesFromPriceGroups({
        adults: {
          count: 100,
          childrenAges: [18, 20, 21],
        },
        teenagers: {
          count: 3,
          childrenAges: [15, 14, 13],
        },
        children: {
          count: 3,
          childrenAges: [8, 9],
        },
      })
    ).toEqual([15, 14, 13, 8, 9]);
  });
});
