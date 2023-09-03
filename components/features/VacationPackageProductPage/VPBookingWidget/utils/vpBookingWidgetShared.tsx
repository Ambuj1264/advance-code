import styled from "@emotion/styled";
import { css } from "@emotion/core";

import VPBookingProductSkeleton from "../VPBookingProductSkeleton";

import BookingWidgetDropdown from "components/ui/BookingWidget/BookingWidgetDropdown";
import { DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { fontSizeBody2, gutters, guttersPx } from "styles/variables";
import { BookingWidgetLabel } from "components/ui/BookingWidget/BookingWidgetControlRow";

export const StyledBookingWidgetDropdown = styled(BookingWidgetDropdown)(
  ({ theme }) => css`
    ${DropdownContainer} {
      top: 50px;
      border-color: ${theme.colors.primary};
    }
  `
);
export const StyledVPBookingProductSkeleton = styled(VPBookingProductSkeleton)`
  &:first-of-type {
    border: none;
    padding-top: ${gutters.small / 2}px;
  }
`;

export const StyledBookingWidgetLabel = styled(BookingWidgetLabel)`
  display: flex;
  align-items: center;
  margin-top: ${guttersPx.smallHalf};
  font-size: ${fontSizeBody2};
`;

export const bookingWidgetLabelIconStyles = ({ theme }: { theme?: Theme }) => css`
  margin-right: ${gutters.small / 2}px;
  height: 16px;
  fill: ${theme?.colors.primary};
`;
