import React, { ReactNode, SyntheticEvent, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Close from "@travelshift/ui/icons/close.svg";

import { DateRangeEnum } from "./utils/datePickerUtils";

import { singleLineTruncation } from "styles/base";
import CheckInIcon from "components/icons/check-in.svg";
import CheckOutIcon from "components/icons/check-out.svg";
import { gutters, greyColor, borderRadiusSmall, whiteColor, zIndex } from "styles/variables";
import { typographyBody2 } from "styles/typography";

export const Wrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
`;

export const DateWrapper = styled.span<{
  isActive: boolean;
  fullWidth: boolean;
}>([
  typographyBody2,
  ({ fullWidth }) => css`
    position: relative;
    display: flex;
    flex-basis: ${fullWidth ? "auto" : "50%"};
    align-items: center;
    width: ${fullWidth ? "100%" : "auto"};
    min-width: calc(50% - 0.5px);
    height: 100%;
    padding: ${gutters.small / 4}px 0 ${gutters.small / 4}px ${gutters.small}px;
    color: ${greyColor};
  `,
  ({ isActive }) =>
    isActive &&
    (({ theme }) => css`
      &::before {
        content: "";
        position: absolute;
        top: 5px;
        right: 5px;
        bottom: 6px;
        left: 5px;
        border-radius: ${borderRadiusSmall};
        background: ${rgba(theme.colors.primary, 0.1)};
      }
    `),
]);

export const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 24px;
  background-color: ${rgba(greyColor, 0.5)};
`;

export const Date = styled.span`
  ${singleLineTruncation};
  display: block;
  margin-left: ${gutters.small / 2}px;
  width: 80%;
  padding-left: ${gutters.small / 2}px;
`;

export const iconStyles = (theme: Theme) => css`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: ${theme.colors.primary};
`;

export const CloseStyled = styled(Close, { shouldForwardProp: () => true })<{
  onClick: (e: SyntheticEvent<SVGElement>) => void;
}>`
  position: relative;
  z-index: ${zIndex.z1};
  width: 31px;
  height: 31px;
  padding: 10px;
  fill: ${greyColor};
`;

const CalendarDropdownDisplay = ({
  className,
  from,
  to,
  fromPlaceholder,
  toPlaceholder,
  onFromClick,
  onToClick,
  activeInput,
  onClear,
  showDateFrom = true,
  showDateTo = true,
}: {
  className?: string;
  from?: string | ReactNode;
  to?: string | ReactNode;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  onFromClick?: (e: SyntheticEvent) => void;
  onToClick?: (e: SyntheticEvent) => void;
  activeInput?: DateRangeEnum;
  onClear?: (e: SyntheticEvent<SVGElement>) => void;
  showDateFrom?: boolean;
  showDateTo?: boolean;
}) => {
  const onClearClick = useCallback(
    (e: SyntheticEvent<SVGElement>) => {
      e.stopPropagation();
      onClear?.(e);
    },
    [onClear]
  );

  return (
    <Wrapper className={className}>
      {showDateFrom && (
        <DateWrapper
          data-testid="calendar-dd-dateFrom"
          onClick={onFromClick}
          isActive={DateRangeEnum.onFromActive === activeInput && !!onFromClick}
          fullWidth={!showDateTo}
        >
          <CheckInIcon css={iconStyles} />
          <Date>{from || fromPlaceholder}</Date>
        </DateWrapper>
      )}
      {showDateFrom && showDateTo && <Separator />}
      {showDateTo && (
        <DateWrapper
          data-testid="calendar-dd-dateTo"
          onClick={onToClick}
          isActive={DateRangeEnum.onToActive === activeInput && !!onToClick}
          fullWidth={!showDateFrom}
        >
          <CheckOutIcon css={iconStyles} />
          <Date>{to || toPlaceholder}</Date>
          {onClear && <CloseStyled onClick={onClearClick} />}
        </DateWrapper>
      )}
    </Wrapper>
  );
};

export default CalendarDropdownDisplay;
