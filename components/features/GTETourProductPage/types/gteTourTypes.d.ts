declare namespace GTETourTypes {
  type Name = {
    value: string;
  };

  type CommonQuickfact = {
    id: string;
    quickfactId: string;
    title: string;
    icon: {
      handle: string;
    };
  };

  type Quickfact = CommonQuickfact & {
    name: string;
  };

  type QuickfactsList = {
    quickfacts: Quickfact[];
  };

  type IconItem = {
    id: string;
    title: Name;
    icon: {
      handle: string;
    };
  };

  type ValueProp = {
    valuePropId: string;
    title: string;
    icon: {
      handle: string;
      svgAsString: string;
    };
  };

  type Attraction = {
    id: string;
    title: string;
    mainImage: SharedTypes.GraphCMSAsset;
    location: {
      latitude: number;
      longitude: number;
    };
    reviewScore: number;
    reviewCount: number;
  };

  type QueryTourCommonContent = {
    id: string;
    tourContentId: string;
    title: string;
    metadataUri: string;
    images: SharedTypes.GraphCMSAsset[];
    valuePropsList: {
      valueProps: ValueProp[];
    };
    quickfactList: QuickfactList;
    reviewCount: number;
    reviewScore: number;
    fromPrice: number;
    duration?: string;
    difficulty?: string;
    languages?: string;
    available?: string;
    minimumAge?: number;
    startingTime?: string;
    startingPlace?: string;
    endingPlace?: string;
    ticketType?: string;
  };

  type QueryTourSectionContent = QueryTourCommonContent & {
    startPlace: LandingPageTypes.Place;
    subTypes?: {
      subtype?: string;
      tagId?: number;
      name?: {
        value: string;
      };
      pluralName?: {
        value: string;
      };
      parentSubType?: {
        name?: {
          value: string;
        };
        pluralName?: {
          value: string;
        };
      };
      subTypeModifiers?: LandingPageTypes.SubTypeModifier[];
    }[];
  };

  type QueryTourContent = QueryTourCommonContent & {
    tourId: string;
    isIndexed: boolean;
    numberOfDays?: number;
    description: string;
    isLikelyToSellOut: boolean;
    breadcrumbs: SharedTypes.BreadcrumbData[];
    included: SharedTypes.Icon[];
    includedList?: [string];
    tourOptions: SharedTypes.Icon[];
    additionalInfo: SharedTypes.Icon[];
    additionalInfoList?: [string];
    safetyInfo: SharedTypes.Icon[];
    safetyInfoList?: [string];
    attractions: TravelStopTypes.QueryGraphCMSAttraction[];
    destinations?: TravelStopTypes.QueryGraphCMSDestination[];
    dayItems?: VationPackageTypes.QueryVacationPackageDay[];
    cancellationDescription?: string;
    landingPageUri?: string;
    fromPrice?: number;
    startPlace?: {
      tourId: string;
      name: Name;
    };
  };

  type QueryTour = {
    tourProductPages: QueryTourContent[];
  };

  type StartPlace = {
    id: string;
    name: string;
  };

  type TourContent = {
    tourId: string;
    numberOfDays: number;
    title: string;
    productProps: ValueProp[];
    breadcrumbs: SharedTypes.BreadcrumbData[];
    images: ImageWithSizes[];
    description: string;
    productSpecs: SharedTypes.ProductSpec[];
    linkUrl: string;
    includedItems: SharedTypes.Icon[];
    additionalInfo: SharedTypes.Icon[];
    safetyInfo: SharedTypes.Icon[];
    tourOptions: SharedTypes.Icon[];
    mapData?: SharedTypes.Map;
    attractions: TravelStops[];
    destinations?: TravelStops[];
    review: SharedTypes.ProductReview;
    itinerary?: VacationPackageTypes.VacationPackageDay[];
    landingPageUri?: string;
    startPlace?: StartPlace;
    isLikelyToSellOut: boolean;
  };

  type QueryTourDates = {
    toursAndTicketsAvailableDays: {
      availableDates: string[];
      unavailableDates: string[];
    };
  };

  type QueryTourReviewResponse = {
    createdDate: string;
    avatarUrl: string;
    username: string;
    text: string;
  };

  type QueryTourReviewObject = {
    id: string;
    language: string;
    createdDate: string;
    avatarUrl: string;
    username: string;
    rating: number;
    text: string;
    title: string;
    helpfulVotes: number;
    ownerResponse: QueryTourReviewResponse;
  };

  type QueryTourReviews = {
    toursAndTicketsSingleProductReviews: {
      totalReviews: number;
      availableLanguages: string[];
      reviews: QueryTourReviewObject[];
    };
  };
}
