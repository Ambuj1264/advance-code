import React, {
  ElementType,
  ChangeEvent,
  useCallback,
  cloneElement,
  useState,
  SyntheticEvent,
  ReactElement,
  ComponentProps,
  ReactNode,
  useEffect,
} from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { KeyboardKey } from "@travelshift/ui/types/enums";
import Clear from "@travelshift/ui/icons/close.svg";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import ContentDropdown, {
  DisplayValue,
  DropdownContainer,
  DropdownContentWrapper,
  ContentWrapper,
} from "../ContentDropdown";
import Input from "../Input";

import { AutoCompleteType } from "types/enums";
import Tooltip from "components/ui/Tooltip/Tooltip";
import useInputFocusTrap from "hooks/useInputFocusTrap";
import { mqMin, singleLineTruncation, mqMax } from "styles/base";
import {
  greyColor,
  lightBlueColor,
  gutters,
  whiteColor,
  borderRadiusSmall,
  boxShadowStrong,
  fontSizeBody2,
  fontWeightSemibold,
} from "styles/variables";
import { typographyBody1, typographyBody2 } from "styles/typography";
import { capitalize } from "utils/globalUtils";
import useActiveLocale from "hooks/useActiveLocale";
import useEffectOnce from "hooks/useEffectOnce";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const TravelerIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const PlaneTakeoff = CustomNextDynamic(() => import("components/icons/plane-take-off.svg"), {
  loading: IconLoading,
});
const AirportIcon = CustomNextDynamic(() => import("components/icons/airport.svg"), {
  loading: IconLoading,
});
const PlaneLand = CustomNextDynamic(() => import("components/icons/plane-land.svg"), {
  loading: IconLoading,
});
const HotelIcon = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});
const LocationIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});
const TrainStationIcon = CustomNextDynamic(() => import("components/icons/train-station.svg"), {
  loading: IconLoading,
});
const CameraIcon = CustomNextDynamic(() => import("components/icons/camera-1.svg"), {
  loading: IconLoading,
});

const HotelIconStyled = styled(HotelIcon)`
  width: 16px;
`;

const LocationIconStyled = styled(LocationIcon)`
  width: 11px;
`;

const ICONS_MAP = {
  [AutoCompleteType.CITY]: LocationIconStyled,
  [AutoCompleteType.HOTEL]: HotelIconStyled,
  [AutoCompleteType.AIRPORT]: AirportIcon,
  [AutoCompleteType.PLANE_TAKEOFF]: PlaneTakeoff,
  [AutoCompleteType.PLANE_LAND]: PlaneLand,
  [AutoCompleteType.TRAIN_STATION]: TrainStationIcon,
  [AutoCompleteType.PRODUCT]: TravelerIcon,
  [AutoCompleteType.ATTRACTION]: CameraIcon,
};

const getListItemIcon = (type: AutoCompleteType, useProduct: boolean): ElementType => {
  const useIconMap =
    (type === AutoCompleteType.PRODUCT && useProduct) || type !== AutoCompleteType.PRODUCT;
  if (useIconMap) {
    return ICONS_MAP[type] ?? LocationIconStyled;
  }
  return LocationIconStyled;
};

const Wrapper = styled.div``;

const DisplayWrapper = styled.div`
  position: relative;
`;

export const ClearWrapper = styled.div`
  position: absolute;
  top: calc(50% - 15px);
  right: 0;
  bottom: calc(50% - 15px);
  display: flex;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 10px;
  cursor: pointer;
`;

const ClearIcon = styled(Clear)`
  width: 9px;
  height: 9px;
  fill: ${greyColor};
`;

export const ContentDropdownStyled = styled(ContentDropdown)<{
  fullWidth?: boolean;
  halfWidth: boolean;
  isWideDropdown?: boolean;
  shouldCapitalizeOptions: boolean;
}>(({ fullWidth, halfWidth, isWideDropdown, shouldCapitalizeOptions }) => [
  css`
    margin: 0;
    border: none;
    border-radius: unset;
    padding: 0;
    background-color: unset;

    ${mqMin.large} {
      padding: 0;
    }

    ${DisplayValue} {
      display: block;
      margin: 0;
      border: none;
      border-radius: unset;
      height: auto;
      padding: 0;
      background: none;
      cursor: unset;
    }

    ${DropdownContainer} {
      top: 50px;
      left: 0;
      ${mqMax.large} {
        margin-left: -${gutters.small}px;
        width: ${isWideDropdown ? "100vw" : "100%"};
        min-height: 70vh;
      }
      ${mqMin.large} {
        width: 100%;
      }
      a {
        &:first-letter {
          text-transform: ${shouldCapitalizeOptions ? "capitalize" : "none"};
        }
      }
    }
    ${DropdownContentWrapper} {
      padding: 0;
    }
  `,
  halfWidth
    ? css`
        ${ContentWrapper} {
          position: static;
        }
        ${DropdownContentWrapper} {
          box-shadow: ${boxShadowStrong};
          border-radius: ${borderRadiusSmall};
          width: 100%;
          background-color: ${whiteColor};
        }
      `
    : "",
  fullWidth
    ? css`
        ${DropdownContainer} {
          box-shadow: none;
          border: none;
          border-radius: unset;
        }
      `
    : "",
]);

export const InputStyled = styled(Input, { shouldForwardProp: () => true })<{
  Icon?: ElementType;
}>(
  ({ Icon }) =>
    css`
      @supports (-webkit-appearance: none) {
        input {
          -webkit-appearance: none;
        }
      }
      width: 100%;
      input {
        font-size: ${fontSizeBody2};
      }
      input:disabled {
        background-color: ${whiteColor};
        opacity: 1;
        -webkit-text-fill-color: currentcolor;
      }
      [type="search"]::-webkit-search-cancel-button {
        -webkit-appearance: none;
      }
      input {
        width: calc(100% - 20px);
        padding-left: ${Icon ? gutters.small * 2.5 : gutters.small}px;
      }
      /* hack to prevent IOS zooming while keeping 14px font */
      /* stylelint-disable order/order */
      @supports (-webkit-touch-callout: none) {
        ${mqMax.large} {
          input {
            z-index: 0;
            width: calc(112%);
            padding-top: 15px;
            padding-left: ${gutters.small * 3 + 3}px;
            font-size: 18px;
            transform: scale(0.7899);
            transform-origin: top left;
          }
        }
      }
    `
);

const listItemStyles = (skipIcon: boolean, isActive?: boolean) => [
  singleLineTruncation,
  isActive && `background-color: ${rgba(lightBlueColor, 0.1)};`,
  css`
    ${typographyBody1};
    position: relative;
    display: block;
    padding: ${gutters.large / 2}px;
    padding-left: ${skipIcon ? gutters.large : gutters.large * 2}px;
    color: ${greyColor};
    font-weight: 600;
    line-height: 24px;
    &:first-of-type {
      border-top: none;
    }
    &:hover {
      background-color: ${rgba(lightBlueColor, 0.1)};
    }
    svg {
      position: absolute;
      top: 50%;
      left: ${gutters.large}px;
      height: 16px;
      transform: translate(-50%, -50%);
      fill: ${greyColor};
    }
    ${mqMin.large} {
      ${typographyBody2};
      font-weight: ${fontWeightSemibold};
    }
  `,
];

export const DefaultListItem = styled.a<{
  skipIcon: boolean;
  isActive?: boolean;
}>(({ isActive, skipIcon }) => listItemStyles(skipIcon, isActive));

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const AutocompleteInput = ({
  id,
  className,
  onInputChange,
  onItemClick,
  onInputClick,
  onCloseDropdown,
  onOpenDropdown,
  placeholder,
  listItems,
  ListIcon,
  ListItemComponent = DefaultListItem,
  fullWidth,
  isOpen = false,
  disabled = false,
  value,
  defaultValue,
  hideMobileKeyboard,
  halfWidth = false,
  isWideDropdown = true,
  inputAutocompleteIconType,
  readOnly = false,
  forceFocus = false,
  defaultAutocompleteIconType = AutoCompleteType.CITY,
  selectFirstOnBlur = true,
  onBlur,
  skipIcon = false,
  useProduct = false,
  shouldCapitalizeFirstLetter = true,
  originInputRef,
  onKeyPress,
  debounceWaitTime = 300,
  hasError,
  isInputLoading,
  disableAutoSelectProductOnKeyDown = false,
}: {
  id: string;
  className?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onItemClick?: (item?: SharedTypes.AutocompleteItem) => void;
  onInputClick?: (event: SyntheticEvent) => void;
  onCloseDropdown?: () => void;
  onOpenDropdown?: () => void;
  listItems?: SharedTypes.AutocompleteItem[];
  placeholder?: string;
  ListIcon?: ElementType;
  ListItemComponent?: ElementType;
  fullWidth?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  hideMobileKeyboard?: boolean;
  halfWidth?: boolean;
  isWideDropdown?: boolean;
  defaultAutocompleteIconType?: AutoCompleteType;
  inputAutocompleteIconType?: AutoCompleteType;
  readOnly?: boolean;
  forceFocus?: boolean;
  selectFirstOnBlur?: boolean;
  onBlur?: () => void;
  skipIcon?: boolean;
  useProduct?: boolean;
  shouldCapitalizeFirstLetter?: boolean;
  originInputRef?: React.MutableRefObject<VacationPackageTypes.originInputRef>;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  debounceWaitTime?: number;
  hasError?: boolean;
  isInputLoading?: boolean;
  disableAutoSelectProductOnKeyDown?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const [isAutocompleteOpen, setIsOpen] = useState(isOpen || forceFocus);
  const [defaultInputValue, setDefaultInputValue] = useState(defaultValue);
  const prevDefaultValue = usePreviousState(defaultValue);
  const inputRef = useInputFocusTrap({
    condition: isAutocompleteOpen || forceFocus,
  });
  const [scrollWidth, setScrollWidth] = useState(0);
  const [elementWidth, setElementWidth] = useState(0);
  const canClear = (defaultInputValue?.length ?? 0) > 0;
  const shouldShowTooltip = !isAutocompleteOpen && scrollWidth > elementWidth;
  const inputCleared = prevDefaultValue !== "" && defaultInputValue === "";
  const [iconType, setIconType] = useState<AutoCompleteType>(defaultAutocompleteIconType);

  useEffect(() => {
    setIconType(inputAutocompleteIconType as AutoCompleteType);
  }, [inputAutocompleteIconType]);

  const AutocompleteInputIcon = inputCleared
    ? getListItemIcon(defaultAutocompleteIconType, useProduct)
    : getListItemIcon(iconType || defaultAutocompleteIconType, useProduct);

  const onItemSelection = useCallback(
    (inputValue?: SharedTypes.AutocompleteItem) => {
      if (onItemClick) onItemClick(inputValue);
      setDefaultInputValue(inputValue?.name);
    },
    [onItemClick]
  );

  const closeDropdown = useCallback(() => {
    if (isAutocompleteOpen) {
      setIsOpen(false);
      onCloseDropdown?.();
    }
  }, [isAutocompleteOpen, onCloseDropdown]);

  const onOutsideClick = useCallback(() => {
    if (isAutocompleteOpen && listItems?.length && selectFirstOnBlur) {
      const firstResult = listItems[0];
      const selectedIndex = listItems.findIndex(({ name }) => name === defaultInputValue);
      if (selectedIndex === -1 && inputRef.current?.value !== "") {
        onItemSelection(firstResult);
      } else {
        const selectedItem = listItems[selectedIndex];
        if (useProduct && selectedItem?.type === AutoCompleteType.PRODUCT) {
          onItemSelection(selectedItem);
        }
      }
    }
    closeDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutocompleteOpen, listItems, closeDropdown, inputRef, defaultInputValue, onItemSelection]);

  const openDropdown = useCallback(() => {
    if (!isAutocompleteOpen && !disabled) {
      setIsOpen(true);
      onOpenDropdown?.();
    }
  }, [disabled, isAutocompleteOpen, onOpenDropdown]);

  useEffectOnce(() => {
    if (!originInputRef) return;
    // eslint-disable-next-line no-param-reassign
    originInputRef.current = {
      openDropdown,
    };
  });

  const onChange = useCallback(
    e => {
      if (disabled) return;
      openDropdown();
      onInputChange?.(e);
      if (e.target.value === "") {
        setDefaultInputValue(e.target.value);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    },
    [disabled, inputRef, onInputChange, openDropdown]
  );

  const onKeyboardChange = useCallback(
    (inputValue?: SharedTypes.AutocompleteItem) => {
      setDefaultInputValue(inputValue?.name);
    },
    [setDefaultInputValue]
  );

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (disabled || !listItems) return;
      const selectedIndex = listItems.findIndex(({ name }) => name === defaultInputValue) ?? 0;

      if (selectedIndex === undefined || !isAutocompleteOpen) return;

      if (event.key === KeyboardKey.ArrowDown) {
        const updatedItem = listItems[(selectedIndex + 1) % listItems.length];
        if (
          disableAutoSelectProductOnKeyDown ||
          (useProduct && updatedItem?.type === AutoCompleteType.PRODUCT)
        ) {
          onKeyboardChange(updatedItem);
        } else {
          onItemSelection(updatedItem);
        }
      } else if (event.key === KeyboardKey.ArrowUp) {
        const updatedItem = listItems[(selectedIndex - 1) % listItems.length];
        if (useProduct && updatedItem?.type === AutoCompleteType.PRODUCT) {
          onKeyboardChange(updatedItem);
        } else {
          onItemSelection(updatedItem);
        }
      } else if (event.key === KeyboardKey.Enter) {
        const updatedItem = listItems[selectedIndex];
        if (useProduct && updatedItem?.type === AutoCompleteType.PRODUCT) {
          onItemSelection(updatedItem);
        }
        closeDropdown();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeDropdown, defaultInputValue, disabled, isAutocompleteOpen, listItems, onItemSelection]
  );

  const onListItemClick = useCallback(
    e => {
      const inputValueId = e.currentTarget.dataset.id;
      const inputValue = listItems?.find(({ id: itemId }) => itemId === inputValueId);
      onItemSelection(inputValue);
      setIsOpen(false);
    },
    [listItems, onItemSelection]
  );

  const onInputClear = useCallback(
    event => {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign,functional/immutable-data
      event.target.value = "";
      onInputChange?.(event);
      setDefaultInputValue(event.target.value);
      setElementWidth(0);
      setScrollWidth(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [inputRef, onInputChange]
  );

  useEffect(() => {
    if (isAutocompleteOpen) return;

    if (prevDefaultValue !== defaultValue) {
      setDefaultInputValue(defaultValue);
    }
    if (inputRef?.current) {
      const element = Math.ceil(inputRef?.current?.getBoundingClientRect().width) ?? 0;
      const scroll = inputRef?.current?.scrollWidth ?? 0;
      if (element !== elementWidth) {
        setElementWidth(element);
      }
      if (scroll !== scrollWidth) {
        setScrollWidth(scroll);
      }
    }
  }, [
    inputRef,
    isAutocompleteOpen,
    elementWidth,
    scrollWidth,
    prevDefaultValue,
    defaultInputValue,
    defaultValue,
    placeholder,
  ]);
  const AutocompleteIcon = isAutocompleteOpen ? ListIcon : AutocompleteInputIcon;

  const maybeCapitalizedDefaultValue =
    shouldCapitalizeFirstLetter && defaultInputValue
      ? capitalize(defaultInputValue, activeLocale)
      : defaultInputValue;

  return (
    <Wrapper className={className}>
      <ContentDropdownStyled
        id={`${id}Autocomplete`}
        className={className}
        displayValue={
          <DisplayWrapper>
            <Tooltip title={maybeCapitalizedDefaultValue} alwaysTop isVisible={shouldShowTooltip}>
              <InputStyled
                Icon={skipIcon ? undefined : AutocompleteIcon}
                isLoading={isInputLoading}
                onChange={onChange}
                onClick={e => {
                  if (listItems) openDropdown();
                  onInputClick?.(e);
                  const target = e.target as HTMLInputElement;
                  // eslint-disable-next-line no-prototype-builtins
                  target.select?.();
                }}
                defaultValue={maybeCapitalizedDefaultValue}
                value={value}
                placeholder={placeholder}
                ref={inputRef}
                autocomplete="chrome-off"
                autoFocus={isAutocompleteOpen}
                onKeyDown={onKeyDownHandler}
                onBlur={onBlur}
                disabled={disabled && hideMobileKeyboard}
                debounceWait={debounceWaitTime}
                onKeyPress={onKeyPress}
                readOnly={readOnly}
                type="search"
                error={hasError}
              />
              {canClear && (
                <ClearWrapper onClick={onInputClear}>
                  <ClearIcon />
                </ClearWrapper>
              )}
            </Tooltip>
          </DisplayWrapper>
        }
        isContentOpen={isAutocompleteOpen && Boolean(listItems?.length)}
        onOutsideClick={onOutsideClick}
        toggleContent={noop}
        shouldDisplayArrowIcon={false}
        fullWidth={fullWidth}
        halfWidth={halfWidth}
        isWideDropdown={isWideDropdown}
        shouldCapitalizeOptions={shouldCapitalizeFirstLetter}
      >
        <div>
          {listItems?.map(listItem => {
            const { id: itemId, name } = listItem;
            const isActive = name === defaultInputValue;
            const Icon = getListItemIcon(listItem.type as AutoCompleteType, useProduct);

            return cloneElement(
              <ListItemComponent />,
              {
                key: itemId,
                onClick: onListItemClick,
                css: listItemStyles(skipIcon, isActive),
                "data-id": itemId,
                isActive,
                skipIcon,
              },
              [
                <React.Fragment key={itemId}>
                  {!skipIcon && <Icon />}
                  {listItem.name}
                </React.Fragment>,
              ]
            );
          })}
        </div>
      </ContentDropdownStyled>
    </Wrapper>
  );
};

type AutocompleteProps = ComponentProps<typeof AutocompleteInput>;
export type AutocompleteStyled = StyledComponent<AutocompleteProps, AutocompleteProps, Theme>;

export const Separator = styled.span`
  position: absolute;
  top: 8px;
  left: 50%;
  z-index: 1;
  width: 1px;
  height: 24px;
  background-color: ${rgba(greyColor, 0.5)};

  ${mqMin.large} {
    top: 13px;
  }
`;

export const AutocompleteInputHalf = styled(AutocompleteInput)`
  width: 100%;
  ${Separator} + & {
    margin-left: -2px;
  }
  ${InputStyled} {
    input {
      min-width: calc(100% - 20px);
    }
  }
`;

const LocationSelectWrapper = styled.div<{
  component?: AutocompleteStyled;
}>(
  ({ component = AutocompleteInputHalf }: { component?: AutocompleteStyled }) => css`
    position: relative;
    display: flex;
    justify-content: space-between;
    ${component}:not(:only-of-type) {
      flex-basis: 50%;

      &:first-of-type {
        ${InputStyled} {
          border-right: none;
          border-top-right-radius: unset;
          border-bottom-right-radius: unset;
        }
      }

      &:last-of-type {
        ${InputStyled} {
          margin-left: -1px;
          border-left: none;
          border-top-left-radius: unset;
          border-bottom-left-radius: unset;
        }
      }
    }
  `
);

export const AutocompleteDoubleWrapper = ({
  children,
  className,
  styledAutocompleteComponent,
}: {
  children: ReactNode;
  className?: string;
  styledAutocompleteComponent?: AutocompleteStyled;
}) => {
  const isSingle = React.Children.toArray(children).filter(Boolean).length === 1;

  return (
    <LocationSelectWrapper className={className} component={styledAutocompleteComponent}>
      {isSingle ? (
        children
      ) : (
        <>
          {(children as ReactElement[])[0]}
          <Separator />
          {(children as ReactElement[])[1]}
        </>
      )}
    </LocationSelectWrapper>
  );
};

export default AutocompleteInput;
