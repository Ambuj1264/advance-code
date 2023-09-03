import React from "react";
import styled from "@emotion/styled";

import ProductSpecs from "components/ui/Information/ProductSpecs";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

export const ProductSpecsStyled = styled(ProductSpecs)`
  width: 100%;
  ${mqMin.medium} {
    float: none;
    margin: 0;
    width: 100%;
    padding: 0px 0px ${gutters.large / 2}px 0px;
  }
`;

const ItemCardFacts = ({ itemFacts }: { itemFacts: SharedTypes.ProductSpec[] }) => (
  <ProductSpecsStyled
    id="roomFacts"
    productSpecs={itemFacts.slice(0, 4)}
    fullWidth={false}
    className="roomFacts"
  />
);

export default ItemCardFacts;
