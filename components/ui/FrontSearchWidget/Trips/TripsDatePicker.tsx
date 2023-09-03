import React, { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/core";

import { SearchWidgetDatePickerLarge } from "../FrontTabsShared";
import { useOnDatesClear, useSetRangeDates, useSetSingleDate } from "../frontHooks";
import { useFrontSearchContext } from "../FrontSearchStateContext";

import TripsDateToggle from "./TripsDateToggle";

import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import useToggle from "hooks/useToggle";
import { Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const ContentWrapper = styled.div`
  position: relative;
`;
export const ToggleWrapper = styled.div<{ useDesktopStyle?: boolean }>(
  ({ useDesktopStyle = true }) => [
    css`
      position: static;
      display: flex;
      justify-content: flex-end;
    `,
    useDesktopStyle &&
      css`
        ${mqMin.large} {
          position: absolute;
          bottom: -${gutters.large}px;
          left: 0;
          justify-content: flex-start;
          min-width: 250px;
        }
      `,
  ]
);

const TripsDatePicker = ({
  dateFrom,
  dateTo,
  onDateInputClick,
  isMobile,
  isSingleDate,
  useDesktopStyle = true,
  isOpen = false,
}: {
  dateFrom?: string;
  dateTo?: string;
  onDateInputClick: () => void;
  isMobile: boolean;
  isSingleDate: boolean;
  useDesktopStyle?: boolean;
  isOpen?: boolean;
}) => {
  const { setContextState } = useFrontSearchContext();
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const [isExactDate, toggleIsExactDate] = useToggle(isSingleDate);
  const { marketplace } = useSettings();
  const browserDate = new Date();
  const setRangeDates = useSetRangeDates();
  const setSingleDate = useSetSingleDate();
  const onDatesClear = useOnDatesClear();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const selectedDates = constructSelectedDatesFromQuery({
    dateFrom,
    dateTo,
  });
  const initialMonth = selectedDates.from || selectedDates.to || browserDate;

  const handleOnDateRangeToggle = useCallback(
    (isChecked: boolean) => {
      setContextState({ isSingleDate: !isChecked });
      if (!isChecked) {
        setSingleDate(selectedDates);
      } else {
        setRangeDates(selectedDates);
      }
      toggleIsExactDate();
    },
    [selectedDates, setContextState, setRangeDates, setSingleDate, toggleIsExactDate]
  );

  useEffect(() => {
    return () => {
      setContextState({ isSingleDate: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentWrapper>
      <SearchWidgetDatePickerLarge
        selectedDates={selectedDates}
        initialMonth={initialMonth}
        onDateSelection={isExactDate ? setSingleDate : setRangeDates}
        onDateInputClick={onDateInputClick}
        minDays={1}
        numberOfMonths={isMobile || isExactDate ? 1 : 2}
        dates={{ unavailableDates: [], min: browserDate }}
        fromPlaceholder={t("Starting date")}
        toPlaceholder={t("Final date")}
        preOpenCalendar={false}
        allowSeparateSelection={!isExactDate}
        disabled={isMobile}
        onClear={onDatesClear}
        showDateTo={!isExactDate}
        isOpen={isOpen}
      />
      {isGTE && (
        <ToggleWrapper useDesktopStyle={useDesktopStyle}>
          <TripsDateToggle isChecked={!isExactDate} onChange={handleOnDateRangeToggle} />
        </ToggleWrapper>
      )}
    </ContentWrapper>
  );
};

export default TripsDatePicker;
