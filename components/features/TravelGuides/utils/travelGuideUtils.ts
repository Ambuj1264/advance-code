import { TGDSectionType } from "../types/travelGuideEnums";

import {
  constructTravelStopAttractions,
  generateQuickfacts,
} from "components/ui/TravelStop/travelStopUtils";
import { urlToRelative } from "utils/apiUtils";
import {
  constructGraphCMSImage,
  getPlaceName,
  getSectionLandingPageType,
  splitUpTitle,
} from "components/ui/LandingPages/utils/landingPageUtils";
import {
  constructMapData,
  constructNearbyPoints,
} from "components/features/VacationPackageProductPage/utils/vacationPackageUtils";
import {
  GraphCMSPageType,
  GraphCMSPageVariation,
  GraphCMSSubType,
  PageType,
  StaySearchType,
  SupportedLanguages,
  TravelStopType,
} from "types/enums";
import Cars from "components/icons/car-with-white.svg";
import Flights from "components/icons/flight-with-white.svg";
import Experiences from "components/icons/person-with-white.svg";
import Hotels from "components/icons/house-with-white.svg";
import Destinations from "components/icons/pin.svg";
import Attractions from "components/icons/camera-with-white.svg";
import Information from "components/icons/information-circle-with-white.svg";
import Vacations from "components/icons/pin-flag-with-white.svg";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { getGraphCMSFlagImage, gteImgixUrl } from "utils/imageUtils";
import { getNoLineBreakDescription, getTruncationCutWithoutAnchor } from "utils/helperUtils";
import CameraIcon from "components/icons/camera-1.svg";

export const getAdminLinks = (id: string) => [
  {
    name: "View page in Hygraph",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/479136851e9c4ae99d7a289b874440d4/view/54d96ce31aa443dd9bc3c0c8a386dbe6/${id}`,
  },
];

export const getIntroSectionObj = (title: string, t: TFunction, description?: string) => {
  return {
    id: "tgd-intro-section",
    title: t(`Introduction to {title}`, {
      title,
    }),
    description: description ? t(description) : t("Description missing"),
    sectionType: TGDSectionType.IntroductionConstant,
  };
};

export const constructTableOfContents = (
  constantSection: TravelGuideTypes.DestinationSection,
  sections: TravelGuideTypes.ConstructedDestinationSection[]
) => {
  const queryContent = sections.map((section, index) => {
    return {
      caption: section.title,
      level: section.level,
      link: `#${section.id}`,
      prefix: String(index),
      imgUrl: "",
      elementId: section.sectionType,
    };
  });

  const constantContent = {
    caption: constantSection.title,
    level: 0,
    link: `#${constantSection.id}`,
    prefix: "",
    imgUrl: "",
  };

  const constructedContent = [constantContent, ...queryContent];

  return constructedContent;
};

export const constructTGDestinationSpecs = (
  quickFactsNsT: TFunction,
  destination?: TravelGuideTypes.SingleDestinationContent
): SharedTypes.ProductSpec[] => {
  const translateOptions = {
    type: destination?.type,
    country: destination?.country,
    region: destination?.region,
    timezone: destination?.timezone,
    size: destination?.size,
    population: destination?.population,
    language: destination?.language,
    yearlyVisitors:
      destination?.yearlyVisitors && destination?.yearlyVisitors > 0
        ? destination?.yearlyVisitors
        : undefined,
  };
  const quickFacts = destination?.quickfactsList?.quickfacts;

  return quickFacts ? generateQuickfacts(quickFacts, quickFactsNsT, translateOptions) : [];
};

const hasSectionImage = (sectionType: TGDSectionType) => {
  return (
    sectionType === TGDSectionType.TGDWhatToSeeDestination ||
    sectionType === TGDSectionType.ThingsToDoInDestination ||
    sectionType === TGDSectionType.VPsInDestination ||
    sectionType === TGDSectionType.WhereToStayInDestination ||
    sectionType === TGDSectionType.CarRentalInDestination ||
    sectionType === TGDSectionType.PopularDestinationsInCountry ||
    sectionType === TGDSectionType.DomesticFlightsInCountry
  );
};

export const constructTGDestinationSections = (
  sections: TravelGuideTypes.DestinationSection[],
  images: any[],
  t: TFunction
) => {
  const fallBack = [] as TravelGuideTypes.ConstructedDestinationSection[];
  let index = 0;
  const sectionImageCb = () => {
    const constructedImage = constructGraphCMSImage(
      GraphCMSPageType.VacationPackages,
      images[index]
    );
    // eslint-disable-next-line no-param-reassign
    index += 1;
    return constructedImage;
  };
  const constructed = sections.reduce((acc, section) => {
    const mainSection = {
      id: section.id,
      sectionType: section.sectionType,
      title: t(section.title),
      description: t(section.description),
      image:
        hasSectionImage(section.sectionType) && images.length > 0 ? sectionImageCb() : undefined,
      level: 0,
    };
    if (section.subSections && section.subSections?.length > 0) {
      const subSections = section.subSections.map(subSection => {
        return {
          id: subSection.id,
          sectionType: subSection.sectionType,
          title: t(subSection.title),
          description: t(subSection.description),
          image:
            subSection.sectionType === TGDSectionType.FindFlightsToDestination && images.length > 0
              ? sectionImageCb()
              : undefined,
          level: 1,
        };
      });
      return [...acc, mainSection, ...subSections];
    }
    return [...acc, mainSection];
  }, fallBack);
  return constructed;
};

export const constructDestinationsNearbyPoints = (
  destinations: TravelGuideTypes.TGDestinationNode[]
): SharedTypes.MapPoint[] => {
  return destinations.map(dest => {
    return {
      id: dest.id,
      type: TravelStopType.DESTINATION,
      latitude: dest.location?.latitude || 0,
      longitude: dest.location?.longitude || 0,
      orm_name: dest.name,
      title: dest.name,
      image: constructGraphCMSImage(GraphCMSPageType.VacationPackages, {
        id: String(dest.id),
        handle: dest.coverImageHandle,
      }),
      url: dest.url,
      reviewTotalCount: dest.reviewCount || 0,
      reviewTotalScore: dest.reviewScore || 0,
      isGoogleReview: false,
    };
  });
};

const constructTGImages = (
  images: SharedTypes.GraphCMSAsset[],
  placeImage?: SharedTypes.GraphCMSAsset,
  destinationImage?: SharedTypes.GraphCMSAsset
) => {
  if (!images) return [];
  const allImages = [...(placeImage ? [placeImage] : []), ...images, destinationImage];
  return allImages.map(image => {
    return constructGraphCMSImage(GraphCMSPageType.VacationPackages, image);
  });
};

export const constructTGBreadCrumbs = (breadCrumbs?: TravelGuideTypes.TGBreadCrumbsRes[]) => {
  if (!breadCrumbs) return [];
  return breadCrumbs.map(crumb => {
    return {
      name: crumb.title,
      url: crumb.metadataUri,
    };
  });
};

export const constructTGContent = (
  data: TravelGuideTypes.SingleDestinationContent,
  travelGuidesT: TFunction
): TravelGuideTypes.ConstructedDestinationContent => {
  const {
    id,
    attractions,
    breadcrumbs,
    place,
    title,
    metaDescription,
    description,
    mainImage,
    valuePropsList,
    sections,
  } = data;
  const constructedSections = constructTGDestinationSections(
    sections,
    place.images ?? [],
    travelGuidesT
  );
  return {
    id,
    place,
    breadCrumbs: constructTGBreadCrumbs(breadcrumbs),
    title: travelGuidesT(title),
    description: travelGuidesT(description ?? ""),
    metaDescription,
    images: constructTGImages(place.images, place.mainImage, mainImage),
    mainImage,
    valueProps: valuePropsList?.valueProps,
    sections: constructedSections,
    attractions: constructTravelStopAttractions(attractions, travelGuidesT),
    mapData: attractions[0]
      ? constructMapData(
          attractions[0].location.latitude,
          attractions[0].location.longitude,
          attractions[0].title,
          constructNearbyPoints(attractions)
        )
      : undefined,
    destinationSpecs: constructTGDestinationSpecs(travelGuidesT, data),
    tableOfContents: constructTableOfContents(
      getIntroSectionObj(title, travelGuidesT, description),
      constructedSections
    ),
  };
};

export const getClientRoute = (
  data: TravelGuideTypes.SingleSectionResult,
  place: TravelGuideTypes.DestinationPlace
) => {
  return {
    query: {
      slug: data.slug,
      country: place.country.name.value,
      destinationName: place.name.value,
      metadataUri: data.metadataUri,
      pageVariation: data.pageVariation,
    },
    as: urlToRelative(data.metadataUri),
    route: `/${getSectionLandingPageType(data.pageType)}`,
  };
};

export const getFlightTitle = (
  t: TFunction,
  origin?: LandingPageTypes.Place,
  destination?: LandingPageTypes.Place
) => {
  const shortTitle = "{originCity} {toDestinationCity}";

  const placeNames = {
    originCity: origin?.name?.value,
    toDestinationCity: destination?.toName?.value,
  };
  return { title: t(shortTitle, placeNames), smallTitle: undefined };
};

export const getGeneralTitle = (
  subType: LandingPageTypes.sectionCardSubtype,
  title: string,
  t: TFunction,
  origin?: LandingPageTypes.Place,
  destination?: LandingPageTypes.Place,
  activeLocale?: SupportedLanguages,
  splitTitle?: boolean
) => {
  const cardTitle = subType?.pluralName?.value ?? title;
  const pageTitle =
    splitTitle && activeLocale
      ? splitUpTitle(
          title,
          getPlaceName(title, activeLocale, origin),
          getPlaceName(title, activeLocale, destination)
        )
      : undefined;

  return {
    title: t(pageTitle?.title ?? cardTitle),
    smallTitle: t(pageTitle?.smallTitle ?? ""),
  };
};

export const constructTGSectionsContent = (
  data: TravelGuideTypes.SingleSectionResult,
  t: TFunction,
  isFlightSection?: boolean,
  activeLocale?: SupportedLanguages,
  splitTitle?: boolean
): TravelGuideTypes.TGConstructedSection => {
  const { id, image, staticMap, title, slug, pageType, metadataUri, subType, destination, origin } =
    data;
  const dynamicTitle = isFlightSection
    ? getFlightTitle(t, origin, destination)
    : getGeneralTitle(subType, title, t, origin, destination, activeLocale, splitTitle);
  const destCountry =
    destination?.countries && destination?.countries?.length > 0
      ? destination?.countries?.[0]
      : undefined;
  const originCountry =
    origin?.countries && origin?.countries?.length > 0 ? origin.countries?.[0] : undefined;
  return {
    id,
    image: constructGraphCMSImage(pageType, image, title),
    placeImage: constructGraphCMSImage(pageType, destination?.mainImage, title),
    staticMap: constructGraphCMSImage(pageType, staticMap, title),
    smallTitle: dynamicTitle?.smallTitle,
    title: dynamicTitle.title ?? title,
    slug,
    pageType,
    metadataUri,
    subTypeImage: subType?.typeImage
      ? constructGraphCMSImage(pageType, subType.typeImage, title)
      : undefined,
    destinationFlag: destination
      ? getGraphCMSFlagImage({
          image: destCountry ? destCountry.flag : destination?.flag,
          customName: destCountry ? destCountry.name?.value : destination?.name?.value,
          altText: destCountry ? destCountry.name?.value ?? "" : destination?.name?.value ?? "",
        })
      : undefined,
    originFlag: origin
      ? getGraphCMSFlagImage({
          image: originCountry ? originCountry.flag : origin?.flag,
          customName: originCountry ? originCountry.name?.value : origin?.name?.value,
          altText: originCountry ? originCountry.name?.value ?? "" : origin?.name?.value ?? "",
        })
      : undefined,
  };
};

export const constructDestinationsSidebar = (
  destinationQueryResult: TravelGuideTypes.TGDestinationNode[],
  t: TFunction
): LandingPageTypes.LandingPageSectionCard[] => {
  return destinationQueryResult.map(destination => {
    const noLineBreakDescription = getNoLineBreakDescription(destination.description);
    const title = t(`{title} travel guide`, {
      title: destination.name,
    });
    const seoDescription = getTruncationCutWithoutAnchor({
      content: noLineBreakDescription,
      truncationLength: 90,
    }).visibleDescription;

    return {
      title,
      linkUrl: destination.url,
      image: constructGraphCMSImage(GraphCMSPageType.VacationPackages, {
        id: destination.coverImageHandle,
        handle: destination.coverImageHandle,
        caption: title,
      }),
      pageType: PageType.TRAVEL_GUIDE_DESTINATION,
      subtitle: seoDescription,
      country: t(destination.countryName),
      destinationFlag: {
        id: `${destination.countryName}`,
        url: `${gteImgixUrl}/${destination.flagImageHandle}`,
      },
    };
  });
};

export const getSectionCondition = (
  conditions: TravelGuideTypes.TGSectionCondition[],
  pageType: TGDSectionType
) => {
  const condition = conditions.find(el => el.sectionType === pageType);
  return condition;
};

export const getServicesWhereCondition = (
  destinationPlaceId?: string
): LandingPageTypes.SectionWhere => {
  return {
    pageVariation_in: [GraphCMSPageVariation.toCity, GraphCMSPageVariation.inCity],
    isDeleted: false,
    pageType_in: [
      GraphCMSPageType.VacationPackages,
      GraphCMSPageType.Flights,
      GraphCMSPageType.Stays,
      GraphCMSPageType.Tours,
      GraphCMSPageType.Cars,
    ],
    destination: {
      id: destinationPlaceId,
    },
  };
};

export const getServicesObjects = (result?: TravelGuideTypes.SingleSectionResult[]) => {
  if (!result) return null;
  const objects = result.map(obj => {
    return {
      pageType: obj.pageType,
      metadataUri: obj.metadataUri,
    };
  });
  return objects;
};

export const findActiveService = (
  serviceObjects: {
    pageType: GraphCMSPageType;
    metadataUri: string;
  }[],
  pageType: GraphCMSPageType
) => {
  switch (pageType) {
    case GraphCMSPageType.Tours:
      return serviceObjects.find(obj => obj.pageType === GraphCMSPageType.Tours);
    case GraphCMSPageType.VpProductPage:
      return serviceObjects.find(obj => obj.pageType === GraphCMSPageType.VacationPackages);
    case GraphCMSPageType.Cars:
      return serviceObjects.find(obj => obj.pageType === GraphCMSPageType.Cars);
    case GraphCMSPageType.Stays:
      return serviceObjects.find(obj => obj.pageType === GraphCMSPageType.Stays);
    case GraphCMSPageType.Flights:
      return serviceObjects.find(obj => obj.pageType === GraphCMSPageType.Flights);
    default:
      return null;
  }
};

const getSearchWidgetPageType = (pageType: GraphCMSPageType) => {
  switch (pageType) {
    case GraphCMSPageType.Tours:
      return PageType.GTE_TOUR_SEARCH;
    case GraphCMSPageType.VpProductPage:
      return PageType.VACATION_PACKAGES_LANDING;
    case GraphCMSPageType.Stays:
      return PageType.GTE_STAYS_SEARCH;
    case GraphCMSPageType.Cars:
      return PageType.GTE_CAR_SEARCH;
    case GraphCMSPageType.Flights:
      return PageType.FLIGHTSEARCH;
    default:
      return null;
  }
};

export const getActiveServices = (
  serviceObject: {
    pageType: GraphCMSPageType;
    metadataUri: string;
  },
  pageType: GraphCMSPageType
) => {
  const activeservice = {
    isLegacy: false,
    pageType: getSearchWidgetPageType(pageType),
    title: "Find a product",
    uri: serviceObject.metadataUri,
  };

  return [activeservice];
};

export const getSearchWidgetActiveTab = (
  pageType: GraphCMSPageType
): { searchTab: SearchTabsEnum; title: string } => {
  switch (pageType) {
    case GraphCMSPageType.Tours:
      return { searchTab: SearchTabsEnum.Trips, title: "Experiences" };
    case GraphCMSPageType.VpProductPage:
      return { searchTab: SearchTabsEnum.VacationPackages, title: "Vacations" };
    case GraphCMSPageType.Flights:
      return { searchTab: SearchTabsEnum.Flights, title: "Flights" };
    case GraphCMSPageType.Stays:
      return { searchTab: SearchTabsEnum.Stays, title: "Stays" };
    case GraphCMSPageType.Cars:
      return { searchTab: SearchTabsEnum.Cars, title: "Cars" };
    default:
      return { searchTab: SearchTabsEnum.VacationPackages, title: "Search" };
  }
};

const getTripsSearchWidgetContext = (
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace
) => {
  return {
    activeSearchTab,
    tripStartingLocationName: place?.name.value,
    tripStartingLocationId: place?.tourId && `CITY:${place.tourId}`,
  };
};

const getVPSearchWidgetContext = (
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace
) => {
  return {
    activeSearchTab,
    vacationOriginName: undefined,
    vacationDefaultOriginName: undefined,
    vacationOriginId: undefined,
    vacationDefaultOriginId: undefined,
    vacationDestinationName: place?.name.value,
    vacationDestinationId: place?.flightId,
    vacationDefaultDestinationId: place?.flightId,
    vacationDefaultDestinationName: place?.name.value,
  };
};

const getFlightsSearchWidgetContext = (
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace,
  isDomestic?: boolean
) => {
  if (isDomestic)
    return {
      activeSearchTab,
      flightOriginId: place?.flightId,
      flightOriginName: place?.name.value,
      flightDestinationId: place?.countries[0]?.flightId,
      flightDestinationName: place?.countries[0]?.name.value,
      flightDefaultOriginId: place?.flightId,
      flightDefaultOriginName: place?.name.value,
      flightDefaultDestinationId: undefined,
      flightDefaultDestinationName: undefined,
    };
  return {
    activeSearchTab,
    flightOriginId: undefined,
    flightOriginName: undefined,
    flightDestinationId: place?.flightId,
    flightDestinationName: place?.name.value,
    flightDefaultOriginId: undefined,
    flightDefaultOriginName: undefined,
    flightDefaultDestinationId: place?.flightId,
    flightDefaultDestinationName: place?.name.value,
  };
};

const getStaysSearchWidgetContext = (
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace
) => {
  return {
    activeSearchTab,
    accommodationAddress: place?.name.value,
    accommodationSubtype: GraphCMSSubType.HOTEL,
    accommodationType: StaySearchType.CITY,
  };
};

const getCarsSearchWidgetContext = (
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace
) => {
  return {
    activeSearchTab,
    carPickupLocationName: place?.name.value,
    carDropoffLocationName: place?.name.value,
    carPickupLocationId: place?.carId,
    carDropoffLocationId: place?.carId,
  };
};

export const getSearchWidgetContext = (
  pageType: GraphCMSPageType,
  activeSearchTab: SearchTabsEnum,
  place: TravelGuideTypes.DestinationPlace,
  isDomestic?: boolean
) => {
  switch (pageType) {
    case GraphCMSPageType.Tours:
      return getTripsSearchWidgetContext(activeSearchTab, place);
    case GraphCMSPageType.VpProductPage:
      return getVPSearchWidgetContext(activeSearchTab, place);
    case GraphCMSPageType.Flights:
      return getFlightsSearchWidgetContext(activeSearchTab, place, isDomestic);
    case GraphCMSPageType.Stays:
      return getStaysSearchWidgetContext(activeSearchTab, place);
    case GraphCMSPageType.Cars:
      return getCarsSearchWidgetContext(activeSearchTab, place);
    default:
      return SearchTabsEnum.Trips;
  }
};

export const iconsByPageType: { [pageType: string]: React.ElementType } = {
  [GraphCMSPageType.Cars]: Cars,
  [GraphCMSPageType.Flights]: Flights,
  [GraphCMSPageType.Stays]: Hotels,
  [GraphCMSPageType.Tours]: Experiences,
  [GraphCMSPageType.Destinations]: Destinations,
  [GraphCMSPageType.Attractions]: Attractions,
  [GraphCMSPageType.Information]: Information,
  [GraphCMSPageType.VacationPackages]: Vacations,
  [GraphCMSPageType.VpProductPage]: Vacations,
};

export const constructAttractionsList = (
  attractions: TravelStopTypes.TravelStops[]
): ReadonlyArray<SharedTypes.Icon> => {
  const constructed = attractions.reduce(
    (acc: SharedTypes.Icon[], curr) => [...acc, curr.info],
    []
  );

  return constructed;
};

export const constructTGCards = (
  t: TFunction,
  page: number,
  resData?: TravelGuideTypes.TGDestinationNode[]
) => {
  if (!resData) return [];
  const destinations = resData.map((destination, index) => {
    const { id, name, description, url, coverImageHandle, flagImageHandle, countryName } =
      destination;
    const rank = (page - 1) * 12;
    return {
      id,
      linkUrl: url,
      headline: t(name),
      description,
      image: constructGraphCMSImage(GraphCMSPageType.VacationPackages, {
        id: String(id),
        handle: coverImageHandle,
      }),
      clientRoute: {
        as: url ? urlToRelative(url) : "",
        route: PageType.TRAVEL_GUIDE_DESTINATION,
      },
      flag: {
        id: flagImageHandle,
        url: `${gteImgixUrl}/${flagImageHandle}`,
        name: countryName,
      },
      rank: index + rank + 1 < 100 ? index + rank + 1 : undefined,
    };
  });

  return destinations;
};

export const constructTGIconList = (destinations: any[]) => {
  return destinations.map(dest => {
    return {
      id: String(dest.id),
      title: dest.name,
      image: {
        id: dest.coverImageHandle,
        name: dest.name,
        url: `${gteImgixUrl}/${dest.coverImageHandle}`,
      },
      Icon: CameraIcon,
      isClickable: Boolean(dest.url),
      isLargeIcon: true,
      // TODO: client route
      url: dest.url,
    };
  });
};
