type QueryLanguage = Readonly<{
  name: string;
}>;

type QueryAttraction = Readonly<{
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  location: string;
  reviewTotalScore: string;
  reviewTotalCount: number;
  image: QueryImage;
  url: string;
}>;

type QueryContentTemplateItem = Readonly<{
  id: number;
  name: string;
  information: string;
  images: ReadonlyArray<QueryImage>;
}>;

type QueryItineraryContentTemplateData = Readonly<{
  tour: Readonly<{
    id: string;
    itinerary: QueryItineraryContentTemplate[];
  }>;
}>;

type QueryItineraryContentTemplate = Readonly<{
  id: string;
  contentTemplates: ReadonlyArray<QueryContentTemplate>;
}>;

type QueryContentTemplate = Readonly<{
  id: number;
  name: string;
  information: string;
  items: ReadonlyArray<QueryContentTemplateItem>;
}>;

type QueryItineraryItem = Readonly<{
  id: number;
  day: number;
  name: string;
  information?: string;
  image: QueryImage;
  contentTemplates: ReadonlyArray<{ id: string }>;
}>;

type QueryGuide = Readonly<{
  id: number;
  name: string;
  information: string;
  avatarImage: QueryImage;
  images: ReadonlyArray<QueryImage>;
  coverImage?: QueryImage;
  linkUrl: string;
  languages?: ReadonlyArray<QueryLanguage>;
}>;

type QueryPickupLocation = {
  id: number;
  name: string;
};

type QueryAirport = {
  name: string;
};

type QueryTransport = {
  pickup: string;
  departureNote: string | null;
  pickupType: string;
  enableNotKnown: boolean;
  required: boolean;
  price: number;
  airports: QueryAirport[];
  places: QueryPickupLocation[];
};

type QueryPriceGroups = {
  adults: {
    lowestPriceGroupSize: number;
  };
};

type QueryTour = Readonly<{
  id: number;
  url: string;
  slug?: string;
  basePrice: number;
  currency: string;
  name: string;
  isIndexed: boolean;
  isLivePricing: boolean;
  establishment: {
    id: number;
    name: string;
    url: string;
  };
  tourType: string;
  information: string;
  additionalInformation: string | null;
  image?: QueryImage;
  images: ReadonlyArray<QueryImage>;
  durationInSeconds: number;
  isFreePickup: boolean;
  reviewTotalScore: string;
  reviewTotalCount: number;
  durationAsText: string;
  languages: ReadonlyArray<QueryLanguage>;
  difficultyLevel: number;
  availabilityPeriod: string;
  minimumAge: number;
  shouldBringItems: ReadonlyArray<SharedTypes.QueryItem>;
  includedItems: ReadonlyArray<SharedTypes.QueryItem>;
  activityItems: ReadonlyArray<SharedTypes.QueryItem>;
  attractionsItems: ReadonlyArray<QueryAttraction>;
  contentTemplates: ReadonlyArray<QueryContentTemplate>;
  itinerary: ReadonlyArray<QueryItineraryItem>;
  videoUrl?: string;
  guides: ReadonlyArray<QueryGuide>;
  props: SharedTypes.QueryProductProp[];
  specs: SharedTypes.QueryProductSpec[];
  transport: QueryTransport;
  metadata: SharedTypes.Metadata;
  priceGroups: QueryPriceGroups;
  localePrice: SharedTypes.LocalePrice;
}>;

type QueryTourData = Readonly<{
  tour: QueryTour;
  bookUrl: string;
  reviews: Readonly<{ reviews?: QueryReview[] }>;
}>;

type ContentTemplateItem = {
  id: string;
  name: string;
  information: string | null;
  images: Image[];
  additionalInformation?: React.ReactNode;
};

type ContentTemplate = Readonly<{
  id: string;
  name: string;
  information: string;
  items: ContentTemplateItem[];
}>;

type ItineraryContentTemplates = {
  id: string;
  contentTemplates: ContentTemplate[];
};

type ItineraryItem = Readonly<{
  id: string;
  name: string;
  numberOfDay: string;
  information: string;
  image: Image;
  hasContentTemplates: boolean;
}>;

type Guide = Readonly<{
  id: string;
  name: string;
  information: string;
  avatarImage: Image;
  images: Image[];
  linkUrl: string;
  languages?: string;
}>;

type PickupLocation = {
  id: number;
  name: string;
};

type PickupTransport = {
  pickup: string;
  enableNotKnown: boolean;
  required: boolean;
  price: number;
  departureNote?: string;
  pickupType: string;
  places: PickupLocation[];
};

type Tour = Readonly<{
  id: string;
  url: string;
  currency: string;
  name: string;
  establishment: {
    name: string;
    url: string;
  };
  isIndexed: boolean;
  isLivePricing: boolean;
  tourType: string;
  information: string;
  additionalInformation?: string;
  images: Image[];
  reviewTotalScore: number;
  reviewTotalCount: number;
  shouldBringItems: ReadonlyArray<SharedTypes.Icon>;
  includedItems: ReadonlyArray<SharedTypes.Icon>;
  activityItems: ReadonlyArray<SharedTypes.Icon>;
  attractionsItems: ReadonlyArray<SharedTypes.Icon>;
  mapData: SharedTypes.Map;
  contentTemplates: ReadonlyArray<ContentTemplate>;
  itinerary: ReadonlyArray<ItineraryItem>;
  videoUrl?: string;
  guides: ReadonlyArray<Guide>;
  isFreePickup: boolean;
  props: SharedTypes.ProductProp[];
  specs: SharedTypes.ProductSpec[];
  transport: PickupTransport;
  metadata: TourMetadata;
  lowestPriceGroupSize: number;
  localePrice: SharedTypes.LocalePrice;
}>;

interface InformationSection {
  kind: "information";
  id: "information";
  linkTitle: string;
  information: string;
  specs: SharedTypes.ProductSpec[];
}

interface IncludedItemsSection {
  kind: "includedItems";
  id: "includedItems";
  linkTitle: string;
  includedItems: ReadonlyArray<SharedTypes.Icon>;
}

interface ActivityItemsSection {
  kind: "activityItems";
  id: "activityItems";
  linkTitle: string;
  activityItems: ReadonlyArray<SharedTypes.Icon>;
}

interface AttractionsItemsSection {
  kind: "attractionsItems";
  id: "attractionsItems";
  linkTitle: string;
  attractionsItems: ReadonlyArray<SharedTypes.Icon>;
  mapData: SharedTypes.Map;
}

interface ItinerarySection {
  kind: "itinerary";
  id: "itinerary";
  linkTitle: string;
  itinerary: ReadonlyArray<ItineraryItem>;
}

interface ShouldBringItemsSection {
  kind: "shouldBringItems";
  id: "shouldBringItems";
  linkTitle: string;
  shouldBringItems: ReadonlyArray<SharedTypes.Icon>;
}

interface AdditionalInformationSection {
  kind: "additionalInformation";
  id: "additionalInformation";
  linkTitle: string;
  additionalInformation: string;
}

interface ContentTemplateSection {
  kind: "contentTemplate";
  id: string;
  linkTitle: string;
  contentTemplate: ContentTemplate;
}

interface TermsSection {
  kind: "terms";
  id: "terms";
  linkTitle: string;
}

interface VideoSection {
  kind: "video";
  id: "video";
  linkTitle: string;
  videoUrl: string;
}

interface GuidesSection {
  kind: "guides";
  id: "guides";
  linkTitle: string;
  guides: ReadonlyArray<Guide>;
}

interface ReviewSection {
  kind: "reviews";
  id: "reviews";
  linkTitle: string;
  reviewTotalScore: number;
  reviewTotalCount: number;
}

interface SimilarToursSection {
  kind: "similarTours";
  id: "similarTours";
  linkTitle: string;
}

type TourSection =
  | InformationSection
  | IncludedItemsSection
  | ActivityItemsSection
  | AttractionsItemsSection
  | ItinerarySection
  | ShouldBringItemsSection
  | AdditionalInformationSection
  | ContentTemplateSection
  | TermsSection
  | VideoSection
  | GuidesSection
  | ReviewSection
  | SimilarToursSection;
