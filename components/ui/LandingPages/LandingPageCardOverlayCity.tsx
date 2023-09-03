import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Country, CountryTitle as CityTitle } from "./LandingPageCardOverlayShared";

import { borderRadiusTiny, gutters, lightBlueColor, whiteColor } from "styles/variables";
import LocationIcon from "components/icons/location.svg";
import { capitalize } from "utils/globalUtils";

const CityWrapper = styled(Country)`
  max-width: 90%;
  background-color: ${rgba(0, 0, 0, 0.6)};
`;

const CityIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadiusTiny};
  width: ${gutters.large}px;
  height: 100%;
  background-color: ${lightBlueColor};
`;

const locationIconStyles = css`
  height: 10px;
  fill: ${whiteColor};
`;

const LandingPageCardOverlayCity = ({
  city,
  onRightSide = false,
  onBottom = false,
  className,
}: {
  city: string;
  onRightSide?: boolean;
  onBottom?: boolean;
  className?: string;
}) => (
  <CityWrapper displayOnRightSide={onRightSide} displayOnBottom={onBottom} className={className}>
    <CityIconWrapper>
      <LocationIcon css={locationIconStyles} />
    </CityIconWrapper>
    <CityTitle>{capitalize(city)}</CityTitle>
  </CityWrapper>
);

export default LandingPageCardOverlayCity;
