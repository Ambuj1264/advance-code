import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import {
  ListCardRowDescription,
  TileProductCardWrapper,
} from "components/ui/Search/utils/sharedSearchUtils";
import CardHeader from "components/ui/Search/CardHeader";
import { ListProductCardDescription } from "components/ui/Search/ListProductCard";
import { ProductCardLinkHeadline, StyledHeadline } from "components/ui/Search/TileProductCard";
import {
  ArrowCircleStyledGreen,
  CardFooter,
  CardFooterWrapper,
} from "components/ui/Search/TileProductCardFooter";
import { greyColor, gutters } from "styles/variables";
import { typographySubtitle2Regular } from "styles/typography";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import LandingPageCardOverlay from "components/ui/LandingPages/LandingPageCardOverlay";
import ClientLink from "components/ui/ClientLink";
import RankingTrophy from "components/ui/Search/RankingTrophy";

const StyledListProductCardDescription = styled(ListProductCardDescription)`
  margin-bottom: ${gutters.small}px;
  width: 100%;
  padding-left: ${gutters.large / 2}px;
`;

const StyledCardHeader = styled(CardHeader)`
  overflow: hidden;
`;

export const SubtitleWrapper = styled.div([
  typographySubtitle2Regular,
  css`
    color: ${greyColor};
    line-height: 28px;
  `,
]);

const TGListCardFooterRightColumn = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`;

const StyledCardHeadline = styled(StyledHeadline)`
  height: 24px;
`;

const TGCardHeadline = StyledCardHeadline.withComponent("h2");

const TGLandingGridCard = ({
  product,
  productLabel,
  imgixParams,
  fallBackImg,
  className,
}: {
  product: TravelGuideTypes.TGSearchResultCard;
  productLabel?: string;
  imgixParams?: SharedTypes.ImgixParams;
  fallBackImg?: ImageWithSizes;
  className?: string;
}) => {
  const theme: Theme = useTheme();
  const { id, linkUrl, headline, description, image, clientRoute, flag, rank } = product;
  if (!clientRoute) return null;
  return (
    <TileProductCardWrapper key={id} className={className}>
      <div>
        <ClientLink clientRoute={clientRoute} title={headline}>
          <StyledCardHeader
            averageRating={0}
            reviewsCount={0}
            image={image}
            productLabel={productLabel}
            isLoading={false}
            imgixParams={imgixParams}
            leftTopContent={
              flag?.url && <LandingPageCardOverlay country={flag.name} destinationFlag={flag} />
            }
            rightTopContent={rank && <RankingTrophy rank={rank} />}
            fallBackImg={fallBackImg}
          />
        </ClientLink>
        <ProductCardLinkHeadline
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          openInSameWindowIfNoLinkTarget
          theme={theme}
        >
          <TGCardHeadline
            dangerouslySetInnerHTML={{
              __html: headline ?? "",
            }}
            title={headline}
          />
        </ProductCardLinkHeadline>
        <ListCardRowDescription>
          {description && (
            <StyledListProductCardDescription
              id="description-"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
        </ListCardRowDescription>
      </div>
      <ClientLink clientRoute={clientRoute} title={headline}>
        <CardFooterWrapper theme={theme}>
          <CardFooter hasPriceSubtitle={false} className={className} data-testid="cardFooter">
            <TGListCardFooterRightColumn>
              <SubtitleWrapper>
                <Trans ns={Namespaces.commonNs}>See more</Trans>
              </SubtitleWrapper>
              <ArrowCircleStyledGreen theme={theme} />
            </TGListCardFooterRightColumn>
          </CardFooter>
        </CardFooterWrapper>
      </ClientLink>
    </TileProductCardWrapper>
  );
};

export default TGLandingGridCard;
