import React from "react";
import { useMediaQuery } from "react-responsive";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { useOnSetOccupancies } from "./stayHooks";

import { breakpointsMax, gutters } from "styles/variables";
import NewMobileRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewMobileRoomAndGuestPicker";
import NewDesktopRoomAndGuestPicker, {
  DisplayWrapper,
} from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";
import { container } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div(({ theme }) => [
  container,
  css`
    margin-top: ${gutters.large}px;
    ${DisplayWrapper} {
      text-align: center;
      svg {
        position: absolute;
        fill: ${theme.colors.primary};
      }
    }
  `,
]);

const StayRoomAndGuestPicker = ({
  onlyGuestSelection = false,
}: {
  onlyGuestSelection?: boolean;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { occupancies } = useStayBookingWidgetContext();
  const onSetOccupancies = useOnSetOccupancies();
  return isMobile ? (
    <NewMobileRoomAndGuestPicker
      occupancies={occupancies}
      onlyGuestSelection={onlyGuestSelection}
      onSetOccupancies={onSetOccupancies}
    />
  ) : (
    <Wrapper>
      <NewDesktopRoomAndGuestPicker
        occupancies={occupancies}
        shouldDisplayArrowIcon={false}
        onlyGuestSelection={onlyGuestSelection}
        onSetOccupancies={onSetOccupancies}
        travelerLabel={t("Travelers")}
        roomLabel={t("Rooms")}
        dataTestid="guest-room"
      />
    </Wrapper>
  );
};

export default StayRoomAndGuestPicker;
