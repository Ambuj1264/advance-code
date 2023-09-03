import {
  constructedRes,
  mockConstructedHotelCard,
  mockDestination,
  mockFlightTitle,
  mockGeneralTitle,
  mockGeneralTitleInput,
  mockHotelSectioncard,
  mockOrigin,
  tgQueryRes,
} from "../travelGuideMockData";

import {
  constructTGContent,
  constructTGSectionsContent,
  getFlightTitle,
  getGeneralTitle,
  getSearchWidgetActiveTab,
  constructTGDestinationSections,
  getIntroSectionObj,
  constructTableOfContents,
  getServicesObjects,
  getSearchWidgetContext,
} from "./travelGuideUtils";

import { GraphCMSPageType } from "types/enums";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";

const fakeTranslate = (value: string) => value;

// TODO: IMPROVE TESTS

describe("getIntroSectionObj", () => {
  test("should return introduction to destination section", () => {
    expect(
      getIntroSectionObj(
        tgQueryRes.title,
        fakeTranslate as TFunction,
        "Reykjavik, with an area of 274.5 square kilometers, is the capital and largest city of Iceland. The city is known for its many famous attractions such as the great Hallgrimskirkja Church and the captivating Harpa Concert Hall and Conference Center."
      )
    ).toEqual({
      description:
        "Reykjavik, with an area of 274.5 square kilometers, is the capital and largest city of Iceland. The city is known for its many famous attractions such as the great Hallgrimskirkja Church and the captivating Harpa Concert Hall and Conference Center.",
      id: "tgd-intro-section",
      sectionType: "IntroductionConstant",
      title: "Introduction to {title}",
    });
  });
});

describe("constructTableOfContents", () => {
  test("should return correctly constructed table of contents", () => {
    expect(
      constructTableOfContents(
        getIntroSectionObj(
          constructedRes.title,
          fakeTranslate as TFunction,
          constructedRes.description
        ),
        constructedRes.sections
      )
    ).toEqual(constructedRes.tableOfContents);
  });
});

describe("constructTGContent", () => {
  test("should return correctly constructed travel guide content with the title of each section", () => {
    expect(constructTGContent(tgQueryRes, fakeTranslate as TFunction)).toEqual(constructedRes);
  });
});

describe("getFlightTitle", () => {
  test("should return correct title for flight section cards", () => {
    expect(getFlightTitle(fakeTranslate as TFunction, mockOrigin, mockDestination)).toEqual(
      mockFlightTitle
    );
  });
});

describe("getGeneralTitle", () => {
  test("should return correct title for non flight section cards", () => {
    expect(
      getGeneralTitle(
        mockGeneralTitleInput.subType,
        mockGeneralTitleInput.title,
        fakeTranslate as TFunction,
        mockGeneralTitleInput.origin,
        mockGeneralTitleInput.destination,
        mockGeneralTitleInput.activeLocale,
        mockGeneralTitleInput.splitTitle
      )
    ).toEqual(mockGeneralTitle);
  });
});

describe("constructTGDestinationSections", () => {
  test("should return correctly constructed travel guide sections", () => {
    expect(
      constructTGDestinationSections(tgQueryRes.sections, [], fakeTranslate as TFunction)
    ).toEqual(constructedRes.sections);
  });
});

describe("constructTGSectionsContent", () => {
  test("should return correctly constructed landing page section", () => {
    expect(
      constructTGSectionsContent(mockHotelSectioncard, fakeTranslate as TFunction, undefined)
    ).toEqual(mockConstructedHotelCard);
  });
});

describe("getSearchWidgetActiveTab", () => {
  test("should return correct searchwidget tab depending on input", () => {
    expect(getSearchWidgetActiveTab(GraphCMSPageType.Tours)).toEqual({
      searchTab: SearchTabsEnum.Trips,
      title: "Experiences",
    });
    expect(getSearchWidgetActiveTab(GraphCMSPageType.VpProductPage)).toEqual({
      searchTab: SearchTabsEnum.VacationPackages,
      title: "Vacations",
    });
    expect(getSearchWidgetActiveTab(GraphCMSPageType.Flights)).toEqual({
      searchTab: SearchTabsEnum.Flights,
      title: "Flights",
    });
    expect(getSearchWidgetActiveTab(GraphCMSPageType.Stays)).toEqual({
      searchTab: SearchTabsEnum.Stays,
      title: "Stays",
    });
    expect(getSearchWidgetActiveTab(GraphCMSPageType.Cars)).toEqual({
      searchTab: SearchTabsEnum.Cars,
      title: "Cars",
    });
  });
});

describe("getServicesObjects", () => {
  test("should return array of service objects containing pageType and metadataUri", () => {
    expect(getServicesObjects([mockHotelSectioncard])).toEqual([
      {
        metadataUri: "/iceland/best-hotels-and-places-to-stay/in-reykjavik",
        pageType: "Stays",
      },
    ]);
  });
});

describe("getSearchWidgetContext", () => {
  test("should return correct search widget context for each type of search widget", () => {
    expect(
      getSearchWidgetContext(GraphCMSPageType.Tours, SearchTabsEnum.Trips, constructedRes.place)
    ).toEqual({
      activeSearchTab: SearchTabsEnum.Trips,
      tripStartingLocationId: "CITY:905",
      tripStartingLocationName: "Reykjavik",
    });
    expect(
      getSearchWidgetContext(
        GraphCMSPageType.VpProductPage,
        SearchTabsEnum.VacationPackages,
        constructedRes.place
      )
    ).toEqual({
      activeSearchTab: SearchTabsEnum.VacationPackages,
      vacationDefaultDestinationId: "city:REK",
      vacationDefaultDestinationName: "Reykjavik",
      vacationDefaultOriginId: undefined,
      vacationDefaultOriginName: undefined,
      vacationDestinationId: "city:REK",
      vacationDestinationName: "Reykjavik",
      vacationOriginId: undefined,
      vacationOriginName: undefined,
    });
    expect(
      getSearchWidgetContext(GraphCMSPageType.Flights, SearchTabsEnum.Flights, constructedRes.place)
    ).toEqual({
      activeSearchTab: SearchTabsEnum.Flights,
      flightDefaultDestinationId: "city:REK",
      flightDefaultDestinationName: "Reykjavik",
      flightDefaultOriginId: undefined,
      flightDefaultOriginName: undefined,
      flightDestinationId: "city:REK",
      flightDestinationName: "Reykjavik",
      flightOriginId: undefined,
      flightOriginName: undefined,
    });
    expect(
      getSearchWidgetContext(GraphCMSPageType.Stays, SearchTabsEnum.Stays, constructedRes.place)
    ).toEqual({
      accommodationAddress: "Reykjavik",
      accommodationSubtype: "Hotel",
      accommodationType: "CITY",
      activeSearchTab: SearchTabsEnum.Stays,
    });
    expect(
      getSearchWidgetContext(GraphCMSPageType.Cars, SearchTabsEnum.Cars, constructedRes.place)
    ).toEqual({
      activeSearchTab: SearchTabsEnum.Cars,
      carDropoffLocationId: "1171,1",
      carDropoffLocationName: "Reykjavik",
      carPickupLocationId: "1171,1",
      carPickupLocationName: "Reykjavik",
    });
  });
});
