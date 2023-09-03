/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import { object } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import BreadCrumbs from "components/ui/Breadcrumbs/Breadcrumbs";
import WithContainer from "@stories/decorators/WithContainer";

const heading = "Components";

const getProps = () => ({
  breadcrumbs: object("breadcrumbs", [
    {
      name: "Home",
      url: "https://guidetoiceland.is",
    },
    {
      name: "Accommodation",
      url: "https://guidetoiceland.is/accommodation",
    },
    {
      name: "Hotels",
      url: "https://guidetoiceland.is/accommodation/hotels",
    },
    {
      name: "Fosshótel Reykjavík",
      url: "https://guidetoiceland.is/accommodation/hotels/fosshotel",
    },
  ]),
});

storiesOf(`${heading}/Breadcrumbs`, module)
  .addDecorator(WithContainer)
  .add("Default", () => <BreadCrumbs {...getProps()} />);
