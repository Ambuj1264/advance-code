import React from "react";
import { storiesOf } from "@storybook/react";
import { object, boolean, select } from "@storybook/addon-knobs";
import { MockedProvider } from "@apollo/react-testing";

import FlightExtra from "../../../features/Flight/FlightExtra";
import {
  mockFlightItineraries0,
  mockSingleFlightItinerary,
  mockComplexFlightItinerary,
} from "../flightsMockData";
import FlightCard from "../FlightCard";
import { FlightExtraIconType } from "../../../features/FlightSearchPage/types/flightEnums";
import FlightDetailedInformation from "../FlightDetailedInformation";

const heading = "Flights";

storiesOf(`${heading}/FlightCard`, module).add("One way", () => {
  return (
    <MockedProvider>
      <FlightCard itinerary={object("itinerary", mockSingleFlightItinerary)} />
    </MockedProvider>
  );
});

storiesOf(`${heading}/FlightCard`, module).add("Return", () => {
  return (
    <MockedProvider>
      <FlightCard itinerary={object("itinerary", mockFlightItineraries0[0])} />
    </MockedProvider>
  );
});

storiesOf(`${heading}`, module).add("FlightDetailedInformation", () => {
  return (
    <FlightDetailedInformation flightItinerary={mockComplexFlightItinerary} />
  );
});

storiesOf(`${heading}`, module).add("FlightExtra", () => {
  return (
    <MockedProvider>
      <FlightExtra
        id="awesomeExtra"
        extraId="awesomeExtra"
        isSelected={boolean("isSelected", true)}
        inputType={select("inputType", ["checked", "radio"], "checked")}
        price={65}
        currency="EUR"
        onChange={() => {}}
        bagCombination={[
          {
            title: "Awesome extra",
            category: "awesome_extra",
            count: 0,
            highlights: [
              {
                iconId: FlightExtraIconType.CARRYON,
                title: "55 × 20 × 40 cm",
              },
              {
                iconId: FlightExtraIconType.CABINBAG,
                title: "55 × 20 × 40 cm",
              },
              {
                iconId: FlightExtraIconType.PERSONAL_ITEM,
                title: "55 × 20 × 40 cm",
              },
              {
                iconId: FlightExtraIconType.BAG_WEIGHT,
                title: "23 kg",
              },
              {
                iconId: FlightExtraIconType.SELECTED,
                title: "Trip cancellation",
              },
            ],
          },
        ]}
      />
    </MockedProvider>
  );
});
