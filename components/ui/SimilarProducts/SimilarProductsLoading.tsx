import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { column, mqMin, mediaQuery, skeletonPulse, skeletonPulseBlue } from "styles/base";
import Row from "components/ui/Grid/Row";
import { borderRadiusSmall, boxShadowTileRegular, greyColor, gutters } from "styles/variables";

const CardLoading = styled.div<{ height: number }>(
  ({ height }) =>
    css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      box-shadow: ${boxShadowTileRegular};
      border-radius: ${borderRadiusSmall};
      height: ${height}px;
      align-content: center;
    `
);

const CardImageLoading = styled.div(
  skeletonPulseBlue,
  css`
    border-top-left-radius: ${borderRadiusSmall};
    border-top-right-radius: ${borderRadiusSmall};
    width: 100%;
    height: 184px;
  `
);

const Title = styled.div([
  skeletonPulse,
  css`
    align-self: center;
    margin-top: ${gutters.small}px;
    margin-bottom: ${gutters.large * 2}px;
    width: 80%;
    height: 20px;
  `,
]);

const QFIcon = styled.div([
  skeletonPulse,
  css`
    margin-right: 8px;
    width: 40px;
    height: 32px;
  `,
]);

export const QFText = styled.div([
  skeletonPulse,
  css`
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - 48px);
    height: 12px;

    &:nth-of-type(2) {
      top: 18px;
    }
  `,
]);

const QFItem = styled.div`
  position: relative;
  margin-bottom: ${gutters.small}px;
  width: 40%;

  &:nth-of-type(2n) {
    margin-left: 10%;
  }
`;

const QFWrapper = styled.div`
  display: flex;
  align-items: space-around;
  justify-content: space-around;
  width: 100%;
  padding: 0 12px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 48px;
  padding: 0 ${gutters.small}px;
  background-color: ${rgba(greyColor, 0.05)};
`;

const ItemPrice = styled.div([
  skeletonPulse,
  css`
    width: 100px;
    height: 28px;
  `,
]);

export const QFGroup = ({ className }: { className?: string }) => {
  return (
    <QFItem className={className}>
      <QFIcon />
      <QFText />
      <QFText />
    </QFItem>
  );
};

const RowWrapper = styled.div([
  css`
    ${Row} {
      flex-wrap: nowrap;
      overflow-x: scroll;
      ${mediaQuery({
        paddingBottom: ["12px", "4px"],
        marginLeft: [`-${gutters.small}px`, `-${gutters.small}px`, `-${gutters.large / 2}px`],
        marginRight: [`-${gutters.small}px`, `-${gutters.small}px`, `-${gutters.large / 2}px`],
      })}

      ${mqMin.large} {
        overflow-x: auto;
      }
    }
  `,
]);

const Column = styled.div([
  column({ small: 1 / 3 }),
  css`
    min-width: 250px;
    :first-of-type {
      border-left: ${gutters.small / 2}px solid transparent;
    }
    :last-of-type {
      border-right: ${gutters.small / 2}px solid transparent;
    }
    ${mqMin.large} {
      min-width: unset;
      :first-of-type,
      :last-of-type {
        border: none;
      }
    }
  `,
]);

const loadingColumn = (height: number) => (
  <Column>
    <CardLoading height={height}>
      <CardImageLoading />
      <Title />
      <QFWrapper>
        <QFGroup />
        <QFGroup />
      </QFWrapper>
      <QFWrapper>
        <QFGroup />
        <QFGroup />
      </QFWrapper>
      <CardFooter>
        <ItemPrice />
      </CardFooter>
    </CardLoading>
  </Column>
);

const SimilarProductsLoading = ({
  height = 408,
  className,
}: {
  height?: number;
  className?: string;
}) => {
  return (
    <RowWrapper className={className}>
      <Row>
        {loadingColumn(height)}
        {loadingColumn(height)}
        {loadingColumn(height)}
      </Row>
    </RowWrapper>
  );
};
export default SimilarProductsLoading;
