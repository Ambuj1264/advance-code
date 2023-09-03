import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Link from "@travelshift/ui/components/Inputs/Link";

import { IconContainer } from "../Header/Header/NavigationBar/GTESearch/ResultItem";

import OverallSearchReviewSummaryScore from "./OverallSearchReviewSummaryScore";

import { clampLines } from "styles/base";
import { typographySubtitle2 } from "styles/typography";
import {
  ListCardRowDescription,
  TileProductCardWrapper,
} from "components/ui/Search/utils/sharedSearchUtils";
import {
  lightBlueColor,
  whiteColor,
  borderRadiusLarger,
  borderRadiusSmall,
  gutters,
} from "styles/variables";
import { ListProductCardDescription } from "components/ui/Search/ListProductCard";

export const StyledTileCardWrapper = styled(TileProductCardWrapper)`
  border: 1px solid ${lightBlueColor};
  border-radius: ${borderRadiusLarger};
  width: 100%;
  height: 140px;
  padding: ${gutters.small / 2}px ${gutters.small / 2}px ${gutters.small / 2}px ${gutters.small}px;
`;

const HeadlineContainer = styled.div`
  display: flex;
`;

const SearchResultHeadline = styled.h3<{ titleShouldExpand: boolean }>(
  ({ titleShouldExpand = false }) => [
    clampLines(titleShouldExpand ? 2 : 1),
    typographySubtitle2,
    css`
      flex-grow: 1;
      flex-shrink: 1;
      margin: 0;
      padding: 0;
      color: ${lightBlueColor};
      line-height: 21px;
    `,
  ]
);

const StyledIconContainer = styled(IconContainer)<{ iconColor?: string; isFlag: boolean }>(
  ({ iconColor = lightBlueColor, isFlag = false }) => [
    css`
      flex-shrink: 0;
      margin-left: ${gutters.small / 4}px;
      border-radius: ${borderRadiusSmall};
      width: ${gutters.large}px;
      height: ${gutters.large}px;
      padding: 0;
      background-color: ${isFlag ? "transparent" : `${iconColor}`};
      svg {
        width: ${isFlag ? `${gutters.large}px` : "14px"};
        height: ${isFlag ? "20px" : "14px"};
        fill: ${isFlag ? lightBlueColor : whiteColor};
      }
    `,
  ]
);

const StyledListProductCardDescription = styled(ListProductCardDescription)<{
  isReviewScore?: boolean;
  titleShouldExpand?: boolean;
}>(({ isReviewScore = false, titleShouldExpand = false }) => [
  clampLines(isReviewScore || titleShouldExpand ? 3 : 4),
  css`
    width: 100%;
    line-height: 20px;
  `,
]);

const StyledListCardRowDescription = styled(ListCardRowDescription)<{ isReviewScore?: boolean }>(
  ({ isReviewScore = false }) => [
    css`
      padding-top: ${isReviewScore ? `${gutters.small / 2}px` : `${gutters.small}px`};
    `,
  ]
);

const MobileOverallSearchTileCard = ({
  id,
  metadataUri,
  title,
  color,
  isFlag,
  Icon,
  description,
  reviewScore,
}: {
  id: string;
  metadataUri: string | null;
  title: string | null;
  color: string;
  isFlag: boolean;
  Icon?: React.ComponentType<{}>;
  description: string | null;
  reviewScore?: {
    totalScore: number;
    totalCount: number;
  };
}) => {
  const isReviewScore = Boolean(reviewScore?.totalScore);
  const titleShouldExpand = title ? title.length > 40 && !isReviewScore : false;

  return (
    <StyledTileCardWrapper>
      <Link id={`search-result-page-${id}`} href={metadataUri} key={id}>
        <HeadlineContainer>
          <SearchResultHeadline titleShouldExpand={titleShouldExpand}>{title}</SearchResultHeadline>
          <StyledIconContainer iconColor={color} isFlag={isFlag}>
            {Icon && <Icon />}
          </StyledIconContainer>
        </HeadlineContainer>
        {reviewScore?.totalScore && (
          <OverallSearchReviewSummaryScore
            reviewTotalScore={reviewScore?.totalScore}
            reviewTotalCount={reviewScore?.totalCount}
          />
        )}
        <StyledListCardRowDescription isReviewScore={isReviewScore}>
          <StyledListProductCardDescription
            isReviewScore={isReviewScore}
            titleShouldExpand={titleShouldExpand}
          >
            {description}
          </StyledListProductCardDescription>
        </StyledListCardRowDescription>
      </Link>
    </StyledTileCardWrapper>
  );
};

export default MobileOverallSearchTileCard;
