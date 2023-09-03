import { stringify } from "querystring";

import { pipe } from "fp-ts/lib/pipeable";
import { head as nonEmptyHead, map as nonEmptyMap, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { addDays } from "date-fns";

import { getAccommodationQueryParams } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import Icon from "components/ui/GraphCMSIcon";
import AccommodationIcon from "components/icons/accommodation.svg";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { constructImage } from "utils/globalUtils";
import {
  PageType,
  GraphCMSPageVariation,
  GraphCMSPageType,
  SupportedLanguages,
  TravelStopType,
  Marketplace,
} from "types/enums";
import {
  constructSharedStayContent,
  getStayAvailabilityName,
} from "components/ui/LandingPages/utils/productSectionLandingPageUtils";
import { constructMapData } from "components/features/Accommodation/utils/accommodationUtils";
import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import PersonsIcon from "components/icons/travellers.svg";
import BedIcon from "components/icons/hotel-bedroom.svg";
import ShowerIcon from "components/icons/bathroom-shower.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import { constructReviewScoreText } from "components/features/Reviews/utils/reviewUtils";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { constructAttractionProductSpecs } from "components/ui/TravelStop/travelStopUtils";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import {
  constructStaySearchGTEProductSpecs,
  constructStaySearchGTEProductProps,
} from "components/features/StaysSearch/utils/staySearchCardProps";
import { urlToRelative } from "utils/apiUtils";
import { encodeOccupanciesToArrayString } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

export const getStayProductPageQueryCondition = (asPath?: string) => ({
  metadataUri: asPath,
  isDisabled: false,
});

const constructNearbyPoints = (nearbyAttractions: TravelStopTypes.QueryGraphCMSAttraction[]) =>
  nearbyAttractions.map((attraction: TravelStopTypes.QueryGraphCMSAttraction, index: number) => ({
    id: index,
    type: TravelStopType.ATTRACTION,
    latitude: attraction.location.latitude,
    longitude: attraction.location.longitude,
    orm_name: attraction.title,
    title: attraction.title,
    image: constructGraphCMSImage(GraphCMSPageType.Stays, attraction.mainImage),
    reviewTotalCount: attraction.reviewCount,
    reviewTotalScore: attraction.reviewScore,
    isGoogleReview: false,
  }));

export const constructSimilarStays = ({
  cards,
  occupancies,
  dateFrom,
  dateTo,
  t,
}: {
  cards: StayTypes.SimilarStayProduct[];
  t: TFunction;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  dateFrom?: string;
  dateTo?: string;
}): SharedTypes.SimilarProduct[] =>
  cards.map(card => {
    const {
      id,
      name = "",
      productPageUrl,
      price,
      image,
      valueProps,
      quickfacts,
      userRatingAverage,
      userRatingsTotal,
    } = card;
    const linkUrl = productPageUrl
      ? `${productPageUrl}${getAccommodationQueryParams(
          undefined,
          undefined,
          undefined,
          dateFrom,
          dateTo,
          undefined,
          undefined,
          occupancies
        )}`
      : "";
    return {
      id: String(id),
      name,
      lowestPrice: price?.price ?? 0,
      lowestPriceDisplayValue: price?.priceDisplayValue,
      currency: price?.currency,
      image: constructGraphCMSImage(GraphCMSPageType.Stays, image, name),
      linkUrl,
      clientRoute: {
        route: `/${PageType.GTE_STAY}`,
        as: urlToRelative(linkUrl),
      },
      productSpecs: constructStaySearchGTEProductSpecs(t, quickfacts).slice(0, 4),
      review: {
        totalCount: userRatingsTotal ?? 0,
        totalScore: userRatingAverage ?? 0,
      },
      productProps: constructStaySearchGTEProductProps(t, valueProps),
    };
  });

export const constructAttractions = (
  attractions: TravelStopTypes.QueryGraphCMSAttraction[],
  t: TFunction
) =>
  attractions
    .filter(attraction => attraction.mainImage)
    .map(attraction => ({
      info: {
        id: attraction.id,
        title: attraction.title,
        subtitle: attraction.location.distance
          ? t("{distance} km", {
              distance: (attraction.location.distance / 1000).toFixed(1),
            })
          : undefined,
        description: attraction.description,
        image: constructGraphCMSImage(GraphCMSPageType.Stays, attraction.mainImage),
        isClickable: true,
      },
      type: TravelStopType.ATTRACTION,
      productSpecs: constructAttractionProductSpecs(t, attraction),
    }));

export const constructRoomInformation = (room: StayTypes.QueryRoom, t: TFunction) => {
  const { wifiAvailability, numberOfPersons, roomSize, bedTypes, privateShower } = room;
  return [
    {
      Icon: PersonsIcon,
      value: t("{numberOfPersons} persons", { numberOfPersons }),
    },
    {
      Icon: RoomSizeIcon,
      value: t("{roomSize}m\u00B2", { roomSize }),
    },
    ...(bedTypes
      ? [
          {
            Icon: BedIcon,
            value: bedTypes,
          },
        ]
      : []),
    {
      Icon: ShowerIcon,
      value: privateShower ? t("Private") : t("Shared"),
    },
    {
      Icon: WifiIcon,
      value: getStayAvailabilityName(wifiAvailability, t),
    },
  ];
};

const filterRoomsWithNoImage = (rooms: StayTypes.QueryRoom[] | []) => {
  return rooms.filter(room => room.images.length > 0);
};

const getImageArray = (
  mainImage?: SharedTypes.GraphCMSAsset,
  images?: SharedTypes.GraphCMSAsset[],
  hotelImages?: SharedTypes.GraphCMSAsset[]
) => [...(mainImage ? [mainImage] : []), ...(hotelImages || []), ...(images || [])];

export const constructStayContent = (
  stay: StayTypes.QueryStayContent[],
  t: TFunction
): StayTypes.StayContent =>
  pipe(
    stay as NonEmptyArray<StayTypes.QueryStayContent>,
    nonEmptyMap(data => ({
      title: data.title,
      productId: data.productId,
      images: getImageArray(data?.mainImage, data?.images, data?.hotelImages).map(image =>
        constructGraphCMSImage(GraphCMSPageType.Stays, image, data.title)
      ),
      description: data?.description,
      amenities: data?.amenities ?? [],
      rooms: filterRoomsWithNoImage(data.rooms).map(room => ({
        ...room,
        images: room?.images?.map(image => constructGraphCMSImage(GraphCMSPageType.Stays, image)),
        information: constructRoomInformation(room, t),
        roomDetails: room.roomDetails,
      })),
      mapData: constructMapData(
        1,
        data.title,
        data.reviewCount,
        data.reviewScore,
        data.location.latitude,
        data.location.longitude,
        data.address,
        constructGraphCMSImage(GraphCMSPageType.Stays, data.images[0]),
        constructNearbyPoints(data.nearbyAttractions)
      ),
      nearbyAttractions: constructAttractions(data.nearbyAttractions, t),
      ...constructSharedStayContent(data, t),
    })),
    nonEmptyHead
  );

export const getLandingPageUriQueryCondition = () => ({
  pageVariation: GraphCMSPageVariation.inContinent,
  pageType: GraphCMSPageType.Stays,
  isDeleted: false,
});

export const getAdminLinks = (id: string, productId: number) => [
  {
    name: "View page in GraphCMS",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/0eac942258914a3d9b8847cba8c03e7f/view/b73ebfffef24469492de85379f468fca/${id}`,
  },
  {
    name: "Edit data",
    url: `https://stays-importer.traveldev.app/QA?ProductId=${productId}`,
  },
];

export const constructReviews = (reviews?: StayTypes.QueryReview[]) => {
  return (
    reviews?.map(review => ({
      id: review?.authorName ?? "",
      text: review?.text ?? "",
      userName: review?.authorName ?? "",
      userAvatarImage: review.profilePhotoUrl
        ? constructImage({
            id: review?.authorName ?? "",
            url: review.profilePhotoUrl,
            name: review.authorName,
          })
        : undefined,
      reviewScore: review.rating,
      reviewScoreText: constructReviewScoreText(review.rating),
      createdDate: review?.relativeTimeDescription ?? "",
      isVerified: true,
    })) ?? []
  );
};

export const getStaySearchUrl = ({
  searchId,
  selectedDates,
  occupancies,
  productTitle,
  productId,
  url,
}: {
  searchId: string;
  selectedDates: SharedTypes.SelectedDates;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  productTitle: string;
  productId: number;
  url?: string;
}) => {
  if (!url) return "";
  const { from, to } = selectedDates;

  return `${url}?${stringify({
    address: productTitle,
    occupancies: encodeOccupanciesToArrayString(occupancies),
    dateFrom: getFormattedDate(from || new Date(), yearMonthDayFormat),
    dateTo: getFormattedDate(to || addDays(new Date(), 1), yearMonthDayFormat),
    id: productId,
    type: "PRODUCT",
    searchId,
  })}`;
};

export const constructAmenities = (t: TFunction, amenities?: StayTypes.IconItem[]) =>
  (amenities?.map(amenity => ({
    id: amenity.id,
    title: t(amenity.title.value),
    Icon: amenity.icon ? Icon(amenity.icon?.handle) : AccommodationIcon,
  })) as SharedTypes.Icon[]) ?? [];

export const isStaysPageIndexed = (isIndexed: boolean, locale: SupportedLanguages) =>
  hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]!.some(
    enabledLocale => locale === enabledLocale
  ) && isIndexed;

export const constructGTIStaticRooms = (t: TFunction, rooms?: AccommodationTypes.Room[]) => {
  if (!rooms) return [];
  return rooms.map((room: StayTypes.Room) => ({
    roomTypeId: room.id,
    roomTypeName: room.name,
    images: room.images,
    productSpecs: room.information,
    roomDetails: constructAmenities(t, room?.roomDetails ?? []),
  })) as StayBookingWidgetTypes.StaticRoom[];
};
