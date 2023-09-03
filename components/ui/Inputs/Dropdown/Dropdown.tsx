import React, { useRef, RefObject, useContext, ReactNode, useMemo, useCallback } from "react";
import styled from "@emotion/styled";

import RadioOption from "./BaseDropdownRadioOption";

import { NativeSelectPLaceholderBuilderInputType } from "components/ui/Inputs/Dropdown/NativeDropdown";
import { useTranslation } from "i18n";
import SelectedOption from "components/ui/Inputs/Dropdown/BaseDropdownSelectedOption";
import BookingWidgetRefContext from "components/ui/BookingWidget/BookingWidgetRefContext";
import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import { Namespaces } from "shared/namespaces";
import { DisplayType, SelectMenuPlacement } from "types/enums";

export const DropdownWrapper = styled.div`
  div[class*="menu"] {
    overflow: hidden;
  }
`;

const handleMenuOpen = (
  dropdownRef: RefObject<HTMLDivElement>,
  options: SelectOption[],
  maxHeight: string,
  bookingWidgetRef: RefObject<HTMLDivElement>
) => {
  const dropdown = dropdownRef.current;
  const optionsHeight = options.length * 60; // each value in options has min height 60px
  const menuMaxHeight = Number(maxHeight.replace(/\D/g, ""));
  const menuHeight = Math.min(optionsHeight, menuMaxHeight) + 125; // 125 is the height of the footer + the height of the select
  const lengthFromBottom = dropdown
    ? window.innerHeight - dropdown.getBoundingClientRect().bottom
    : 0;
  setTimeout(() => {
    if (lengthFromBottom < menuHeight) {
      const scrollLength = menuHeight - lengthFromBottom;
      if (bookingWidgetRef.current !== null) {
        // eslint-disable-next-line operator-assignment, no-param-reassign
        bookingWidgetRef.current.scrollTop = bookingWidgetRef.current.scrollTop + scrollLength;
      }
    }
  }, 0);
};

const Dropdown = ({
  id,
  onChange,
  options,
  selectedValue,
  maxHeight = "395px",
  defaultValue,
  selectedLabel,
  isSearchable,
  onBlur,
  error,
  selectedColorPrimary,
  icon,
  borderColor,
  isDisabled = false,
  selectHeight,
  onClick,
  className,
  shouldLoadWhenVisible,
  isRightCombinedDropdown,
  isLeftCombinedDropdown,
  placeholder,
  noDefaultValue = false,
  isForceOpen = false,
  isArrowHidden = false,
  isListView = false,
  useRadioOption = false,
  openMenuOnFocus,
  onMenuOpen,
  onMenuClose,
  mobileHeight,
  nativeSelectBreakpoint,
  menuPlacement,
  useNativeOnDesktop,
  nativeSelectPlaceholderFn,
  shouldDisplayEmptyValueLabel = false,
}: {
  id: string;
  onChange: (value: string, label?: string, isDisabled?: boolean) => void;
  options: SelectOption[];
  selectedValue?: string;
  maxHeight?: string;
  defaultValue?: SelectOption;
  selectedLabel?: string;
  isSearchable?: boolean;
  onBlur?: () => void;
  error?: boolean;
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
  placeholder?: string;
  noDefaultValue?: boolean;
  isForceOpen?: boolean;
  isArrowHidden?: boolean;
  isListView?: boolean;
  useRadioOption?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  openMenuOnFocus?: boolean;
  mobileHeight?: number;
  nativeSelectBreakpoint?: DisplayType;
  menuPlacement?: SelectMenuPlacement;
  useNativeOnDesktop?: boolean;
  nativeSelectPlaceholderFn?: NativeSelectPLaceholderBuilderInputType;
  shouldDisplayEmptyValueLabel?: boolean;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bookingWidgetRef = useContext(BookingWidgetRefContext);
  const { t } = useTranslation(Namespaces.commonNs);
  const optionsWithFirstEmptyValue = useMemo(
    () => [
      {
        value: "",
        nativeLabel: shouldDisplayEmptyValueLabel ? t("Select an option") : "",
        label: shouldDisplayEmptyValueLabel ? t("Select an option") : "",
      },
      ...options,
    ],
    [options, shouldDisplayEmptyValueLabel, t]
  );
  const normalizedOptions = noDefaultValue ? optionsWithFirstEmptyValue : options;

  const openMenu = useCallback(() => {
    if (dropdownRef) {
      handleMenuOpen(dropdownRef, normalizedOptions, maxHeight, bookingWidgetRef);
    }
  }, [bookingWidgetRef, maxHeight, normalizedOptions]);

  const SingleValue = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      ({ ...primaryProps }: { data: SelectOption }) => {
        return <SelectedOption {...primaryProps} icon={icon} />;
      },
    [icon]
  );

  const Option = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      ({
        innerRef,
        innerProps,
        ...props
      }: {
        data: SelectOption;
        isSelected: boolean;
        innerRef: RefObject<HTMLDivElement>;
        innerProps: any;
      }) => {
        return (
          <div ref={innerRef} {...innerProps}>
            <RadioOption {...props} onChange={onChange} />
          </div>
        );
      },
    [onChange]
  );

  return (
    <DropdownWrapper ref={dropdownRef}>
      <BaseDropdown
        id={id}
        onChange={onChange}
        options={normalizedOptions}
        components={{
          SingleValue,
          ...(useRadioOption ? { Option } : {}),
        }}
        selectedValue={selectedValue}
        maxHeight={maxHeight}
        defaultValue={defaultValue || (noDefaultValue ? undefined : options[0])}
        selectedLabel={selectedLabel}
        handleMenuOpen={() => {
          onMenuOpen?.();
          openMenu();
        }}
        isSearchable={isSearchable}
        onBlur={onBlur}
        error={error}
        selectedColorPrimary={selectedColorPrimary}
        icon={icon}
        isDisabled={onClick !== undefined || isDisabled}
        borderColor={borderColor}
        selectHeight={selectHeight}
        onClick={onClick}
        className={className}
        shouldLoadWhenVisible={shouldLoadWhenVisible}
        isRightCombinedDropdown={isRightCombinedDropdown}
        isLeftCombinedDropdown={isLeftCombinedDropdown}
        placeholder={placeholder}
        isForceOpen={isForceOpen}
        isArrowHidden={isArrowHidden}
        isListView={isListView}
        onMenuClose={onMenuClose}
        openMenuOnFocus={openMenuOnFocus}
        mobileHeight={mobileHeight}
        nativeSelectBreakpoint={nativeSelectBreakpoint}
        menuPlacement={menuPlacement}
        useNativeOnDesktop={useNativeOnDesktop}
        nativeSelectPlaceholderFn={nativeSelectPlaceholderFn}
      />
    </DropdownWrapper>
  );
};

export default Dropdown;
