import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalFooterContainer,
} from "components/ui/Modal/Modal";
import { Namespaces } from "shared/namespaces";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";
import { gutters, zIndex } from "styles/variables";

export const StyledModalFooterContainer = styled(ModalFooterContainer)`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: ${zIndex.z1};
  width: 100%;
  height: 56px;
`;

export const RoomEditModalWrapper = styled.div`
  margin: ${gutters.large / 2}px 0 ${gutters.large * 3}px 0;
  min-height: 300px;
`;

export const RoomInfoModalWrapper = styled.div`
  margin: ${gutters.large / 2}px 0 ${gutters.large}px 0;
`;

const StayRoomModal = ({
  modalId,
  modalTitle,
  onToggleModal,
  onSubmit,
  children,
}: {
  modalId: string;
  modalTitle: string;
  onToggleModal: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}) => {
  const theme: Theme = useTheme();
  return (
    <Modal id={modalId} onClose={onToggleModal} variant="info" wide>
      <ModalHeader title={modalTitle} rightButton={<CloseButton onClick={onToggleModal} />} />
      <ModalContentWrapper>{children}</ModalContentWrapper>
      {onSubmit && (
        <StyledModalFooterContainer>
          <Button
            color="action"
            buttonSize={ButtonSize.Small}
            theme={theme}
            type="submit"
            onClick={onSubmit}
          >
            <Trans ns={Namespaces.commonNs}>Select</Trans>
          </Button>
        </StyledModalFooterContainer>
      )}
    </Modal>
  );
};

export default StayRoomModal;
