import React, { useCallback, useEffect } from "react";

import {
  BottomContentButton,
  BottomContentText,
  BottomText,
  ModalBottomContent,
  Social,
  SocialText,
} from "../Header/Header/NavigationBar/UserMenu/UserAuthentication/SharedUserMenuComponents";
import { useOnSocialLogin } from "../GTEUserMenu/contexts/GTEAuthHooks";

import Auth0SocialLogin from "./Auth0SocialLogin";
import Auth0LoginForm from "./Auth0LoginForm";
import Auth0SignupForm from "./Auth0SignupForm";
import { LoginOptions } from "./AuthEnums";

import useToggle from "hooks/useToggle";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Auth0AuthenticationContainer = ({
  setModalText,
}: {
  setModalText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);

  const handleSocialLoginClick = useOnSocialLogin();

  const [isLogin, toggleIsLogin] = useToggle(true);

  const handleGoogleClick = useCallback(() => {
    handleSocialLoginClick(LoginOptions.GOOGLE);
  }, [handleSocialLoginClick]);

  const handleFacebookClick = useCallback(() => {
    handleSocialLoginClick(LoginOptions.FACEBOOK);
  }, [handleSocialLoginClick]);

  const handleAppleClick = useCallback(() => {
    handleSocialLoginClick(LoginOptions.APPLE);
  }, [handleSocialLoginClick]);

  useEffect(() => {
    setModalText(isLogin ? "Log in" : "Sign up");
  }, [isLogin, setModalText]);

  return (
    <>
      <Auth0SocialLogin
        handleGoogleClick={handleGoogleClick}
        handleFacebookClick={handleFacebookClick}
        handleAppleClick={handleAppleClick}
      />
      <Social>
        <SocialText>{t(`Or ${isLogin ? "log in" : "register"} with`)}</SocialText>
      </Social>
      {isLogin ? <Auth0LoginForm /> : <Auth0SignupForm />}
      <ModalBottomContent>
        <BottomContentText>
          {isLogin ? t("Don’t have an account? ") : t("Already have an account? ")}
        </BottomContentText>
        <BottomContentButton
          id={isLogin ? "login" : "register"}
          type="button"
          onClick={toggleIsLogin}
        >
          <BottomText>{isLogin ? t("Register here") : t("Log in here")}</BottomText>
        </BottomContentButton>
      </ModalBottomContent>
    </>
  );
};

export default Auth0AuthenticationContainer;
