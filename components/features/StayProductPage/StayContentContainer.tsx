import React, { memo, useMemo } from "react";
import styled from "@emotion/styled";

import useStayContentQuery from "./useStayContentQuery";
import { useStayBookingWidgetContext } from "./StayBookingWidget/StayBookingWidgetStateContext";
import { getStaySearchUrl, constructAmenities, isStaysPageIndexed } from "./utils/stayUtils";
import StayRoomCombinationsSection from "./StayRoomCombinationsSection";
import StaySEOContainer from "./StaySEOContainer";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { getMapDataWithMapboxStaticImage } from "components/ui/Cover/CoverMap/Google/mapUtils";
import ProductAttractionsMapContainer from "components/ui/Map/ProductAttractionsMapContainer";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import Information from "components/ui/Information/Information";
import IconList from "components/ui/IconList/IconList";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import SimilarProducts from "components/ui/SimilarProducts/SimilarProducts";
import { Content } from "components/ui/PageContentContainer";
import { PageType, SupportedLanguages } from "types/enums";
import LandingPageValuePropositions from "components/ui/LandingPages/LandingPageValuePropositions";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { mqMax } from "styles/base";
import Icon from "components/ui/GraphCMSIcon";
import { MobileContainer } from "components/ui/Grid/Container";
import ProductCover from "components/ui/ImageCarousel/ProductCover";
import ProductContentLoading from "components/ui/ProductPageLoading/ProductContentLoading";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";
import { getUUID } from "utils/helperUtils";

const ReviewsContainer = CustomNextDynamic(() => import("./StayReviewsContainer"), {
  ssr: false,
  loading: () => <ReviewsLoading />,
});

const ModalViewLoadingWrapper = styled.div`
  padding: 0 ${gutters.small}px;
  ${mqMax.large} {
    padding: 0 ${gutters.small + gutters.small / 2}px;
  }
`;

const StyledIconList = styled(IconList)`
  margin-top: -${gutters.small}px;
`;

const StayContentContainer = ({
  attractionsConditions,
  searchUrl,
  queryCondition,
  productId,
  productTitle = "",
  isModalView = false,
  className,
  staySEOContainerData,
  ipCountryCode,
}: {
  attractionsConditions?: {
    latitude: number;
    longitude: number;
  };
  searchUrl?: string;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  productId: number;
  productTitle?: string;
  isModalView?: boolean;
  className?: string;
  staySEOContainerData?: {
    isIndexed: boolean;
    fromPrice: number;
    metadataUri: string;
    place?: LandingPageTypes.Place;
    locale: SupportedLanguages;
  };
  ipCountryCode?: string;
}) => {
  const { selectedDates, occupancies } = useStayBookingWidgetContext();
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { content, similarProducts, loading, similarProductsLoading, staticRooms } =
    useStayContentQuery({
      attractionsConditions,
      productId,
      where: queryCondition,
      ipCountryCode,
    });

  const url = getStaySearchUrl({
    searchId: getUUID(),
    selectedDates,
    occupancies,
    productTitle,
    productId,
    url: searchUrl,
  });

  const productSpecs = useMemo(
    () =>
      content?.productSpecs
        .map(spec => ({
          name: spec.title,
          value: t(spec.name, content!.quickfactValues),
          Icon: Icon(spec.icon?.handle),
        }))
        .filter(spec => spec.value !== "") ?? [],
    [content, t]
  );

  // TODO: remove this override after we resolve the issue with dynamc google map API
  const { coverMapData, contentMapData } = getMapDataWithMapboxStaticImage(
    isMobile,
    content?.mapData,
    920,
    430
  );

  if (loading) {
    return isModalView ? (
      <ModalViewLoadingWrapper>
        <ProductContentLoading />
      </ModalViewLoadingWrapper>
    ) : (
      <Content className={className}>
        <ProductContentLoading />
      </Content>
    );
  }
  if (!content) return null;

  const reviewScore = content.review?.totalScore ?? 0;
  const reviewCount = content.review?.totalCount ?? 0;

  return (
    <Content className={className}>
      {staySEOContainerData && (
        <StaySEOContainer
          queryCondition={queryCondition}
          isIndexed={isStaysPageIndexed(
            staySEOContainerData.isIndexed,
            staySEOContainerData.locale
          )}
          fromPrice={staySEOContainerData.fromPrice}
          metadataUri={staySEOContainerData.metadataUri}
          pagePlace={staySEOContainerData.place}
          review={{ totalScore: reviewScore, totalCount: reviewCount }}
        />
      )}
      <ProductCover
        id={productId}
        images={content.images}
        reviewScore={reviewScore}
        reviewCount={reviewCount}
        showReviews={false}
        mapData={coverMapData}
        crop="center"
        useAlternateStaticImageOnly
      />
      {!isModalView && (
        <MobileContainer>
          <LandingPageValuePropositions valueProps={content.productProps} />
        </MobileContainer>
      )}
      <Section id="information" key="information">
        <MobileContainer>
          <Information
            information={content.description}
            namespace={Namespaces.accommodationNs}
            productSpecs={productSpecs?.slice(0, 6)}
            id={`${productId}-ProductInfo`}
          />
        </MobileContainer>
      </Section>
      <StayRoomCombinationsSection isModalView={isModalView} staticRooms={staticRooms} />
      {content.amenities.length > 0 && (
        <Section id="amenities">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.accommodationNs}>Facilities</Trans>
            </LeftSectionHeading>
            <SectionContent>
              <StyledIconList
                sectionId="amenities"
                iconList={constructAmenities(t, content.amenities)}
                inGrid
              />
            </SectionContent>
          </MobileContainer>
        </Section>
      )}
      <ProductAttractionsMapContainer
        nearbyAttractions={content.nearbyAttractions}
        mapData={contentMapData!}
        sectionId={`AttractionsMapContainer-${productId}`}
        title={t("Attractions nearby")}
        useAlternateStaticImageOnly
      />
      {reviewCount > 0 && (
        <ReviewsContainer
          productId={productId}
          reviewTotalScore={reviewScore}
          reviewTotalCount={reviewCount}
          isModalView={isModalView}
        />
      )}
      {!isModalView && (similarProducts.length > 0 || similarProductsLoading) && (
        <Section id="similarStays" key="similarStays">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.accommodationNs}>Similar stays</Trans>
            </LeftSectionHeading>
            <SectionContent>
              {similarProductsLoading ? (
                <SimilarProductsLoading height={424} />
              ) : (
                <SimilarProducts
                  similarProducts={similarProducts}
                  seeMoreLink={url}
                  searchPageType={PageType.GTE_STAYS_SEARCH}
                />
              )}
            </SectionContent>
          </MobileContainer>
        </Section>
      )}
    </Content>
  );
};

export default memo(StayContentContainer);
