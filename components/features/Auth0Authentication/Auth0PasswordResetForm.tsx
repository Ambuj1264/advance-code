import styled from "@emotion/styled";
import React, { useCallback, useState } from "react";

import { useAuthStateContext } from "../GTEUserMenu/contexts/GTEAuthContext";
import { useOnToggleReset, useOnResetPassword } from "../GTEUserMenu/contexts/GTEAuthHooks";
import {
  BottomContent,
  BottomContentButton,
  BottomText,
  Form,
  FormRow,
  SocialText,
  StyledInput,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";
import UserActionButton from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/UserActionButton";

import ErrorSuccessMessage from "./ErrorSuccessMessage";
import { DisplayMessage } from "./utils/auth0Utils";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const StyledBottomContent = styled(BottomContent)`
  display: flex;
  justify-content: center;
`;

const CenteredText = styled.div`
  width: 100%;
  text-align: center;
`;

const Auth0PasswordResetForm = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);

  const { isSubmitting } = useAuthStateContext();

  const [email, setEmail] = useState("");

  const [displayMessage, setdisplayMessage] = useState<DisplayMessage | undefined>(undefined);
  const toggleIsReset = useOnToggleReset();
  const handlePasswordReset = useOnResetPassword();

  const handleEmailChange = useCallback(e => {
    setEmail(e.target.value);
  }, []);

  const onResetClick = useCallback(
    e => {
      e.preventDefault();
      handlePasswordReset(email, setdisplayMessage);
    },
    [email, handlePasswordReset]
  );

  return (
    <Form id="GTEResetPwForm" onSubmit={onResetClick}>
      <CenteredText>
        <SocialText>{t("Did you forget you password?")}</SocialText>
      </CenteredText>
      {displayMessage && (
        <ErrorSuccessMessage
          isError={displayMessage.isError}
          message={displayMessage.message}
          translate={t}
        />
      )}
      <FormRow>
        <StyledInput
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          autoComplete="username"
          placeholder={t("Enter email to reset")}
          error={false}
        />
      </FormRow>
      <StyledBottomContent>
        <BottomContentButton id="login-reset" type="button" onClick={toggleIsReset}>
          <BottomText>{t("Back to log in")}</BottomText>
        </BottomContentButton>
      </StyledBottomContent>
      <UserActionButton
        id="userMenuSignInSubmit"
        type="submit"
        color="action"
        buttonText={t("Send reset link")}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
};

export default Auth0PasswordResetForm;
