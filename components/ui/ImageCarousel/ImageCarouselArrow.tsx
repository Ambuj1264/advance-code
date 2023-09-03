import React, { SyntheticEvent, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import { blackColor, whiteColor, borderRadiusSmall, gutters } from "styles/variables";

export enum Direction {
  Left,
  Right,
}

type Props = {
  id: string;
  direction: Direction;
  inModal?: boolean;
  onClick?: any;
};

type ButtonProps = {
  arrowDirection: Direction;
  inModal: boolean;
};

const Arrow = styled(ArrowIcon, {
  shouldForwardProp: () => false,
})<{ inModal: boolean }>(
  ({ inModal }) =>
    css`
      height: ${inModal ? "20px" : "16px"};
      fill: ${whiteColor};
    `
);

const getBorderRadius = (direction: Direction) =>
  direction === Direction.Left
    ? css`
        border-top-right-radius: ${borderRadiusSmall};
        border-bottom-right-radius: ${borderRadiusSmall};
      `
    : css`
        border-top-left-radius: ${borderRadiusSmall};
        border-bottom-left-radius: ${borderRadiusSmall};
      `;

const getButtonSidePosition = (inModal: boolean): string => {
  return `${inModal ? -gutters.large : 0}px`;
};

const Button = styled.button<ButtonProps>(({ arrowDirection, inModal }) => [
  getBorderRadius(arrowDirection),
  css`
    position: ${inModal ? "fixed" : "absolute"};
    top: calc(50% - 20px);
    right: ${arrowDirection === Direction.Right ? getButtonSidePosition(inModal) : "auto"};
    left: ${arrowDirection === Direction.Left ? getButtonSidePosition(inModal) : "auto"};
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${inModal ? "45px" : "40px"};
    height: ${inModal ? "45px" : "40px"};
    background-color: ${rgba(blackColor, inModal ? 0.1 : 0.2)};
    transition: background-color 0.15s ease-in-out;
    &:hover {
      background-color: ${rgba(blackColor, inModal ? 0.3 : 0.4)};
    }
    ${Arrow} {
      transform: ${arrowDirection === Direction.Left ? "rotate(180deg)" : "none"};
    }
  `,
]);

const ImageCarouselArrow = ({ id, direction, onClick, inModal = false }: Props) => {
  const handleClick = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.();
    },
    [onClick]
  );
  return (
    <Button id={id} onClick={handleClick} arrowDirection={direction} inModal={inModal}>
      <Arrow inModal={inModal} />
    </Button>
  );
};

export default ImageCarouselArrow;
