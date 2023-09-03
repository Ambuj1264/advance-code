import React, { SyntheticEvent, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { AutocompleteInputLargeHalf, SearchWidgetDatePickerWithTime } from "../FrontTabsShared";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import { CarSearchWidgetSharedTypes } from "components/ui/CarSearchWidget/contexts/CarSearchWidgetCallbackContext";
import {
  DesktopColumn,
  TabContent,
  SearchWidgetButtonStyled,
} from "components/ui/SearchWidget/SearchWidgetShared";
import PickupInfoDesktop from "components/ui/DatePicker/PickupInfoDesktop";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getAvailableTime } from "components/ui/DatePicker/utils/datePickerUtils";
import Label from "components/ui/SearchWidget/Label";
import { borderRadiusSmall, gutters } from "styles/variables";
import useEffectOnce from "hooks/useEffectOnce";
import CountryDriverInformation from "components/ui/CarSearchWidget/DriverInformation/CountryDriverInformation";
import CarnectLocationPickerContainer from "components/ui/CarSearchWidget/LocationPicker/CarnectLocationPickerContainer";
import { useOnCarCalendarOpen } from "components/ui/FrontSearchWidget/frontHooks";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import TimePickerMobile from "components/ui/CarSearchWidget/TimePickerMobile";
import { LabelWrapper as CarPickupDropoffLabelWrapper } from "components/ui/MobileSteps/AutocompleteModalHelpers";

const PickupInfoDesktopStyled = styled(PickupInfoDesktop)`
  position: relative;
  top: ${borderRadiusSmall};
  margin-top: ${gutters.small / 2};
  border-bottom-right-radius: ${borderRadiusSmall};
  border-bottom-left-radius: ${borderRadiusSmall};
`;

const CarnectLocationPickerContainerStyled = styled(CarnectLocationPickerContainer)(
  () => css`
    ${AutocompleteInputLargeHalf} {
      margin-bottom: 0;
    }
  `
);

const StyledTimePickerMobile = styled(TimePickerMobile)(
  () => css`
    ${CarPickupDropoffLabelWrapper} {
      display: none;
    }
  `
);

const CarsTabContent = ({
  onSearchClick,
  isMobile,
  setRangeDatesWithTime,
  onDatesClear,
  onCarsHourChange,
  onCarsMinuteChange,
  onCarsPickupTimeChange,
  onCarsDropoffTimeChange,
  onPickupLocationItemSelect,
  onDropoffLocationItemSelect,
  onLocationInputClick,
  onDropoffLocationInputClick,
  onDateInputClick,
  selectedDates,
  carPickupLocationId,
  carDropoffLocationId,
  pickup,
  dropoff,
  driverAge,
  onSetDriverAge,
  driverCountry,
  onSetDriverCountry,
  onClearCarLocation,
  isDesktopCalendarOpen,
  carDropoffLocationName,
  carPickupLocationName,
  shouldInitializeInputs,
  countryCode,
  useDesktopStyle = true,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  isMobile: boolean;
  setRangeDatesWithTime: (selectedDates: SharedTypes.SelectedDates) => void;
  onDatesClear: () => void;
  onCarsHourChange: (hour: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  onCarsMinuteChange: (minute: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  onCarsPickupTimeChange: (time: SharedTypes.Time) => void;
  onCarsDropoffTimeChange: (time: SharedTypes.Time) => void;
  onPickupLocationItemSelect: CarSearchWidgetSharedTypes["onLocationChange"];
  onDropoffLocationItemSelect: CarSearchWidgetSharedTypes["onLocationChange"];
  onLocationInputClick: () => void;
  onDropoffLocationInputClick: () => void;
  onDateInputClick: () => void;
  selectedDates: SharedTypes.SelectedDates;
  carPickupLocationId?: string;
  carDropoffLocationId?: string;
  pickup: SharedTypes.Time;
  dropoff: SharedTypes.Time;
  driverAge: number;
  onSetDriverAge: (driverAge: string) => void;
  driverCountry?: string;
  onSetDriverCountry: (driverCountry: string) => void;
  onClearCarLocation: (pickupDropoff?: "pickup" | "dropoff") => void;
  isDesktopCalendarOpen: boolean;
  carDropoffLocationName?: string;
  carPickupLocationName?: string;
  shouldInitializeInputs?: boolean;
  countryCode?: string;
  useDesktopStyle?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const browserDate = new Date();
  const initialMonth = selectedDates.from || selectedDates.to || browserDate;
  const isDesktop = useIsDesktop();
  const isFormValid =
    selectedDates.from && selectedDates.to && carPickupLocationId && carDropoffLocationId;
  useEffectOnce(() => {
    setRangeDatesWithTime(selectedDates);
  });

  const pickupAvailableTime = getAvailableTime(selectedDates.from);
  const dropoffAvailableTime = getAvailableTime(selectedDates.to);
  const onCloseCalendar = useOnCarCalendarOpen(isMobile, false);

  const onSearchButtonClick = useCallback(
    (e: SyntheticEvent) => {
      const isDatesMissing = !selectedDates.from || !selectedDates.to;
      const isLocationMissing = !carPickupLocationName || !carDropoffLocationName;
      if ((isDatesMissing || isLocationMissing) && !isDesktop) {
        e.preventDefault();
        if (isDatesMissing) {
          onDateInputClick();
        } else {
          onLocationInputClick();
        }
      } else {
        onSearchClick(e);
      }
    },
    [
      carPickupLocationName,
      carDropoffLocationName,
      selectedDates,
      onLocationInputClick,
      onDateInputClick,
      onSearchClick,
    ]
  );
  return (
    <TabContent data-testid="carsTab" useDesktopStyle={useDesktopStyle}>
      <DesktopColumn
        baseWidth={28}
        flexOrderMobile={1}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.commonSearchNs}>Select details</Trans>
        </Label>
        <CarnectLocationPickerContainerStyled
          selectedPickupId={carPickupLocationId}
          selectedDropoffId={carDropoffLocationId}
          onPickupChange={onPickupLocationItemSelect}
          onDropoffChange={onDropoffLocationItemSelect}
          onPickupInputClick={onLocationInputClick}
          onDropoffInputClick={onDropoffLocationInputClick}
          onClearCarLocation={onClearCarLocation}
          disabled={isMobile}
          selectedDropoffName={carDropoffLocationName}
          selectedPickupName={carPickupLocationName}
          shouldInitializeInputs={shouldInitializeInputs}
          countryCode={countryCode}
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={27}
        flexOrderMobile={3}
        mobileMarginBottom={gutters.small}
        useDesktopStyle={useDesktopStyle}
      >
        <MediaQuery fromDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.commonSearchNs}>Pick up details</Trans>
          </Label>
        </MediaQuery>

        <MediaQuery toDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.commonNs}>Select dates</Trans>
          </Label>
        </MediaQuery>

        <SearchWidgetDatePickerWithTime
          selectedDates={selectedDates}
          initialMonth={initialMonth}
          onDateSelection={setRangeDatesWithTime}
          onDateInputClick={onDateInputClick}
          minDays={1}
          numberOfMonths={2}
          dates={{ unavailableDates: [], min: browserDate }}
          fromPlaceholder={commonSearchT("Pick up date")}
          toPlaceholder={commonSearchT("Drop off date")}
          preOpenCalendar={false}
          allowSeparateSelection
          onClear={onDatesClear}
          onClose={onCloseCalendar}
          showTime
          isOpen={isDesktopCalendarOpen}
          bottomContent={
            <PickupInfoDesktopStyled
              onHourChange={onCarsHourChange}
              onMinuteChange={onCarsMinuteChange}
              pickup={pickup}
              dropoff={dropoff}
              pickupAvailableTime={pickupAvailableTime}
              dropoffAvailableTime={dropoffAvailableTime}
            />
          }
        />
      </DesktopColumn>
      <DesktopColumn
        baseWidth={30}
        flexOrderMobile={2}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <CountryDriverInformation
          driverAge={driverAge}
          onSetDriverAge={onSetDriverAge}
          driverCountry={driverCountry}
          onSetDriverCountry={onSetDriverCountry}
        />
        <MediaQuery toDisplay={DisplayType.Large}>
          <Label>
            <Trans ns={Namespaces.commonSearchNs}>Select time</Trans>
          </Label>
          <StyledTimePickerMobile
            times={{ pickup, dropoff }}
            pickupAvailableTime={pickupAvailableTime}
            dropoffAvailableTime={dropoffAvailableTime}
            onPickupTimeChange={onCarsPickupTimeChange}
            onDropoffTimeChange={onCarsDropoffTimeChange}
          />
        </MediaQuery>
      </DesktopColumn>
      <DesktopColumn baseWidth={15} flexOrderMobile={4} useDesktopStyle={useDesktopStyle}>
        <SearchWidgetButtonStyled
          onSearchClick={onSearchButtonClick}
          tooltipErrorMessage={
            !isFormValid && isDesktop
              ? commonSearchT("Please fill in your search information")
              : undefined
          }
        />
      </DesktopColumn>
    </TabContent>
  );
};

export default CarsTabContent;
