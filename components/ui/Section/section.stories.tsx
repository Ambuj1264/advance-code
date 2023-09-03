import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import WithContainer from "@stories/decorators/WithContainer";

import SectionRow from "./SectionRow";
import SectionWithTitle from "./SectionWithTitle";

const heading = "Section";

storiesOf(`${heading}/SectionRow`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <SectionRow
      title={text("title", "Best Travel Plans")}
      subtitle={text(
        "subtitle",
        "Book an optimized itinerary for a perfect vacation in Iceland"
      )}
    >
      <h3>section content</h3>
    </SectionRow>
  ));

storiesOf(`${heading}/SectionWithTitle`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <SectionWithTitle title="Contact Details" color="rgba(51, 102, 153, 0.9)">
      <div>section content</div>
    </SectionWithTitle>
  ));
