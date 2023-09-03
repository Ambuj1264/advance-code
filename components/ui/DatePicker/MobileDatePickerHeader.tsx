import React, { memo, ReactNode } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Weekdays from "./MobileDatePickerWeekdays";

import { whiteColor, separatorColorLight, gutters, zIndex } from "styles/variables";

const DatePickerHeaderContainer = styled.div`
  flex-shrink: 0;
  height: 157px;
`;

const FixedDatePickerWrapper = styled.div`
  position: fixed;
  z-index: ${zIndex.max};
  margin: 0 -${gutters.small}px;
  border-bottom: 1px solid ${separatorColorLight};
  width: 100%;
  padding: 0 ${gutters.small}px;
  background-color: ${whiteColor};
`;

const HeaderContent = styled.div([
  css`
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: ${gutters.small / 2}px;
    background-color: ${whiteColor};
  `,
]);

const MobileDatePickerHeader = ({
  activeLocale,
  children,
  className,
}: {
  activeLocale: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <DatePickerHeaderContainer className={className}>
      <FixedDatePickerWrapper>
        <HeaderContent>
          {children}
          <Weekdays activeLocale={activeLocale} />
        </HeaderContent>
      </FixedDatePickerWrapper>
    </DatePickerHeaderContainer>
  );
};

export default memo(MobileDatePickerHeader);
