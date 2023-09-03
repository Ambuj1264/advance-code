import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { gutters } from "styles/variables";
import { mediaQuery } from "styles/base";
import TimerIcon from "components/icons/clock.svg";

type Props = {
  options: SelectOption[];
  onChange: (selectedTime: string) => void;
  selectedPickupTime?: string;
  selectedLabel?: string;
};

export const Wrapper = styled.div(
  mediaQuery({
    marginTop: [`${gutters.small}px`, `${gutters.small / 2}px`],
  })
);

const iconStyle = (theme: Theme) => css`
  width: 18px;
  height: 18px;
  fill: ${theme.colors.primary};
`;

const PickupTimeDropdown = ({ onChange, selectedPickupTime, options, selectedLabel }: Props) => {
  return (
    <Wrapper>
      <Dropdown
        id="pickupTimeDropdown"
        onChange={onChange}
        icon={<TimerIcon css={iconStyle} />}
        options={options}
        selectedValue={selectedPickupTime}
        selectedLabel={selectedLabel}
      />
    </Wrapper>
  );
};

export default PickupTimeDropdown;
