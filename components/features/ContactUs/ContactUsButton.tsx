import React, { ElementType, SyntheticEvent } from "react";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";

import { Direction } from "types/enums";
import EmailIcon from "components/icons/email.svg";
import { gutters, whiteColor, zIndex, boxShadow } from "styles/variables";
import { hideDuringPrint, directionMixin, mqMin, mqMax } from "styles/base";
import { typographySubtitle1 } from "styles/typography";

const iconStyles = css`
  position: absolute;
  top: 11px;
  right: 11px;
  width: 24px;
  height: 24px;
  fill: ${whiteColor};
`;

export const Button = styled("button", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "color",
})<{ color: string }>(({ color }) => [
  typographySubtitle1,
  hideDuringPrint,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${boxShadow};
    border: 2px solid ${whiteColor};
    border-radius: 50%;
    width: 50px;
    max-width: 50px;
    height: 50px;
    background: ${color};
    color: ${whiteColor};
  `,
]);

const Wrapper = styled.div<{
  position: Direction;
  mobileMargin: number;
  zIndexValue?: number;
}>(({ position, mobileMargin, zIndexValue }) => [
  directionMixin({
    leftStyles: css`
      left: 24px;
      ${mqMax.large} {
        left: 16px;
      }
    `,
    rightStyles: css`
      right: 24px;
      ${mqMax.large} {
        right: 16px;
      }
    `,
    direction: position,
  }),
  css`
    position: fixed;
    bottom: ${mobileMargin}px;
    z-index: ${zIndexValue ?? zIndex.z3};
    ${mqMin.large} {
      bottom: ${gutters.large}px;
    }
  `,
]);

export enum ContactUsMobileMargin {
  WithoutFooter = 14,
  RegularFooter = 78,
  WideFooter = 98,
}

const ContactUsButton = ({
  onClick,
  label,
  position = Direction.Left,
  mobileMargin = ContactUsMobileMargin.WithoutFooter,
  Icon = EmailIcon,
  className,
  onHoverClick,
  zIndexValue,
}: {
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void;
  label: string;
  position?: Direction;
  mobileMargin?: number;
  Icon?: ElementType;
  className?: string;
  onHoverClick?: () => void;
  zIndexValue?: number;
}) => {
  const theme: Theme = useTheme();
  return (
    <Wrapper
      id="contactUsButtonWrapper"
      onMouseEnter={onHoverClick}
      onTouchStart={onHoverClick}
      position={position}
      className={className}
      mobileMargin={mobileMargin}
      zIndexValue={zIndexValue}
    >
      <Button
        onClick={onClick}
        color={theme.colors.primary}
        aria-label={label}
        data-testid={label}
        title={label}
      >
        <Icon css={iconStyles} />
      </Button>
    </Wrapper>
  );
};

export default ContactUsButton;
