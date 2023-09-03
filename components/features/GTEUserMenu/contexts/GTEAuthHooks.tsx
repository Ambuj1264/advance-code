import { useCallback } from "react";

import { useAuthStateContext } from "./GTEAuthContext";

import {
  DisplayMessage,
  handleLoginSubmit,
  handlePasswordReset,
  handleSignupSubmit,
  handleSocialLoginClick,
} from "components/features/Auth0Authentication/utils/auth0Utils";
import { LoginOptions } from "components/features/Auth0Authentication/AuthEnums";

export const useOnIsSubmitting = () => {
  const { setContextState } = useAuthStateContext();
  return useCallback(
    (isSubmitting: boolean) => {
      setContextState({
        isSubmitting,
      });
    },
    [setContextState]
  );
};

export const useOnSetPwLoginError = () => {
  const { setContextState } = useAuthStateContext();
  return useCallback(
    (pwLoginError: string) => {
      setContextState({
        pwLoginError,
      });
    },
    [setContextState]
  );
};

export const useOnToggleReset = () => {
  const { setAllContextState } = useAuthStateContext();
  return useCallback(() => {
    setAllContextState(prevState => ({
      ...prevState,
      isReset: !prevState.isReset,
    }));
  }, [setAllContextState]);
};

export const useOnSocialLogin = () => {
  const { auth0Instance, host } = useAuthStateContext();
  return useCallback(
    (connection: LoginOptions) => {
      handleSocialLoginClick(connection, host, auth0Instance);
    },
    [auth0Instance, host]
  );
};

export const useOnLogin = () => {
  const { auth0Instance, host } = useAuthStateContext();
  const setIsSubmitting = useOnIsSubmitting();
  const setPwLoginError = useOnSetPwLoginError();
  return useCallback(
    (email: string, password: string) => {
      handleLoginSubmit(email, password, host, setIsSubmitting, setPwLoginError, auth0Instance);
    },
    [auth0Instance, host, setIsSubmitting, setPwLoginError]
  );
};

export const useOnSignup = () => {
  const { auth0Instance, host } = useAuthStateContext();
  const setIsSubmitting = useOnIsSubmitting();
  const setPwLoginError = useOnSetPwLoginError();
  return useCallback(
    (name: string, email: string, password: string) => {
      handleSignupSubmit(
        name,
        email,
        password,
        host,
        setIsSubmitting,
        setPwLoginError,
        auth0Instance
      );
    },
    [auth0Instance, host, setIsSubmitting, setPwLoginError]
  );
};

export const useOnResetPassword = () => {
  const { auth0Instance } = useAuthStateContext();
  const setIsSubmitting = useOnIsSubmitting();
  return useCallback(
    (
      email: string,
      setdisplayMessage: React.Dispatch<React.SetStateAction<DisplayMessage | undefined>>
    ) => {
      handlePasswordReset(email, setIsSubmitting, setdisplayMessage, auth0Instance);
    },
    [auth0Instance, setIsSubmitting]
  );
};
