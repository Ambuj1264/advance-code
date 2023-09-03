import React, { useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import ArrowRight from "@travelshift/ui/icons/arrow-right.svg";
import { useTheme } from "emotion-theming";

import ResendVoucherModal from "../Voucher/ResendVoucherModal";

import { PB_CARD_TYPE } from "./types/postBookingEnums";
import { PostBookingTypes } from "./types/postBookingTypes";

import useToggle from "hooks/useToggle";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { mqMax, mqMin } from "styles/base";
import EmailIcon from "components/icons/email.svg";
import CloseIcon from "components/icons/remove-circle.svg";
import DownloadIcon from "components/icons/download-thick.svg";
import Modal, {
  Button,
  Container,
  LeftButtonWrapper,
  ModalHeader,
  NavigationContainer,
  RightButtonWrapper,
  TitleWrapper,
} from "components/ui/Modal/Modal";
import { gutters, whiteColor } from "styles/variables";
import {
  getVoucherDefaultValues,
  getVoucherModalIcon,
} from "components/features/PostBooking/utils/postBookingUtils";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { PBErrorStyled } from "components/features/PostBooking/PBItineraryVoucherModalContent";

const headerIconStyles = css`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const commonButtonStyles = ({ theme, isDisabled }: { theme: Theme; isDisabled?: boolean }) => css`
  justify-content: center;
  width: 56px;
  background-color: ${isDisabled ? rgba(theme.colors.primary, 1) : rgba(theme.colors.primary, 0.8)};
  pointer-events: ${isDisabled ? "none" : "auto"};
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: ${whiteColor};
  }
  &:hover {
    background-color: ${isDisabled
      ? rgba(theme.colors.primary, 1)
      : rgba(theme.colors.primary, 0.7)};
  }
`;

const DownloadLink = styled.a(
  ({ theme, isDisabled = false }: { theme: Theme; isDisabled?: boolean }) => [
    commonButtonStyles({ theme, isDisabled }),
    css`
      display: flex;
      align-items: center;
      height: 100%;
    `,
  ]
);

const StyledButton = styled(Button)<{ isDisabled?: boolean }>(commonButtonStyles);

const ResendVoucherModalStyled = styled(ResendVoucherModal)`
  ${RightButtonWrapper} {
    display: none;
  }
`;

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>
    <CloseIcon css={headerIconStyles} />
  </StyledButton>
);

const DownloadButton = ({ voucherPdfUrl, theme }: { voucherPdfUrl: string; theme: Theme }) => (
  <DownloadLink href={voucherPdfUrl} rel="noreferrer" download target="_blank" theme={theme}>
    <DownloadIcon css={headerIconStyles} />
  </DownloadLink>
);

const MailButton = ({
  onClick,
  voucherDefaultEmail,
}: {
  onClick: () => void;
  voucherDefaultEmail?: string;
}) => (
  <StyledButton onClick={onClick} isDisabled={!voucherDefaultEmail}>
    <EmailIcon css={headerIconStyles} />
  </StyledButton>
);

const RightButtonsGroup = ({
  voucherPdfUrl,
  voucherDefaultEmail,
  onModalClose,
  isMobile,
  voucherId = "",
}: {
  voucherPdfUrl: string;
  voucherDefaultEmail: string;
  onModalClose: () => void;
  isMobile: boolean;
  voucherId?: string;
}) => {
  const [showEmailModal, toggleShowEmailModal] = useToggle();
  const theme: Theme = useTheme();
  const handleMailLink = useCallback(() => {
    toggleShowEmailModal(true);
  }, [toggleShowEmailModal]);

  if (isMobile) {
    return null;
  }

  return (
    <>
      {voucherPdfUrl?.length ? (
        <DownloadButton voucherPdfUrl={voucherPdfUrl} theme={theme} />
      ) : null}
      <MailButton onClick={handleMailLink} voucherDefaultEmail={voucherDefaultEmail} />
      <CloseButton onClick={onModalClose} />
      {showEmailModal && (
        <ResendVoucherModalStyled
          toggleModal={toggleShowEmailModal}
          voucherId={voucherId}
          defaultEmail={voucherDefaultEmail}
        />
      )}
    </>
  );
};

const StyledModal = styled(Modal)`
  ${NavigationContainer} {
    padding-right: 0;
  }
  ${RightButtonWrapper} {
    right: 0;
    background: ${whiteColor};
  }
  ${TitleWrapper} {
    padding-left: 0;
    ${mqMin.large} {
      padding-left: ${gutters.small * 2}px;
    }
  }
  ${NavigationContainer} {
    justify-content: flex-start;
    ${mqMax.large} {
      justify-content: center;
    }
  }
  ${LeftButtonWrapper} {
    padding-left: ${gutters.small}px;
  }
  ${Container} {
    justify-content: flex-start;
  }
`;

const PBItineraryVoucherModal = ({
  modalId = "PBItineraryModal",
  modalContent,
  onClose,
  modalTitle,
  productType,
  data,
}: {
  modalId: string;
  modalContent?: React.ReactNode;
  onClose: () => void;
  modalTitle?: string;
  productType: PB_CARD_TYPE;
  data: PostBookingTypes.UnionPBInfoModalDataType;
}) => {
  const isMobile = useIsMobile();
  const Icon = getVoucherModalIcon(productType);
  const leftButton = !isMobile ? <Icon css={headerIconStyles} /> : undefined;
  const { pdfUrl, email, voucherId } = getVoucherDefaultValues({
    data,
    productType,
  });

  return (
    <StyledModal id={`${modalId}-Modal`} onClose={onClose} wide>
      <ModalHeader
        skipReset
        rightButton={
          <RightButtonsGroup
            onModalClose={onClose}
            isMobile={isMobile}
            voucherPdfUrl={pdfUrl}
            voucherDefaultEmail={email}
            voucherId={voucherId}
          />
        }
        title={modalTitle}
        leftButton={leftButton}
        mobileBackButtonIcon={ArrowRight}
      />
      <ErrorBoundary ErrorComponent={PBErrorStyled}>{modalContent}</ErrorBoundary>
    </StyledModal>
  );
};

export default PBItineraryVoucherModal;
