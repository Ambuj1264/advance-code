import React from "react";
import styled from "@emotion/styled";

import { Column, ColumnWrapper, ContentWrapper } from "../../ui/FlightsShared/flightShared";

import { getGenderOptions } from "./utils/flightUtils";
import PassengerPassportDetailsForm from "./PassengerPassportDetailsForm";
import usePassengersForm from "./hooks/usePassengersForm";

import { useTranslation } from "i18n";
import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";
import Input from "components/ui/Inputs/Input";
import { gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import DateSelect from "components/ui/Inputs/DateSelect";
import InputWrapper from "components/ui/InputWrapper";
import NationalityDropdown from "components/ui/Inputs/Dropdown/NationalityDropdown";
import { useIsMobile } from "hooks/useMediaQueryCustom";

export const StyledColumn = styled(Column)`
  position: relative;
  margin-bottom: ${gutters.small / 2}px;
`;

export const ColumnItemWrapper = styled.div`
  width: 50%;
  &:first-of-type {
    padding-right: ${gutters.small / 2}px;
  }
  &:last-of-type {
    padding-left: ${gutters.small / 2}px;
  }
`;

const PassengerDetailsForm = ({
  passenger,
  onPassengerDetailsChange,
}: {
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { id, name, surname, gender, birthday, nationality } = passenger;

  const {
    passengerFormErrors,
    hasBirthdayError,
    birthDayDateError,
    blurred,
    passportRequired,
    handlePassengerInfoChange,
    handleBirthDateChange,
    onNationalityChange,
    onGivenNameChange,
    onSurnameChange,
    onGenderChange,
    customErrorMessage,
  } = usePassengersForm({
    passenger,
    onPassengerDetailsChange,
  });

  const { nameError, surnameError, nationalityError, genderError } = passengerFormErrors;

  const isMobile = useIsMobile();
  const selectHeight = isMobile ? 40 : 45;

  return (
    <ContentWrapper>
      <StyledColumn>
        <InputWrapper
          label={t("Given names")}
          id={`givenNameWrapper${id}`}
          hasError={blurred && nameError}
          customErrorMessage={customErrorMessage}
        >
          <Input
            id={`givenName${id}`}
            value={name}
            onChange={onGivenNameChange}
            useDebounce={false}
            placeholder={t("First name")}
            error={blurred && nameError}
            autocomplete="given-name"
          />
        </InputWrapper>
      </StyledColumn>
      <StyledColumn>
        <InputWrapper
          label={t("Surnames")}
          id={`surnameWrapper${id}`}
          hasError={blurred && surnameError}
          customErrorMessage={customErrorMessage}
        >
          <Input
            id={`surname${id}`}
            value={surname}
            onChange={onSurnameChange}
            useDebounce={false}
            placeholder={t("Last name")}
            error={blurred && surnameError}
            autocomplete="family-name"
          />
        </InputWrapper>
      </StyledColumn>
      <StyledColumn>
        <ColumnWrapper>
          <ColumnItemWrapper>
            <NationalityDropdown
              hasError={blurred && nationalityError}
              nationality={nationality}
              onChange={onNationalityChange}
              placeholder={t("Select country")}
            />
          </ColumnItemWrapper>
          <ColumnItemWrapper>
            <InputWrapper
              label={t("Gender")}
              id={`genderDropdownWrapper${id}`}
              hasError={blurred && genderError}
              customErrorMessage={customErrorMessage}
            >
              <DropdownLeft
                id={`genderDropdown${id}`}
                selectHeight={selectHeight}
                options={getGenderOptions(t)}
                onChange={onGenderChange}
                selectedValue={gender}
                error={blurred && genderError}
                placeholder={t("Select gender")}
                noDefaultValue
                isSearchable
              />
            </InputWrapper>
          </ColumnItemWrapper>
        </ColumnWrapper>
      </StyledColumn>
      <StyledColumn>
        <InputWrapper
          label={t("Date of birth")}
          id="dateOfBirth"
          hasError={hasBirthdayError}
          customErrorMessage={birthDayDateError || customErrorMessage}
        >
          <DateSelect
            date={birthday}
            onDateChange={handleBirthDateChange(id)}
            error={hasBirthdayError}
            selectHeight={selectHeight}
          />
        </InputWrapper>
      </StyledColumn>
      {passportRequired && (
        <PassengerPassportDetailsForm
          passenger={passenger}
          onPassengerDetailsChange={onPassengerDetailsChange}
          blurred={blurred}
          selectHeight={selectHeight}
          passengerFormErrors={passengerFormErrors}
          customErrorMessage={customErrorMessage}
          placeholder={t("Add passport number")}
          handlePassengerInfoChange={handlePassengerInfoChange}
        />
      )}
    </ContentWrapper>
  );
};

export default PassengerDetailsForm;
