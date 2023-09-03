import React, { useMemo } from "react";

import useFlightSearchQueryParams, {
  FlightSearchQueryParam,
} from "../utils/useFlightSearchQueryParams";
import { getStopsFilterList, getFlightSelectedFilters } from "../utils/flightSearchUtils";

import RangePriceFilterSection from "components/ui/Filters/RangePriceFilterSection";
import RangeTimeFilterSection from "components/ui/Filters/RangeTimeFilterSection";
import UserClockIcon from "components/icons/user-clock.svg";
import DurationLongIcon from "components/icons/duration-long.svg";
import PriceIcon from "components/icons/cash-payment-coin.svg";
import MaxStopsIcon from "components/icons/single-man-actions-flight.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import LoadingFilterList from "components/ui/Loading/LoadingFilterList";
import { FilterType } from "types/enums";
import FilterSection from "components/ui/Filters/FilterSection";
import SelectedFiltersContainer from "components/ui/Filters/SelectedFiltersContainer";
import { useCurrencyWithDefault } from "hooks/useCurrency";

const FlightSearchFilters = ({
  priceFilters,
  durationFilters,
  stopoverFilters,
  areFiltersLoading,
  noAvailableStopover,
}: {
  priceFilters?: SearchPageTypes.RangeFilters;
  durationFilters?: SearchPageTypes.RangeFilters;
  stopoverFilters?: SearchPageTypes.RangeFilters;
  areFiltersLoading?: boolean;
  noAvailableStopover: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const [{ price, duration, stopover }] = useFlightSearchQueryParams();
  const stopsFilterList = getStopsFilterList(t);
  const selectedFilters = useMemo(
    () => getFlightSelectedFilters(currencyCode, convertCurrency, price, duration, stopover),
    [currencyCode, price, duration, stopover]
  );
  if (areFiltersLoading) return <LoadingFilterList />;
  return (
    <>
      <SelectedFiltersContainer filters={selectedFilters} data-testid="filter-section" />
      <FilterSection
        sectionId={FlightSearchQueryParam.MAX_STOPS}
        filters={stopsFilterList}
        Icon={MaxStopsIcon}
        title={t("Stops")}
        filterType={FilterType.RADIO}
        resetPageOnFilterSelection
      />
      {priceFilters && (
        <RangePriceFilterSection
          {...priceFilters}
          title={t("Price")}
          Icon={PriceIcon}
          sectionId={FlightSearchQueryParam.PRICE}
        />
      )}
      {durationFilters && (
        <RangeTimeFilterSection
          {...durationFilters}
          title={t("Max travel time")}
          Icon={DurationLongIcon}
          sectionId={FlightSearchQueryParam.DURATION}
        />
      )}
      {stopoverFilters && (
        <RangeTimeFilterSection
          {...stopoverFilters}
          title={t("Layover")}
          Icon={UserClockIcon}
          sectionId={FlightSearchQueryParam.STOPOVER}
          disabled={noAvailableStopover}
        />
      )}
    </>
  );
};

export default FlightSearchFilters;
