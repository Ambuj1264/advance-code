import { getIcon } from "./accommodationIconUtils";

import { constructImages } from "utils/globalUtils";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructProductSpecs } from "components/ui/Information/informationUtils";
import TravellerIcon from "components/icons/travellers.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import BreakfastIcon from "components/icons/breakfast.svg";
import BedroomIcon from "components/icons/bedroom-hotel.svg";
import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import BathroomIcon from "components/icons/bathroom-shower.svg";
import { convertImage } from "utils/imageUtils";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";
import { MapPointType } from "types/enums";

export const formatTime = (time: string) => time.slice(0, time.lastIndexOf(":"));

export const constructAmenitiesItems = (amenitiesItems: ReadonlyArray<SharedTypes.QueryItem>) =>
  amenitiesItems.map(({ id, name }) => ({
    id: id.toString(),
    title: name,
    Icon: getIcon(id),
  }));

export const constructNearbyItems = (nearbyItems?: SharedTypes.MapPoint[]) =>
  nearbyItems?.map(({ id, title, image, url }) => ({
    id: id.toString(),
    title,
    image,
    url,
  })) ?? [];

export const constructRoomFacts = (
  room: AccommodationTypes.QueryRoom,
  wifiAvailable: boolean,
  wifiPrice: number,
  breakfastAvailable: boolean,
  t: TFunction
): SharedTypes.ProductSpec[] => {
  const freeWifi = wifiAvailable && wifiPrice === 0;
  return [
    ...(room.size > 0
      ? [
          {
            Icon: RoomSizeIcon,
            name: t("Room size"),
            value: `${room.size} m2`,
          },
        ]
      : []),
    {
      Icon: TravellerIcon,
      name: t("Accommodates"),
      value: t("{numberOfPersons} persons", {
        numberOfPersons: room.maxPersons.toString(),
      }),
    },
    ...(room.privateBathroom > 0
      ? [
          {
            Icon: BathroomIcon,
            name: t("Bathroom"),
            value: t("Private"),
          },
        ]
      : []),
    ...(breakfastAvailable
      ? [
          {
            Icon: BreakfastIcon,
            name: t("Breakfast"),
            value: t("Available"),
          },
        ]
      : []),
    ...(freeWifi
      ? [
          {
            Icon: WifiIcon,
            name: t("Wifi"),
            value: t("Free"),
          },
        ]
      : []),
    ...(room.bedOptions !== ""
      ? [
          {
            Icon: BedroomIcon,
            name: t("Bed options"),
            value: room.bedOptions,
          },
        ]
      : []),
  ];
};

export const constructRoomImages = (images: ReadonlyArray<QueryImage>) => {
  return images.map((image: QueryImage) => ({
    id: image.id.toString(),
    url: image.url.split("?")[0],
    name: image.name,
  }));
};

export const constructRooms = (
  rooms: ReadonlyArray<AccommodationTypes.QueryRoom>,
  wifiAvailable: boolean,
  wifiPrice: number,
  breakfastAvailable: boolean,
  t: TFunction
) =>
  rooms.map((room: AccommodationTypes.QueryRoom) => {
    return {
      id: room.id.toString(),
      name: room.name,
      images: constructRoomImages(room.roomImages),
      information: constructRoomFacts(room, wifiAvailable, wifiPrice, breakfastAvailable, t),
    };
  });

export const constructMapData = (
  id: number,
  name: string,
  reviewTotalCount: number,
  reviewTotalScore: number,
  latitude: number,
  longitude: number,
  location: string,
  image?: QueryImage,
  nearbyPoints?: SharedTypes.MapPoint[]
) => {
  const hotelMapPoint = {
    id,
    latitude,
    longitude,
    orm_name: MapPointType.HOTEL,
    type: MapPointType.HOTEL,
    title: name,
    image: image ? convertImage(image) : undefined,
    reviewTotalCount,
    reviewTotalScore,
    isGoogleReview: false,
    excludeFromClusterisation: true,
  } as SharedTypes.MapPoint;
  return {
    latitude,
    longitude,
    location,
    zoom: getMapZoom(false, false),
    points: [...(nearbyPoints || []), hotelMapPoint],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  };
};

export const constructAccommodation = (
  accommodation: AccommodationTypes.QueryAccommodation,
  t: TFunction,
  nearbyPoints?: SharedTypes.MapPoint[]
): AccommodationTypes.Accommodation => {
  return {
    id: accommodation.id,
    name: accommodation.name,
    url: accommodation.url,
    minDays: accommodation.minDays,
    basePrice: accommodation.basePrice || 10000,
    type: accommodation.type,
    isSingleUnit: accommodation.isSingleUnit,
    cover: {
      name: accommodation.name,
      images: constructImages(accommodation.images, accommodation.image),
    },
    information: accommodation.information,
    category: accommodation.category,
    amenitiesItems: constructAmenitiesItems(accommodation.amenities),

    nearbyItems: constructNearbyItems(nearbyPoints),
    mapData: constructMapData(
      accommodation.id,
      accommodation.name,
      accommodation.reviewTotalCount,
      Number(accommodation.reviewTotalScore),
      accommodation.latitude,
      accommodation.longitude,
      accommodation.location,
      accommodation.image,
      nearbyPoints
    ),
    rooms: constructRooms(
      accommodation.rooms,
      accommodation.wifiAvailable,
      accommodation.wifiPrice,
      accommodation.breakfastAvailable,
      t
    ),
    localePrice: accommodation.localePrice,
    props: constructProductProps(accommodation.props),
    specs: constructProductSpecs(accommodation.specs),
    reviewTotalScore: Number(accommodation.reviewTotalScore),
    reviewTotalCount: accommodation.reviewTotalCount,
    showReviews: accommodation.showReviews,
    isHighlight: accommodation.isHighlight,
    isAvailable: accommodation.isAvailable,
  };
};

export const constructAccommodationSections = (
  accommodation: AccommodationTypes.Accommodation
): Array<AccommodationTypes.AccommodationSection> => {
  const amenitiesItemsSection: ReadonlyArray<AccommodationTypes.AmenitiesSection> =
    accommodation.amenitiesItems.length === 0
      ? []
      : [
          {
            kind: "amenitiesItems",
            id: "amenitiesItems",
            linkTitle: "Amenities",
            amenitiesItems: accommodation.amenitiesItems,
          },
        ];
  const nearbyItemsSection: ReadonlyArray<AccommodationTypes.NearbySection> =
    accommodation.nearbyItems.length === 0
      ? []
      : [
          {
            kind: "nearbyItems",
            id: "nearbyItems",
            linkTitle: "Nearby",
            nearbyItems: accommodation.nearbyItems,
            mapData: accommodation.mapData,
          },
        ];
  const roomSection: AccommodationTypes.RoomTypesSection[] =
    accommodation.rooms.length === 0
      ? []
      : [
          {
            kind: "rooms",
            id: "roomSelection",
            linkTitle: "All available rooms",
          },
        ];
  const reviewsSection: ReadonlyArray<ReviewSection> =
    accommodation.reviewTotalCount === 0
      ? []
      : [
          {
            kind: "reviews",
            id: "reviews",
            linkTitle: "Reviews",
            reviewTotalScore: Number(accommodation.reviewTotalScore),
            reviewTotalCount: accommodation.reviewTotalCount,
          },
        ];
  return [
    {
      kind: "information",
      id: "information",
      linkTitle: "Info",
      information: accommodation.information,
    },
    ...roomSection,
    ...nearbyItemsSection,
    ...amenitiesItemsSection,
    ...reviewsSection,
    {
      kind: "similarAccommodations",
      id: "similarAccommodations",
      linkTitle: {
        key: "Nearby {categoryName}",
        options: {
          categoryName: accommodation.category.name,
        },
      },
    },
  ];
};
