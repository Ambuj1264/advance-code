declare namespace AccommodationSearchTypes {
  export type QueryAccommodationSearchCategory = SharedTypes.QuerySearchCategory & {
    bindCity?: string;
  };

  export type QueryAccommodationAutoComplete = {
    autoCompletePlaces: SharedTypes.AutocompleteItem[];
  };
  export type QueryAccommodationSearchCategoryInfo = {
    hotelSearchCategoryByUri:
      | (SharedTypes.QuerySearchCategoryInfo & {
          defaultLocationsList: SharedTypes.AutocompleteItem[];
          url: string;
          stringifiedAutoFilter: string | null;
          city?: string | undefined;
        })
      | null;
  };
  export type Location = {
    location?: LocationObject;
  };

  export type LocationObject = {
    id?: string;
    name?: string;
    type?: string;
    latitude?: number;
    longitude?: number;
  };

  export type QueryAccommodationLinkedSearchCategories = {
    accommodationLinkedSearchCategories: QueryAccommodationCategories;
  };

  export type QueryAccommodationCategories = {
    metadata: QuerySearchMetadata;
    categories: QuerySearchCategory[];
  };

  export type QuerySearchHotel = {
    accommodationId: number;
    name: string;
    description: string;
    linkUrl: string;
    image: QueryImage;
    price?: number;
    ssrPrice: number;
    specs: SharedTypes.QueryProductSpec[];
    props: SharedTypes.QueryProductProp[];
    stars?: number;
    popularity?: number;
    reviewTotalScore?: string;
    reviewTotalCount?: number;
    searchBoost?: number;
    category: {
      id: number;
    };
    amenityIds: {
      id: number;
    }[];
    isAvailable?: boolean;
    isHighlight?: boolean;
    city?: {
      name: string;
    };
  };

  export type QueryPopularHotels = {
    topHotelsSearch: {
      metadata: SearchTypes.QuerySearchMetadata;
      hotels: QuerySearchHotel[];
    };
  };

  export type SearchHotelClientData = {
    id: number;
    price: number;
  };

  export type QueryPopularAccommodationClient = {
    topHotelsSearch: {
      hotels: SearchHotelClientData[];
    };
  };

  export type AccommodationFilterOption = {
    optionId: number;
    name: string;
    count: number;
    isPrefilled: boolean;
  };

  export type AccommodationFilter = {
    name: string;
    iconId: string;
    options: AccommodationFilterOption[];
    orderBy?: string;
    isPrefilledFilter: boolean;
    orderDirection?: string;
  };

  export type QuerySearchAccommodations = {
    accommodationSearch?: {
      totalAccommodations: number;
      accommodations: QuerySearchHotel[];
      searchFilters: AccommodationFilter[];
    };
  };

  /* eslint-disable camelcase */
  export type AccommodationFilterParams = {
    categoryIds?: number[];
    stars?: number[];
    amenityIds?: number[];
    extraIds?: number[];
  };

  export type AccommodationGraphQlVariablesParamsType = {
    date_from?: string;
    date_to?: string;
    extra_option_ids?: number[];
    amenity_ids?: number[];
    category_ids?: number[];
    stars?: number[];
    rooms?: {
      adults?: number;
      children?: number;
      rooms?: number;
    };
    searchPlace?: {
      id: number;
      name: string;
    };
    limit?: number;
    page?: number;
    country?: string;
    slug?: string;
  };
  /* eslint-enable camelcase */

  export type Query = {
    query: any;
    variables?: AccommodationGraphQlVariablesParamsType & Query.variables;
    isRequiredForPageRendering?: boolean;
  };

  export type AccommodationProduct = SharedTypes.Product & {
    stars: number;
    isHighlight?: boolean;
    searchBoost?: number;
    isAvailable?: boolean;
    city?: string;
  };

  export type AccommodationSearchCategory = SharedTypes.SearchCategoryInfo &
    AccommodationSearchTypes.Location & {
      defaultLocationsList: SharedTypes.AutocompleteItem[];
    };
}
