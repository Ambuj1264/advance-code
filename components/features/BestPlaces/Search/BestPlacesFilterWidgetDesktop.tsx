import React from "react";

import DestinationIcon from "components/icons/pin-location-1.svg";
import AttractionIcon from "components/icons/landmark-mountain.svg";
import FilterSection from "components/ui/Filters/FilterSection";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam, FilterType, BestPlacesPage } from "types/enums";

const BestPlacesFilterWidgetDesktop = ({
  filters,
  onShowLessFiltersClick,
  activeTab,
}: {
  filters: BestPlacesTypes.Filters;
  onShowLessFiltersClick?: () => void;
  activeTab?: BestPlacesPage;
}) => {
  const { t } = useTranslation(Namespaces.bestPlacesNs);
  return (
    <>
      <FilterSection
        filters={filters.destinations}
        title={t("Destinations")}
        Icon={DestinationIcon}
        sectionId={FilterQueryParam.DESTINATION_ID}
        resetPageOnFilterSelection
        filterType={FilterType.RADIO}
        onShowLessClick={onShowLessFiltersClick}
        canSearchInsideFilters
      />
      {activeTab === BestPlacesPage.ATTRACTIONS && (
        <FilterSection
          filters={filters.attractions}
          Icon={AttractionIcon}
          title={t("Type of attraction")}
          sectionId={FilterQueryParam.ATTRACTION_IDS}
          resetPageOnFilterSelection
          filterType={FilterType.CHECKBOX}
          onShowLessClick={onShowLessFiltersClick}
          canSearchInsideFilters
        />
      )}
    </>
  );
};

export default BestPlacesFilterWidgetDesktop;
