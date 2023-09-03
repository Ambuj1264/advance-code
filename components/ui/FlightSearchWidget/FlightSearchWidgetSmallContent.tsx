import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";

import Row from "../Grid/Row";
import Column from "../Grid/Column";
import { InputStyled, Separator } from "../Inputs/AutocompleteInput/AutocompleteInput";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import FlightSearchPassengers from "components/ui/FlightSearchWidget/FlightSearchPassengers";
import FlightFareCategoryContainer from "components/ui/FlightSearchWidget/FlightFareCategoryContainer";
import FlightTypeContainer from "components/ui/FlightSearchWidget/FlightTypeContainer";
import FlightLocationPicker from "components/ui/FlightSearchWidget/FlightLocationPicker";
import MultiDateRangeDropdown from "components/ui/DatePicker/MultiDateRangeDropdown";
import Label from "components/ui/SearchWidget/Label";
import { gutters, zIndex } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import { Trans, useTranslation } from "i18n";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { searchWidgetAlignment } from "components/features/VacationPackagesSearchWidget/VacationPackageSearchWidget";

const Wrapper = styled.div`
  position: relative;
`;

const LocationWrapper = styled.div`
  position: relative;
`;

const PaxWrapper = styled.div`
  position: relative;
  margin-top: ${gutters.small / 2}px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
`;

const FlightTypeWrapper = styled.div`
  position: absolute;
  right: 0px;
  bottom: -${gutters.small}px;
  ${mqMin.large} {
    right: -${gutters.large}px;
    bottom: -${gutters.large}px;
    z-index: ${zIndex.z10};
  }
`;

const TravelDetailsWrapper = styled.div`
  display: flex;
  padding-bottom: ${gutters.large / 2}px;
`;

const DateWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const StyledFlightFareCategoryContainer = styled(FlightFareCategoryContainer)`
  width: auto;
  ${DisplayValue} {
    height: 38px;
  }
  ${mqMin.large} {
    ${DisplayValue} + ${DropdownContainer} {
      top: 45px;
      left: -18px;
    }
  }
`;

const StyledFlightLocationPicker = styled(FlightLocationPicker)`
  ${mqMin.large} {
    ${InputStyled} {
      height: 40px;
      line-height: 40px;
    }
    ${searchWidgetAlignment};
  }
  ${Separator} {
    top: ${gutters.small / 2}px;
  }
`;

const StyledMultiDateRangeDropdown = styled(MultiDateRangeDropdown)`
  ${DisplayValue} {
    height: 38px;
  }
  ${mqMin.large} {
    ${DisplayValue} + ${DropdownContainer} {
      top: 45px;
      left: -18px;
    }
  }
`;

const StyledFlightSearchPassengers = styled(FlightSearchPassengers)`
  ${DisplayValue} {
    height: 38px;
  }
  ${searchWidgetAlignment};
`;

const FlightSearchWidgetSmallContent = ({
  isMobile,
  onOriginLocationClick,
  onDestinationLocationClick,
  onDatesClick,
  onPassengersClick,
  searchButton,
  defaultOrigin,
  defaultDestination,
  selectedDepartureDates,
  selectedReturnDates,
  flightType,
  onDepartureDateSelection,
  onReturnDateSelection,
  onOriginLocationChange,
  onDestinationLocationChange,
  onFlightTypeChange,
  passengers,
  onNumberOfPassengersChange,
  cabinType,
  onCabinTypeChange,
  origin,
  destination,
  rangeAsDefault = false,
}: {
  isMobile: boolean;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  onDatesClick?: () => void;
  onPassengersClick?: () => void;
  searchButton: React.ReactNode;
  defaultOrigin?: string;
  defaultDestination?: string;
  selectedDepartureDates: SharedTypes.SelectedDates;
  selectedReturnDates: SharedTypes.SelectedDates;
  flightType: FlightSearchTypes.FlightType;
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
  origin?: string;
  destination?: string;
  rangeAsDefault?: boolean;
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
  const dates = getFlightMinMaxDates();
  const initialDepartureMonth =
    selectedDepartureDates.from || selectedDepartureDates.to || browserDate;

  return (
    <Wrapper>
      <LocationWrapper>
        <Label>
          <Trans ns={Namespaces.flightSearchNs}>Select details</Trans>
        </Label>
        <StyledFlightLocationPicker
          id="flightLocationPickerSmall"
          isMobile={isMobile}
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          onOriginLocationClick={onOriginLocationClick}
          onDestinationLocationClick={onDestinationLocationClick}
          defaultOrigin={defaultOrigin}
          defaultDestination={defaultDestination}
          origin={origin}
          destination={destination}
        />
        <FlightTypeWrapper>
          <FlightTypeContainer
            id="flightTypeSmall"
            flightType={flightType}
            onFlightTypeChange={onFlightTypeChange}
            directionOverflow="left"
          />
        </FlightTypeWrapper>
      </LocationWrapper>
      <DateWrapper>
        <Label>
          <Trans ns={Namespaces.flightSearchNs}>Select dates</Trans>
        </Label>
        <StyledMultiDateRangeDropdown
          id="flight-search-departure-dates-small"
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
          onDateInputClick={onDatesClick}
          useRangeAsDefault={rangeAsDefault}
          onClear={() => {
            onDepartureDateSelection({ from: undefined, to: undefined });
            onReturnDateSelection({ from: undefined, to: undefined });
          }}
          color="action"
        />
      </DateWrapper>
      <PaxWrapper>
        <TravelDetailsWrapper>
          <Row>
            <Column columns={{ small: 2, medium: 2, large: 2 }}>
              <Label>
                <Trans ns={Namespaces.flightSearchNs}>Add travelers</Trans>
              </Label>
              <StyledFlightSearchPassengers
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
              <StyledFlightFareCategoryContainer
                id="flightFareCategorySmall"
                onClick={onPassengersClick}
                cabinType={cabinType}
                onCabinTypeChange={onCabinTypeChange}
              />
            </Column>
          </Row>
        </TravelDetailsWrapper>
        <ButtonWrapper>{searchButton}</ButtonWrapper>
      </PaxWrapper>
    </Wrapper>
  );
};

export default FlightSearchWidgetSmallContent;
