import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css, SerializedStyles } from "@emotion/core";

import AutocompleteInput from "../Inputs/AutocompleteInput/AutocompleteInput";
import { ContentWrapper } from "../Inputs/ContentDropdown";
import { Wrapper } from "../Inputs/Input";

import { blackColor, gutters, greyColor } from "styles/variables";
import { typographyBody1, typographyCaptionSemibold } from "styles/typography";

export const AutocompleteInputModalStyled = styled(AutocompleteInput)(
  ({ theme }) => css`
    input {
      ${typographyBody1}
    }
    ${Wrapper} {
      border: 1px solid ${theme.colors.primary};
    }
  `
);

export const AutocompleteDoubleInputModalStyled = styled(AutocompleteInput)(
  ({ theme }) => css`
    input {
      ${typographyBody1}
    }
    ${Wrapper} {
      border: 1px solid ${theme.colors.primary};
    }
    ${ContentWrapper} {
      position: static;
    }
  `
);

export const ListItemModal = styled.a<{
  hasIcons: boolean;
  css: SerializedStyles;
}>(({ css: itemDefaultCss }) => [
  itemDefaultCss,
  css`
    &:last-of-type {
      border-bottom: 1px solid ${rgba(greyColor, 0.1)};
    }
  `,
]);

export const LabelWrapper = styled.div`
  display: flex;
  margin: ${gutters.small}px 0 ${gutters.small / 2}px 0;
`;

export const Label = styled.div([
  typographyCaptionSemibold,
  css`
    flex-basis: 50%;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const DoubleLabel = ({
  leftLabel,
  rightLabel,
  className,
}: {
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}) => (
  <LabelWrapper className={className}>
    {leftLabel && <Label>{leftLabel}</Label>}
    {rightLabel && <Label>{rightLabel}</Label>}
  </LabelWrapper>
);
