import React from "react";

import Items from "./Items";

import Modal, {
  ModalHeader,
  CloseButton,
  ModalHeading,
  ModalContentWrapper,
} from "components/ui/Modal/Modal";

const ItemsModal = ({
  onClose,
  title,
  items,
}: {
  onClose: () => void;
  title: string;
  items: SharedTypes.Icon[];
}) => {
  return (
    <Modal id="ItemsModal" onClose={onClose} noMinHeight variant="info">
      <ModalHeader rightButton={<CloseButton onClick={onClose} />} />
      <ModalContentWrapper>
        <div>
          <ModalHeading>{title}</ModalHeading>
          <Items items={items} />
        </div>
      </ModalContentWrapper>
    </Modal>
  );
};

export default ItemsModal;
