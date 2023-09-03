declare namespace ArticleWidgetTypes {
  import { ContentWidgetType, PageType } from "types/enums";

  export type ArticleWidgetHTML = {
    type: ContentWidgetType;
    value: string;
  };

  export type ArticleWidgetTeaser = TeaserTypes.Teaser;

  export type ArticleWidgetListOfTeasers = TeaserListTypes.TeaserList;

  export type ContentWidgetListOfProducts = TeaserListTypes.ProductList;

  export type QueryArticleWidgetTableOfContentsItem = {
    value: string;
    level: string;
    link: string;
    firstImageUrl: string;
  };

  export type QueryContentWidgetListOfProducts = TeaserListTypes.QueryProducList;

  export type QueryArticleWidgetTableOfContents = {
    tableOfContentsList: QueryArticleWidgetTableOfContentsItem[];
  };

  export type ArticleWidgetFaqItem = {
    id: number;
    translationLink: string | null;
    question: string;
    answer: string;
  };

  export type ArticleWidgetFaq = {
    faqList: Array<ArticleWidgetFaqItem>;
  };

  export type ArticleWidgetTableOfContentsItem = {
    caption: string;
    level: number;
    link: string;
    prefix: string;
    imgUrl: string;
    elementId?: string;
  };

  export type ArticleWidgetTableOfContents = {
    items: ArticleWidgetTableOfContentsItem[];
  };

  export type ArticleWidgetTourItem = {
    id: string;
    name: string;
    lowestPrice: number;
    priceDescription: string;
    image: Image;
    review?: SharedTypes.ProductReview;
    duration?: string;
    linkUrl: string;
    currency: string;
    clientRoute: ClientRoute;
  };

  type ArticleCategoryType = {
    limit: number;
    categories: Array<number>;
  };

  export type ArticleWidgetTour = {
    title: string;
    titleLink?: string;
    icon: string;
    variant: string;
    tours: ArticleCategoryType | null;
    blogs: ArticleCategoryType | null;
    cars: ArticleCategoryType | null;
    articles: ArticleCategoryType | null;
  };

  export type QuickFact = {
    id: number;
    quickfactField: string;
    name: string;
    value: string;
  };

  export interface QueryArticleWidgetListOfQuickFacts {
    type: ContentWidgetType;
    title: string;
    icon: string;
    variant: string;
    listOfQuickFacts: QuickFact[];
  }

  export interface ArticleWidgetListOfQuickFacts extends QueryArticleWidgetListOfQuickFacts {
    listOfQuickFacts: SharedTypes.ProductSpec[];
  }

  export type ArticleWidgetCommonData = {
    type: ContentWidgetType;
    pageType?: PageType;
    data?: {
      type: ContentWidgetType;
    } & (
      | ArticleWidgetHTML
      | QueryArticleWidgetTableOfContents
      | ArticleWidgetFaq
      | ArticleWidgetTeaser
      | ArticleWidgetListOfTeasers
      | QueryContentWidgetListOfProducts
      | QueryArticleWidgetListOfQuickFacts
    );
  };

  export type QueryArticleWidget = ArticleWidgetCommonData &
    (
      | ArticleWidgetHTML
      | QueryArticleWidgetTableOfContents
      | ArticleWidgetFaq
      | ArticleWidgetTeaser
      | ArticleWidgetListOfTeasers
      | QueryContentWidgetListOfProducts
      | QueryArticleWidgetListOfQuickFacts
    );

  export type ArticleWidget = ArticleWidgetCommonData &
    (
      | ArticleWidgetHTML
      | ArticleWidgetTableOfContents
      | ArticleWidgetFaq
      | ArticleWidgetTour
      | ArticleWidgetTeaser
      | ArticleWidgetListOfTeasers
      | ContentWidgetListOfProducts
      | ArticleWidgetListOfQuickFacts
    );
}
