declare namespace SearchPageTypes {
  export type QueryLandingPageClient = {
    topToursSearch: {
      tours: SharedTypes.TourClientData[];
    };
    newestToursSearch: {
      tours: SharedTypes.TourClientData[];
    };
    topHolidayToursSearch: { tours: SharedTypes.TourClientData[] };
  };

  export type QueryCategoryLandingPageClient = {
    tourSearch: {
      tours: SharedTypes.TourClientData[];
    };
  };

  export type Filter = {
    id: string;
    name: string;
    latitude?: number;
    longitude?: number;
    types?: string[];
    disabled?: boolean;
    checked?: boolean;
    resetFilterSection?: boolean;
    idList?: string[];
  };

  export type RangeFilter = {
    id: string;
    count: number;
  };

  type RangeFilters = {
    filters: SearchPageTypes.RangeFilter[];
    min: number;
    max: number;
  };

  export type PriceRange = {
    min: number;
    max: number;
    count: number;
  };

  export type Filters = {
    durations?: Filter[];
    activities?: Filter[];
    attractions?: Filter[];
    startingLocations?: Filter[];
    destinations?: Filter[];
    price?: RangeFilters;
    reviews?: Filter[];
    time?: Filter[];
    priceRange?: PriceRange[];
  };

  export type QueryLandingPage = {
    topToursSearch: {
      metadata: SharedTypes.QuerySearchMetadata;
      tours: SharedTypes.QueryTour[];
    };
    newestToursSearch: {
      metadata: SharedTypes.QuerySearchMetadata;
      tours: SharedTypes.QueryTour[];
    };
    topHolidayToursSearch: {
      metadata: SharedTypes.QuerySearchMetadata;
      tours: SharedTypes.QueryTour[];
    };
    tourSearch: {
      defaultFilters: Filters;
    };
  };

  export type QuerySearchTours = {
    tourSearch?: {
      totalTours: number;
      totalPages: number;
      tours: SharedTypes.QueryTour[];
      filters: Filters;
    };
  };

  export type Category = {
    id: number;
    name: string;
    tours: number;
    image: Image;
    url: string;
    subCategories: Category[];
  };

  export type Categories = {
    categories: Category[];
  };

  export type QueryCategory = {
    id: number;
    name: string;
    tours: number;
    image: QueryImage;
    url: string;
    subCategories: QueryCategory[];
  };

  export type QueryCategoryOverview = {
    categoryOverview: QueryCategory[];
  };

  export type QueryCategoryHeader = {
    tourCategoryHeader: {
      id?: number;
      name: string;
      description: string;
      url?: string;
      imageUrl: string;
      averageReviewScore?: number;
      reviewCount?: number;
      pageAboutTitle?: string;
      pageAboutDescription?: string;
    };
  };

  export type QueryFAQ = {
    getFaq: {
      id: number;
      translationLink: string | null;
      questions: SharedTypes.Question[];
    } | null;
  };

  type StepsModalState = {
    startingLocationId?: string;
    startingLocationName?: string;
    adults?: number;
    childs?: number;
    dateFrom?: string;
    dateTo?: string;
  };

  export type SortOnChangeFn = (value: SortOptionProp) => void;

  export type SortParameter = {
    orderBy: string;
    orderDirection?: string;
  };

  type SearchProduct = {
    id: number | string;
    isAvailable?: boolean;
    isHighlight?: boolean;
    isLikelyToSellOut?: boolean;
    fallBackImg?: ImageWithSizes;
  };
  type SearchProductAdditionalProps = {
    [key: string]: any;
  };
  type SearchPriceRangeSettings = {
    settings: {
      isPriceRangeEnabled: boolean;
    };
  };
}
