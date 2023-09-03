import React, { SyntheticEvent, useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useToggleCalendarClientSideState } from "../frontHooks";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import { AccommodationSearchPageCallbackContext } from "components/features/AccommodationSearchPage/AccommodationSearchPageStateContext";
import {
  AutocompleteInputLarge,
  SearchWidgetDatePickerLarge,
  DesktopRoomAndGuestPickerLarge,
  NewDesktopRoomAndGuestPickerLarge,
} from "components/ui/FrontSearchWidget/FrontTabsShared";
import {
  DesktopColumn,
  TabContent,
  SearchWidgetButtonStyled,
} from "components/ui/SearchWidget/SearchWidgetShared";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import Label from "components/ui/SearchWidget/Label";
import SearchIcon from "components/icons/search.svg";
import { AutoCompleteType, DisplayType, Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import Column from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";
import { mqMin } from "styles/base";
import MediaQuery from "components/ui/MediaQuery";
import { gutters } from "styles/variables";

const DesktopRow = styled(Row)(
  () => css`
    ${mqMin.large} {
      margin-left: 0;
    }
  `
);

const AutocompleteInputLargeStyled = styled(AutocompleteInputLarge)(css`
  margin: 0;
`);

const StaysTabContent = ({
  onSearchClick,
  isMobile,
  onSetNumberOfRooms,
  selectedDates,
  numberOfGuests,
  onDateInputClick,
  onGuestsInputClick,
  onDatesClear,
  onDateSelection,
  onLocationInputChange,
  onLocationItemClick,
  onSetNumberOfGuests,
  updateChildrenAges,
  setOccupancies,
  locationItems,
  address,
  numberOfRooms,
  occupancies,
  onLocationInputClick,
  isDesktopCalendarOpen,
  accommodationType,
  useDesktopStyle = true,
  useNewGuestPicker = false,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  isMobile: boolean;
  onSetNumberOfRooms: (numberOfRooms: number) => void;
  selectedDates: SharedTypes.SelectedDates;
  numberOfGuests: SharedTypes.NumberOfGuests;
  onDateInputClick: () => void;
  onGuestsInputClick: () => void;
  onDatesClear: () => void;
  onDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationItemClick: (selectedValue?: SharedTypes.AutocompleteItem) => void;
  onSetNumberOfGuests: (adults: number, children: number) => void;
  updateChildrenAges: (value: number, index: number) => void;
  setOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  locationItems?: SharedTypes.AutocompleteItem[];
  address?: string;
  numberOfRooms: number;
  onLocationInputClick: () => void;
  isDesktopCalendarOpen?: boolean;
  accommodationType?: string;
  useDesktopStyle?: boolean;
  useNewGuestPicker?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { marketplace } = useSettings();
  const isDesktop = useIsDesktop();
  const { t: commonSearchNs } = useTranslation(Namespaces.commonSearchNs);
  const { t: accomodationBookingWidgetT } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const { t: accomodationSearchT } = useTranslation(Namespaces.accommodationSearchNs);
  const { onSearchWidgetToggle } = useContext(AccommodationSearchPageCallbackContext);
  const browserDate = new Date();
  const initialMonth = selectedDates.from || selectedDates.to || browserDate;
  const isAllDatesSelected = Boolean(selectedDates.from && selectedDates.to);
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  const handleCloseDatePicker = useCallback(
    () => !isMobile && onSearchWidgetToggle(false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );

  const placeholderText = isGTE ? "Europe, any location" : "Set destination";
  const isFormValid = Boolean(
    isGTE ? selectedDates.from && selectedDates.to && address : selectedDates.from
  );
  const formInvalidMessage = isGTE
    ? commonSearchNs("Please fill in your search information")
    : accomodationBookingWidgetT("Please choose a check in date");

  const onSearchButtonClick = useCallback(
    (e: SyntheticEvent) => {
      const isDatesMissing = !selectedDates.from || !selectedDates.to;
      const isLocationMissing = !address;
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
    [address, selectedDates, onLocationInputClick, onDateInputClick, onSearchClick]
  );

  const isCalendarOpen = useToggleCalendarClientSideState(
    Boolean(address) && !isAllDatesSelected && useDesktopStyle
  );

  return (
    <TabContent data-testid="staysTab" useDesktopStyle={useDesktopStyle}>
      <DesktopColumn
        baseWidth={30}
        flexOrderMobile={2}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.accommodationNs}>Select destination</Trans>
        </Label>
        <AutocompleteInputLargeStyled
          id="stays-location-id"
          listItems={locationItems}
          defaultValue={address}
          onInputChange={onLocationInputChange}
          onItemClick={onLocationItemClick}
          onInputClick={onLocationInputClick}
          ListIcon={SearchIcon}
          disabled={isMobile}
          placeholder={accomodationSearchT(placeholderText)}
          inputAutocompleteIconType={accommodationType as AutoCompleteType}
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={30}
        flexOrderMobile={4}
        mobileMarginBottom={gutters.small}
        useDesktopStyle={useDesktopStyle}
      >
        <Label>
          <Trans ns={Namespaces.commonNs}>Select dates</Trans>
        </Label>
        <SearchWidgetDatePickerLarge
          selectedDates={selectedDates}
          initialMonth={initialMonth}
          onDateSelection={onDateSelection}
          onDateInputClick={onDateInputClick}
          minDays={1}
          numberOfMonths={isMobile ? 1 : 2}
          dates={{ unavailableDates: [], min: browserDate }}
          fromPlaceholder={t("Check in")}
          toPlaceholder={t("Check out")}
          preOpenCalendar={false}
          allowSeparateSelection
          disabled={isMobile}
          onClear={onDatesClear}
          onClose={handleCloseDatePicker}
          isOpen={isDesktopCalendarOpen || isCalendarOpen}
          allowSameDateSelection={false}
        />
      </DesktopColumn>

      <DesktopColumn
        baseWidth={25}
        flexOrderMobile={3}
        mobileFlexGrow={1}
        useDesktopStyle={useDesktopStyle}
      >
        <MediaQuery fromDisplay={DisplayType.Large}>
          <DesktopRow>
            <Label>
              <Trans ns={Namespaces.accommodationBookingWidgetNs}>Guests</Trans>
            </Label>
          </DesktopRow>
        </MediaQuery>
        <MediaQuery toDisplay={DisplayType.Large}>
          <Row>
            <Column columns={{ small: 2, medium: 2, large: 2, desktop: 2 }}>
              <Label>
                <Trans ns={Namespaces.accommodationBookingWidgetNs}>Add travelers</Trans>
              </Label>
            </Column>
            <Column columns={{ small: 2, medium: 2, large: 2, desktop: 2 }}>
              <Label>
                <Trans ns={Namespaces.accommodationBookingWidgetNs}>Choose rooms</Trans>
              </Label>
            </Column>
          </Row>
        </MediaQuery>
        {useNewGuestPicker ? (
          <NewDesktopRoomAndGuestPickerLarge
            withLabelWrapper={false}
            occupancies={occupancies}
            onSetOccupancies={setOccupancies}
            shouldDisplayArrowIcon={false}
            // disabling default input click handlers and opening the mobile steps
            onBeforeInputClick={isMobile ? onGuestsInputClick : undefined}
            disableRoomsInputClickHandler={isMobile}
            disableTravelersInputClickHandler={isMobile}
            dataTestid="traveller-room"
          />
        ) : (
          <DesktopRoomAndGuestPickerLarge
            numberOfGuests={numberOfGuests}
            onSetNumberOfGuests={onSetNumberOfGuests}
            updateChildrenAges={updateChildrenAges}
            numberOfRooms={numberOfRooms}
            onSetNumberOfRooms={onSetNumberOfRooms}
            loading={false}
            shouldDisplayArrowIcon={false}
            onInputClick={onGuestsInputClick}
            disabled={isMobile}
          />
        )}
      </DesktopColumn>

      <DesktopColumn baseWidth={15} flexOrderMobile={5} useDesktopStyle={useDesktopStyle}>
        <SearchWidgetButtonStyled
          onSearchClick={onSearchButtonClick}
          tooltipErrorMessage={!isFormValid && isDesktop ? formInvalidMessage : undefined}
        />
      </DesktopColumn>
    </TabContent>
  );
};

export default StaysTabContent;
