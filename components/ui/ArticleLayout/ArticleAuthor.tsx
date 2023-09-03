import React from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  fontSizeBody1,
  fontSizeBody2,
  fontSizeCaption,
  fontWeightSemibold,
  greyColor,
  gutters,
} from "styles/variables";
import ShapeIcon from "components/icons/check-shield.svg";
import { mediaQuery } from "styles/base";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { PageType } from "types/enums";

const IMAGE_SIZE = 32;

const StyledImage = styled.img`
  position: absolute;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(0, -50%);
  object-fit: cover;
`;

const Wrapper = styled.div([
  css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  `,
  mediaQuery({
    fontSize: [fontSizeBody2, fontSizeBody2, fontSizeBody1],
    marginTop: [`${gutters.small}px`, `${gutters.small / 2}px`],
  }),
]);

const WrapperImg = styled.div`
  position: relative;
  border-radius: 50%;
  width: ${IMAGE_SIZE}px;
  min-width: ${IMAGE_SIZE}px;
  height: ${IMAGE_SIZE}px;
  min-height: ${IMAGE_SIZE}px;
  overflow: hidden;
`;

const NameContainer = styled.div`
  display: flex;
  align-self: center;
  margin-top: ${gutters.large / 6}px;
  margin-left: ${gutters.small / 2}px;
  color: ${greyColor};
`;

const AuthorHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
`;

const ExpertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${gutters.small / 4}px;
`;

const Name = styled.a`
  font-weight: ${fontWeightSemibold};
`;

const ExpertCaption = styled.div`
  margin-left: ${gutters.large / 4}px;
  color: ${greyColor};
  font-size: ${fontSizeCaption};
`;

const StyledCheckCircle = styled(ShapeIcon)(
  ({ theme }) =>
    css`
      align-self: center;
      width: ${gutters.small}px;
      height: ${gutters.small}px;
      fill: ${theme.colors.primary};
    `
);

const getExpertCaptionText = (
  author: ArticleLayoutTypes.ArticleAuthor,
  pageType: PageType,
  translateFn: TFunction
) => {
  const isVerified = author.userInfo?.verified;
  const isBlogPage = pageType === PageType.BLOG;
  const isLocal = author?.roles?.find(role => role.id === "local") ?? false;
  const isLocalBlogger = isLocal && isBlogPage;

  if (isLocalBlogger) {
    return translateFn("Verified Local");
  }

  if (isBlogPage && isVerified) {
    return translateFn("Verified Travel Blogger");
  }

  if (isBlogPage) {
    return translateFn("Travel Blogger");
  }

  // on article page it is always Verified Expert
  // see: https://app.asana.com/0/search/1163917462392950/1162868834536002
  return translateFn("Verified Expert");
};

const ArticleAuthor = ({
  author,
  pageType,
}: {
  author: ArticleLayoutTypes.ArticleAuthor;
  pageType: PageType;
}) => {
  const { name: authorName, faceImage } = author;
  const { t } = useTranslation(Namespaces.articleNs);

  const { avatarUrl } = faceImage;

  if (!authorName) return null;

  const expertCaptionText = getExpertCaptionText(author, pageType, t);

  const authorImageUrl = `${avatarUrl}&fit=crop&crop=faces&w=${IMAGE_SIZE}&h=${IMAGE_SIZE}`;
  return (
    <Wrapper>
      <Head>
        <link rel="preload" as="image" href={authorImageUrl} />
      </Head>

      <AuthorHolder>
        {avatarUrl && (
          <WrapperImg>
            <StyledImage alt={faceImage?.alt || authorName} src={authorImageUrl} />
          </WrapperImg>
        )}

        <NameContainer>
          <Trans ns={Namespaces.articleNs}>By</Trans>&nbsp;
          <Name href={author.url}>{authorName}</Name>
        </NameContainer>
      </AuthorHolder>

      <ExpertContainer>
        <StyledCheckCircle />
        <ExpertCaption>{expertCaptionText}</ExpertCaption>
      </ExpertContainer>
    </Wrapper>
  );
};

export default ArticleAuthor;
