import React, { SyntheticEvent, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import useVacationSearchQueryParams from "../VacationPackages/utils/useVacationSearchQueryParams";

import { useVPSearchStateCallbacks } from "./hooks/useVPSearchStateCallbacks";
import VacationLocationPicker from "./VacationLocationPicker";
import { useVPSearchWidgetContext } from "./context/VPSearchWidgetContext";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import SearchWidgetDatePicker from "components/ui/SearchWidget/SearchWidgetDatePicker";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import { SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";
import Label from "components/ui/SearchWidget/Label";
import { DateRangeEnum } from "components/ui/DatePicker/utils/datePickerUtils";
import { useTranslation } from "i18n";
import { ButtonSize } from "types/enums";
import { gutters, whiteColor, fontSizeBody2, fontWeightRegular } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import VacationPackageFlightToggle from "components/ui/VacationPackageSearchWidget/VacationPackageFlightToggle";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { InputStyled, Separator } from "components/ui/Inputs/AutocompleteInput/AutocompleteInput";
import {
  DoubleLabel,
  Label as DoubleLabelLabel,
} from "components/ui/MobileSteps/AutocompleteModalHelpers";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";
import { mqMin } from "styles/base";

export const searchWidgetAlignment = css`
  ${DisplayValue} + ${DropdownContainer} {
    top: 45px;
  }
`;

const Row = styled.div(
  ({ isLast }: { isLast?: boolean }) =>
    css`
      padding-bottom: ${isLast ? gutters.large / 2 : 0}px;
    `
);

const StyledRow = styled(Row)`
  margin-top: ${-gutters.small / 2}px;
`;

const StyledRowLocation = styled(Row)`
  ${mqMin.large} {
    &:nth-child(1) > div:nth-child(2) {
      height: 40px;
    }
  }
`;

const StyledVacationLocationPicker = styled(VacationLocationPicker)`
  ${InputStyled} {
    height: 40px;
    line-height: 40px;
  }
  ${Separator} {
    top: ${gutters.small / 2}px;
  }
  ${searchWidgetAlignment};
`;

const StyledSearchWidgetDatePicker = styled(SearchWidgetDatePicker)`
  ${searchWidgetAlignment};
`;

const StyledNewDesktopRoomAndGuestPicker = styled(NewDesktopRoomAndGuestPicker)`
  ${DisplayValue} {
    height: 40px;
  }
  ${searchWidgetAlignment};
`;

const StyledDoubleLabel = styled(DoubleLabel)`
  ${DoubleLabelLabel} {
    color: ${whiteColor};
    font-size: ${fontSizeBody2};
    font-weight: ${fontWeightRegular};
  }
`;

const VacationPackageSearchWidget = ({
  onLocationClick,
  datePickerOnDateInputClick,
  datePickerOnClose,
  trackQueryParamsChange = false,
}: {
  onLocationClick?: () => void;
  datePickerOnDateInputClick?: (e: SyntheticEvent, type?: DateRangeEnum) => void;
  datePickerOnClose?: () => void;
  trackQueryParamsChange?: boolean;
}) => {
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const { t: vacationSearchT } = useTranslation(Namespaces.vacationPackagesSearchN);

  const {
    destination,
    defaultDestination,
    origin,
    defaultOrigin,
    defaultDestinationId,
    defaultOriginId,
    vacationIncludesFlight,
    datePickerSelectedDates,
    occupancies,
  } = useVPSearchWidgetContext();

  const {
    onOriginLocationChange,
    onDestinationLocationChange,
    datePickerOnDateSelection,
    datePickerOnDateClear,
    onOccupanciesChange,
    onToggleFlightsIncluded,
    onSearchClick,
    onQueryParamsChange,
  } = useVPSearchStateCallbacks();

  const locationPickerProps = {
    onOriginLocationChange,
    onOriginLocationClick: onLocationClick,
    onDestinationLocationChange,
    onDestinationLocationClick: onLocationClick,
    destination,
    defaultDestination,
    origin,
    defaultOrigin,
    isMobile: false,
    defaultDestinationId,
    defaultOriginId,
    vacationIncludesFlight,
  };

  const [queryParams] = useVacationSearchQueryParams();

  const browserDate = new Date();
  const initialMonth = datePickerSelectedDates.from || datePickerSelectedDates.to || browserDate;
  const dates = getFlightMinMaxDates();
  const datePickerProps = {
    id: `vpsearch-widget--datepicker`,
    selectedDates: datePickerSelectedDates,
    initialMonth,
    onDateSelection: datePickerOnDateSelection,
    onDateInputClick: datePickerOnDateInputClick,
    dates,
    fromPlaceholder: vacationSearchT("Arrival"),
    toPlaceholder: vacationSearchT("Departure"),
    preOpenCalendar: false,
    allowSeparateSelection: true,
    disabled: false,
    onClear: datePickerOnDateClear,
    onClose: datePickerOnClose,
  };

  const isSearchFormValid =
    datePickerSelectedDates.from &&
    datePickerSelectedDates.to &&
    (vacationIncludesFlight ? destination && origin : destination);

  const searchWidgetButtonProps = {
    onSearchClick,
    tooltipErrorMessage: !isSearchFormValid
      ? vacationSearchT("Please fill in your search information")
      : undefined,
    buttonSize: ButtonSize.Medium,
  };

  useEffect(() => {
    if (trackQueryParamsChange) {
      onQueryParamsChange(queryParams);
    }
  }, [onQueryParamsChange, queryParams, trackQueryParamsChange]);

  return (
    <SearchWidgetDesktop>
      <StyledRowLocation>
        <StyledVacationLocationPicker id="searchPageLocationPicker" {...locationPickerProps} />
        <VacationPackageFlightToggle
          onChange={onToggleFlightsIncluded}
          isChecked={vacationIncludesFlight!}
        />
      </StyledRowLocation>
      <StyledRow>
        <Label>{vacationSearchT("Travel dates")}</Label>
        <StyledSearchWidgetDatePicker {...datePickerProps} />
      </StyledRow>
      <Row isLast>
        <StyledDoubleLabel leftLabel={vacationT("Travelers")} rightLabel={vacationT("Rooms")} />
        <StyledNewDesktopRoomAndGuestPicker
          occupancies={occupancies}
          onSetOccupancies={onOccupanciesChange}
          onSetRooms={onOccupanciesChange}
          withLabelWrapper={false}
          namespace={Namespaces.vacationPackageNs}
        />
      </Row>
      <SearchWidgetButton {...searchWidgetButtonProps} />
    </SearchWidgetDesktop>
  );
};

export default VacationPackageSearchWidget;
