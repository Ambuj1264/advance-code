import {
  constructBestPlaces,
  constructBestPlacesFilters,
  convertRawBestPlacesFilter,
  convertRawBestPlacesFilters,
  normalizeBestPlacesCoverData,
  normalizeDestinationName,
} from "./bestPlacesUtils";
import {
  mockBestPlace0,
  mockBestPlacesFilter0,
  mockBestPlacesFilters0,
  mockCover,
  mockMapData,
  mockQueryBestPlace0,
  mockQueryBestPlacesFilters0,
  mockQueryBestPlacesPageHeader,
  mockRawBestPlacesFilter0,
} from "./bestPlacesMockData";

import { mockQueryImage1 } from "utils/mockData/mockGlobalData";
import { constructMapData, StartingLocationTypes } from "components/ui/Map/utils/mapUtils";

describe("constructBestPlaces", () => {
  it("should correctly convert from a queryBestPlaces to a bestPlaces with nofollow tag", () => {
    expect(constructBestPlaces([mockQueryBestPlace0])).toEqual([mockBestPlace0]);
  });

  describe("sets up the nofollow property", () => {
    it("nofollow=true tag when the product does not have translation", () => {
      expect(
        constructBestPlaces([
          {
            ...mockQueryBestPlace0,
            hasTranslation: false,
          },
        ])
      ).toEqual([
        {
          ...mockBestPlace0,
          nofollow: true,
        },
      ]);
    });

    it("nofollow=false when the products have translation", () => {
      expect(
        constructBestPlaces([
          {
            ...mockQueryBestPlace0,
            hasTranslation: true,
          },
        ])
      ).toEqual([
        {
          ...mockBestPlace0,
          nofollow: false,
        },
      ]);
    });
  });
});

describe("convertRawBestPlacesFilter", () => {
  it("should correctly convert from a rawBestPlacesFilter to a bestPlacesFilter", () => {
    expect(convertRawBestPlacesFilter(mockRawBestPlacesFilter0)).toEqual(mockBestPlacesFilter0);
  });
});

describe("convertRawBestPlacesFilters", () => {
  it("should correctly convert from a queryBestPlacesFilters to a bestPlacesFilters", () => {
    expect(convertRawBestPlacesFilters(mockQueryBestPlacesFilters0)).toEqual(
      mockBestPlacesFilters0
    );
  });
});

describe("constructBestPlacesFilters", () => {
  it("should return the defaultFilters if the activeFilters are undefined", () => {
    expect(constructBestPlacesFilters(mockBestPlacesFilters0, undefined)).toEqual(
      mockBestPlacesFilters0
    );
  });

  it("should return the filters with the correctly disabled options", () => {
    expect(
      constructBestPlacesFilters(mockBestPlacesFilters0, {
        destinations: [],
        attractions: [mockBestPlacesFilter0],
      })
    ).toEqual({
      destinations: [{ ...mockBestPlacesFilter0, disabled: true }],
      attractions: [{ ...mockBestPlacesFilter0, disabled: false }],
    });
  });
});

describe("normalizeBestPlacesCoverData", () => {
  it("should correctly convert from a queryBestPlacesPageHeader to a coverData", () => {
    expect(normalizeBestPlacesCoverData(mockQueryBestPlacesPageHeader)).toEqual({
      name: mockCover.name,
      image: mockCover.image,
    });
  });
});

describe("getDefaultMapData", () => {
  it("should return map data object", () => {
    expect(
      constructMapData({
        isMobile: false,
        frontBestPlacesMapImage: mockQueryImage1,
        searchAnyLocationString: "Iceland",
        defaultCoords: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        startingLocationTypes: [StartingLocationTypes.COUNTRY],
      })
    ).toEqual({
      ...mockMapData,
      location: "Iceland",
      latitude: 64.922772,
      longitude: -18.257224,
      staticMapImage: {
        id: mockQueryImage1.id.toString(),
        url: mockQueryImage1.url,
        name: mockQueryImage1.name,
      },
    });
  });

  it("should return map data object without defaultCoords", () => {
    expect(
      constructMapData({
        isMobile: false,
        frontBestPlacesMapImage: mockQueryImage1,
        searchAnyLocationString: "Iceland",
        startingLocationTypes: [StartingLocationTypes.COUNTRY],
      })
    ).toEqual({
      ...mockMapData,
      location: "Iceland",
      latitude: 64.922772,
      longitude: -18.257224,
      staticMapImage: {
        id: mockQueryImage1.id.toString(),
        url: mockQueryImage1.url,
        name: mockQueryImage1.name,
      },
    });
  });
});

describe("normalizeDestinationName", () => {
  it("should return normalized destination name", () => {
    expect(normalizeDestinationName("Varmahlíð, Iceland")).toEqual("Varmahlíð");
    expect(normalizeDestinationName("Reykjavík")).toEqual("Reykjavík");
    expect(normalizeDestinationName(undefined)).toEqual("");
  });
});
