import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import ImageCarousel from "components/ui/ImageCarousel/ImageCarousel";
import { borderRadiusSmall, gutters, greyColor, breakpointsMin } from "styles/variables";
import { mqMin } from "styles/base";
import { typographySubtitle1, typographyCaption } from "styles/typography";
import LazyImage from "components/ui/Lazy/LazyImage";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ExpandableText from "components/ui/ExpandableText/ExpandableText";

const Carousel = styled.div`
  margin-top: ${gutters.small}px;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 175px;
  overflow: hidden;
  ${mqMin.large} {
    float: left;
    margin-top: 0;
    margin-right: ${gutters.large}px;
    width: calc(50% - ${gutters.large / 2}px);
    min-width: calc(50% - ${gutters.large / 2}px);
    height: 320px;
  }
`;

const Name = styled.h3([
  typographySubtitle1,
  css`
    color: ${greyColor};
  `,
]);

const Languages = styled.div`
  margin-top: ${gutters.small / 2}px;
  color: ${rgba(greyColor, 0.5)};
`;

const Link = styled.a(
  ({ theme }) => css`
    margin-top: ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    &:after {
      background: ${theme.colors.primary};
    }
  `
);

const Image = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  overflow: hidden;
`;

const HeaderContent = styled.div([
  typographyCaption,
  css`
    margin-left: ${gutters.small}px;
  `,
]);

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const TextWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  ${mqMin.large} {
    margin-top: ${gutters.small}px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  ${mqMin.large} {
    flex-direction: row;
  }
`;

const Guide = ({ guide }: { guide: Guide }) => {
  return (
    <Wrapper key={guide.id}>
      <Carousel>
        <ImageCarousel
          id="guide"
          imageUrls={guide.images}
          showThumbnails={false}
          sizes={`(min-width: ${breakpointsMin.max}px) ${(breakpointsMin.max * 3) / 12}px, 100vw`}
        />
      </Carousel>

      <div>
        <Header>
          <Image>
            <LazyImage
              src={guide.avatarImage.url}
              imgixParams={{ crop: "faces" }}
              width={64}
              height={64}
              alt={guide.name}
            />
          </Image>
          <HeaderContent>
            <Name>{guide.name}</Name>
            {guide.languages && <Languages>{guide.languages}</Languages>}
            <Link
              id={`view${guide.name}ProfilePage`}
              href={guide.linkUrl}
              target="_blank"
              rel="noopener"
            >
              <Trans ns={Namespaces.tourNs}>View profile page</Trans>
            </Link>
          </HeaderContent>
        </Header>
        <TextWrapper>
          <ExpandableText id="guides" text={guide.information} autoExpand />
        </TextWrapper>
      </div>
    </Wrapper>
  );
};
export default Guide;
