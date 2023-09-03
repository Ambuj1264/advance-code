import React from "react";
import { withTheme } from "emotion-theming";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import Link from "@travelshift/ui/components/Inputs/Link";

import OwnerResponse, {
  CheckMarkContainer,
  UserName,
  Date,
  UserNameWrapper,
  Content,
  Description,
  StyledExpandableText,
} from "./OwnerResponse";
import { ReviewAvatar, REVIEW_AVATAR_IMAGE_WIDTH } from "./ReviewAvatar";

import LikeIcon from "components/icons/like-alternate.svg";
import ReviewStars from "components/ui/ReviewStars";
import CheckMark from "components/ui/CheckMark";
import { IconSize } from "types/enums";
import { getColor } from "utils/helperUtils";
import { clampLines, singleLineTruncation } from "styles/base";
import {
  typographyCaption,
  typographyCaptionSmall,
  typographyCaptionSemibold,
} from "styles/typography";
import {
  greyColor,
  whiteColor,
  borderRadiusSmall,
  boxShadow,
  fontWeightSemibold,
  gutters,
} from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

type ParagraphWithClampedLinesProps = {
  numberOfLines: number;
};

type ReviewScoreTextProps = {
  scoreColor: string;
};

const ScoreText = styled.div<ReviewScoreTextProps>((props: ReviewScoreTextProps) => [
  typographyCaptionSmall,
  css`
    margin-left: ${gutters.small / 2}px;
    color: ${props.scoreColor};
  `,
]);

const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${gutters.small / 4}px;
`;

export const ReviewHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: ${gutters.large / 2}px;
`;

const ReviewOf = styled.div([
  typographyCaption,
  css`
    margin-top: ${gutters.small / 4}px;
    color: ${rgba(greyColor, 0.6)};
    ${singleLineTruncation}
  `,
]);

const SpanStyledReviewOf = styled.span`
  color: ${rgba(greyColor, 0.6)};
  font-weight: ${fontWeightSemibold};
`;

const ParagraphWithClampedLines = styled.p<ParagraphWithClampedLinesProps>(
  ({ numberOfLines }: ParagraphWithClampedLinesProps) => [clampLines(numberOfLines)]
);

const ItemLink = ({ href, ...props }: { href?: string; props?: any }) => (
  <Link href={href} {...props} />
);

const StyledItemLink = styled(ItemLink)`
  display: block;
`;

const Wrapper = styled.div`
  position: relative;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  background-color: ${whiteColor};
  & + & {
    margin-top: ${gutters.small}px;
  }
`;

const ReviewContainer = styled.div`
  padding: ${gutters.small * 2}px ${gutters.small}px;
`;

const LinkWrapper = styled.div``;

const HelpfulVotes = styled.div([
  typographyCaptionSemibold,
  css`
    display: flex;
    align-items: center;
    margin-top: ${gutters.large}px;
    width: 100%;
    padding-left: ${REVIEW_AVATAR_IMAGE_WIDTH + gutters.large}px;
    color: ${rgba(greyColor, 0.7)};
  `,
]);

const Like = styled(LikeIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 16px;
  height: 16px;
  fill: ${rgba(greyColor, 0.7)};
`;

const ItemName = ({ text }: { text: string }) => (
  <ReviewOf>
    <Trans ns={Namespaces.reviewsNs}>Review of</Trans>{" "}
    <SpanStyledReviewOf>{text}</SpanStyledReviewOf>
  </ReviewOf>
);

const Review = withTheme(
  ({
    id,
    text,
    userName,
    userAvatarImage,
    reviewScore,
    reviewScoreText,
    createdDate,
    isVerified,
    isCompact = false,
    itemName,
    itemUrl,
    theme,
    numberOfLinesInText,
    helpfulVotes,
    ownerResponse,
    className,
  }: {
    id: string;
    text: string;
    userName: string;
    userAvatarImage?: Image;
    reviewScore: number;
    reviewScoreText: ReviewScoreText;
    createdDate: string;
    isVerified: boolean;
    isCompact?: boolean;
    itemName?: string;
    itemUrl?: string;
    theme: Theme;
    numberOfLinesInText?: number;
    helpfulVotes?: number;
    ownerResponse?: ReviewOwnerResponse;
    className?: string;
  }) => {
    const OptionalLinkWrapper = !itemUrl ? LinkWrapper : StyledItemLink;

    return (
      <Wrapper className={className}>
        <OptionalLinkWrapper {...(itemUrl ? { href: itemUrl } : {})}>
          <ReviewContainer>
            <ReviewHeader>
              <ReviewAvatar reviewerName={userName} src={userAvatarImage?.url} alt={userName} />
              <Content>
                <UserNameWrapper>
                  <UserName>{userName}</UserName>
                  {isVerified && (
                    <CheckMarkContainer>
                      <CheckMark iconSize={IconSize.Tiny} color={whiteColor} />
                    </CheckMarkContainer>
                  )}
                </UserNameWrapper>
                <ScoreWrapper>
                  <ReviewStars reviewScore={reviewScore} />
                  <ScoreText scoreColor={getColor(reviewScoreText.color, theme)}>
                    <Trans ns={Namespaces.reviewsNs}>{reviewScoreText.text}</Trans>
                  </ScoreText>
                </ScoreWrapper>
                <Date>{createdDate}</Date>
                {itemName && <ItemName text={itemName} />}
              </Content>
            </ReviewHeader>
            <Description isCompact={isCompact}>
              {numberOfLinesInText ? (
                <ParagraphWithClampedLines numberOfLines={numberOfLinesInText}>
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                </ParagraphWithClampedLines>
              ) : (
                <StyledExpandableText id={`readMoreReview${id}`} text={text} autoExpand />
              )}
            </Description>
            {helpfulVotes && (
              <HelpfulVotes>
                <Like />
                <Trans
                  ns={Namespaces.reviewsNs}
                  i18nKey="{helpfulVotes} people found this helpful"
                  defaults="{helpfulVotes} people found this helpful"
                  values={{ helpfulVotes }}
                />
              </HelpfulVotes>
            )}
          </ReviewContainer>
          {ownerResponse && <OwnerResponse id={id} ownerResponse={ownerResponse} />}
        </OptionalLinkWrapper>
      </Wrapper>
    );
  }
);

export default Review;
