import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Label from "../../SearchWidget/Label";

import DriverCountry from "./DriverCountry";
import DriverAge from "./DriverAge";

import { gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const Wrapper = styled.div`
  height: 70px;
`;
const BottomWrapper = styled.div`
  display: flex;
  margin-top: ${gutters.small / 2}px;
  width: 100%;
`;

const BottomContent = styled.div([
  typographyBody2,
  css`
    width: 50%;
    :first-of-type {
      padding-right: ${gutters.small / 2}px;
    }
  `,
]);

const DriverInformation = ({
  driverAge,
  setDriverAge,
  driverCountry,
  setDriverCountry,
  height,
  mobileHeight,
}: {
  driverAge: number;
  setDriverAge: (driverAge: string) => void;
  driverCountry?: string;
  setDriverCountry: (driverCountry: string) => void;
  height?: number;
  mobileHeight?: number;
}) => {
  return (
    <Wrapper>
      <BottomWrapper>
        <BottomContent>
          <Label>
            <Trans ns={Namespaces.carSearchNs}>Driver’s age</Trans>
          </Label>
          <DriverAge
            id="driverAgeDropdown"
            driverAge={driverAge}
            setDriverAge={setDriverAge}
            height={height}
          />
        </BottomContent>
        <BottomContent>
          <Label>
            <Trans ns={Namespaces.carSearchNs}>I live in</Trans>
          </Label>
          <DriverCountry
            id="driverCountryDropdown"
            driverCountry={driverCountry}
            setDriverCountry={setDriverCountry}
            height={height}
            mobileHeight={mobileHeight}
          />
        </BottomContent>
      </BottomWrapper>
    </Wrapper>
  );
};

export default DriverInformation;
