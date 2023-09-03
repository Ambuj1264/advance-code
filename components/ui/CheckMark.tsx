import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import BaseCheckMarkIcon from "@travelshift/ui/icons/checkmark.svg";

import { IconSize } from "types/enums";
import { getColor } from "utils/helperUtils";

type Props = {
  color: Color;
  iconSize: IconSize;
};

const CheckMarkIcon = styled(BaseCheckMarkIcon, {
  shouldForwardProp: () => false,
})<Props>(
  ({ color, iconSize, theme }) =>
    css`
      width: ${iconSize};
      min-width: ${iconSize};
      height: auto;
      fill: ${getColor(color, theme)};
    `
);

const CheckMark = ({ color, iconSize }: Props) => (
  <CheckMarkIcon color={color} iconSize={iconSize} />
);

export default CheckMark;
