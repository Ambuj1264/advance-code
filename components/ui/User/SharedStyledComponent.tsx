import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { memo } from "react";
import rgba from "polished/lib/color/rgba";

import { Column } from "../FlightsShared/flightShared";
import Input from "../Inputs/Input";
import Section from "../Section/Section";
import DateSelect, { StyledDropDown } from "../Inputs/DateSelect";
import Row from "../Grid/Row";

import { column, mqMax, mqMin } from "styles/base";
import { greyColor, gutters, whiteColor } from "styles/variables";
import { ColumnItemWrapper, StyledColumn } from "components/features/Flight/PassengerDetailsForm";

export const StyledDateSelection = styled(DateSelect)(() => [
  css`
    ${StyledDropDown} {
      #monthDropdown > div:first-of-type,
      #dayDropdown > div:first-of-type,
      #yearDropdown > div:first-of-type {
        background-color: ${whiteColor};
      }
    }
  `,
]);

export const FullWidthColumn = memo(
  styled(Column)([
    column({ small: 1, large: 1 }),
    css`
      position: relative;
      margin-bottom: ${gutters.small / 2}px;
      padding: 0;
      ${mqMin.large} {
        padding: 0;
      }
    `,
  ])
);

export const StyledUserInput = memo(
  styled(Input)<{
    isEditing?: boolean;
  }>(
    ({ theme, isEditing }) => css`
      border: ${isEditing
        ? `1px solid ${theme.colors.primary}`
        : `1px solid ${rgba(greyColor, 0.5)}`};
      input:disabled {
        background-color: ${whiteColor};
      }
    `
  )
);

export const ScrollStopEl = styled.div`
  margin: 0;
  margin-top: ${gutters.small}px;
  height: 56px;
`;

export const StyledSection = styled(Section)`
  margin-top: ${gutters.small * 2}px;
  ${mqMin.large} {
    margin-top: ${gutters.small * 2}px;
  }
`;
export const StyledColumnItemWrapper = styled(ColumnItemWrapper)`
  &:first-of-type {
    padding-right: ${gutters.small / 2}px;
  }
  &:last-of-type {
    padding-left: ${gutters.small / 2}px;
  }
  ${mqMin.large} {
    &:first-of-type {
      padding-right: ${gutters.large / 2}px;
    }
    &:last-of-type {
      padding-left: ${gutters.large / 2}px;
    }
  }
`;

export const StyledLeftColumn = styled(StyledColumn)`
  padding: 0;
  ${mqMin.large} {
    padding-left: 0;
  }
`;

export const StyledRightColumn = styled(StyledColumn)`
  padding: 0;
  ${mqMin.large} {
    padding-right: 0;
  }
`;

export const StyledBusinessInputRow = styled(Row)<{ isOpen: boolean }>(
  ({ isOpen }) => css`
    position: relative;
    margin-top: ${isOpen ? `${gutters.large}px` : `${gutters.small}px`};
    height: auto;
    ${mqMax.large} {
      margin-top: ${gutters.small}px;
    }
  `
);
