import React, { SyntheticEvent, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getDateRangeTitle } from "./utils/datePickerUtils";

import {
  Wrapper,
  DateWrapper,
  Separator,
  Date,
  iconStyles,
  CloseStyled,
} from "components/ui/DatePicker/CalendarDropdownDisplay";
import CheckInIcon from "components/icons/check-in.svg";
import CheckOutIcon from "components/icons/check-out.svg";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const CloseWrapper = styled.span`
  position: absolute;
  top: ${gutters.small / 3}px;
  right: 0;
  ${mqMin.large} {
    position: absolute;
    top: calc(50% - ${gutters.small - 1}px);
    right: -${gutters.small + 1}px;
    display: block;
  }
  ${CloseStyled} {
    display: inline-block;
    padding: ${gutters.small / 2 + 3}px;
  }
`;

const DepartureDateWrapper = styled(DateWrapper)<{ isActive: boolean }>(
  ({ isActive }) =>
    css`
      ${mqMin.large} {
        padding-left: 0;
        &::before {
          left: ${isActive ? "-12px" : "auto"};
        }
      }
    `
);

const ReturnDateWrapper = styled(DateWrapper)<{ isActive: boolean }>(
  ({ isActive }) =>
    css`
      ${mqMin.large} {
        &::before {
          right: ${isActive ? "8px" : "auto"};
        }
      }
    `
);

const MultiDateRangePickerDisplay = ({
  startDate,
  endDate,
  returnStartDate,
  returnEndDate,
  isReturnActive,
  onDepartureClick,
  onReturnClick,
  fromPlaceholder,
  toPlaceholder,
  onClear,
  isCalendarOpen = true,
}: {
  startDate?: string;
  endDate?: string;
  returnStartDate?: string;
  returnEndDate?: string;
  isReturnActive: boolean;
  onDepartureClick?: (e: SyntheticEvent) => void;
  onReturnClick?: (e: SyntheticEvent) => void;
  fromPlaceholder: string;
  toPlaceholder: string;
  onClear?: (e: SyntheticEvent<SVGElement>) => void;
  isCalendarOpen?: boolean;
}) => {
  const onClearClick = useCallback(
    (e: SyntheticEvent<SVGElement>) => {
      e.stopPropagation();
      onClear?.(e);
    },
    [onClear]
  );

  const shouldRenderClearIcon = Boolean(returnStartDate || returnEndDate || startDate || endDate);
  return (
    <Wrapper>
      <DepartureDateWrapper
        onClick={onDepartureClick}
        isActive={!isReturnActive && !!onDepartureClick && isCalendarOpen}
        fullWidth={false}
      >
        <CheckInIcon css={iconStyles} />
        <Date>{getDateRangeTitle(fromPlaceholder, startDate, endDate)}</Date>
      </DepartureDateWrapper>
      <Separator />
      <ReturnDateWrapper
        onClick={onReturnClick}
        isActive={isReturnActive && !!onReturnClick && isCalendarOpen}
        fullWidth={false}
      >
        <CheckOutIcon css={iconStyles} />
        <Date>{getDateRangeTitle(toPlaceholder, returnStartDate, returnEndDate)}</Date>
      </ReturnDateWrapper>
      {shouldRenderClearIcon && (
        <CloseWrapper>{onClear && <CloseStyled onClick={onClearClick} />}</CloseWrapper>
      )}
    </Wrapper>
  );
};

export default MultiDateRangePickerDisplay;
