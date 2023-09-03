import React, { ComponentProps, lazy } from "react";
import styled from "@emotion/styled";

import SSRSearchPageCategoriesContainer from "./Categories/SearchPageCategoriesContainer?onDemand";
import SSRTourCategoryInformationContainer from "./TourCategoryInformationContainer?onDemand";
import SearchPageFAQContainer from "./SearchPageFAQContainer";
import SearchPageReviewsContainer from "./SearchPageReviewsContainer";
import StaticTourListContainer from "./StaticTourListContainer";

import OnDemandComponent from "components/ui/Lazy/OnDemandComponent";
import Row from "components/ui/Grid/Row";
import { column, mqMin } from "styles/base";
import { LandingPageType, PageType } from "types/enums";
import componentLoader from "components/ui/LazyComponentLoader";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import InformationContainer from "components/ui/Search/InformationContainer";

const lazySearchPageCategoriesContainer = lazy(() =>
  componentLoader(() => import("./Categories/SearchPageCategoriesContainer"))
);

const lazyTourCategoryInformationContainer = lazy(() =>
  componentLoader(() => import("./TourCategoryInformationContainer"))
);

const SearchPageCategoriesSkeleton = styled.div`
  height: 1265px;

  ${mqMin.medium} {
    height: 4433px;
  }

  ${mqMin.large} {
    height: 3478px;
  }

  ${mqMin.desktop} {
    height: 2904px;
  }
`;

const TourCategoryInformationSkeleton = styled.div`
  height: 302px;

  ${mqMin.medium} {
    height: 190px;
  }

  ${mqMin.large} {
    height: 198px;
  }
`;

const AdditionalContent = styled.div(column({ small: 1 }));

const TourSearchAdditionalContent = ({
  slug,
  isTourCategory,
  newestTours,
  topHolidayTours,
  newestToursMetadata,
  topHolidayToursMetadata,
  hasPageFilter,
  pageAboutTitle,
  pageAboutDescription,
  shouldHaveStructured = true,
}: {
  slug?: string;
  isTourCategory: boolean;
  newestTours?: SharedTypes.Product[];
  topHolidayTours?: SharedTypes.Product[];
  newestToursMetadata?: SharedTypes.QuerySearchMetadata;
  topHolidayToursMetadata?: SharedTypes.QuerySearchMetadata;
  hasPageFilter: boolean;
  pageAboutTitle?: string;
  pageAboutDescription?: string;
  shouldHaveStructured?: boolean;
}) => {
  const shouldShowExtraTours = Boolean(
    newestTours && topHolidayTours && newestToursMetadata && topHolidayToursMetadata
  );

  return (
    <Row>
      <AdditionalContent>
        {shouldShowExtraTours && !hasPageFilter && (
          <StaticTourListContainer
            newestTours={newestTours!}
            topHolidayTours={topHolidayTours!}
            newestToursMetadata={newestToursMetadata!}
            topHolidayToursMetadata={topHolidayToursMetadata!}
          />
        )}
        <OnDemandComponent<ComponentProps<typeof SSRSearchPageCategoriesContainer>>
          LazyComponent={lazySearchPageCategoriesContainer}
          SsrOnlyComponent={SSRSearchPageCategoriesContainer}
          loading={<SearchPageCategoriesSkeleton />}
          lazyHydrateProps={{ whenVisible: true }}
        />
        {!hasPageFilter && isTourCategory && (
          <LazyHydrateWrapper on="mouseenter">
            <SearchPageReviewsContainer slug={slug!} />
          </LazyHydrateWrapper>
        )}

        {isTourCategory && !hasPageFilter && (
          <OnDemandComponent<ComponentProps<typeof SSRTourCategoryInformationContainer>>
            LazyComponent={lazyTourCategoryInformationContainer}
            SsrOnlyComponent={SSRTourCategoryInformationContainer}
            loading={<TourCategoryInformationSkeleton />}
            lazyHydrateProps={{ ssrOnly: true }}
            slug={slug}
          />
        )}
        {!hasPageFilter && (
          <LazyHydrateWrapper ssrOnly>
            {pageAboutTitle && pageAboutDescription && (
              <InformationContainer
                title={pageAboutTitle}
                description={pageAboutDescription}
                clampTextExtraHeight={62}
              />
            )}
            <SearchPageFAQContainer
              slug={slug}
              pageType={PageType.TOURCATEGORY}
              landingPage={LandingPageType.TOURS}
              shouldHaveStructured={shouldHaveStructured}
            />
          </LazyHydrateWrapper>
        )}
      </AdditionalContent>
    </Row>
  );
};

export default TourSearchAdditionalContent;
