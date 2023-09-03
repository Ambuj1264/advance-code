import React from "react";
import styled from "@emotion/styled";

import { mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { StyledProductSpecsSkeleton } from "components/features/TravelGuides/TGDestinationContent";
import ExpandableTextSkeleton, {
  ExpandableTextRowSkeleton,
} from "components/ui/ExpandableText/ExpandableTextSkeleton";

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  min-width: fit-content;
  ${mqMin.large} {
    flex-direction: row;
  }
`;

const TextSkeletonWrapper = styled.div`
  margin-top: ${gutters.large}px;
  width: 100%;

  ${mqMin.large} {
    margin-top: 0;
    width: 50%;
    padding-right: ${gutters.small / 2}px;
  }
`;

const HeadlineTextSkeleton = styled(ExpandableTextRowSkeleton)`
  margin-bottom: ${gutters.small / 2}px;
  width: 40%;
  height: 26px;
`;

const SpecsSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${mqMin.large} {
    width: 50%;
    padding: 0 ${gutters.small / 2}px;
  }
`;

const LoadingProductSpecsSkeleton = styled(StyledProductSpecsSkeleton)`
  ${mqMin.large} {
    margin-top: -18px;
  }
`;

const TravelStopModalSkeleton = () => {
  return (
    <SkeletonWrapper>
      <TextSkeletonWrapper>
        <HeadlineTextSkeleton />
        <ExpandableTextSkeleton lineLimit={7} />
      </TextSkeletonWrapper>
      <SpecsSkeletonWrapper>
        <HeadlineTextSkeleton />
        <LoadingProductSpecsSkeleton fullWidth />
      </SpecsSkeletonWrapper>
    </SkeletonWrapper>
  );
};

export default TravelStopModalSkeleton;
