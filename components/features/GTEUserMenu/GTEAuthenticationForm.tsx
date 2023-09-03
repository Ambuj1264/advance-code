import React from "react";

import { Wrapper } from "../Header/Header/NavigationBar/UserMenu/UserMenuActions";

import { useAuthStateContext } from "./contexts/GTEAuthContext";

import Auth0AuthenticationContainer from "components/features/Auth0Authentication/Auth0AuthenticationContainer";
import Auth0PasswordResetForm from "components/features/Auth0Authentication/Auth0PasswordResetForm";

const GTEAuthenticationForm = ({
  setModalText,
}: {
  setModalText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isReset } = useAuthStateContext();

  return (
    <Wrapper>
      {isReset ? (
        <Auth0PasswordResetForm />
      ) : (
        <Auth0AuthenticationContainer setModalText={setModalText} />
      )}
    </Wrapper>
  );
};

export default GTEAuthenticationForm;
