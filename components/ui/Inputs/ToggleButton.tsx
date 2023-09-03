import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import {
  placeholderColor,
  greyColor,
  opacity,
  whiteColor,
  fontSizeCaption,
} from "styles/variables";
import { typographyBody2, typographySubtitle2 } from "styles/typography";

type Props = {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  onValue?: string;
  offValue?: string;
  id: string;
  reverse?: boolean;
  className?: string;
  highlightCheckedOption?: boolean;
};

type ToggleProps = {
  isChecked: boolean;
  reverse: boolean;
  highlightCheckedOption?: boolean;
};

const ToggleButtonWrapper = styled.div<{
  disabled?: boolean;
}>(({ disabled }) => [
  css`
    display: flex;
    align-items: center;
  `,
  disabled &&
    css`
      opacity: ${opacity.disabled};
    `,
]);

export const ToggleButtonOption = styled.div<ToggleProps>(
  ({ theme, isChecked, reverse, highlightCheckedOption = true }) => [
    typographyBody2,
    css`
      cursor: pointer;
      color: ${reverse ? whiteColor : rgba(greyColor, 0.9)};

      &:first-of-type {
        margin-right: 5px;
        color: ${isChecked && !reverse && theme.colors.primary};
        ${highlightCheckedOption && isChecked ? typographySubtitle2 : ""};
        letter-spacing: ${highlightCheckedOption && isChecked ? 0.1 : 0.4}px;
      }

      &:last-of-type {
        margin-left: 5px;
        letter-spacing: ${highlightCheckedOption && isChecked && reverse ? 0.4 : 0.1}px;
        ${highlightCheckedOption && reverse && !isChecked ? typographySubtitle2 : ""};
      }
    `,
  ]
);

const getBackgroundColor = (checked: boolean, reverse: boolean, theme: Theme) => {
  if (reverse) {
    return whiteColor;
  }
  if (checked) {
    return theme.colors.primary;
  }
  return placeholderColor;
};
export const ToggleButtonLabel = styled.label<ToggleProps>(
  ({ theme, isChecked, reverse }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 100px;
    width: 32px;
    height: 18px;
    background: ${getBackgroundColor(isChecked, reverse, theme)};
    cursor: pointer;
    transition: 0.2s;
  `
);

const ToggleButtonInput = styled.input`
  margin: 0;
  width: 0;
  height: 0;
  visibility: hidden;
`;

export const Ball = styled.span<ToggleProps>(
  ({ isChecked, reverse, theme }) =>
    css`
      position: absolute;
      top: 2px;
      right: ${isChecked ? "auto" : "2px"};
      left: ${isChecked ? "2px" : "auto"};
      border-radius: 50%;
      width: 14px;
      height: 14px;
      background: ${reverse ? theme.colors.action : whiteColor};
      transform: ${isChecked === false && "translateX(100% - 22px)"};
      transition: 0.4s;
    `
);

const ToggleButton = ({
  checked,
  onChange,
  onValue,
  offValue,
  id,
  disabled,
  reverse = false,
  className,
  highlightCheckedOption = true,
}: Props) => (
  <ToggleButtonWrapper disabled={disabled} className={className}>
    {onValue && (
      <ToggleButtonOption
        id={`${id}OnOption`}
        isChecked={checked}
        reverse={reverse}
        highlightCheckedOption={highlightCheckedOption}
        onClick={() => onChange(true)}
      >
        {onValue}
      </ToggleButtonOption>
    )}
    <ToggleButtonInput
      id={id}
      name={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={() => onChange(!checked)}
    />
    <ToggleButtonLabel id={`${id}Label`} htmlFor={id} isChecked={checked} reverse={reverse}>
      <Ball isChecked={checked} reverse={reverse} />
    </ToggleButtonLabel>
    {offValue && (
      <ToggleButtonOption
        id={`${id}OffOption`}
        isChecked={checked}
        reverse={reverse}
        onClick={() => onChange(false)}
        highlightCheckedOption={highlightCheckedOption}
      >
        {offValue}
      </ToggleButtonOption>
    )}
  </ToggleButtonWrapper>
);

export const ToggleButtonSmall = styled(ToggleButton)<{
  checked: boolean;
}>(({ checked }) => [
  css`
    ${ToggleButtonOption} {
      &:first-of-type,
      &:last-of-type {
        font-size: ${fontSizeCaption};
        line-height: 16px;
      }
      &:last-of-type {
        ${!checked ? "font-weight: 600" : ""};
        letter-spacing: ${checked ? 0.4 : 0.1}px;
      }
    }

    ${ToggleButtonLabel} {
      width: 24px;
      height: 12px;
    }

    ${Ball} {
      right: ${checked ? "auto" : "3px"};
      left: ${checked ? "3px" : "auto"};
      width: 8px;
      height: 8px;
    }
  `,
]);

export default ToggleButton;
