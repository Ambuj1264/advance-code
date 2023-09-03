import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Label } from "./sortUtils";

import { singleLineTruncation } from "styles/base";
import { gutters, borderRadiusSmall } from "styles/variables";

const SelectedOptionContainer = styled("button", {
  shouldForwardProp: () => true,
})(
  ({ theme }) =>
    css`
      position: relative;
      display: flex;
      align-items: center;
      margin-left: auto;
      border: 1px solid ${theme.colors.primary};
      border-radius: ${borderRadiusSmall};
      max-width: 100%;
      height: 30px;
      > svg {
        margin: 0 ${gutters.small / 2}px;
      }

      ${Label} {
        margin-right: ${gutters.small / 2}px;
        margin-left: 0;
        ${singleLineTruncation}
      }
    `
);

const SortOptionsMobileButton = ({
  toggleModal,
  children,
}: {
  toggleModal: () => void;
  children: JSX.Element;
}) => {
  return <SelectedOptionContainer onClick={toggleModal}>{children}</SelectedOptionContainer>;
};

export default SortOptionsMobileButton;
