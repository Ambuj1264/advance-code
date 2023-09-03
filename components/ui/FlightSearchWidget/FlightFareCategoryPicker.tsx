import React from "react";
import styled from "@emotion/styled";

import RadioButton from "components/ui/Inputs/RadioButton";
import { gutters } from "styles/variables";

const CabinTypeWrapper = styled.div`
  & + & {
    margin-top: ${gutters.small / 2}px;
  }
`;

const FlightFareCategoryPicker = ({
  cabinType,
  onCabinTypeChange,
  cabinTypes,
}: {
  cabinTypes: {
    id: string;
    name: string;
  }[];
  cabinType: FlightSearchTypes.CabinType;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
}) => {
  return (
    <>
      {cabinTypes.map(({ id, name }) => (
        <CabinTypeWrapper key={`cabinType${id}`} data-testid="cabinType">
          <RadioButton
            checked={cabinType === (id as FlightSearchTypes.CabinType)}
            label={name}
            name={name}
            value={id as FlightSearchTypes.CabinType}
            id={`${name}FareOption`}
            onChange={() => onCabinTypeChange(id as FlightSearchTypes.CabinType)}
          />
        </CabinTypeWrapper>
      ))}
    </>
  );
};

export default FlightFareCategoryPicker;
