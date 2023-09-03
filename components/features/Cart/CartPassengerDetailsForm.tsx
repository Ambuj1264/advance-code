import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import RadioButton, { RadioButtonWrapper } from "components/ui/Inputs/RadioButton";
import { getGenderOptions } from "components/features/Flight/utils/flightUtils";
import usePassengersForm from "components/features/Flight/hooks/usePassengersForm";
import PassengerPassportDetailsForm from "components/features/Flight/PassengerPassportDetailsForm";
import { useTranslation } from "i18n";
import Input, { Wrapper } from "components/ui/Inputs/Input";
import { greyColor, gutters, separatorColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import DateSelect, { LocationSelectWrapper, StyledDropDown } from "components/ui/Inputs/DateSelect";
import { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";
import InputWrapper, { InputError } from "components/ui/InputWrapper";
import NationalityDropdown from "components/ui/Inputs/Dropdown/NationalityDropdown";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import Row from "components/ui/Grid/Row";
import { column, mqMax, mqMin } from "styles/base";

export const DoubleInputWrapperContainer = styled.div``;

export const DoubleInputWrapper = styled(InputWrapper)<{ topRight?: boolean }>`
  > ${DoubleInputWrapperContainer} {
    display: flex;

    ${Wrapper} {
      width: 100%;

      &:nth-child(1) {
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:nth-child(2) {
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        &:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          display: block;
          width: 1px;
          height: ${gutters.large}px;
          background: ${separatorColor};
          transform: translateY(-50%);
        }
      }
    }

    /* stylelint-disable selector-max-type */
    input::placeholder {
      color: ${rgba(greyColor, 0.6)};
    }
  }

  ${InputError} {
    ${({ topRight = false }) =>
      topRight &&
      css`
        top: 0;
        right: 0;
      `}
  }
`;

export const GenderWrapper = styled(InputWrapper)`
  display: flex;
  margin-top: ${gutters.small / 2}px;

  span {
    position: static;
    margin-left: ${gutters.small / 2}px;
  }

  ${RadioButtonWrapper} + ${RadioButtonWrapper} {
    margin-left: ${gutters.large}px;
  }
`;

export const StyledColumn = styled.div([column({ small: 1, desktop: 1 / 2 })]);

export const ColumnWrapper = styled.div([
  column({ small: 1, large: 1 / 2 }),
  css`
    ${mqMax.large} {
      margin-top: ${gutters.small / 2}px;
      margin-bottom: ${gutters.small / 2}px;
    }
  `,
]);

const NarrowDateSelect = styled(DateSelect)`
  ${mqMin.medium} {
    ${DropdownWrapper} ${StyledDropDown} div[data-selected="true"] {
      padding-left: ${gutters.large / 4}px;
    }
  }

  ${mqMin.desktop} {
    ${LocationSelectWrapper} ${DropdownWrapper}:nth-of-type(2),
    ${LocationSelectWrapper} ${DropdownWrapper}:nth-of-type(3) {
      flex-basis: 40%;
      flex-grow: 0.4;
      max-width: 40%;
    }
  }
`;

const CartPassengerDetailsForm = ({
  passenger,
  onPassengerDetailsChange,
  className,
}: {
  passenger: FlightTypes.PassengerDetails;
  onPassengerDetailsChange: (
    passengerId: number,
    passengerDetails: Partial<FlightTypes.PassengerDetails>
  ) => void;
  className?: string;
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
    onGivenNameChange,
    onSurnameChange,
    onNationalityChange,
    onGenderChange,
    customErrorMessage,
  } = usePassengersForm({
    passenger,
    onPassengerDetailsChange,
  });

  const { nameError, surnameError, nationalityError, genderError } = passengerFormErrors;

  const hasNameSurnameError = blurred && (nameError || surnameError);
  const isMobile = useIsMobile();
  const selectHeight = isMobile ? 40 : 45;
  const gendersOption = getGenderOptions(t);
  const genderGroup = `genderSelect-${passenger.id}`;

  return (
    <Row className={className}>
      <StyledColumn>
        <DoubleInputWrapper
          label={t("Traveller {id}", { id })}
          id={`givenNameWrapper${id}`}
          hasError={hasNameSurnameError}
          customErrorMessage={t("Fields are required")}
          topRight
        >
          <DoubleInputWrapperContainer>
            <Input
              id={`givenName${id}`}
              placeholder={t("Given names")}
              value={name}
              onChange={onGivenNameChange}
              useDebounce={false}
              error={hasNameSurnameError}
              autocomplete="given-name"
            />
            <Input
              id={`surname${id}`}
              placeholder={t("Surnames")}
              value={surname}
              onChange={onSurnameChange}
              useDebounce={false}
              error={hasNameSurnameError}
              autocomplete="family-name"
            />
          </DoubleInputWrapperContainer>
        </DoubleInputWrapper>
        <GenderWrapper
          label=""
          id={`gendersOption${id}`}
          hasError={blurred && genderError}
          customErrorMessage={customErrorMessage}
        >
          <>
            {gendersOption.map(genderOption => {
              const genderOptionId = `${genderGroup}${genderOption.value}`;

              return (
                <RadioButton
                  checked={gender === genderOption.value}
                  label={genderOption.label}
                  name={genderGroup}
                  value={genderOption.value}
                  id={genderOptionId}
                  key={genderOptionId}
                  onChange={onGenderChange}
                />
              );
            })}
          </>
        </GenderWrapper>
      </StyledColumn>
      <StyledColumn>
        <Row>
          <ColumnWrapper>
            <NationalityDropdown
              hasError={blurred && nationalityError}
              nationality={nationality}
              onChange={onNationalityChange}
              placeholder={t("Select country")}
            />
          </ColumnWrapper>
          <ColumnWrapper>
            <InputWrapper
              label={t("Date of birth")}
              id="dateOfBirth"
              hasError={hasBirthdayError}
              customErrorMessage={birthDayDateError || customErrorMessage}
            >
              <NarrowDateSelect
                date={birthday}
                onDateChange={handleBirthDateChange(id)}
                error={hasBirthdayError}
                selectHeight={selectHeight}
                isArrowHidden
              />
            </InputWrapper>
          </ColumnWrapper>
        </Row>
      </StyledColumn>
      {passportRequired && (
        <PassengerPassportDetailsForm
          passenger={passenger}
          onPassengerDetailsChange={onPassengerDetailsChange}
          blurred={blurred}
          selectHeight={selectHeight}
          passengerFormErrors={passengerFormErrors}
          customErrorMessage={customErrorMessage}
          handlePassengerInfoChange={handlePassengerInfoChange}
          isDateSelectArrowHidden
          placeholder={t("Add passport number")}
        />
      )}
    </Row>
  );
};

export default CartPassengerDetailsForm;
