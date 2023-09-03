import React from "react";
import { useQuery } from "@apollo/react-hooks";

import getPriceRangeSetting from "../queries/PriceRangeSettingQuery.graphql";

import SelectedFiltersContainer from "components/ui/Filters/SelectedFiltersContainer";
import TravelerIcon from "components/icons/traveler.svg";
import LocationIcon from "components/icons/gps.svg";
import RatingsIcon from "components/icons/review-score.svg";
import DurationFilterSection from "components/ui/Filters/DurationFilterSection";
import FilterSection from "components/ui/Filters/FilterSection";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam, FilterType, Marketplace } from "types/enums";
import RangePriceFilterSection from "components/ui/Filters/RangePriceFilterSection";
import PriceIcon from "components/icons/cash-payment-coin.svg";
import ButtonFilterSection from "components/ui/Filters/ButtonFilterSection";
import TimeIcon from "components/icons/weather-sun.svg";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useSettings } from "contexts/SettingsContext";

const SearchWidgetDesktopContainer = ({
  filters,
  selectedFilters,
  isLoading,
}: {
  filters?: SearchPageTypes.Filters;
  selectedFilters?: SelectedFilter[];
  isLoading?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { data: priceRangeSetting } =
    useQuery<SearchPageTypes.SearchPriceRangeSettings>(getPriceRangeSetting);
  const priceRangeEnabled = priceRangeSetting?.settings?.isPriceRangeEnabled ?? false;
  if (!filters) return null;
  return (
    <div data-testid="searchFiltersDesktopContainer">
      <SelectedFiltersContainer filters={selectedFilters} />
      {filters.durations && (
        <DurationFilterSection filters={filters.durations} resetPageOnFilterSelection />
      )}
      {filters.price && (
        <RangePriceFilterSection
          {...filters.price}
          title={t("Price")}
          Icon={PriceIcon}
          isLoading={isLoading}
          sectionId={FilterQueryParam.PRICE}
          priceRangeEnabled={priceRangeEnabled}
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
    </div>
  );
};

export default SearchWidgetDesktopContainer;
