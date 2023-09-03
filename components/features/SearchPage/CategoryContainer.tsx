import React from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";

import CategoryLandingPageClientQuery from "./queries/CategoryLandingPageClientQuery.graphql";
import TourCategoryDefaultFilterQuery from "./queries/TourCategoryDefaultFiltersQuery.graphql";
import useTourSearchParams from "./useTourSearchQueryParams";
import TourSearchContentProviderWrapper from "./TourSearchContentProviderWrapper";
import { constructFilters, useGetNumberOfGuests } from "./utils/searchUtils";
import TourSearchLandingContainer from "./TourSearchLandingContainer";
import useTourAutoCompleteQuery from "./hooks/useTourAutoCompleteQuery";

import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import Container from "components/ui/Search/SearchGrid";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { PageType } from "types/enums";
import useMobileFooterState from "hooks/useMobileFooterState";
import useToggle from "hooks/useToggle";
import CustomNextDynamic from "lib/CustomNextDynamic";

const SearchFilterModal = CustomNextDynamic(() => import("./Search/SearchFilterModal"), {
  ssr: false,
  loading: () => null,
});

const CategoryContainer = ({ slug }: { slug: string }) => {
  const { t } = useTranslation(Namespaces.commonSearchNs);
  const { isMobileFooterShown } = useMobileFooterState();
  const [showFilterModal, toggleFilterModal] = useToggle(false);

  const [
    {
      orderBy,
      orderDirection,
      durationIds,
      activityIds,
      attractionIds,
      startingLocationId,
      startingLocationName,
      adults,
      children,
      childrenAges,
      dateFrom,
      dateTo,
      page,
      price,
    },
  ] = useTourSearchParams();

  const hasFilters = Boolean(
    orderBy ||
      orderDirection ||
      durationIds ||
      activityIds ||
      attractionIds ||
      startingLocationId ||
      (adults && adults > 0) ||
      children !== undefined ||
      dateFrom ||
      dateTo ||
      startingLocationName ||
      price
  );

  const [fetchClientData, { data: clientData, loading: isCategoryToursLoading }] =
    useLazyQuery<SearchPageTypes.QueryCategoryLandingPageClient>(CategoryLandingPageClientQuery, {
      variables: {
        filters: {
          page,
          limit: 24,
          categorySlug: slug,
        },
        context: {
          fetchOptions: {
            method: "POST",
          },
        },
        fetchPolicy: "network-only",
      },
    });

  const { data: defaultFiltersData } = useQuery<SearchPageTypes.QueryLandingPage>(
    TourCategoryDefaultFilterQuery
  );

  useEffectOnScrollMobile(fetchClientData);

  const {
    tourStartingLocations,
    defaultLocation: { id: defaultLocationId, name: defaultLocationName },
  } = useTourAutoCompleteQuery({});

  const numberOfGuests = useGetNumberOfGuests(adults, childrenAges);
  const defaultFilters = constructFilters(defaultFiltersData?.tourSearch?.defaultFilters);

  return (
    <Container data-testid="holiday-vacation-package">
      <BreadcrumbsContainer
        slug={slug}
        type={PageType.TOURCATEGORY}
        lastCrumb={hasFilters ? t("Search results") : undefined}
      />
      {hasFilters ? (
        <TourSearchContentProviderWrapper
          numberOfGuests={numberOfGuests}
          slug={slug}
          isTourCategory
          defaultFilters={defaultFilters}
          defaultLocationName={defaultLocationName}
          selectedLocationName={startingLocationName || defaultLocationName}
          selectedLocationId={startingLocationId || defaultLocationId}
          startingLocationItems={tourStartingLocations}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      ) : (
        <TourSearchLandingContainer
          categorySlug={slug}
          page={page}
          defaultFilters={defaultFilters}
          clientData={clientData?.tourSearch.tours}
          startingLocationId={startingLocationId || defaultLocationId}
          startingLocationItems={tourStartingLocations}
          defaultLocationName={defaultLocationName}
          toggleFilterModal={toggleFilterModal}
          isMobileFooterShown={isMobileFooterShown}
        />
      )}
      {isMobileFooterShown && showFilterModal && (
        <SearchFilterModal
          onClose={toggleFilterModal}
          filters={defaultFilters}
          isLoading={isCategoryToursLoading}
        />
      )}
    </Container>
  );
};

export default CategoryContainer;
