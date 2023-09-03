import React from "react";

import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import Header from "components/features/Header/MainHeader";
import getFlightInitialProps from "components/features/FlightSearchPage/utils/getFlightInitialProps";
import FlightLandingContainer from "components/features/FlightSearchPage/FlightLandingContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";

const FlightSearchPage = ({
  flightQueryCondition,
}: {
  flightQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(flightQueryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <FlightLandingContainer flightQueryCondition={flightQueryCondition} />
      </QueryParamProvider>
    </>
  );
};

FlightSearchPage.getInitialProps = getFlightInitialProps;

export default FlightSearchPage;
