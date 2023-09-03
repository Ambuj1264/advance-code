import React from "react";

import VPSearchFilters from "../VacationPackages/VPSearchFilters";

import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import FilterModal from "components/ui/Filters/FilterModal";
import useToggle from "hooks/useToggle";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import { MobileFooterFilterButton } from "components/ui/Filters/MobileFooterButton";
import MobileStickyFooter from "components/ui/StickyFooter/MobileStickyFooter";

const TGFilterMobileFooter = ({
  filters,
  loading = false,
  selectedFilters,
  totalResults,
}: {
  filters?: FilterSectionListType | undefined;
  loading?: boolean;
  selectedFilters: SelectedFilter[];
  totalResults: number;
}) => {
  const [showFilterModal, toggleFilterModal] = useToggle(false);
  const isTablet = useIsTablet();

  if (!isTablet)
    return (
      <>
        {showFilterModal && (
          <FilterModal onClose={toggleFilterModal} totalResults={totalResults} isLoading={loading}>
            <VPSearchFilters filters={filters} selectedFilters={selectedFilters} />
          </FilterModal>
        )}
        <MobileStickyFooter
          fullWidthContent={<MobileFooterFilterButton onClick={toggleFilterModal} />}
        />
      </>
    );

  return null;
};

export default TGFilterMobileFooter;
