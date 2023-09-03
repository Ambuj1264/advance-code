import React, { useContext } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FlightStateContext from "./contexts/FlightStateContext";
import FlightCallbackContext from "./contexts/FlightCallbackContext";
import PassengerDetailsSection from "./PassengerDetailsSection";
import { getPassengerDetailsText } from "./utils/flightUtils";

import Section from "components/ui/Section/Section";
import SectionHeading from "components/ui/Section/SectionHeading";
import Button from "components/ui/Inputs/Button";
import { gutters, whiteColor } from "styles/variables";
import AddPassengerIcon from "components/icons/single-neutral-actions-add.svg";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.large}px;
  button {
    width: 250px;
  }
`;

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const PassengerDetailsContainer = ({
  nrOfAdults,
  nrOfInfants,
}: {
  nrOfAdults: number;
  nrOfInfants: number;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.flightNs);
  const { passengers } = useContext(FlightStateContext);
  const { onPassengerDetailsChange, onPassengerCategoryChange, onPassengerRemove, onPassengerAdd } =
    useContext(FlightCallbackContext);
  return (
    <>
      {passengers.map(passenger => (
        <Section id={`passenger${passenger.id}Details`}>
          <SectionHeading>{getPassengerDetailsText(passenger.id, t)}</SectionHeading>
          <PassengerDetailsSection
            id={`passenger${passenger.id}Details`}
            passenger={passenger}
            onPassengerDetailsChange={onPassengerDetailsChange}
            onPassengerCategoryChange={onPassengerCategoryChange}
            onPassengerRemove={onPassengerRemove}
            nrOfAdults={nrOfAdults}
            nrOfInfants={nrOfInfants}
          />
        </Section>
      ))}
      {passengers.length < 9 && (
        <ButtonWrapper>
          <Button color="action" theme={theme} onClick={onPassengerAdd}>
            <AddPassengerIcon css={iconStyles} />
            <Trans ns={Namespaces.flightNs}>Add another passenger</Trans>
          </Button>
        </ButtonWrapper>
      )}
    </>
  );
};

export default PassengerDetailsContainer;
