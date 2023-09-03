import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { driverAgeOptions } from "./driverInformationUtils";

import DriverIcon from "components/icons/single-neutral-actions.svg";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import { DisplayType } from "types/enums";
import { NativeSelectPLaceholderBuilderInputType } from "components/ui/Inputs/Dropdown/NativeDropdown";

const StyledDriverIcon = styled(DriverIcon)(
  ({ theme }) => css`
    width: 18px;
    height: 18px;
    fill: ${theme.colors.primary};
  `
);

const DriverAge = ({
  id,
  driverAge,
  setDriverAge,
  height,
  includeIcon = true,
  borderColor,
  className,
  mobileHeight,
  nativeSelectBreakpoint,
  nativeSelectPlaceholderFn,
}: {
  id: string;
  driverAge: number;
  setDriverAge: (driverAge: string) => void;
  height?: number;
  includeIcon?: boolean;
  borderColor?: string;
  className?: string;
  mobileHeight?: number;
  nativeSelectBreakpoint?: DisplayType;
  nativeSelectPlaceholderFn?: NativeSelectPLaceholderBuilderInputType;
}) => (
  <Dropdown
    id={id}
    onChange={setDriverAge}
    options={driverAgeOptions}
    defaultValue={driverAgeOptions[driverAgeOptions.length - 2]}
    selectedValue={String(driverAge)}
    maxHeight="160px"
    icon={includeIcon ? <StyledDriverIcon /> : undefined}
    selectHeight={height}
    borderColor={borderColor}
    shouldLoadWhenVisible
    className={className}
    mobileHeight={mobileHeight}
    nativeSelectBreakpoint={nativeSelectBreakpoint}
    nativeSelectPlaceholderFn={nativeSelectPlaceholderFn}
  />
);

export default DriverAge;
