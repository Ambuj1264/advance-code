import React, { useContext, useCallback, useRef, useEffect } from "react";
import styled from "@emotion/styled";

import { ModalBanner } from "../vpShared";
import { VPFlightCallbackContext } from "../contexts/VPFlightStateContext";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Row from "components/ui/Grid/Row";
import BagInformation from "components/features/Flight/BagInformation";
import { gutters } from "styles/variables";
import FlightStateContext from "components/features/Flight/contexts/FlightStateContext";
import { mqMax } from "styles/base";
import { capitalize } from "utils/globalUtils";

const Container = styled.div`
  margin: 0 -${gutters.large + gutters.large / 2}px;

  ${mqMax.large} {
    margin: 0 -${gutters.large}px;
  }
`;

const VPBaggageInfoContent = () => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);

  const { passengers } = useContext(FlightStateContext);
  const { onChangeBaggageText } = useContext(VPFlightCallbackContext);

  const passengerRef = useRef(passengers);

  const changeBaggageText = useCallback(() => {
    onChangeBaggageText(passengerRef.current, vacationT);
  }, [onChangeBaggageText, vacationT]);

  useEffect(() => {
    passengerRef.current = passengers;
    changeBaggageText();
  }, [changeBaggageText, passengers]);

  if (passengers.length === 0) return null;

  return (
    <Container>
      {passengers.map(passenger => (
        <React.Fragment key={passenger.id}>
          <Row>
            <ModalBanner>
              {passenger.id === 1
                ? t("Primary passenger details")
                : t("{i}. {category} passenger details", {
                    i: passenger.id,
                    category: t(capitalize(passenger.category)),
                  })}
            </ModalBanner>
          </Row>
          <BagInformation passenger={passenger} id={`adultbag${passenger.id}`} />
        </React.Fragment>
      ))}
    </Container>
  );
};

export default VPBaggageInfoContent;
