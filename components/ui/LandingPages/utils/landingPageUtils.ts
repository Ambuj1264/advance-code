import { pipe } from "fp-ts/lib/pipeable";
import { head as nonEmptyHead, map as nonEmptyMap, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import memoizeOne from "memoize-one";

import IconLoading from "components/ui/utils/IconLoading";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { getGraphCMSFlagImage, getImgixImageFromGraphCMS, gteImgixUrl } from "utils/imageUtils";
import { getDriverCountryFromLocalStorage } from "utils/localStorageUtils";
import { getDriverCountryWithDefault } from "components/ui/CarSearchWidget/utils/carSearchWidgetUtils";
import {
  GraphCMSDisplayType,
  GraphCMSPageType,
  GraphCMSPageVariation,
  GraphCMSSectionAdjective,
  GraphCMSSubType,
  Marketplace,
  PageType,
  SupportedLanguages,
} from "types/enums";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import CustomNextDynamic from "lib/CustomNextDynamic";

const GTEIcon = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});
const VacationIcon = CustomNextDynamic(() => import("components/icons/vacation-widget-icon.svg"), {
  loading: IconLoading,
});
const TravelerIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const BedroomIcon = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});
const CarIcon = CustomNextDynamic(() => import("components/icons/car.svg"), {
  loading: IconLoading,
});
const FlightIcon = CustomNextDynamic(() => import("components/icons/plane-1.svg"), {
  loading: IconLoading,
});
const PinIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});

export const defaultSEOImage = {
  id: "ckn7t7kko7eh20b61nbvnbw5l",
  url: `${gteImgixUrl}/XaXMglrtSoqPcU3CxOQu`,
  name: "airplane",
};

export const defaultCarSEOImage = {
  id: "ckqjj3luwl2e20d17qi8vtndk",
  url: `${gteImgixUrl}/RpzOn7FKSfWLMpA6TUrk`,
  name: "road",
};

export const defaultStaySEOImage = {
  id: "ckvl0xoxs6qyq0b61iianjk55",
  url: `${gteImgixUrl}/t2NQlNGASw29a2qIN0Qs`,
  name: "stay",
};

export const defaultTourSEOImage = {
  id: "cl1p9cs7qckx30empryo4x77s",
  handle: "HFgPM3a9TKG7smlGFRUQ",
  url: `${gteImgixUrl}/HFgPM3a9TKG7smlGFRUQ`,
  name: "tour",
};

export const defaultVacationPackagesSearchSEOImage = {
  id: "ckn7t7kko7eh20b61nbvnbw5l",
  url: `${gteImgixUrl}/7hUfZOYSTB2FVUPY50Jv`,
  name: "vacation-packages-search",
};

export const defaultVacationPackagesSEOImage = {
  id: "V7VDnCT5RCGFAwvG2Mmq",
  url: `${gteImgixUrl}/V7VDnCT5RCGFAwvG2Mmq`,
  name: "vacation-packages",
};

export const getDefaultImage = (pageType: GraphCMSPageType) => {
  if (pageType === GraphCMSPageType.Cars) {
    return defaultCarSEOImage;
  }
  if (pageType === GraphCMSPageType.Stays) {
    return defaultStaySEOImage;
  }
  if (pageType === GraphCMSPageType.VacationPackages) {
    return defaultVacationPackagesSEOImage;
  }
  if (pageType === GraphCMSPageType.Tours) {
    return defaultTourSEOImage;
  }
  return defaultSEOImage;
};
export const constructGraphCMSImage = (
  pageType: GraphCMSPageType,
  image?: SharedTypes.GraphCMSAsset,
  customImageName?: string
) => {
  const imgixImage = getImgixImageFromGraphCMS(image, customImageName);
  if (imgixImage) {
    return imgixImage;
  }
  return getDefaultImage(pageType);
};

export const constructGraphCMSSEOImage = constructGraphCMSImage;

export const getContinentGroup = (
  origin?: LandingPageTypes.Place,
  destination?: LandingPageTypes.Place
) => {
  if (destination) {
    return destination.continentGroup || [];
  }
  return origin?.continentGroup ?? [];
};

const getSplitTitle = (value: string, splitOnValue: string) => {
  const shouldSplit = value.indexOf(splitOnValue);
  return {
    smallTitle: value.slice(0, shouldSplit),
    title: value.slice(shouldSplit),
  };
};

export const getCardTitle = (cardTitle: string, destinationName?: string, originName?: string) => {
  if (destinationName && originName && cardTitle.includes(originName)) {
    const { title } = getSplitTitle(cardTitle, originName);
    return title;
  }
  return cardTitle;
};

export const getCountry = (countries?: LandingPageTypes.Place[]) => {
  if (!countries) return undefined;
  const mainCountry = countries.find(country => country.isMainCountry);
  if (mainCountry) return mainCountry;
  return countries[0];
};

export const getCountryName = (
  destination?: LandingPageTypes.Place,
  origin?: LandingPageTypes.Place
) => {
  if (destination) {
    const destinationCountry = getCountry(destination.countries);
    return destinationCountry ? destinationCountry?.name?.value : destination?.name?.value;
  }
  const originCountry = getCountry(origin?.countries);
  return originCountry ? originCountry?.name?.value : origin?.name?.value;
};

const getImage = (
  useSubTypeImage?: boolean,
  subTypeImage?: SharedTypes.GraphCMSAsset,
  useGoogleStaticImage?: boolean,
  staticMap?: SharedTypes.GraphCMSAsset,
  destination?: LandingPageTypes.Place,
  origin?: LandingPageTypes.Place
) => {
  if (useSubTypeImage) {
    return subTypeImage;
  }
  if (useGoogleStaticImage) {
    return staticMap;
  }
  if (destination) {
    const destinationCountry = getCountry(destination.countries);
    return (destination.mainImage || destination.images?.[0]) ?? destinationCountry?.mainImage;
  }
  if (origin) {
    const originCountry = getCountry(origin?.countries);
    return origin?.mainImage || originCountry?.mainImage;
  }
  return undefined;
};

export const getSubTypeModifierTitle = (
  sectionAdjective?: GraphCMSSectionAdjective,
  subTypeModifiers?: LandingPageTypes.SubTypeModifier[],
  defaultValue?: string
) => {
  const filteredSubTypeModifiers =
    subTypeModifiers?.filter(modifier => modifier.modifierType === sectionAdjective) ?? [];
  if (filteredSubTypeModifiers.length > 0) {
    return filteredSubTypeModifiers[0].modifierTitle.value;
  }
  return defaultValue;
};

export const constructLandingPageSideImageSectionCards = memoizeOne(
  (
    sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[],
    useGoogleStaticImage?: boolean,
    useSubTypeImage?: boolean,
    useSubTypeTitle?: boolean,
    sectionAdjective?: GraphCMSSectionAdjective
  ): LandingPageTypes.LandingPageSectionCard[] =>
    sectionContent.map(
      ({
        linkUrl,
        slug,
        title,
        destinationNumberOfPlaces,
        pageType,
        destination,
        origin,
        pageVariation,
        subType,
        staticMap,
      }) => {
        const image = getImage(
          useSubTypeImage,
          subType?.typeImage,
          useGoogleStaticImage,
          staticMap,
          destination,
          origin
        );
        const destinationCountry = getCountry(destination?.countries);
        const originCountry = getCountry(origin?.countries);
        const dynamicTitle = (useSubTypeTitle ? subType?.name?.value : title) || title;
        const pluralType = subType?.pluralName?.value ?? undefined;
        const subTypeModifier = getSubTypeModifierTitle(
          sectionAdjective,
          subType?.subTypeModifiers,
          pluralType
        );
        return {
          title: dynamicTitle,
          subtitle: destinationNumberOfPlaces
            ? `${destinationNumberOfPlaces} available airports`
            : undefined,
          country: getCountryName(destination, origin),
          slug: slug !== null ? slug : undefined,
          image: constructGraphCMSImage(pageType, image, title),
          linkUrl: linkUrl ?? "",
          destinationFlag: getGraphCMSFlagImage({
            image: destinationCountry?.flag ?? destination?.flag,
            customName: destinationCountry?.name?.value ?? destination?.name?.value,
            altText: destinationCountry?.name?.value ?? destination?.name?.value ?? dynamicTitle,
          }),
          pageType,
          origin,
          destination,
          subtype: subType?.name?.value,
          pluralType,
          parentType: subType?.parentSubType?.name?.value,
          pluralParentType: subType?.parentSubType?.pluralName?.value,
          subTypeModifier,
          prefetchParams: {
            subtype: subType?.subtype,
            tagId: subType?.tagId,
            pageVariation,
            originName: origin?.name?.value,
            destinationName: destination?.name?.value,
            originCountry: originCountry?.name?.value,
            destinationCountry: destinationCountry?.name?.value,
            metadataUri: linkUrl,
          },
        };
      }
    )
);

export const constructLandingPageImageSectionCards = memoizeOne(
  (
    sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[],
    useGoogleStaticImage?: boolean,
    useSubTypeImage?: boolean,
    useSubTypeTitle?: boolean,
    sectionAdjective?: GraphCMSSectionAdjective
  ): LandingPageTypes.LandingPageSectionCard[] =>
    sectionContent.map(
      ({
        linkUrl,
        slug,
        title,
        pageType,
        destination,
        origin,
        subType,
        pageVariation,
        staticMap,
      }) => {
        const image = getImage(
          useSubTypeImage,
          subType?.typeImage,
          useGoogleStaticImage,
          staticMap,
          destination,
          origin
        );

        const dynamicTitle = (useSubTypeTitle ? subType?.pluralName?.value : title) || title;
        const destinationCountry = getCountry(destination?.countries);
        const originCountry = getCountry(origin?.countries);
        const pluralType = subType?.pluralName?.value ?? undefined;
        const subTypeModifier = getSubTypeModifierTitle(
          sectionAdjective,
          subType?.subTypeModifiers,
          pluralType
        );
        return {
          title: getCardTitle(dynamicTitle, destination?.name?.value, origin?.name?.value),
          country: getCountryName(destination, origin),
          slug: slug !== null ? slug : undefined,
          image: constructGraphCMSImage(pageType, image, title),
          originFlag: getGraphCMSFlagImage({
            image: originCountry?.flag ?? origin?.flag,
            customName: originCountry?.name?.value ?? origin?.name?.value,
            altText: originCountry?.name?.value ?? origin?.name?.value ?? dynamicTitle,
          }),
          destinationFlag: getGraphCMSFlagImage({
            image: destinationCountry?.flag ?? destination?.flag,
            customName: destinationCountry?.name?.value ?? destination?.name?.value,
            altText: destinationCountry?.name?.value ?? destination?.name?.value ?? dynamicTitle,
          }),
          linkUrl: linkUrl ?? "",
          pageType,
          subtype: subType?.name?.value,
          pluralType,
          parentType: subType?.parentSubType?.name?.value,
          pluralParentType: subType?.parentSubType?.pluralName?.value,
          subTypeModifier,
          origin,
          destination,
          prefetchParams: {
            subtype: subType?.subtype,
            tagId: subType?.tagId,
            pageVariation,
            originName: origin?.name?.value,
            destinationName: destination?.name?.value,
            originCountry: originCountry?.name?.value,
            destinationCountry: destinationCountry?.name?.value,
            metadataUri: linkUrl,
          },
        };
      }
    )
);

export const getCityName = (
  pageVariation: GraphCMSPageVariation,
  place?: LandingPageTypes.Place
) => {
  if (
    (pageVariation === GraphCMSPageVariation.inCity ||
      pageVariation === GraphCMSPageVariation.inCityWithType ||
      pageVariation === GraphCMSPageVariation.inCountry ||
      pageVariation === GraphCMSPageVariation.inCountryWithType) &&
    Boolean(place?.countries)
  ) {
    return place?.name?.value;
  }
  return undefined;
};

export const splitUpTitle = (title: string, originName?: string, destinationName?: string) => {
  if (originName) {
    return getSplitTitle(title, originName);
  }
  if (destinationName) {
    return getSplitTitle(title, destinationName);
  }
  return {
    smallTitle: "",
    title,
  };
};

export const getPlaceName = (
  pageTitle: string,
  activeLocale: SupportedLanguages,
  place?: LandingPageTypes.Place
) => {
  if (activeLocale === SupportedLanguages.Polish) {
    const shouldSplit = pageTitle?.indexOf(" ", pageTitle.indexOf(" ") + 1);
    return pageTitle?.substr(shouldSplit + 1);
  }
  return place?.name?.value;
};

export const constructLandingPageImageWithActionSectionCards = memoizeOne(
  (
    sectionContent: LandingPageTypes.QueryLandingPageSectionCardData[],
    activeLocale: SupportedLanguages
  ): LandingPageTypes.LandingPageSectionCard[] =>
    sectionContent.map(
      ({
        linkUrl,
        title: pageTitle,
        slug,
        pageType,
        destination,
        origin,
        subType,
        pageVariation,
      }) => {
        const { smallTitle, title } = splitUpTitle(
          pageTitle,
          getPlaceName(pageTitle, activeLocale, origin),
          getPlaceName(pageTitle, activeLocale, destination)
        );
        const image = destination ? destination.mainImage : origin?.mainImage;
        const destinationCountry = getCountry(destination?.countries);
        const originCountry = getCountry(origin?.countries);
        return {
          smallTitle,
          title,
          image: constructGraphCMSImage(pageType, image, pageTitle),
          country: getCountryName(destination, origin),
          slug: slug !== null ? slug : undefined,
          originFlag: getGraphCMSFlagImage({
            image: originCountry?.flag ?? origin?.flag,
            customName: originCountry?.name?.value ?? origin?.name?.value,
            altText: originCountry?.name?.value ?? origin?.name?.value ?? title,
          }),
          destinationFlag: getGraphCMSFlagImage({
            image: destinationCountry?.flag ?? destination?.flag,
            customName: destinationCountry?.name?.value ?? destination?.name?.value,
            altText: destinationCountry?.name?.value ?? destination?.name?.value ?? title,
          }),
          linkUrl: linkUrl ?? "",
          pageType,
          prefetchParams: {
            subtype: subType?.subtype,
            pageVariation,
            originName: origin?.name?.value,
            destinationName: destination?.name?.value,
            originCountry: originCountry?.name?.value,
            destinationCountry: destinationCountry?.name?.value,
            metadataUri: linkUrl,
          },
        };
      }
    )
);

export const getNrOfSideImageSectionCardsOnPage = () => {
  return 12;
};

export const constructLandingPageFAQs = (faqs: SharedTypes.Question[]) =>
  faqs.filter(({ question, answer }) => question && answer && question !== "." && answer !== ".");

export const replaceDriverCountry = (link: string, driverCountry: string) =>
  link.replace(/driverCountryCode=[a-z]{2,}/gi, `driverCountryCode=${driverCountry}`);

const getCoverImage = (data: LandingPageTypes.LandingPageQueryContent) => {
  if (data.pageVariation.includes("Continent") && data.image) {
    return data.image;
  }
  if (data.destination) {
    return data.destination?.mainImage || data.destination?.images?.[0];
  }
  return data.origin?.mainImage;
};

export const constructLandingPageContent = memoizeOne(
  (content: LandingPageTypes.LandingPageQueryContent[], countryCode: string) =>
    pipe(
      content as NonEmptyArray<LandingPageTypes.LandingPageQueryContent>,
      nonEmptyMap(data => {
        const mainImage = getCoverImage(data);
        const driverCountry =
          getDriverCountryFromLocalStorage() || getDriverCountryWithDefault(countryCode);
        const subtitle = data.subtitle?.includes("nofollow")
          ? data.subtitle
          : data.subtitle?.replace("<a ", "<a rel='nofollow' ");
        const pageType = data.pageType as GraphCMSPageType;
        return {
          flightOriginId: data.origin?.flightId,
          originName: data.origin?.name?.value,
          flightDestinationId: data.destination?.flightId,
          carOriginId: data.origin?.carId,
          carDestinationId: data.destination?.carId,
          stayId: data.destination?.stayId,
          destinationName: data.destination?.name?.value,
          id: data.id,
          uniqueId: data.uniqueId,
          metadata: {
            title: data.metadataTitle,
            description: data.metadataDescription,
          },
          title: data.title,
          subtitle: subtitle ? replaceDriverCountry(subtitle, driverCountry) : undefined,
          image: constructGraphCMSImage(pageType, mainImage, data.title),
          videoId: mainImage?.videoId,
          videoStartingTime: mainImage?.videoStartingTime,
          videoEndTime: mainImage?.videoEndTime,
          seoImage: constructGraphCMSSEOImage(pageType, mainImage, data.title),
          subType: data.subType?.subtype,
          pageVariation: data.pageVariation,
          origin: data.origin,
          destination: data.destination,
          pageType: data.pageType,
        };
      }),
      nonEmptyHead
    )
);

export const getLandingPageBreadcrumbs = (
  marketplaceUrl: string,
  breadcrumbs?: SharedTypes.BreadcrumbData[],
  customLastBreadcrumb?: string
) => {
  if (breadcrumbs) {
    return [
      ...(breadcrumbs?.map(breadcrumb => ({
        ...breadcrumb,
        url: `${marketplaceUrl}${breadcrumb.url}`,
      })) ?? []),
      ...(customLastBreadcrumb
        ? [
            {
              url: "",
              name: customLastBreadcrumb,
            },
          ]
        : []),
    ];
  }
  return [];
};

export const getSectionLandingPageType = (type: GraphCMSPageType | PageType) => {
  switch (type) {
    case GraphCMSPageType.GTIFlights:
    case GraphCMSPageType.GTTPFlights:
    case GraphCMSPageType.Flights:
      return PageType.FLIGHTSEARCH;
    case GraphCMSPageType.Cars:
      return PageType.GTE_CAR_SEARCH;
    case GraphCMSPageType.Stays:
      return PageType.GTE_STAYS_SEARCH;
    case GraphCMSPageType.StaysProductPage:
      return PageType.GTE_STAY;
    case GraphCMSPageType.CountryPage:
      return PageType.GTE_COUNTRY_PAGE;
    case GraphCMSPageType.VacationPackages:
      return PageType.VACATION_PACKAGES_LANDING;
    case GraphCMSPageType.VpProductPage:
      return PageType.VACATION_PACKAGE;
    case GraphCMSPageType.TourProductPage:
      return PageType.GTE_TOUR;
    case GraphCMSPageType.Tours:
      return PageType.GTE_TOUR_SEARCH;
    case GraphCMSPageType.TravelGuides:
      return PageType.TRAVEL_GUIDE_DESTINATION;
    case GraphCMSPageType.TravelGuidesLanding:
      return PageType.TRAVEL_GUIDE_LANDING;
    default:
      return type;
  }
};

export const getPlaceNames = (place?: LandingPageTypes.Place) => {
  const placeCountry = getCountry(place?.countries);
  return {
    toCity: placeCountry ? place?.toName?.value : undefined,
    toCountry: placeCountry ? placeCountry.toName?.value : place?.toName?.value,
    inCity: placeCountry ? place?.inName?.value : undefined,
    inCountry: placeCountry ? placeCountry.inName?.value : place?.inName?.value,
    fromCity: placeCountry ? place?.fromName?.value : undefined,
    fromCountry: placeCountry ? placeCountry.fromName?.value : place?.fromName?.value,
    city: placeCountry ? place?.name?.value : undefined,
    country: placeCountry ? placeCountry?.name?.value : place?.name?.value,
    destinationAirport: placeCountry ? place?.name?.value || place?.defaultName?.value : undefined,
  };
};

export const constructPlaceNames = memoizeOne(
  (
    origin?: LandingPageTypes.Place,
    destination?: LandingPageTypes.Place,
    type?: string,
    pluralType?: string,
    parentType?: string,
    pluralParentType?: string,
    subTypeModifier?: string
  ) => {
    const originNames = getPlaceNames(origin);
    const destinationNames = getPlaceNames(destination);
    return {
      toDestinationCity: destinationNames.toCity,
      toOriginCity: originNames.toCity,
      toDestinationCountry: destinationNames.toCountry,
      toOriginCountry: originNames.toCountry,
      fromDestinationCity: destinationNames.fromCity,
      fromOriginCity: originNames.fromCity,
      fromDestinationCountry: destinationNames.fromCountry,
      fromOriginCountry: originNames.fromCountry,
      inDestinationCity: destinationNames.inCity,
      inOriginCity: originNames.inCity,
      inDestinationCountry: destinationNames.inCountry,
      inOriginCountry: originNames.inCountry,
      inDestinationCountryOrOriginCountry: destination
        ? destinationNames.inCountry
        : originNames.inCountry,
      destinationCountryOrOriginCountry: destination
        ? destinationNames.country
        : originNames.country,
      type,
      pluralType: pluralType || type,
      subtypeModifierPluralType: subTypeModifier,
      parentType,
      pluralParentType,
      destinationCity: destinationNames.city,
      destinationCountry: destinationNames.country,
      originCity: originNames.city,
      originCountry: originNames.country,
      destinationAirport: destinationNames.destinationAirport,
    };
  }
);

export const setSubType = (subtype?: string) =>
  subtype && subtype !== GraphCMSSubType.VP_TOP_LEVEL ? { subType: { subtype } } : {};

export const getWhereCondition = ({
  sectionId,
  domains,
}: {
  sectionId: number;
  domains: GraphCMSPageType[];
}): LandingPageTypes.Where => ({
  domain_in: domains,
  sectionId,
});

const getAccommodationType = (pageVariation: GraphCMSPageVariation) => {
  switch (pageVariation) {
    case GraphCMSPageVariation.guide:
    case GraphCMSPageVariation.inCountry:
    case GraphCMSPageVariation.inCountryWithType:
      return "COUNTRY";
    case GraphCMSPageVariation.inCity:
    case GraphCMSPageVariation.inCityWithType:
      return "CITY";
    default:
      return undefined;
  }
};

export const getAccommodationLocation = (
  stayId?: string,
  destinationName?: string,
  pageVariation?: GraphCMSPageVariation
) => {
  const shouldAddLocation = pageVariation && !pageVariation.toLowerCase().includes("continent");
  const accommodationAddress = shouldAddLocation ? destinationName : undefined;
  const accommodationId = shouldAddLocation ? stayId : undefined;
  const accommodationType = shouldAddLocation ? getAccommodationType(pageVariation!) : undefined;
  return { accommodationAddress, accommodationId, accommodationType };
};

export const getTourId = (destination?: LandingPageTypes.Place) => {
  if (!destination) return undefined;
  const isCity = Boolean(destination?.countries && destination?.countries.length > 0);
  if (isCity) {
    return `CITY:${destination.tourId}`;
  }
  return `COUNTRY:${destination.tourId}`;
};

export const getDestinationCountryCode = (
  destination?: LandingPageTypes.Place,
  pageVariation?: GraphCMSPageVariation
) => {
  const shouldAddCountryCode = pageVariation && !pageVariation.toLowerCase().includes("continent");
  if (!destination || !shouldAddCountryCode) return undefined;
  const isCity = Boolean(destination?.countries?.length);
  if (isCity) {
    const destinationCountry = getCountry(destination?.countries);
    return destinationCountry?.alpha2Code;
  }
  return destination?.alpha2Code;
};

export const getTourLocation = (
  destination?: LandingPageTypes.Place,
  pageVariation?: GraphCMSPageVariation
) => {
  const shouldAddLocation = pageVariation && !pageVariation.toLowerCase().includes("continent");
  const tourId = getTourId(destination);
  const tripStartingLocationName = shouldAddLocation ? destination?.name?.value : undefined;
  const tripStartingLocationId = shouldAddLocation ? tourId : undefined;
  return { tripStartingLocationId, tripStartingLocationName };
};

export const getAdminLinks = (id?: string, nlgContentId?: string) => [
  ...(id
    ? [
        {
          name: "View page in GraphCMS",
          url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/bbf56b01828a47ccaa3cadc90eef8c35/view/e600721e5a2d404b89f09c6c54647bfd/${id}`,
        },
      ]
    : []),
  ...(nlgContentId
    ? [
        {
          name: "View NLG template in GraphCMS",
          url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/bbc9cfcc405043ab8a7a7c4ad2940285/view/28f45835f7d640ae89a55d9ad6ac341e/${nlgContentId}`,
        },
      ]
    : []),
];

export const getHrefLangLocales = (marketplace: Marketplace) =>
  hreflangLocalesByMarketplace[marketplace];

export const getPlaceMetaInfo = (
  place: LandingPageTypes.Place
): {
  countryPlaceId?: string;
  country?: string;
  alpha2?: string;
  cityPlaceId?: string;
  city?: string;
} => {
  if (place.countries && place.countries.length > 0 && place.name) {
    return {
      countryPlaceId: place.countries[0].id,
      country: place.countries[0].name?.value,
      alpha2: place.countries[0].alpha2Code,
      cityPlaceId: place.id,
      city: place.name?.value,
    };
  }
  // handles vp metadata.
  if (place.country) {
    return {
      countryPlaceId: place.country.id,
      country: place.country.name?.value,
      alpha2: place.country.alpha2Code,
      city: place.name?.value,
      cityPlaceId: place.id,
    };
  }
  if (place.countries?.length === 0 && place.name) {
    return {
      countryPlaceId: place.id,
      country: place.name.value,
      alpha2: place.alpha2Code,
    };
  }
  return {};
};

export const constructMetadata = (
  metadata: LandingPageTypes.QueryMetadata
): LandingPageTypes.Metadata => {
  const { image } = metadata;
  const isImageArray = Array.isArray(image);
  const singleImageArray = !isImageArray && image ? [getImgixImageFromGraphCMS(image)!] : [];
  return {
    ...metadata,
    images: isImageArray
      ? image.map(img => getImgixImageFromGraphCMS(img)!)
      : (singleImageArray as Image[]),
  };
};

export const getSectionTitleIcon = (pageType: GraphCMSPageType, isFirstSection: boolean) => {
  switch (pageType) {
    case GraphCMSPageType.VacationPackages:
      return VacationIcon;
    case GraphCMSPageType.Stays:
      return BedroomIcon;
    case GraphCMSPageType.Cars:
      return CarIcon;
    case GraphCMSPageType.Flights:
      return FlightIcon;
    case GraphCMSPageType.Tours:
      return TravelerIcon;
    case GraphCMSPageType.TravelGuides:
    case GraphCMSPageType.TravelGuidesLanding:
      return PinIcon;
    case GraphCMSPageType.FrontPage:
      return GTEIcon;
    case GraphCMSPageType.CountryPage:
      return !isFirstSection ? GTEIcon : undefined;
    default:
      return undefined;
  }
};

const domainOrder = [
  GraphCMSPageType.VacationPackages,
  GraphCMSPageType.Flights,
  GraphCMSPageType.Stays,
  GraphCMSPageType.Cars,
  GraphCMSPageType.Tours,
  GraphCMSPageType.TravelGuidesLanding,
];

export const sortServices = memoizeOne(
  (services: LandingPageTypes.QueryLandingPageSectionCardData[]) => {
    return services.sort((a, b) => {
      return domainOrder.indexOf(a.pageType) - domainOrder.indexOf(b.pageType);
    });
  }
);

export const getGraphCmsPaginationParams = ({
  numberOfItems,
  nextPageId,
  prevPageId,
}: {
  numberOfItems?: number;
  nextPageId?: string;
  prevPageId?: string;
}) => {
  return {
    ...(!nextPageId && !prevPageId
      ? {
          first: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
        }
      : {}),
    // we have to select either next/prev page but not both as the result will be empty
    ...(nextPageId && !prevPageId
      ? {
          first: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
          after: nextPageId,
        }
      : {}),
    ...(!nextPageId && prevPageId
      ? {
          last: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
          before: prevPageId,
        }
      : {}),
  };
};
export const getIsWithType = (
  sectionType?: GraphCMSPageVariation,
  isFrontOrCountry: boolean | undefined = false
) =>
  sectionType === GraphCMSPageVariation.inContinentWithType ||
  (sectionType === GraphCMSPageVariation.inCountryWithType && isFrontOrCountry);

export const getNrOfImageWithActionSectionCardsOnPage = () => {
  return 8;
};

export const getNrOfImageCardSectionCardsOnPage = (
  isLargeImage: boolean,
  isFrontOrCountry: boolean,
  isWithType: boolean
) => {
  if (isWithType) return 6;
  if (isLargeImage && isFrontOrCountry) return 8;
  if (isLargeImage || isFrontOrCountry) return 12;
  return 24;
};

export const getNrOfSectionProductCardsOnPage = (isFrontOrCountry: boolean) => {
  if (isFrontOrCountry) return 4;
  return 8;
};

export const getNrOfItemsPerPage = (
  displayType: GraphCMSDisplayType,
  sectionType?: GraphCMSPageVariation,
  isFrontOrCountry: boolean | undefined = false
) => {
  const isWithType = getIsWithType(sectionType, isFrontOrCountry);

  switch (displayType) {
    case GraphCMSDisplayType.IMAGE_WITH_ACTION:
      return getNrOfImageWithActionSectionCardsOnPage();

    case GraphCMSDisplayType.IMAGE_WITH_SVG_ICON:
    case GraphCMSDisplayType.IMAGE:
      return getNrOfImageCardSectionCardsOnPage(false, isFrontOrCountry, isWithType);

    case GraphCMSDisplayType.LARGE_IMAGE:
      return getNrOfImageCardSectionCardsOnPage(true, isFrontOrCountry, isWithType);

    case GraphCMSDisplayType.SIDE_IMAGE:
      return getNrOfSideImageSectionCardsOnPage();

    case GraphCMSDisplayType.PRODUCT_CARD:
    case GraphCMSDisplayType.TG_CARD: {
      return getNrOfSectionProductCardsOnPage(isFrontOrCountry);
    }

    default:
      return 13;
  }
};
