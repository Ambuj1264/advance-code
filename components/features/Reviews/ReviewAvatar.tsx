import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import UserIcon from "@travelshift/ui/icons/user.svg";

import { getFirstLetter } from "./utils/reviewUtils";

import LazyImage from "components/ui/Lazy/LazyImage";
import { borderRadiusCircle, fontSizeH4, fontWeightSemibold, whiteColor } from "styles/variables";

const DefaultUserImage = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
    font-size: ${fontSizeH4};
    font-weight: ${fontWeightSemibold};
  `
);

const DefaultUserIconStyled = styled(UserIcon)(
  ({ theme }) => css`
    fill: ${theme.colors.primary};
  `
);

export const REVIEW_AVATAR_IMAGE_WIDTH = 64;

const Image = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: ${borderRadiusCircle};
  width: ${REVIEW_AVATAR_IMAGE_WIDTH}px;
  height: ${REVIEW_AVATAR_IMAGE_WIDTH}px;
  overflow: hidden;
`;

const DefaultReviewsImage = ({ reviewerName }: { reviewerName?: string }) => {
  const letter = getFirstLetter(reviewerName);

  return letter ? <DefaultUserImage>{letter}</DefaultUserImage> : <DefaultUserIconStyled />;
};

export const ReviewAvatar = ({
  reviewerName,
  src,
  alt,
}: {
  reviewerName: string;
  src?: string;
  alt?: string;
}) => {
  return (
    <Image>
      {src ? (
        <LazyImage src={src} imgixParams={{ crop: "faces" }} width={64} height={64} alt={alt} />
      ) : (
        <DefaultReviewsImage reviewerName={reviewerName} />
      )}
    </Image>
  );
};
