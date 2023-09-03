import React from "react";

import PassengersContainer from "./PassengersContainer";

const FlightSearchPassengers = ({
  id,
  onClick,
  passengers,
  onNumberOfPassengersChange,
  shouldDisplayArrowIcon = false,
  className,
  onOpenStateChange,
}: {
  id: string;
  onClick?: () => void;
  passengers: FlightSearchTypes.Passengers;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  shouldDisplayArrowIcon?: boolean;
  className?: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  return (
    <PassengersContainer
      id={id}
      passengers={passengers}
      onNumberOfPassengersChange={onNumberOfPassengersChange}
      onClick={onClick}
      className={className}
      shouldDisplayArrowIcon={shouldDisplayArrowIcon}
      onOpenStateChange={onOpenStateChange}
    />
  );
};

export default FlightSearchPassengers;
