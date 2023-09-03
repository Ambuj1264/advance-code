import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";

import DateRangeDropdown from "../DatePicker/DateRangeDropdown";

import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";

const SearchWidgetDatePicker = styled(DateRangeDropdown)`
  margin: 0;
  border: 1px solid ${rgba(greyColor, 0.5)};
  border-radius: ${borderRadiusSmall};
  padding: 0;
  background-color: ${whiteColor};

  ${mqMin.large} {
    margin: 0 0 ${gutters.small / 2}px 0;
    padding: 0;
  }

  ${DropdownContainer} {
    right: auto;
  }

  ${DisplayValue} {
    margin: 0;
    border: none;
    height: 40px;
    background: none;
  }
`;

export default SearchWidgetDatePicker;
