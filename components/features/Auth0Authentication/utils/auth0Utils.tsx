import auth0 from "auth0-js";
import React from "react";

import getWebAuthConfig from "../auth0.config";
import { LoginOptions } from "../AuthEnums";

export type DisplayMessage = {
  isError: boolean;
  message: string;
};

export const getRedirectUri = () => {
  const baseUri = window.location.pathname;
  const queryParams = window.location.search;
  const encodedParams = encodeURIComponent(queryParams);
  const uri = `${baseUri}${encodedParams}`;
  return uri;
};

export const validatePasswordStrength = (password: string) => {
  const passwordCheck = /^(?=.*?[A-Z])(?=.*?[a-z]).{8,20}$/;
  const digitcheck = /(?=.*?[0-9])/;
  // eslint-disable-next-line no-useless-escape
  const specialCheck = /(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
  return Boolean(
    passwordCheck.test(password) && (digitcheck.test(password) || specialCheck.test(password))
  );
};

export const getAuthInstance = (host: string) => {
  const auth0Confing = getWebAuthConfig(host);
  return new auth0.WebAuth(auth0Confing);
};

const getSocialConfig = (host: string, connection: LoginOptions, redirectUri: string) => {
  return {
    redirectUri: `https://${host}/auth/login?originalUri=${redirectUri}`,
    responseType: "code",
    connection,
  };
};

const getOneTapConfig = (host: string, redirectUri: string, email: string) => {
  return {
    redirectUri: `https://${host}/auth/login?originalUri=${redirectUri}`,
    responseType: "code",
    connection: LoginOptions.GOOGLE,
    login_hint: email,
  };
};

const getLoginConfig = (host: string, email: string, password: string, redirectUri: string) => {
  return {
    redirectUri: `https://${host}/auth/login?originalUri=${redirectUri}`,
    responseType: "code",
    email,
    password,
    realm: LoginOptions.USERNAME,
  };
};

const getSignupConfig = (name: string, email: string, password: string) => {
  return {
    email,
    password,
    connection: LoginOptions.USERNAME,
    user_metadata: {
      name,
    },
  };
};

export const handleOneTapClick = (host: string, email: string) => {
  const auth0Instance = getAuthInstance(host);
  const redirectUri = getRedirectUri();
  const config = getOneTapConfig(host, redirectUri, email);

  auth0Instance.authorize(config);
};

export const handleSocialLoginClick = (
  connection: LoginOptions,
  host: string,
  auth0Instance?: auth0.WebAuth
) => {
  if (!auth0Instance) return;
  const redirectUri = getRedirectUri();
  const config = getSocialConfig(host, connection, redirectUri);

  auth0Instance.authorize(config);
};

export const handleLoginSubmit = (
  email: string,
  password: string,
  host: string,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setPwLoginError: (pwLoginError: string) => void,
  auth0Instance?: auth0.WebAuth
) => {
  if (!auth0Instance) return;
  setIsSubmitting(true);
  const redirectUri = getRedirectUri();
  const config = getLoginConfig(host, email, password, redirectUri);
  auth0Instance.login(config, error => {
    if (error) {
      setPwLoginError("Invalid log in");
      setIsSubmitting(false);
    }
  });
};

export const handleSignupSubmit = (
  name: string,
  email: string,
  password: string,
  host: string,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setPwLoginError: (pwLoginError: string) => void,
  auth0Instance?: auth0.WebAuth
) => {
  if (!auth0Instance) return;
  setIsSubmitting(true);
  const config = getSignupConfig(name, email, password);
  auth0Instance.signup(config, err => {
    setIsSubmitting(false);
    if (err) {
      setPwLoginError("Invalid sign up");
      return;
    }
    handleLoginSubmit(email, password, host, setIsSubmitting, setPwLoginError, auth0Instance);
  });
};
// talk to auth0 about more descriptive errors.
export const handlePasswordReset = (
  email: string,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setdisplayMessage: React.Dispatch<React.SetStateAction<DisplayMessage | undefined>>,
  auth0Instance?: auth0.WebAuth
) => {
  if (!auth0Instance) return;
  setIsSubmitting(true);
  auth0Instance.changePassword(
    {
      connection: LoginOptions.USERNAME,
      email,
    },
    error => {
      if (error) {
        setdisplayMessage({
          isError: true,
          message: "Invalid input",
        });
        setIsSubmitting(false);
        return;
      }
      setdisplayMessage({
        isError: false,
        message: "We've just sent you an email to reset your password",
      });
      setIsSubmitting(false);
    }
  );
};
