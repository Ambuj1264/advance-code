import React, { useMemo } from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";

import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  Description,
  imageStyles,
} from "../TeaserComponents";

import { Trans } from "i18n";
import { gutters, whiteColor } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { clampLinesWithFixedHeight, mqMin } from "styles/base";
import LazyImage from "components/ui/Lazy/LazyImage";
import Author from "components/ui/Search/Author";

export type TeaserSize = "small" | "medium" | "large";

const IMAGE_SIZE = {
  isWeb: {
    width: 540,
    height: 240,
  },
};

export const StyledCard = styled(Card)<{ hasMaxWidth?: boolean }>(({ hasMaxWidth }) => [
  hasMaxWidth &&
    css`
      display: block;
      ${mqMin.large} {
        max-width: 450px;
      }
    `,
  css`
    display: block;
  `,
]);

const getImageHeight = (teaserSize: TeaserSize) => {
  switch (teaserSize) {
    case "small":
      return 130;
    case "medium":
      return "176";
    default:
      return "200";
  }
};
export const StyledCardImage = styled(CardImage)<{ teaserSize: TeaserSize }>(
  ({ teaserSize }) => css`
    height: ${getImageHeight(teaserSize)}px;

    img {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      object-fit: cover;
    }
  `
);

export const StyledCardContent = styled(CardContent)`
  margin-left: 0;
  padding: ${gutters.small}px;
`;

export const StyledCardTitle = styled(CardTitle)(
  ({ theme }) => css`
    height: 48px;
    color: ${theme.colors.primary};
    overflow: hidden;
  `
);

export const StyledDescription = styled(Description)<{
  isSmallTeaser: boolean;
}>(({ isSmallTeaser }) => [
  typographyBody2,
  clampLinesWithFixedHeight({
    numberOfLines: 4,
    lineHeight: 24,
    fixedHeight: isSmallTeaser,
  }),
]);

const StyledReadMore = styled.div([
  typographyBody2,
  ({ theme }) => `
    text-align: right;
    color: ${theme.colors.primary};
  `,
]);

const StyledTrans = styled.span`
  padding-left: ${gutters.small / 2}px;
  background: ${whiteColor};
`;

const transformDescription = (rawDescription?: string) => {
  if (!rawDescription) {
    return null;
  }

  // replace non-breaking space "&nbsp;" with regular space
  const description = rawDescription.replace(/\u00a0/g, " ");

  // trim description
  if (/[^.:!?]$/.test(description)) {
    return description.replace(/\s$/, "");
  }

  return description;
};

const TeaserSideCardHorizontal = ({
  url,
  title,
  image,
  author,
  description,
  hasCallToAction = true,
  LinkComponent,
  teaserSize = "large",
  overlay,
  hasMaxwidth = true,
  metadata,
}: {
  url: string;
  title: string;
  description?: string;
  image?: Image | null;
  author?: SharedTypes.Author;
  LinkComponent?: StyledComponent<{ href: string }, { href: string }, Theme>;
  hasCallToAction?: boolean;
  teaserSize?: TeaserSize;
  overlay?: React.ReactNode;
  hasMaxwidth?: boolean;
  metadata?: {
    description: string;
  };
}) => {
  const isSmallTeaser = teaserSize === "small";
  const WrapperComponent = useMemo(() => {
    return ({ children }: { children: React.ReactElement }) =>
      LinkComponent ? <LinkComponent href={url}>{children}</LinkComponent> : children;
  }, [LinkComponent, url]);

  return (
    <WrapperComponent>
      <StyledCard hasShadow hasMaxWidth={hasMaxwidth}>
        {image && (
          <StyledCardImage title={title} teaserSize={teaserSize}>
            <LazyImage
              alt={image.name}
              src={image.url}
              styles={imageStyles}
              width={isSmallTeaser ? 250 : IMAGE_SIZE.isWeb.width}
              height={isSmallTeaser ? 130 : IMAGE_SIZE.isWeb.height}
            />
          </StyledCardImage>
        )}
        {overlay}
        <StyledCardContent>
          <StyledCardTitle>
            <span title={title}>{title}</span>
          </StyledCardTitle>
          {author && <Author name={author.name} imageUrl={author.image.url} />}
          <StyledDescription
            isSmallTeaser={isSmallTeaser}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: transformDescription(description || metadata?.description) || "",
            }}
          />
          {hasCallToAction && (
            <StyledReadMore>
              <StyledTrans title={title}>
                <Trans ns={Namespaces.commonNs}>Read more</Trans>
              </StyledTrans>
            </StyledReadMore>
          )}
        </StyledCardContent>
      </StyledCard>
    </WrapperComponent>
  );
};

export default TeaserSideCardHorizontal;
