import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";

import { greyColor, blackColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const radioButtonWidth = 24;

export const RadioButtonLabel = styled.label<{ reverse?: boolean }>(({ reverse }) => [
  typographyBody2,
  css`
    position: relative;
    display: inline-block;
    padding-right: ${reverse ? `${radioButtonWidth + gutters.small}px}` : "unset"};
    padding-left: ${reverse ? "unset" : `${radioButtonWidth + gutters.small}px}`};
    color: ${rgba(blackColor, 0.7)};
    ::before {
      content: "";
      position: absolute;
      top: 1px;
      right: ${reverse ? "0" : "unset"};
      left: ${reverse ? "unset" : "0"};
      display: inline-block;
      border: 1px solid ${rgba(greyColor, 0.4)};
      border-radius: 50%;
      width: ${radioButtonWidth}px;
      height: 24px;
    }
    &:hover {
      cursor: pointer;
    }
  `,
]);

const RadioButtonInput = styled("input", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "color",
})<{ color: "primary" | "action"; reverse?: boolean }>(
  ({ theme, color, reverse }) => css`
    position: absolute;
    opacity: 0;
    &:checked ~ ${RadioButtonLabel}::after {
      content: "";
      position: absolute;
      top: 7px;
      right: ${reverse ? "6px" : "unset"};
      left: ${reverse ? "unset" : "6px"};
      display: inline-block;
      border-radius: 50%;
      width: ${radioButtonWidth / 2}px;
      height: 12px;
    }

    &:enabled:checked
      ~ ${RadioButtonLabel}::after,
      &:disabled:checked
      ~ ${RadioButtonLabel}::after,
      &[readonly]:checked {
      background-color: ${color === "primary" ? theme.colors.primary : theme.colors.action};
    }

    &:disabled,
    &[readonly] {
      ~ ${RadioButtonLabel} {
        color: ${rgba(greyColor, 0.4)};
      }
    }
  `
);

export const RadioButtonWrapper = styled.div`
  position: relative;
`;

const RadioButton = ({
  checked = false,
  disabled = false,
  readonly = false,
  label,
  name,
  value,
  id,
  onChange,
  className,
  color = "action",
  reverse,
  dataTestid,
}: {
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  label: string | React.ReactNode;
  name: string;
  value: string | number;
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  color?: "primary" | "action";
  reverse?: boolean;
  dataTestid?: string;
}) => (
  <RadioButtonWrapper className={className}>
    <RadioButtonInput
      type="radio"
      checked={checked}
      name={name}
      value={value}
      id={id}
      onChange={onChange}
      disabled={disabled}
      readOnly={readonly}
      color={color}
      reverse={reverse}
      data-testid={dataTestid}
    />
    <RadioButtonLabel className="radioLabel" htmlFor={id} reverse={reverse}>
      {label}
    </RadioButtonLabel>
  </RadioButtonWrapper>
);

export default RadioButton;
