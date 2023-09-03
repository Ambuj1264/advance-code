import React, { ReactElement } from "react";
import styled from "@emotion/styled";

import { findSelectedToursByDay } from "../utils/vacationPackageUtils";

import { getTourDropdownType } from "./utils/vpBookingWidgetHooks";
import { StyledBookingWidgetDropdown } from "./utils/vpBookingWidgetShared";

import { emptyArray } from "utils/constants";
import TravelerIcon from "components/icons/traveler.svg";
import { Namespaces } from "shared/namespaces";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { useTranslation } from "i18n";
import { gutters, guttersPx } from "styles/variables";

const BookingWidgetControlRowStyled = styled(BookingWidgetControlRow)`
  margin-top: ${guttersPx.smallHalf};
  margin-bottom: ${gutters.large + gutters.small / 2}px;
  padding-top: ${gutters.large}px;
`;

const VPBookingWidgetToursDayDropdown = ({
  dayNumber,
  tourProducts = emptyArray as never as SharedTypes.Product[],
  selectedTourProductIds,
  isToursDataReady,
  isLoading,
  children,
  activeDropdown,
  onOpenStateChange,
  experiencesLabel,
}: {
  dayNumber: number;
  tourProducts?: SharedTypes.Product[];
  selectedTourProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  isToursDataReady?: boolean;
  isLoading: boolean;
  children?: ReactElement;
  activeDropdown: VPSearchWidgetTypes.activeDropdownType;
  experiencesLabel: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const selectedTours = findSelectedToursByDay({
    dayNumber,
    tourProducts,
    selectedTourProductIds,
  });
  const title =
    selectedTours.length === 1
      ? selectedTours[0].headline
      : vacationPackageT("{numberOfExperiences} experiences selected", {
          numberOfExperiences: selectedTours.length,
        });
  const isOpen = activeDropdown === getTourDropdownType(dayNumber);
  const addExperiencesLabel: { [experiencesLabel: string]: string } = {
    "Transfers and experiences": "Add transfers and experiences",
    Experiences: "Add experiences",
  };
  return (
    <BookingWidgetControlRowStyled title={vacationPackageT(experiencesLabel)} isOpen={isOpen}>
      <StyledBookingWidgetDropdown
        id={`${selectedTours[0]?.id || dayNumber}-dropdown`}
        isSelected={Boolean(selectedTours.length > 0) || isLoading}
        isOpen={isOpen}
        selectedTitle={title || vacationPackageT("Add experience")}
        defaultTitle={vacationPackageT(addExperiencesLabel[experiencesLabel])}
        isDisabled={!isToursDataReady}
        isLoading={isLoading}
        Icon={TravelerIcon}
        onOpenStateChange={onOpenStateChange}
        matchesDefaultSelectedItem
      >
        {children}
      </StyledBookingWidgetDropdown>
    </BookingWidgetControlRowStyled>
  );
};

export default VPBookingWidgetToursDayDropdown;
