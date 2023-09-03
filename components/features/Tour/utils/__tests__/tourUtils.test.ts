import {
  mockQueryTour0,
  mockQueryTour1,
  mockTour0,
  mockTour1,
  mockQueryGuide0,
  mockQueryGuide1,
  mockGuide0,
  mockGuide1,
  mockQueryContentTemplate0,
  mockContentTemplate0,
  mockQueryItineraryItem0,
  mockItineraryItem0,
  mockQueryItineraryItemWithEmptyContentTemplate,
  mockItineraryItemWithEmptyContentTemplate,
  mockQueryAttraction01,
  mockQueryAttraction02,
} from "../mockTourData";
import {
  isFreeCancellation,
  constructShouldBringItems,
  constructIncludedItems,
  constructActivityItems,
  constructAttractionsItems,
  constructContentTemplates,
  constructItinerary,
  constructGuideLanguages,
  constructGuides,
  constructTour,
  getCountryLatAndLongForMarketPlace,
  coordsByMarketplace,
} from "../tourUtils";

import { mockQueryImage0 } from "utils/mockData/mockGlobalData";
import { Marketplace } from "types/enums";

describe("isFreeCancellation", () => {
  test("should return false when tour durationInSeconds is exactly 86400 seconds (one day)", () => {
    expect(isFreeCancellation(86400)).toBe(false);
  });
  test("should return true when tour durationInSeconds is less than 86400 seconds (one day)", () => {
    expect(isFreeCancellation(82400)).toBe(true);
  });
  test("should return false when tour durationInSeconds is more than 86400 seconds (one day)", () => {
    expect(isFreeCancellation(126400)).toBe(false);
  });
});

describe("constructShouldBringItems", () => {
  test("should return correctly constructed shouldBringItems", () => {
    const result = constructShouldBringItems([
      {
        id: 0,
        name: "Driver's licence",
        included: true,
      },
      {
        id: 1,
        name: "Swimsuit",
        included: false,
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Driver's licence",
      },
      {
        id: "1",
        title: "Swimsuit",
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
    expect(result[1].id).toEqual(expectedResult[1].id);
    expect(result[1].title).toEqual(expectedResult[1].title);
  });
});

describe("constructIncludedItems", () => {
  test("should return correctly constructed includedItems", () => {
    const result = constructIncludedItems([
      {
        id: 0,
        name: "Car",
        included: true,
      },
      {
        id: 1,
        name: "Blue lagoon",
        included: false,
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Car",
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
  });
});

describe("constructActivityItems", () => {
  test("should return correctly constructed activityItems", () => {
    const result = constructActivityItems([
      {
        id: 0,
        name: "Mývatn",
        included: true,
      },
      {
        id: 1,
        name: "Silfra",
        included: false,
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Mývatn",
      },
      {
        id: "1",
        title: "Silfra",
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
    expect(result[1].id).toEqual(expectedResult[1].id);
    expect(result[1].title).toEqual(expectedResult[1].title);
  });
});

describe("constructAttractionsItems", () => {
  test("should return correctly constructed attractionsItems", () => {
    const result = constructAttractionsItems([
      {
        id: 0,
        name: "Höfn",
        description: "<div/>",
        latitude: 65.345,
        longitude: -22.643,
        location: "Reykjavík",
        reviewTotalScore: "4",
        reviewTotalCount: 4,
        image: mockQueryImage0,
        url: "",
      },
      {
        id: 1,
        name: "Jökulsárgljúfur",
        description: "<div/>",
        latitude: 65.345,
        longitude: -22.643,
        location: "Reykjavík",
        reviewTotalScore: "4",
        reviewTotalCount: 4,
        image: mockQueryImage0,
        url: "",
      },
      {
        id: 2,
        name: "Stykkishólmur",
        description: "<div/>",
        latitude: 65.345,
        longitude: -22.643,
        location: "Reykjavík",
        reviewTotalScore: "4",
        reviewTotalCount: 4,
        image: mockQueryImage0,
        url: "",
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Höfn",
        description: "<div/>",
      },
      {
        id: "1",
        title: "Jökulsárgljúfur",
        description: "<div/>",
      },
      {
        id: "2",
        title: "Stykkishólmur",
        description: "<div/>",
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
    expect(result[1].id).toEqual(expectedResult[1].id);
    expect(result[1].title).toEqual(expectedResult[1].title);
    expect(result[2].id).toEqual(expectedResult[2].id);
    expect(result[2].title).toEqual(expectedResult[2].title);
  });
});

describe("constructContentTemplates", () => {
  test("should return correctly constructed contentTemplates", () => {
    expect(constructContentTemplates([mockQueryContentTemplate0])).toEqual([mockContentTemplate0]);
  });
});

describe("constructItinerary", () => {
  test("should return correctly constructed itinerary", () => {
    expect(constructItinerary([mockQueryItineraryItem0])).toEqual([mockItineraryItem0]);
  });
  test("should return correctly constructed itinerary with buttonImage as null value", () => {
    expect(constructItinerary([mockQueryItineraryItemWithEmptyContentTemplate])).toEqual([
      mockItineraryItemWithEmptyContentTemplate,
    ]);
  });
});

describe("constructGuideLanguages", () => {
  test("should return undefined when languages is undefined", () => {
    expect(constructGuideLanguages(undefined)).toEqual(undefined);
  });
  test("should return undefined when languages is empty", () => {
    expect(constructGuideLanguages([])).toEqual(undefined);
  });
  test("should return correctly constructed languages string", () => {
    expect(
      constructGuideLanguages([
        {
          name: "Icelandic",
        },
        {
          name: "English",
        },
        {
          name: "Spanish",
        },
      ])
    ).toEqual("Icelandic, English, Spanish");
  });
});

describe("constructGuides", () => {
  test("should return correctly constructed guides", () => {
    expect(constructGuides([mockQueryGuide0])).toEqual([mockGuide0]);
  });
  test("should return coverImage as images if images are empty", () => {
    expect(constructGuides([mockQueryGuide1])).toEqual([mockGuide1]);
  });
});

describe("constructTour", () => {
  test("should return correctly construced tour with two images", () => {
    expect(constructTour(Marketplace.GUIDE_TO_ICELAND, mockQueryTour0)).toEqual(mockTour0);
  });
  test("should return correctly construced tour with only one image", () => {
    expect(constructTour(Marketplace.GUIDE_TO_ICELAND, mockQueryTour1)).toEqual(mockTour1);
  });
  test("should return undefined for empty tour", () => {
    expect(constructTour(Marketplace.GUIDE_TO_ICELAND, undefined)).toEqual(undefined);
  });
});

describe("getCountryLatAndLongForMarketPlace", () => {
  const GTI = Marketplace.GUIDE_TO_ICELAND;
  const GTTP = Marketplace.GUIDE_TO_THE_PHILIPPINES;
  const GTE = Marketplace.GUIDE_TO_EUROPE;
  const NTG = Marketplace.NORWAY_TRAVEL_GUIDE;

  test("should return the Icelandic country coordinates if in GTI", () => {
    const result = getCountryLatAndLongForMarketPlace(GTI, [mockQueryAttraction01]);
    expect(result).toEqual(coordsByMarketplace[GTI]);
  });
  test("should return the Philippines country coordinates if in GTTP", () => {
    const result = getCountryLatAndLongForMarketPlace(GTTP, [mockQueryAttraction02]);
    expect(result).toEqual(coordsByMarketplace[GTTP]);
  });
  test("should return the average value for lat & long if not GTI or GTTP", () => {
    const result01 = getCountryLatAndLongForMarketPlace(GTE, [mockQueryAttraction01]);
    const result02 = getCountryLatAndLongForMarketPlace(NTG, [mockQueryAttraction02]);
    expect(result01).not.toEqual(coordsByMarketplace[GTI]);
    expect(result02).not.toEqual(coordsByMarketplace[GTTP]);
  });
  test("should return 0 for both latitude and longitude if no attractions", () => {
    const result = getCountryLatAndLongForMarketPlace(GTTP, []);
    expect(result).toEqual({ latitude: 0, longitude: 0 });
  });
});
