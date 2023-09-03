import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { getPassportExpirationErrorMessage } from "./utils/flightUtils";

import { PassengersFields } from "components/features/FlightSearchPage/types/flightEnums";
import { Column } from "components/ui/FlightsShared/flightShared";
import { useTranslation } from "i18n";
import Input from "components/ui/Inputs/Input";
import { gutters } from "styles/variables";
import Checkbox from "components/ui/Inputs/Checkbox";
import { Namespaces } from "shared/namespaces";
import DateSelect from "components/ui/Inputs/DateSelect";
import InputWrapper from "components/ui/InputWrapper";

export const StyledColumn = styled(Column)`
  position: relative;
  margin-top: ${gutters.small / 2}px;
  margin-bottom: ${gutters.small / 2}px;
`;

const ExpirationWrapper = styled.div`
  position: relative;
  margin-bottom: ${gutters.small / 2}px;
  span {
    right: 0;
  }
`;

const PassengerPassportDetailsForm = ({
  passenger,
  onPassengerDetailsChange,
  blurred,
  selectHeight,
  passengerFormErrors,
  customErrorMessage,
  handlePassengerInfoChange,
  isDateSelectArrowHidden,
  placeholder = "",
}: {
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  blurred: boolean;
  selectHeight: number;
  passengerFormErrors: FlightTypes.PassengerFormErrors;
  customErrorMessage: string;
  handlePassengerInfoChange: (
    id: number,
    fieldName: string
  ) => (newInfo: React.ChangeEvent<HTMLInputElement> | string | boolean) => void;
  isDateSelectArrowHidden?: boolean;
  placeholder?: string;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { id, passportno, passportExpiration, noPassportExpiration } = passenger;

  const handleExpireDateChange = useCallback(
    (passengerId: number) => (dateObject: SharedTypes.Birthdate) =>
      onPassengerDetailsChange(passengerId, {
        passportExpiration: {
          ...dateObject,
        },
      }),
    [onPassengerDetailsChange]
  );

  const { passportError, passportExpError, passportExpInvalidError, noPassportExpError } =
    passengerFormErrors;

  const hasPassportExpError =
    blurred && (passportExpError || passportExpInvalidError || noPassportExpError);

  return (
    <>
      <StyledColumn>
        <InputWrapper
          label={t("Passport or ID number")}
          id={`passportWrapper${id}`}
          hasError={blurred && passportError}
          customErrorMessage={customErrorMessage}
        >
          <Input
            id={`passport${id}`}
            value={passportno}
            onChange={handlePassengerInfoChange(id, PassengersFields.passportno)}
            useDebounce={false}
            error={blurred && passportError}
            placeholder={placeholder}
          />
        </InputWrapper>
      </StyledColumn>
      <StyledColumn>
        <ExpirationWrapper>
          <InputWrapper
            label={t("Passport or ID expiry date")}
            id="passportExpiry"
            hasError={hasPassportExpError}
            customErrorMessage={
              getPassportExpirationErrorMessage(passportExpError, passportExpInvalidError, t) ||
              customErrorMessage
            }
          >
            <DateSelect
              date={passportExpiration}
              onDateChange={handleExpireDateChange(id)}
              disabled={noPassportExpiration}
              isExpiration
              error={hasPassportExpError}
              selectHeight={selectHeight}
              isArrowHidden={isDateSelectArrowHidden}
            />
          </InputWrapper>
        </ExpirationWrapper>
        <Checkbox
          id={`noExpiryCheckbox${id}`}
          label={t("No Expiry")}
          name={t("No Expiry")}
          checked={noPassportExpiration}
          onChange={handlePassengerInfoChange(id, PassengersFields.noPassportExpiration)}
        />
      </StyledColumn>
    </>
  );
};

export default PassengerPassportDetailsForm;
