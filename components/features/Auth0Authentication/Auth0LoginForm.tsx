import React, { useCallback } from "react";
import ErrorMessage from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/ErrorMessage";
import useForm from "@travelshift/ui/hooks/useForm";
import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";

import {
  BottomContent,
  BottomContentButton,
  BottomText,
  Form,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";
import UserActionButton from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/UserActionButton";
import { useOnToggleReset, useOnLogin } from "../GTEUserMenu/contexts/GTEAuthHooks";
import { useAuthStateContext } from "../GTEUserMenu/contexts/GTEAuthContext";

import EmailPasswordInputs from "./EmailPasswordInputs";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const initialValues = {
  email: {
    value: "",
    isValueInvalid: isInvalidEmail,
  },
  password: {
    value: "",
    isValueInvalid: isEmptyString,
  },
};

const Auth0LoginForm = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const { isSubmitting, pwLoginError } = useAuthStateContext();
  const handleLoginSubmit = useOnLogin();
  const toggleIsReset = useOnToggleReset();
  const onLoginClick = useCallback(
    ({ email, password }) => {
      handleLoginSubmit(email, password);
    },
    [handleLoginSubmit]
  );
  // TODO: use errors and blur values
  const {
    values: { email, password },
    errors: { email: isEmailError, password: isPasswordError },
    blurredInputs: { email: isEmailBlurred, password: isPasswordBlurred },
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues,
    onSubmit: onLoginClick,
  });

  const handleLoginCB = useCallback(
    e => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <Form id="GTESignInForm" onSubmit={handleLoginCB}>
      <ErrorMessage showError={Boolean(pwLoginError !== "")}>{t(pwLoginError)}</ErrorMessage>
      <EmailPasswordInputs
        email={email.value as string}
        password={password.value as string}
        handleChange={handleChange}
        translate={t}
        emailError={isEmailBlurred && isEmailError}
        passwordError={isPasswordBlurred && isPasswordError}
        onBlur={handleBlur}
        passwordAutocomplete="current"
      />
      <BottomContent>
        <BottomContentButton id="Reset" type="button" onClick={toggleIsReset}>
          <BottomText>{t("Forgot password?")}</BottomText>
        </BottomContentButton>
      </BottomContent>
      <UserActionButton
        id="userMenuSignInSubmit"
        type="submit"
        color="action"
        buttonText={t("Log in")}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
};

export default Auth0LoginForm;
