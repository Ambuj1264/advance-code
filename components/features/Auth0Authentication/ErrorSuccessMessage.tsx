import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import { typographySubtitle3 } from "styles/typography";
import { redColor } from "styles/variables";

const MessageWrapper = styled.div<{ isError: boolean }>(({ isError, theme }) => [
  typographySubtitle3,
  css`
    width: 100%;
    color: ${isError ? redColor : theme.colors.action};
    text-align: center;
  `,
]);

const ErrorSuccessMessage = ({
  isError,
  message,
  translate,
}: {
  isError: boolean;
  message: string;
  translate: TFunction;
}) => {
  return <MessageWrapper isError={isError}>{translate(message)}</MessageWrapper>;
};

export default ErrorSuccessMessage;
