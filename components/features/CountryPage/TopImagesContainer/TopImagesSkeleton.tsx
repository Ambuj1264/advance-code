import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SectionRowSkeleton, { StyledSeeAllWrapper } from "components/ui/Section/SectionRowSkeleton";
import Row from "components/ui/Grid/Row";
import { coverHeightStyles, CoverImageWrapper } from "components/ui/Cover/Cover";
import { column, skeletonPulseBlue } from "styles/base";
import { gutters } from "styles/variables";
import { CoverVariant } from "types/enums";

const Container = styled.div(column({ small: 1, desktop: 2 / 3 }));

const StyledRow = styled(Row)`
  justify-content: center;
`;

const StyledSectionRowSkeleton = styled(SectionRowSkeleton)`
  margin-top: ${gutters.small / 2}px;

  ${StyledSeeAllWrapper} {
    ${column({ small: 1, desktop: 2 / 3 })};
    margin-right: auto;
    margin-left: auto;
  }
`;

const StyledCoverImageWrapper = styled(CoverImageWrapper)<{
  variant?: CoverVariant;
  coverHeight: number;
}>([
  css`
    &::after {
      background: none;
    }
  `,
  ({ variant, coverHeight }) => coverHeightStyles({ variant, coverHeight }),
]);

const ImagePulse = styled.div(skeletonPulseBlue);

const TopImagesSkeleton = ({ coverHeight }: { coverHeight: number }) => {
  return (
    <StyledSectionRowSkeleton includeCategoryLink CustomRowWrapper={StyledRow}>
      <Container>
        <StyledCoverImageWrapper variant={CoverVariant.HERO} coverHeight={coverHeight}>
          <ImagePulse />
        </StyledCoverImageWrapper>
      </Container>
    </StyledSectionRowSkeleton>
  );
};

export default TopImagesSkeleton;
