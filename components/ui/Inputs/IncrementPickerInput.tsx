import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { IncrementType } from "types/enums";
import IncrementButton from "components/ui/Inputs/IncrementButton";
import { typographyBody2 } from "styles/typography";
import { blackColor } from "styles/variables";
import { mqMin } from "styles/base";

const InputContainer = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    width: 95px;
    color: ${rgba(blackColor, 0.7)};
    ${mqMin.medium} {
      width: 100px;
    }
  `,
]);

const IncrementPickerInput = ({
  id,
  canDecrement,
  canIncrement,
  onChange,
  count,
}: {
  id: string;
  canDecrement: boolean;
  canIncrement: boolean;
  onChange: (value: number) => void;
  count: number;
}) => {
  return (
    <InputContainer>
      <IncrementButton
        id={`${id}Decrement`}
        incrementType={IncrementType.Minus}
        onClick={() => onChange(count - 1)}
        disabled={!canDecrement}
      />
      <span>{count}</span>
      <IncrementButton
        id={`${id}Increment`}
        incrementType={IncrementType.Plus}
        onClick={() => onChange(count + 1)}
        disabled={!canIncrement}
      />
    </InputContainer>
  );
};

export default IncrementPickerInput;
