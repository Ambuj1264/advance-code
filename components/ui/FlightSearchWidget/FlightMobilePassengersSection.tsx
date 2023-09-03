import React from "react";
import styled from "@emotion/styled";

import { getSumOfValues } from "./utils/flightSearchWidgetUtils";
import PassengersPicker from "./PassengersPicker";

import { Namespaces } from "shared/namespaces";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { gutters } from "styles/variables";
import { useTranslation } from "i18n";

const Wrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const SectionWrapper = styled.div`
  margin: ${gutters.small}px 0;
`;

const FlightMobilePassengersSection = ({
  passengers,
  onNumberOfPassengersChange,
  namespace,
  defaultLabel = "Passengers",
}: {
  passengers: FlightSearchTypes.Passengers;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  namespace: Namespaces;
  defaultLabel?: string;
}) => {
  const totalNumberOfPassengers = getSumOfValues(passengers);
  const { t } = useTranslation(namespace);

  return (
    <Wrapper>
      <MobileSectionHeading>{t(defaultLabel)}</MobileSectionHeading>
      <SectionWrapper>
        <PassengersPicker
          passengers={passengers}
          onNumberOfPassengersChange={onNumberOfPassengersChange}
          totalNumberOfPassengers={totalNumberOfPassengers}
        />
      </SectionWrapper>
    </Wrapper>
  );
};

export default FlightMobilePassengersSection;
