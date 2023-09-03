import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import SearchWidgetErrorBoundary from "./SearchWidgetErrorBoundary";

import { borderRadius, gutters, guttersPx } from "styles/variables";
import { mqMin } from "styles/base";

export const Form = styled.form(
  ({ theme }) => css`
    border-radius: ${borderRadius};
    width: 100%;
    padding: ${gutters.small / 2}px ${gutters.small}px ${gutters.small}px;
    background-color: ${theme.colors.primary};
    text-align: left;

    & + div {
      margin-top: ${guttersPx.large};
    }
  `
);

export const SearchWidgetDesktop = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <SearchWidgetErrorBoundary>
    <Form className={className} autoComplete="off" action="?" target="_top">
      {children}
    </Form>
  </SearchWidgetErrorBoundary>
);

const FormMobile = styled(SearchWidgetDesktop)(
  ({ theme }) => css`
    display: block;
    align-self: normal;
    margin: ${gutters.small}px ${gutters.small}px 0 ${gutters.small}px;
    width: auto;
    max-width: 548px;
    background-color: ${rgba(theme.colors.primary, 0.8)};
    text-align: left;

    ${mqMin.medium} {
      align-self: center;
      margin: ${gutters.small}px auto 0 auto;
      width: 100%;
    }

    ${mqMin.large} {
      display: none;
    }
  `
);

export const SearchWidgetMobile = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchWidgetErrorBoundary>
      <FormMobile>{children}</FormMobile>
    </SearchWidgetErrorBoundary>
  );
};
