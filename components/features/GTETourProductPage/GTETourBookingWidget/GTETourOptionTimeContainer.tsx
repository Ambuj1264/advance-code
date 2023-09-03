import React, { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { useOnSelectTourOptionTime } from "./gteTourHooks";
import { GTETourDropdownType } from "./types/enums";

import { MaybeColumn } from "components/ui/Grid/Column";
import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import Time from "components/icons/clock-alternate.svg";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { gutters, guttersPx } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import LoadingDropdown from "components/ui/Loading/LoadingDropdown";

const StyledBookingWidgetControlRow = styled(BookingWidgetControlRow)([
  css`
    margin-bottom: ${gutters.small}px;
    padding: 0;
    ${mqMin.large} {
      margin-bottom: 0;
      padding: ${guttersPx.small} ${guttersPx.large} 0 ${guttersPx.large};
    }
  `,
]);

export const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
  width: 100%;
`;

const StyledDropdown = styled(Dropdown)`
  position: relative;
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingDropdownWrapper = styled.div`
  margin: 0;
  ${mqMin.large} {
    margin: 0 ${gutters.large}px;
  }
`;

const TimeIcon = styled(Time)(
  ({ theme }) => css`
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
    ${mqMin.large} {
      margin-left: -${gutters.large / 4}px;
    }
  `
);
const GTETourOptionTimeContainer = ({
  onOpenStateChange,
  activeDropdown,
  columns = { small: 1 },
  isInModal = false,
}: {
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const theme: Theme = useTheme();
  const { selectedTourOption, isAvailabilityLoading } = useGTETourBookingWidgetContext();
  const timeList = selectedTourOption?.times?.filter(time => time.startTime !== null);
  const onSelectTourOptionTime = useOnSelectTourOptionTime();
  const onClose = useCallback(() => {
    onOpenStateChange?.(false);
  }, [onOpenStateChange]);
  const onOpen = useCallback(() => {
    onOpenStateChange?.(true);
  }, [onOpenStateChange]);
  const onTourOptionTimeSelect = useCallback(
    (tourTime: string, _label?: string, isDisabled?: boolean) => {
      if (isDisabled) return;

      onSelectTourOptionTime(tourTime);
      onClose();
    },
    [onClose, onSelectTourOptionTime]
  );
  const dropdownOptions: SelectOption[] | undefined = useMemo(
    () =>
      timeList?.map(time => ({
        value: time.startTime,
        nativeLabel: time.startTime,
        label: time.startTime,
        isDisabled: time.available === false,
      })),
    [timeList]
  );

  if (isAvailabilityLoading) {
    return (
      <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
        <LoadingDropdownWrapper>
          <LoadingDropdown />
        </LoadingDropdownWrapper>
      </MaybeColumn>
    );
  }

  if (!timeList || !dropdownOptions || dropdownOptions.length === 0) {
    return null;
  }

  const selectedTime = selectedTourOption?.times.find(time => time.isSelected);

  return (
    <MaybeColumn columns={columns} skipPadding={isInModal} showColumn={isInModal}>
      <StyledBookingWidgetControlRow
        title={t("Starting time")}
        isOpen={activeDropdown === GTETourDropdownType.TIMES}
      >
        <DropdownWrapper>
          <StyledDropdown
            id="tourOptionTimeDropdown"
            options={dropdownOptions}
            borderColor={theme.colors.primary}
            onChange={onTourOptionTimeSelect}
            selectedValue={selectedTime?.startTime as string}
            className="timeSelection"
            noDefaultValue
            selectHeight={45}
            useRadioOption
            onMenuOpen={onOpen}
            onMenuClose={onClose}
            maxHeight="275px"
            icon={<TimeIcon />}
            isArrowHidden={timeList.length <= 1}
            isDisabled={timeList.length < 1}
          />
        </DropdownWrapper>
      </StyledBookingWidgetControlRow>
    </MaybeColumn>
  );
};

export default memo(GTETourOptionTimeContainer);
