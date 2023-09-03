import React, { useRef, ReactType, Ref, forwardRef, MutableRefObject } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import useOnOutsideClick from "@travelshift/ui/components/Popover/useOnOutsideClick";
import Close from "@travelshift/ui/icons/close.svg";

import { boxShadowTopLight, gutters, whiteColor, borderRadius } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";

export const PopoverWrapper = styled.div`
  @keyframes fadeInPopover {
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  position: absolute;
  right: -${gutters.large / 2}px;
  margin-top: ${gutters.large}px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInPopover 0.2s ease-out forwards;
`;

const PopoverInner = styled.div`
  box-shadow: ${boxShadowTopLight};
  border-radius: ${borderRadius};
  background-color: ${whiteColor};
  pointer-events: all;
  overflow: hidden;
`;

const PopoverHeader = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 ${gutters.small}px;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
  `,
]);

const PopoverContentWrapper = styled.div`
  padding: ${gutters.small}px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const iconStyles = css`
  margin-right: ${gutters.large / 2}px;
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const CloseIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: ${whiteColor};
  cursor: pointer;
`;

const CloseIcon = styled(Close)(
  ({ theme }) => css`
    width: 8px;
    height: 8px;
    fill: ${theme.colors.primary};
  `
);

const PopoverContent = (
  {
    title,
    onDismiss,
    children,
    subtitle,
    Icon,
  }: {
    title: string;
    subtitle?: string | React.ReactElement;
    children: React.ReactNode;
    Icon?: ReactType;
    onDismiss: () => void;
  },
  ref: Ref<Element | null>
) => {
  const outsideRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(outsideRef, onDismiss, ref as MutableRefObject<Element>);

  return (
    <div ref={outsideRef}>
      <PopoverWrapper>
        <PopoverInner data-testid="popoverInner">
          <PopoverHeader>
            <TitleWrapper>
              {Icon && <Icon css={iconStyles} />}
              {title}
            </TitleWrapper>
            {subtitle && subtitle}
            {!subtitle && (
              <CloseIconWrapper onClick={onDismiss} data-testid="popoverCloseBtn">
                <CloseIcon />
              </CloseIconWrapper>
            )}
          </PopoverHeader>
          <PopoverContentWrapper>{children}</PopoverContentWrapper>
        </PopoverInner>
      </PopoverWrapper>
    </div>
  );
};

export default forwardRef(PopoverContent);
