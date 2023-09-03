import React, { useCallback, useMemo, memo, useRef, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import FixedRangeDatePickerDesktop, {
  CalendarIcon,
} from "../ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerDesktop";

import { VPSearchWrapper } from "./VPSearchWrapper";
import { VPStateContext } from "./contexts/VPStateContext";
import { VPStepsTypes, VPModalCallbackContext } from "./contexts/VPModalStateContext";
import { VPFlightStateContext } from "./contexts/VPFlightStateContext";
import { getMaxMinDate } from "./utils/vacationPackageUtils";
import VPContentLocationPicker from "./VPContentLocationPicker";
import { VPActionCallbackContext } from "./contexts/VPActionStateContext";
import { VPStayStateContext } from "./contexts/VPStayStateContext";

import { Namespaces } from "shared/namespaces";
import { DesktopColumn, TabContent } from "components/ui/SearchWidget/SearchWidgetShared";
import {
  fontSizeBody2,
  fontSizeH3,
  fontWeightRegular,
  greyColor,
  gutters,
  whiteColor,
} from "styles/variables";
import {
  DisplayValue,
  DropdownContainer,
  InputLabel,
  Wrapper,
} from "components/ui/Inputs/ContentDropdown";
import { mqMax, mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import VacationPackageFlightToggle from "components/ui/VacationPackageSearchWidget/VacationPackageFlightToggle";
import MobileRoomAndGuestInput from "components/ui/RoomAndGuestPicker/MobileRoomAndGuestInput";
import { DoubleLabel, Label } from "components/ui/MobileSteps/AutocompleteModalHelpers";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";

const widgetFooterHeight = "32px";

const FooterHeightEqualizer = styled.div`
  max-height: 24px;
  ${mqMin.large} {
    min-height: ${widgetFooterHeight};
  }
`;

const StyledFixedRangeDatePickerDesktop = styled(FixedRangeDatePickerDesktop)(
  ({ theme }) => css`
    margin-top: 0;
    ${mqMax.large} {
      margin-bottom: ${gutters.small / 2}px;
    }
    ${Wrapper} {
      padding-right: 0;
      padding-left: 0;
    }
    ${DisplayValue} {
      margin-top: 0;
      height: 40px;
      background-color: ${whiteColor};
      ${mqMin.large} {
        min-height: 50px;
      }
    }
    ${DropdownContainer} {
      right: auto;
      min-width: 100%;
    }
    ${InputLabel} {
      height: ${fontSizeH3};
      color: ${whiteColor};
      font-weight: ${fontWeightRegular};
      line-height: ${fontSizeH3};
      ${mqMax.large} {
        color: ${greyColor};
      }
    }
    ${CalendarIcon} {
      fill: ${theme.colors.primary};
    }
  `
);

const StyledTabContent = styled(TabContent)`
  height: auto;
  ${mqMin.large} {
    height: 110px;
  }
`;

const StyledVacationPackageFlightToggle = styled(VacationPackageFlightToggle)`
  justify-content: flex-start;
  ${mqMax.large} {
    display: none;
  }
`;

const StyledVPContentLocationPicker = styled(VPContentLocationPicker)`
  ${mqMax.large} {
    display: none;
  }
`;

const StyledDoubleLabel = styled(DoubleLabel)`
  ${Label} {
    color: ${greyColor};
    font-size: ${fontSizeBody2};
    font-weight: ${fontWeightRegular};
    ${mqMin.large} {
      color: ${whiteColor};
    }
  }
`;

const StyledMobileRoomAndGuestInput = styled(MobileRoomAndGuestInput)`
  border-color: ${rgba(greyColor, 0.5)};
  ${mqMin.large} {
    display: none;
  }
`;

const StyledNewDesktopRoomAndGuestPicker = styled(NewDesktopRoomAndGuestPicker)`
  display: none;
  ${mqMin.large} {
    display: block;
    ${DisplayValue} {
      min-height: 50px;
    }
  }
`;

const VPProductContentSearchPure = ({
  currentDates,
  occupancies,
  selectedDates,
  vacationLength,
  vacationIncludesFlight,
  onVPIncludesFlights,
  onDateSelection,
  changeToggleIsOpen,
  initialMonth,
  originInputRef,
  originInputToggle,
  unavailableDatesRange,
  onOccupanciesChange,
  onRoomsChange,
}: {
  currentDates: SharedTypes.DatesRange;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  selectedDates: SharedTypes.SelectedDates;
  vacationLength: number;
  vacationIncludesFlight: boolean;
  onVPIncludesFlights: (checked: boolean) => void;
  onDateSelection: (newSelectedDates: SharedTypes.SelectedDates) => void;
  changeToggleIsOpen: (stepType: VPStepsTypes) => (() => void) | undefined;
  initialMonth?: Date;
  originInputRef: React.MutableRefObject<VacationPackageTypes.originInputRef>;
  originInputToggle: () => void;
  unavailableDatesRange?: SharedTypes.SelectedDates[];
  onOccupanciesChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onRoomsChange?: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  return (
    <VPSearchWrapper>
      <StyledTabContent>
        <DesktopColumn baseWidth={30}>
          <StyledFixedRangeDatePickerDesktop
            onDateSelection={onDateSelection}
            dates={{
              unavailableDates: [],
              unavailableDatesRange: unavailableDatesRange ?? [],
              min: currentDates.minDate,
              max: currentDates.maxDate,
            }}
            lengthOfTour={vacationLength}
            selectedDates={selectedDates}
            initialMonth={initialMonth}
            onDateInputClick={changeToggleIsOpen(VPStepsTypes.Dates)}
          />
          <StyledVacationPackageFlightToggle
            onChange={onVPIncludesFlights}
            isChecked={vacationIncludesFlight}
            onClick={originInputToggle}
          />
        </DesktopColumn>
        <StyledVPContentLocationPicker
          label="Flights"
          vacationIncludesFlight={vacationIncludesFlight}
          originInputRef={originInputRef}
        />
        <DesktopColumn baseWidth={35}>
          <StyledDoubleLabel leftLabel={t("Travelers")} rightLabel={t("Rooms")} />
          <StyledMobileRoomAndGuestInput
            occupancies={occupancies}
            onInputClick={changeToggleIsOpen(VPStepsTypes.Travellers)}
          />
          <StyledNewDesktopRoomAndGuestPicker
            occupancies={occupancies}
            onSetOccupancies={onOccupanciesChange}
            onSetRooms={onRoomsChange}
            withLabelWrapper={false}
          />
          <FooterHeightEqualizer />
        </DesktopColumn>
      </StyledTabContent>
    </VPSearchWrapper>
  );
};

const VPProductContentSearchMemoized = memo(VPProductContentSearchPure);

const VPProductContentSearch = () => {
  const { selectedDates, vacationLength, unavailableDatesRange } = useContext(VPStateContext);
  const { originId, vacationIncludesFlight } = useContext(VPFlightStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const {
    onIncludeVPFlightsToggle,
    onVPDateSelection,
    onVPOccupanciesChange,
    onVPOccupanciesRoomsChange,
  } = useContext(VPActionCallbackContext);

  const { onToggleIsOpen } = useContext(VPModalCallbackContext);
  const availableDates = useMemo(() => getMaxMinDate(), []);
  const initialMonth = selectedDates.from || selectedDates.to || availableDates.minDate;
  const originInputRef = useRef<VacationPackageTypes.originInputRef>(null);

  const originInputToggle = useCallback(() => {
    if (originInputRef.current?.openDropdown && !originId) originInputRef.current?.openDropdown();
  }, [originId]);

  const isMobile = useIsMobile();

  const changeToggleIsOpen = useCallback(
    (stepType: VPStepsTypes) => {
      return isMobile ? () => onToggleIsOpen(stepType) : undefined;
    },
    [isMobile, onToggleIsOpen]
  );

  return (
    <VPProductContentSearchMemoized
      currentDates={availableDates}
      occupancies={occupancies}
      selectedDates={selectedDates}
      vacationLength={vacationLength}
      vacationIncludesFlight={vacationIncludesFlight}
      onVPIncludesFlights={onIncludeVPFlightsToggle}
      onDateSelection={onVPDateSelection}
      changeToggleIsOpen={changeToggleIsOpen}
      initialMonth={initialMonth}
      originInputRef={originInputRef}
      originInputToggle={originInputToggle}
      unavailableDatesRange={unavailableDatesRange}
      onOccupanciesChange={onVPOccupanciesChange}
      onRoomsChange={onVPOccupanciesRoomsChange}
    />
  );
};

export default VPProductContentSearch;
