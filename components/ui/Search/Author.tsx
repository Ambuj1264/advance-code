import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters, greyColor } from "styles/variables";
import { typographyCaption } from "styles/typography";
import LazyImage from "components/ui/Lazy/LazyImage";
import { clampLines } from "styles/base";

const WrapperImg = styled.div`
  position: relative;
  margin-right: ${gutters.large / 4}px;
  border-radius: 50%;
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
  overflow: hidden;
`;

const imageStyles = css`
  position: absolute;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(0, -50%);
  object-fit: cover;
`;

export const AuthorName = styled.div(
  typographyCaption,
  clampLines(1),
  css`
    color: ${greyColor};
  `
);

export const AuthorWrapper = styled.div(
  css`
    display: flex;
    align-items: center;
    margin-top: ${gutters.small / 2}px;
    margin-bottom: 0px;
  `
);

const Author = ({ name, imageUrl }: { name: string; imageUrl: string }) => {
  const authorImageUrl = `${imageUrl}&fit=crop&crop=faces&w=24h=24`;
  return (
    <AuthorWrapper>
      <WrapperImg>
        <LazyImage alt={name} width={24} height={24} src={authorImageUrl} styles={imageStyles} />
      </WrapperImg>
      <AuthorName title={name}>{name}</AuthorName>
    </AuthorWrapper>
  );
};

export default Author;
