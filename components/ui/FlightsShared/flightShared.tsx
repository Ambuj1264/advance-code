import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographyCaption } from "styles/typography";
import { gutters, greyColor } from "styles/variables";
import { column, mqMin } from "styles/base";

export const Column = styled.div([
  column({ small: 1, large: 1 / 2 }),
  css`
    margin-top: ${gutters.small}px;
  `,
]);

export const ColumnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ItemWrapper = styled.div`
  width: 100%;
  &:first-of-type {
    margin-right: ${gutters.large}px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: ${gutters.large}px;
`;

export const Banner = styled.div(
  typographyCaption,
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      margin: 0 ${gutters.small / 2}px;
      width: 100%;
      height: 40px;
      padding-left: ${gutters.small}px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      color: ${theme.colors.primary};
      ${mqMin.large} {
        margin: 0 ${gutters.large / 2}px;
      }
    `
);

export const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: ${gutters.small}px;
  height: 1px;
  background-color: ${rgba(greyColor, 0.1)};
  ${mqMin.large} {
    width: 1px;
    height: auto;
  }
`;

export const SectionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${mqMin.large} {
    flex-direction: row;
  }
`;

export const MarginWrapper = styled.div`
  margin: ${gutters.large}px;
`;
