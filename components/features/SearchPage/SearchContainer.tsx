import React from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";

import LandingPageQuery from "./queries/LandingPageQuery.graphql";
import LandingPageClientQuery from "./queries/LandingPageClientQuery.graphql";
import { constructClientTours, constructFilters, useGetNumberOfGuests } from "./utils/searchUtils";
import useTourSearchParams from "./useTourSearchQueryParams";
import TourSearchLandingContainer from "./TourSearchLandingContainer";
import TourSearchContentProviderWrapper from "./TourSearchContentProviderWrapper";
import useTourAutoCompleteQuery from "./hooks/useTourAutoCompleteQuery";

import Container from "components/ui/Search/SearchGrid";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import { LandingPageType, PageType } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useMobileFooterState from "hooks/useMobileFooterState";
import useToggle from "hooks/useToggle";
import CustomNextDynamic from "lib/CustomNextDynamic";

const SearchFilterModal = CustomNextDynamic(() => import("./Search/SearchFilterModal"), {
  ssr: false,
  loading: () => null,
});

const SearchContainer = () => {
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
      adults,
      children,
      childrenAges,
      dateFrom,
      dateTo,
      startingLocationName,
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
      startingLocationName ||
      (adults && adults > 0) ||
      children !== undefined ||
      dateFrom ||
      dateTo ||
      page > 1 ||
      price
  );
  const numberOfGuests = useGetNumberOfGuests(adults, childrenAges);

  const [fetchClientData, { data: clientData }] =
    useLazyQuery<SearchPageTypes.QueryLandingPageClient>(LandingPageClientQuery, {
      context: {
        fetchOptions: {
          method: "POST",
        },
      },
      fetchPolicy: "network-only",
    });

  useEffectOnScrollMobile(fetchClientData);

  const {
    error: landingToursError,
    data: landingToursData,
    loading: isLandingToursLoading,
  } = useQuery<SearchPageTypes.QueryLandingPage>(LandingPageQuery);

  const {
    tourStartingLocations,
    defaultLocation: { id: defaultLocationId, name: defaultLocationName },
    tourAutoCompleteError,
  } = useTourAutoCompleteQuery({});

  if (landingToursError || tourAutoCompleteError) {
    return null;
  }

  const newestTours =
    landingToursData &&
    constructClientTours(
      landingToursData.newestToursSearch.tours,
      clientData?.newestToursSearch.tours
    );
  const topHolidayTours =
    landingToursData &&
    constructClientTours(
      landingToursData.topHolidayToursSearch.tours,
      clientData?.topHolidayToursSearch.tours
    );
  const landingTours =
    landingToursData &&
    constructClientTours(landingToursData.topToursSearch.tours, clientData?.topToursSearch.tours);
  const defaultFilters = constructFilters(landingToursData?.tourSearch?.defaultFilters);

  return (
    <Container data-testid="tourSearchResult">
      <BreadcrumbsContainer
        type={PageType.TOUR}
        landingPageType={LandingPageType.TOURS}
        lastCrumb={hasFilters ? t("Search results") : undefined}
      />
      {hasFilters ? (
        <TourSearchContentProviderWrapper
          defaultFilters={defaultFilters}
          defaultLocationName={defaultLocationName}
          selectedLocationName={startingLocationName || defaultLocationName}
          selectedLocationId={startingLocationId || defaultLocationId}
          startingLocationItems={tourStartingLocations}
          dateFrom={dateFrom}
          dateTo={dateTo}
          numberOfGuests={numberOfGuests}
          landingPageType={LandingPageType.TOURS}
        />
      ) : (
        <TourSearchLandingContainer
          searchToursMetadata={landingToursData?.topToursSearch.metadata}
          defaultFilters={defaultFilters}
          landingTours={landingTours}
          startingLocationId={startingLocationId || defaultLocationId}
          newestTours={newestTours}
          startingLocationItems={tourStartingLocations}
          defaultLocationName={defaultLocationName}
          topHolidayTours={topHolidayTours}
          newestToursMetadata={landingToursData?.newestToursSearch.metadata}
          topHolidayToursMetadata={landingToursData?.topHolidayToursSearch.metadata}
          toggleFilterModal={toggleFilterModal}
          isMobileFooterShown={isMobileFooterShown}
        />
      )}
      {isMobileFooterShown && showFilterModal && (
        <SearchFilterModal
          onClose={toggleFilterModal}
          filters={defaultFilters}
          isLoading={isLandingToursLoading}
        />
      )}
    </Container>
  );
};

export default SearchContainer;
