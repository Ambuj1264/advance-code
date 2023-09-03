import React, { useContext, useCallback } from "react";
import styled from "@emotion/styled";

import FlightSearchPageStateContext from "../contexts/FlightSearchPageStateContext";
import FlightSearchPageCallbackContext from "../contexts/FlightSearchPageCallbackContext";
import FlightSearchPageConstantContext from "../contexts/FlightSearchPageConstantContext";

import FlightSearchWidgetMobile from "./FlightSearchWidgetMobile";
import FlightSearchWidgetLarge from "./FlightSearchWidgetLarge";
import FlightSearchWidgetSmall from "./FlightSearchWidgetSmall";
import FlightSearchFilters from "./FlightSearchFilters";
import FlightSearchFilterModal from "./FlightSearchFilterModal";
import { StepsEnum } from "./enums";

import { useTranslation } from "i18n";
import CustomNextDynamic from "lib/CustomNextDynamic";
import useToggle from "hooks/useToggle";
import { Namespaces } from "shared/namespaces";
import { mqMax } from "styles/base";

const FlightSearchMobileFooter = CustomNextDynamic(() => import("./FlightSearchMobileFooter"), {
  ssr: false,
  loading: () => null,
});

export const DesktopContentWrapper = styled.div`
  ${mqMax.large} {
    display: none;
  }
`;

const FlightSearchWidget = ({
  hasFilters,
  loading,
  priceFilters,
  durationFilters,
  stopoverFilters,
  areFiltersLoading,
  totalResults = 0,
  showLargeWidget,
  isMobile = false,
  noAvailableStopover = false,
}: {
  hasFilters: boolean;
  loading: boolean;
  priceFilters?: SearchPageTypes.RangeFilters;
  durationFilters?: SearchPageTypes.RangeFilters;
  stopoverFilters?: SearchPageTypes.RangeFilters;
  areFiltersLoading?: boolean;
  totalResults?: number;
  showLargeWidget?: boolean;
  isMobile?: boolean;
  noAvailableStopover?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const [isFilterModalOpen, , openFlightFiltersModal, closeFlightFiltersModal] = useToggle();
  const {
    selectedDepartureDates,
    selectedReturnDates,
    isSearchWidgetOpen,
    searchWidgetStep,
    destinationName,
    originName,
    flightType,
  } = useContext(FlightSearchPageStateContext);
  const { onSearchClick, closeModal, onSetSearchWidgetStep } = useContext(
    FlightSearchPageCallbackContext
  );
  const { rangeAsDefault } = useContext(FlightSearchPageConstantContext);
  const isOneway = flightType === "oneway";
  const isFinalStep = searchWidgetStep === StepsEnum.Dates;
  const onPreviousClick = useCallback(() => {
    onSetSearchWidgetStep(searchWidgetStep - 1);
  }, [onSetSearchWidgetStep, searchWidgetStep]);
  const onFooterButtonClick = useCallback(
    e => {
      if (isFinalStep) {
        onSearchClick(e);
        closeModal();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        onSetSearchWidgetStep(searchWidgetStep + 1);
      }
    },
    [closeModal, isFinalStep, onSearchClick, onSetSearchWidgetStep, searchWidgetStep]
  );

  const errorMessage =
    !selectedDepartureDates.from ||
    (!selectedReturnDates.from && !isOneway) ||
    !destinationName ||
    !originName
      ? commonSearchT("Please fill in your search information")
      : undefined;

  return (
    <>
      <DesktopContentWrapper>
        <FlightSearchWidgetSmall
          isMobile={isMobile}
          onSearchClick={onSearchClick}
          errorMessage={errorMessage}
          onOriginLocationClick={
            isMobile ? () => onSetSearchWidgetStep(StepsEnum.Details) : undefined
          }
          onDestinationLocationClick={
            isMobile ? () => onSetSearchWidgetStep(StepsEnum.Details) : undefined
          }
          onDatesClick={isMobile ? () => onSetSearchWidgetStep(StepsEnum.Dates) : undefined}
          onPassengersClick={isMobile ? () => onSetSearchWidgetStep(StepsEnum.Details) : undefined}
          rangeAsDefault={rangeAsDefault}
        />
        {!isMobile && (
          <FlightSearchFilters
            priceFilters={priceFilters}
            durationFilters={durationFilters}
            stopoverFilters={stopoverFilters}
            areFiltersLoading={areFiltersLoading}
            noAvailableStopover={noAvailableStopover}
          />
        )}
      </DesktopContentWrapper>

      {showLargeWidget && (
        <FlightSearchWidgetLarge onSearchClick={onSearchClick} errorMessage={errorMessage} />
      )}
      {isSearchWidgetOpen && isMobile && (
        <FlightSearchWidgetMobile
          onPreviousClick={onPreviousClick}
          onModalClose={closeModal}
          searchWidgetView={searchWidgetStep}
          onFooterButtonClick={onFooterButtonClick}
          errorMessage={errorMessage}
        />
      )}
      {isFilterModalOpen && (
        <FlightSearchFilterModal
          closeFilterModal={closeFlightFiltersModal}
          priceFilters={priceFilters}
          durationFilters={durationFilters}
          stopoverFilters={stopoverFilters}
          isLoading={loading}
          totalResults={totalResults}
          areFiltersLoading={areFiltersLoading}
          noAvailableStopover={noAvailableStopover}
        />
      )}

      {hasFilters && (
        <FlightSearchMobileFooter
          onFilterButtonClick={openFlightFiltersModal}
          isSearchResults={hasFilters}
        />
      )}
    </>
  );
};

export default FlightSearchWidget;
