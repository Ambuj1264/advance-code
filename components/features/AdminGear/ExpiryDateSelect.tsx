import React, { useCallback, useState } from "react";
import { isPast, isValid } from "date-fns";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { hasExpiryError, hasExpiryInvalid, isDateInvalid } from "../Flight/utils/flightUtils";

import { columnCommonStyles } from "./sharedAdminComponents";

import { getDateStringFromBirthdayType, getFormattedDate, isoFormat } from "utils/dateUtils";
import DateSelect from "components/ui/Inputs/DateSelect";
import TimeDropdown from "components/ui/Inputs/TimeDropdown";
import InputWrapper from "components/ui/InputWrapper";
import { fontSizeBody2, gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";
import { column, mqMax } from "styles/base";
import useOnDidUpdate from "hooks/useOnDidUpdate";
import { getPriceSign as getNumberSign } from "utils/currencyFormatUtils";

const Wrapper = styled.div<{ inputHasError: boolean }>(
  ({ inputHasError }) => css`
    margin-bottom: ${inputHasError ? gutters.large : gutters.small / 2}px;

    /* stylelint-disable selector-max-type */
    div[class*="menu"] {
      & > div {
        max-height: 100px;
      }
    }
    ${mqMax.large} {
      margin-bottom: 0;
    }
  `
);

const StyledDateSelect = styled(DateSelect)`
  font-size: ${fontSizeBody2};
`;

const ColumnLg = styled.div(() => [column({ small: 1, large: 7 / 10 }), columnCommonStyles]);
const ColumnSm = styled.div(() => [column({ small: 1, large: 3 / 10 }), columnCommonStyles]);

const emptyDate = {
  day: undefined,
  month: undefined,
  year: undefined,
};

const ExpiryDateSelect = ({
  id = "main",
  onUpdateExpiryDate,
  isDisabled = false,
  canValidate,
}: {
  id?: number | string;
  onUpdateExpiryDate: (dateString?: string) => void;
  isDisabled?: boolean;
  canValidate: boolean;
}) => {
  const emptyDateErrorMessage = "The expiration date cannot be empty";
  const [dateErrorObj, setDateErrorObj] = useState<{
    isInvalid: boolean;
    message: string;
    canDisplayDateError: boolean;
  }>({
    isInvalid: !isDisabled,
    message: emptyDateErrorMessage,
    canDisplayDateError: false,
  });
  const [expDate, setExpDate] = useState<SharedTypes.Birthdate>(emptyDate);
  const [expTime, setExpTime] = useState<SharedTypes.TimeDropdownObject>({
    hour: "00",
    minutes: "00",
  });

  const hasError = dateErrorObj.canDisplayDateError && dateErrorObj.isInvalid;

  const handleOnExpiryDateChange = useCallback(
    (dateObject: SharedTypes.Birthdate, timeObj?: SharedTypes.TimeDropdownObject) => {
      setExpDate(dateObject);
      let dateString;
      if (isDateInvalid(dateObject)) {
        setDateErrorObj({
          isInvalid: true,
          message: emptyDateErrorMessage,
          canDisplayDateError: true,
        });
      } else {
        const expiryDate = new Date(getDateStringFromBirthdayType(dateObject, timeObj ?? expTime));
        const isDateInThePast = isValid(expiryDate) ? isPast(expiryDate) : false;
        const isDateError =
          hasExpiryError(false, dateObject) ||
          hasExpiryInvalid(false, dateObject) ||
          isDateInThePast;
        setDateErrorObj({
          isInvalid: isDateError,
          message: isDateInThePast ? "Please pick a date in the future" : emptyDateErrorMessage,
          canDisplayDateError: isDateError,
        });
        dateString = isDateError ? undefined : getFormattedDate(expiryDate, isoFormat);
      }
      onUpdateExpiryDate(dateString);
    },
    [expTime, onUpdateExpiryDate]
  );

  const onTimeChange = useCallback(
    (timeObj: SharedTypes.TimeDropdownObject) => {
      setExpTime(timeObj);
      handleOnExpiryDateChange(expDate, timeObj);
    },
    [expDate, handleOnExpiryDateChange]
  );

  useOnDidUpdate(() => {
    if (canValidate) {
      setDateErrorObj(prev => ({ ...prev, canDisplayDateError: true }));
    }
  }, [canValidate]);

  const currentGMTOffset = (new Date().getTimezoneOffset() / 60) * -1;
  const toolTip = `Your timezone is GMT${getNumberSign(currentGMTOffset)}${Math.abs(
    currentGMTOffset
  )}`;

  return (
    <Wrapper inputHasError={hasError}>
      <Row>
        <ColumnLg>
          <InputWrapper
            label="Expiry date (GMT)"
            id={`expiry-date-wrapper-${id}`}
            hasError={hasError}
            customErrorMessage={dateErrorObj.message}
            InfoTooltipText={toolTip}
          >
            <StyledDateSelect
              date={isDisabled ? emptyDate : expDate}
              isExpiration
              onDateChange={handleOnExpiryDateChange}
              error={hasError}
              selectHeight={45}
              disabled={isDisabled}
              expirationYearsLimit={5}
              isArrowHidden
            />
          </InputWrapper>
        </ColumnLg>
        <ColumnSm>
          <InputWrapper label="Expiry time (GMT)" id={`expiry-time-wrapper-${id}`}>
            <TimeDropdown
              onTimeChange={onTimeChange}
              time={expTime}
              isArrowHidden
              selectHeight={45}
              isDisabled={isDisabled}
            />
          </InputWrapper>
        </ColumnSm>
      </Row>
    </Wrapper>
  );
};

export default ExpiryDateSelect;
