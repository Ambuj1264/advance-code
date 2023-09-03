import React, { useMemo } from "react";

import { constructAccommodationFilters } from "./utils/accommodationSearchFilterUtils";
import AccommodationSearchWidgetMobileContainer from "./AccommodationSearchWidgetMobileContainer";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const AccommodationSearchWidgetForm = CustomNextDynamic(
  () => import("./AccommodationSearchWidget"),
  {
    ssr: false,
    loading: () => null,
  }
);

const AccommodationSearchFilterList = CustomNextDynamic(
  () => import("./AccommodationSearchFilterList"),
  {
    ssr: false,
    loading: () => null,
  }
);

const AccommodationSearchWidgetContainer = ({
  isMobileFooterShown,
  showFilters,
  totalAccommodations,
  isLoading,
  filters,
  accommodationCategoryName,
  defaultFilters,
  selectedFilters,
  withCurrencyConversion = true,
}: {
  isMobileFooterShown: boolean;
  showFilters: boolean;
  totalAccommodations?: number;
  isLoading: boolean;
  filters: FilterSectionListType;
  accommodationCategoryName?: string;
  defaultFilters: AccommodationSearchTypes.AccommodationFilter[];
  selectedFilters: SelectedFilter[];
  withCurrencyConversion?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.accommodationSearchNs);
  const isMobile = useIsMobile();

  const defaultFiltersSections = useMemo(
    () => constructAccommodationFilters(defaultFilters, [], t, {}, accommodationCategoryName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {!isMobile && (
        <>
          <AccommodationSearchWidgetForm />
          {showFilters && (
            <AccommodationSearchFilterList
              filters={filters}
              loading={isLoading && defaultFiltersSections.length === 0}
              defaultFiltersSections={defaultFiltersSections}
              selectedFilters={selectedFilters}
              withCurrencyConversion={withCurrencyConversion}
            />
          )}
        </>
      )}
      <AccommodationSearchWidgetMobileContainer
        isMobileFooterShown={isMobileFooterShown}
        showFilters={showFilters}
        totalAccommodations={totalAccommodations}
        isLoading={isLoading}
        areFiltersLoading={filters.length === 0}
        filters={filters}
        accommodationCategoryName={accommodationCategoryName}
        defaultFilters={defaultFilters}
        selectedFilters={selectedFilters}
        withCurrencyConversion={withCurrencyConversion}
      />
    </>
  );
};

export default AccommodationSearchWidgetContainer;
