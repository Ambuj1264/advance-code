import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import BaseInputWrapper from "components/ui/InputWrapper";
import { typographyH5, typographyBody2, typographySubtitle2 } from "styles/typography";
import { greyColor, gutters, blackColor } from "styles/variables";

export const Heading = styled.div([
  typographyH5,
  css`
    margin-top: ${gutters.small}px;
    color: ${greyColor};
  `,
]);

export const SubHeading = styled.span([
  typographySubtitle2,
  css`
    margin-top: ${gutters.small / 2}px;
    color: ${greyColor};
  `,
]);

export const InputWrapper = styled(BaseInputWrapper)`
  margin-top: ${gutters.large / 2}px;
`;

export const ToggleButtonLabel = styled.p<{ width?: string }>(({ width = "250px" }) => [
  typographyBody2,
  css`
    margin-right: ${gutters.small}px;
    width: ${width};
    min-width: 220px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const ToggleButtonWrapper = styled.div`
  display: flex;
  margin: ${gutters.small}px 0;

  & + & {
    margin-top: 0;
  }
`;
