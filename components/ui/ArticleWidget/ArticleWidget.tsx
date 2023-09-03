import React from "react";

import LazyComponent, { LazyloadOffset } from "../Lazy/LazyComponent";

import ArticleWidgetHTML from "./widgets/ArticleWidgetHTML";
import ArticleWidgetTableOfContents from "./widgets/ArticleWidgetTableOfContents";
import ArticleWidgetProductChunkContainer from "./widgets/ArticleWidgetProduct/ArticleWidgetProductChunkContainer";
import ArticleWidgetQuickFacts from "./widgets/ArticleWidgetQuickFacts";
import ContentWidgetTeaser from "./widgets/ContentWidgetTeaser";
import ContentWidgetListOfProducts from "./widgets/ContentWidgetListOfProducts";
import ContentWidgetListOfTeasersWithDynamicLength from "./widgets/ContentWidgetListOfTeasersWithDynamicLength";

import TeaserList from "components/ui/TeaserList/TeaserList";
import { ContentWidgetType, TeaserListVariant, PageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const ArticleWidget = ({
  widget,
  isFirstWidgetInList,
  isLastWidgetInList,
}: {
  widget: ArticleWidgetTypes.ArticleWidget;
  isFirstWidgetInList?: boolean;
  isLastWidgetInList?: boolean;
}) => {
  switch (widget.type) {
    case ContentWidgetType.HTML:
      return (
        <LazyHydrateWrapper ssrOnly>
          <ArticleWidgetHTML
            {...(widget as ArticleWidgetTypes.ArticleWidgetHTML)}
            isFirst={isFirstWidgetInList}
          />
        </LazyHydrateWrapper>
      );
    case ContentWidgetType.TABLE_OF_CONTENTS:
      return (
        <LazyHydrateWrapper ssrOnly>
          <ArticleWidgetTableOfContents
            {...(widget as ArticleWidgetTypes.ArticleWidgetTableOfContents)}
          />
        </LazyHydrateWrapper>
      );

    case ContentWidgetType.TEASER:
      return (
        <LazyHydrateWrapper whenVisible>
          <ContentWidgetTeaser {...(widget as ArticleWidgetTypes.ArticleWidgetTeaser)} />
        </LazyHydrateWrapper>
      );

    case ContentWidgetType.LIST_OF_TEASERS: {
      const listOfTeasersWidget = widget as ArticleWidgetTypes.ArticleWidgetListOfTeasers;
      const isLengthOfVerticalTeaserListDynamic =
        listOfTeasersWidget.variant === TeaserListVariant.VERTICAL &&
        listOfTeasersWidget.pageType === PageType.ATTRACTION;
      if (isLengthOfVerticalTeaserListDynamic) {
        return (
          <ContentWidgetListOfTeasersWithDynamicLength
            {...(widget as ArticleWidgetTypes.ArticleWidgetListOfTeasers)}
            isLastWidgetInList={isLastWidgetInList}
            numberOfSiblingWidgets={isFirstWidgetInList === isLastWidgetInList ? 1 : undefined}
          />
        );
      }

      return (
        <LazyHydrateWrapper ssrOnly>
          <TeaserList {...(widget as ArticleWidgetTypes.ArticleWidgetListOfTeasers)} />
        </LazyHydrateWrapper>
      );
    }

    case ContentWidgetType.LIST_OF_TOURS:
    case ContentWidgetType.LIST_OF_HOTELS:
    case ContentWidgetType.LIST_OF_CARS:
      return (
        <ContentWidgetListOfProducts
          widget={widget as ArticleWidgetTypes.ContentWidgetListOfProducts}
        />
      );

    case ContentWidgetType.LIST_OF_PRODUCTS:
      return (
        <LazyComponent lazyloadOffset={LazyloadOffset.Tiny}>
          <ArticleWidgetProductChunkContainer
            {...(widget as ArticleWidgetTypes.ArticleWidgetTour)}
          />
        </LazyComponent>
      );

    case ContentWidgetType.LIST_OF_QUICK_FACTS:
      return (
        <ArticleWidgetQuickFacts
          {...(widget as ArticleWidgetTypes.ArticleWidgetListOfQuickFacts)}
        />
      );

    /* Case: "teaser".
     * This type of teasers are only for testing and contains mocked data.
     * It shouldn't be on production.
     * */
    default:
      /* TODO: Unknown widget type: {widget.type} */
      return null;
  }
};

export default ArticleWidget;
