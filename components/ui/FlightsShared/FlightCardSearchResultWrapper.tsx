import React from "react";
import styled from "@emotion/styled";

import FlightCard from "./FlightCard";

import { DefaultMarginTop } from "styles/base";

const StyledFlightCard = styled(FlightCard)`
  & + & {
    ${DefaultMarginTop}
  }
`;

export const FlightCardSearchResultWrapper = ({
  product,
}: {
  product: FlightSearchTypes.FlightItinerary;
}) => {
  return <StyledFlightCard itinerary={product} isActionFooter />;
};

export default FlightCardSearchResultWrapper;
