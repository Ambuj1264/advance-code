import React from "react";

import useMobileWidgetBackButton from "hooks/useMobileWidgetBackButton";
import Modal, {
  ModalHeader,
  CloseButton,
  BackButton,
  ModalBodyContainer,
  ModalContentWrapper,
} from "components/ui/Modal/Modal";

const SearchWidgetMobile = ({
  currentStep,
  onModalClose,
  onPreviousClick,
  showBackButton,
  children,
  footer,
}: {
  currentStep: number;
  onModalClose: () => void;
  onPreviousClick: () => void;
  showBackButton: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) => {
  useMobileWidgetBackButton({ currentStep, onModalClose, onPreviousClick });

  return (
    <Modal id="searchWidgetModal" onClose={onModalClose}>
      <ModalHeader
        leftButton={showBackButton ? <BackButton onClick={onPreviousClick} /> : undefined}
        rightButton={<CloseButton onClick={onModalClose} />}
      />
      <ModalContentWrapper>
        <ModalBodyContainer>{children}</ModalBodyContainer>
      </ModalContentWrapper>
      {footer}
    </Modal>
  );
};

export default SearchWidgetMobile;
