declare namespace TravelCommunityTypes {
  import { SupportedLanguages } from "types/enums";

  export type QueryCategoryHeader = {
    metadata: SharedTypes.PageCategoriesMetaType;
    header: {
      image: Image;
    };
  };

  export type PageQuery = {
    topAttractions: {
      metadata: SharedTypes.PageSectionMetadata;
      attractions: SharedTypes.PageTopAttraction[];
    };

    bestTravelPlans: {
      metadata: SharedTypes.PageSectionMetadata;
      tours: SharedTypes.QueryTourAlternate[];
    };

    settings: {
      pageHeader: QueryCategoryHeader;
    };

    localBloggersSearchLink: string;
    travelBloggersSearchLink: string;
  };

  export type PageClientQuery = {
    bestTravelPlans?: { tours: SharedTypes.QueryClientTourAlternate[] };
  };

  export type QueryPopularTips = {
    popularTips: SharedTypes.QueryBlog[];
  };

  export type QueryLatestTips = {
    latestTips: SharedTypes.QueryBlog[];
  };

  export type QueryTopBloggers = {
    topBloggers: {
      metadata: {
        title: string;
        subtitle: string;
        url: string;
        pages: number;
      };
      bloggers: QueryBlogger[];
    };
  };

  export type QueryBlogger = {
    id: number;
    name?: string;
    url?: string;
    image?: QueryImage;
    faceImage?: QueryImage;
    country?: string;
    countryCode?: string;
    languages?: { code: SupportedLanguages }[];
  };

  export type Blogger = {
    id: number;
    name: string;
    url: string;
    image?: Image;
    faceImage?: Image;
    country: string;
    Icon?: React.ReactType;
    languages: SupportedLanguages[];
  };
}
