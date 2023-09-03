import React from "react";
import styled from "@emotion/styled";

import FlightDetailedInformation from "./FlightDetailedInformation";

import ProductFooter, { CardFooter } from "components/features/Cart/ProductFooter";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalFooterContainer,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";

const StyledFlightDetailedInformation = styled(FlightDetailedInformation)`
  margin-top: ${gutters.small}px;
`;

const StyledModalFooterContainer = styled(ModalFooterContainer)`
  padding: 0;
  ${mqMin.large} {
    padding: 0;
  }
`;

const StyledProductFooter = styled(ProductFooter)<{}>`
  margin: 0;
  width: 100%;
  background-color: unset;

  ${CardFooter} {
    flex-wrap: nowrap;
  }
`;

const FlightCardDetailsModal = ({
  flightItinerary,
  onClose,
  hideDetailedModalFooter,
}: {
  flightItinerary: FlightSearchTypes.FlightItinerary;
  onClose: () => void;
  hideDetailedModalFooter: boolean;
}) => {
  const { t: commonT } = useTranslation();
  const { t } = useTranslation(Namespaces.flightSearchNs);
  return (
    <Modal id="flightDetailsModal" onClose={onClose}>
      <ModalHeader
        title={commonT("Itinerary details")}
        rightButton={<CloseButton onClick={onClose} />}
      />
      <ModalContentWrapper>
        <ModalBodyContainer>
          <StyledFlightDetailedInformation flightItinerary={flightItinerary} />
        </ModalBodyContainer>
      </ModalContentWrapper>
      {!hideDetailedModalFooter && (
        <StyledModalFooterContainer>
          <StyledProductFooter
            price={flightItinerary.price}
            clientRoute={flightItinerary.clientRoute}
            productProps={[]}
            isAction
            showLargeButton
            priceSubtitle={t("Price for {numberOfTravelers} travelers", {
              numberOfTravelers: flightItinerary.numberOfPassengers,
            })}
          />
        </StyledModalFooterContainer>
      )}
    </Modal>
  );
};

export default FlightCardDetailsModal;
