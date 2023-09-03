import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { ReviewAvatar, REVIEW_AVATAR_IMAGE_WIDTH } from "./ReviewAvatar";

import CheckMark from "components/ui/CheckMark";
import { IconSize } from "types/enums";
import { typographySubtitle2, typographyCaptionSmall, typographyBody2 } from "styles/typography";
import {
  greyColor,
  whiteColor,
  gutters,
  fontSizeBody2,
  boxShadowLightTop,
  borderRadiusCircle,
} from "styles/variables";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";

type DescriptionProps = {
  isCompact: boolean;
};

export const CheckMarkContainer = styled.div<{ isAction?: boolean }>(
  ({ theme, isAction = false }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: ${gutters.small / 2}px;
      border-radius: ${borderRadiusCircle};
      width: 14px;
      height: 14px;
      background-color: ${isAction ? theme.colors.action : theme.colors.primary};
    `
);

export const UserName = styled.p([
  typographySubtitle2,
  css`
    color: ${greyColor};
  `,
]);

export const Date = styled.div([
  typographyCaptionSmall,
  css`
    margin-top: ${gutters.small / 4}px;
    color: ${rgba(greyColor, 0.6)};
  `,
]);

export const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Content = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: ${gutters.large}px;
  width: calc(100% - ${REVIEW_AVATAR_IMAGE_WIDTH + gutters.large}px);
`;

const ReviewHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: ${gutters.small / 4}px;
`;

export const Description = styled.div<DescriptionProps>(
  ({ isCompact }: DescriptionProps) =>
    css`
      width: 100%;
      ${!isCompact && `padding-left: ${REVIEW_AVATAR_IMAGE_WIDTH + gutters.large}px;`}
      ${typographyBody2}
      color: ${greyColor};
    `
);

const Wrapper = styled.div`
  box-shadow: ${boxShadowLightTop};
  padding: ${gutters.large}px ${gutters.small}px ${gutters.small * 2}px ${gutters.small}px;
  background-color: ${rgba(greyColor, 0.05)};
`;

export const StyledExpandableText = styled(ExpandableText)`
  font-size: ${fontSizeBody2};
`;

const OwnerResponse = ({
  id,
  ownerResponse,
}: {
  id: string;
  ownerResponse: ReviewOwnerResponse;
}) => {
  const { userName, userAvatarImage, text, createdDate } = ownerResponse;
  return (
    <Wrapper>
      <ReviewHeader>
        <ReviewAvatar reviewerName={userName} src={userAvatarImage?.url} alt={userName} />
        <Content>
          <UserNameWrapper>
            <UserName>{userName}</UserName>
            <CheckMarkContainer isAction>
              <CheckMark iconSize={IconSize.Tiny} color={whiteColor} />
            </CheckMarkContainer>
          </UserNameWrapper>
          <Date>{createdDate}</Date>
        </Content>
      </ReviewHeader>
      <Description isCompact={false}>
        <StyledExpandableText id={`readMoreReviewOwnerResponse${id}`} text={text} autoExpand />
      </Description>
    </Wrapper>
  );
};

export default OwnerResponse;
