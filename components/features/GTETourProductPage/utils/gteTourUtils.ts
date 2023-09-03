import { stringify } from "querystring";

import memoizeOne from "memoize-one";
import { pipe } from "fp-ts/lib/pipeable";
import { head as nonEmptyHead, map as nonEmptyMap, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";

import { GTETourQuickFacts, TourDifficultyIcon } from "../types/gteTourEnums";
import { GTETourAgeBand } from "../GTETourBookingWidget/types/enums";

import { urlToRelative } from "utils/apiUtils";
import { getFormattedDate, yearMonthDayFormat, dayMonthYearWithTimeFormat } from "utils/dateUtils";
import TravelerIcon from "components/icons/traveler.svg";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import {
  GraphCMSPageType,
  TravelStopType,
  PageType,
  SupportedLanguages,
  Marketplace,
} from "types/enums";
import {
  constructTravelStopAttractions,
  constructTravelStopDestinations,
  filterTranslationKeysMulti,
  generateQuickfacts,
} from "components/ui/TravelStop/travelStopUtils";
import Icon from "components/ui/GraphCMSIcon";
import {
  constructTourProductProps,
  filterQuickfactValues,
} from "components/features/GTETourSearchPage/utils/gteTourSearchUtils";
import { constructImage, capitalize } from "utils/globalUtils";
import { constructReviewScoreText } from "components/features/Reviews/utils/reviewUtils";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import { getIcon } from "components/ui/Information/informationUtils";

export const getTourProductPageQueryCondition = memoizeOne((asPath?: string) => ({
  metadataUri: asPath,
  isDeleted: false,
}));

export const getDifficultyIcon = (tourDifficulty?: string) => {
  switch (tourDifficulty) {
    case TourDifficultyIcon.EASY:
      return getIcon(TourDifficultyIcon.DIFFICULTY_EASY);
    case TourDifficultyIcon.MEDIUM:
      return getIcon(TourDifficultyIcon.DIFFICULTY_MODERATE);
    case TourDifficultyIcon.HARD:
      return getIcon(TourDifficultyIcon.DIFFICULTY_DEMANDING);
    default:
      return getIcon(TourDifficultyIcon.DIFFICULTY_MODERATE);
  }
};

const generateTourQuickfacts = (quickfacts: SharedTypes.ProductSpec[], tourDifficulty?: string) => {
  return quickfacts.map(quickFact => {
    return {
      ...quickFact,
      Icon:
        quickFact.quickfactId === TourDifficultyIcon.TOUR_DIFFICULTY
          ? getDifficultyIcon(tourDifficulty)
          : quickFact.Icon,
    };
  });
};

// TODO: Ask Hekla if GTETourTypes.QueryTourSectionContent can be changed into QueryTourContent
export const constructGTETourProductSpecs = (
  tourT: TFunction,
  tour?: GTETourTypes.QueryTourContent | GTETourTypes.QueryTourSectionContent,
  startingPlace?: string,
  endingPlace?: string
): SharedTypes.ProductSpec[] => {
  const unfilteredArray = [
    { key: GTETourQuickFacts.START_PLACE, value: startingPlace || tour?.startingPlace },
    { key: GTETourQuickFacts.DIFFICULTY, value: tourT(tour?.difficulty ?? "") },
    { key: GTETourQuickFacts.DURATION, value: tour?.duration },
    { key: GTETourQuickFacts.LANGUAGES, value: tour?.languages },
    { key: GTETourQuickFacts.AVAILABLE, value: tour?.available },
    { key: GTETourQuickFacts.STARTING_TIME, value: tour?.startingTime },
    { key: GTETourQuickFacts.ENDING_PLACE, value: endingPlace || tour?.endingPlace },
    { key: GTETourQuickFacts.MIN_AGE, value: Number(tour?.minimumAge ?? 0) },
    { key: GTETourQuickFacts.TICKET_TYPE, value: tour?.ticketType },
  ];

  const translateOptions = filterTranslationKeysMulti(unfilteredArray);
  const quickFacts = tour?.quickfactList?.quickfacts ?? [];
  return generateTourQuickfacts(
    generateQuickfacts(quickFacts, tourT, translateOptions),
    tour?.difficulty
  );
};
export const constructMapData = (
  latitude: number,
  longitude: number,
  location: string,
  nearbyPoints?: SharedTypes.MapPoint[]
) => {
  return {
    latitude,
    longitude,
    location,
    zoom: getMapZoom(false, false),
    points: nearbyPoints || [],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  };
};

export const constructGTEToursValueProps = (
  t: TFunction,
  valuePropsList?: GTETourTypes.ValueProp[],
  lazy?: boolean
): SharedTypes.ProductProp[] => {
  const valueProps = valuePropsList ?? [];

  return valueProps.map(valueProp => ({
    Icon: Icon(valueProp.icon?.handle, lazy),
    title: t(valueProp?.title ?? ""),
  }));
};

const constructNearbyPoints = (attractions: TravelStopTypes.QueryGraphCMSAttraction[]) =>
  attractions.map((attraction: TravelStopTypes.QueryGraphCMSAttraction, index: number) => ({
    id: index,
    type: TravelStopType.ATTRACTION,
    latitude: attraction.location.latitude,
    longitude: attraction.location.longitude,
    orm_name: attraction.title,
    title: attraction.title,
    image: constructGraphCMSImage(
      GraphCMSPageType.TourProductPage,
      attraction.mainImage,
      attraction.title
    ),
    reviewTotalCount: attraction.reviewCount,
    reviewTotalScore: attraction.reviewScore,
    isGoogleReview: false,
  }));

const constructItinerary = (
  days: VacationPackageTypes.QueryVacationPackageDay[],
  t: TFunction
): VacationPackageTypes.VacationPackageDay[] =>
  days.map(day => ({
    id: day.id,
    region: day.title,
    description: day.description || "",
    destinations: constructTravelStopDestinations(day.destinationLandingPages, t),
    attractions: constructTravelStopAttractions(day.attractionLandingPages, t),
  }));

const constructIncludedItems = (included?: SharedTypes.Icon[]) => {
  if (!included) return [];
  return included?.reduce((acc: SharedTypes.Icon[], item) => {
    if (item.title) {
      return [...acc, { ...item, checkList: true }];
    }
    return acc;
  }, []);
};

const constructListInfo = (listInfo?: [string], isChecklistIcon?: boolean) => {
  if (!listInfo) return [];
  return listInfo.map(listItem => {
    return {
      checkList: isChecklistIcon,
      id: listItem.slice(0, 10),
      title: listItem,
    };
  });
};

export const getTourBreadcrumbs = (
  breadcrumbs: SharedTypes.BreadcrumbData[],
  title: string,
  metadataUri: string
) => [
  ...(breadcrumbs ?? []),
  {
    name: title,
    url: metadataUri,
  },
];

export const constructTourContent = (
  tour: GTETourTypes.QueryTourContent[],
  t: TFunction,
  isOnEnglishLocale: boolean
): GTETourTypes.TourContent =>
  pipe(
    tour as NonEmptyArray<GTETourTypes.QueryTourContent>,
    nonEmptyMap(data => ({
      title: capitalize(data.title),
      images:
        data?.images?.map(image =>
          constructGraphCMSImage(GraphCMSPageType.TourProductPage, image, data.title)
        ) ?? [],
      description: data?.description,
      includedItems: isOnEnglishLocale
        ? constructIncludedItems(data?.included)
        : constructListInfo(data?.includedList, true),
      additionalInfo: isOnEnglishLocale
        ? data?.additionalInfo ?? []
        : constructListInfo(data?.additionalInfoList) ?? [],
      safetyInfo: isOnEnglishLocale
        ? data?.safetyInfo?.map(info => {
            return {
              id: info.id,
              title: info.title.replace(/\\n/g, " "),
            };
          }) ?? []
        : constructListInfo(data?.safetyInfoList) ?? [],
      tourOptions:
        data?.tourOptions.map(option => ({
          ...option,
          Icon: TravelerIcon,
        })) ?? [],
      numberOfDays: data?.numberOfDays ?? 1,
      tourId: data.tourId,
      startPlace: data.startPlace
        ? {
            // add startPlace id when tour id is added in place
            id: data.startPlace.tourId,
            name: data.startPlace.name?.value,
          }
        : undefined,
      destinations: data?.destinations && constructTravelStopDestinations(data?.destinations, t),
      attractions: constructTravelStopAttractions(data.attractions, t),
      itinerary: data.dayItems && constructItinerary(data.dayItems, t),
      breadcrumbs: [
        ...(data?.breadcrumbs ?? []),
        {
          name: data.title,
          url: data.metadataUri,
        },
      ],
      linkUrl: data.metadataUri,
      landingPageUri: data.landingPageUri,
      mapData:
        data.attractions.length > 0
          ? constructMapData(
              data.attractions[0].location.latitude,
              data.attractions[0].location.longitude,
              data.attractions[0]?.title,
              constructNearbyPoints(data.attractions)
            )
          : undefined,
      productSpecs: [],
      productProps: data?.valuePropsList?.valueProps?.map(prop => {
        if (prop.valuePropId === "cancellation") {
          return {
            ...prop,
            description: data?.cancellationDescription,
          };
        }
        return prop;
      }),
      review: {
        totalScore: data.reviewScore || 0,
        totalCount: data.reviewCount || 0,
      },
      isLikelyToSellOut: data.isLikelyToSellOut,
    })),
    nonEmptyHead
  );

export const constructSimilarTours = (
  tours: GTETourSearchTypes.QueryTour[],
  t: TFunction,
  queryParams?: string,
  productId?: string
): SharedTypes.SimilarProduct[] =>
  tours
    .filter(tour => tour.productCode !== productId)
    .map(tour => {
      return {
        id: String(tour.id),
        name: tour.name,
        lowestPrice: tour.price,
        image: constructGraphCMSImage(GraphCMSPageType.TourProductPage, tour.image, tour.name),
        clientRoute: {
          route: `/${PageType.GTE_TOUR}`,
          as: urlToRelative(`${tour.linkUrl}${queryParams || ""}`),
        },
        linkUrl: `${tour.linkUrl}${queryParams || ""}`,
        productSpecs: generateQuickfacts(
          tour?.quickFactList?.quickfacts ?? [],
          t,
          filterQuickfactValues(tour?.quickFactVariables ?? {})
        ),
        productProps: constructTourProductProps(t, tour?.valuePropsList?.valueProps),
        review: {
          totalCount: tour.reviewCount,
          totalScore: tour.reviewScore,
        },
      };
    })
    .slice(0, 3);

export const getSimilarToursTravelers = (
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[]
) => {
  const travelers = numberOfTravelers.find(
    traveler => traveler.ageBand === GTETourAgeBand.TRAVELER
  )?.numberOfTravelers;
  const adults =
    numberOfTravelers.find(traveler => traveler.ageBand === GTETourAgeBand.ADULT)
      ?.numberOfTravelers ?? 2;
  return (travelers || adults) as number;
};

export const constructGTETourReviews = (
  reviews?: GTETourTypes.QueryTourReviewObject[]
): Review[] => {
  if (!reviews || !reviews.length) return [];
  return reviews.map(review => ({
    id: review.id ?? "",
    text: review.text ?? "",
    userName: review.username ?? "",
    userAvatarImage: review.avatarUrl
      ? constructImage({
          id: review.username ?? "",
          url: review.avatarUrl,
          name: review.username,
        })
      : undefined,
    reviewScore: review.rating,
    reviewScoreText: constructReviewScoreText(review.rating),
    createdDate: review?.createdDate
      ? getFormattedDate(new Date(review.createdDate), dayMonthYearWithTimeFormat)
      : "",
    isVerified: true,
    helpfulVotes: review.helpfulVotes > 0 ? review.helpfulVotes : undefined,
    ownerResponse: review.ownerResponse
      ? {
          text: review.ownerResponse.text,
          userName: review.ownerResponse.username,
          userAvatarImage: review.ownerResponse.avatarUrl
            ? constructImage({
                id: review.ownerResponse.username ?? "",
                url: review.ownerResponse.avatarUrl,
                name: review.ownerResponse.username,
              })
            : undefined,
          createdDate: review.ownerResponse.createdDate
            ? getFormattedDate(
                new Date(review.ownerResponse.createdDate),
                dayMonthYearWithTimeFormat
              )
            : "",
        }
      : undefined,
  }));
};

export const isTourPageIndexed = (isIndexed: boolean, locale: SupportedLanguages) =>
  locale === SupportedLanguages.English && isIndexed;

export const toursEnabledForLocale = (activeLocale: SupportedLanguages) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]!.some(
    enabledLocale => activeLocale === enabledLocale
  );

export const getSearchTravelers = (
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[]
) =>
  numberOfTravelers.reduce(
    ({ adults, children, childrenAges }, currentAgeBand) => {
      if (
        currentAgeBand.ageBand === GTETourAgeBand.INFANT ||
        currentAgeBand.ageBand === GTETourAgeBand.CHILD ||
        currentAgeBand.ageBand === GTETourAgeBand.YOUTH
      ) {
        const ageBandGroup = priceGroups.find(
          group => group.travelerType === currentAgeBand.ageBand
        );
        let travellersAges: number[] = [];
        if (ageBandGroup) {
          travellersAges = new Array(currentAgeBand.numberOfTravelers).fill(ageBandGroup.minAge);
        }
        return {
          adults,
          children: children + currentAgeBand.numberOfTravelers,
          childrenAges: [...childrenAges, ...travellersAges],
        };
      }
      return {
        adults: adults + currentAgeBand.numberOfTravelers,
        children,
        childrenAges,
      };
    },
    { adults: 0 as number, children: 0 as number, childrenAges: [] as number[] }
  );

export const constructTourSearchLink = (
  selectedDates: SharedTypes.SelectedDates,
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[],
  landingPageUri?: string,
  startPlace?: GTETourTypes.StartPlace
) => {
  if (!landingPageUri || !startPlace) return undefined;
  const { from, to } = selectedDates;
  const { id, name } = startPlace;
  const ages = getSearchTravelers(numberOfTravelers, priceGroups);
  const { adults, children, childrenAges } = ages;
  return `${landingPageUri}?${stringify({
    startingLocationName: name,
    adults: adults || 1,
    ...(children > 0
      ? {
          children,
        }
      : {}),
    ...(childrenAges.length > 0
      ? {
          childrenAges,
        }
      : {}),
    dateFrom: getFormattedDate(from || new Date(), yearMonthDayFormat),
    dateTo: getFormattedDate(to || new Date(), yearMonthDayFormat),
    startingLocationId: id,
  })}`;
};

export const getAdminLinks = (id: string) => [
  {
    name: "View page in GraphCMS",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/7ea1ea7d2bdf41fc87bcd5e1483589cb/view/012196e894334f6ea6aa3597b6a4f1b9/${id}`,
  },
  {
    name: "View NLG template in GraphCMS",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/c652a81311014f2ca3609fc66b40057c/view/88e5ef9845e7441a815c1a512201afea/cl0s3u996oc340bmn0xzxw4pr`,
  },
];

export const constructReviewsLocaleOptions = (
  dataLocales: string[],
  activeLocale: SupportedLanguages
): SupportedLanguages[] => {
  const dataLocaleOptions = dataLocales.filter(Boolean) as SupportedLanguages[];

  return dataLocaleOptions.includes(activeLocale)
    ? dataLocaleOptions
    : [activeLocale, ...dataLocaleOptions];
};
