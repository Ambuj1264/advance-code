import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import ClientLink from "../ClientLink";

import {
  borderRadius20,
  fontSizeCaption,
  fontWeightSemibold,
  greyColor,
  gutters,
  whiteColor,
} from "styles/variables";
import { mqMin } from "styles/base";

type ACTION_BUTTON_TYPE = "primary" | "secondary";

const getButtonBackground = (theme: Theme, type?: ACTION_BUTTON_TYPE) => {
  switch (type) {
    case "primary":
      return theme.colors.primary;
    case "secondary":
      return theme.colors.action;
    default:
      return whiteColor;
  }
};

export const StyledActionButtonContentWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 ${gutters.small / 2}px;
`;

export const StyledActionButton = styled.div<{
  displayType?: ACTION_BUTTON_TYPE;
}>(({ theme, displayType }) => [
  css`
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    border-radius: ${borderRadius20};
    height: 32px;

    background: ${getButtonBackground(theme, displayType)};
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
    line-height: 1;
    &:hover {
      cursor: pointer;
    }
  `,
  !displayType &&
    css`
      border: 1px solid ${rgba(greyColor, 0.2)};
      color: ${theme.colors.primary};
    `,
]);

const iconStyles = css`
  flex-shrink: 0;
  margin-right: ${gutters.small / 4}px;
  width: 16px;
  max-height: 16px;
`;

export const StyledActionButtonTitle = styled.span`
  flex-shrink: 1;
  max-width: calc(100% - 16px);
`;

export const ProductCardActionButtonsWrapper = styled.div(
  ({
    isTileCard = false,
    isSingleButton = false,
    showOnlyTwoButtonsOnMobileListCard = false,
    isStreetViewAvailable = false,
  }: {
    isTileCard: boolean;
    isSingleButton?: boolean;
    showOnlyTwoButtonsOnMobileListCard?: boolean;
    isStreetViewAvailable?: boolean;
    children: React.ReactNode;
  }) => [
    css`
      display: grid;
      align-items: center;
      grid-gap: ${gutters.small}px;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      padding-top: ${gutters.small / 4}px;
    `,
    isSingleButton &&
      css`
        ${StyledActionButton} {
          grid-column-start: 2;
        }
      `,
    showOnlyTwoButtonsOnMobileListCard &&
      css`
        ${StyledActionButton} {
          &:nth-of-type(3) {
            grid-row-start: auto;
          }
        }
      `,
    showOnlyTwoButtonsOnMobileListCard &&
      isStreetViewAvailable &&
      css`
        ${StyledActionButton} {
          &:nth-of-type(1) {
            display: none;
            grid-row-start: 2;
          }
          &:nth-of-type(3) {
            grid-row-start: auto;
          }
        }
      `,
    !isTileCard &&
      css`
        ${mqMin.large} {
          display: flex;

          justify-content: flex-end;
          grid-gap: 0;
          padding-top: ${gutters.small / 4}px;

          ${StyledActionButton} {
            flex-grow: 1;
            max-width: 136px;

            &:nth-of-type(1) {
              display: flex;
              grid-row-start: 1;
            }
            &:nth-of-type(3) {
              grid-row-start: 1;
            }

            &:nth-of-type(2n) {
              margin: 0 ${gutters.small}px;
            }
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      `,
  ]
);

export const ProductCardActionButton = ({
  displayType,
  Icon,
  title,
  className,
  onClick,
  clientRoute,
  href,
}: {
  displayType?: ACTION_BUTTON_TYPE;
  title: string;
  clientRoute?: SharedTypes.ClientRoute;
  href?: string;
  onClick?: () => void;
  Icon?: ElementType;
  className?: string;
}) => {
  return (
    <StyledActionButton displayType={displayType} className={className}>
      <StyledActionButtonContentWrapper
        onClick={onClick}
        {...(clientRoute ? { as: ClientLink, clientRoute } : {})}
        {...(href ? { as: "a", href, target: "_blank" } : {})}
      >
        {Icon && <Icon css={iconStyles} />}
        <StyledActionButtonTitle>{title}</StyledActionButtonTitle>
      </StyledActionButtonContentWrapper>
    </StyledActionButton>
  );
};
