import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import StarIcon from "components/icons/star.svg";
import { yellowColor, greyColor } from "styles/variables";

type Props = {
  reviewScore: number;
};

type StarProps = {
  style?: {
    fill: string;
  };
};

export const Star = styled(StarIcon)<StarProps>`
  width: 14px;
  height: 14px;
`;

export const Stars = styled.div`
  display: flex;
`;

const getStarFill = (reviewScore: number, starNumber: number) => {
  const isPartialStar = reviewScore < starNumber && reviewScore > starNumber - 1;
  if (reviewScore >= starNumber) {
    return yellowColor;
  }
  if (isPartialStar) {
    return rgba(yellowColor, 0.7);
  }
  return rgba(greyColor, 0.2);
};

const ReviewStars = ({ reviewScore }: Props) => {
  return (
    <Stars data-testid={`reviewsStarsOption${reviewScore}`}>
      <Star
        style={{
          fill: getStarFill(reviewScore, 1),
        }}
      />
      <Star
        style={{
          fill: getStarFill(reviewScore, 2),
        }}
      />
      <Star
        style={{
          fill: getStarFill(reviewScore, 3),
        }}
      />
      <Star
        style={{
          fill: getStarFill(reviewScore, 4),
        }}
      />
      <Star
        style={{
          fill: getStarFill(reviewScore, 5),
        }}
      />
    </Stars>
  );
};

export default ReviewStars;
