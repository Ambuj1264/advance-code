import React from "react";

import { constructFlightTypes } from "./utils/flightSearchWidgetUtils";

import RadioSelectionDropdown from "components/ui/Inputs/RadioSelectionDropdown";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const FlightTypeContainer = ({
  id,
  flightType,
  onFlightTypeChange,
  directionOverflow,
  className,
}: {
  id: string;
  flightType: FlightSearchTypes.FlightType;
  onFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  directionOverflow?: "right" | "left";
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const flightTypes = constructFlightTypes(t);
  const selectedValue = flightTypes.find(type => type.id === flightType);
  return (
    <RadioSelectionDropdown
      id={id}
      selectedValue={selectedValue}
      options={flightTypes}
      onChange={flightTypeId => onFlightTypeChange(flightTypeId as FlightSearchTypes.FlightType)}
      directionOverflow={directionOverflow}
      className={className}
    />
  );
};

export default FlightTypeContainer;
