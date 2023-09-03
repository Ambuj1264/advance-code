import React from "react";

import FilterSection from "components/ui/Filters/FilterSection";
import FilterModal from "components/ui/Filters/FilterModal";
import TravelerIcon from "components/icons/traveler.svg";
import LocationIcon from "components/icons/gps.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam, FilterType, BestPlacesPage } from "types/enums";

const BestPlacesFilterModal = ({
  onClose,
  filters,
  totalPlaces,
  isLoading,
  activeTab,
}: {
  onClose: () => void;
  filters: BestPlacesTypes.Filters;
  totalPlaces?: number;
  isLoading: boolean;
  activeTab?: BestPlacesPage;
}) => {
  const { t: bestPlacesT } = useTranslation(Namespaces.bestPlacesNs);

  return (
    <FilterModal onClose={onClose} totalResults={totalPlaces} isLoading={isLoading}>
      <FilterSection
        filters={filters.destinations}
        title={bestPlacesT("Destinations")}
        Icon={TravelerIcon}
        sectionId={FilterQueryParam.DESTINATION_ID}
        resetPageOnFilterSelection
        filterType={FilterType.RADIO}
        canSearchInsideFilters
      />
      {activeTab === BestPlacesPage.ATTRACTIONS && (
        <FilterSection
          filters={filters.attractions}
          Icon={LocationIcon}
          title={bestPlacesT("Type of attraction")}
          sectionId={FilterQueryParam.ATTRACTION_IDS}
          resetPageOnFilterSelection
          filterType={FilterType.CHECKBOX}
          canSearchInsideFilters
        />
      )}
    </FilterModal>
  );
};

export default BestPlacesFilterModal;
