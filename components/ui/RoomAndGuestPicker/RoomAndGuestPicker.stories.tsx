/* eslint-disable import/no-unresolved, import/order, import/no-extraneous-dependencies */
import React from "react";
import { number, boolean, object } from "@storybook/addon-knobs";
import { MockedProvider } from "@apollo/react-testing";
import { storiesOf } from "@storybook/react";

import DesktopRoomAndGuestPicker from "./DesktopRoomAndGuestPicker";
import MobileRoomAndGuestPicker from "../MobileSteps/MobileRoomAndGuestPicker";

import WithContainer from "@stories/decorators/WithContainer";
import TravellerPicker from "components/ui/Inputs/TravellerPicker/TravellerPicker";
import { Namespaces } from "shared/namespaces";

const heading = "RoomAndGuestPicker";

storiesOf(`${heading}/RoomAndGuestPicker`, module)
  .addDecorator(WithContainer)
  .add("Desktop", () => (
    <MockedProvider>
      <DesktopRoomAndGuestPicker
        numberOfGuests={object("numberOfGuests", { adults: 3, children: 1 })}
        onSetNumberOfGuests={() => {}}
        numberOfRooms={number("numberOfRooms", 2)}
        onSetNumberOfRooms={() => {}}
        loading={boolean("loading", false)}
        updateChildrenAges={() => {}}
      />
    </MockedProvider>
  ))
  .add("Mobile", () => (
    <MockedProvider>
      <MobileRoomAndGuestPicker
        numberOfGuests={object("numberOfGuests", { adults: 3, children: 1 })}
        onSetNumberOfGuests={() => {}}
        numberOfRooms={number("numberOfRooms", 2)}
        onSetNumberOfRooms={() => {}}
        updateChildrenAges={() => {}}
      />
    </MockedProvider>
  ))
  .add("Traveller picker", () => (
    <MockedProvider>
      <>
        <br />
        <TravellerPicker
          numberOfGuests={object("numberOfGuests", {
            adults: 3,
            children: [1],
          })}
          onSetNumberOfGuests={() => {}}
          updateChildrenAges={() => {}}
          namespace={Namespaces.tourSearchNs}
        />
      </>
    </MockedProvider>
  ));
