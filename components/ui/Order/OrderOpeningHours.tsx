import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";

import OpeningHours, {
  OpeningHourTitle,
  OpeningHourWrapper,
} from "components/features/Car/CarLocationDetails/OpeningHours";
import { blackColor, fontWeightRegular, gutters } from "styles/variables";
import { mqMin, mqPrint, combineMediaQueries } from "styles/base";

const OrderOpeningHours = styled(OpeningHours)<{}>`
  padding: ${gutters.small / 4}px 0 0 0;
  background: transparent;
  ${OpeningHourTitle} {
    color: ${rgba(blackColor, 0.7)};
    font-weight: ${fontWeightRegular};
  }
  ${combineMediaQueries(mqMin.desktop, mqPrint)} {
    max-width: 85%;
  }

  // compensate line-height for last element to match margins between blocks
  ${OpeningHourWrapper}:last-of-type {
    height: 50px;

    ${mqMin.desktop} {
      height: 25px;
    }
  }
`;

export default OrderOpeningHours;
