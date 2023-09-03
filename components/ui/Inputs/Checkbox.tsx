import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Checkmark from "@travelshift/ui/icons/checkmark.svg";
import isPropValid from "@emotion/is-prop-valid";

import {
  greyColor,
  whiteColor,
  gutters,
  borderRadiusSmall,
  blackColor,
  redColor,
} from "styles/variables";
import { typographyBody2 } from "styles/typography";

const checkboxWidth = 24;

const CheckmarkIcon = styled(Checkmark, { shouldForwardProp: () => false })<{
  reverse?: boolean;
}>(({ reverse }) => [
  reverse
    ? css`
        z-index: 1;
        margin-top: 6px;
        margin-left: -18px;
      `
    : css`
        position: absolute;
        top: 7px;
        left: 6px;
      `,
  css`
    width: 12px;
    height: 12px;
    pointer-events: none;
    fill: ${whiteColor};
  `,
]);

const labelWithText = css`
  position: relative;
  display: inline-block;
  padding-left: ${checkboxWidth + gutters.small}px;
  ::before {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const labelWithoutText = css`
  padding-right: ${gutters.small / 4}px;
`;

const PseudoStyles = css`
  content: "";
  display: inline-block;
  border: 1px solid ${rgba(blackColor, 0.4)};
  border-radius: ${borderRadiusSmall};
  width: ${checkboxWidth}px;
  height: 24px;
`;

export const Label = styled("label", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "disabled" && prop !== "reverse",
})<{
  withText: boolean;
  disabled: boolean;
  reverse?: boolean;
  hasError?: boolean;
}>(({ withText, disabled, reverse, hasError }) => [
  typographyBody2,
  withText ? labelWithText : labelWithoutText,
  reverse
    ? css`
        display: flex;
        ::after {
          ${PseudoStyles};
          margin-left: ${gutters.small}px;
        }
      `
    : css`
        ::before {
          ${PseudoStyles};
        }
      `,

  hasError &&
    css`
      ::before,
      ::after {
        border-color: ${redColor};
      }
    `,
  css`
    cursor: ${disabled ? "auto" : "pointer"};
    user-select: none;
    color: ${rgba(greyColor, 0.7)};
    color: ${greyColor};
  `,
]);

export const HiddenInput = styled("input", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "color",
})<{ color: "primary" | "action" }>(({ theme, color }) => [
  css`
    position: absolute;
    display: none;
    cursor: pointer;

    &:enabled:checked ~ ${Label}::before, &:enabled:checked ~ ${Label}::after {
      border: 1px solid transparent;
      background-color: ${color === "primary" ? theme.colors.primary : theme.colors.action};
    }

    &:disabled,
    &[readonly] {
      cursor: auto;

      ~ ${Label} {
        color: ${rgba(greyColor, 0.4)};
      }
      ~ ${Label}::before, ~ ${Label}::after {
        border-color: ${rgba(greyColor, 0.4)};
      }
    }

    &:disabled:checked,
    &[readonly]:checked {
      ~ ${Label}::before, ~ ${Label}::after {
        background-color: ${color === "primary"
          ? rgba(theme.colors.primary, 0.1)
          : rgba(theme.colors.action, 0.1)};
        border-color: transparent;
      }
      ~ ${CheckmarkIcon} {
        fill: ${theme.colors[color]};
      }
    }

    &[readonly]:checked {
      ~ ${Label}::before, ~ ${Label}::after {
        border-color: ${rgba(greyColor, 0.4)};
      }
    }
  `,
]);

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Checkbox = ({
  id,
  onChange,
  name,
  label,
  color = "action",
  disabled = false,
  checked = false,
  value,
  readonly = false,
  reverse,
  className,
  hasError,
  dataTestid,
}: {
  id: string;
  onChange?: (value: boolean) => void;
  name: string;
  label?: string | React.ReactNode;
  color?: "primary" | "action";
  value?: string | number;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  reverse?: boolean;
  className?: string;
  hasError?: boolean;
  dataTestid?: string;
}) => (
  <Wrapper className={className} data-testid="input-wrapper">
    <HiddenInput
      type="checkbox"
      id={id}
      onChange={event => {
        if (onChange) {
          onChange?.(event.target.checked);
        }
      }}
      name={name}
      color={color}
      disabled={disabled}
      readOnly={readonly}
      checked={checked}
      value={value}
      data-testid={dataTestid}
    />
    <Label
      htmlFor={id}
      withText={Boolean(label)}
      disabled={disabled || readonly}
      reverse={reverse}
      hasError={hasError}
    >
      {label}
    </Label>
    <CheckmarkIcon reverse={reverse} />
  </Wrapper>
);

export default Checkbox;
