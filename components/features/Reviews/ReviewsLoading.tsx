import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters, boxShadow, borderRadiusSmall, whiteColor } from "styles/variables";
import { skeletonPulseBlue, skeletonPulse, mqMin, column } from "styles/base";
import Row from "components/ui/Grid/Row";

const ImageLoading = styled.div([
  skeletonPulseBlue,
  css`
    border-radius: 50%;
    width: 65px;
    height: 65px;
  `,
]);

const HeadingLoading = styled.div([
  skeletonPulse,
  css`
    width: 120px;
    height: 17px;
  `,
]);

const LinkLoading = styled.div([
  skeletonPulse,
  css`
    width: 230px;
    height: 17px;
    ${mqMin.medium} {
      width: 300px;
    }
  `,
]);

const SubHeadingLoading = styled.div([
  skeletonPulse,
  css`
    margin-bottom: ${gutters.small / 4}px;
    width: 85px;
    height: 12px;
  `,
]);

const RatingLoading = styled.div([
  skeletonPulse,
  css`
    margin: ${gutters.small / 4}px 0 ${gutters.small / 4}px 0;
    width: 100px;
    height: 12px;
  `,
]);

const ReviewContentLoading = styled.div([
  skeletonPulse,
  css`
    height: 100px;
  `,
]);

const Col = styled.div(column({ small: 1 / 2 }));

const DropdownLoading = styled.div([
  skeletonPulse,
  css`
    height: 45px;
  `,
]);

const TotalReviewsLoading = styled.div([
  skeletonPulse,
  css`
    width: 200px;
    height: 44px;
    ${mqMin.medium} {
      width: 130px;
    }
  `,
]);

const TopLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${gutters.small}px;
  padding: 0 ${gutters.small}px;

  ${mqMin.medium} {
    flex-direction: row;
    margin-top: ${gutters.large}px;
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightContainer = styled.div`
  width: calc(100% - 65px);
  padding-left: ${gutters.large}px;
`;

const LeftContainer = styled.div`
  display: flex;
  width: 65px;
`;

const wrapperStyles = css`
  display: flex;
  margin-top: ${gutters.large}px;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small * 2}px ${gutters.small}px;
  background-color: ${whiteColor};
`;

const LoadingWrapper = styled.div(wrapperStyles);

const LongLoadingWrapper = styled.div([
  wrapperStyles,
  css`
    flex-direction: column;
    margin-top: 0;
    height: 245px;
  `,
]);

const TotalReviewsLoadingContainer = styled.div`
  width: 100%;
  ${mqMin.medium} {
    width: 33%;
  }
  ${mqMin.large} {
    width: 50%;
  }
`;

const LongHeaderWrapper = styled.div`
  display: flex;
  margin-bottom: ${gutters.large / 2}px;
`;

export const LongReviewsLoading = () => (
  <LongLoadingWrapper>
    <LongHeaderWrapper>
      <LeftContainer>
        <ImageLoading />
      </LeftContainer>
      <RightContainer>
        <HeadingContainer>
          <HeadingLoading />
          <RatingLoading />
          <SubHeadingLoading />
          <LinkLoading />
        </HeadingContainer>
      </RightContainer>
    </LongHeaderWrapper>
    <ReviewContentLoading />
  </LongLoadingWrapper>
);

export const ReviewLoading = () => (
  <LoadingWrapper>
    <LeftContainer>
      <ImageLoading />
    </LeftContainer>
    <RightContainer>
      <HeadingContainer>
        <HeadingLoading />
        <RatingLoading />
        <SubHeadingLoading />
      </HeadingContainer>
      <ReviewContentLoading />
    </RightContainer>
  </LoadingWrapper>
);

const ReviewsLoading = ({ hideFilters = false }: { hideFilters?: boolean }) => (
  <>
    {!hideFilters && (
      <TopLoadingContainer>
        <TotalReviewsLoadingContainer>
          <TotalReviewsLoading />
        </TotalReviewsLoadingContainer>
        <Row>
          <Col>
            <DropdownLoading />
          </Col>
          <Col>
            <DropdownLoading />
          </Col>
        </Row>
      </TopLoadingContainer>
    )}
    <ReviewLoading />
    <ReviewLoading />
    <ReviewLoading />
  </>
);

export default ReviewsLoading;
