import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import ArrowRight from "@travelshift/ui/icons/arrow.svg";

import { greyColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { mqMin } from "styles/base";

export const ArrowRightStyled = styled(ArrowRight, {
  shouldForwardProp: () => false,
})<{
  isDisabled: boolean;
}>(({ isDisabled, theme }) => [
  css`
    width: 8px;
    height: 12px;
    fill: ${theme.colors.primary};
  `,
  isDisabled &&
    css`
      fill: ${rgba(greyColor, 0.7)};
    `,
]);

export const ArrowLeftStyled = styled(ArrowRightStyled)`
  transform: rotate(-180deg);
`;

const linkStyles = ({ theme }: { theme: Theme }) => [
  typographySubtitle2,
  css`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;

    ${mqMin.medium} {
      width: 48px;
      height: 48px;
      line-height: 48px;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 25px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }
  `,
];

const arrowElementStyles = (isDisabled: boolean) => [
  linkStyles,
  isDisabled &&
    css`
      pointer-events: none;
    `,
];

export const ArrowLink = styled.a<{ isDisabled: boolean }>(({ isDisabled }) =>
  arrowElementStyles(isDisabled)
);

export const ArrowButton = styled.button<{ isDisabled: boolean }>(({ isDisabled }) =>
  arrowElementStyles(isDisabled)
);
