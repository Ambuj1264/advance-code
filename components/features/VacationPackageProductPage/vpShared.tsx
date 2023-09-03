import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import SectionContent from "components/ui/Section/SectionContent";
import { mqMax, mqMin } from "styles/base";
import { typographyBody2, typographySubtitle1 } from "styles/typography";
import { fontWeightSemibold, gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";

export const ModalBanner = styled.div(
  typographyBody2,
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: ${gutters.large}px;
      margin-left: -${gutters.large}px;
      width: calc(100% + ${gutters.large * 2}px);
      height: 32px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};

      ${mqMax.large} {
        margin-top: ${gutters.small}px;
        margin-left: -${gutters.small}px;
        width: calc(100% + ${gutters.small * 2}px);
      }
    `
);

export const VPStyledSectionContent = styled(SectionContent)<{ overflowXHidden?: boolean }>(
  ({ overflowXHidden = false }) => [
    css`
      ${mqMin.large} {
        margin-top: ${gutters.small}px;
      }
    `,
    overflowXHidden &&
      css`
        ${mqMin.large} {
          overflow-x: hidden;
        }
      `,
  ]
);

export const LeftSectionHeading4 = styled.h4<{}>(({ theme }) => [
  typographySubtitle1,
  css`
    color: ${theme.colors.primary};
    text-align: left;
  `,
]);

export const StyledRow = styled(Row)`
  margin-bottom: ${gutters.large}px;
  ${mqMax.large} {
    margin-bottom: ${gutters.small}px;
  }
`;
