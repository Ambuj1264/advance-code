/* eslint-disable camelcase */
declare namespace ArticleSearchPageTypes {
  export type ArticleSearchHeader = {
    metadata: SharedTypes.PageCategoriesMetaType;
    category: {
      id: number;
      name: string;
      image: Image;
    };
  };

  export type PageQuery = {
    articleSearchHeader: ArticleSearchHeader;

    settings: {
      articleSearchPageTopCategories: {
        metadata: SharedTypes.PageCategoriesMetaType;
        categories: SharedTypes.PageCategoryItemType[];
      };
    };

    bestTravelPlans: {
      metadata: SharedTypes.PageSectionMetadata;
      tours: SharedTypes.QueryTourAlternate[];
    };

    topAttractions: {
      metadata: SharedTypes.PageSectionMetadata;
      attractions: SharedTypes.PageTopAttraction[];
    };

    topThingsToDo: {
      metadata: SharedTypes.PageCategoriesMetaType;
      categories: SharedTypes.PageCategoryItemType[];
    };

    searchLink: string;
  };

  export type TopArticlesQuery = {
    topArticles?: {
      totalArticles: number;
      metadata: SharedTypes.PageSectionMetadata;
      articles: SharedTypes.TopArticle[];
    };
  };

  export type PageClientQuery = {
    bestTravelPlans?: { tours: SharedTypes.QueryClientTourAlternate[] };
  };
}
