import React from "react";

import CarSearchWidgetMobile from "./CarSearchWidgetMobile";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const CarSearchFilterList = CustomNextDynamic(() => import("./CarSearchFilterList"), {
  ssr: false,
  loading: () => null,
});

const CarSearchWidgetDesktop = CustomNextDynamic(
  () => import("./CarSearchWidgetDesktopContainer"),
  {
    ssr: false,
    loading: () => null,
  }
);

const CarSearchWidgetContainer = ({
  isMobileFooterShown,
  isSearchResults,
  filters,
  loading,
  showMobileActionButtonLoadingIndicator = false,
  totalCars,
  isFilterModalOpen,
  toggleFilterModal,
  selectedFilters,
}: {
  isMobileFooterShown: boolean;
  isSearchResults: boolean;
  totalCars: number;
  filters: FilterSectionListType;
  loading: boolean;
  showMobileActionButtonLoadingIndicator?: boolean;
  selectedFilters: SelectedFilter[];

  isFilterModalOpen: boolean;
  toggleFilterModal: (isOpen: boolean) => void;
}) => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <>
          <CarSearchWidgetDesktop />
          <CarSearchFilterList
            filters={filters}
            loading={loading}
            selectedFilters={selectedFilters}
          />
        </>
      )}
      <CarSearchWidgetMobile
        isMobileFooterShown={isMobileFooterShown}
        isSearchResults={isSearchResults}
        filters={filters}
        loading={loading}
        showMobileActionButtonLoadingIndicator={showMobileActionButtonLoadingIndicator}
        totalCars={totalCars}
        isFilterModalOpen={isFilterModalOpen}
        toggleFilterModal={toggleFilterModal}
        selectedFilters={selectedFilters}
      />
    </>
  );
};

export default CarSearchWidgetContainer;
