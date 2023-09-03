import React, { useContext } from "react";
import styled from "@emotion/styled";

import FlightStateContext from "../Flight/contexts/FlightStateContext";
import FlightCallbackContext from "../Flight/contexts/FlightCallbackContext";

import CartPassengerDetailsForm from "./CartPassengerDetailsForm";
import { SectionTitle } from "./sharedCartComponents";

import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledCartPassengerDetailsForm = styled(CartPassengerDetailsForm)`
  margin-bottom: ${gutters.small}px;
`;

const CartVpTravellerDetailsForm = () => {
  const { passengers } = useContext(FlightStateContext);
  const { onPassengerDetailsChange } = useContext(FlightCallbackContext);
  const { t: orderT } = useTranslation(Namespaces.orderNs);

  return (
    <>
      <SectionTitle>{orderT("Add traveler details")}</SectionTitle>
      {passengers.map(passenger => (
        <StyledCartPassengerDetailsForm
          key={`passenger-${passenger.id}`}
          passenger={passenger}
          onPassengerDetailsChange={onPassengerDetailsChange}
        />
      ))}
      <SectionTitle>{orderT("Add payment information")}</SectionTitle>
    </>
  );
};

export default CartVpTravellerDetailsForm;
