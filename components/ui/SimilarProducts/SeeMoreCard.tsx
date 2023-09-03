import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Arrows from "./Arrows";

import { whiteColor, gutters, borderRadius, boxShadow, breakpointsMin } from "styles/variables";
import { typographySubtitle1, typographySubtitle2 } from "styles/typography";
import LazyImage from "components/ui/Lazy/LazyImage";
import { Trans } from "i18n";

type Props = {
  seeMoreLink: string;
  seeMoreImage?: Image;
  seeMoreText: string;
};

const SeeMore = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
  `,
]);

const Text = styled.h3([
  typographySubtitle1,
  css`
    position: absolute;
    margin-top: ${gutters.small / 2}px;
    padding: 0 ${gutters.small}px;
    text-align: center;
  `,
]);

const imageStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  height: 100%;
  object-fit: cover;
`;

const Cover = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${whiteColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadius};
  width: 100%;
  height: 306px;
  overflow: hidden;
`;

const Link = styled.a([
  css`
    width: 100%;
  `,
]);

const SeeMoreCard = ({ seeMoreLink, seeMoreImage, seeMoreText }: Props) => {
  const seeMoreUrl = seeMoreImage
    ? seeMoreImage.url
    : "https://guidetoiceland.imgix.net/392648/x/0/2-is";
  const seeMoreAlt = seeMoreImage ? seeMoreImage.name : seeMoreText;
  return (
    <Link id="seeMoreTours" href={seeMoreLink} target="_blank" rel="noopener">
      <Wrapper>
        <Cover>
          <LazyImage
            role="presentation"
            styles={imageStyles}
            src={seeMoreUrl}
            sizes={`(min-width: ${breakpointsMin.max}px) ${breakpointsMin.max / 6}px, 100vw`}
            alt={seeMoreAlt}
          />

          <Text>{seeMoreText}</Text>
        </Cover>
        <SeeMore>
          <Arrows />
          <Trans>See more</Trans>
        </SeeMore>
      </Wrapper>
    </Link>
  );
};
export default SeeMoreCard;
