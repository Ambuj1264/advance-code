import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import TileProductCard from "components/ui/Search/TileProductCard";
import { column, mqMin, mediaQuery, mqIE, styledWebkitScrollbar } from "styles/base";
import { gutters, webKitScrollBarHeight } from "styles/variables";
import Row from "components/ui/Grid/Row";

export const RowWrapper = styled.div`
  ${Row} {
    ${styledWebkitScrollbar};
    flex-wrap: nowrap;
    padding-bottom: ${webKitScrollBarHeight}px;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    &::-webkit-scrollbar-track {
      margin: 0 ${gutters.large / 2}px;
    }
    ${mediaQuery({
      marginLeft: [`-${gutters.small}px`, `-${gutters.small}px`, `-${gutters.large / 2}px`],
      marginRight: [`-${gutters.small}px`, `-${gutters.small}px`, `-${gutters.large / 2}px`],
    })}
  }
`;

export const SimilarProductsColumn = styled.div([
  column({ small: 1, large: 1 / 2, desktop: 1 / 3 }),
  css`
    min-width: 300px;
    scroll-snap-align: start;
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
      :nth-of-type(3) {
        display: none;
      }
    }
    ${mqMin.desktop} {
      :nth-of-type(3) {
        display: block;
      }
    }
    ${mqIE} {
      min-width: auto;
    }
  `,
]);

const SimilarProductsWrapper = ({
  similarProducts,
  currencyCode,
  convertCurrency,
  className,
}: {
  similarProducts: SharedTypes.SimilarProduct[];
  currencyCode: string;
  convertCurrency: (value: number) => number;
  className?: string;
}) => {
  return (
    <RowWrapper className={className}>
      <Row>
        {similarProducts.map((similarProduct: SharedTypes.SimilarProduct) => (
          <SimilarProductsColumn key={similarProduct.id}>
            <TileProductCard
              headline={similarProduct.name}
              price={convertCurrency(similarProduct.lowestPrice)}
              image={similarProduct.image}
              reviewsCount={similarProduct.review?.totalCount}
              averageRating={similarProduct.review?.totalScore}
              currency={currencyCode}
              clientRoute={similarProduct.clientRoute}
              isMobile={false}
              productProps={similarProduct.productProps}
              productSpecs={similarProduct.productSpecs}
              linkUrl={similarProduct.linkUrl}
              imageHeight={184}
              ribbonLabelText={similarProduct.ribbonText}
              linkTarget=""
              fallBackImg={similarProduct.fallBackImg}
            />
          </SimilarProductsColumn>
        ))}
      </Row>
    </RowWrapper>
  );
};
export default SimilarProductsWrapper;
