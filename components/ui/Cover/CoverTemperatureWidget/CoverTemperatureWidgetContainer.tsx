import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import GetWeatherQuery from "./GetWeatherQuery.graphql";
import CoverTemperatureWidget from "./CoverTemperatureWidget";

import { PageType, TemperatureUnit } from "types/enums";
import { noCacheHeaders } from "utils/apiUtils";

const CoverTemperatureWidgetContainer = ({
  slug,
  pageType,
}: {
  slug: string;
  pageType: PageType;
}) => {
  const { error, data } = useQuery<QueryWeather>(GetWeatherQuery, {
    variables: {
      slug,
      type: pageType.toUpperCase(),
    },
    fetchPolicy: "no-cache",
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
  });

  const [temperatureUnitType, setUnitType] = useState<TemperatureUnit>(TemperatureUnit.CELSIUS);

  if (error || !data || !data.getWeather || !data.getWeather.id) {
    return null;
  }

  const {
    highTemperatureCelsius,
    highTemperatureFahrenheit,
    cityName,
    countryName,
    conditionCode,
  } = data.getWeather;

  const onUnitTypeChange = () => {
    const unitTypeToSet =
      temperatureUnitType === TemperatureUnit.CELSIUS
        ? TemperatureUnit.FAHRENHEIT
        : TemperatureUnit.CELSIUS;
    setUnitType(unitTypeToSet);
  };

  const temperature =
    temperatureUnitType === TemperatureUnit.CELSIUS
      ? highTemperatureCelsius
      : highTemperatureFahrenheit;
  return (
    <CoverTemperatureWidget
      temperature={+temperature}
      location={cityName || countryName}
      weatherCondition={conditionCode}
      temperatureUnitType={temperatureUnitType}
      onTemperatureUnitClick={onUnitTypeChange}
    />
  );
};

export default CoverTemperatureWidgetContainer;
