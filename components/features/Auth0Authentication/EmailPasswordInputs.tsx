import React from "react";

import {
  FormLoginRow,
  FormRow,
  StyledInput,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";

const EmailPasswordInputs = ({
  email,
  password,
  emailError,
  passwordError,
  handleChange,
  translate,
  onBlur,
  passwordAutocomplete,
}: {
  email: string;
  password: string;
  emailError?: boolean;
  passwordError?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  translate: TFunction;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordAutocomplete: string;
}) => {
  return (
    <>
      <FormLoginRow>
        <StyledInput
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          autoComplete="username"
          placeholder={translate("Email")}
          error={emailError}
          onBlur={onBlur}
        />
      </FormLoginRow>
      <FormRow>
        <StyledInput
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
          autoComplete={passwordAutocomplete}
          placeholder={translate("Password")}
          error={passwordError}
          onBlur={onBlur}
        />
      </FormRow>
    </>
  );
};

export default EmailPasswordInputs;
