import React from "react";
import { range } from "fp-ts/lib/Array";

import { StyledGridColumn } from "./TopArticleShared";

import TeaserSideCardHorizontalSkeleton from "components/ui/Teaser/variants/TeaserSideCardHorizontalSkeleton";

const TopArticleGridListLoading = ({ articles = 24 }: { articles?: number }) => (
  <>
    {range(1, articles).map(i => (
      <StyledGridColumn key={i}>
        <TeaserSideCardHorizontalSkeleton teaserSize="small" />
      </StyledGridColumn>
    ))}
  </>
);

export default TopArticleGridListLoading;
