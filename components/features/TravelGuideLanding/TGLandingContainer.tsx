import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { css } from "@emotion/core";

import { constructTGBreadCrumbs, constructTGCards } from "../TravelGuides/utils/travelGuideUtils";
import { SubscribeFormLoading } from "../Footer/FooterWrapper";
import AdminGearLoader from "../AdminGear/AdminGearLoader";

import TGLandingGridCard from "./TGLandingGridCard";
import TGLandingListCard from "./TGLandingListCard";
import { useTGSearch } from "./useTGSearch";
import TGLandingContentContainer from "./TGLandingContentContainer";
import { getAdminLinks } from "./TGLandingUtils/TGLandingUtils";

import Row from "components/ui/Grid/Row";
import { GraphCMSPageType, OpenGraphType, PageType } from "types/enums";
import { getBestPlacesSortOptions } from "components/ui/Sort/sortUtils";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import TileProductCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import Container, { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import CustomNextDynamic from "lib/CustomNextDynamic";
import GTECommonBreadcrumbs from "components/ui/Breadcrumbs/GTECommonBreadcrumbs";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import TGLandingContentQuery from "components/features/TravelGuides/queries/TGLandingPageQuery.graphql";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import GraphCmsSEOContainer from "components/ui/GraphCmsSEOContainer";
import { headingStyles } from "components/ui/Section/SectionHeading";
import { mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { GridItemWrapper } from "components/ui/Search/SearchList";

const TGFilterDesktop = CustomNextDynamic(() => import("./TGFilterDesktop"), {
  ssr: false,
  loading: () => null,
});

const TGFilterMobileFooter = CustomNextDynamic(() => import("./TGFilterMobileFooter"), {
  ssr: false,
  loading: () => null,
});

const LazySubscribeForm = CustomNextDynamic(
  () => import("components/ui/SubscriptionsForm/SubscribeForm"),
  {
    ssr: false,
    loading: () => <SubscribeFormLoading />,
  }
);

const TGLandingTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${gutters.small}px;
  min-height: 42px;
  ${mqMin.desktop} {
    margin-bottom: 0;
  }
`;

const PageHeading = styled.h1<{}>(({ theme }) => [
  headingStyles(theme),
  css`
    letter-spacing: 0.1px;
    line-height: 28px;
    ${mqMin.medium} {
      line-height: 18px;
    }
  `,
]);

export const BreadcrumbPlaceholder = styled.div`
  width: 100%;
  height: 24px;
`;

const TGLandingGridContentCard = ({
  product,
  productLabel,
  imgixParams,
  fallBackImg,
}: {
  product: TravelGuideTypes.TGSearchResultCard;
  productLabel?: string;
  imgixParams?: SharedTypes.ImgixParams;
  fallBackImg?: ImageWithSizes;
}) => {
  return (
    <GridItemWrapper
      key={`grid-item${product.id}`}
      columnSizes={{ small: 1, medium: 1 / 2, desktop: 1 / 3 }}
    >
      <TGLandingGridCard
        product={product}
        productLabel={productLabel}
        imgixParams={imgixParams}
        fallBackImg={fallBackImg}
      />
    </GridItemWrapper>
  );
};

const TGLandingContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.travelGuidesNs);
  const { asPath } = useRouter();

  const { data, loading: landingPageLoading } = useQuery<TravelGuideTypes.TGLandingPageData>(
    TGLandingContentQuery,
    {
      variables: {
        where: {
          metadataUri: queryCondition.metadataUri,
        },
      },
    }
  );
  const landingPageData = data?.bestPlacesCategoryPages?.[0];
  const { loading, destinations, mapData, filters, page, totalPages } = useTGSearch({
    countryCode: landingPageData?.place?.alpha2Code,
    type: landingPageData?.type,
    countryName: landingPageData?.place?.name.value,
    skip: !landingPageData,
  });
  const sortOptions = useMemo(() => getBestPlacesSortOptions(theme), [theme]);
  const cards = useMemo(() => constructTGCards(t, page, destinations), [destinations, page, t]);

  if (landingPageLoading && !landingPageData) {
    // TODO: display search page loading state in this case?
    return <DefaultPageLoading />;
  }
  if (landingPageData) {
    const pageTitle = landingPageData.title;
    const placeImage = constructGraphCMSImage(
      GraphCMSPageType.VacationPackages,
      landingPageData.place?.mainImage
    );
    return (
      <>
        <GraphCmsSEOContainer
          metadata={{
            metadataTitle:
              page > 1
                ? `${landingPageData.metadataTitle} - page ${page}`
                : landingPageData.metadataTitle,
            metadataDescription: landingPageData.metadataDescription,
            canonicalUri: asPath,
            hreflangs: [],
            images: [placeImage],
          }}
          isIndexed
          openGraphType={OpenGraphType.WEBSITE}
          funnelType={queryCondition.pageType}
          pagePlace={landingPageData?.place}
        />
        <Container>
          {landingPageData.breadcrumbs.length > 0 ? (
            <GTECommonBreadcrumbs
              breadcrumbs={constructTGBreadCrumbs(landingPageData.breadcrumbs)}
              hideLastBreadcrumb={false}
            />
          ) : (
            <BreadcrumbPlaceholder />
          )}
          <Row>
            <LeftContent>
              <TGFilterDesktop
                filters={filters ?? []}
                selectedFilters={[]}
                loading={!cards || loading}
              />
              <TGFilterMobileFooter
                filters={filters ?? []}
                loading={!cards || loading}
                selectedFilters={[]}
                totalResults={cards?.length}
              />
            </LeftContent>
            <RightContent>
              <SearchProductListContainer<TravelGuideTypes.TGSearchResultCard>
                TileCardElement={TGLandingGridContentCard}
                TileCardSkeletonElement={TileProductCardSkeleton}
                ListCardElement={TGLandingListCard}
                ListCardSkeletonElement={ListProductCardSkeleton}
                loading={loading}
                products={cards}
                totalProducts={cards?.length}
                isCompact
                currentPage={page ?? 1}
                productListHeader={
                  <TGLandingTitleWrapper>
                    <PageHeading>{pageTitle}</PageHeading>
                  </TGLandingTitleWrapper>
                }
                pageType={PageType.TRAVEL_GUIDE_LANDING}
                sortOptions={sortOptions}
                map={mapData}
                totalPages={totalPages}
                isClustersEnabled={false}
                disableLSLayout
              />
            </RightContent>
          </Row>
          <TGLandingContentContainer queryCondition={queryCondition} />
          <LazySubscribeForm isGTE />
          <AdminGearLoader
            links={getAdminLinks(landingPageData.id)}
            hideCommonLinks
            infoText={[`Travel guide ID: ${landingPageData.id}`]}
          />
        </Container>
      </>
    );
  }
  return null;
};

export default TGLandingContainer;
