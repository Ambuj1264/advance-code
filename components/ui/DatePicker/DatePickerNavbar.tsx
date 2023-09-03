import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import BaseArrow from "@travelshift/ui/icons/arrow-right.svg";

import { gutters, greyColor } from "styles/variables";
import { mqIE } from "styles/base";

type DirectionProps = {
  isRight: boolean;
};

const Arrow = styled(BaseArrow, {
  shouldForwardProp: () => false,
})<DirectionProps>(
  ({ isRight }) =>
    css`
      width: 16px;
      transform: rotate(${isRight ? 0 : 180}deg);
      fill: ${greyColor};

      ${mqIE} {
        height: 11.19px;
      }
    `
);

const NavbarWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const NavbarButton = styled.button([
  css`
    border: 1px solid ${rgba(greyColor, 0.5)};
    border-radius: 6px;
    padding: ${gutters.large / 4}px ${gutters.large / 2}px;

    &:disabled {
      border: 1px solid ${rgba(greyColor, 0.3)};
      cursor: default;
      ${Arrow} {
        fill: ${rgba(greyColor, 0.3)};
      }
    }
  `,
]);

type NavbarElementProps = {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
};

const DatePickerNavbar = ({
  onPreviousClick,
  onNextClick,
  isPreviousDisabled = false,
  isNextDisabled = false,
}: NavbarElementProps) => (
  <NavbarWrapper>
    <NavbarButton
      id="previousMonth"
      onClick={() => onPreviousClick && onPreviousClick()}
      type="button"
      disabled={isPreviousDisabled}
    >
      <Arrow isRight={false} />
    </NavbarButton>
    <NavbarButton
      id="nextMonth"
      onClick={() => onNextClick && onNextClick()}
      type="button"
      disabled={isNextDisabled}
    >
      <Arrow isRight />
    </NavbarButton>
  </NavbarWrapper>
);

export default DatePickerNavbar;
