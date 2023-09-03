import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { mqMin } from "styles/base";
import {
  TeaserImageCard,
  teaserImageStyles,
  ExternalLink,
} from "components/ui/Teaser/TeaserComponents";
import LazyImage from "components/ui/Lazy/LazyImage";
import { gutters, whiteColor, borderRadius, greyColor } from "styles/variables";
import { typographyCaption } from "styles/typography";
import RatingIcon from "components/icons/rating-star-ribbon.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useIsDesktop } from "hooks/useMediaQueryCustom";

const BLOGGER_IMAGE_WIDTH = 48;

const StyledTeaserImageCard = styled(TeaserImageCard)`
  height: 120px;
  ${mqMin.large} {
    height: 134px;
  }
`;

const LazyImageStyled = styled(LazyImage)`
  width: 100%;
  height: 100%;
`;

const LazyImageBlogger = styled(LazyImageStyled)`
  position: absolute;
  bottom: 70%;
  left: 0;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  object-fit: cover;
`;

const BloggerInfo = styled.div([
  typographyCaption,
  css`
    position: absolute;
    bottom: ${gutters.large / 2}px;
    left: ${gutters.large / 2}px;
    z-index: 2;
    border-radius: ${borderRadius};
    padding: ${gutters.large}px ${gutters.large / 4}px ${gutters.large / 4}px ${gutters.large / 4}px;
    background-color: ${whiteColor};
  `,
]);

const BloggerDescription = styled.div<{ theme: Theme }>(
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
    `
);

const BloggerName = styled.div`
  color: ${greyColor};
`;

const iconStyles = (theme: Theme) => css`
  position: absolute;
  top: 0;
  right: ${gutters.large / 2}px;
  height: 21px;
  fill: ${theme.colors.action};
`;

const flagIconStyles = css`
  position: absolute;
  top: ${gutters.small}px;
  right: ${gutters.small / 2}px;
  height: 16px;
`;

const TopBloggerCard = ({ cardInfo }: { cardInfo: TravelCommunityTypes.Blogger }) => {
  const theme: Theme = useTheme();
  const isDesktop = useIsDesktop();
  const { t } = useTranslation(Namespaces.travelCommunityNs);
  const { name, url, image, faceImage, country, Icon } = cardInfo;
  const imageHeight = isDesktop ? 134 : 120;

  return (
    <ExternalLink
      href={`${url}`}
      data-testid="bloggerCard"
      data-lang={cardInfo.languages.join(",")}
    >
      <StyledTeaserImageCard hasShadow hasInnerBottomShadow>
        {Icon && <Icon css={flagIconStyles} />}
        <LazyImageStyled
          src={
            image?.isDefaultImage
              ? faceImage?.url?.split("?")?.[0] ?? ""
              : image?.url?.split("?")?.[0] ?? ""
          }
          styles={teaserImageStyles}
          alt={name}
          width={imageHeight}
          height={imageHeight}
          imgixParams={{
            fit: "crop",
            ...(image?.isDefaultImage ? { crop: "faces" } : {}),
          }}
        />
        <BloggerInfo>
          <RatingIcon css={iconStyles(theme)} />
          <LazyImageBlogger
            src={faceImage?.url?.split("?")?.[0] ?? ""}
            alt={name}
            width={BLOGGER_IMAGE_WIDTH}
            height={BLOGGER_IMAGE_WIDTH}
          />
          <BloggerName>{name}</BloggerName>
          <BloggerDescription theme={theme}>
            {t(`{country} expert`, { country })}
          </BloggerDescription>
        </BloggerInfo>
      </StyledTeaserImageCard>
    </ExternalLink>
  );
};

export const TopBloggerCardSSRSkeleton = ({
  cardInfo,
}: {
  cardInfo: TravelCommunityTypes.Blogger;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.travelCommunityNs);
  const { name, url, country } = cardInfo;

  return (
    <ExternalLink href={`${url}`} target="_blank" rel="noopener noreferrer">
      <StyledTeaserImageCard hasShadow hasInnerBottomShadow>
        <BloggerInfo>
          <BloggerName>{name}</BloggerName>
          <BloggerDescription theme={theme}>
            {t(`{country} expert`, { country })}
          </BloggerDescription>
        </BloggerInfo>
      </StyledTeaserImageCard>
    </ExternalLink>
  );
};

export default TopBloggerCard;
