import styled from "@emotion/styled";
import { css } from "@emotion/core";

import DateRangeDropdown from "../DatePicker/DateRangeDropdown";

import { DateWrapper } from "components/ui/DatePicker/CalendarDropdownDisplay";

export const BookingWidgetDateRangeDropdown = styled(DateRangeDropdown)(
  ({ theme }) =>
    css`
      ${DateWrapper} {
        text-align: center;
        svg {
          position: absolute;
          fill: ${theme.colors.primary};
        }
      }
    `
);

export default BookingWidgetDateRangeDropdown;
