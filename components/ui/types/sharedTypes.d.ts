/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
declare namespace SharedTypes {
  import { QueryParamsViaLayer0Type } from "utils/apiUtils";
  import { Marketplace, PageType } from "types/enums";

  /**
   * Overrides existing properties in type T1 in favor of those passed in T2.
   */
  export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

  type Only<T1, T2> = {
    [K in keyof T1]: T1[K];
  } & {
    [K in keyof T2]?: never;
  };

  /**
   * Results in a type with either the properties of T1 or those in type T2.
   */
  export type Either<T1, T2> = Only<T1, T2> | Only<T2, T1>;

  type Paragraph = Readonly<{
    text: string;
    accumulatedLength: number;
  }>;

  type GraphCMSIcon = {
    handle: string;
  };

  type QuickFact = Readonly<{
    id: string;
    label: string;
    value: string | TranslationKey;
    Icon: React.ReactType;
    description?: string;
    translateValue?: boolean;
    showEmptyValue?: boolean;
  }>;

  type QueryProductSpec = {
    iconId: string;
    name: string;
    value: string;
  };

  type ProductSpecInfo = {
    value: string;
    bulletPoints?: string[];
  };

  type ProductSpec = {
    id?: string;
    Icon: React.ReactType;
    name?: string;
    value: string;
    subtitle?: string;
    isLoading?: boolean;
    information?: ProductSpecInfo;
    quickfactId?: string;
  };

  type ProductReview = {
    totalScore: number;
    totalCount: number;
  };

  type ClientRoute = {
    as: string;
    route: PageType;
    query?: QueryParamsViaLayer0Type;
    replace?: boolean;
  };

  type SimilarProduct = {
    id: string;
    name: string;
    lowestPrice: number;
    lowestPriceDisplayValue?: string;
    currency?: string;
    image: Image;
    review?: ProductReview;
    clientRoute: ClientRoute;
    linkUrl: string;
    productSpecs: SharedTypes.ProductSpec[];
    productProps: SharedTypes.ProductProp[];
    ribbonText?: string;
    fallBackImg?: ImageWithSizes;
  };

  type Icon = Readonly<{
    id: string;
    title: string;
    subtitle?: string;
    Icon?: React.ReactType;
    isLargeIcon?: boolean;
    image?: Image;
    checkList?: boolean;
    isClickable?: boolean;
    description?: string;
    details?: React.ReactNode;
    url?: string;
  }>;

  type QueryItem = {
    id: number;
    name: string;
    included?: boolean;
  };

  export type NumberOfTravelers = { [travelerType in TravelerType]: number };

  export type TravelerType = "adults" | "teenagers" | "children";

  export type GuestType = "adults" | "children";

  type ItemCardContent = AccommodationTypes.Room | ContentTemplateItem;

  type TranslationKey = {
    key: string;
    options?: {
      [key: string]: string | number;
    };
  };

  type ItemFact = {
    id: string;
    label: string;
    value: string | TranslationKey;
    translateValue?: boolean;
  };

  type Section = TourSection | AccommodationTypes.AccommodationSection | CarTypes.CarSection;

  type Metadata = {
    title: string;
    description: string;
    facebookLikeUrl?: string;
    facebookCommentsUrlOverride?: string;
    canonicalUrl?: string;
  };

  type LocalePrice = {
    price: number;
    currency: string;
  };

  type SelectedDates = {
    from?: Date;
    to?: Date;
  };

  type DatesRange = {
    minDate: Date;
    maxDate: Date;
  };

  type SelectedDatesQuery = {
    dateFrom?: string;
    dateTo?: string;
  };

  type Dates = {
    unavailableDates: Array<Date>;
    unavailableDatesRange?: SelectedDates[];
    min?: Date;
    max?: Date;
    availableDates?: Array<Date>;
  };

  type AvailableTime = {
    minHour?: number;
    maxHour?: number;
  };

  type NumberOfGuests = {
    adults: number;
    children: number[];
  };

  type RoomGuestGroup = {
    id: string;
    type?: GuestType;
    defaultNumberOfType: number;
  };

  type GuestGroup = RoomGuestGroup & { type: GuestType };

  type QueryProductProp = {
    iconId: string;
    title: string;
    description?: string;
  };

  type ProductProp = {
    Icon: React.ReactType;
    title: string;
    description?: string;
  };

  export type Question = {
    id: number;
    question: string;
    answer: string;
  };

  type AutocompleteItem = {
    id: string;
    name: string;
    geoLocation?: string;
    types?: string[];
    type?: string;
    countryCode?: string;
  };

  interface QueryMapPoint {
    id: number;
    type: MapPointType;
    latitude: number;
    longitude: number;
    title: string;
    url?: string;
    description: string;
    reviewTotalScore: number | null;
    reviewTotalCount: number | null;
    isGoogleReview: boolean;
    image?: QueryImage;
    price?: number;
    priceDisplayValue?: string;
  }
  interface ChildMapPoint extends QueryMapPoint {
    image?: Image;
    description?: string;
    reviewTotalScore: number;
    reviewTotalCount: number;
    excludeFromClusterisation?: boolean;
    orm_name?: string;
    context?: {
      bookingId: number;
    };
  }
  interface MapPoint extends QueryMapPoint {
    image?: Image;
    description?: string;
    reviewTotalScore: number;
    reviewTotalCount: number;
    excludeFromClusterisation?: boolean;
    orm_name?: string;
    numberOfNights?: number;
    context?: {
      bookingId: number;
    };
    childPoints?: MapPoint[];
  }

  type MapCoords = {
    latitude: number;
    longitude: number;
  };

  type MapPointTypeKeys = keyof typeof import("types/enums.ts").MapPointType;
  type MapPointTypeValues = typeof import("types/enums.ts")[MapPointTypeKeys];

  type Map = {
    location: string;
    latitude: number;
    longitude: number;
    zoom?: number;
    staticMapImage?: Image;
    points?: MapPoint[];
    options?: google.maps.MapOptions;
    isCountryMap?: boolean;
    usePolyLine?: boolean;
  };

  type Query = {
    query: any;
    variables?: {
      slug?: string;
      path?: string;
      type?: string;
      landingPage?: string;
      landingPageType?: string;
      id?: number | string;
      marketplace?: Marketplace;
    };
    isRequiredForPageRendering?: boolean;
  };

  type OpenGraphType = "product" | "website";

  type BreadcrumbData = {
    name: string;
    url: string;
  };

  export type QueryTour = {
    id: number;
    name: string;
    description: string;
    linkUrl: string;
    slug?: string;
    reviewsCount: number;
    averageRating: string;
    image: QueryImage;
    basePrice?: number;
    price?: number;
    ssrPrice: number;
    banner?: {
      text: string;
    };

    specs: QueryProductSpec[];
    props: QueryProductProp[];
  };

  export type QueryTourAlternate = Omit<QueryTour, "price" | "ssrPrice"> & {
    price?: {
      display_price: string;
    };
    ssrPrice?: {
      display_price: string;
    };
  };

  export type QueryClientTourAlternate = Omit<TourClientData, "price"> & {
    price?: {
      display_price: string;
    };
  };

  export type TourClientData = {
    id: number;
    banner?: {
      text: string;
    };
    price: number;
    basePrice: number;
  };

  export type Product = {
    id: number | string;
    image: Image;
    linkUrl: string;
    slug?: string;
    headline: string;
    description?: string;
    averageRating?: number;
    reviewsCount?: number;
    price?: number;
    priceDisplayValue?: string;
    totalSaved?: number;
    ssrPrice: number;
    ssrPriceDisplayValue?: string;
    specs: ProductSpec[];
    props: ProductProp[];
    ribbonLabelText?: string;
    popularity?: number;
    categoryId?: number;
    amenityIds?: number[];
    establishment?: Establishment;
    shouldFormatPrice?: boolean;
    useDefaultImageHeight?: boolean;
    latitude?: number;
    longitude?: number;
    isLikelyToSellOut?: boolean;
    fallBackImg?: ImageWithSizes;
  };

  export type PlaceProduct = {
    id: number;
    image: Image;
    linkUrl: string;
    slug?: string;
    headline: string;
    nofollow?: boolean;
    description?: string;
    averageRating?: number;
    reviewsCount?: number;
    address?: string;
  };

  export type QuerySearchMetadata = {
    title: string;
    subtitle: string;
  };

  export type QueryTourSearchStartingLocations = {
    tourStartingLocations: {
      id: number;
      name: string;
    }[];
  };

  export type PartialLoading = {
    allProvidersLoading: boolean;
    someProviderLoading: boolean;
  };

  export type OrderBy = "price" | "rating" | "popularity";

  export type OrderDirection = "asc" | "desc";

  export type ResponsiveThumbnails = {
    medium: number;
    large: number;
    desktop: number;
  };

  export type Time = {
    hour: number;
    minute: number;
  };

  export type SearchCover = {
    name: string;
    description?: string;
    image: Image;
  };

  export type SearchCategory = {
    id: number;
    name: string;
    image: Image;
    url: string;
  };

  export type QuerySearchCategory = {
    id: number;
    name: string;
    image: QueryImage;
    url: string;
  };

  export type QuerySearchCategoryInfo = {
    id: number;
    categoryName: string;
    informationTitle?: string;
    information: string;
    name: string;
    description: string;
    image: QueryImage;
  };

  export type SearchCategoryInfo = {
    id: number;
    categoryName: string;
    informationTitle?: string;
    information: string;
    cover: SearchCover;
    location?: LocationObject;
  };

  type ColumnSizes = {
    small: number;
    medium?: number;
    large?: number;
    desktop?: number;
    print?: number;
  };

  type ImgixParams = {
    w?: number;
    h?: number;
    crop?: string;
    ar?: string;
    fit?: string;
    "min-w"?: number;
    fill?: string;
    auto?: string;
    q?: number;
    blur?: number;
    pad?: number;
    "fp-z"?: number;
    bg?: string;
    fm?: string;
  };

  type GraphCMSAsset = {
    id: string;
    handle: string;
    caption?: string;
    videoId?: string;
    videoStartingTime?: number;
    videoEndTime?: number;
  };

  type DevicePixelRatio = 1 | 2 | 3 | 4 | 5 | number;

  type VariableQualities = { [key in DevicePixelRatio]?: number };

  type ImgixSrcSetOptions = {
    widths?: number[];
    widthTolerance?: number;
    minWidth?: number;
    maxWidth?: number;
    disableVariableQuality?: boolean;
    devicePixelRatios?: DevicePixelRatio[];
    variableQualities?: VariableQualities;
    disablePathEncoding?: boolean;
  };

  type ImgixProps = {
    disableSrcSet?: boolean;
    className?: string;
    src: string;
    sizes?: string;
    attributeConfig?: any;
    htmlAttributes?: any;
    width?: number;
    height?: number;
    imgixParams?: any;
    disableLibraryParam?: boolean;
    title?: string;
    srcSetOptions?: ImgixSrcSetOptions;
  };

  type Place = AutocompleteItem & {
    location: {
      lng: number;
      lat: number;
      distance: number;
    };
  };

  type PageCategoriesMetaType = {
    title: string;
    subtitle: string;
  };

  type PageSectionMetadata = {
    title: string;
    subtitle: string;
    url?: string;
  };

  export type PageItemType = {
    title: string;
    uri: string;
    isLegacy: boolean;
    pageType: PageType;
    subtype?: string;
  };

  export type PageCategoryItemType = PageItemType & {
    id: number;
    image: ImageWithSizes;
    city?: string;
    clientRoute?: SharedTypes.ClientRoute;
  };

  export type Author = {
    id: number;
    name: string;
    image: {
      id: string;
      url: string;
    };
  };

  export type TopArticle = {
    id: number;
    url: string;
    clientRoute?: ClientRoute;
    title: string;
    metadata: {
      description: string;
    };
    image: {
      id: string;
      url: string;
    };
    bannerId?: TeaserTypes.TeaserOverlayBannerIcon;
    author?: Author;
    date?: string;
  };

  export type PageTopAttraction = {
    id: number;
    name: string;
    image: QueryImage;
    url: string;
  };

  export type CategoryHeaderData = {
    title: string;
    description: string;
    images: Image[];
    reviewTotalScore?: number;
    reviewTotalCount?: number;
    pageAboutTitle?: string;
    pageAboutDescription?: string;
  };

  export type Information = {
    content: string | React.ReactNode;
    image?: Image;
  };

  type Establishment = {
    name: string;
    image: Image;
  };

  type QueryBlog = {
    id: number;
    title: string;
    metadata: {
      description: string;
    };
    url: string;
    image: QueryImage;
    author: {
      id: number;
      name: string;
      image: QueryImage;
    };
  };

  type Birthdate = {
    day?: string;
    month?: string;
    year?: string;
  };

  type TimeDropdownObject = {
    hour?: string;
    minutes?: string;
  };

  type Country = {
    name: string;
    callingCode: number;
    countryCode: string;
    flagSvgUrl: string;
  };

  /** Date format: YYYY-MM-DDThh:mmTZD; ex 2021-02-26T15:46:19.000Z */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface iso8601DateTime extends string {}

  type GraphCMSImageUrlParams = {
    width?: number;
    height?: number;
    fit?: string;
    output?: string;
    quality?: number;
  };

  type Columns = {
    small?: number;
    medium?: number;
    large?: number;
    desktop?: number;
    print?: number;
  };

  type PriceObject = {
    price: number;
    defaultPrice: number;
    currency: string;
    priceDisplayValue: string;
  };

  type BroadcastChannelMessageData = {
    actionName: string;
  };
}
