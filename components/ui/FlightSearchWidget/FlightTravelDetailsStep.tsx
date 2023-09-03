import React from "react";
import styled from "@emotion/styled";

import { constructCabinTypes } from "./utils/flightSearchWidgetUtils";
import FlightFareCategoryPicker from "./FlightFareCategoryPicker";
import FlightMobilePassengersSection from "./FlightMobilePassengersSection";

import FlightLocationMobileStep from "components/ui/FlightSearchWidget/FlightLocationMobileStep";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";
import {
  StyledToggleButton,
  ToggleWrapper,
} from "components/ui/DatePicker/MobileMultiRangeDatePicker";

const SectionWrapper = styled.div`
  margin: ${gutters.small}px 0;
`;

const FlightTravelDetailsStep = ({
  onOriginLocationChange,
  onDestinationLocationChange,
  defaultOrigin,
  defaultDestination,
  defaultOriginId,
  defaultDestinationId,
  origin,
  destination,
  passengers,
  cabinType,
  onNumberOfPassengersChange,
  onCabinTypeChange,
  flightType,
  onFlightTypeChange,
  forceOriginFocus,
  forceDestinationFocus,
}: {
  onOriginLocationChange: (originId?: string, originName?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  destination?: string;
  passengers: FlightSearchTypes.Passengers;
  cabinType: FlightSearchTypes.CabinType;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  flightType: FlightSearchTypes.FlightType;
  onFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  forceOriginFocus?: boolean;
  forceDestinationFocus?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const cabinTypes = constructCabinTypes(t);
  const onChangeFlightType = (isRound: boolean) => {
    const newFlightType = isRound ? "round" : "oneway";
    onFlightTypeChange?.(newFlightType as FlightSearchTypes.FlightType);
  };
  return (
    <>
      <MobileSectionHeading>
        <Trans ns={Namespaces.commonSearchNs}>Select details</Trans>
      </MobileSectionHeading>
      <FlightLocationMobileStep
        onOriginLocationChange={onOriginLocationChange}
        onDestinationLocationChange={onDestinationLocationChange}
        origin={origin}
        destination={destination}
        defaultOrigin={defaultOrigin}
        defaultOriginId={defaultOriginId}
        defaultDestination={defaultDestination}
        defaultDestinationId={defaultDestinationId}
        forceOriginFocus={forceOriginFocus}
        forceDestinationFocus={forceDestinationFocus}
      />
      <ToggleWrapper>
        <StyledToggleButton
          checked={flightType === "round"}
          onChange={onChangeFlightType}
          offValue={t("One way")}
          onValue={t("Round trip")}
          id="mobileMultiDateToggle"
        />
      </ToggleWrapper>
      <FlightMobilePassengersSection
        passengers={passengers}
        onNumberOfPassengersChange={onNumberOfPassengersChange}
        namespace={Namespaces.flightSearchNs}
      />
      <MobileSectionHeading>Classes</MobileSectionHeading>
      <SectionWrapper>
        <FlightFareCategoryPicker
          cabinType={cabinType}
          onCabinTypeChange={onCabinTypeChange}
          cabinTypes={cabinTypes}
        />
      </SectionWrapper>
    </>
  );
};

export default FlightTravelDetailsStep;
