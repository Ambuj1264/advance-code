import React, { useContext, useCallback } from "react";

import FlightSearchPageCallbackContext from "../contexts/FlightSearchPageCallbackContext";
import useFlightSearchQueryParams from "../utils/useFlightSearchQueryParams";

import { StepsEnum } from "./enums";

import SearchAndFilterMobileFooter from "components/ui/SearchWidget/SearchAndFilterMobileFooter";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import TextDateRange from "components/ui/Filters/TextDateRange";

const FlightSearchMobileFooter = ({
  onFilterButtonClick,
  isSearchResults,
  numberOfSelectedFilters,
}: {
  onFilterButtonClick: () => void;
  isSearchResults: boolean;
  numberOfSelectedFilters?: number;
}) => {
  const { onSetSearchWidgetStep } = useContext(FlightSearchPageCallbackContext);
  const openLocationStep = useCallback(() => {
    onSetSearchWidgetStep(StepsEnum.Details);
  }, [onSetSearchWidgetStep]);

  const [{ dateFrom, returnDateFrom, returnDateTo }] = useFlightSearchQueryParams();
  return (
    <SearchAndFilterMobileFooter
      onLeftButtonClick={openLocationStep}
      onFilterButtonClick={onFilterButtonClick}
      isSearchResults={isSearchResults}
      numberOfSelectedFilters={numberOfSelectedFilters}
      leftButtonLabel={
        <TextDateRange dateFrom={dateFrom} dateTo={returnDateTo || returnDateFrom}>
          <Trans ns={Namespaces.commonNs}>Search</Trans>
        </TextDateRange>
      }
    />
  );
};

export default FlightSearchMobileFooter;
