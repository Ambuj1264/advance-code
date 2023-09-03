import React from "react";
import styled from "@emotion/styled";
import withStyles from "isomorphic-style-loader/withStyles";

import FooterImage from "../Footer/FooterImage";

import styles from "./styles";
import countryList from "./data/countries.json";
import { TripPlannerStateContextProvider } from "./contexts/TripPlannerStateContext";
import TripPlannerContent from "./TripPlannerContent";

import Container from "components/ui/Grid/Container";

const FooterImageFixedBottom = styled(FooterImage)`
  position: absolute;
  bottom: 0;
  z-index: -1;
`;

const ContainerFullHeight = styled(Container)`
  position: relative;
  min-height: 100vh;
`;

const TripPlannerContainer = () => {
  return (
    <ContainerFullHeight>
      <TripPlannerStateContextProvider
        selectedCountry={countryList.countries[0]}
        fetchingError=""
        noDataError=""
        isFetchingTrips={false}
      >
        <TripPlannerContent countries={countryList.countries} />
      </TripPlannerStateContextProvider>
      <FooterImageFixedBottom />
    </ContainerFullHeight>
  );
};

export default withStyles(...styles)(TripPlannerContainer);
