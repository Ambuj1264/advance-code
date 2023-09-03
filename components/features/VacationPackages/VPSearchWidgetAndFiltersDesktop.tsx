import React from "react";

import {
  StateContext,
  VPSearchWidgetProvider,
} from "../VacationPackagesSearchWidget/context/VPSearchWidgetContext";

import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import CustomNextDynamic from "lib/CustomNextDynamic";
import LoadingFilterList from "components/ui/Loading/LoadingFilterList";

const VacationPackageSearchWidget = CustomNextDynamic(
  () => import("../VacationPackagesSearchWidget/VacationPackageSearchWidget"),
  {
    ssr: false,
    loading: () => null,
  }
);

const VPSearchFilters = CustomNextDynamic(() => import("./VPSearchFilters"), {
  ssr: false,
  loading: () => <LoadingFilterList />,
});

const VPSearchWidgetAndFiltersDesktop = ({
  vpSearchWidgetInitialState,
  activeFilters,
  selectedFilters,
}: {
  vpSearchWidgetInitialState: Partial<StateContext>;
  activeFilters: FilterSectionListType;
  selectedFilters: SelectedFilter[];
}) => {
  const isTablet = useIsTablet();

  if (!isTablet) return null;

  return (
    <>
      <VPSearchWidgetProvider {...vpSearchWidgetInitialState}>
        <VacationPackageSearchWidget trackQueryParamsChange />
      </VPSearchWidgetProvider>
      <VPSearchFilters filters={activeFilters!} selectedFilters={selectedFilters} />
    </>
  );
};

export default VPSearchWidgetAndFiltersDesktop;
