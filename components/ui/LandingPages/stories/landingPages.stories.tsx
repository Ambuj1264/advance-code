import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import LandingPageCardContainer from "../LandingPageCardContainer";
import {
  mockFlightImageCard0,
  mockFlightImageCard1,
} from "../../FlightsShared/flightsMockData";

import { GraphCMSDisplayType } from "types/enums";

const heading = "LandingPage";

storiesOf(`${heading}`, module)
  .addDecorator(WithContainer)
  .add("LandingPageImageCard", () => {
    return (
      <MockedProvider>
        <LandingPageCardContainer
          cardContent={mockFlightImageCard0}
          isVisible
          displayType={GraphCMSDisplayType.IMAGE}
          index={1}
        />
      </MockedProvider>
    );
  });

storiesOf(`${heading}`, module).add(
  "LandingPageImageCard 2 flags overlay",
  () => {
    return (
      <MockedProvider>
        <LandingPageCardContainer
          cardContent={mockFlightImageCard1}
          isVisible
          displayType={GraphCMSDisplayType.IMAGE}
          index={2}
        />
      </MockedProvider>
    );
  }
);

storiesOf(`${heading}`, module).add("Larger LandingPageImageCard", () => {
  return (
    <MockedProvider>
      <LandingPageCardContainer
        cardContent={mockFlightImageCard0}
        isVisible
        displayType={GraphCMSDisplayType.LARGE_IMAGE}
        index={3}
      />
    </MockedProvider>
  );
});

storiesOf(`${heading}`, module).add("LandingPageSideImageCard", () => {
  return (
    <MockedProvider>
      <LandingPageCardContainer
        cardContent={mockFlightImageCard0}
        isVisible
        displayType={GraphCMSDisplayType.SIDE_IMAGE}
        index={4}
      />
    </MockedProvider>
  );
});

storiesOf(`${heading}`, module).add("LandingPageImageCardWithAction", () => {
  return (
    <MockedProvider>
      <LandingPageCardContainer
        cardContent={mockFlightImageCard1}
        isVisible
        displayType={GraphCMSDisplayType.IMAGE_WITH_ACTION}
        index={5}
      />
    </MockedProvider>
  );
});
