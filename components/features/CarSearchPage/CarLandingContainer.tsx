import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";

import ProductSearchAndCategorySEOContainer from "../SEO/ProductSearchAndCategorySEOContainer";

import useCarSearchQueryParams from "./useCarSearchQueryParams";
import CarSearchContainer from "./CarSearchContainer";
import CarLandingContentContainer from "./CarLandingContentContainer";
import CarProductUrlQuery from "./queries/CarProductUrlQuery.graphql";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { container } from "styles/base";
import { gutters } from "styles/variables";
import { PageType, LandingPageType } from "types/enums";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";

const Container = styled.div([
  container,
  css`
    display: flex;
    flex-direction: column;
    margin-bottom: ${gutters.small / 2}px;
  `,
]);

const CarLandingContainer = ({
  slug,
  isCarCategory,
  searchCategory,
  topCars,
  topCarsMetadata,
  defaultPickupId,
  defaultDropoffId,
}: {
  slug: string;
  isCarCategory: boolean;
  searchCategory: SharedTypes.SearchCategoryInfo;
  topCars: CarSearchTypes.QueryTopCar[];
  topCarsMetadata?: SharedTypes.QuerySearchMetadata;
  defaultPickupId?: string;
  defaultDropoffId?: string;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const [
    {
      dateFrom,
      dateTo,
      pickupId,
      dropoffId,
      orderBy,
      /* eslint-disable camelcase */
      to_submit,
      from_submit,
      similar_to,
      /* eslint-enable camelcase */
      editCarOfferCartId,
    },
  ] = useCarSearchQueryParams();

  const hasSubmissionParams = Boolean(
    // eslint-disable-next-line camelcase
    to_submit || from_submit || similar_to
  );

  const hasFilters = Boolean(
    dateFrom || dateTo || pickupId || dropoffId || orderBy || editCarOfferCartId
  );
  const { data: productUrlData } = useQuery<{
    carProductUrl: string;
  }>(CarProductUrlQuery);
  return (
    <>
      <ProductSearchAndCategorySEOContainer
        isIndexed={!hasFilters && !hasSubmissionParams}
        coverImage={searchCategory.cover.image}
      />
      <Container data-testid="carSearchResult">
        <BreadcrumbsContainer
          type={isCarCategory ? PageType.CARSEARCHCATEGORY : PageType.CAR}
          landingPageType={isCarCategory ? undefined : LandingPageType.CARS}
          slug={slug}
          lastCrumb={hasFilters ? commonSearchT("Search results") : undefined}
        />
        {!hasFilters ? (
          <CarLandingContentContainer
            slug={slug}
            isCarCategory={isCarCategory}
            searchCategory={searchCategory}
            topCars={topCars}
            topCarsMetadata={topCarsMetadata}
          />
        ) : (
          <CarSearchContainer
            slug={slug}
            defaultPickupId={defaultPickupId}
            defaultDropoffId={defaultDropoffId}
            carProductUrl={
              productUrlData ? `/${productUrlData.carProductUrl}/search-results/book` : undefined
            }
          />
        )}
      </Container>
    </>
  );
};

export default CarLandingContainer;
