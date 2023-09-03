import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographyH4 } from "styles/typography";
import { whiteColor, gutters } from "styles/variables";
import { mqIE } from "styles/base";
import CustomNextDynamic from "lib/CustomNextDynamic";

const LeafLoading = styled.span`
  margin-right: -${gutters.large / 2}px;
  margin-left: -${gutters.large / 2}px;
  width: ${gutters.large}px;
  height: auto;
  ${mqIE} {
    height: 47px;
  }
`;

const LeafIcon = CustomNextDynamic(() => import("components/icons/leaf-thick.svg"), {
  loading: LeafLoading,
  ssr: false,
});

export const Leaf = styled(LeafIcon)<{
  style?: {
    transform: string;
  };
}>`
  margin-right: -${gutters.large / 2}px;
  margin-left: -${gutters.large / 2}px;
  width: ${gutters.large}px;
  min-width: ${gutters.large}px;
  height: auto;
  fill: ${whiteColor};
  ${mqIE} {
    height: 47px;
  }
`;

export const Wrapper = styled.div([
  typographyH4,
  css`
    display: flex;
    align-items: center;
    margin-right: ${gutters.large / 2}px;
    margin-left: ${gutters.large / 2}px;
    color: ${whiteColor};
    font-size: 18px;
  `,
]);

const ReviewTotalScore = styled.span`
  margin-bottom: ${gutters.small / 8}px;
`;

const ReviewSummaryScore = ({
  reviewTotalScore,
  className,
}: {
  reviewTotalScore: string;
  className?: string;
}) => (
  <Wrapper className={className}>
    <Leaf />
    <ReviewTotalScore>{reviewTotalScore}</ReviewTotalScore>
    <Leaf style={{ transform: "scale(-1, 1)" }} />
  </Wrapper>
);

export default ReviewSummaryScore;
