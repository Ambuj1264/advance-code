import React from "react";
import styled from "@emotion/styled";

import {
  constructPassengerGroups,
  canIncrementPassengers,
  canDecrementPassengers,
} from "./utils/flightSearchWidgetUtils";

import BaseIncrementPicker from "components/ui/Inputs/IncrementPicker";
import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  min-width: 210px;
`;

const IncrementPicker = styled(BaseIncrementPicker)`
  :not(:last-of-type) {
    margin-bottom: ${gutters.small}px;
  }
`;

const PassengersPicker = ({
  passengers,
  onNumberOfPassengersChange,
  totalNumberOfPassengers,
}: {
  passengers: FlightSearchTypes.Passengers;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  totalNumberOfPassengers: number;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const passengerGroups = constructPassengerGroups(passengers, t);
  return (
    <Wrapper>
      {passengerGroups.map(({ id, passengerType, defaultValue, title }) => {
        const count = passengers[passengerType];
        return (
          <IncrementPicker
            key={id}
            id={id}
            canDecrement={canDecrementPassengers(count, passengerType, defaultValue, passengers)}
            canIncrement={canIncrementPassengers(
              count,
              passengers,
              passengerType,
              totalNumberOfPassengers
            )}
            count={count}
            title={title}
            onChange={(value: number) => onNumberOfPassengersChange(passengerType, value)}
            dataTestid={`passenger-${passengerType}`}
          />
        );
      })}
    </Wrapper>
  );
};

export default PassengersPicker;
