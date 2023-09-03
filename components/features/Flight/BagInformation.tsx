import React, { useContext, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import NoBagIcon from "@travelshift/ui/icons/close.svg";

import FlightExtra from "./FlightExtra";
import FlightCallbackContext from "./contexts/FlightCallbackContext";
import { onChangeBaggageSelection, hasNoAvailableBaggage } from "./utils/flightUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { DefaultMarginTop, container, mqMin } from "styles/base";
import { gutters, redColor, greyColor } from "styles/variables";
import { typographyBody2, typographySubtitle1 } from "styles/typography";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getPassengerTitle } from "components/ui/FlightSearchWidget/utils/flightSearchWidgetUtils";

const Wrapper = styled.div([
  container,
  DefaultMarginTop,
  css`
    display: flex;
    flex-direction: column;
    margin-bottom: ${gutters.large}px;
    ${mqMin.large} {
      margin-top: ${gutters.small}px;
    }
  `,
]);

const StyledNoBagIcon = styled(NoBagIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 14px;
  height: 14px;
  fill: ${redColor};
`;

const NoBagWrapper = styled.div(
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    color: ${greyColor};
  `
);

const Container = styled.div`
  margin-top: 24px;
  width: 100%;
`;

const Title = styled.div(
  typographySubtitle1,
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${theme.colors.primary};
    `
);

const StyledFlightExtra = styled(FlightExtra)`
  min-height: 58px;
`;

const BagInformation = ({
  passenger,
  id,
}: {
  passenger: FlightTypes.PassengerDetails;
  id: string;
}) => {
  const { t: searchT } = useTranslation(Namespaces.flightSearchNs);
  const { currencyCode } = useCurrencyWithDefault();
  const { onPassengerBagsChange } = useContext(FlightCallbackContext);
  const { bags } = passenger;
  const changePassengerBags = useCallback(
    (passengerId: string, passengerBags: FlightTypes.BagTypes, isHandbag: boolean) => {
      const updatedBaggage = onChangeBaggageSelection(passengerId, passengerBags, isHandbag);
      onPassengerBagsChange(passenger.id, updatedBaggage);
    },
    [onPassengerBagsChange, passenger]
  );
  const hasNoBags = !bags || hasNoAvailableBaggage(bags);
  if (hasNoBags) {
    return (
      <Wrapper>
        <NoBagWrapper>
          <StyledNoBagIcon />
          {searchT("No bags are available for {passengerCategory}", {
            passengerCategory: getPassengerTitle(passenger.category, searchT).toLowerCase(),
          })}
        </NoBagWrapper>
      </Wrapper>
    );
  }
  return (
    <Container data-testid={`${id}-baggage-container`}>
      {bags!.handBags.length > 0 && (
        <Title>
          <Trans ns={Namespaces.flightSearchNs}>Cabin baggage</Trans>
        </Title>
      )}
      <Wrapper data-testid="cabin-baggage">
        {bags!.handBags.map(bag => (
          <StyledFlightExtra
            id={`${id}Handbags`}
            extraId={bag.id}
            key={`${id}${bag.id}`}
            price={bag.price}
            inputType={bag.inputType}
            bagCombination={bag.bagCombination}
            isSelected={bag.isSelected}
            isIncluded={bag.isIncluded}
            currency={currencyCode}
            onChange={(passengerId: string) => changePassengerBags(passengerId, bags!, true)}
            additionalInformation={
              bag.priorityAirlines
                ? searchT(
                    "Priority Boarding is included for free in this bundle ({priorityAirlines})",
                    {
                      priorityAirlines: bag.priorityAirlines.join(", "),
                    }
                  )
                : undefined
            }
          />
        ))}
      </Wrapper>
      {bags!.holdBags.length > 0 && (
        <Title>
          <Trans ns={Namespaces.flightSearchNs}>Checked baggage</Trans>
        </Title>
      )}
      <Wrapper data-testid="checked-baggage">
        {bags!.holdBags.map(bag => (
          <StyledFlightExtra
            id={`${id}Holdbags`}
            extraId={bag.id}
            key={`${id}${bag.id}`}
            price={bag.price}
            inputType={bag.inputType}
            bagCombination={bag.bagCombination}
            isSelected={bag.isSelected}
            isIncluded={bag.isIncluded}
            currency={currencyCode}
            onChange={(passengerId: string) => changePassengerBags(passengerId, bags!, false)}
          />
        ))}
      </Wrapper>
    </Container>
  );
};

export default BagInformation;
