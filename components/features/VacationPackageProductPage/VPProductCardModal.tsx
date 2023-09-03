import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import VPProductCardModalFooter from "./VPProductCardModalFooter";

import Modal, {
  CloseButton,
  ModalBodyContainer,
  ModalContentWrapper,
  ModalHeader,
} from "components/ui/Modal/Modal";
import { typographySubtitle2 } from "styles/typography";
import { gutters, whiteColor } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const HeaderTitle = styled.div([
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    padding: 0 ${gutters.small}px;
  `,
]);

const TextWrapper = styled.div(singleLineTruncation);

const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  margin-right: ${gutters.small / 2}px;
  align-content: center;
`;

const iconStyles = css`
  margin: auto;
  width: 16px;
  height: 16px;
  fill: ${whiteColor};
`;

const EditForm = styled.form`
  flex-grow: 1;
  overflow-y: auto;
`;

export const VPModalTitle = ({
  modalTitle,
}: {
  modalTitle: { Icon: React.ElementType; title: string };
}) => {
  return (
    <HeaderTitle>
      <IconWrapper>
        <modalTitle.Icon css={iconStyles} />
      </IconWrapper>
      <TextWrapper>{modalTitle.title}</TextWrapper>
    </HeaderTitle>
  );
};

const VPProductCardModal = ({
  modalId = "VPproductCardModal",
  modalContent,
  onToggleModal,
  withModalFooter = true,
  isLoading = false,
  modalTitle,
  isForm = false,
  noMinHeight = true,
  onSubmit,
  error,
}: {
  modalId?: string;
  modalContent: React.ReactNode;
  onToggleModal: () => void;
  withModalFooter?: boolean;
  isLoading?: boolean;
  modalTitle?: { Icon: React.ElementType; title: string };
  isForm?: boolean;
  noMinHeight?: boolean;
  onSubmit?: () => void;
  error?: string;
}) => {
  const { prevModal, renderCloseButton } = useModalHistoryContext();
  const isMobile = useIsMobile();

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent) => {
    event?.preventDefault();
    if (!error) {
      // onSubmit must be called after prevModal render cycle(it uses 2 re-renders)
      prevModal().then(onSubmit);
    }
  };

  return (
    <Modal
      id={`${modalId}Modal`}
      onClose={onToggleModal}
      variant="info"
      wide
      noMinHeight={noMinHeight}
    >
      <ModalHeader
        rightButton={
          renderCloseButton || !isMobile ? <CloseButton onClick={onToggleModal} /> : undefined
        }
        title={modalTitle ? <VPModalTitle modalTitle={modalTitle} /> : undefined}
      />
      {isForm ? (
        <EditForm id="edit-modal-form" onSubmit={handleSubmit}>
          <ModalContentWrapper>
            <ModalBodyContainer>{modalContent}</ModalBodyContainer>
          </ModalContentWrapper>
          <VPProductCardModalFooter
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            error={error}
          />
        </EditForm>
      ) : (
        <>
          <ModalContentWrapper>
            <ModalBodyContainer>{modalContent}</ModalBodyContainer>
          </ModalContentWrapper>
          {withModalFooter && (
            <VPProductCardModalFooter
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              error={error}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default VPProductCardModal;
