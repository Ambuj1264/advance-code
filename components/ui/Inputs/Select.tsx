import React, { ComponentProps, lazy, useMemo, useRef, useState } from "react";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import deburr from "lodash.deburr";
import SelectSSR from "react-select?onDemand";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { Label } from "./Dropdown/BaseDropdownSelectedOption";

import { SelectMenuPlacement } from "types/enums";
import { skeletonPulse, singleLineTruncation, mqMin } from "styles/base";
import { typographyBody2 } from "styles/typography";
import { useTranslation } from "i18n";
import {
  whiteColor,
  greyColor,
  gutters,
  borderRadiusSmall,
  redColor,
  zIndex,
  guttersPx,
} from "styles/variables";
import OnDemandComponent from "components/ui/Lazy/OnDemandComponent";
import componentLoader from "components/ui/LazyComponentLoader";

type OptionState = {
  isSelected: boolean;
  isDisabled: boolean;
  isFocused: boolean;
};

const getColor = (
  borderColor: string,
  error?: boolean,
  selectedColorPrimary?: boolean,
  theme?: Theme
) => {
  if (error) return redColor;
  if (borderColor !== greyColor) return rgba(borderColor, 1);
  if (selectedColorPrimary && theme) {
    return theme.colors.primary;
  }
  return rgba(greyColor, 0.5);
};

const getDropdownIndicatorColor = (selectedValue: boolean, isDisabled: boolean) => {
  if (isDisabled) return rgba(greyColor, 0.4);
  if (selectedValue) return whiteColor;
  return greyColor;
};

const controlStyles = ({
  selectHeight = 45,
  error = false,
  selectedColorPrimary = false,
  borderColor = greyColor,
  theme,
  isRightCombinedDropdown,
  isLeftCombinedDropdown,
  isListViewSkeleton = false,
  mobileHeight,
  isDisabled,
}: {
  selectHeight?: number;
  error?: boolean;
  selectedColorPrimary?: boolean;
  borderColor?: string;
  theme?: Theme;
  isRightCombinedDropdown?: boolean;
  isLeftCombinedDropdown?: boolean;
  isListViewSkeleton?: boolean;
  mobileHeight?: number;
  isDisabled?: boolean;
}) => [
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${getColor(borderColor, error, selectedColorPrimary, theme)};
    border-radius: ${borderRadiusSmall};
    background-color: ${selectedColorPrimary && theme ? theme.colors.primary : whiteColor};
    cursor: ${isDisabled ? "not-allowed" : "pointer"};
    color: ${selectedColorPrimary ? whiteColor : greyColor};
  `,
  mobileHeight
    ? css`
        height: ${mobileHeight}px;
        ${mqMin.large} {
          height: ${selectHeight}px;
        }
      `
    : css`
        height: ${isListViewSkeleton ? "auto" : `${selectHeight}px`};
      `,
  isRightCombinedDropdown &&
    css`
      border-right: none;
      border-top-right-radius: unset;
      border-bottom-right-radius: unset;
    `,
  isLeftCombinedDropdown &&
    css`
      border-left: none;
      border-top-left-radius: unset;
      border-bottom-left-radius: unset;
    `,
];

const valueContainerStyles = ({
  selectedColorPrimary = false,
  isSkeleton = false,
  isListView = false,
}: {
  selectedColorPrimary?: boolean;
  isSkeleton?: boolean;
  isListView?: boolean;
}) => [
  css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: ${isSkeleton ? 0 : gutters.small}px;
    color: ${greyColor};
    overflow: hidden;
    ${Label} {
      ${singleLineTruncation};
      color: ${selectedColorPrimary ? whiteColor : greyColor};
      text-align: center;
    }
  `,
  isListView &&
    css`
      flex-wrap: nowrap;
      width: 100%;
      div[data-selected="true"] {
        width: 100%;
        max-width: 90%;
        text-align: left;
      }

      ${Label} {
        text-align: left;
      }
    `,
];

const styles = (
  theme: Theme,
  // eslint-disable-next-line default-param-last
  selectedValue = false,
  // eslint-disable-next-line default-param-last
  maxHeight = "395px",
  isDisabled: boolean,
  selectHeight: number,
  error?: boolean,
  borderColor?: string,
  isRightCombinedDropdown?: boolean,
  isLeftCombinedDropdown?: boolean,
  isArrowHidden?: boolean,
  isListView?: boolean,
  mobileHeight?: number
) => ({
  indicatorsContainer: () =>
    isArrowHidden || isListView
      ? css`
          display: none;
        `
      : css`
          display: flex;
          align-items: center;
          height: 100%;
        `,
  indicatorSeparator: () => css`
    display: none;
  `,
  valueContainer: () =>
    valueContainerStyles({
      selectedColorPrimary: Boolean(selectedValue),
      isListView,
    }),
  dropdownIndicator: () => css`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 100%;
    padding-right: 2px;
    color: ${getDropdownIndicatorColor(selectedValue, isDisabled)};
    overflow: hidden;
    ${mqMin.desktop} {
      padding-right: ${gutters.small}px;
    }
  `,
  singleValue: () => [
    singleLineTruncation,
    css`
      width: 90%;
    `,
  ],
  control: () =>
    controlStyles({
      selectHeight,
      error,
      selectedColorPrimary: selectedValue,
      borderColor,
      theme,
      isRightCombinedDropdown,
      isLeftCombinedDropdown,
      mobileHeight,
      isDisabled,
    }),
  option: (_: any, state: OptionState) => [
    css`
      display: block;
      width: 100%;
      padding: ${gutters.small / 2}px ${gutters.small}px;
      background-color: ${state.isSelected || state.isFocused
        ? rgba(theme.colors.primary, 0.05)
        : whiteColor};
      color: ${greyColor};
      white-space: pre-wrap;
      opacity: ${state.isDisabled ? 0.4 : 1};
      :hover {
        background-color: ${state.isDisabled ? "inherit" : rgba(theme.colors.primary, 0.05)};
      }
    `,
  ],
  menu: (baseStyles: any) => [
    baseStyles,
    typographyBody2,
    borderColor &&
      css`
        box-shadow: none;
      `,
    css`
      @keyframes fadeInSelect {
        100% {
          opacity: 1;
          transform: translateY(4px);
        }
      }
      position: absolute;
      left: 0;
      z-index: ${zIndex.z1};
      margin: ${gutters.small / 2}px 0;
      border: 1px solid ${borderColor || rgba(greyColor, 0.5)};
      border-radius: ${borderRadiusSmall};
      width: 100%;
      background-color: ${whiteColor};
      opacity: 0;
      transform: translateY(-8px);
      animation: fadeInSelect 0.2s ease-out forwards;
    `,
    isListView &&
      css`
        top: 34px;
        box-shadow: none;
        border: none;
      `,
  ],
  container: () => [
    !isArrowHidden &&
      css`
        position: relative;
      `,
  ],
  input: () => css`
    position: relative;
    border: none;
  `,
  menuList: (baseStyles: any) => [
    baseStyles,
    css`
      max-height: ${maxHeight};
      padding: 0;
    `,
    isListView &&
      css`
        max-height: ${maxHeight};
      `,
  ],
  placeholder: () => [
    singleLineTruncation,
    css`
      position: absolute;
      display: inline-block;
      flex: 1 1 0;
      width: calc(100% - ${gutters.small * 3 + 5}px);
      color: ${rgba(greyColor, 0.6)};
      font-size: 14px;
    `,
  ],
});

export const LoadingWrapper = styled.div(({ selectHeight }: { selectHeight?: number }) => [
  singleLineTruncation,
  css`
    ${skeletonPulse};
    display: inline-block;
    width: 100%;
    padding: 0 ${gutters.small}px 0 ${gutters.small * 2}px;
    line-height: ${selectHeight}px;
    text-align: center;
  `,
]);

export const SelectLoadingContentWrapper = styled.div([
  css`
    ${skeletonPulse};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    height: 100%;
  `,
]);

const SkeletonListViewItemLoading = styled.div([
  css`
    ${skeletonPulse};
    display: block;
    margin: ${guttersPx.smallHalf} 0;
    width: 100%;
    height: 30px;
  `,
]);

export const SelectLoadingComponent = ({
  selectHeight,
  selectedColorPrimary,
  selectedValue,
  defaultValue,
  className,
  children,
  isListViewSkeleton = false,
  mobileHeight,
}: {
  selectHeight?: number;
  selectedValue?: SelectOption;
  selectedColorPrimary?: boolean;
  isListViewSkeleton?: boolean;
  defaultValue?: SelectOption;
  className?: string;
  children?: React.ReactNode;
  mobileHeight?: number;
}) => {
  return (
    <>
      <div
        css={controlStyles({ selectHeight, isListViewSkeleton, mobileHeight })}
        className={className}
      >
        <SelectLoadingContentWrapper
          css={valueContainerStyles({ selectedColorPrimary, isSkeleton: true })}
        >
          {children || (
            <LoadingWrapper selectHeight={selectHeight}>
              {selectedValue?.nativeLabel || defaultValue?.nativeLabel}
            </LoadingWrapper>
          )}
        </SelectLoadingContentWrapper>
      </div>
      {isListViewSkeleton && (
        <>
          <SkeletonListViewItemLoading />
          <SkeletonListViewItemLoading />
          <SkeletonListViewItemLoading />
        </>
      )}
    </>
  );
};

const Select = ({
  id,
  onChange,
  options,
  selectedValue,
  isSearchable = false,
  components,
  maxHeight,
  defaultValue,
  handleMenuOpen,
  onBlur,
  error,
  isLoading = false,
  placeholder,
  selectedColorPrimary,
  borderColor,
  isDisabled = false,
  selectHeight = 45,
  shouldOpenAfterLoad,
  shouldLoadWhenVisible = false,
  isRightCombinedDropdown = false,
  isLeftCombinedDropdown = false,
  isForceOpen = false,
  isArrowHidden = false,
  isListView = false,
  openMenuOnFocus = true,
  onMenuClose,
  mobileHeight,
  menuPlacement = SelectMenuPlacement.BOTTOM,
}: {
  id: string;
  onChange: (option: SelectOption) => void;
  options: ReadonlyArray<SelectOption>;
  openMenuOnFocus?: boolean;
  selectedValue?: SelectOption;
  isSearchable?: boolean;
  components?: SelectComponents;
  maxHeight?: string;
  defaultValue?: SelectOption;
  handleMenuOpen?: () => void;
  onBlur?: () => void;
  error?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  selectedColorPrimary?: boolean;
  borderColor?: string;
  isDisabled?: boolean;
  selectHeight?: number;
  shouldOpenAfterLoad?: boolean;
  shouldLoadWhenVisible?: boolean;
  isRightCombinedDropdown?: boolean;
  isLeftCombinedDropdown?: boolean;
  isForceOpen?: boolean;
  isArrowHidden?: boolean;
  isListView?: boolean;
  onMenuClose?: () => void;
  mobileHeight?: number;
  menuPlacement?: SelectMenuPlacement;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation();

  const isLazyChunkLoaded = useRef<boolean>(false);

  const includesSearchString = (value: string, searchText: string) =>
    deburr(value.toLowerCase()).includes(deburr(searchText.toLowerCase()));

  const filterOption = (option: any, searchText: string) => {
    return Object.values(option.data).find((value: any) => {
      if (!value) return;
      if (typeof value === "string") {
        // eslint-disable-next-line consistent-return
        return includesSearchString(value, searchText);
      }
      // eslint-disable-next-line consistent-return
      return value.props?.children?.find(
        (prop: any) => typeof prop === "string" && includesSearchString(prop, searchText)
      );
    });
  };
  const [isOpen, setIsOpen] = useState(isForceOpen || isListView);

  const lazyComponent = useMemo(
    () =>
      lazy(() =>
        componentLoader(() =>
          import("react-select")
            .then(c => {
              if (shouldOpenAfterLoad && !isLazyChunkLoaded.current && !isOpen) {
                setIsOpen(true);
              }
              isLazyChunkLoaded.current = true;
              return c;
            })
            // eslint-disable-next-line no-console
            .catch(e => console.error(e))
        )
      ),
    [isOpen, shouldOpenAfterLoad]
  );

  return (
    <OnDemandComponent<ComponentProps<typeof SelectSSR>>
      LazyComponent={lazyComponent}
      SsrOnlyComponent={SelectSSR}
      loading={
        <SelectLoadingComponent
          selectedValue={selectedValue}
          defaultValue={defaultValue}
          selectedColorPrimary={selectedColorPrimary}
          selectHeight={selectHeight}
          isListViewSkeleton={isListView}
          mobileHeight={mobileHeight}
        />
      }
      lazyHydrateProps={shouldLoadWhenVisible ? { whenVisible: true } : { on: "click" }}
      defaultMenuIsOpen={isOpen}
      autoFocus={isOpen}
      onMenuClose={() => {
        onMenuClose?.();
        setIsOpen(false);
      }}
      id={id}
      onChange={onChange}
      options={options}
      value={selectedValue}
      defaultValue={defaultValue}
      isSearchable={isSearchable}
      styles={styles(
        theme,
        selectedColorPrimary,
        maxHeight,
        isDisabled,
        selectHeight,
        error,
        borderColor,
        isRightCombinedDropdown,
        isLeftCombinedDropdown,
        isArrowHidden,
        isListView,
        mobileHeight
      )}
      components={components}
      onMenuOpen={handleMenuOpen}
      filterOption={filterOption}
      onBlur={onBlur}
      noOptionsMessage={() => t("No options")}
      isLoading={isLoading}
      placeholder={placeholder}
      isDisabled={isDisabled}
      // https://github.com/JedWatson/react-select/issues/3832
      // https://app.asana.com/0/1202560546920720/1202660110685200
      openMenuOnFocus={openMenuOnFocus}
      menuPlacement={menuPlacement}
    />
  );
};

export default Select;
