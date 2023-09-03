import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { PB_ITINERARY_ICON_TYPE, PB_ITINERARY_TRAVELMODE_TYPE } from "../types/postBookingEnums";
import { PostBookingTypes } from "../types/postBookingTypes";

import { getCustomIcon, getTravelModeIcon } from "./iconUtils";
import { PBProductCards } from "./PBProductCards";
import { StyledPBProductCardsWrapper } from "./PBSharedComponents";

import ArrowDown from "components/icons/arrow-down.svg";
import { greyColor, gutters } from "styles/variables";
import { mqMin } from "styles/base";
import {
  typographyBody1,
  typographyBody2,
  typographyH5,
  typographySubtitle1,
  typographySubtitle2Regular,
} from "styles/typography";

const StyledBlockText = styled.div<{ withBottomPadding?: boolean }>(
  ({ withBottomPadding = false }) => [
    css`
      ${typographyBody2};
      color: ${greyColor};
      ${mqMin.large} {
        ${typographyBody1};
      }
    `,
    withBottomPadding &&
      css`
        padding-bottom: ${gutters.small}px;
        ${mqMin.large} {
          padding-bottom: ${gutters.large}px;
        }
      `,
  ]
);

const innerPaddingMobile = `padding: 0 0 0 ${gutters.small}px`;
const innerPaddingDesktop = `padding: 0 0 0 ${gutters.large + gutters.large / 2}px`;

const StyledArrowDown = styled(ArrowDown)(
  ({ theme }) => `
  position: absolute;
  fill: ${theme.colors.primary};
  left: -4px;
  width: 7px;
  height: auto;
  transform: translateY(-100%);

  ${mqMin.large} {
    left: -5px;
    width: 9px;
   }
`
);

const StyledBlockWithLine = styled.div<{ withMultipleProductCards?: boolean }>(
  ({ theme, withMultipleProductCards = false }) => [
    css`
      position: relative;
      border-left: 1px solid ${theme.colors.primary};
      ${innerPaddingMobile};

      ${StyledBlockText} + ${StyledPBProductCardsWrapper} {
        margin-top: ${gutters.small}px;
      }

      ${mqMin.large} {
        ${innerPaddingDesktop};

        ${StyledBlockText} + ${StyledPBProductCardsWrapper} {
          margin-top: ${gutters.large}px;
        }
      }
    `,
    withMultipleProductCards &&
      css`
        margin-right: -${gutters.small}px;
        ${mqMin.large} {
          margin-right: 0;
        }
      `,
  ]
);

const StyledHeading = styled.div(
  ({ theme }) => css`
    position: relative;
    margin: ${gutters.small}px 0 ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    ${typographySubtitle1};
    ${innerPaddingMobile};

    ${mqMin.large} {
      ${innerPaddingDesktop};
      ${typographyH5};
      margin: ${gutters.large + gutters.small / 2}px 0 ${gutters.small}px;
    }
  `
);

const StyledTransportationHeading = styled.div(
  ({ theme }) => css`
    position: relative;
    margin: ${gutters.small}px 0 ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    ${typographySubtitle2Regular};
    ${innerPaddingMobile};

    ${mqMin.large} {
      ${innerPaddingDesktop};
      ${typographyBody1};
      margin: ${gutters.large}px 0 ${gutters.small}px;
    }
  `
);

export const StyledIconWrapper = styled.div(
  () => css`
    position: absolute;
    top: 50%;
    left: 0;
    max-height: 16px;
    transform: translate(-50%, -50%);
    svg {
      width: 100%;
      max-height: 16px;
    }
    ${mqMin.large} {
      max-height: 24px;
      svg {
        width: 100%;
        max-height: 24px;
      }
    }
  `
);

export const PostBookingTimelineItem = ({
  iconType,
  transportationIconType,
  title,
  date,
  countryCode,
  productCards,
  text,
  transportationText,
  withArrow = true,
}: {
  iconType: PB_ITINERARY_ICON_TYPE;
  title: string;
  transportationText?: string;
  transportationIconType: PB_ITINERARY_TRAVELMODE_TYPE;
  date?: Date;
  countryCode?: string;
  withArrow?: boolean;
  text?: string;
  productCards?: PostBookingTypes.ProductCard[];
}) => {
  const hasProductCards = productCards && productCards?.length > 0;

  return (
    <>
      {title && (
        <StyledHeading>
          {title}
          <StyledIconWrapper>{getCustomIcon(iconType, date, countryCode)}</StyledIconWrapper>
        </StyledHeading>
      )}
      {text && (
        <StyledBlockWithLine>
          <StyledBlockText withBottomPadding={!transportationText && hasProductCards}>
            {text}
          </StyledBlockText>
          {withArrow && !hasProductCards && <StyledArrowDown />}
        </StyledBlockWithLine>
      )}
      {transportationText && (
        <StyledTransportationHeading>
          {transportationText}
          <StyledIconWrapper>{getTravelModeIcon(transportationIconType)}</StyledIconWrapper>
        </StyledTransportationHeading>
      )}
      {hasProductCards && (
        <StyledBlockWithLine withMultipleProductCards={productCards.length > 1}>
          <PBProductCards products={productCards} />

          {withArrow && <StyledArrowDown />}
        </StyledBlockWithLine>
      )}
    </>
  );
};
