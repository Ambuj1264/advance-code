import React from "react";
import { range } from "fp-ts/lib/Array";

import { GridRow } from "components/ui/Search/SearchList";
import TileItemCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import {
  DEFAULT_COLUMN_SIZES,
  StyledGridItemWrapper,
} from "components/ui/ProductsGrid/ProductsGridLazy";
import SectionRowSkeleton from "components/ui/Section/SectionRowSkeleton";

const TopTravelPlansSkeleton = ({ products = 4 }: { products?: number }) => {
  return (
    <SectionRowSkeleton CustomRowWrapper={GridRow} includeCategoryLink>
      {range(1, products).map(key => (
        <StyledGridItemWrapper columnSizes={DEFAULT_COLUMN_SIZES} key={key}>
          <TileItemCardSkeleton />
        </StyledGridItemWrapper>
      ))}
    </SectionRowSkeleton>
  );
};

export default TopTravelPlansSkeleton;
