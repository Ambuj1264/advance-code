import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Date } from "../DatePicker/CalendarDropdownDisplay";

import DesktopRoomAndGuestPicker, {
  DisplayWrapper,
} from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";
import { mqMin } from "styles/base";
import AutocompleteInput, {
  InputStyled,
  AutocompleteInputHalf,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import { gutters, greyColor } from "styles/variables";
import {
  DisplayValue,
  DropdownContainer,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import SearchWidgetDatePicker from "components/ui/SearchWidget/SearchWidgetDatePicker";
import TravellerPicker, {
  ContentDropdownStyled,
} from "components/ui/Inputs/TravellerPicker/TravellerPicker";

const autocompleteLargeStyles = css`
  margin-bottom: ${gutters.small / 2}px;
  white-space: normal;

  ${mqMin.large} {
    margin-bottom: 0;

    ${InputStyled} {
      height: 50px;
      line-height: 50px;
    }

    ${DisplayValue} + ${DropdownContainer} {
      top: 55px;
    }
  }
`;

export const AutocompleteInputLarge = styled(AutocompleteInput)([autocompleteLargeStyles]);

export const AutocompleteInputLargeHalf = styled(AutocompleteInputHalf)(autocompleteLargeStyles);

export const SearchWidgetDatePickerLarge = styled(SearchWidgetDatePicker)`
  ${DisplayValue} {
    height: 38px;
  }

  ${mqMin.large} {
    margin-bottom: 0;
    height: 50px;

    ${DisplayValue} {
      height: 48px;
    }
    ${Date} {
      max-width: 95px;
    }
  }
`;

export const SearchWidgetDatePickerWithTime = styled(SearchWidgetDatePickerLarge)(
  ({ theme }) => css`
    ${mqMin.large} {
      width: 266px;
    }

    ${DropdownContainer} {
      border-bottom-color: ${theme.colors.primary};
    }

    ${DropdownContentWrapper} {
      padding-bottom: 0;
    }
  `
);

export const TravellerPickerLarge = styled(TravellerPicker)<{}>`
  margin-bottom: 0;
  white-space: normal;

  ${mqMin.large} {
    margin-bottom: 0;
    height: 50px;

    ${ContentDropdownStyled} ${DisplayValue} {
      height: 48px;
      padding-right: ${gutters.large / 2}px;
    }
  }
`;

export const DesktopRoomAndGuestPickerLarge = styled(DesktopRoomAndGuestPicker)<{}>`
  margin-bottom: 0;
  white-space: normal;

  ${DisplayValue} {
    border: none;
    height: 42px;
    padding-right: 0;
  }

  ${DisplayWrapper} {
    border: 1px solid ${rgba(greyColor, 0.5)};
    height: 42px;
  }

  ${mqMin.large} {
    margin-bottom: 0;

    ${DisplayValue} {
      height: 50px;
    }

    ${DisplayWrapper} {
      height: 50px;
    }
  }
`;

export const NewDesktopRoomAndGuestPickerLarge = styled(NewDesktopRoomAndGuestPicker)<{}>`
  ${mqMin.large} {
    margin-bottom: 0;

    ${DisplayValue} {
      height: 50px;
    }

    ${DisplayWrapper} {
      height: 50px;
    }
  }
`;
