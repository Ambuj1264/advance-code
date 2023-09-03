import styled from "@emotion/styled";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";

import ImageComponent from "../ImageComponent";

import QuickFactsWithoutModals from "./QuickFactsWithoutModals";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import useEffectOnce from "hooks/useEffectOnce";
import { typographyBody1, typographyBody2 } from "styles/typography";
import { gutters } from "styles/variables";
import { clampLines, mqMin } from "styles/base";
import MaybeClientLink from "components/ui/MaybeClientLink";
import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import useOnResize from "hooks/useOnResize";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  margin: 0 -${gutters.large / 2}px 0 -${gutters.large / 2}px;
  overflow: hidden;
`;

export const ImgixStyled = styled(ImageComponent, {
  shouldForwardProp: () => true,
})(
  (props: SharedTypes.ImgixProps) => css`
    display: inline-block;
    margin: 0 auto;
    min-width: 220px;
    max-width: 400px;

    max-height: ${props.height}px;
    vertical-align: middle;
    object-fit: cover;
  `
);

export const LeftColumn = styled.div`
  position: relative;
  line-height: 203px; /* vertical centering if image is small */
  text-align: center;
`;

export const RightColumn = styled.div`
  width: 100%;
  padding: ${gutters.small / 2}px ${gutters.small}px;
`;

export const ClientLinkProductTitle = styled(MaybeClientLink, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "hasReview",
})<{
  hasReview?: boolean;
}>([
  typographyBody1,
  clampLines(2),
  ({ theme, hasReview }) => css`
    max-width: ${hasReview ? "380px" : "initial"};
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

export const ImageWrapperClientLink = styled(MaybeClientLink)();

const StyledSellOutLabel = styled(SellOutLabel)`
  width: auto;
  min-height: 20px;
  padding: 0 ${gutters.small / 4}px;
  font-size: 10px;

  svg {
    width: 16px;
    min-width: 16px;
  }
`;

const productCardOverviewListViewStyles = css`
  display: flex;

  ${ImgixStyled} {
    min-width: 212px;
    max-width: 100%;
    height: 100%;
    max-height: 190px;
    object-fit: cover;
  }

  ${LeftColumn} {
    width: 212px;
    height: auto;
    line-height: unset;
  }

  ${RightColumn} {
    padding-top: ${gutters.small / 2}px;
    padding-left: ${gutters.large}px;
    overflow: hidden;
  }

  ${ClientLinkProductTitle} {
    ${typographyBody2};
    text-align: left;
  }

  ${ImageWrapperClientLink} {
    display: inline-block;
    height: 100%;
  }
`;

export const Title = styled.span``;

const ProductCardOverviewBase = ({
  className,
  title,
  imageUrl,
  clientRoute,
  quickFacts,
  iconColor,
  namespace,
  imgixParams,
  extraLeftColumnContent,
  extraRightColumnContent,
  isSellOut,
  imgixHeightMobile = 207,
  imgixHeightDesktop = 140,
  imageBackgroundColor,
  hasReview,
}: {
  className?: string;
  title?: string;
  imageUrl?: string;
  clientRoute?: SharedTypes.ClientRoute;
  quickFacts: SharedTypes.QuickFact[];
  iconColor: string;
  namespace: Namespaces;
  imgixParams?: SharedTypes.ImgixParams;
  imgixHeightMobile?: number;
  imgixHeightDesktop?: number;
  extraLeftColumnContent?: ReactNode;
  extraRightColumnContent?: ReactNode;
  isSellOut?: boolean;
  imageBackgroundColor?: string;
  hasReview?: boolean;
}) => {
  const isMobile = useIsMobile();
  const [lazyImageWidth, setImageWidth] = useState(212);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  const adjustImageSize = useCallback(() => {
    const width = imgWrapperRef?.current?.offsetWidth;
    if (width && width !== lazyImageWidth) setImageWidth(width);
  }, [lazyImageWidth]);

  useEffectOnce(adjustImageSize);
  useOnResize(imgWrapperRef, adjustImageSize);

  return (
    <Wrapper className={className}>
      <LeftColumn ref={imgWrapperRef}>
        {imageUrl && (
          <ImageWrapperClientLink clientRoute={clientRoute}>
            <ImgixStyled
              imageUrl={imageUrl}
              disableLibraryParam
              className="lazy-img lazyload"
              src={imageUrl}
              imageHtmlAttributes={{
                title,
              }}
              width={lazyImageWidth}
              height={isMobile ? imgixHeightMobile : imgixHeightDesktop}
              imgixParams={{
                auto: "format,compress",
                fit: "crop",
                crop: "entropy",
                ...imgixParams,
              }}
              backgroundColor={imageBackgroundColor}
            />
            {isSellOut && <StyledSellOutLabel />}
          </ImageWrapperClientLink>
        )}
        {extraLeftColumnContent}
      </LeftColumn>
      <RightColumn>
        <ClientLinkProductTitle
          clientRoute={clientRoute}
          title={title}
          data-testid="cartItemTitle"
          hasReview={hasReview}
        >
          <Title
            dangerouslySetInnerHTML={{
              __html: title ?? "",
            }}
          />
        </ClientLinkProductTitle>
        <QuickFactsWithoutModals items={quickFacts} iconColor={iconColor} namespace={namespace} />
        {extraRightColumnContent}
      </RightColumn>
    </Wrapper>
  );
};

const ProductCardOverview = styled(ProductCardOverviewBase)`
  ${mqMin.large} {
    ${productCardOverviewListViewStyles};
  }
`;

export const ProductCardOverviewList = styled(ProductCardOverviewBase)(css`
  flex-grow: 1;

  ${mqMin.large} {
    width: 100%;

    ${productCardOverviewListViewStyles};

    ${LeftColumn} {
      position: static;
    }
  }
`);

export const ProductCardOverviewTile = styled(ProductCardOverviewBase)(css`
  flex-basis: 100%;
  flex-grow: 1;

  ${LeftColumn} {
    line-height: 180px;
  }
`);

export default ProductCardOverview;
