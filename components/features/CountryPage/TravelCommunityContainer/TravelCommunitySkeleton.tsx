import React from "react";
import { range } from "fp-ts/lib/Array";

import { Column, StyledScrollSnapWrapper } from "./TravelCommunityShared";

import TeaserSideCardHorizontalSkeleton from "components/ui/Teaser/variants/TeaserSideCardHorizontalSkeleton";
import SectionRowSkeleton from "components/ui/Section/SectionRowSkeleton";

const TravelCommunitySkeleton = ({ teasers = 5 }: { teasers?: number }) => {
  return (
    <SectionRowSkeleton CustomRowWrapper={StyledScrollSnapWrapper}>
      {range(1, teasers).map(key => (
        <Column key={key}>
          <TeaserSideCardHorizontalSkeleton teaserSize="small" />
        </Column>
      ))}
    </SectionRowSkeleton>
  );
};

export default TravelCommunitySkeleton;
