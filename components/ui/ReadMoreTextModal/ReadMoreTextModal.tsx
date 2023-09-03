import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Modal, {
  ModalHeader,
  CloseButton,
  ModalContentWrapper,
  ModalHeading,
} from "components/ui/Modal/Modal";
import { blackColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const TextWrapper = styled.div([
  typographyBody2,
  css`
    margin-bottom: ${gutters.small}px;
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const ReadMoreTextModal = ({
  id,
  text,
  title,
  toggleModal,
}: {
  id: string;
  text: string;
  title: string;
  toggleModal: () => void;
}) => {
  return (
    <Modal id={id} onClose={toggleModal} noMinHeight>
      <ModalHeader rightButton={<CloseButton onClick={toggleModal} />} />
      <ModalHeading>{title}</ModalHeading>
      <ModalContentWrapper>
        <TextWrapper>{text}</TextWrapper>
      </ModalContentWrapper>
    </Modal>
  );
};

export default ReadMoreTextModal;
