import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { column, skeletonPulseBlue } from "styles/base";
import SectionRowSkeleton, {
  SectionHeadingPulse,
  SectionSubHeadingPulse,
} from "components/ui/Section/SectionRowSkeleton";
import { borderRadius } from "styles/variables";
import {
  imageCategoryGridStyles,
  StyledScrollSnapWrapper,
} from "components/ui/ImageCategoriesGrid";

const StyledSectionRowSkeleton = styled(SectionRowSkeleton)`
  ${SectionHeadingPulse} {
    margin: 0 0;
  }
  ${SectionSubHeadingPulse} {
    display: none;
  }
`;

const LoadingImg = styled.div<{ cardHeight: number; columnSizes: SharedTypes.ColumnSizes }>(
  ({ cardHeight = 144, columnSizes }) => [
    column(columnSizes),
    imageCategoryGridStyles,
    css`
      height: ${cardHeight}px;
    `,
  ]
);

const TeaserCardLoader = styled.div([
  skeletonPulseBlue,
  css`
    border-radius: ${borderRadius};
    width: 100%;
    height: 100%;
  `,
]);

const LoadingVoucherUpsell = ({
  cardHeight,
  columnSizes,
  className,
}: {
  cardHeight: number;
  columnSizes: SharedTypes.ColumnSizes;
  className?: string;
}) => {
  return (
    <StyledSectionRowSkeleton CustomRowWrapper={StyledScrollSnapWrapper} className={className}>
      {range(1, 3).map(index => (
        <LoadingImg cardHeight={cardHeight} key={index.toString()} columnSizes={columnSizes}>
          <TeaserCardLoader />
        </LoadingImg>
      ))}
    </StyledSectionRowSkeleton>
  );
};

export default LoadingVoucherUpsell;
