import React, { useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { addDays } from "date-fns";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { VPStateContext } from "../contexts/VPStateContext";
import { VPStepsTypes, VPModalCallbackContext } from "../contexts/VPModalStateContext";
import { StyledVacationLocationPicker } from "../VPContentLocationPicker";
import { findStaysByDay } from "../utils/vacationPackageUtils";
import { VPCarStateContext } from "../contexts/VPCarStateContext";
import VPMobileFlightTypePicker from "../VPMobileFlightTypePicker";
import VPMobileToggle from "../VPMobileToggle";
import { findToursByDay } from "../VPToursSection/utils/vpToursUtils";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import { VPTourStateContext } from "../contexts/VPTourStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPDatePicker from "./VPDatePicker";
import VPBookingWidgetFlightDropdownContent from "./VPBookingWidgetFlightDropdownContent";
import VPBookingWidgetCarDropdownContent from "./VPBookingWidgetCarDropdownContent";
import VPBookingWidgetStayDropdownContent from "./VPBookingWidgetStayDropdownContent";
import { getExperiencesLabel, getSectionHeaderDate } from "./utils/vpBookingWidgetUtils";
import VPBookingWidgetTourDropdownContent from "./VPBookingWidgetTourDropdownContent";

import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import VPBookingWidgetSectionHeader, {
  StickyHeaderContainer,
} from "components/ui/BookingWidget/BookingWidgetSectionHeader";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { fontWeightRegular, gutters, guttersPx } from "styles/variables";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { SelectContentItemWrapper } from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { DisplayWrapper } from "components/ui/Inputs/RadioSelectionDropdown";
import {
  NoBackgroundDisplay,
  DisplayWrapper as FlightFareDisplayWrapper,
} from "components/ui/FlightSearchWidget/FlightFareCategoryContainer";
import { ArrowIcon, DisplayValue } from "components/ui/Inputs/ContentDropdown";
import MobileRoomAndGuestInput from "components/ui/RoomAndGuestPicker/MobileRoomAndGuestInput";
import useActiveLocale from "hooks/useActiveLocale";
import { mqMin } from "styles/base";

const MobileContentWrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  padding: 0;

  ${DisplayValue} {
    ${ArrowIcon} {
      margin-left: ${gutters.small / 4}px;
      width: 8px;
      height: 8px;
    }
  }

  ${FlightFareDisplayWrapper}, ${NoBackgroundDisplay}, ${DisplayWrapper} {
    font-weight: ${fontWeightRegular};
  }
`;

const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)`
  padding-right: 0;
  padding-left: 0;
`;

const StyledBookingMobileSectionHeading = styled(MobileSectionHeading)(
  css`
    margin-top: ${gutters.small}px;
    margin-bottom: ${gutters.small}px;
    &:first-of-type {
      margin-top: 0;
      margin-bottom: 0;
    }
  `
);

const FlightsBookingMobileSectionHeading = styled(MobileSectionHeading)`
  margin-top: ${gutters.small}px;
  margin-bottom: 0;
`;

const StyledVPMobileToggle = styled(VPMobileToggle)`
  margin-top: 1px;
`;

const StyledBookingVPBookingWidgetSectionHeader = styled(VPBookingWidgetSectionHeader)`
  margin-right: -${gutters.small}px;
  margin-left: -${gutters.small}px;
  width: auto;
  min-width: 100%;
  padding-left: ${gutters.small * 2}px;
  ${mqMin.medium} {
    padding-left: 0;
  }
`;

const StyledVPBookingWidgetStayDropdownContent = styled(VPBookingWidgetStayDropdownContent)<{
  smallMarginTop?: boolean;
}>(
  ({ smallMarginTop }) => css`
    padding-top: ${smallMarginTop ? guttersPx.smallHalf : guttersPx.small};
    ${SelectContentItemWrapper} {
      margin: 0;
    }
  `
);
const StyledVPBookingWidgetTourDropdownContent = styled(VPBookingWidgetTourDropdownContent)`
  padding-top: ${gutters.small}px;
  ${SelectContentItemWrapper} {
    margin: 0;
  }
`;
const StyledVPBookingWidgetFlightDropdownContent = styled(VPBookingWidgetFlightDropdownContent)`
  ${SelectContentItemWrapper} {
    margin: 0;
  }
`;
const StyledVPBookingWidgetCarDropdownContent = styled(VPBookingWidgetCarDropdownContent)`
  ${SelectContentItemWrapper} {
    margin: 0;
  }
`;
const StyledVPMobileFlightTypePicker = styled(VPMobileFlightTypePicker)<{
  smallMarginBottom?: boolean;
}>(
  ({ smallMarginBottom }) => css`
    margin-bottom: ${smallMarginBottom ? guttersPx.small : `0px`};
  `
);

const SeparatorWrapper = styled.div`
  width: 100%;
`;

const Separator = styled.div(
  ({ theme }) => css`
    margin-top: ${gutters.small}px;
    margin-bottom: ${gutters.small}px;
    height: 4px;
    background: ${rgba(theme.colors.primary, 0.1)};
  `
);

const VPBookingWidgetMobileContent = ({
  destination,
  destinationId,
  vacationPackageDays,
}: {
  destination?: string;
  destinationId?: string;
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
}) => {
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const { selectedDates, vacationLength } = useContext(VPStateContext);
  const { vacationIncludesCar, carResults, selectedCarId, carOffersLoading, carOffersError } =
    useContext(VPCarStateContext);
  const {
    origin,
    originId,
    vacationIncludesFlight,
    selectedFlight,
    flightsResults,
    flightSearchLoading,
    flightSearchError,
  } = useContext(VPFlightStateContext);
  const selectedFlightId = selectedFlight?.id;
  const isMobile = useIsMobile();

  const { hotels, staysResultLoading, staysResultError, occupancies } =
    useContext(VPStayStateContext);
  const { toursResults, toursResultLoading, toursResultError, selectedToursProductIds } =
    useContext(VPTourStateContext);
  const {
    onIncludeVPCarsToggle,
    onSelectVPCarOffer,
    onIncludeVPFlightsToggle,
    onVPFlightItinerarySelect,
  } = useContext(VPActionCallbackContext);
  const { onToggleBookingSearchIsOpen } = useContext(VPModalCallbackContext);
  const changeToggleIsOpen = useCallback(
    (stepType: VPStepsTypes) => {
      return isMobile ? () => onToggleBookingSearchIsOpen(stepType) : undefined;
    },
    [isMobile, onToggleBookingSearchIsOpen]
  );
  const shouldShowTours =
    !toursResultError &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    (toursResultLoading || toursResults?.length! > 0);

  return (
    <MobileContentWrapper>
      <StickyHeaderContainer>
        <StyledBookingMobileSectionHeading>
          <Trans ns={Namespaces.vacationPackageNs}>Travel details</Trans>
        </StyledBookingMobileSectionHeading>
      </StickyHeaderContainer>
      <StyledBookingWidgetControlRow title={t("Dates")}>
        <VPDatePicker
          selectedDates={selectedDates}
          vacationLength={vacationLength}
          onDateInputClick={changeToggleIsOpen(VPStepsTypes.Dates)}
        />
      </StyledBookingWidgetControlRow>
      <StyledBookingWidgetControlRow title={t("Travelers")} rightTitle={t("Rooms")}>
        <MobileRoomAndGuestInput
          occupancies={occupancies}
          onInputClick={changeToggleIsOpen(VPStepsTypes.Travellers)}
        />
      </StyledBookingWidgetControlRow>
      <StickyHeaderContainer>
        <FlightsBookingMobileSectionHeading>
          <Trans ns={Namespaces.vacationPackageNs}>Flights</Trans>
        </FlightsBookingMobileSectionHeading>
      </StickyHeaderContainer>
      <StyledVPMobileToggle
        labelText={t("Flights")}
        isTooltipVisible={!originId}
        checked={vacationIncludesFlight}
        onChange={onIncludeVPFlightsToggle}
        tooltip={t("Please select your flight's origin to search")}
      />
      <StyledVacationLocationPicker
        isMobile={isMobile}
        onOriginLocationChange={() => {}}
        onDestinationLocationChange={() => {}}
        onOriginLocationClick={changeToggleIsOpen(VPStepsTypes.Location)}
        onDestinationLocationClick={changeToggleIsOpen(VPStepsTypes.Location)}
        origin={origin}
        defaultOrigin={origin}
        defaultOriginId={originId}
        defaultDestination={destination || destinationId}
        defaultDestinationId="europe"
        vacationIncludesFlight
        isOnProductPage
        hideLabels
      />
      <StyledVPMobileFlightTypePicker
        smallMarginBottom={!flightSearchError && !vacationIncludesFlight}
      />
      {!flightSearchError && vacationIncludesFlight && (
        <>
          <SeparatorWrapper>
            <Separator />
          </SeparatorWrapper>
          <StyledVPBookingWidgetFlightDropdownContent
            flightSearchResults={flightsResults}
            selectedFlightId={selectedFlightId}
            onItinerarySelect={onVPFlightItinerarySelect}
            isLoading={flightSearchLoading}
            onMobileWidget
          />
        </>
      )}
      <StickyHeaderContainer>
        <StyledBookingMobileSectionHeading>
          <Trans ns={Namespaces.vacationPackageNs}>Car</Trans>
        </StyledBookingMobileSectionHeading>
      </StickyHeaderContainer>
      <StyledVPMobileToggle
        labelText={t("Include car")}
        checked={vacationIncludesCar}
        onChange={onIncludeVPCarsToggle}
      />
      {!carOffersError && vacationIncludesCar && (
        <StyledVPBookingWidgetCarDropdownContent
          selectedCarId={selectedCarId!}
          sortedCars={carResults}
          onSelectCarOffer={onSelectVPCarOffer}
          isLoading={carOffersLoading}
          onMobileWidget
        />
      )}
      {!staysResultError &&
        vacationPackageDays.map((day: VacationPackageTypes.VacationPackageDay, index: number) => {
          const dayNumber = index + 1;
          const stayProductsByDay = findStaysByDay({
            staysData: hotels,
            dayNumber,
          });
          const tourProductsByDay = shouldShowTours
            ? findToursByDay({
                toursResult: toursResults,
                dayNumber,
              })
            : undefined;
          const isArrivalDay = dayNumber === 1;
          const isDepartureDay = dayNumber === vacationPackageDays.length;

          const shouldShowToursSection =
            toursResultLoading || (tourProductsByDay && tourProductsByDay.length > 0);
          const experiencesLabel = getExperiencesLabel(
            vacationIncludesFlight,
            vacationIncludesCar,
            isArrivalDay,
            isDepartureDay
          );
          const shouldShowStaysSection = staysResultLoading || stayProductsByDay.length > 0;

          return (
            <React.Fragment key={String(dayNumber)}>
              <StickyHeaderContainer top={5}>
                <StyledBookingVPBookingWidgetSectionHeader
                  date={getSectionHeaderDate(
                    addDays(selectedDates.from!, dayNumber - 1),
                    activeLocale
                  )}
                >
                  {t("Day {dayNumber} in {region}", {
                    dayNumber,
                    region: day.region,
                  })}
                </StyledBookingVPBookingWidgetSectionHeader>
              </StickyHeaderContainer>
              {shouldShowToursSection && (
                <StyledVPBookingWidgetTourDropdownContent
                  dayNumber={dayNumber}
                  tourProducts={tourProductsByDay}
                  selectedTourProductIds={selectedToursProductIds}
                  isLoading={toursResultLoading}
                  onMobileWidget
                  experiencesLabel={experiencesLabel}
                />
              )}
              {!isDepartureDay && shouldShowStaysSection && (
                <StyledVPBookingWidgetStayDropdownContent
                  dayNumber={dayNumber}
                  stayProducts={stayProductsByDay}
                  isLoading={staysResultLoading}
                  smallMarginTop={shouldShowToursSection}
                  onMobileWidget
                />
              )}
            </React.Fragment>
          );
        })}
    </MobileContentWrapper>
  );
};

export default VPBookingWidgetMobileContent;
