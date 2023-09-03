import React from "react";

import PhoneNumberInput from "./PhoneNumberInput";

export const PhoneNumberInputContainer = ({
  phoneNumber,
  hasError,
  onPhoneNumberChange,
  placeholder = "",
  className,
}: {
  phoneNumber: string;
  hasError: boolean;
  onPhoneNumberChange: (phoneNumber: string) => void;
  placeholder?: string;
  className?: string;
}) => (
  <PhoneNumberInput
    phoneNumber={phoneNumber}
    onPhoneNumberChange={onPhoneNumberChange}
    hasError={hasError}
    placeholder={placeholder}
    className={className}
  />
);

export default PhoneNumberInputContainer;
