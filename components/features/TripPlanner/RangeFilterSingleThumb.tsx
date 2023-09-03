import React, { useState, ChangeEvent, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { rangedSliderStyles, StyledReactSlider } from "components/ui/Filters/RangeFilterBaseNew";
import { typographyBody2, typographyCaption } from "styles/typography";
import {
  fontSizeCaptionSmall,
  greyColor,
  gutters,
  separatorColor,
  whiteColor,
} from "styles/variables";
import { mqMin } from "styles/base";

const Label = styled.p`
  ${typographyCaption};
  color: ${greyColor};
  line-height: ${gutters.large}px;

  ${mqMin.medium} {
    ${typographyBody2};
  }

  ${mqMin.large} {
    line-height: ${gutters.small * 2}px;
  }
`;

const Container = styled.span<{
  isFirst?: boolean;
}>(({ isFirst }) => [
  css`
    display: flex;
    justify-content: space-between;
    margin-top: ${isFirst ? 0 : gutters.large + gutters.small}px;
    line-height: 32px;
    align-content: center;
  `,
]);

const InputWrapper = styled.span<{
  noBorder?: boolean;
}>(({ noBorder }) => [
  css`
    display: inline-block;
    width: 26px;
    height: 26px;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  `,
  !noBorder
    ? css`
        border: 1px solid ${separatorColor};
      `
    : "",
]);

const StyledInput = styled.input`
  border: none;
  width: 100%;
  height: calc(100% - 2px);
  color: ${greyColor};
  line-height: inherit;
  text-align: center;
  vertical-align: top;

  &::placeholder {
    color: ${greyColor};
  }

  &:focus {
    outline: none;
  }
`;

const rangedSliderMarks = css`
  &:before {
    content: "";
    position: absolute;
    bottom: calc(50% - 34px);
    margin-left: 16px;
    width: calc(100% - ${gutters.large}px);
    height: 1px;
    background-color: ${separatorColor};
  }
`;

const rangedSingleSliderStyles = (
  theme: Theme,
  disabled: boolean,
  incrementMarkValue?: number,
  resetMarkValue?: number,
  overrideFirstMarkerValue?: boolean
) => [
  css`
    position: relative;
    counter-reset: mark ${resetMarkValue || ""};

    &.disabled {
      cursor: auto;
    }

    .track-1 {
      background: ${separatorColor};
    }
    .track-0 {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      background: ${disabled ? separatorColor : theme.colors.primary};
    }
    .marks {
      bottom: calc(50% - 40px);
      margin-left: ${gutters.small / 2}px;
      width: 15px;
      height: 14px;
      background-color: ${whiteColor};
      color: ${greyColor};
      font-size: ${fontSizeCaptionSmall};
      text-align: center;
      &:before {
        content: counter(mark);
        counter-increment: mark ${incrementMarkValue || ""};
      }
    }
  `,
  overrideFirstMarkerValue
    ? css`
        .marks {
          &:first-of-type {
            &:before {
              content: "1";
            }
          }
        }
      `
    : "",
];

const RangeFilterSingleThumb = ({
  theme,
  disabled = false,
  min,
  max,
  step = 1,
  labelText,
  hideMarks = false,
  inputEnabled = false,
  marks,
  incrementMarkValue,
  resetMarkValue,
  overrideFirstMarkerValue = true,
  isFirst,
  onChange,
}: {
  theme: Theme;
  disabled?: boolean;
  min: number;
  max: number;
  step?: number;
  labelText: string;
  hideMarks?: boolean;
  inputEnabled?: boolean;
  marks?: number[] | number;
  incrementMarkValue?: number;
  resetMarkValue?: number;
  overrideFirstMarkerValue?: boolean;
  isFirst?: boolean;
  onChange: (value: number) => void;
}) => {
  const [currentValue, setCurrentValue] = useState(min);

  const setValue = useCallback(
    (value: number) => {
      setCurrentValue(value);
      onChange(value);
    },
    [onChange]
  );

  const handleInputChange = (event?: ChangeEvent<HTMLInputElement>) => {
    if (event && event.target.value) {
      const inputValue = Number(event.target.value);
      if (inputEnabled && inputValue <= max && inputValue >= min) setValue(inputValue);
    }
  };

  return (
    <>
      <Container isFirst={isFirst}>
        <Label>{labelText}</Label>
        <InputWrapper noBorder={!inputEnabled}>
          <StyledInput
            type="number"
            readOnly={!inputEnabled && !disabled}
            min={min}
            max={max}
            maxLength={2}
            value={currentValue}
            onChange={handleInputChange}
          />
        </InputWrapper>
      </Container>
      <StyledReactSlider
        css={[
          rangedSliderStyles(theme, disabled),
          rangedSingleSliderStyles(
            theme,
            disabled,
            incrementMarkValue,
            resetMarkValue,
            overrideFirstMarkerValue
          ),
          !hideMarks ? rangedSliderMarks : undefined,
        ]}
        onChange={(value: number) => setValue(value)}
        withTracks
        step={step}
        min={min}
        max={max}
        marks={hideMarks || marks ? marks : true}
        markClassName="marks"
        thumbClassName="thumb"
        disabled={disabled}
        value={currentValue}
      />
    </>
  );
};

export default RangeFilterSingleThumb;
