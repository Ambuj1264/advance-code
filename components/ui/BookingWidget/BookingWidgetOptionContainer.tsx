import React, { ReactNode } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { mqMin } from "styles/base";
import { gutters } from "styles/variables";

const BookingWidgetSubContainer = styled.div`
  align-items: center;
  margin-top: ${gutters.small}px;
  padding: 0 ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large / 2}px;
    padding: 0 ${gutters.large}px;
  }
`;

const BookingWidgetContainer = styled.div(
  ({ theme }) =>
    css`
      margin: ${gutters.large / 2}px -${gutters.small}px;
      ${mqMin.large} {
        margin: ${gutters.large / 2}px -${gutters.large}px;
      }
      & + & {
        border-top: 8px solid ${rgba(theme.colors.primary, 0.05)};
      }
    `
);

const BookingWidgetOptionContainer = ({ children }: { children: ReactNode }) => (
  <BookingWidgetContainer>
    <BookingWidgetSubContainer>{children}</BookingWidgetSubContainer>
  </BookingWidgetContainer>
);

export default BookingWidgetOptionContainer;
