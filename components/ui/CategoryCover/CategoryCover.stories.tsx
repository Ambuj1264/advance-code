/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import { object } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import CategoryCover from "./CategoryCover";

import { mockCategory0 } from "components/features/SearchPage/utils/mockSearchPageData";
import WithContainer from "@stories/decorators/WithContainer";

const heading = "CategoryCover";

storiesOf(`${heading}/CategoryCover`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <CategoryCover category={object("category", mockCategory0)} />
  ));
