declare namespace AccommodationTypes {
  type QueryAccommodationData = Readonly<{
    accommodation: QueryAccommodation;
    cartLink: string;
  }>;

  export type AccommodationType = "hotel" | "apartment";

  export type QueryAccommodation = {
    id: number;
    name: string;
    description: string;
    url: string;
    minDays: number;
    basePrice: number | null;
    type: AccommodationType;
    information: string;
    location: string;
    latitude: number;
    longitude: number;
    isExternal: boolean;
    isIndexed: boolean;
    isDirectBooking: boolean;
    isSingleUnit: boolean;
    category: {
      id: number;
      type: string;
      name: string;
      singularName: string;
      uri: string;
    };
    image?: QueryImage;
    images: ReadonlyArray<QueryImage>;
    amenities: ReadonlyArray<SharedTypes.QueryItem>;
    wifiAvailable: boolean;
    wifiPrice: number;
    breakfastAvailable: boolean;
    rooms: ReadonlyArray<QueryRoom>;
    localePrice: SharedTypes.LocalePrice;
    translations: LocaleLink[];
    establishment: {
      id: number;
      name: string;
    };
    metadata: SharedTypes.Metadata;
    props: SharedTypes.QueryProductProp[];
    specs: SharedTypes.QueryProductSpec[];
    reviewTotalScore: string;
    reviewTotalCount: number;
    showReviews: boolean;
    isHighlight: boolean;
    isAvailable: boolean;
  };

  export type Accommodation = {
    id: number;
    name: string;
    url: string;
    minDays: number;
    type: AccommodationType;
    isSingleUnit: boolean;
    cover: Readonly<Cover>;
    basePrice: number;
    information: string;
    category: Category;
    amenitiesItems: ReadonlyArray<SharedTypes.Icon>;
    nearbyItems: ReadonlyArray<SharedTypes.Icon>;
    mapData: SharedTypes.Map;
    rooms: Room[];
    localePrice: SharedTypes.LocalePrice;
    props: SharedTypes.ProductProp[];
    specs: SharedTypes.ProductSpec[];
    reviewTotalScore: number;
    reviewTotalCount: number;
    showReviews: boolean;
    isHighlight: boolean;
    isAvailable: boolean;
  };

  export type Cover = {
    name: string;
    images: Image[];
  };

  export type Category = {
    id: number;
    type: string;
    name: string;
    singularName: string;
    uri: string;
  };

  type QueryRoom = Readonly<{
    id: number;
    name: string;
    privateBathroom: number;
    size: number;
    maxPersons: number;
    bedOptions: string;
    roomImages: ReadonlyArray<QueryImage>;
  }>;

  type Room = {
    id: string;
    name: string;
    images: Image[];
    information: SharedTypes.ProductSpec[];
    additionalInformation?: React.ReactNode;
  };

  export type ChildrenValueChange = {
    value: number;
    index: number;
  };

  interface InformationSection {
    kind: "information";
    id: "information";
    linkTitle: string;
    information: string;
  }

  interface AmenitiesSection {
    kind: "amenitiesItems";
    id: "amenitiesItems";
    linkTitle: string;
    amenitiesItems: ReadonlyArray<SharedTypes.Icon>;
  }

  interface NearbySection {
    kind: "nearbyItems";
    id: "nearbyItems";
    linkTitle: string;
    nearbyItems: ReadonlyArray<Icon>;
    mapData: SharedTypes.Map;
  }

  interface RoomTypesSection {
    kind: "rooms";
    id: "roomSelection";
    linkTitle: string;
  }

  interface ReviewSection {
    kind: "reviews";
    id: "reviews";
    linkTitle: string;
    reviewTotalScore: number;
    reviewTotalCount: number;
  }

  interface SimilarAccommodationsSection {
    kind: "similarAccommodations";
    id: "similarAccommodations";
    linkTitle: string | TranslationKey;
  }

  type AccommodationSection =
    | InformationSection
    | AmenitiesSection
    | NearbySection
    | RoomTypesSection
    | ReviewSection
    | SimilarAccommodationsSection;
}
