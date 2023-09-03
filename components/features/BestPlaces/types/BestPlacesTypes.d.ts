declare namespace BestPlacesTypes {
  export type Filters = {
    destinations: SearchPageTypes.Filter[];
    attractions: SearchPageTypes.Filter[];
    startingLocations?: SearchPageTypes.Filter[];
  };

  export type RawFilter = {
    id: number;
    name: string;
    latitude?: number;
    longitude?: number;
  };

  export type QueryBestPlacesFilters = {
    attractions: RawFilter[];
    attractionTypes: RawFilter[];
  };

  export type QueryBestPlacesPageHeader = {
    metadata: SharedTypes.QuerySearchMetadata;
    header: {
      image: QueryImage;
    };
  };

  export type QueryBestPlacesLandingPage = {
    frontAttractionFilters: QueryBestPlacesFilters;
    settings: {
      frontBestPlacesPageHeader: QueryBestPlacesPageHeader;
      searchAnyLocationString: string;
      frontBestPlacesMapImage: QueryImage;
      latitude: number;
      longitude: number;
    };
  };

  export type QueryBestPlace = Readonly<{
    id: number;
    name: string;
    excerptDescription: string;
    location: string;
    latitude: number;
    longitude: number;
    image: QueryImage;
    url: string;
    reviewTotalScore: string;
    reviewTotalCount: number;
    hasTranslation?: boolean;
  }>;

  export type BestPlacesMetadata = {
    title: string;
    subtitle: string;
    url: string;
    pages: number;
    totalResults: number;
  };

  export type QueryBestPlacesSearch = {
    searchAttractions: {
      metadata: BestPlacesMetadata;
      attractions: QueryBestPlace[];
    };
  };
}
