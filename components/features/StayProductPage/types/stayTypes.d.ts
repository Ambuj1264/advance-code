declare namespace StayTypes {
  import { SupportedLanguages } from "types/enums";

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

  type QueryQuickfact = CommonQuickfact & {
    name: Name;
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

  type QueryRoom = {
    id: string;
    name: string;
    images: SharedTypes.GraphCMSAsset[];
    numberOfPersons: number;
    roomSize: number;
    bedTypes: string;
    privateShower: boolean;
    wifiAvailability: import("types/enums").Availability;
    roomDetails?: IconItem[];
  };

  type Room = {
    id: string;
    name: string;
    images: ImageWithSizes[];
    information: SharedTypes.ProductSpec[];
    roomDetails?: IconItem[];
  };

  type QuerySimilarProduct = {
    id: string;
    name: string;
    mainImage: SharedTypes.GraphCMSAsset;
    images: SharedTypes.GraphCMSAsset[];
    url: string;
    slug: string;
    valuePropsList: {
      valueProps: ValueProp[];
    };
    address: string;
    quickfactList: QuickfactList;
    starClass: number;
    checkInTime: string;
    checkOutTime: string;
    distanceFromCenter: number;
    breakfastAvailability: import("types/enums").Availability;
    parkingAvailability: import("types/enums").Availability;
    wifiAvailability: import("types/enums").Availability;
    reviewScore: number;
    reviewCount: number;
    fromPrice: number;
    maxOccupancy: number;
    roomTypes: string;
    subType?: {
      subtype?: string;
      name?: {
        value: string;
      };
      pluralName?: {
        value: string;
      };
      subTypeModifiers?: LandingPageTypes.SubTypeModifier[];
    };
    place?: LandingPageTypes.Place;
  };

  type QuickfactValues = {
    starClass: number;
    checkin: string;
    checkout: string;
    distanceFromCenter: number;
    subtype: string;
    numberOfGuests: number;
    roomTypes: string;
    address: string;
  };

  type ValueProp = {
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
      distance: number;
    };
    reviewScore: number;
    reviewCount: number;
  };

  type QueryStayContent = {
    id: string;
    productId: number;
    title: string;
    description: string;
    mainImage: SharedTypes.GraphCMSAsset;
    images: SharedTypes.GraphCMSAsset[];
    hotelImages: SharedTypes.GraphCMSAsset[];
    valuePropsList: {
      valueProps: ValueProp[];
    };
    quickfactList: QuickfactList;
    starClass: number;
    checkInTime: string;
    checkOutTime: string;
    distanceFromCenter: number;
    amenities: IconItem[];
    nearbyAttractions: TravelStopTypes.QueryGraphCMSAttraction[];
    location: {
      latitude: number;
      longitude: number;
    };
    address: string;
    rooms: QueryRoom[];
    reviewCount: number;
    reviewScore: number;
    breakfastAvailability: import("types/enums").Availability;
    parkingAvailability: import("types/enums").Availability;
    wifiAvailability: import("types/enums").Availability;
    maxOccupancy: number;
    roomTypes: string;
    subType?: {
      name?: {
        value: string;
      };
    };
  };

  type QueryStay = {
    staysProductPages: QueryStayContent[];
  };

  type StayContent = {
    productId: number;
    title: string;
    productProps: ValueProp[];
    images: ImageWithSizes[];
    description: string;
    productSpecs: Quickfact[];
    quickfactValues: QuickfactValues;
    amenities: IconItem[];
    mapData: SharedTypes.Map;
    nearbyAttractions: TravelStopTypes.TravelStops[];
    rooms: Room[];
    review?: SharedTypes.ProductReview;
  };

  type QueryCondition = {
    metadataUri?: string;
  };

  type StayPagePrefetchParams = {
    location: {
      latitude: number;
      longitude: number;
    };
    metadataUri?: string;
    productId: number;
  };

  type QueryStayData = {
    id: string;
    title: string;
    location: {
      latitude: number;
      longitude: number;
    };
    starClass: number;
    placeId: string;
    productId: number;
    breadcrumbs: SharedTypes.BreadcrumbData[];
    metadataUri: string;
    fromPrice: number;
    place?: LandingPageTypes.Place;
    cityOsmId?: number;
    countryOsmId?: number;
    isIndexed: boolean;
  };

  type StayMetadataQueryData = {
    metadata: {
      hreflangs: Hreflang[];
      metadataTitle: string;
      metadataDescription: string;
      images: Image[];
      canonicalUri: string;
    }[];
  };

  type QueryReview = {
    authorName?: string;
    language?: string;
    profilePhotoUrl?: string;
    rating: number;
    relativeTimeDescription?: string;
    text?: string;
    time: number;
  };

  type QueryReviews = {
    locales: SupportedLanguages[];
    reviews: QueryReview[];
  };

  type StayContentQueryParams = {
    attractionsConditions?: {
      latitude: number;
      longitude: number;
    };
    searchUrl: string;
    queryCondition: LandingPageTypes.LandingPageQueryCondition;
    productId: number;
    isModalView?: boolean;
    className?: string;
  };

  type SimilarStayProduct = {
    image?: SharedTypes.GraphCMSAsset;
    name?: string;
    price?: SharedTypes.PriceObject;
    id: number;
    productPageUrl?: string;
    userRatingAverage?: number;
    userRatingsTotal?: number;
    valueProps?: import("./staysSearchEnums").StaySearchGTEValueProp[];
    quickfacts?: StaysSearchQueryGTEQuickfact;
  };
}
