import React, { useCallback, SyntheticEvent } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { SearchWidgetDatePickerLarge } from "../FrontTabsShared";
import { useOnIncludeFlightsToggle, useToggleCalendarClientSideState } from "../frontHooks";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import VacationPackageFlightToggle from "components/ui/VacationPackageSearchWidget/VacationPackageFlightToggle";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Label from "components/ui/SearchWidget/Label";
import {
  DesktopColumn,
  SearchWidgetButtonStyled,
  TabContent,
} from "components/ui/SearchWidget/SearchWidgetShared";
import { gutters, greyColor, whiteColor, fontSizeBody2, fontWeightRegular } from "styles/variables";
import VacationLocationPicker from "components/features/VacationPackagesSearchWidget/VacationLocationPicker";
import { mqMax, mqMin } from "styles/base";
import MobileRoomAndGuestInput from "components/ui/RoomAndGuestPicker/MobileRoomAndGuestInput";
import { DisplayValue } from "components/ui/Inputs/ContentDropdown";
import {
  DoubleLabel,
  Label as DoubleLabelLabel,
} from "components/ui/MobileSteps/AutocompleteModalHelpers";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";

export const VacationToggleContent = styled.div`
  position: static;
  display: flex;
  justify-content: flex-end;

  ${mqMin.large} {
    position: absolute;
    bottom: 0;
    left: ${gutters.large}px;
    justify-content: flex-start;
    min-width: 250px;
  }
`;
const StyledMobileRoomAndGuestInput = styled(MobileRoomAndGuestInput)`
  margin: ${gutters.small / 4}px 0;
  height: 40px;
  border-color: ${rgba(greyColor, 0.5)};
  ${mqMin.large} {
    display: none;
  }
`;

const StyledNewDesktopRoomAndGuestPicker = styled(NewDesktopRoomAndGuestPicker)`
  display: none;
  ${mqMin.large} {
    display: block;
  }
  ${DisplayValue} {
    height: 50px;
  }
`;

const StyledDoubleLabel = styled(DoubleLabel)`
  margin: ${gutters.small / 2}px 0;
  ${mqMax.large} {
    margin: ${gutters.small / 4}px 0 0 0;
  }
  ${DoubleLabelLabel} {
    color: ${whiteColor};
    ${mqMin.large} {
      font-size: ${fontSizeBody2};
      font-weight: ${fontWeightRegular};
    }
  }
`;

const StyledVacationLocationPicker = styled(VacationLocationPicker)`
  ${mqMax.large} {
    height: 48px;
  }
`;

const VacationsTabContent = ({
  isMobile,
  onSearchClick,
  defaultDestinationName,
  defaultDestinationId,
  defaultOriginName,
  defaultOriginId,
  onOriginLocationChange,
  onDestinationLocationChange,
  selectedDates,
  onDateSelection,
  onClearDates,
  onTravellersInputClick,
  onOccupanciesChange,
  occupancies,
  vacationIncludesFlight,
  onOriginLocationClick,
  onDestinationLocationClick,
  destinationName,
  originName,
  onDatesClick,
  useDesktopStyle = true,
  destinationId,
}: {
  isMobile: boolean;
  onSearchClick: (e: SyntheticEvent) => void;
  defaultDestinationName?: string;
  defaultDestinationId?: string;
  defaultOriginName?: string;
  defaultOriginId?: string;
  onDestinationLocationChange: (id?: string, name?: string) => void;
  onOriginLocationChange: (id?: string, name?: string, countryCode?: string) => void;
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onClearDates?: () => void;
  onTravellersInputClick: () => void;
  onOccupanciesChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  vacationIncludesFlight: boolean;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  destinationName?: string;
  destinationId?: string;
  originName?: string;
  onDatesClick?: () => void;
  useDesktopStyle?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackagesSearchN);
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const currentDate = new Date();
  const dates = getFlightMinMaxDates();
  const initialMonth = selectedDates.from || selectedDates.to || currentDate;
  const isDesktop = useIsDesktop();
  const isAllLocationsSelected = vacationIncludesFlight
    ? originName && destinationName
    : destinationName;
  const isAllDatesSelected = Boolean(selectedDates.from && selectedDates.to);
  const isFormValid = isAllLocationsSelected && isAllDatesSelected;

  const errorMessage =
    !isFormValid && isDesktop ? t("Please fill in your search information") : undefined;

  const onIncludeFlights = useOnIncludeFlightsToggle();

  const onSearchButtonClick = useCallback(
    (e: SyntheticEvent) => {
      const isDatesMissing = !selectedDates.from || !selectedDates.to;
      if ((isDatesMissing || !isAllLocationsSelected) && !isDesktop) {
        e.preventDefault();
        if (isDatesMissing) {
          onDatesClick?.();
        } else if (vacationIncludesFlight && !originName) {
          onOriginLocationClick?.();
        } else {
          onDestinationLocationClick?.();
        }
      } else {
        onSearchClick(e);
      }
    },
    [
      isAllLocationsSelected,
      selectedDates,
      onOriginLocationClick,
      onDestinationLocationClick,
      onDatesClick,
      onSearchClick,
    ]
  );

  const isCalendarOpen = useToggleCalendarClientSideState(
    Boolean(isAllLocationsSelected && !isAllDatesSelected && destinationId !== "europe") &&
      useDesktopStyle
  );
  return (
    <TabContent data-testid="vacationsTab" useDesktopStyle={useDesktopStyle}>
      <DesktopColumn
        baseWidth={30}
        flexOrder={1}
        flexOrderMobile={1}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.vacationPackageNs}>
            {vacationIncludesFlight ? "Select details" : "Select destination"}
          </Trans>
        </Label>
        <StyledVacationLocationPicker
          isMobile={isMobile}
          hideLabels
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          defaultOrigin={defaultOriginName}
          defaultDestination={defaultDestinationName}
          defaultDestinationId={defaultDestinationId}
          defaultOriginId={defaultOriginId}
          origin={originName}
          destination={destinationName}
          onOriginLocationClick={onOriginLocationClick}
          onDestinationLocationClick={onDestinationLocationClick}
          vacationIncludesFlight={vacationIncludesFlight}
        />
        <VacationToggleContent>
          <VacationPackageFlightToggle
            onChange={onIncludeFlights}
            isChecked={vacationIncludesFlight}
          />
        </VacationToggleContent>
      </DesktopColumn>
      <DesktopColumn
        baseWidth={28}
        flexOrder={2}
        flexOrderMobile={3}
        mobileMarginBottom={gutters.small}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.vacationPackageNs}>Select dates</Trans>
        </Label>
        <SearchWidgetDatePickerLarge
          id="vacationsDates"
          selectedDates={selectedDates}
          initialMonth={initialMonth}
          onDateSelection={onDateSelection}
          onDateInputClick={onDatesClick}
          numberOfMonths={isMobile ? 1 : 2}
          dates={dates}
          fromPlaceholder={t("Starting date")}
          toPlaceholder={t("Return date")}
          preOpenCalendar={false}
          allowSeparateSelection
          disabled={isMobile}
          onClear={onClearDates}
          color="action"
          isOpen={isCalendarOpen}
        />
      </DesktopColumn>
      <DesktopColumn
        baseWidth={27}
        flexOrder={3}
        flexOrderMobile={2}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <StyledDoubleLabel leftLabel={vacationT("Travelers")} rightLabel={vacationT("Rooms")} />
        <StyledMobileRoomAndGuestInput
          occupancies={occupancies}
          onInputClick={onTravellersInputClick}
          namespace={Namespaces.vacationPackageNs}
        />
        <StyledNewDesktopRoomAndGuestPicker
          occupancies={occupancies}
          onSetOccupancies={onOccupanciesChange}
          onSetRooms={onOccupanciesChange}
          withLabelWrapper={false}
          namespace={Namespaces.vacationPackageNs}
          dataTestid="traveller-room"
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={15}
        flexOrder={4}
        flexOrderMobile={4}
        useDesktopStyle={useDesktopStyle}
      >
        <SearchWidgetButtonStyled
          onSearchClick={onSearchButtonClick}
          tooltipErrorMessage={errorMessage}
        />
      </DesktopColumn>
    </TabContent>
  );
};

export default VacationsTabContent;
