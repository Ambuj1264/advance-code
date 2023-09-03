import React, { useCallback, useEffect } from "react";
import ErrorMessage from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/ErrorMessage";
import styled from "@emotion/styled";
import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import useForm from "@travelshift/ui/hooks/useForm";

import {
  Form,
  FormRow,
  StyledInput,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";
import UserActionButton from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/UserActionButton";
import { useOnSetPwLoginError, useOnSignup } from "../GTEUserMenu/contexts/GTEAuthHooks";
import { useAuthStateContext } from "../GTEUserMenu/contexts/GTEAuthContext";

import EmailPasswordInputs from "./EmailPasswordInputs";
import { validatePasswordStrength } from "./utils/auth0Utils";

import { gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const FormNameRow = styled.div`
  margin-bottom: ${gutters.small * 2}px;
  width: 100%;
`;

const initialValues = {
  name: {
    value: "",
    isValueInvalid: isEmptyString,
  },
  email: {
    value: "",
    isValueInvalid: isInvalidEmail,
  },
  password: {
    value: "",
    isValueInvalid: isEmptyString,
  },
  passwordConfirm: {
    value: "",
    isValueInvalid: isEmptyString,
  },
};

const Auth0SignupForm = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const { isSubmitting, pwLoginError } = useAuthStateContext();
  const handleSignupSubmit = useOnSignup();
  const setPwLoginError = useOnSetPwLoginError();
  const onSignUpClick = useCallback(
    ({ name, email, password }) => {
      handleSignupSubmit(name as string, email as string, password as string);
    },
    [handleSignupSubmit]
  );

  const {
    values: { name, email, password, passwordConfirm },
    errors: { email: isEmailError, password: isPasswordError },
    blurredInputs: {
      email: isEmailBlurred,
      password: isPasswordBlurred,
      passwordConfirm: isPasswordConfirmBlurred,
    },
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues,
    onSubmit: onSignUpClick,
  });

  const isPasswordMismatch = password.value !== passwordConfirm.value;

  useEffect(() => {
    if (isEmailBlurred && isEmailError) {
      setPwLoginError("Invalid email");
    } else if (
      isPasswordBlurred &&
      !validatePasswordStrength(password.value as string) &&
      (password.value as string) !== ""
    ) {
      setPwLoginError(
        "password must be between 8 - 20 characters with at least one lowercase letter, one uppercase letter and one numeric digit or special character"
      );
    } else if (isPasswordBlurred && isPasswordError) {
      setPwLoginError("Password is required");
    } else if (isPasswordBlurred && isPasswordConfirmBlurred && isPasswordMismatch) {
      setPwLoginError("Password mismatch");
    } else {
      setPwLoginError("");
    }
  }, [
    isPasswordMismatch,
    isEmailError,
    setPwLoginError,
    isEmailBlurred,
    isPasswordBlurred,
    isPasswordConfirmBlurred,
    isPasswordError,
    password,
  ]);

  const handleSignupCB = useCallback(
    e => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <Form id="GTESignInForm" onSubmit={handleSignupCB}>
      <ErrorMessage showError={Boolean(pwLoginError !== "")}>{t(pwLoginError)}</ErrorMessage>
      <FormNameRow>
        <StyledInput
          name="name"
          type="text"
          value={name.value as string}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t("Name")}
          autoComplete="name"
        />
      </FormNameRow>
      <EmailPasswordInputs
        email={email.value as string}
        password={password.value as string}
        handleChange={handleChange}
        translate={t}
        emailError={isEmailBlurred && isEmailError}
        passwordError={isPasswordBlurred && isPasswordError}
        onBlur={handleBlur}
        passwordAutocomplete="new-password"
      />
      <FormRow>
        <StyledInput
          name="passwordConfirm"
          type="password"
          value={passwordConfirm.value as string}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder={t("Confirm password")}
          error={isPasswordConfirmBlurred && isPasswordMismatch}
          onBlur={handleBlur}
        />
      </FormRow>
      <UserActionButton
        id="userMenuSignUpSubmit"
        type="submit"
        color="action"
        buttonText={t("Sign up")}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
};

export default Auth0SignupForm;
