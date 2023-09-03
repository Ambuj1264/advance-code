import React from "react";
import { useTheme } from "emotion-theming";
import { useMutation } from "@apollo/react-hooks";
import { pipe } from "fp-ts/lib/pipeable";
import { fromNullable, map, getOrElse } from "fp-ts/lib/Option";
import { ButtonSize } from "@travelshift/ui/types/enums";
import Button from "@travelshift/ui/components/Inputs/Button";
import useForm from "@travelshift/ui/hooks/useForm";
import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import ErrorMessage from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/ErrorMessage";
import LoadingRing from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/LoadingRing";

import { getAuthenticationStatus } from "../../../utils/headerUtils";
import signInMutation from "../../../graphql/SignInMutation.graphql";

import {
  BottomContent,
  Form,
  FormButtonRow,
  FormLoginRow,
  FormRow,
  StyledInput,
  StyledLink,
} from "./SharedUserMenuComponents";

import activeUserQuery from "components/queries/ActiveUserQuery.graphql";
import { noCacheHeaders } from "utils/apiUtils";

export const initialValues = {
  email: {
    value: "",
    isValueInvalid: isInvalidEmail,
  },
  password: {
    value: "",
    isValueInvalid: isEmptyString,
  },
};

const SignInForm = ({
  emailPlaceholder,
  passwordPlaceholder,
  buttonText,
  forgotPasswordText,
  errorText,
  forgotPasswordLink,
}: {
  emailPlaceholder: string;
  passwordPlaceholder: string;
  buttonText: string;
  forgotPasswordText: string;
  errorText: string;
  forgotPasswordLink: string;
}) => {
  const theme: Theme = useTheme();
  const [signInFn, { data: signInData, loading: signInLoading }] = useMutation<
    HeaderTypes.MutationSignInData,
    HeaderTypes.MutationSignInVariables
  >(signInMutation, {
    refetchQueries: [{ query: activeUserQuery, context: { headers: { ...noCacheHeaders } } }],
  });
  const signIn = (variables: HeaderTypes.MutationSignInVariables) => signInFn({ variables });
  const signInStatus = getAuthenticationStatus(
    signInLoading,
    pipe(
      signInData,
      fromNullable,
      map(data => data.login.status),
      getOrElse(() => false as boolean)
    ),
    signInData
  );

  const loading = signInStatus === "loading";
  const error = signInStatus === "error";

  const signInErrorMessage = signInData && signInData.login.errorMessage;

  const onSubmit = ({ email, password }: any) => signIn({ email, password });
  const {
    values: { email, password },
    errors: { email: isEmailError, password: isPasswordError },
    blurredInputs: { email: isEmailBlurred, password: isPasswordBlurred },
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues,
    onSubmit,
  });

  const containsError = error || isEmailError || isPasswordError;

  return (
    <Form id={containsError ? "signInFormError" : "signInForm"} onSubmit={handleSubmit}>
      <ErrorMessage showError={containsError}>{signInErrorMessage || errorText}</ErrorMessage>
      <FormLoginRow>
        <StyledInput
          name="email"
          type="email"
          value={email.value as string}
          onChange={handleChange}
          placeholder={emailPlaceholder}
          error={isEmailBlurred && isEmailError}
          onBlur={handleBlur}
          autoComplete="username"
        />
      </FormLoginRow>
      <FormRow>
        <StyledInput
          name="password"
          type="password"
          value={password.value as string}
          onChange={handleChange}
          placeholder={passwordPlaceholder}
          error={isPasswordBlurred && isPasswordError}
          onBlur={handleBlur}
          autoComplete="current-password"
        />
      </FormRow>
      <BottomContent>
        <StyledLink href={forgotPasswordLink}>{forgotPasswordText}</StyledLink>
      </BottomContent>
      <FormButtonRow>
        <Button
          id="userMenuSignInSubmit"
          type="submit"
          buttonSize={ButtonSize.Medium}
          disabled={loading}
          theme={theme}
          color="action"
        >
          {loading ? <LoadingRing /> : buttonText}
        </Button>
      </FormButtonRow>
    </Form>
  );
};

export default SignInForm;
