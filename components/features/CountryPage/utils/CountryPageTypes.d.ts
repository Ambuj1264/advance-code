declare namespace CountryPageTypes {
  export type QueryCategoryHeader = {
    metadata: SharedTypes.PageCategoriesMetaType;
    image: Image;
  };

  export type CountryPageBlogger = {
    id: string;
    name: string;
  };

  export type TravelCommunityItemType = {
    id: number;
    title: string;
    description: string;
    isLegacy: boolean;
    image: Image;
    uri: string;
    pageType:
      | "tourSearch"
      | "about-us"
      | "about-iceland"
      | "connect-with-locals"
      | "connect-with-travel-bloggers";
    iconPageType: PageType;
  };

  export type PageQuery = {
    frontHeader: QueryCategoryHeader;

    frontBestTravelPlans: {
      metadata: SharedTypes.PageSectionMetadata;
      tours: SharedTypes.QueryTourAlternate[];
    };

    frontTopTours: {
      metadata: SharedTypes.PageSectionMetadata;
      tours: SharedTypes.QueryTourAlternate[];
    };

    frontTopArticles?: {
      metadata: SharedTypes.PageSectionMetadata;
      articles: SharedTypes.TopArticle[];
    };

    frontTopGalleries: {
      metadata: SharedTypes.PageSectionMetadata;
      images: Image[];
    };

    frontTopAttractions: {
      metadata: SharedTypes.PageSectionMetadata;
      attractions: SharedTypes.PageTopAttraction[];
    };

    settings: {
      frontTopTravelCommunity: {
        metadata: SharedTypes.PageCategoriesMetaType;
        categories: TravelCommunityItemType[];
      };
      frontServices: SharedTypes.PageCategoryItemType[];
      frontVideoId?: string;
    };
  };

  export type PageClientQuery = {
    frontBestTravelPlans?: { tours: SharedTypes.QueryClientTourAlternate[] };
    frontTopTours?: { tours: SharedTypes.QueryClientTourAlternate[] };
  };
}
