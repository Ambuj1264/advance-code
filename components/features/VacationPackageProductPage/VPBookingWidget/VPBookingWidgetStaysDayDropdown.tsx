import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { findSelectedStayByDay, getVPModalProductId } from "../utils/vacationPackageUtils";

import { getStayDropdownType } from "./utils/vpBookingWidgetHooks";
import { StyledBookingWidgetDropdown } from "./utils/vpBookingWidgetShared";

import { Namespaces } from "shared/namespaces";
import HouseHeart from "components/icons/house-heart.svg";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { guttersPx, gutters } from "styles/variables";
import { useTranslation } from "i18n";

const BookingWidgetControlRowStyled = styled(BookingWidgetControlRow)<{
  hasTours: boolean;
}>(({ hasTours }) => [
  !hasTours &&
    css`
      padding-top: ${gutters.large}px;
    `,
  css`
    margin-top: ${hasTours ? `-${gutters.large + gutters.small / 2}px` : guttersPx.smallHalf};
    margin-bottom: ${gutters.large + gutters.small / 2}px;
  `,
]);

const VPBookingWidgetStaysDayDropdown = ({
  stayProducts,
  selectedHotelsRooms,
  isStaysDataReady,
  isLoading,
  activeDropdown,
  onOpenStateChange,
  dayNumber,
  hasTours,
  children,
}: {
  stayProducts: VacationPackageTypes.VacationPackageStayProduct[];
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
  isStaysDataReady?: boolean;
  isLoading: boolean;
  activeDropdown: VPSearchWidgetTypes.activeDropdownType;
  dayNumber: number;
  hasTours: boolean;
  children: ReactElement;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const selectedStay = findSelectedStayByDay({
    dayNumber,
    stayProducts,
    selectedHotelsRooms,
  });
  const [, onStayInfoClick] = useOnToggleModal(
    VPActiveModalTypes.InfoStay,
    getVPModalProductId(dayNumber, selectedStay?.productId)
  );
  const isOpen = activeDropdown === getStayDropdownType(dayNumber);

  return (
    <BookingWidgetControlRowStyled
      title={vacationPackageT("Hotel")}
      subtitle={
        selectedStay?.starClass && selectedStay?.starClass >= 2
          ? vacationPackageT("{starClass}-star included", {
              starClass: selectedStay.starClass,
            })
          : vacationPackageT("Included")
      }
      onInfoClick={selectedHotelsRooms && onStayInfoClick}
      isOpen={isOpen}
      hasTours={hasTours}
    >
      <StyledBookingWidgetDropdown
        id={`${selectedStay?.productId || dayNumber}-dropdown`}
        isSelected={Boolean(selectedStay) || isLoading}
        isOpen={isOpen}
        selectedTitle={selectedStay?.name || ""}
        isDisabled={!isStaysDataReady}
        matchesDefaultSelectedItem
        isLoading={isLoading}
        Icon={HouseHeart}
        onOpenStateChange={onOpenStateChange}
      >
        {children}
      </StyledBookingWidgetDropdown>
    </BookingWidgetControlRowStyled>
  );
};

export default VPBookingWidgetStaysDayDropdown;
