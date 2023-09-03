import memoizeOne from "memoize-one";

import { MapPointType, Marketplace, TourType, TourTypes } from "types/enums";
import { constructImage, constructImages } from "utils/globalUtils";
import { decodeHtmlEntity, getIdFromName } from "utils/helperUtils";
import TourRoute from "components/icons/tour-route.svg";
import DayTourIcon from "components/icons/traveler.svg";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructProductSpecs } from "components/ui/Information/informationUtils";
import CameraIcon from "components/icons/camera-1.svg";
import HorseIcon from "components/icons/outdoors-horse.svg";
import CarIcon from "components/icons/car.svg";
import WhaleIcon from "components/icons/whale-water.svg";
import SnowMobileIcon from "components/icons/skiing-snow-scooter-person.svg";
import HelecopterIcon from "components/icons/aircraft-chopper.svg";
import BoatIcon from "components/icons/sailing-boat-water-1.svg";
import { convertImage } from "utils/imageUtils";
import SnorklingIcon from "components/icons/diving-mask.svg";
import HikingIcon from "components/icons/trekking-person.svg";
import HotSpringIcon from "components/icons/sauna-heat-stone.svg";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";

export const isFreeCancellation = (durationInSeconds: number) => durationInSeconds < 86400;

export const constructShouldBringItems = (shouldBringItems: ReadonlyArray<SharedTypes.QueryItem>) =>
  shouldBringItems.map(({ id, name }) => ({
    id: id.toString(),
    title: name,
  }));

export const constructIncludedItems = (includedItems: ReadonlyArray<SharedTypes.QueryItem>) =>
  includedItems
    .filter(item => item.included)
    .map(({ id, name }) => ({
      id: id.toString(),
      title: name,
      checkList: true,
    }));

const getActivityIcon = (id: number) => {
  switch (id) {
    case 15:
      return CameraIcon;
    case 13:
      return HorseIcon;
    case 370:
      return CarIcon;
    case 14:
      return WhaleIcon;
    case 10:
      return SnowMobileIcon;
    case 366:
      return HelecopterIcon;
    case 18:
      return BoatIcon;
    case 3:
      return SnorklingIcon;
    case 2:
      return HikingIcon;
    case 251:
      return HotSpringIcon;
    default:
      return DayTourIcon;
  }
};
export const constructActivityItems = (activityItems: ReadonlyArray<SharedTypes.QueryItem>) =>
  activityItems.map(({ id, name }) => ({
    id: id.toString(),
    title: name,
    Icon: getActivityIcon(id),
  }));

export const constructAttractionsItems = (attractionsItems: ReadonlyArray<QueryAttraction>) =>
  attractionsItems.map(({ id, name, description, image, url }) => ({
    id: id.toString(),
    title: name,
    description,
    Icon: DayTourIcon,
    image: convertImage(image),
    isClickable: true,
    url,
  }));

export const constructContentTemplateImage = (image: QueryImage, name: string) => ({
  id: image.id.toString(),
  url: image.url.split("?")[0],
  name,
});

export const constructContentTemplateImages = (
  images: ReadonlyArray<QueryImage>,
  name: string
): Image[] => {
  return images.map((image: QueryImage) => constructContentTemplateImage(image, name));
};

export const constructContentTemplates = (contentTemplates: ReadonlyArray<QueryContentTemplate>) =>
  contentTemplates.map(({ id, name, information, items }) => ({
    id: id.toString(),
    name,
    information,
    items: items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      information: item.information,
      images: constructContentTemplateImages(item.images, item.name),
    })),
  }));

export const constructItineraryContentTemplates = (
  itineraryContentTemplates: QueryItineraryContentTemplate[]
): ItineraryContentTemplates[] =>
  itineraryContentTemplates.map(({ id, contentTemplates }) => ({
    id,
    contentTemplates: constructContentTemplates(contentTemplates),
  }));

export const constructItinerary = (itinerary: ReadonlyArray<QueryItineraryItem>) =>
  itinerary.map(({ id, day, name, information, image, contentTemplates }) => ({
    id: id.toString(),
    numberOfDay: day.toString(),
    name,
    information: information || "",
    image: constructImage(image),
    hasContentTemplates: contentTemplates.length > 0,
  }));

export const constructGuideLanguages = (languages?: ReadonlyArray<QueryLanguage>) =>
  !languages || languages.length === 0
    ? undefined
    : languages.map((language: QueryLanguage) => language.name).join(", ");

export const constructGuides = (guides: ReadonlyArray<QueryGuide>) =>
  guides.map(({ id, name, information, avatarImage, images, coverImage, linkUrl, languages }) => {
    const queryImages: ReadonlyArray<QueryImage> = [...(coverImage ? [coverImage] : []), ...images];
    return {
      id: id.toString(),
      name,
      information,
      avatarImage: constructImage(avatarImage),
      images: constructImages(queryImages),
      linkUrl,
      languages: constructGuideLanguages(languages),
    };
  });

export const constructAttractionMapData = (attraction: Readonly<QueryAttraction>) => {
  return {
    id: attraction.id,
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    orm_name: MapPointType.ATTRACTION,
    type: MapPointType.ATTRACTION,
    title: attraction.name,
    image: convertImage(attraction.image),
    reviewTotalCount: attraction.reviewTotalCount,
    reviewTotalScore: Number(attraction.reviewTotalScore),
    isGoogleReview: false,
  };
};

const getAverageFromArr = (arr: number[]) => arr.reduce((acc, v) => acc + v) / arr.length;

export const coordsByMarketplace = {
  [Marketplace.GUIDE_TO_ICELAND]: {
    latitude: 64.922772,
    longitude: -18.257224,
  },
  [Marketplace.GUIDE_TO_THE_PHILIPPINES]: {
    latitude: 12.879721,
    longitude: 121.774017,
  },
  [Marketplace.GUIDE_TO_EUROPE]: undefined,
  [Marketplace.ICELAND_PHOTO_TOURS]: undefined,
  [Marketplace.NORWAY_TRAVEL_GUIDE]: undefined,
};

export const getCountryLatAndLongForMarketPlace = (
  marketplace: Marketplace,
  attractions: ReadonlyArray<QueryAttraction>
) => {
  const hasAttractions = attractions?.length > 0;
  const defaultLatAndLong = {
    latitude: 0,
    longitude: 0,
  };
  const marketPlaceCoords = coordsByMarketplace[marketplace];

  if (hasAttractions) {
    const averageLatAndLong = {
      latitude: getAverageFromArr(attractions.map(a => a.latitude)),
      longitude: getAverageFromArr(attractions.map(a => a.longitude)),
    };
    return marketPlaceCoords || averageLatAndLong;
  }
  return defaultLatAndLong;
};

const constructMapData = memoizeOne(
  (attractions: ReadonlyArray<QueryAttraction>, marketplace: Marketplace) => {
    return {
      location: attractions[0]?.location ?? "",
      ...getCountryLatAndLongForMarketPlace(marketplace, attractions),
      zoom: getMapZoom(true, true),
      points: attractions.map(constructAttractionMapData),
      options: {
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      },
      isCountryMap: true,
    };
  }
);

export const constructTour = (marketplace: Marketplace, tour?: QueryTour): Tour | undefined => {
  if (!tour) return undefined;

  return {
    id: tour.id.toString(),
    url: tour.url,
    currency: tour.currency,
    name: tour.name,
    establishment: {
      name: tour.establishment.name,
      url: tour.establishment.url,
    },
    isIndexed: tour.isIndexed,
    isLivePricing: tour.isLivePricing,
    tourType: tour.tourType,
    information: tour.information,
    additionalInformation: tour.additionalInformation || undefined,
    images: constructImages(tour.images, tour.image),
    reviewTotalScore: Number(tour.reviewTotalScore),
    reviewTotalCount: tour.reviewTotalCount,
    shouldBringItems: constructShouldBringItems(tour.shouldBringItems),
    includedItems: constructIncludedItems(tour.includedItems),
    activityItems: constructActivityItems(tour.activityItems),
    attractionsItems: constructAttractionsItems(tour.attractionsItems),
    mapData: constructMapData(tour.attractionsItems, marketplace),
    contentTemplates: constructContentTemplates(tour.contentTemplates),
    itinerary: constructItinerary(tour.itinerary),
    videoUrl: tour.videoUrl,
    guides: constructGuides(tour.guides),
    isFreePickup: tour.isFreePickup,
    props: constructProductProps(tour.props),
    specs: constructProductSpecs(tour.specs),
    transport: {
      pickup: tour.transport.pickup,
      enableNotKnown: tour.transport.enableNotKnown,
      required: tour.transport.required,
      price: tour.transport.price,
      pickupType: tour.transport.pickupType,
      places: tour.transport.places,
      departureNote:
        tour.transport.departureNote === null ? undefined : tour.transport.departureNote,
    },
    metadata: tour.metadata,
    lowestPriceGroupSize: tour.priceGroups.adults.lowestPriceGroupSize,
    localePrice: tour.localePrice,
  };
};

export const constructTourSections = (tour?: Tour): Array<TourSection> | null => {
  if (!tour) return null;

  const includedItemsSection: ReadonlyArray<IncludedItemsSection> =
    tour.includedItems.length === 0
      ? []
      : [
          {
            kind: "includedItems",
            id: "includedItems",
            linkTitle: "Included",
            includedItems: tour.includedItems,
          },
        ];
  const activityItemsSection: ReadonlyArray<ActivityItemsSection> =
    tour.activityItems.length === 0
      ? []
      : [
          {
            kind: "activityItems",
            id: "activityItems",
            linkTitle: "Activities",
            activityItems: tour.activityItems,
          },
        ];
  const attractionsItemsSection: ReadonlyArray<AttractionsItemsSection> =
    tour.attractionsItems.length === 0
      ? []
      : [
          {
            kind: "attractionsItems",
            id: "attractionsItems",
            linkTitle: "Attractions",
            attractionsItems: tour.attractionsItems,
            mapData: tour.mapData,
          },
        ];
  const itinerarySection: ReadonlyArray<ItinerarySection> =
    tour.itinerary.length === 0
      ? []
      : [
          {
            kind: "itinerary",
            id: "itinerary",
            linkTitle: "Itinerary",
            itinerary: tour.itinerary,
          },
        ];
  const shouldBringItemsSection: ReadonlyArray<ShouldBringItemsSection> =
    tour.shouldBringItems.length === 0
      ? []
      : [
          {
            kind: "shouldBringItems",
            id: "shouldBringItems",
            linkTitle: "What to bring",
            shouldBringItems: tour.shouldBringItems.map(shouldBringItem => ({
              ...shouldBringItem,
              title: decodeHtmlEntity(shouldBringItem.title),
            })),
          },
        ];
  const additionalInformationSection: ReadonlyArray<AdditionalInformationSection> =
    !tour.additionalInformation
      ? []
      : [
          {
            kind: "additionalInformation",
            id: "additionalInformation",
            linkTitle: "Good to know",
            additionalInformation: tour.additionalInformation,
          },
        ];
  const contentTemplatesSections: ReadonlyArray<ContentTemplateSection> = tour.contentTemplates.map(
    (contentTemplate: ContentTemplate) => {
      const id = getIdFromName(contentTemplate.name);
      return {
        kind: "contentTemplate",
        id,
        linkTitle: contentTemplate.name,
        contentTemplate,
      };
    }
  );
  const videoSection: ReadonlyArray<VideoSection> = !tour.videoUrl
    ? []
    : [
        {
          kind: "video",
          id: "video",
          linkTitle: "Video",
          videoUrl: tour.videoUrl,
        },
      ];
  const guidesSection: ReadonlyArray<GuidesSection> =
    tour.guides.length === 0
      ? []
      : [
          {
            kind: "guides",
            id: "guides",
            linkTitle: "Guides",
            guides: tour.guides,
          },
        ];
  const reviewsSection: ReadonlyArray<ReviewSection> =
    tour.reviewTotalCount === 0
      ? []
      : [
          {
            kind: "reviews",
            id: "reviews",
            linkTitle: "Reviews",
            reviewTotalScore: Number(tour.reviewTotalScore),
            reviewTotalCount: tour.reviewTotalCount,
          },
        ];
  return [
    {
      kind: "information",
      id: "information",
      linkTitle: "Info",
      information: tour.information,
      specs: tour.specs,
    },
    ...includedItemsSection,
    ...attractionsItemsSection,
    ...activityItemsSection,
    ...itinerarySection,
    ...shouldBringItemsSection,
    ...additionalInformationSection,
    ...contentTemplatesSections,
    ...videoSection,
    ...guidesSection,
    ...reviewsSection,
    {
      kind: "similarTours",
      id: "similarTours",
      linkTitle: "Similar tours",
    },
  ];
};

export const getTourIconByType = (tourType: TourTypes) => {
  switch (tourType) {
    case TourType.Package:
    case TourType.SelfDrive: {
      return TourRoute;
    }

    default: {
      return DayTourIcon;
    }
  }
};
