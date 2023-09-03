import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import RadioButton from "../RadioButton";

import { gutters } from "styles/variables";

export const OptionWrapper = styled.div<{
  isSelected?: boolean;
}>(({ theme, isSelected }) => [
  css`
    margin: ${gutters.large}px ${gutters.small}px 0 ${gutters.small}px;
    height: 100%;
    cursor: pointer;
    color: ${isSelected ? theme.colors.action : theme.colors.primary};
    &:last-of-type {
      margin-bottom: ${gutters.large}px;
    }
  `,
]);

const BaseDropdownRadioOption = ({
  data,
  isSelected,
  onChange,
}: {
  data: SelectOption;
  isSelected: boolean;
  onChange: (value: string, label?: string, isDisabled?: boolean) => void;
}) => {
  return (
    <OptionWrapper
      title={data.label as string}
      isSelected={isSelected}
      onClick={() => onChange(data.value || "", data.nativeLabel, data.isDisabled)}
    >
      <RadioButton
        id={data.value || ""}
        checked={isSelected}
        onChange={() => {}}
        label={data.label}
        name={data.value ?? ""}
        value={data.value ?? ""}
        disabled={data.isDisabled}
      />
    </OptionWrapper>
  );
};
export default BaseDropdownRadioOption;
