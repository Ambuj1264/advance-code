declare namespace ArticleLayoutTypes {
  export type Meta = {
    title: string;
    ogType: string;
    description: string;
    ogDescription: string;
    facebookLikeUrl?: string;
    facebookCommentsUrlOverride?: string;
    pairs: Array<{ key: string; value: string }>;
  };

  export type Article = {
    id: number;
    publishedTime: string;
    modifiedTime: string;
    title: string;
    metadata: SharedTypes.Metadata;
    isIndexed: boolean;
    draft: boolean;
    image: ArticleImage;
    images: Image[];
    metaImages: Image[];
    slug: string;
    url: string;
    uriMetaEditing: string;
    author: ArticleAuthor;
    hrefLangs: LocaleLink[];
    tourLandingUrl?: string;
    content: {
      left: ArticleWidgetTypes.ArticleWidget[];
      main: ArticleWidgetTypes.ArticleWidget[];
      right: ArticleWidgetTypes.ArticleWidget[];
    };
    contentPageMainFormatted?: ArticleWidgetTypes.QueryArticleWidget[];
    bottom: ArticleWidgetTypes.ArticleWidget[];
    tableOfContents?: ArticleWidgetTypes.ArticleWidgetTableOfContents;
  };

  export interface Attraction extends Omit<Article, "author"> {
    name: string;
    shortDescription: string;
    reviewTotalScore?: number;
    reviewTotalCount?: number;
    isGoogleReview: boolean;
    props: SharedTypes.ProductProp[];
    latitude: number;
    longitude: number;
    location: string;
    map: SharedTypes.Map | null;
    toursSearchUrl: string;
    carsSearchUrl: string;
    hotelsSearchUrl: string;
    tourCategoryUrls: string[];
    isABTestEnabled: boolean;
  }

  export type ArticleImage = {
    id: string;
    url: string;
    alt?: string;
    name?: string;
    width?: number | null;
    height?: number | null;
  };

  export type ArticleAuthor = {
    id: number;
    name: string;
    url: string;
    faceImage: ArticleFaceImage;
    userInfo: ArticleUserInfo;
    roles?: {
      id: "local" | "travel-blogger";
    }[];
  };

  export type ArticleFaceImage = {
    alt?: string;
    avatarUrl: string;
  };

  export type ArticleUserInfo = {
    verified: boolean;
  };
}
