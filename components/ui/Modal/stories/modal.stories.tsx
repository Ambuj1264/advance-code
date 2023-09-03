/* eslint-disable import/order, import/no-unresolved */
import React from "react";
import { storiesOf } from "@storybook/react";

import Modal from "../Modal";

const heading = "Modal";

storiesOf(`Components/${heading}`, module).add("default", () => (
  <Modal id="modal" onClose={() => {}}>
    <div>Step 1</div>
  </Modal>
));
