import React from "react";

import SelectedFiltersContainer from "components/ui/Filters/SelectedFiltersContainer";
import DurationFilterSection from "components/ui/Filters/DurationFilterSection";
import FilterSection from "components/ui/Filters/FilterSection";
import FilterModal from "components/ui/Filters/FilterModal";
import TravelerIcon from "components/icons/traveler.svg";
import LocationIcon from "components/icons/gps.svg";
import RatingsIcon from "components/icons/review-score.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam, FilterType, Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import RangePriceFilterSection from "components/ui/Filters/RangePriceFilterSection";
import TimeIcon from "components/icons/weather-sun.svg";
import ButtonFilterSection from "components/ui/Filters/ButtonFilterSection";
import PriceIcon from "components/icons/cash-payment-coin.svg";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";

const SearchFilterModal = ({
  onClose,
  filters,
  totalTours,
  isLoading,
  selectedFilters,
}: {
  onClose: () => void;
  filters?: SearchPageTypes.Filters;
  totalTours?: number;
  isLoading: boolean;
  selectedFilters?: SelectedFilter[];
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  if (!filters) return null;
  return (
    <FilterModal onClose={onClose} totalResults={totalTours} isLoading={isLoading}>
      <SelectedFiltersContainer filters={selectedFilters} />
      {filters.durations && (
        <DurationFilterSection
          filters={filters.durations}
          resetPageOnFilterSelection
          useSingleSelection={isGTE}
        />
      )}
      {filters.price && (
        <RangePriceFilterSection
          {...filters.price}
          title={t("Price")}
          Icon={PriceIcon}
          sectionId={FilterQueryParam.PRICE}
        />
      )}
      {filters.attractions && (
        <FilterSection
          filters={filters.attractions}
          Icon={LocationIcon}
          title={isGTE ? t("Attractions") : t("Destinations")}
          sectionId={FilterQueryParam.ATTRACTION_IDS}
          resetPageOnFilterSelection
          filterType={FilterType.CHECKBOX}
          canSearchInsideFilters
        />
      )}
      {filters.activities && (
        <FilterSection
          filters={filters.activities}
          title={t("Activities")}
          Icon={TravelerIcon}
          sectionId={FilterQueryParam.ACTIVITY_IDS}
          resetPageOnFilterSelection
          filterType={FilterType.CHECKBOX}
          canSearchInsideFilters
        />
      )}
      {filters.time && (
        <ButtonFilterSection
          title={t("Time of day")}
          Icon={TimeIcon}
          filters={filters.time}
          sectionId={FilterQueryParam.TIME}
          resetPageOnFilterSelection
          useSingleSelection
        />
      )}
      {filters.reviews && (
        <FilterSection
          filters={filters.reviews}
          Icon={RatingsIcon}
          title={t("Review score")}
          sectionId={FilterQueryParam.REVIEW_SCORE}
          resetPageOnFilterSelection
          filterType={FilterType.CHECKBOX}
        />
      )}
    </FilterModal>
  );
};

export default SearchFilterModal;
