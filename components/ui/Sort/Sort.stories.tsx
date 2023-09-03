/* eslint-disable import/order, import/no-unresolved */
import React from "react";

import SortOptionsModal from "./SortOptionsModal";
import SortOptionsDropdown from "./SortOptionsDropdown";
import { getSortOptions } from "./sortUtils";
import { mockTheme } from "utils/mockData/mockGlobalData";

import { storiesOf } from "@storybook/react";

const heading = "Sort";

storiesOf(`${heading}/SortOptionsModal`, module).add("default", () => (
  <SortOptionsModal onClose={() => {}} options={getSortOptions(mockTheme)} />
));

storiesOf(`${heading}/SortOptionsDropdown`, module).add("default", () => (
  <SortOptionsDropdown
    onChange={() => {}}
    selectedIndex={0}
    options={getSortOptions(mockTheme)}
  />
));
