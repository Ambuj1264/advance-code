import React from "react";
import styled from "@emotion/styled";

import { checkIsPhoneNumberValid, normalisePhoneNumber } from "../utils/uiUtils";

import Input from "components/ui/Inputs/Input";
import InputWrapper from "components/ui/InputWrapper";
import { useTranslation } from "i18n";

export const StyledInput = styled(Input)`
  flex-basis: 100%;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input {
    margin-top: -2px;
  }
`;

const PHONE_NUMBER_MIN_LENGTH = 4;
const PHONE_NUMBER_MAX_LENGTH = 30;

export const PhoneNumberInput = ({
  phoneNumber,
  hasError,
  onPhoneNumberChange,
  label,
  placeholder = "",
  className,
}: {
  phoneNumber: string;
  hasError: boolean;
  onPhoneNumberChange: (phoneNumber: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <InputWrapper
      label={label || t("Phone")}
      id="phone"
      hasError={hasError}
      customErrorMessage={t("Field is required")}
      className={className}
    >
      <StyledInput
        id="phoneInput"
        value={phoneNumber}
        onChange={event => {
          onPhoneNumberChange(normalisePhoneNumber(event.target.value));
        }}
        autocomplete="tel"
        type="tel"
        useDebounce={false}
        min={PHONE_NUMBER_MIN_LENGTH}
        maxLength={PHONE_NUMBER_MAX_LENGTH}
        error={hasError}
        onKeyPress={e => {
          if (!checkIsPhoneNumberValid(e.key, e.currentTarget.value)) {
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default PhoneNumberInput;
