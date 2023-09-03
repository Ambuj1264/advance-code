import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import {
  ItemsWrapper,
  ListCardButtonStyled,
  ListCardFooter,
  ListCardFooterRightColumn,
  ListCardHeadline,
  ListCardRightColumn,
  ListCardRowDescription,
  ListCardWrapper,
  ListRowContent,
} from "components/ui/Search/utils/sharedSearchUtils";
import {
  ListCardRowTitle,
  ListProductCardDescription,
  StyledCardHeader,
} from "components/ui/Search/ListProductCard";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import LandingPageCardOverlay from "components/ui/LandingPages/LandingPageCardOverlay";
import ClientLink from "components/ui/ClientLink";
import RankingTrophy from "components/ui/Search/RankingTrophy";

const StyledListProductCardDescription = styled(ListProductCardDescription)`
  width: 100%;
`;

const ListCardClientLinkHeader = styled(ClientLink)`
  flex-basis: 330px;
  flex-shrink: 0;
  align-self: flex-start;
`;

const TGListCardHeadline = ListCardHeadline.withComponent("h2");

const TGLandingListCard = ({
  product,
  productLabel,
  imgixParams,
  fallBackImg,
}: {
  product: TravelGuideTypes.TGSearchResultCard & {
    clientRoute: SharedTypes.ClientRoute;
  };
  productLabel?: string;
  imgixParams?: SharedTypes.ImgixParams;
  fallBackImg?: ImageWithSizes;
}) => {
  const theme: Theme = useTheme();
  const { id, linkUrl, headline, description, image, clientRoute, flag, rank } = product;

  return (
    <ItemsWrapper key={id}>
      <ListCardWrapper>
        <ListRowContent>
          <ListCardClientLinkHeader clientRoute={clientRoute} title={headline}>
            <StyledCardHeader
              image={image}
              productLabel={productLabel}
              imgixParams={imgixParams}
              fallBackImg={fallBackImg}
              leftTopContent={
                flag?.url && <LandingPageCardOverlay country={flag.name} destinationFlag={flag} />
              }
              rightTopContent={rank && <RankingTrophy rank={rank} />}
            />
          </ListCardClientLinkHeader>
          <ListCardRightColumn>
            <ListCardRowTitle>
              <ClientLink clientRoute={clientRoute} title={headline}>
                <TGListCardHeadline
                  dangerouslySetInnerHTML={{
                    __html: headline ?? "",
                  }}
                  title={headline}
                />
              </ClientLink>
            </ListCardRowTitle>
            <ListCardRowDescription>
              {description && (
                <StyledListProductCardDescription
                  id={`description-${linkUrl}`}
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              )}
            </ListCardRowDescription>
          </ListCardRightColumn>
        </ListRowContent>
        <ListCardFooter theme={theme} data-testid="cardFooter">
          <ListCardFooterRightColumn>
            <ClientLink clientRoute={clientRoute} title={headline}>
              <ListCardButtonStyled theme={theme} color="action">
                <Trans ns={Namespaces.commonNs}>See more</Trans>
              </ListCardButtonStyled>
            </ClientLink>
          </ListCardFooterRightColumn>
        </ListCardFooter>
      </ListCardWrapper>
    </ItemsWrapper>
  );
};

export default TGLandingListCard;
