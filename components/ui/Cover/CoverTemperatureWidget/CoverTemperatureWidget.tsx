import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import WeatherIcon from "./WeatherIcon";

import { mediaQuery } from "styles/base";
import {
  borderRadius,
  fontSizeBody1,
  fontSizeBody2,
  fontSizeH4,
  gutters,
  whiteColor,
} from "styles/variables";
import LocationSvg from "components/icons/location.svg";
import { TemperatureUnit } from "types/enums";

const Wrapper = styled.div([
  mediaQuery({
    minWidth: ["97px", "135px"],
    height: ["79px", "110px"],
    padding: [`0 ${gutters.small / 2}px`, `0 ${gutters.small}px`],
  }),
  css`
    position: relative;
    border-radius: ${borderRadius};
    background: rgba(51, 102, 153, 0.4);
    cursor: default;
    color: ${whiteColor};
    overflow: hidden;
  `,
]);

const Temperature = styled.div<{ compensateLongNumber: boolean }>(({ compensateLongNumber }) => [
  mediaQuery({
    fontSize: ["40px", "56px"],
    padding: [
      `${gutters.small / 2}px ${gutters.small}px 0 0`,
      compensateLongNumber ? `${gutters.small}px 28px 0 8px` : `${gutters.small}px 8px 0 0`,
    ],
  }),
  css`
    line-height: 1;
    text-align: center;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  `,
]);

const TemperatureUnitWrapper = styled.button([
  mediaQuery({
    top: ["30px", "43px"],
    fontSize: [fontSizeBody1, fontSizeH4],
    right: ["10px", "14px"],
  }),
  css`
    position: absolute;
    color: ${whiteColor};
    line-height: 1;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  `,
]);

const Location = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${gutters.small / 2}px;
`;

const LocationTitle = styled.span`
  margin-left: ${gutters.small / 4}px;
  max-width: 40vw;
  font-size: ${fontSizeBody2};
  line-height: ${fontSizeBody2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LOCATION_ICON_SIZE = ["10px", "14px"];

const LocationIcon = styled(LocationSvg)([
  mediaQuery({
    height: LOCATION_ICON_SIZE,
    minHeight: LOCATION_ICON_SIZE,
    width: LOCATION_ICON_SIZE,
    minWidth: LOCATION_ICON_SIZE,
  }),
  css`
    fill: ${whiteColor};
  `,
]);

enum TemperatureUnits {
  celsius = "°C",
  fahrenheit = "°F",
}

const CoverTemperatureWidget = ({
  temperature,
  temperatureUnitType = TemperatureUnit.CELSIUS,
  location,
  weatherCondition,
  onTemperatureUnitClick,
}: {
  temperature: number;
  location: string;
  temperatureUnitType?: TemperatureUnit;
  weatherCondition?: string;
  onTemperatureUnitClick?: () => void;
}) => {
  return (
    <Wrapper>
      <WeatherIcon weatherCondition={weatherCondition} />
      <TemperatureUnitWrapper onClick={onTemperatureUnitClick}>
        {TemperatureUnits[temperatureUnitType]}
      </TemperatureUnitWrapper>
      <Temperature compensateLongNumber={temperature >= 10 || temperature < 0}>
        {temperature}
      </Temperature>
      <Location>
        <LocationIcon />
        <LocationTitle>{location}</LocationTitle>
      </Location>
    </Wrapper>
  );
};

export default CoverTemperatureWidget;
