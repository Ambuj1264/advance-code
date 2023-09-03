import { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Dropdown from "./Dropdown";

import { Value } from "components/ui/Inputs/Dropdown/BaseDropdown";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const DropdownLeft = styled(Dropdown)<{
  icon?: ReactNode;
}>(({ icon }) => [
  css`
    div[data-selected="true"] {
      left: 0;
      display: inline-block;
      padding-left: ${icon ? gutters.small : gutters.large / 2}px;
      text-align: left;
      transform: none;
      ${mqMin.medium} {
        padding-left: ${icon ? gutters.large * 2.5 : gutters.small}px;
      }
    }
    ${Value} {
      display: block;
    }
  `,
]);

export default DropdownLeft;
