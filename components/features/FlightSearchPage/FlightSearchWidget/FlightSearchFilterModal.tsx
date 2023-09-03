import React from "react";

import FlightSearchFilters from "./FlightSearchFilters";

import FilterModal from "components/ui/Filters/FilterModal";

const FlightSearchFilterModal = ({
  priceFilters,
  durationFilters,
  stopoverFilters,
  isLoading,
  totalResults,
  areFiltersLoading,
  noAvailableStopover,
  closeFilterModal,
}: {
  priceFilters?: SearchPageTypes.RangeFilters;
  durationFilters?: SearchPageTypes.RangeFilters;
  stopoverFilters?: SearchPageTypes.RangeFilters;
  isLoading: boolean;
  totalResults: number;
  closeFilterModal: () => void;
  areFiltersLoading?: boolean;
  noAvailableStopover: boolean;
}) => {
  return (
    <FilterModal onClose={closeFilterModal} isLoading={isLoading} totalResults={totalResults}>
      <FlightSearchFilters
        priceFilters={priceFilters}
        durationFilters={durationFilters}
        stopoverFilters={stopoverFilters}
        areFiltersLoading={areFiltersLoading}
        noAvailableStopover={noAvailableStopover}
      />
    </FilterModal>
  );
};

export default FlightSearchFilterModal;
