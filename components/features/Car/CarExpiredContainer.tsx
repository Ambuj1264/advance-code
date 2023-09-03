import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import CarBreadcrumbs from "./CarBreadcrumbs";
import CarRibbon from "./CarRibbon/CarRibbon";
import SimilarCars from "./SimilarCars";

import ImageGalleryCarousel from "components/ui/ImageCarousel/ImageGalleryCarousel";
import Container from "components/ui/Grid/Container";
import { useTranslation } from "i18n";
import { constructHeadline } from "utils/sharedCarUtils";
import PageContentContainer, { Content } from "components/ui/PageContentContainer";
import { HEADER_HEIGHT_WITH_TITLE } from "components/ui/BookingWidget/BookingWidgetDesktopWrapper";
import {
  boxShadowStrong,
  containerMaxWidth,
  bittersweetRedColor,
  borderRadius,
  gutters,
  whiteColor,
} from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { mediaQuery, column } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import BestPriceIcon from "components/icons/check-shield.svg";
import CancellationIcon from "components/icons/file-text-remove.svg";
import CustomerSupportIcon from "components/icons/phone-support.svg";
import ProductPropositions from "components/ui/ProductPropositions";
import ProductHeader from "components/ui/ProductHeader";
import DefaultHeadTags from "lib/DefaultHeadTags";
import useActiveLocale from "hooks/useActiveLocale";

const Desktop = styled.div(column({ small: 0, large: 3 / 8, desktop: 1 / 3 }));

const BookingWidgetContainer = styled.div([
  mediaQuery({
    width: [
      0,
      0,
      `calc(${(3 / 8) * 100}% - ${gutters.small * 2}px)`,
      `calc(${(1 / 3) * 100}% - ${gutters.small * 2}px)`,
    ],
  }),
  css`
    position: absolute;
    top: ${HEADER_HEIGHT_WITH_TITLE}px;
    box-shadow: ${boxShadowStrong};
    border-radius: ${borderRadius};
    max-width: calc(${containerMaxWidth} / 3 - ${gutters.small * 2}px);
    height: 788px;
    transition: height 0.4s;
  `,
]);

const BannerText = styled.span`
  margin-left: ${gutters.small / 2}px;
  color: ${whiteColor};
`;

const Wrapper = styled.div([
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${borderRadius} ${borderRadius} 0 0;
    height: 36px;
    padding: ${gutters.large / 2}px 0px;
    background-color: ${bittersweetRedColor};
  `,
]);

const CarExpiredContainer = ({
  similarCarsProps,
  searchCategory,
  searchPageUrl,
  isCarnect,
}: {
  similarCarsProps: CarTypes.SimilarCarsProps;
  searchCategory?: CarTypes.SearchCategory;
  searchPageUrl?: string;
  isCarnect: boolean;
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.carNs);
  const { carName } = similarCarsProps;
  const activeLocale = useActiveLocale();
  const normalizedCarName = constructHeadline(t, carName, activeLocale);

  return (
    <>
      <DefaultHeadTags title={t("Offer expired")} />
      <Container>
        <CarBreadcrumbs
          id={similarCarsProps.id}
          carName={normalizedCarName}
          isCarnect={isCarnect}
          searchCategory={searchCategory}
        />
        <ProductHeader title={normalizedCarName} />
      </Container>
      <PageContentContainer>
        <Content>
          <ImageGalleryCarousel
            images={[
              {
                id: "expiredCarsImage",
                url: "https://guidetoiceland.imgix.net/444956/x/0/Luxury-cars.jpg",
              },
            ]}
            rightTopContent={<CarRibbon expired />}
            isDisabled
            crop="center"
          />
          <ProductPropositions
            productProps={[
              { Icon: CancellationIcon, title: t("Free cancellation") },
              { Icon: CustomerSupportIcon, title: t("24/7 customer support") },
              { Icon: BestPriceIcon, title: t("Best price guarantee") },
            ]}
          />
          <SimilarCars
            similarCarsProps={similarCarsProps}
            searchCategory={searchCategory}
            searchPageUrl={searchPageUrl}
          />
        </Content>
        {!isMobile && (
          <Desktop>
            <BookingWidgetContainer>
              <Wrapper>
                <BannerText>{t("Offer expired")}</BannerText>
              </Wrapper>
            </BookingWidgetContainer>
          </Desktop>
        )}
      </PageContentContainer>
    </>
  );
};

export default CarExpiredContainer;
