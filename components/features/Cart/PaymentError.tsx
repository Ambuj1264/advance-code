import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import WarningIcon from "components/icons/alert-triangle.svg";
import { typographyCaption } from "styles/typography";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { lightRedColor, gutters } from "styles/variables";
import { DefaultMarginTop } from "styles/base";

const ErrorText = styled.div([
  typographyCaption,
  DefaultMarginTop,
  css`
    display: flex;
    color: ${lightRedColor};
  `,
]);

const StyledWarningIcon = styled(WarningIcon)`
  margin-right: ${gutters.small}px;
  width: 16px;
  height: 16px;
  fill: ${lightRedColor};
`;

const PaymentError = ({ paymentError }: { paymentError?: { errorMessage?: string } }) => (
  <ErrorText>
    <StyledWarningIcon />
    {paymentError?.errorMessage ? (
      paymentError.errorMessage
    ) : (
      <Trans ns={Namespaces.cartNs}>
        Unfortunately, your reservation failed. You have not been charged. Please try again.
      </Trans>
    )}
  </ErrorText>
);

export default PaymentError;
