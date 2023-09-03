import React from "react";
import styled from "@emotion/styled";
import { format } from "date-fns";

import {
  borderRadius,
  fontSizeBody2,
  fontSizeCaption,
  fontSizeCaptionSmall,
  fontWeightBold,
  fontWeightRegular,
  whiteColor,
} from "styles/variables";
import { mqMin } from "styles/base";

export const StyledDay = styled.div();
export const StyledMonth = styled.div();

export const StyledDateIcon = styled.div(
  ({ theme }) => `
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
    width: 24px;
    height: 24px;
    border-radius: ${borderRadius};
    text-align: center;
    overflow: hidden;
  
    ${StyledMonth} {
      color: ${whiteColor};
      font-weight: ${fontWeightRegular};
      font-size: 8px;
      text-transform: capitalize;
      line-height: 12px;
    }
  
    ${StyledDay} {
      color: ${whiteColor};
      font-weight: ${fontWeightBold};
      font-size: ${fontSizeCaption};
      text-transform: uppercase;
      position: relative;
      line-height: 1;
      top: -2px;
    }
  
    ${mqMin.large} {
      width: 34px;
      height: 34px;
  
      ${StyledMonth} {
        font-size: ${fontSizeCaptionSmall};
        line-height: 16px;
      }
    
      ${StyledDay} {
        font-size: ${fontSizeBody2};
      }
    }
  `
);

export const DateIcon = ({ date, className }: { date: Date | number; className?: string }) => {
  const month = format(date, "MMM");
  const day = format(date, "dd");

  return (
    <StyledDateIcon className={className}>
      <StyledMonth>{month}</StyledMonth>
      <StyledDay>{day}</StyledDay>
    </StyledDateIcon>
  );
};
