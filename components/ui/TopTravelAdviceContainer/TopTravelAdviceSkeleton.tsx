import React from "react";
import { range } from "fp-ts/lib/Array";

import { GridColumn, OneLineColumn, StyledScrollSnapWrapper } from "./TopTravelAdviceShared";

import SectionRowSkeleton from "components/ui/Section/SectionRowSkeleton";
import TeaserSideCardHorizontalSkeleton from "components/ui/Teaser/variants/TeaserSideCardHorizontalSkeleton";

const TopTravelAdviceSkeleton = ({
  teasers = 6,
  isGrid,
  categoryLink,
}: {
  teasers?: number;
  isGrid: boolean;
  categoryLink?: string;
}) => {
  const ColumnComponent = isGrid ? GridColumn : OneLineColumn;
  return (
    <SectionRowSkeleton
      includeCategoryLink={Boolean(categoryLink)}
      CustomRowWrapper={StyledScrollSnapWrapper}
    >
      {range(1, teasers).map(key => (
        <ColumnComponent key={key}>
          <TeaserSideCardHorizontalSkeleton teaserSize="small" />
        </ColumnComponent>
      ))}
    </SectionRowSkeleton>
  );
};

export default TopTravelAdviceSkeleton;
