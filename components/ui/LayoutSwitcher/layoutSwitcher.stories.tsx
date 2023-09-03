/* eslint-disable import/order, import/no-unresolved */
import React, { useState } from "react";

import LayoutSwitcher from "./LayoutSwitcher";

import { storiesOf } from "@storybook/react";
import { PageLayout } from "types/enums";

storiesOf("Components/LayoutSwitcher", module).add("default", () => {
  const [activeLayout, setActiveLayout] = useState(PageLayout.GRID);
  return (
    <LayoutSwitcher
      layouts={[PageLayout.GRID, PageLayout.LIST]}
      currentLayout={activeLayout}
      onChange={setActiveLayout}
    />
  );
});
