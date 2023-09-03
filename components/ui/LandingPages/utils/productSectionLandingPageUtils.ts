import memoizeOne from "memoize-one";

import {
  constructGraphCMSImage,
  getCityName,
  getCountryName,
  getCountry,
} from "./landingPageUtils";

import { getGraphCMSFlagImage, gteImgixUrl } from "utils/imageUtils";
import { Availability, GraphCMSPageType, GraphCMSPageVariation } from "types/enums";
import { getProductSlugFromHref } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import {
  constructGTETourProductSpecs,
  constructGTEToursValueProps,
} from "components/features/GTETourProductPage/utils/gteTourUtils";
import Icon from "components/ui/GraphCMSIcon";

export const getStayAvailabilityName = (availability: Availability, t: TFunction) => {
  switch (availability) {
    case Availability.FREE:
    case Availability.FORFREE:
      return t("Free");
    case Availability.AVAILABLE:
    case Availability.FOR_FEE:
    case Availability.FOR_A_FEE:
    case Availability.ISAVAILABLE:
      return t("Available");
    default:
      return t("Not available");
  }
};

export const constructStayProductSpecs = (
  quickfacts: StayTypes.QueryQuickfact[],
  parkingAvailability: Availability,
  wifiAvailability: Availability,
  breakfastAvailability: Availability,
  starClass: number,
  subType: string,
  maxOccupancy: number,
  t: TFunction
) => {
  return quickfacts
    .map(fact => {
      if (fact.quickfactId === "parkingAvailability") {
        return {
          ...fact,
          name: getStayAvailabilityName(parkingAvailability, t),
        };
      }
      if (fact.quickfactId === "wifiAvailability") {
        return {
          ...fact,
          name: getStayAvailabilityName(wifiAvailability, t),
        };
      }
      if (fact.quickfactId === "breakfastAvailability") {
        return {
          ...fact,
          name: getStayAvailabilityName(breakfastAvailability, t),
        };
      }
      if (fact.quickfactId === "hotelRating" && !starClass) {
        return {
          ...fact,
          name: subType,
        };
      }
      return {
        ...fact,
        name: fact.name.value || "",
      };
    })
    .filter(fact => !(maxOccupancy === 0 && fact.quickfactId === "sleeps"));
};

export const constructSharedStayContent = (
  stay: StayTypes.QuerySimilarProduct | StayTypes.QueryStayContent,
  t: TFunction
) => {
  return {
    quickfactValues: {
      starClass: stay.starClass,
      checkin: stay.checkInTime,
      checkout: stay.checkOutTime,
      distanceFromCenter: stay.distanceFromCenter,
      subtype: stay.subType?.name?.value ?? "",
      numberOfGuests: stay.maxOccupancy,
      roomTypes: stay.roomTypes || "",
      address: stay.address,
    },
    productSpecs: constructStayProductSpecs(
      stay?.quickfactList?.quickfacts ?? [],
      stay.parkingAvailability,
      stay.wifiAvailability,
      stay.breakfastAvailability,
      stay.starClass,
      stay.subType?.name?.value ?? "",
      stay?.maxOccupancy ?? 0,
      t
    ),
    productProps: stay?.valuePropsList?.valueProps,
    review: {
      totalScore: stay.reviewScore || 0,
      totalCount: stay.reviewCount || 0,
    },
  };
};

export const getMainImage = (
  images: SharedTypes.GraphCMSAsset[],
  mainImage?: SharedTypes.GraphCMSAsset
) => mainImage || images[0];

export const constructLandingPageStayProductSectionCards = memoizeOne(
  (
    sectionContent: StayTypes.QuerySimilarProduct[],
    pageVariation: GraphCMSPageVariation,
    t: TFunction
  ) => {
    const baseContent = sectionContent.map(data => {
      const placeCountry = getCountry(data?.place?.countries);
      return {
        title: data.name,
        country: getCountryName(data.place),
        image: constructGraphCMSImage(
          GraphCMSPageType.Stays,
          getMainImage(data.images, data.mainImage),
          data.name
        ),
        city: getCityName(pageVariation, data.place),
        linkUrl: data.url ?? "",
        pageType: GraphCMSPageType.StaysProductPage,
        price: data.fromPrice,
        slug: getProductSlugFromHref(data.url),
        destinationFlag: getGraphCMSFlagImage({
          image: placeCountry?.flag ?? data.place?.flag,
          customName: placeCountry?.name?.value ?? data?.place?.name?.value,
          altText: placeCountry?.name?.value ?? data?.place?.name?.value ?? data.name,
        }),
        prefetchParams: {
          metadataUri: urlToRelative(data.url ?? ""),
        },
        ...constructSharedStayContent(data, t),
      };
    });
    const sectionCards = baseContent.map(content => ({
      ...content,
      productSpecs: content.productSpecs
        .map(spec => ({
          name: spec.title,
          value: t(spec.name, content.quickfactValues),
          Icon: Icon(spec.icon.handle),
        }))
        .filter(spec => spec.value !== ""),
      productProps: content.productProps.map(prop => ({
        title: prop.title,
        Icon: Icon(prop.icon.handle),
      })),
    }));
    return sectionCards;
  }
);

export const constructLandingPageTourProductSectionCards = memoizeOne(
  (
    sectionContent: GTETourTypes.QueryTourSectionContent[],
    pageVariation: GraphCMSPageVariation,
    tourT: TFunction
  ): LandingPageTypes.LandingPageSectionCard[] =>
    sectionContent.map(data => {
      const startPlaceCountry = getCountry(data?.startPlace?.countries);
      return {
        title: data.title,
        linkUrl: data.metadataUri ?? "",
        image: constructGraphCMSImage(GraphCMSPageType.Tours, data.images[0], data.title),
        slug: getProductSlugFromHref(data.metadataUri ?? ""),
        pageType: GraphCMSPageType.TourProductPage,
        price: data.fromPrice,
        prefetchParams: {
          metadataUri: urlToRelative(data.metadataUri ?? ""),
        },
        review: {
          totalScore: data.reviewScore || 0,
          totalCount: data.reviewCount || 0,
        },
        productSpecs: constructGTETourProductSpecs(tourT, data),
        productProps: constructGTEToursValueProps(tourT, data.valuePropsList?.valueProps),
        destinationFlag: getGraphCMSFlagImage({
          image: startPlaceCountry?.flag ?? data.startPlace?.flag,
          customName: startPlaceCountry?.name?.value ?? data?.startPlace?.name?.value,
          altText: startPlaceCountry?.name?.value ?? data?.startPlace?.name?.value ?? data.title,
        }),
        country: getCountryName(data.startPlace),
        city: getCityName(pageVariation, data.startPlace),
      };
    })
);

export const constructLandingPageTGSectionCards = memoizeOne(
  (
    sectionContent: TravelGuideTypes.TGDestinationNode[]
  ): LandingPageTypes.LandingPageSectionCard[] =>
    sectionContent.map((data, index) => {
      return {
        title: `${data.name} travel guide`,
        linkUrl: data.url ?? "",
        image: constructGraphCMSImage(GraphCMSPageType.VacationPackages, {
          id: String(data.id),
          handle: data.coverImageHandle,
        }),
        description: data.description,
        slug: getProductSlugFromHref(data.url ?? ""),
        pageType: GraphCMSPageType.TravelGuides,
        prefetchParams: {
          metadataUri: urlToRelative(data.url ?? ""),
        },
        review: {
          totalScore: data.reviewScore || 0,
          totalCount: data.reviewCount || 0,
        },
        destinationFlag: {
          id: data.flagImageHandle,
          url: `${gteImgixUrl}/${data.flagImageHandle}`,
          name: data.countryName,
        },
        rank: index + 1,
        country: data.countryName,
        city: data.name,
      };
    })
);

export const isOnTypeAndTagPage = (pageVariation: GraphCMSPageVariation) =>
  pageVariation === GraphCMSPageVariation.inCityWithTypeAndTag ||
  pageVariation === GraphCMSPageVariation.inCountryWithTypeAndTag ||
  pageVariation === GraphCMSPageVariation.inContinentWithTypeAndTag;
