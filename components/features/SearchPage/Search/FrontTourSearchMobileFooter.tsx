import React from "react";

import { constructTourFilterSections } from "../utils/searchUtils";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { useNumberOfSelectedFilters } from "components/ui/Filters/utils/filtersUtils";
import { useOnTripsClick } from "components/ui/FrontSearchWidget/frontHooks";

const SearchAndFilterMobileFooter = CustomNextDynamic(
  () => import("components/ui/SearchWidget/SearchAndFilterMobileFooter"),
  {
    ssr: false,
    loading: () => null,
  }
);

const FrontTourSearchMobileFooter = ({ toggleFilterModal }: { toggleFilterModal: () => void }) => {
  const onClick = useOnTripsClick();
  const numberOfSelectedFilters = useNumberOfSelectedFilters(constructTourFilterSections());
  return (
    <SearchAndFilterMobileFooter
      onFilterButtonClick={toggleFilterModal}
      numberOfSelectedFilters={numberOfSelectedFilters}
      onLeftButtonClick={onClick}
    />
  );
};

export default FrontTourSearchMobileFooter;
