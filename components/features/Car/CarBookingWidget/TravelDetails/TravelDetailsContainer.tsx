import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";

import CarBookingWidgetConstantContext from "../contexts/CarBookingWidgetConstantContext";

import TravelDetailsMobile from "./TravelDetailsMobile";
import TravelDetailsDesktop from "./TravelDetailsDesktop";

import { breakpointsMax } from "styles/variables";
import { getFormattedDateWithTime } from "utils/dateUtils";
import LocaleContext from "contexts/LocaleContext";

const TravelDetailsContainer = () => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const activeLocale = useContext(LocaleContext);
  const { from, to, searchPageUrl, availableLocations } = useContext(
    CarBookingWidgetConstantContext
  );
  const fromFormatted = getFormattedDateWithTime(from, activeLocale);
  const toFormatted = getFormattedDateWithTime(to, activeLocale);

  return isMobile ? (
    <TravelDetailsMobile
      from={fromFormatted}
      to={toFormatted}
      availableLocations={availableLocations}
    />
  ) : (
    <TravelDetailsDesktop
      loading={false}
      from={fromFormatted}
      to={toFormatted}
      searchPageUrl={searchPageUrl}
      availableLocations={availableLocations}
    />
  );
};

export default TravelDetailsContainer;
