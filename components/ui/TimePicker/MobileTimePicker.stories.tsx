/* eslint-disable import/order, import/no-unresolved */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";
import MobileTimePicker from "./MobileTimePicker";

storiesOf("Inputs / MobileTimePicker", module)
  .addDecorator(WithContainer)
  .add("default", () => {
    const [time, setTime] = useState<SharedTypes.Time>({ hour: 10, minute: 0 });

    return (
      <>
        <br />
        <MobileTimePicker
          name="timePicker"
          displayTime={time}
          onTimeSelection={setTime}
        />
      </>
    );
  });
