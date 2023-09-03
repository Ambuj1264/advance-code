import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ErrorBoundary from "components/ui/ErrorBoundary";
import { Trans } from "i18n";
import { redColor, gutters, fontWeightSemibold } from "styles/variables";
import { typographySubtitle1 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { DefaultMarginTop } from "styles/base";

const Wrapper = styled.div([
  DefaultMarginTop,
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${gutters.small}px;
    background-color: ${rgba(redColor, 0.1)};
    text-align: center;
  `,
]);

const ErrorTitle = styled.div([
  typographySubtitle1,
  css`
    color: ${rgba(redColor, 0.8)};
  `,
]);

const ErrorText = styled.div`
  margin-top: ${gutters.small / 2}px;
  color: ${rgba(redColor, 0.8)};
`;

const ErrorLink = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
    &:hover {
      text-decoration: underline;
    }
  `
);

export const OrderErrorComponent = () => (
  <Wrapper>
    <ErrorTitle>
      <Trans ns={Namespaces.cartNs}>There was an unexpected issue</Trans>
    </ErrorTitle>
    <ErrorText>
      <Trans ns={Namespaces.cartNs}>
        We are terribly sorry. It seems an unexpected issue occured, please try reloading the page
        by clicking here
      </Trans>
      : <ErrorLink href={window.location.href}>Reload</ErrorLink>.
      <br />
      <Trans ns={Namespaces.cartNs}>
        If the issue persists please contact us through one of our channels.
      </Trans>
    </ErrorText>
  </Wrapper>
);

const OrderErrorBoundary = ({
  componentName = "paymentForm",
  children,
}: {
  componentName?: string;
  children: React.ReactNode;
}) => (
  <ErrorBoundary componentName={componentName} ErrorComponent={OrderErrorComponent}>
    {children}
  </ErrorBoundary>
);

export default OrderErrorBoundary;
