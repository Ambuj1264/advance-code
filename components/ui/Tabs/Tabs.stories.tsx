/* eslint-disable import/order, import/no-unresolved */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";

import Tabs from "./Tabs";
import RoundedTabs from "./RoundedTabs";
import WithContainer from "@stories/decorators/WithContainer";
import WithDarkBackground from "@stories/decorators/WithDarkBackground";
import TravelerIcon from "components/icons/traveler.svg";
import BedroomIcon from "components/icons/bedroom-hotel.svg";
import CarIcon from "components/icons/car.svg";

storiesOf("Components/Tabs", module).add("default", () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Tabs
      labels={["First", "Second", "Third"]}
      currentIndex={activeTab}
      onChange={setActiveTab}
    />
  );
});

storiesOf("Components/RoundedTabs", module)
  .addDecorator(WithContainer)
  .addDecorator(WithDarkBackground)
  .add("default", () => {
    return (
      <div style={{ paddingTop: "20px" }}>
        <RoundedTabs
          items={[
            {
              id: 0,
              text: "Trips",
              Icon: TravelerIcon,
            },
            {
              id: 1,
              text: "Hotels",
              Icon: BedroomIcon,
            },
            {
              id: 2,
              text: "Cars",
              Icon: CarIcon,
            },
          ]}
          onTabChange={({ current, previous }) =>
            // eslint-disable-next-line no-console
            console.log(`current ${current}`, `previous ${previous}`)
          }
        >
          <div>Trips content</div>
          <div>Hotels content</div>
          <div>Cars content</div>
        </RoundedTabs>
      </div>
    );
  });
