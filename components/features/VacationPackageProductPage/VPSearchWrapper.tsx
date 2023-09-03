import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { borderRadius, gutters } from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import SearchWidgetErrorBoundary from "components/ui/SearchWidget/SearchWidgetErrorBoundary";

export const VPSearchContainer = styled.div``;

export const Form = styled.form(
  ({ theme }) => css`
    ${mqMin.large} {
      border-radius: ${borderRadius};
      width: 100%;
      padding: ${gutters.small / 2}px ${gutters.small}px 0;
      background-color: ${theme.colors.primary};
      text-align: left;
    }
    ${mqMax.large} {
      display: block;
      align-self: normal;
      margin: 0;
      width: auto;
      text-align: left;
    }
    ${mqMin.medium} {
      align-self: center;
      margin: 0;
      width: 100%;
    }
  `
);

export const VPSearchWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchWidgetErrorBoundary>
      <Form autoComplete="off" action="?" target="_top">
        {children}
      </Form>
    </SearchWidgetErrorBoundary>
  );
};
