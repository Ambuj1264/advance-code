import React, { RefObject, useRef, useEffect, useMemo } from "react";

import Modal, {
  ModalHeader,
  CloseButton,
  BackButton,
  ModalBodyContainer,
  ModalContentWrapper,
} from "components/ui/Modal/Modal";
import ProgressBar from "components/ui/BookingWidget/BookingWidgetHeader/ProgressBar";
import useMobileWidgetBackButton from "hooks/useMobileWidgetBackButton";

export type OnCurrentStepChangeType = (
  modalContainer: RefObject<HTMLDivElement>,
  newStep?: number
) => void;

const BookingWidgetMobile = ({
  onModalClose,
  onPreviousClick,
  children,
  progressBarSteps,
  currentStep = 0,
  footer,
  skipReset = false,
  className,
  onCurrentStepChange,
}: {
  onModalClose: () => void;
  onPreviousClick?: () => void;
  children: React.ReactNode;
  progressBarSteps?: string[];
  currentStep?: number;
  footer: React.ReactNode;
  skipReset?: boolean;
  className?: string;
  onCurrentStepChange?: OnCurrentStepChangeType;
}) => {
  useMobileWidgetBackButton({ currentStep, onModalClose, onPreviousClick });

  const PrevStepComponent = useMemo(
    // eslint-disable-next-line react/no-unstable-nested-components
    () => () =>
      onPreviousClick && currentStep > 0 ? <BackButton onClick={onPreviousClick} /> : null,
    [currentStep, onPreviousClick]
  );

  const modalContentWrapperRef = useRef() as RefObject<HTMLDivElement>;

  useEffect(() => {
    onCurrentStepChange?.(modalContentWrapperRef, currentStep);
  }, [currentStep, onCurrentStepChange]);

  return (
    <Modal id="bookingWidgetModal" onClose={onModalClose} className={className}>
      <ModalHeader
        leftButton={<PrevStepComponent />}
        rightButton={<CloseButton onClick={onModalClose} />}
        skipReset={skipReset}
      />
      {progressBarSteps && currentStep !== undefined && (
        <ProgressBar currentStep={currentStep} steps={progressBarSteps} />
      )}
      <ModalContentWrapper ref={modalContentWrapperRef}>
        <ModalBodyContainer>{children}</ModalBodyContainer>
      </ModalContentWrapper>
      {footer}
    </Modal>
  );
};

export default BookingWidgetMobile;
