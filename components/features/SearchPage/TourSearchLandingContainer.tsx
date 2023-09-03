import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { useTheme } from "emotion-theming";

import ProductSearchAndCategorySEOContainer from "../SEO/ProductSearchAndCategorySEOContainer";
import { getTourCategoryAdminLinks } from "../AdminGear/utils";
import AdminGearLoader from "../AdminGear/AdminGearLoader";

import TourSearchQuery from "./queries/TourSearchQuery.graphql";
import CategoryHeaderQuery from "./queries/CategoryHeaderQuery.graphql";
import {
  constructClientTours,
  constructFilters,
  getIsTourSearchPageIndexed,
  normalizeCategoryHeaderData,
} from "./utils/searchUtils";
import TourSearchAdditionalContent from "./TourSearchAdditionalContent";
import FrontTourSearchMobileFooter from "./Search/FrontTourSearchMobileFooter";

import usePageMetadata from "hooks/usePageMetadata";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { CategorySearchPageType, LandingPageType, PageType, Product } from "types/enums";
import FrontCover from "components/ui/Cover/FrontCover/FrontCover";
import LoadingCover from "components/ui/Loading/LoadingCover";
import FrontSearchWidgetContainer from "components/ui/FrontSearchWidget/FrontSearchWidgetContainer";
import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import FrontMobileStepsContainer from "components/ui/FrontSearchWidget/FrontMobileStepsContainer";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import LandingHeaderWrapper from "components/ui/Search/LandingHeaderWrapper";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import FrontSearchStateContextProviderContainer from "components/ui/FrontSearchWidget/FrontSearchStateContextProviderContainer";
import Row from "components/ui/Grid/Row";
import { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import CustomNextDynamic from "lib/CustomNextDynamic";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import { TileProductCardGridElement } from "components/ui/Search/TileProductCard";
import TileProductCardSkeleton, {
  TileProductSSRSkeletonGridElement,
} from "components/ui/Search/TileProductCardSkeleton";
import { ListProductRowElement } from "components/ui/Search/ListProductCard";
import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import { getTourSortOptions } from "components/ui/Sort/sortUtils";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import TopServicesContainer from "components/ui/TopServices/TopServicesContainer";
import Section from "components/ui/Section/Section";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const SearchWidgetDesktopContainer = CustomNextDynamic(
  () => import("./Search/SearchWidgetDesktopContainer"),
  {
    ssr: false,
    loading: () => null,
  }
);

const TourSearchLandingContainer = ({
  categorySlug,
  page,
  searchToursMetadata,
  clientData,
  landingTours,
  defaultFilters,
  newestTours,
  topHolidayTours,
  newestToursMetadata,
  topHolidayToursMetadata,
  startingLocationId,
  startingLocationName,
  defaultLocationName,
  startingLocationItems,
  toggleFilterModal,
  isMobileFooterShown,
}: {
  categorySlug?: string;
  page?: number;
  searchToursMetadata?: SharedTypes.QuerySearchMetadata;
  clientData?: SharedTypes.TourClientData[];
  landingTours?: SharedTypes.Product[];
  defaultFilters?: SearchPageTypes.Filters;
  newestTours?: SharedTypes.Product[];
  topHolidayTours?: SharedTypes.Product[];
  newestToursMetadata?: SharedTypes.QuerySearchMetadata;
  topHolidayToursMetadata?: SharedTypes.QuerySearchMetadata;
  startingLocationId?: string;
  startingLocationName?: string;
  defaultLocationName?: string;
  startingLocationItems?: SearchPageTypes.Filter[];
  toggleFilterModal: () => void;
  isMobileFooterShown: boolean;
}) => {
  const { asPath } = useRouter();
  const activeLocale = useActiveLocale();
  const { adminUrl } = useSettings();
  const theme: Theme = useTheme();
  const isMobile = useIsMobile();
  const isTourCategory = Boolean(categorySlug);
  const activeServices = [
    {
      isLegacy: false,
      pageType: PageType.TOURSEARCH as string,
      title: "Find a tour",
      uri: cleanAsPathWithLocale(asPath),
    },
  ];
  const {
    error: categoryHeaderError,
    data: categoryHeaderRawData,
    loading: isCategoryHeaderLoading,
  } = useQuery<SearchPageTypes.QueryCategoryHeader>(
    CategoryHeaderQuery,
    categorySlug ? { variables: { slug: categorySlug } } : undefined
  );

  const {
    error: searchError,
    data: searchData,
    loading: searchLoading,
  } = useQuery<SearchPageTypes.QuerySearchTours>(
    TourSearchQuery,
    isTourCategory
      ? {
          variables: {
            filters: {
              categorySlug,
              limit: PRODUCT_SEARCH_RESULT_LIMIT,
              page,
            },
          },
        }
      : // skipping for tour search landing page because it uses LandingPageQuery
        { skip: Boolean(landingTours) }
  );
  const canonicalQueryParams = page && page > 1 ? `page=${page}` : undefined;
  const metadata = usePageMetadata({ canonicalQueryParams });
  const filters = constructFilters(defaultFilters, searchData?.tourSearch?.filters);
  const sortOptions = getTourSortOptions(theme);
  const tours = searchData?.tourSearch?.tours
    ? constructClientTours(searchData.tourSearch.tours, clientData)
    : landingTours;

  if (
    (!categoryHeaderRawData?.tourCategoryHeader && !isCategoryHeaderLoading) ||
    categoryHeaderError
  ) {
    return (
      <ErrorComponent error={categoryHeaderError} componentName="TourSearchLandingContainer" />
    );
  }

  const categoryHeaderData =
    categoryHeaderRawData && normalizeCategoryHeaderData(categoryHeaderRawData);

  const context = {
    tripStartingLocationId: startingLocationId,
    tripStartingLocationItems: startingLocationItems,
    tripStartingLocationName: startingLocationName || defaultLocationName,
    defaultTripStartingLocationName: defaultLocationName,
  } as FrontSearchStateContext;

  const categoryId = categoryHeaderRawData?.tourCategoryHeader?.id;
  const adminLinks = getTourCategoryAdminLinks(
    activeLocale,
    adminUrl,
    CategorySearchPageType.TOUR_CATEGORY,
    categoryId
  );

  const totalPages = searchData?.tourSearch?.totalPages ?? 1;
  const isCategoryIndexed = getIsTourSearchPageIndexed({
    isTourCategory,
    metadata,
    page,
    totalPages,
  });
  const searchListHeader = searchToursMetadata?.title ?? categoryHeaderData?.title;
  return (
    <FrontSearchStateContextProviderContainer context={context}>
      <ProductSearchAndCategorySEOContainer
        isIndexed={!isTourCategory || isCategoryIndexed}
        coverImage={categoryHeaderData?.images[0]}
        canonicalQueryParams={canonicalQueryParams}
      />
      <LandingHeaderWrapper isShow>
        {!categoryHeaderData || isCategoryHeaderLoading ? (
          <LoadingCover />
        ) : (
          <FrontCover
            images={categoryHeaderData?.images}
            title={categoryHeaderData?.title}
            description={categoryHeaderData?.description || ""}
            hasBreadcrumbs
          >
            <FrontSearchWidgetContainer
              isCategoryPage={isTourCategory}
              activeServices={activeServices}
              runTabChangeOnMount={false}
              hideTabs
            />
          </FrontCover>
        )}
      </LandingHeaderWrapper>
      <FrontValuePropositions productType={Product.TOUR} />
      {!isTourCategory ? <TopServicesContainer isFirstSection /> : null}
      <FrontMobileStepsContainer activeServices={activeServices} isCategoryPage={isTourCategory} />
      <Section isFirstSection={isTourCategory}>
        <Row>
          <LeftContent>
            {!isMobile && <SearchWidgetDesktopContainer filters={filters} />}
          </LeftContent>
          <RightContent>
            {!searchError && (
              <SearchProductListContainer<SharedTypes.Product>
                TileCardElement={TileProductCardGridElement}
                TileCardSkeletonElement={TileProductCardSkeleton}
                TileCardSSRSkeletonElement={TileProductSSRSkeletonGridElement}
                ListCardElement={ListProductRowElement}
                ListCardSkeletonElement={ListProductCardSkeleton}
                loading={searchLoading}
                products={tours!}
                isCompact
                currentPage={page ?? 1}
                productListHeader={
                  <ProductSearchListHeader
                    loading={searchLoading}
                    hasFilters={false}
                    totalProducts={tours?.length}
                    header={searchListHeader ?? ""}
                    customSubheader={searchToursMetadata?.subtitle}
                  />
                }
                pageType={PageType.TOUR}
                sortOptions={sortOptions}
                totalPages={totalPages}
              />
            )}
          </RightContent>
        </Row>
      </Section>
      <LazyHydrateWrapper whenVisible key="tourSearchAdditionalContent">
        <TourSearchAdditionalContent
          slug={categorySlug}
          isTourCategory={isTourCategory}
          newestTours={newestTours}
          topHolidayTours={topHolidayTours}
          newestToursMetadata={newestToursMetadata}
          topHolidayToursMetadata={topHolidayToursMetadata}
          pageAboutTitle={categoryHeaderData?.pageAboutTitle}
          pageAboutDescription={categoryHeaderData?.pageAboutDescription}
          hasPageFilter={false}
          shouldHaveStructured={page === undefined || page <= 1}
        />
      </LazyHydrateWrapper>
      <AdminGearLoader
        links={adminLinks}
        landingPageType={LandingPageType.TOURS}
        pageType={PageType.TOURCATEGORY}
        slug={categorySlug}
      />
      {isMobileFooterShown ? (
        <FrontTourSearchMobileFooter toggleFilterModal={toggleFilterModal} />
      ) : null}
    </FrontSearchStateContextProviderContainer>
  );
};

export default TourSearchLandingContainer;
