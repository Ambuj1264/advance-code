declare namespace ContentTypes {
  export type QueryContentData = {
    contentPage: QueryContent;
    tourLandingUrl?: string;
  };

  export interface QueryContent {
    uriMetaEditing: string;
    publishedTime: string;
    modifiedTime: string;
    id: number;
    title: string;
    localeID: string;
    uri: string;
    frontUrl: string;
    isIndexed: boolean;
    draft: boolean;
    author: ArticleAuthor;
    image: QueryImage;
    images: Array<QueryImage>;
    hrefLangs: LocaleLink[];
    content: {
      contentPageLeftSidebar: ArticleWidgetTypes.QueryArticleWidget[];
      contentPageMain: ArticleWidgetTypes.QueryArticleWidget[];
      contentPageRightSidebar: ArticleWidgetTypes.QueryArticleWidget[];
    };
    contentPageMainFormatted?: ArticleWidgetTypes.QueryArticleWidget[];
    deleted: boolean;
    visible: boolean;
    metadata: Meta;
  }

  export type QueryArticleContentData = {
    contentPage: QueryContent;
  };

  export type QueryArticleTourLandingUrl = {
    tourLandingUrl: string;
  };

  export type QueryAttractionData = {
    contentPage: QueryAttraction;
    tourLandingUrl: string;
  };

  export interface QueryAttraction extends ContentTypes.QueryContent {
    title: string;
    name: string;
    shortDescription: string;
    reviewTotalScore?: string;
    reviewTotalCount?: number;
    isGoogleReview: boolean;
    props: SharedTypes.QueryProductProp[];
    latitude: number;
    longitude: number;
    imageMap: QueryImage;
    location: string;
    toursSearchUrl: string;
    carsSearchUrl: string;
    hotelsSearchUrl: string;
    tourCategoryUrls: string[];
    isABTestEnabled: boolean;
    nearbyMapPoints: SharedTypes.QueryMapPoint[];
  }
}
