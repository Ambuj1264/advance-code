import React, { useEffect, useContext, useState, useRef } from "react";
import { useTheme } from "emotion-theming";

import { Header } from "components/ui/TeaserList/TeaserListComponents";
import {
  TeasersContainer,
  TeaserWrapper,
} from "components/ui/TeaserList/variants/TeaserListVertical";
import { getPageColor } from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import Teaser from "components/ui/Teaser/Teaser";
import { PageType, TeaserVariant } from "types/enums";
import ArticleContext from "components/ui/ArticleLayout/ArticleContext";

const PRODUCT_ITEM_HEIGHT = 216;
const TEASERS_DEFAULT_LIMIT = 5;
const RIGHT_SIDE_BAR_WIDGETS_NUMBER = 2;

function calculateNumberOfTeasersToDisplay({
  mainColumnHeight,
  currentColumnHeight,
  currentWidgetHeight,
  isLastWidgetInList,
  numberOfSiblingWidgets,
}: {
  mainColumnHeight: number;
  currentColumnHeight: number;
  currentWidgetHeight: number;
  isLastWidgetInList: boolean;
  numberOfSiblingWidgets: number;
}) {
  const heightAvailableForTeasers = mainColumnHeight - currentColumnHeight + currentWidgetHeight;

  const isMainContentShort = mainColumnHeight < currentColumnHeight;
  if (isMainContentShort) {
    // Share available space between two widget lists.
    // Every section, for example Attractions Nearby and Our Best Tours will be able to
    // render at least one card if there is not enough content in the main column
    const listLengthPerWidget = Math.floor(
      mainColumnHeight / PRODUCT_ITEM_HEIGHT / numberOfSiblingWidgets
    );

    const numberOfTeasersToDisplay = isLastWidgetInList
      ? listLengthPerWidget + 1
      : listLengthPerWidget;
    return numberOfTeasersToDisplay;
  }

  const numberOfTeasersToDisplay = Math.floor(heightAvailableForTeasers / PRODUCT_ITEM_HEIGHT);

  return numberOfTeasersToDisplay;
}

const ContentWidgetListOfTeasersWithDynamicLength = ({
  title,
  titleLink,
  teasers,
  icon,
  pageType,
  isLastWidgetInList = false,
  numberOfSiblingWidgets = RIGHT_SIDE_BAR_WIDGETS_NUMBER,
}: TeaserListTypes.TeaserList & {
  isLastWidgetInList?: boolean;
  numberOfSiblingWidgets?: number;
}) => {
  const theme: Theme = useTheme();
  const [numberOfTeasersToDisplay, setNumberOfTeasersToDisplay] =
    useState<number>(TEASERS_DEFAULT_LIMIT);
  const contentWidgetListRef = useRef<HTMLDivElement>(null);
  const articleContext = useContext(ArticleContext);
  const { mainContentRef, rightColumnRef } = articleContext;
  useEffect(function defineNumberOfTeasersToDisplay() {
    if (!mainContentRef.current || !rightColumnRef.current || !contentWidgetListRef.current) {
      return;
    }
    const teasersToDisplay = calculateNumberOfTeasersToDisplay({
      mainColumnHeight: mainContentRef.current.clientHeight,
      currentColumnHeight: rightColumnRef.current.clientHeight,
      currentWidgetHeight: contentWidgetListRef.current.clientHeight,
      isLastWidgetInList,
      numberOfSiblingWidgets,
    });

    setNumberOfTeasersToDisplay(teasersToDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAttractionPage = pageType === PageType.ATTRACTION;
  const hasDashedArrow =
    !!teasers.length && teasers[0]?.variant === TeaserVariant.IMAGE_TITLE_DISTANCE;
  const hasReversedIconAndText = hasDashedArrow && isAttractionPage;

  const headerColor = isAttractionPage ? getPageColor(pageType, theme) : undefined;

  if (!teasers.length || !numberOfTeasersToDisplay) {
    return null;
  }

  return (
    <>
      <Header
        title={title}
        icon={icon}
        url={titleLink}
        textColor={headerColor}
        isAttractionPage={isAttractionPage}
        hasReversedIconAndText={hasReversedIconAndText}
      />
      <TeasersContainer
        ref={contentWidgetListRef}
        dashedArrow={!isAttractionPage && hasDashedArrow}
      >
        {teasers
          .slice(0, numberOfTeasersToDisplay)
          .map((teaser: TeaserTypes.Teaser, index: number) => {
            return (
              <TeaserWrapper
                // index is the only way to identify item here
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <Teaser
                  {...teaser}
                  image={teaser.image && { ...teaser.image, name: teaser.title }}
                />
              </TeaserWrapper>
            );
          })}
      </TeasersContainer>
    </>
  );
};

export default ContentWidgetListOfTeasersWithDynamicLength;
