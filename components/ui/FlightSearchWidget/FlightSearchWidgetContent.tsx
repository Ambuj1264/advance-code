import React, { SyntheticEvent, useState, useCallback } from "react";
import styled from "@emotion/styled";

import FlightFareCategoryContainer from "./FlightFareCategoryContainer";
import FlightLocationPicker from "./FlightLocationPicker";
import FlightSearchPassengers from "./FlightSearchPassengers";
import FlightTypeContainer from "./FlightTypeContainer";

import { gutters } from "styles/variables";
import {
  DesktopColumn,
  TabContent,
  SearchWidgetButtonStyled,
} from "components/ui/SearchWidget/SearchWidgetShared";
import Label from "components/ui/SearchWidget/Label";
import MultiDateRangeDropdown from "components/ui/DatePicker/MultiDateRangeDropdown";
import { mqMax } from "styles/base";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  ${mqMax.large} {
    display: none;
  }
`;

const FlightBottomContent = styled.div`
  position: absolute;
  bottom: 4px;
  left: ${gutters.large}px;
  display: flex;
  min-width: 250px;
`;

const FlightTypeWrapper = styled.div`
  flex-basis: 50%;
`;

const FlightSearchWidgetContent = ({
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
  passengers,
  onNumberOfPassengersChange,
  cabinType,
  onCabinTypeChange,
  onClearDates,
  origin,
  destination,
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
  const browserDate = new Date();
  const initialDepartureMonth =
    selectedDepartureDates.from || selectedDepartureDates.to || browserDate;
  return (
    <Wrapper>
      <TabContent>
        <DesktopColumn baseWidth={38}>
          <Label>
            <Trans ns={Namespaces.flightSearchNs}>Select flights</Trans>
          </Label>
          <FlightLocationPicker
            isMobile={isMobile}
            onOriginLocationChange={onOriginLocationChange}
            onDestinationLocationChange={onDestinationLocationChange}
            defaultOrigin={defaultOrigin}
            defaultDestination={defaultDestination}
            id="flightLocationPickerLarge"
            origin={origin}
            destination={destination}
          />
        </DesktopColumn>
        <DesktopColumn baseWidth={38}>
          <Label>
            <Trans ns={Namespaces.flightSearchNs}>Select travel dates</Trans>
          </Label>
          <MultiDateRangeDropdown
            id="flight-search-departure-dates-large-large"
            selectedDates={selectedDepartureDates}
            onDateSelection={onDepartureDateSelection}
            numberOfMonths={isMobile ? 1 : 2}
            dates={{ unavailableDates: [], min: browserDate }}
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
            color="action"
          />
        </DesktopColumn>
        <DesktopColumn baseWidth={9}>
          <Label>
            <Trans ns={Namespaces.flightSearchNs}>Passengers</Trans>
          </Label>
          <FlightSearchPassengers
            id="flightSearchPassengersLarge"
            passengers={passengers}
            onNumberOfPassengersChange={onNumberOfPassengersChange}
          />
        </DesktopColumn>
        <DesktopColumn baseWidth={15}>
          <SearchWidgetButtonStyled
            onSearchClick={onSearchClick}
            tooltipErrorMessage={errorMessage}
          />
        </DesktopColumn>
      </TabContent>
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
    </Wrapper>
  );
};

export default FlightSearchWidgetContent;
