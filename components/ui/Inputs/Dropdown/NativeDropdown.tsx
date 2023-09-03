import React, { ReactNode, forwardRef, Ref } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import { gutters, greyColor, whiteColor, redColor } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { typographyBody1, typographyBody2 } from "styles/typography";

const ArrowIcon = styled(Arrow)(
  css`
    width: 12px;
    height: 12px;
    pointer-events: none;
    transform: rotate(90deg);
    fill: ${greyColor};
  `
);

const getColor = (
  theme: Theme,
  selectedColorPrimary: boolean,
  hasError?: boolean,
  borderColor?: string
) => {
  if (hasError) return { border: redColor, color: redColor };
  if (selectedColorPrimary) {
    return { border: theme.colors.primary, color: whiteColor };
  }
  return { border: borderColor || rgba(greyColor, 0.5), color: greyColor };
};

const getArrowFill = (isDisabled: boolean, colorSelected: boolean) => {
  if (isDisabled) return rgba(greyColor, 0.4);
  if (colorSelected) return whiteColor;
  return greyColor;
};

export const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const DisplayValue = styled.div<{
  hasError?: boolean;
  selectedColorPrimary?: boolean;
  selectHeight?: number;
  borderColor?: string;
}>(({ hasError, selectedColorPrimary = false, theme, selectHeight, borderColor }) => [
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${gutters.small / 2}px;
    border: 1px solid ${getColor(theme, selectedColorPrimary, hasError, borderColor).border};
    border-radius: 4px;
    width: 100%;
    height: ${selectHeight ? `${selectHeight}px` : "auto"};
    padding: 0 ${gutters.small}px;
    cursor: pointer;
    color: ${getColor(theme, selectedColorPrimary, hasError).color};
  `,
]);
export const Value = styled.div([
  singleLineTruncation,
  css`
    flex: 1;
    text-align: center;
  `,
]);

export const NativeSelect = styled.select([
  typographyBody1,
  css`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  `,
]);

const IconWrapper = styled.div<{
  selectedColorPrimary?: boolean;
}>(
  ({ selectedColorPrimary }) =>
    css`
      display: flex;
      align-items: center;
      min-width: 16px;
      min-height: 16px;
      fill: ${selectedColorPrimary ? whiteColor : greyColor};
    `
);

const NativeSelectWrapper = styled.div`
  position: relative;
`;
const arrowStyles = (isDisabled: boolean, colorSelected = false) => css`
  fill: ${getArrowFill(isDisabled, colorSelected)};
`;

export type NativeSelectPLaceholderBuilderInputType = (value?: SelectOption) => React.ReactNode;

const NativeDropdown = (
  {
    id,
    options,
    onChange,
    selectedValue,
    value,
    defaultValue,
    onBlur,
    selectedColorPrimary,
    icon,
    isDisabled = false,
    isArrowHidden,
    nativeSelectPlaceholderFn,
    error,
    selectHeight = 40,
    borderColor,
  }: {
    id: string;
    options: SelectOption[];
    onChange: (value: string, label?: string, isDisabled?: boolean) => void;
    selectedValue?: string;
    value?: SelectOption;
    defaultValue?: SelectOption;
    onBlur?: () => void;
    selectedColorPrimary?: boolean;
    icon?: ReactNode;
    isDisabled?: boolean;
    isArrowHidden?: boolean;
    nativeSelectPlaceholderFn?: NativeSelectPLaceholderBuilderInputType;
    error?: boolean;
    selectHeight?: number;
    borderColor?: string;
  },
  ref: Ref<HTMLSelectElement>
) => {
  const selectedPrimaryColor = selectedColorPrimary && value !== defaultValue;

  return (
    <NativeSelectWrapper>
      <NativeSelect
        ref={ref}
        id={`${id}Mobile`}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          event.target.value !== selectedValue &&
          onChange(
            event.target.value,
            event.target.options[event.target.selectedIndex].text,
            isDisabled
          )
        }
        onFocus={onBlur}
        value={value?.value}
        disabled={isDisabled}
      >
        {options.map((option, index) => (
          <option
            id={`${id}Option${option.value}`}
            value={option.value}
            key={`option.nativeLabel${index + 1}` || option.value}
          >
            {option.nativeLabel || option.value}
          </option>
        ))}
      </NativeSelect>
      {nativeSelectPlaceholderFn ? (
        nativeSelectPlaceholderFn(value)
      ) : (
        <DisplayValue
          hasError={error}
          selectedColorPrimary={selectedPrimaryColor}
          selectHeight={selectHeight}
          borderColor={borderColor}
        >
          <Placeholder>
            {icon && <IconWrapper selectedColorPrimary={selectedPrimaryColor}>{icon}</IconWrapper>}
            <Value data-selected>{value?.nativeLabel ?? value?.label}</Value>
            {!isArrowHidden && <ArrowIcon css={arrowStyles(isDisabled, selectedPrimaryColor)} />}
          </Placeholder>
        </DisplayValue>
      )}
    </NativeSelectWrapper>
  );
};

export default forwardRef(NativeDropdown);
