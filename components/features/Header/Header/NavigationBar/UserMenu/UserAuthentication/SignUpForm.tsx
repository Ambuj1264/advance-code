import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { useMutation } from "@apollo/react-hooks";
import { fromNullable, map, getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import useForm from "@travelshift/ui/hooks/useForm";
import { ButtonSize } from "@travelshift/ui/types/enums";
import Button from "@travelshift/ui/components/Inputs/Button";
import { isEmptyString, isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import LoadingRing from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/LoadingRing";
import ErrorMessage from "@travelshift/ui/components/Header/NavigationBar/UserMenu/UserAuthentication/ErrorMessage";

import { getAuthenticationStatus } from "../../../utils/headerUtils";
import signUpMutation from "../../../graphql/SignUpMutation.graphql";

import { Form, FormLoginRow, FormRow, StyledInput } from "./SharedUserMenuComponents";

import activeUserQuery from "components/queries/ActiveUserQuery.graphql";
import { noCacheHeaders } from "utils/apiUtils";
import { gutters } from "styles/variables";

const FormButtonRow = styled(FormLoginRow)`
  margin-top: ${gutters.large}px;
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
  confirmPassword: {
    value: "",
    isValueInvalid: isEmptyString,
  },
};

const SignUpForm = ({
  fullNamePlaceholder,
  emailPlaceholder,
  passwordPlaceholder,
  confirmPasswordPlaceholder,
  buttonText,
  errorText,
}: {
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  buttonText: string;
  errorText: string;
}) => {
  const theme: Theme = useTheme();
  const [signUp, { data: signUpData, loading: signUpLoading }] = useMutation<
    HeaderTypes.MutationSignUpData,
    HeaderTypes.MutationSignUpVariables
  >(signUpMutation, {
    refetchQueries: [{ query: activeUserQuery, context: { headers: { ...noCacheHeaders } } }],
  });

  const signUpStatus = getAuthenticationStatus(
    signUpLoading,
    pipe(
      signUpData,
      fromNullable,
      map(data => data.signup.status),
      getOrElse(() => false as boolean)
    ) as boolean,
    signUpData
  );

  const loading = signUpStatus === "loading";
  const error = signUpStatus === "error";

  const onSubmit = ({ name, email, password, confirmPassword }: any) => {
    signUp({ variables: { name, email, password, confirmPassword } });
  };
  const {
    values: { name, email, password, confirmPassword },
    errors: {
      name: isNameError,
      email: isEmailError,
      password: isPasswordError,
      confirmPassWord: isConfirmPasswordError,
    },
    blurredInputs: {
      name: isNameBlurred,
      email: isEmailBlurred,
      password: isPasswordBlurred,
      confirmPassword: isConfirmPasswordBlurred,
    },
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues,
    onSubmit,
  });
  const isPasswordMismatch = password.value !== confirmPassword.value;
  const containsError =
    error ||
    (isEmailBlurred && isEmailError) ||
    (isPasswordBlurred && isPasswordError) ||
    (isNameBlurred && isNameError) ||
    (isConfirmPasswordBlurred && isConfirmPasswordError) ||
    isPasswordMismatch;
  return (
    <Form id={error ? "signUpFormError" : "signUpForm"} onSubmit={handleSubmit}>
      <ErrorMessage showError={containsError}>{errorText}</ErrorMessage>
      <FormLoginRow>
        <StyledInput
          name="name"
          value={name.value as string}
          onChange={handleChange}
          placeholder={fullNamePlaceholder}
          error={isNameBlurred && isNameError}
          onBlur={handleBlur}
          autoComplete="name"
        />
      </FormLoginRow>
      <FormRow>
        <StyledInput
          name="email"
          value={email.value as string}
          onChange={handleChange}
          placeholder={emailPlaceholder}
          error={isEmailBlurred && isEmailError}
          onBlur={handleBlur}
          autoComplete="email"
        />
      </FormRow>
      <FormRow>
        <StyledInput
          name="password"
          type="password"
          value={password.value as string}
          onChange={handleChange}
          placeholder={passwordPlaceholder}
          error={isPasswordMismatch || (isPasswordBlurred && isPasswordError)}
          onBlur={handleBlur}
          autoComplete="new-password"
        />
      </FormRow>
      <FormRow>
        <StyledInput
          name="confirmPassword"
          type="password"
          value={confirmPassword.value as string}
          onChange={handleChange}
          placeholder={confirmPasswordPlaceholder}
          error={isPasswordMismatch || (isConfirmPasswordBlurred && isConfirmPasswordError)}
          onBlur={handleBlur}
          autoComplete="new-password"
        />
      </FormRow>
      <FormButtonRow>
        <Button
          id="userMenuSignUpSubmit"
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

export default SignUpForm;
