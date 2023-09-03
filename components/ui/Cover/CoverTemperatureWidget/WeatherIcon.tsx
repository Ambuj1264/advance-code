import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import WeatherSunSvg from "components/icons/weather-sun.svg";
import WeatherCloudSvg from "components/icons/weather-cloud-1.svg";
import WeatherRainSvg from "components/icons/weather-cloud-rain.svg";
import WeatherSnowSvg from "components/icons/weather-cloud-snow.svg";
import { gutters, whiteColor } from "styles/variables";
import { mediaQuery } from "styles/base";

const WEATHER_ICON_SIZE = ["16px", "24px"];

const iconStyles = css([
  mediaQuery({
    top: [`${gutters.small / 4}px`, `${gutters.small / 2}px`],
    right: [`${gutters.small / 2}px`, `${gutters.small / 2}px`],
    width: WEATHER_ICON_SIZE,
    height: WEATHER_ICON_SIZE,
  }),
  css`
    position: absolute;
    fill: ${whiteColor};
  `,
]);

const WeatherSun = styled(WeatherSunSvg)(iconStyles);
const WeatherSnow = styled(WeatherSnowSvg)(iconStyles);
const WeatherRain = styled(WeatherRainSvg)(iconStyles);
const WeatherCloud = styled(WeatherCloudSvg)(iconStyles);

// weatherCondition: https://developer.yahoo.com/weather/documentation.html#codes
const sunConditionList = ["31", "32", "33", "34", "36"];
const snowConditionList = ["7", "13", "14", "15", "16", "41", "42", "43", "46"];
const cloudConditionList = ["19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
const rainConditionList = [
  "0",
  "1",
  "2",
  "4",
  "5",
  "6",
  "8",
  "9",
  "10",
  "11",
  "12",
  "17",
  "18",
  "35",
  "37",
  "38",
  "39",
  "40",
  "45",
  "47",
];

const WeatherIcon = ({ weatherCondition = "" }: { weatherCondition?: string }) => {
  switch (true) {
    case rainConditionList.includes(weatherCondition):
      return <WeatherRain />;
    case cloudConditionList.includes(weatherCondition):
      return <WeatherCloud />;
    case snowConditionList.includes(weatherCondition):
      return <WeatherSnow />;
    case sunConditionList.includes(weatherCondition):
      return <WeatherSun />;
    default:
      return <strong>?</strong>;
  }
};

export default WeatherIcon;
