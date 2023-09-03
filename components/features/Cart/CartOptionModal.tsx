import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Modal, {
  CloseButton,
  ModalContentWrapper,
  ModalHeader,
  TitleWrapper,
} from "components/ui/Modal/Modal";
import { gutters, whiteColor } from "styles/variables";

const iconStyles = css`
  margin-left: ${gutters.small}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const StyledModalHeader = styled(ModalHeader)(
  css`
    ${TitleWrapper} {
      padding-left: 20px;
    }
  `
);

const CartOptionModal = ({
  id,
  onClose,
  title,
  Icon,
  children,
  className,
}: {
  id: string;
  onClose: () => void;
  title: string;
  Icon?: React.ElementType<any>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Modal id={id} onClose={onClose} className={className} wide>
      <StyledModalHeader
        leftButton={Icon ? <Icon css={iconStyles} /> : undefined}
        title={title}
        rightButton={<CloseButton onClick={onClose} />}
      />
      <ModalContentWrapper>{children}</ModalContentWrapper>
    </Modal>
  );
};
export default CartOptionModal;
