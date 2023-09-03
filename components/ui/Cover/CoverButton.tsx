import React, { ReactNode } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import isPropValid from "@emotion/is-prop-valid";

import { whiteColor, gutters, greyColor, borderRadiusSmall } from "styles/variables";
import { mqMin } from "styles/base";
import { typographyCaptionSmall } from "styles/typography";

const Button = styled("button", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "responsiveThumbnails",
})<{
  isButton: boolean;
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
}>(({ isButton, responsiveThumbnails }) => [
  typographyCaptionSmall,
  (responsiveThumbnails?.medium ?? 0) > 0 &&
    css`
      ${mqMin.medium} {
        display: none;
      }
    `,
  (responsiveThumbnails?.large ?? 0) > 0 &&
    css`
      ${mqMin.large} {
        display: none;
      }
    `,
  (!responsiveThumbnails || responsiveThumbnails?.desktop > 0) &&
    css`
      ${mqMin.desktop} {
        display: none;
      }
    `,
  css`
    align-items: center;
    border-radius: ${borderRadiusSmall};
    padding: ${gutters.small / 2}px;
    background-color: ${rgba(greyColor, 0.5)};
    color: ${whiteColor};
    ${!isButton && "pointer-events: none"};
  `,
]);

const CoverButton = ({
  id,
  onClick,
  children,
  isButton = true,
  responsiveThumbnails,
}: {
  id: string;
  onClick?: () => void;
  children: ReactNode;
  isButton?: boolean;
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
}) => {
  return (
    <Button
      id={id}
      onClick={() => onClick && onClick()}
      isButton={isButton}
      responsiveThumbnails={responsiveThumbnails}
    >
      {children}
    </Button>
  );
};
export default CoverButton;
