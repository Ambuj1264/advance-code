import React, {
  ChangeEvent,
  ElementType,
  forwardRef,
  SyntheticEvent,
  useCallback,
  Ref,
} from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { KeyboardKey } from "@travelshift/ui/types/enums";
import Clear from "@travelshift/ui/icons/close.svg";

import LoadingSpinner from "../Loading/LoadingSpinner";

import { mqMin, singleLineTruncation } from "styles/base";
import { useDebouncedCallback } from "hooks/useDebounce";
import { typographyBody2 } from "styles/typography";
import {
  borderRadiusSmall,
  greyColor,
  gutters,
  whiteColor,
  zIndex,
  separatorColorLight,
  redColor,
} from "styles/variables";

const ICON_SIZE = 18;

const getBorderColor = (lighterBorder: boolean, error: boolean) => {
  if (error) return redColor;
  if (lighterBorder) return separatorColorLight;
  return rgba(greyColor, 0.5);
};

export const Wrapper = styled.span<{
  noBorder?: boolean;
  lighterBorder: boolean;
  error: boolean;
}>(({ noBorder, lighterBorder, error }) => [
  css`
    position: relative;
    display: block;
    height: 40px;
    background-color: ${whiteColor};
    line-height: 40px;
    overflow: hidden;

    ${mqMin.large} {
      height: 45px;
      line-height: 45px;
    }
  `,
  !noBorder
    ? css`
        border: 1px solid ${getBorderColor(lighterBorder, error)};
        border-radius: ${borderRadiusSmall};
      `
    : "",
]);

const iconStyles = (theme: Theme) => css`
  position: absolute;
  top: 50%;
  z-index: ${zIndex.z1};
  margin: -9px ${gutters.small - 2}px;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  pointer-events: none;
  fill: ${theme.colors.primary};

  ${mqMin.large} {
    margin: -9px ${gutters.small}px;
  }
`;

const StyledLoadingSpinner = styled(LoadingSpinner)(
  () => css`
    position: absolute;
    top: 0;
    left: ${gutters.small - 2}px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${ICON_SIZE}px;
    height: 100%;

    ${mqMin.large} {
      left: ${gutters.small - 4}px;
    }
  `
);

const StyledInput = styled.input<{ hasIcon: boolean }>([
  typographyBody2,
  singleLineTruncation,
  ({ hasIcon }) => css`
    border: none;
    width: 100%;
    height: inherit;
    padding-left: ${hasIcon ? gutters.small * 3 : gutters.small}px;
    color: ${greyColor};
    line-height: inherit;
    vertical-align: top;

    &::placeholder {
      color: ${rgba(greyColor, 0.6)};
    }

    &:focus {
      outline: none;
    }

    &:read-only {
      cursor: default;
    }
  `,
]);

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

export const ClearIcon = styled(Clear)`
  width: 9px;
  height: 9px;
  fill: ${greyColor};
`;

const Input = (
  {
    className,
    id,
    type = "text",
    onChange,
    onBlur,
    onFocus,
    onClick,
    placeholder,
    name,
    value,
    defaultValue,
    Icon,
    noBorder,
    autocomplete,
    autoFocus = false,
    onKeyDown,
    onKeyPress,
    disabled,
    useDebounce = true,
    debounceWait = 250,
    lighterBorder = false,
    error = false,
    maxLength,
    min,
    readOnly = false,
    inputMode,
    withClearIcon = false,
    isLoading,
  }: {
    className?: string;
    id?: string;
    type?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: SyntheticEvent) => void;
    placeholder?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    Icon?: ElementType;
    noBorder?: boolean;
    autocomplete?: string;
    autoFocus?: boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    useDebounce?: boolean;
    debounceWait?: number;
    lighterBorder?: boolean;
    error?: boolean;
    maxLength?: number;
    min?: number;
    readOnly?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    withClearIcon?: boolean;
    isLoading?: boolean;
  },
  ref: Ref<HTMLInputElement>
) => {
  const inputChange = useCallback(
    e => {
      onChange?.(e);
    },
    [onChange]
  );

  const onInputClear = useCallback(
    e => {
      if (!withClearIcon) return;

      e.preventDefault();
      inputChange(e);
      (ref as React.RefObject<HTMLInputElement>)?.current?.focus?.();
    },
    [withClearIcon, inputChange, ref]
  );

  const debouncedInputChange = useDebouncedCallback(inputChange, debounceWait, true);

  const keyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === KeyboardKey.ArrowDown ||
        event.key === KeyboardKey.ArrowUp ||
        event.key === KeyboardKey.Enter
      ) {
        onKeyDown?.(event);
      }
    },
    [onKeyDown]
  );

  const onDisabledClick = useCallback(
    (e: SyntheticEvent<HTMLSpanElement>) => {
      onClick?.(e);
    },
    [onClick]
  );

  const disabledKeydownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (value) {
        // eslint-disable-next-line no-param-reassign
        event.currentTarget.value = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        event.currentTarget.value = "";
      }
      event.currentTarget.blur();
    },
    [value]
  );

  const defaultKeydownHandler = disabled ? disabledKeydownHandler : undefined;

  return (
    <Wrapper
      error={error}
      className={className}
      noBorder={noBorder}
      onClick={disabled ? onDisabledClick : undefined}
      lighterBorder={lighterBorder}
    >
      {Icon &&
        (isLoading ? (
          <StyledLoadingSpinner
            size={{ height: ICON_SIZE, width: ICON_SIZE }}
            animationSpeed={0.8}
            borderWidth={2}
          />
        ) : (
          <Icon css={iconStyles} />
        ))}
      <StyledInput
        id={id}
        readOnly={readOnly}
        ref={ref}
        key={defaultValue}
        name={name}
        type={type}
        onChange={useDebounce ? debouncedInputChange : inputChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        placeholder={defaultValue ? undefined : placeholder}
        defaultValue={defaultValue}
        hasIcon={!!Icon}
        autoComplete={autocomplete}
        onKeyDown={autoFocus ? keyDownHandler : defaultKeydownHandler}
        onKeyPress={onKeyPress}
        autoFocus={autoFocus}
        disabled={disabled}
        {...(value !== undefined ? { value } : null)}
        maxLength={maxLength}
        min={min}
        {...(inputMode ? { inputMode } : null)}
      />
      {withClearIcon && value !== undefined && value !== "" && (
        <ClearWrapper onClick={onInputClear}>
          <ClearIcon />
        </ClearWrapper>
      )}
    </Wrapper>
  );
};

export default forwardRef(Input);
