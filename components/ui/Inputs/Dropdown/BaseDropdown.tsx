import React, { useMemo, ReactNode, forwardRef, Ref, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Select from "../Select";

import NativeDropdown, { NativeSelectPLaceholderBuilderInputType } from "./NativeDropdown";

import { DisplayType, SelectMenuPlacement } from "types/enums";
import { singleLineTruncation } from "styles/base";
import { typographyBody1 } from "styles/typography";
import MediaQuery from "components/ui/MediaQuery";

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

const BaseDropdown = (
  {
    id,
    options,
    onChange,
    selectedValue,
    components,
    isSearchable,
    maxHeight,
    selectedLabel,
    defaultValue,
    handleMenuOpen,
    onBlur,
    error,
    isLoading,
    placeholder,
    selectedColorPrimary,
    icon,
    borderColor,
    isDisabled = false,
    selectHeight = 40,
    onClick,
    className,
    shouldLoadWhenVisible,
    isRightCombinedDropdown,
    isLeftCombinedDropdown,
    isForceOpen,
    isArrowHidden,
    isListView = false,
    onMenuClose,
    openMenuOnFocus,
    mobileHeight,
    nativeSelectBreakpoint = DisplayType.Medium,
    menuPlacement,
    useNativeOnDesktop = false,
    nativeSelectPlaceholderFn,
  }: {
    id: string;
    options: SelectOption[];
    onChange: (value: string, label?: string, isDisabled?: boolean) => void;
    isSearchable?: boolean;
    selectedValue?: string;
    components?: SelectComponents;
    maxHeight?: string | undefined;
    selectedLabel?: string;
    defaultValue?: SelectOption;
    handleMenuOpen?: () => void;
    onBlur?: () => void;
    error?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    selectedColorPrimary?: boolean;
    icon?: ReactNode;
    borderColor?: string;
    isDisabled?: boolean;
    selectHeight?: number;
    onClick?: () => void;
    className?: string;
    shouldLoadWhenVisible?: boolean;
    isRightCombinedDropdown?: boolean;
    isLeftCombinedDropdown?: boolean;
    isForceOpen?: boolean;
    isArrowHidden?: boolean;
    isListView?: boolean;
    onMenuClose?: () => void;
    openMenuOnFocus?: boolean;
    mobileHeight?: number;
    nativeSelectBreakpoint?: DisplayType;
    menuPlacement?: SelectMenuPlacement;
    useNativeOnDesktop?: boolean;
    nativeSelectPlaceholderFn?: NativeSelectPLaceholderBuilderInputType;
  },
  ref: Ref<HTMLSelectElement>
) => {
  const value = useMemo(() => {
    let ret = defaultValue;
    if (selectedValue) {
      ret = options.find(
        option => option.value === selectedValue || option.nativeLabel === selectedValue
      );
    } else if (selectedLabel) {
      ret = options.find(option => option.nativeLabel === selectedLabel);
    }
    return ret;
  }, [defaultValue, options, selectedLabel, selectedValue]);
  const selectedPrimaryColor = selectedColorPrimary && value !== defaultValue;

  const handleOnChange = useCallback(
    (selectedOption: SelectOption) => {
      if (selectedOption.value !== selectedValue) {
        onChange(selectedOption.value || "", selectedOption.nativeLabel, selectedOption.isDisabled);
      } else {
        onBlur?.();
      }
    },
    [onBlur, onChange, selectedValue]
  );

  const select = (
    <Select
      id={id}
      onChange={handleOnChange}
      options={options}
      selectedValue={value}
      isSearchable={isSearchable}
      components={components}
      maxHeight={maxHeight}
      defaultValue={defaultValue}
      handleMenuOpen={handleMenuOpen}
      onBlur={onBlur}
      error={error}
      isLoading={isLoading}
      placeholder={placeholder}
      selectedColorPrimary={selectedPrimaryColor}
      isDisabled={isDisabled}
      borderColor={borderColor}
      selectHeight={selectHeight}
      shouldLoadWhenVisible={shouldLoadWhenVisible}
      isRightCombinedDropdown={isRightCombinedDropdown}
      isLeftCombinedDropdown={isLeftCombinedDropdown}
      isForceOpen={isForceOpen}
      isArrowHidden={isArrowHidden}
      isListView={isListView}
      onMenuClose={onMenuClose}
      openMenuOnFocus={openMenuOnFocus}
      mobileHeight={mobileHeight}
      menuPlacement={menuPlacement}
    />
  );

  const nativeSelect = (
    <NativeDropdown
      id={id}
      ref={ref}
      onChange={onChange}
      options={options}
      selectedValue={selectedValue}
      value={value}
      defaultValue={defaultValue}
      onBlur={onBlur}
      selectedColorPrimary={selectedColorPrimary}
      icon={icon}
      isDisabled={isDisabled}
      isArrowHidden={isArrowHidden}
      nativeSelectPlaceholderFn={nativeSelectPlaceholderFn}
      error={error}
      selectHeight={selectHeight}
      borderColor={borderColor}
    />
  );
  return (
    <>
      <MediaQuery fromDisplay={nativeSelectBreakpoint} className={className}>
        {useNativeOnDesktop ? nativeSelect : select}
      </MediaQuery>

      <MediaQuery toDisplay={nativeSelectBreakpoint} onClick={onClick} className={className}>
        {nativeSelect}
      </MediaQuery>
    </>
  );
};

export default forwardRef(BaseDropdown);
