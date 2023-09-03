import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { useSetNumberOfTravelers } from "./gteTourHooks";
import GTETourTravelersInput from "./GTETourTravelersInput";
import { GTETourDropdownType } from "./types/enums";

import { MaybeColumn } from "components/ui/Grid/Column";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";
import SectionHeader from "components/features/TourBookingWidget/BookingWidgetSectionHeader";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { gutters, redColor } from "styles/variables";
import { typographyCaption } from "styles/typography";
import { mqMax } from "styles/base";

const ErrorMessageText = styled.div(
  typographyCaption,
  css`
    margin: ${gutters.small / 2}px 0;
    color: ${redColor};
  `
);

const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)(
  () => css`
    ${mqMax.large} {
      margin-bottom: ${gutters.small}px;
      padding: 0;
    }
  `
);

const GTETravelersContainer = ({
  onOpenStateChange,
  activeDropdown,
  travelerErrorMessage,
  columns = { small: 1 },
  isInModal = false,
  viewType,
  isMobileSteps = false,
  className,
}: {
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  travelerErrorMessage?: string;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
  viewType?: "list" | "dropdown";
  isMobileSteps?: boolean;
  className?: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { selectedDates, numberOfTravelers, priceGroups, maxTravelersPerBooking } =
    useGTETourBookingWidgetContext();
  const onSetNumberOfTravelers = useSetNumberOfTravelers();
  const { t } = useTranslation(Namespaces.tourNs);
  if (!selectedDates.from) return null;
  if (viewType === "list") {
    return (
      <div className={className}>
        <MaybeColumn showColumn={isInModal} columns={{ small: 1 }}>
          <MediaQuery toDisplay={DisplayType.Large}>
            <SectionHeader>
              <Trans ns={Namespaces.tourNs}>Travelers</Trans>
            </SectionHeader>
          </MediaQuery>
          <GTETourTravelersInput
            priceGroups={priceGroups}
            numberOfTravelers={numberOfTravelers}
            onNumberOfTravelersChange={onSetNumberOfTravelers}
            maxTravelersPerBooking={maxTravelersPerBooking}
            isError={false}
            viewType={viewType}
          />
        </MaybeColumn>
      </div>
    );
  }
  return (
    <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
      <StyledBookingWidgetControlRow
        title={t("Travelers")}
        isOpen={activeDropdown === GTETourDropdownType.TRAVELERS}
      >
        <GTETourTravelersInput
          priceGroups={priceGroups}
          numberOfTravelers={numberOfTravelers}
          onNumberOfTravelersChange={onSetNumberOfTravelers}
          onOpenStateChange={onOpenStateChange}
          maxTravelersPerBooking={maxTravelersPerBooking}
          isError={travelerErrorMessage !== undefined}
          canOpenDropdown={!isMobileSteps}
          viewType={viewType}
        />
        {travelerErrorMessage && <ErrorMessageText>{travelerErrorMessage}</ErrorMessageText>}
      </StyledBookingWidgetControlRow>
    </MaybeColumn>
  );
};

export default memo(GTETravelersContainer);
