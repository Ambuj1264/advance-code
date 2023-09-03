import React, { useCallback } from "react";
import parse from "date-fns/parse";
import { useTranslation } from "react-i18next";

import { decodeOccupanciesArray } from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

import { useVPSearchActiveServices } from "./hooks/useVPActiveServices";
import { VacationSearchQueryParamsType } from "./utils/useVacationSearchQueryParams";

import { Namespaces } from "shared/namespaces";
import CustomNextDynamic from "lib/CustomNextDynamic";
import FilterModal from "components/ui/Filters/FilterModal";
import FrontVacationsMobileSteps from "components/ui/FrontSearchWidget/VacationPackages/FrontVacationsMobileSteps";
import LoadingFilterList from "components/ui/Loading/LoadingFilterList";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { FrontSearchStateContextProvider } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useOnSearchClick } from "components/ui/FrontSearchWidget/frontHooks";
import useToggle from "hooks/useToggle";
import { yearMonthDayFormat } from "utils/dateUtils";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import SearchAndFilterMobileFooter from "components/ui/SearchWidget/SearchAndFilterMobileFooter";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";
import { FilterQueryParam } from "types/enums";

const VPSearchFilters = CustomNextDynamic(() => import("./VPSearchFilters"), {
  ssr: false,
  loading: () => <LoadingFilterList />,
});

const VPSearchMobileFooterContent = ({
  activeFilters,
  totalVacationPackages,
  loading,
  selectedFilters,
}: {
  activeFilters?: FilterSectionListType;
  totalVacationPackages?: number;
  loading: boolean;
  selectedFilters: SelectedFilter[];
}) => {
  const [showFilterModal, toggleFilterModal] = useToggle(false);
  const [showSearchModal, toggleSearchModal] = useToggle(false);
  const { activeServices } = useVPSearchActiveServices();
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);

  const onSearchClick = useOnSearchClick(activeServices, false);
  const onSearchButtonClick = useCallback(
    e => {
      onSearchClick(e);
      toggleSearchModal();
    },
    [toggleSearchModal, onSearchClick]
  );
  return (
    <>
      {showFilterModal && (
        <FilterModal
          onClose={toggleFilterModal}
          totalResults={totalVacationPackages}
          isLoading={loading}
        >
          <VPSearchFilters filters={activeFilters!} selectedFilters={selectedFilters} />
        </FilterModal>
      )}

      {showSearchModal && (
        <FrontVacationsMobileSteps
          onModalClose={toggleSearchModal}
          onSearchClick={onSearchButtonClick}
          isSearchResults
        />
      )}

      <SearchAndFilterMobileFooter
        leftButtonLabel={
          <TextDateRangeFromQuery from={FilterQueryParam.DATE_FROM} to={FilterQueryParam.DATE_TO}>
            {vacationT("Travel details")}
          </TextDateRangeFromQuery>
        }
        onFilterButtonClick={toggleFilterModal}
        onLeftButtonClick={toggleSearchModal}
      />
    </>
  );
};

const VPSearchMobileFooter = ({
  activeFilters,
  totalVacationPackages,
  queryParams,
  loading = true,
  selectedFilters,
}: {
  queryParams: VacationSearchQueryParamsType;
  activeFilters?: FilterSectionListType;
  totalVacationPackages?: number;
  loading?: boolean;
  selectedFilters: SelectedFilter[];
}) => {
  const isTablet = useIsTablet();

  // this hack is needed to re-render the Provider with new props
  // in order to sync it when you switch from the
  // tablet to mobile resolution.
  if (isTablet) return null;

  return (
    <FrontSearchStateContextProvider
      activeSearchTab={SearchTabsEnum.VacationPackages}
      vacationDestinationId={queryParams.destinationId}
      vacationDestinationName={queryParams.destinationName}
      vacationOriginId={queryParams.originId}
      vacationOriginName={queryParams.originName}
      vacationIncludesFlight={queryParams.includeFlights}
      vacationOriginCountryId={queryParams.originCountryId}
      occupancies={decodeOccupanciesArray(queryParams.occupancies)}
      vacationDates={{
        ...(queryParams.dateFrom && queryParams.dateTo
          ? {
              from: parse(queryParams.dateFrom ?? "", yearMonthDayFormat, new Date()),
              to: parse(queryParams.dateTo ?? "", yearMonthDayFormat, new Date()),
            }
          : {}),
      }}
    >
      <VPSearchMobileFooterContent
        activeFilters={activeFilters}
        totalVacationPackages={totalVacationPackages}
        loading={loading}
        selectedFilters={selectedFilters}
      />
    </FrontSearchStateContextProvider>
  );
};

export default VPSearchMobileFooter;
