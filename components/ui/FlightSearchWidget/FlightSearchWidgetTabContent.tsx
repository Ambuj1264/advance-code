import React, { SyntheticEvent, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ToggleButton, { ToggleButtonOption } from "../Inputs/ToggleButton";
import MediaQuery from "../MediaQuery";
import Column from "../Grid/Column";
import Row from "../Grid/Row";
import { useToggleCalendarClientSideState } from "../FrontSearchWidget/frontHooks";

import FlightFareCategoryContainer from "./FlightFareCategoryContainer";
import FlightLocationPicker from "./FlightLocationPicker";
import FlightSearchPassengers from "./FlightSearchPassengers";
import FlightTypeContainer from "./FlightTypeContainer";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import { gutters } from "styles/variables";
import {
  DesktopColumn,
  TabContent,
  SearchWidgetButtonStyled,
} from "components/ui/SearchWidget/SearchWidgetShared";
import Label from "components/ui/SearchWidget/Label";
import MultiDateRangeDropdown from "components/ui/DatePicker/MultiDateRangeDropdown";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { DisplayType } from "types/enums";
import { typographyCaption } from "styles/typography";

export const FlightBottomContent = styled.div`
  position: absolute;
  bottom: 4px;
  left: ${gutters.large}px;
  display: flex;
  min-width: 250px;
`;

const FlightTypeWrapper = styled.div`
  flex-basis: 50%;
`;

const FlightFareCategoryContainerStyled = styled(FlightFareCategoryContainer)(() =>
  css(`
  width: auto;
`)
);

const ToggleButtonStyled = styled(ToggleButton)(() =>
  css(`
  justify-content: flex-end;
  ${ToggleButtonOption} {
   ${typographyCaption.styles}
  }
`)
);

const FlightSearchWidgetTab = ({
  isMobile,
  onSearchClick,
  errorMessage,
  selectedDepartureDates,
  selectedReturnDates,
  flightType,
  defaultOrigin,
  defaultDestination,
  onDepartureDateSelection,
  onReturnDateSelection,
  onOriginLocationChange,
  onDestinationLocationChange,
  onFlightTypeChange,
  onPassengersClick,
  passengers,
  onNumberOfPassengersChange,
  cabinType,
  onCabinTypeChange,
  onClearDates,
  origin,
  destination,
  destinationId,
  onDatesClick,
  onOriginLocationInputClick,
  onDestinationLocationInputClick,
  useDesktopStyle = true,
}: {
  isMobile: boolean;
  onSearchClick: (e: SyntheticEvent) => void;
  errorMessage?: string;
  selectedDepartureDates: SharedTypes.SelectedDates;
  selectedReturnDates: SharedTypes.SelectedDates;
  flightType: FlightSearchTypes.FlightType;
  defaultOrigin?: string;
  defaultDestination?: string;
  onDepartureDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onReturnDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onOriginLocationChange: (id?: string, name?: string) => void;
  onDestinationLocationChange: (id?: string, name?: string) => void;
  onFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  onPassengersClick: () => void;
  onDatesClick: () => void;
  onOriginLocationInputClick: () => void;
  onDestinationLocationInputClick: () => void;
  passengers: FlightSearchTypes.Passengers;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  cabinType: FlightSearchTypes.CabinType;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  onClearDates?: () => void;
  origin?: string;
  destination?: string;
  destinationId?: string;
  useDesktopStyle?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const [isReturnActive, setReturnActive] = useState(false);
  const isOneway = flightType === "oneway";
  const onSetReturnActive = useCallback(
    (returnActive: boolean) => {
      if (isOneway && returnActive === true) {
        onFlightTypeChange("round" as FlightSearchTypes.FlightType);
      }
      setReturnActive(returnActive);
    },
    [setReturnActive, isOneway, onFlightTypeChange]
  );

  const onToggleFlight = useCallback(
    (checked: boolean) => {
      setReturnActive(checked);
      onFlightTypeChange(checked ? "round" : "oneway");
    },
    [onFlightTypeChange]
  );

  const browserDate = new Date();
  const dates = getFlightMinMaxDates();
  const initialDepartureMonth =
    selectedDepartureDates.from || selectedDepartureDates.to || browserDate;

  const isAllDatesSet = isOneway
    ? Boolean(selectedDepartureDates.from)
    : Boolean(selectedDepartureDates.from && selectedReturnDates.from);

  const isAllLocationsSelected = Boolean(destination && origin);

  const isCalendarOpen = useToggleCalendarClientSideState(
    !isAllDatesSet && isAllLocationsSelected && destinationId !== "europe" && useDesktopStyle
  );
  return (
    <TabContent data-testid="flightsTab" useDesktopStyle={useDesktopStyle}>
      <DesktopColumn baseWidth={38} flexOrderMobile={1} useDesktopStyle={useDesktopStyle}>
        <Label>
          <Trans ns={Namespaces.flightSearchNs}>Select flights</Trans>
        </Label>
        <FlightLocationPicker
          isMobile={isMobile}
          onOriginLocationClick={isMobile ? onOriginLocationInputClick : undefined}
          onDestinationLocationClick={isMobile ? onDestinationLocationInputClick : undefined}
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          defaultOrigin={defaultOrigin}
          defaultDestination={defaultDestination}
          id="flightLocationPickerLarge"
          origin={origin}
          destination={destination}
        />
        <MediaQuery toDisplay={DisplayType.Large}>
          <ToggleButtonStyled
            onValue={t("Return flights")}
            offValue={t("One way")}
            reverse
            checked={!isOneway}
            onChange={onToggleFlight}
            id="flightTypeToggle"
            highlightCheckedOption={false}
          />
        </MediaQuery>
        <MediaQuery fromDisplay={DisplayType.Large}>
          <FlightBottomContent>
            <FlightTypeWrapper>
              <FlightTypeContainer
                id="flightTypeLarge"
                flightType={flightType}
                onFlightTypeChange={onFlightTypeChange}
              />
            </FlightTypeWrapper>
            <FlightFareCategoryContainer
              id="flightFareCategoryLarge"
              noBackground
              cabinType={cabinType}
              onCabinTypeChange={onCabinTypeChange}
            />
          </FlightBottomContent>
        </MediaQuery>
      </DesktopColumn>
      <DesktopColumn
        baseWidth={38}
        flexOrderMobile={3}
        mobileMarginBottom={gutters.small}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.flightSearchNs}>Select travel dates</Trans>
        </Label>
        <MultiDateRangeDropdown
          id="flight-search-departure-dates-large-large"
          selectedDates={selectedDepartureDates}
          onDateSelection={onDepartureDateSelection}
          numberOfMonths={isMobile ? 1 : 2}
          dates={dates}
          disabled={isMobile}
          initialMonth={initialDepartureMonth}
          selectedReturnDates={selectedReturnDates}
          onReturnDateSelection={onReturnDateSelection}
          isReturnActive={isReturnActive}
          setReturnActive={onSetReturnActive}
          fromPlaceholder={t("Departure")}
          toPlaceholder={isOneway ? t("No return") : t("Return")}
          onlyDeparture={isOneway}
          onClear={onClearDates}
          onDateInputClick={isMobile ? onDatesClick : undefined}
          color="action"
          isOpen={isCalendarOpen}
        />
      </DesktopColumn>
      <DesktopColumn
        baseWidth={9}
        flexOrderMobile={2}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <MediaQuery toDisplay={DisplayType.Large}>
          <Row>
            <Column columns={{ small: 2, medium: 2, large: 2 }}>
              <Label>
                <Trans ns={Namespaces.flightSearchNs}>Add travelers</Trans>
              </Label>
              <FlightSearchPassengers
                id="flightSearchPassengersSmall"
                onClick={onPassengersClick}
                passengers={passengers}
                onNumberOfPassengersChange={onNumberOfPassengersChange}
              />
            </Column>
            <Column columns={{ small: 2, medium: 2, large: 2 }}>
              <Label>
                <Trans ns={Namespaces.flightSearchNs}>Choose class</Trans>
              </Label>
              <FlightFareCategoryContainerStyled
                id="flightFareCategorySmall"
                onClick={onPassengersClick}
                cabinType={cabinType}
                onCabinTypeChange={onCabinTypeChange}
              />
            </Column>
          </Row>
        </MediaQuery>
        <MediaQuery fromDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.flightSearchNs}>Passengers</Trans>
          </Label>
          <FlightSearchPassengers
            id="flightSearchPassengersLarge"
            passengers={passengers}
            onNumberOfPassengersChange={onNumberOfPassengersChange}
          />
        </MediaQuery>
      </DesktopColumn>
      <DesktopColumn baseWidth={15} flexOrderMobile={4} useDesktopStyle={useDesktopStyle}>
        <SearchWidgetButtonStyled
          onSearchClick={onSearchClick}
          tooltipErrorMessage={errorMessage}
        />
      </DesktopColumn>
    </TabContent>
  );
};

export default FlightSearchWidgetTab;
