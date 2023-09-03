import React, { ElementType, ReactElement, ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Arrow from "@travelshift/ui/icons/arrow.svg";
import Close from "@travelshift/ui/icons/close.svg";

import GridContainer from "../Grid/Container";

import { useGlobalContext } from "contexts/GlobalContext";
import {
  gutters,
  boxShadowTop,
  whiteColor,
  borderRadius,
  modalHeaderHeight,
  zIndex,
} from "styles/variables";
import { clampLines, container, mqMin } from "styles/base";
import { typographyH4, typographySubtitle1 } from "styles/typography";
import BaseModal from "components/ui/Modal/BaseModal";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";

type ModalVariant = "info" | undefined;

const backButtonStyles = css`
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
  fill: ${whiteColor};
`;

const CloseIcon = styled(Close)`
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

export const Button = styled("button", {
  shouldForwardProp: () => true,
})(
  css`
    position: relative;
    display: flex;
    padding: 10px;
    &:only-of-type {
      margin-left: auto;
    }
  `
);

export const NavigationContainer = styled.div(({ theme }) => [
  container,
  typographySubtitle1,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
  `,
]);

const HeaderContainer = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: ${modalHeaderHeight};
`;

export const Container = styled.div<{
  noMinHeight?: boolean;
  variant?: ModalVariant;
  wide: boolean;
}>(({ noMinHeight, variant, wide }) => [
  css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: ${whiteColor};
    overflow: hidden;

    ${mqMin.large} {
      width: ${wide ? "920px" : "630px"};
      height: ${noMinHeight ? "unset" : "85vh"};
      max-height: 85vh;
    }
    ${`${mqMin.large} and (max-aspect-ratio: 3/2)`} {
      max-height: 75vh;
    }
  `,
  variant === "info" &&
    css`
      ${mqMin.large} {
        border-radius: ${borderRadius};
      }

      ${HeaderContainer} {
        height: 32px;
      }

      ${NavigationContainer} {
        padding-right: ${gutters.small}px;
        padding-left: ${gutters.small}px;
      }
    `,
]);

export const TitleWrapper = styled.div([
  clampLines(1),
  css`
    max-width: 87%;
    padding: ${gutters.small / 4}px ${gutters.small / 2}px;
    padding-right: ${gutters.small}px;
    text-align: center;
  `,
]);

const Modal = ({
  id,
  onClose,
  children,
  beforeElementId,
  noMinHeight,
  variant,
  wide = false,
  className,
  disableCloseOnOutsideClick,
  topMost,
  customZIndex,
}: {
  id: string;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  beforeElementId?: string;
  noMinHeight?: boolean;
  variant?: ModalVariant;
  wide?: boolean;
  className?: string;
  disableCloseOnOutsideClick?: boolean;
  topMost?: boolean;
  customZIndex?: number;
}) => (
  <BaseModal
    id={id}
    onClose={onClose}
    className={className}
    beforeElementId={beforeElementId}
    disableCloseOnOutsideClick={disableCloseOnOutsideClick}
    topMost={topMost}
    customZIndex={customZIndex}
  >
    <Container noMinHeight={noMinHeight} variant={variant} wide={wide}>
      {children}
    </Container>
  </BaseModal>
);

export const CloseButton = ({
  onClick,
  on,
  className,
}: {
  onClick?: () => void;
  on?: string;
  className?: string;
}) => (
  <Button data-testid="modal-close-button" onClick={onClick} on={on} className={className}>
    <CloseIcon />
  </Button>
);

export const BackButton = ({ onClick, Icon }: { onClick?: () => void; Icon?: ElementType }) => {
  const icon = (Icon && <Icon css={backButtonStyles} />) || <Arrow css={backButtonStyles} />;
  return (
    <Button data-testid="modal-back-button" onClick={onClick}>
      {icon}
    </Button>
  );
};

export const LeftButtonWrapper = styled.div`
  position: absolute;
  left: ${gutters.small / 4}px;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const RightButtonWrapper = styled.div`
  position: absolute;
  right: ${gutters.small / 2}px;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const ModalHeader = ({
  title,
  leftButton,
  rightButton = <div />,
  skipReset = false,
  mobileBackButtonIcon,
  className,
}: {
  title?: string | ReactElement;
  leftButton?: ReactElement;
  rightButton?: ReactElement;
  skipReset?: boolean;
  mobileBackButtonIcon?: ElementType<SVGElement>;
  className?: string;
}) => {
  const { hasPrevious, prevModal, resetState } = useModalHistoryContext();

  let leftBtn = leftButton;

  if (!leftBtn && hasPrevious) {
    leftBtn = <BackButton onClick={prevModal} Icon={mobileBackButtonIcon} />;
  } else {
    leftBtn = leftBtn ?? <div />;
  }

  return (
    <HeaderContainer className={className}>
      <NavigationContainer>
        <LeftButtonWrapper>{leftBtn}</LeftButtonWrapper>
        <TitleWrapper
          title={typeof title === "string" ? title : undefined}
          data-testid="cart-product-info-title"
        >
          {title}
        </TitleWrapper>
        <RightButtonWrapper onClick={!skipReset ? resetState : undefined}>
          {rightButton}
        </RightButtonWrapper>
      </NavigationContainer>
    </HeaderContainer>
  );
};

export const ModalBodyContainer = styled.div`
  padding-bottom: ${gutters.small * 6}px;
`;

export const ModalContentWrapper = styled(GridContainer)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const ModalFooterDiv = styled.div(
  container,
  css`
    z-index: ${zIndex.z10};
    display: flex;
    flex-grow: 0;
    align-items: center;
    box-shadow: ${boxShadowTop};
    width: 100%;
    height: 65px;
    padding-top: ${gutters.small / 2}px;
    padding-bottom: ${gutters.small / 2}px;
    background-color: ${whiteColor};
  `
);

export const ModalFooterContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { isMobileKeyboardOpen } = useGlobalContext();
  return isMobileKeyboardOpen ? null : (
    <ModalFooterDiv className={className}>{children}</ModalFooterDiv>
  );
};

export const ModalHeading = styled.h3(({ theme }) => [
  typographyH4,
  css`
    padding: ${gutters.small}px 0;
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

export default Modal;
