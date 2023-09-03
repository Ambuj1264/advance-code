import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import topAttractionStyles from "./topAttractionStyles";

import { skeletonPulseBlue } from "styles/base";
import SectionRowSkeleton from "components/ui/Section/SectionRowSkeleton";
import { TEASER_HEGHT } from "components/ui/Teaser/variants/TeaserImageTitleOnly";

const AttractionWrapper = styled.div(topAttractionStyles);

const AttractionPulse = styled.div<{
  attractionHeight: number;
}>([
  skeletonPulseBlue,
  ({ attractionHeight }) => css`
    border-radius: 6px;
    height: ${attractionHeight}px;
  `,
]);

const TopAttractionsSkeleton = ({
  attractionHeight = TEASER_HEGHT,
}: {
  attractionHeight?: number;
}) => {
  return (
    <SectionRowSkeleton includeCategoryLink>
      {range(1, 8).map(key => (
        <AttractionWrapper key={key}>
          <AttractionPulse attractionHeight={attractionHeight} />
        </AttractionWrapper>
      ))}
    </SectionRowSkeleton>
  );
};

export default TopAttractionsSkeleton;
