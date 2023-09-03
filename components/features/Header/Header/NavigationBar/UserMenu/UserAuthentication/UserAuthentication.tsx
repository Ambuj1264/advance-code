import React, { useState } from "react";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import SocialMediaAuthentication from "./SocialMediaAuthentication";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {
  BottomContentButton,
  BottomContentText,
  BottomText,
  ModalBottomContent,
  Social,
  SocialText,
} from "./SharedUserMenuComponents";

enum FormView {
  SignIn,
  SignUp,
}

const UserAuthentication = ({
  userMenuTexts,
  forgotPasswordLink,
}: {
  userMenuTexts: HeaderTypes.UserMenuModalTexts | HeaderTypes.UserMenuTexts;
  forgotPasswordLink: string;
}) => {
  const [activeFormView, setActiveFormView] = useState<FormView>(FormView.SignIn);
  return (
    <div>
      <SocialMediaAuthentication />

      <Social>
        <SocialText>
          {activeFormView === FormView.SignIn
            ? userMenuTexts.orSignInWith
            : userMenuTexts.orSignUpWith}
        </SocialText>
      </Social>
      {activeFormView === FormView.SignIn ? (
        <SignInForm
          emailPlaceholder={userMenuTexts.email}
          passwordPlaceholder={userMenuTexts.password}
          buttonText={userMenuTexts.signIn}
          forgotPasswordText={userMenuTexts.forgotPassword}
          errorText={userMenuTexts.signInError}
          forgotPasswordLink={forgotPasswordLink}
        />
      ) : (
        <SignUpForm
          fullNamePlaceholder={userMenuTexts.fullName}
          emailPlaceholder={userMenuTexts.email}
          passwordPlaceholder={userMenuTexts.password}
          confirmPasswordPlaceholder={userMenuTexts.confirmPassword}
          buttonText={userMenuTexts.signUp}
          errorText={userMenuTexts.signUpError}
        />
      )}
      <ModalBottomContent>
        <BottomContentText>
          {activeFormView === FormView.SignIn
            ? `${userMenuTexts.noAccount} `
            : `${userMenuTexts.existingAccount} `}
        </BottomContentText>
        <BottomContentButton
          id={activeFormView === FormView.SignIn ? "register" : "login"}
          type="button"
          onClick={() =>
            setActiveFormView(
              activeFormView === FormView.SignIn ? FormView.SignUp : FormView.SignIn
            )
          }
        >
          <BottomText>
            {activeFormView === FormView.SignIn
              ? userMenuTexts.registerHere
              : userMenuTexts.loginHere}
          </BottomText>
        </BottomContentButton>
      </ModalBottomContent>
    </div>
  );
};

export default UserAuthentication;
