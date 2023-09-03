import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FlightStateContext from "./contexts/FlightStateContext";
import FlightCallbackContext from "./contexts/FlightCallbackContext";

import { Trans } from "i18n";
import Checkbox from "components/ui/Inputs/Checkbox";
import { greyColor, gutters } from "styles/variables";
import { typographyCaption, typographyBody2 } from "styles/typography";
import { mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";

const CovidLink = styled.span<{ isLink: boolean }>(({ isLink, theme }) => [
  css`
    margin: 0 2px;
  `,
  isLink &&
    css`
      color: ${theme.colors.primary};
    `,
]);

const CheckboxWrapper = styled.div`
  display: flex;
`;

const CovidText = styled.span(
  typographyBody2,
  css`
    margin-left: ${gutters.large / 2}px;
    cursor: pointer;
    color: ${greyColor};
    ${mqMin.large} {
      ${typographyCaption};
    }
  `
);

const HealthDeclarationCheckbox = ({ openModal }: { openModal?: () => void }) => {
  const { healthDeclarationChecked } = useContext(FlightStateContext);
  const { onHealthDeclarationChecked } = useContext(FlightCallbackContext);
  return (
    <CheckboxWrapper>
      <Checkbox
        id="covidRequiremends"
        checked={healthDeclarationChecked}
        onChange={() => onHealthDeclarationChecked()}
        name="covidRequirements"
      />
      <CovidText>
        <Trans
          ns={Namespaces.flightNs}
          i18nKey="I declare that all passengers in my booking meet all general COVID-19 health requirements as of the issuance date."
          defaults="I declare that all passengers in my booking meet all general <0>COVID-19 health requirements</0> as of the issuance date."
          components={[
            <CovidLink onClick={openModal} isLink={openModal !== undefined}>
              COVID-19 health requirements
            </CovidLink>,
          ]}
        />
      </CovidText>
    </CheckboxWrapper>
  );
};

export default HealthDeclarationCheckbox;
