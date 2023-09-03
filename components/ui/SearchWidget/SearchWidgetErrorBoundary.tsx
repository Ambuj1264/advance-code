import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ErrorBoundary from "../ErrorBoundary";
import { RefreshPageLink } from "../BookingWidget/BookingWidgetErrorBoundary";

import { Trans } from "i18n";
import { redColor, gutters, boxShadowTop, whiteColor } from "styles/variables";
import { typographySubtitle1 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";

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

const Wrapper = styled.div`
  padding: ${gutters.small}px;
  background-color: ${rgba(redColor, 0.1)};
`;

const Container = styled.div([
  css`
    position: absolute;
    top: 100px;
    z-index: 1;
    box-shadow: ${boxShadowTop};
    width: 100%;
    background-color: ${whiteColor};
    ${mqMin.large} {
      position: unset;
      top: unset;
      margin-top: ${gutters.small}px;
    }
  `,
]);

const ErrorComponent = () => (
  <Container>
    <Wrapper>
      <ErrorTitle>
        <Trans>Whoops!</Trans>
      </ErrorTitle>
      <ErrorText>
        <Trans ns={Namespaces.commonSearchNs}>
          We are terribly sorry. It seems our search widget is not working at the moment.
        </Trans>
        <RefreshPageLink />
      </ErrorText>
    </Wrapper>
  </Container>
);

const SearchWidgetErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary ErrorComponent={ErrorComponent}>{children}</ErrorBoundary>
);

export default SearchWidgetErrorBoundary;
