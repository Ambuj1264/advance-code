import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { MapButton } from "./SearchMapButton";

import { gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";
import { column, mqMin, mqMax } from "styles/base";
import { DropdownContainer } from "components/ui/Sort/SortOptionsDropdown";

export const StyledSortOptionsContainer = styled.div``;

export const ListContainerWrapper = styled.div``;

export const ListHeaderWrapper = styled(Row)<{
  isCompact?: boolean;
}>(
  ({ isCompact }) => css`
    position: relative;
    z-index: 1;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: ${isCompact ? "flex-start" : "flex-end"};
    margin-top: ${isCompact ? 0 : gutters.small}px;
    margin-right: 0;
    margin-left: 0;
    max-width: 100%;

    ${mqMin.large} {
      margin-top: ${isCompact ? 0 : gutters.large}px;
      margin-left: 0;
    }
    ${mqMin.desktop} {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      margin-right: 0;
    }
  `
);

export const ListHeaderCenterWrapper = styled(ListHeaderWrapper)`
  ${mqMin.desktop} {
    justify-content: center;
  }
`;

export const ListHeaderCenterColumn = styled.div`
  width: 60%;
  ${mqMax.desktop} {
    width: 100%;
  }
  ${mqMin.desktop} {
    flex-grow: 2;
    margin-right: ${gutters.large}px;
    margin-left: ${gutters.large}px;
    width: auto;
  }
`;

export const ListHeaderColumnRight = styled.div([
  css`
    display: flex;
    align-self: flex-end;
    ${mqMin.desktop} {
      position: relative;
      display: flex;
      flex-grow: 1;
      justify-content: end;
      max-width: 31.7%;
      ${MapButton} + ${StyledSortOptionsContainer} {
        max-width: 60%;
        ${DropdownContainer} {
          display: contents;
        }
        #dropdown {
          max-width: 100%;
        }
      }
      ${MapButton} {
        max-width: calc(40% - ${gutters.small}px);
      }
    }
  `,
]);

export const ListHeaderColumnLeft = styled.div<{ isHidden: boolean }>([
  ({ isHidden }) =>
    css`
      position: relative;
      visibility: ${isHidden ? "hidden" : "visible"};

      ${mqMin.desktop} {
        display: flex;
        flex-grow: 2;
        max-width: 31.7%;
      }
    `,
]);

export const ListWrapper = styled.div`
  position: relative;
  z-index: 0;
  margin: ${gutters.small}px 0;
  ${mqMin.large} {
    margin: ${gutters.large}px 0;
  }
`;

export const NoResultWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  margin-bottom: ${gutters.large * 4}px;
  font-weight: bold;
  text-align: center;
`;

export const GridItemWrapper = styled.div<{
  columnSizes?: SharedTypes.ColumnSizes;
}>(({ columnSizes }) => [
  [column(columnSizes || { small: 1, medium: 1 / 2, desktop: 1 / 3 })],
  css`
    margin-bottom: ${gutters.small}px;

    ${mqMin.medium} {
      margin-bottom: ${gutters.large}px;
    }
  `,
]);

export const GridRow = styled(Row)`
  margin-bottom: -${gutters.small}px;

  ${mqMin.medium} {
    margin-bottom: -${gutters.large}px;
  }
`;
