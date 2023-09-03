import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { Header } from "../TeaserListComponents";

import { getPageColor } from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import Teaser from "components/ui/Teaser/Teaser";
import { borderRadius, gutters, separatorColor } from "styles/variables";
import { TeaserVariant, PageType } from "types/enums";

export const TeasersContainer = styled.div<{ dashedArrow: boolean }>(({ dashedArrow }) => [
  css`
    margin-top: ${gutters.small}px;
    margin-bottom: ${gutters.large * 1.5}px;
  `,
  dashedArrow &&
    css`
      position: relative;
      margin: ${gutters.small + gutters.large / 2}px ${-gutters.large / 2}px
        ${gutters.large * 1.5}px ${-gutters.large / 2}px;
      border: 1px dashed #999;
      border-top: 0;
      border-radius: 0 0 ${borderRadius} ${borderRadius};
      padding: 0 ${gutters.large / 2}px ${gutters.small}px ${gutters.large / 2}px;

      &::before {
        content: "";
        position: absolute;
        top: ${-gutters.small}px;
        right: -1px;
        left: -1px;
        border: 1px solid #999;
        border-bottom: 0;
        border-radius: ${borderRadius} ${borderRadius} 0 0;
        height: 16px;
        overflow: hidden;
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: -6px;

        width: 0;
        height: 0;
        border-color: #999 transparent transparent transparent;
        border-style: solid;
        border-width: 12px 5.5px 0 5.5px;
      }
    `,
]);

export const TeaserWrapper = styled.div<{
  hasBottomSeparator?: boolean;
}>(({ hasBottomSeparator }) => [
  css`
    margin-top: ${gutters.small}px;
  `,
  hasBottomSeparator &&
    css`
      margin-top: ${gutters.small}px;
      margin-bottom: ${gutters.small}px;
      border-bottom: 1px solid ${separatorColor};
      padding-bottom: ${gutters.small}px;
    `,
]);

const TeaserListVertical = ({
  title,
  titleLink,
  teasers,
  icon,
  pageType,
}: TeaserListTypes.TeaserList) => {
  const theme: Theme = useTheme();

  const hasDashedArrow =
    !!teasers.length && teasers[0].variant === TeaserVariant.IMAGE_TITLE_DISTANCE;
  const isAttractionPage = pageType === PageType.ATTRACTION;
  const hasReversedIconAndText = hasDashedArrow && isAttractionPage;

  const headerColor = isAttractionPage ? getPageColor(pageType, theme) : undefined;

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
      <TeasersContainer dashedArrow={!isAttractionPage && hasDashedArrow}>
        {teasers.map((teaser: TeaserTypes.Teaser, index: number) => {
          return (
            <TeaserWrapper
              // index is the only way to identify item here
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              hasBottomSeparator={
                [
                  TeaserVariant.SIDE_CARD,

                  // Actually, only SIDE_CARD should have separator,
                  // but the following variants are not implemented yet so they all
                  // render as a TeaserVariant.SIDE_CARD
                  TeaserVariant.SIDE_CARD_WITH_BUTTON,
                  TeaserVariant.SIDE_CARD_WITH_LINK,
                ].indexOf(teaser.variant) > -1 && index < teasers.length - 1
              }
            >
              {/* TODO: tmp substituted variant! Please remove this before PR! */}
              <Teaser {...teaser} />
            </TeaserWrapper>
          );
        })}
      </TeasersContainer>
    </>
  );
};

export default TeaserListVertical;
