/* eslint-disable import/no-unresolved */
import React from "react";
import { storiesOf } from "@storybook/react";
import { MockedProvider } from "@apollo/react-testing";
import WithContainer from "@stories/decorators/WithContainer";

import AdminGear from "./AdminGear";

const heading = "AdminGear";

storiesOf(`${heading}/AdminGear`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <MockedProvider mocks={[]} addTypename={false}>
      <AdminGear
        links={[
          {
            name: "Availability & Bookings",
            url: "https://admin.guidetoiceland.is/tours/edit_departures/770",
          },
          {
            name: "Go to Guide to Iceland",
            url:
              "https://guidetoiceland.is/tour-operator-tours-holidays/guide-to-iceland/1238",
          },
        ]}
        indexationRules={{ allowChanging: false }}
        itemName="tour"
        itemId={770}
        hideCommonLinks={false}
      />
    </MockedProvider>
  ));
