/* eslint-disable import/no-unresolved */
import React from "react";
import { text } from "@storybook/addon-knobs";
import { MockedProvider } from "@apollo/react-testing";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import ContactUsButton from "./ContactUsButton";
import ContactUsContainer from "./ContactUsContainer";

const heading = "ContactUs";

storiesOf(`${heading}/ContactUsButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ContactUsButton onClick={() => {}} label="Contact Us" />
  ));

storiesOf(`${heading}/ContactUsContainer`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <MockedProvider>
      <ContactUsContainer productName={text("Product name", "Contact us")} />
    </MockedProvider>
  ));
