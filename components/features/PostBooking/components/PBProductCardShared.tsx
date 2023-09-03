import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import DirectionIcon from "components/icons/diagram-arrow-corner-point-right-square.svg";
import BookingIcon from "components/icons/tags-check.svg";
import PhoneIcon from "components/icons/phone-simple.svg";
import LocationUserIcon from "components/icons/location-user-colorized.svg";
import DownloadThick from "components/icons/download-thick.svg";
import TravelplanIcon from "components/icons/vacation-widget-icon.svg";
import { buttercupColor, whiteColor } from "styles/variables";

export const StyledDirection = styled(DirectionIcon)`
  fill: ${whiteColor};
`;

export const StyledTravelplanIcon = styled(TravelplanIcon)`
  fill: ${whiteColor};
`;

export const StyledBookingIcon = styled(BookingIcon)`
  fill: ${whiteColor};
`;

export const StyledDownloadIcon = styled(DownloadThick)`
  fill: ${whiteColor};
`;

export const StyledPhoneIcon = styled(PhoneIcon)`
  fill: ${whiteColor};
`;

export const StyledLocationUserIcon = styled(LocationUserIcon)(
  ({ theme }) => `
  .location-user-colorized_svg__user {
    fill: ${buttercupColor};
  }

  .location-user-colorized_svg__circle {
    fill: ${rgba(theme.colors.primary, 0.2)};
  }
`
);
