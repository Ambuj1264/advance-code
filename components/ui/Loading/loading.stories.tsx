/* eslint-disable import/order, import/no-unresolved */
import React from "react";
// eslint-disable-next-line import/no-unresolved
import { boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import LoadingDropdown from "./LoadingDropdown";
import LoadingHeader from "./LoadingHeader";
import LoadingDatePicker from "./LoadingDatePicker";

const heading = "Loading";

storiesOf(`${heading}/LoadingDropdown`, module).add("default", () => (
  <LoadingDropdown withHeader={boolean("withHeader", true)} />
));

storiesOf(`${heading}/LoadingHeader`, module).add("default", () => (
  <LoadingHeader />
));

storiesOf(`${heading}/LoadingDatePicker`, module).add("default", () => (
  <LoadingDatePicker />
));
