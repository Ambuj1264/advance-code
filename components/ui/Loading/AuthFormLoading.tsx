import styled from "@emotion/styled";
import React from "react";

import LoadingSpinner from "./LoadingSpinner";

const FormLoading = styled.div`
  width: 340px;
  height: 408px;
`;

const AuthFormLoading = () => {
  return (
    <FormLoading>
      <LoadingSpinner />
    </FormLoading>
  );
};

export default AuthFormLoading;
