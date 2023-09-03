import React, { useContext } from "react";
import styled from "@emotion/styled";

import { searchWidgetAlignment } from "../VacationPackagesSearchWidget/VacationPackageSearchWidget";

import {
  AccommodationSearchPageStateContext,
  AccommodationSearchPageCallbackContext,
} from "./AccommodationSearchPageStateContext";

import { SearchWidgetMobile, SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";
import Label from "components/ui/SearchWidget/Label";
import SearchWidgetDatePicker from "components/ui/SearchWidget/SearchWidgetDatePicker";
import { gutters } from "styles/variables";
import SearchIcon from "components/icons/search.svg";
import AutocompleteInput, {
  InputStyled,
} from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import DesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { AutoCompleteType } from "types/enums";
import { DisplayValue } from "components/ui/Inputs/ContentDropdown";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";

const AutocompleteInputStyled = styled(AutocompleteInput)`
  margin-bottom: ${gutters.small / 2}px;
  ${InputStyled} {
    height: 40px;
    line-height: inherit;
  }
  ${searchWidgetAlignment};
`;

const StyledSearchWidgetDatePicker = styled(SearchWidgetDatePicker)`
  ${searchWidgetAlignment};
`;

const ButtonWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const RoomAndGuestWrapper = styled.div<{}>`
  height: 42px;
  ${DisplayValue} {
    height: 42px;
  }
  ${searchWidgetAlignment};
`;

const AccommodationSearchWidget = ({
  isMobile = false,
  onDateInputClick,
  onLocationInputClick,
  onGuestInfoInputClick,
}: {
  isMobile?: boolean;
  onDateInputClick?: () => void;
  onLocationInputClick?: () => void;
  onGuestInfoInputClick?: () => void;
}) => {
  const Wrapper = isMobile ? SearchWidgetMobile : SearchWidgetDesktop;
  const {
    selectedDates,
    locationItems,
    numberOfGuests,
    numberOfRooms,
    location,
    defaultLocation,
    isDesktopCalendarOpen,
    occupancies,
    useNewGuestPicker,
    isSearchResultsPage,
  } = useContext(AccommodationSearchPageStateContext);
  const {
    onDateSelection,
    onClearDates,
    onLocationInputChange,
    onLocationItemSelect,
    onSetNumberOfGuests,
    onSetNumberOfRooms,
    onUpdateChildrenAges,
    onSearchClick,
    onSearchWidgetToggle,
    onSetOccupancies,
  } = useContext(AccommodationSearchPageCallbackContext);
  const { t: accommodationT } = useTranslation(Namespaces.accommodationNs);
  const { t: accommodationBookingWidgetT } = useTranslation(
    Namespaces.accommodationBookingWidgetNs
  );
  const formErrorMessage =
    !location.name || !selectedDates.from || !selectedDates.to
      ? accommodationBookingWidgetT("Please fill in your search information")
      : undefined;

  const placeholder = isSearchResultsPage
    ? location.name || accommodationBookingWidgetT("Set destination")
    : location.name || defaultLocation?.name;

  return (
    <Wrapper>
      <Label>
        <Trans ns={Namespaces.accommodationNs}>Location</Trans>
      </Label>
      <AutocompleteInputStyled
        id="accommodation-location-id"
        listItems={locationItems}
        placeholder={placeholder}
        defaultValue={location.name}
        onInputChange={onLocationInputChange}
        ListIcon={SearchIcon}
        onItemClick={onLocationItemSelect}
        onInputClick={onLocationInputClick}
        isWideDropdown={false}
        inputAutocompleteIconType={location?.type as AutoCompleteType}
      />
      <Label>
        <Trans>Select dates</Trans>
      </Label>
      <StyledSearchWidgetDatePicker
        selectedDates={selectedDates}
        onDateSelection={onDateSelection}
        onDateInputClick={onDateInputClick}
        minDays={1}
        dates={{ unavailableDates: [], min: new Date() }}
        fromPlaceholder={accommodationT("Check in")}
        toPlaceholder={accommodationT("Check out")}
        preOpenCalendar={false}
        disabled={isMobile}
        onClear={onClearDates}
        initialMonth={selectedDates.from}
        shouldDisplayArrowIcon={false}
        allowSeparateSelection
        isOpen={isDesktopCalendarOpen}
        allowSameDateSelection={false}
        onClose={() => {
          if (!isMobile) {
            onSearchWidgetToggle(false);
          }
        }}
      />
      <Label>
        <Trans ns={Namespaces.accommodationBookingWidgetNs}>Guests</Trans>
      </Label>
      <RoomAndGuestWrapper>
        {useNewGuestPicker ? (
          <NewDesktopRoomAndGuestPicker
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
            onSetRooms={onSetOccupancies}
            withLabelWrapper={false}
            dataTestid="guest-room"
          />
        ) : (
          <DesktopRoomAndGuestPicker
            numberOfGuests={numberOfGuests}
            onSetNumberOfGuests={onSetNumberOfGuests}
            numberOfRooms={numberOfRooms}
            onSetNumberOfRooms={onSetNumberOfRooms}
            updateChildrenAges={onUpdateChildrenAges}
            loading={false}
            shouldDisplayArrowIcon={false}
            onInputClick={onGuestInfoInputClick}
            disabled={isMobile}
          />
        )}
      </RoomAndGuestWrapper>
      <ButtonWrapper>
        <SearchWidgetButton onSearchClick={onSearchClick} tooltipErrorMessage={formErrorMessage} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default AccommodationSearchWidget;
