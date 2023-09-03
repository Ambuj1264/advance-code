import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean } from "@storybook/addon-knobs";

import RemoveCartItemModal from "./RemoveCartItemModal";
import TermsOfServiceCheckbox from "./TermsOfServiceCheckbox";

import CheckBadgeIcon from "components/icons/check-badge.svg";

const heading = "Cart";

storiesOf(`${heading}`, module).add("RemoveCartItemModal", () => {
  return (
    <RemoveCartItemModal
      Icon={CheckBadgeIcon}
      title={text("title", "Awesome product to remove")}
      onClose={() => {}}
      onRemoveClick={() => {}}
    />
  );
});

storiesOf(`${heading}`, module).add("TermsOfServiceCheckbox", () => {
  return (
    <TermsOfServiceCheckbox
      termsAgreed={boolean("termsAgreed", false)}
      handleChange={() => {}}
      onTermsClick={() => {}}
      hasError={boolean("hasError", false)}
    />
  );
});
