import { useCallback, useState } from "react";

import { PB_ACTIVE_MODAL } from "../../types/postBookingEnums";

export const useTogglePBModal = () => {
  const [modalType, setModalType] = useState<PB_ACTIVE_MODAL>(PB_ACTIVE_MODAL.NONE);

  const openInfoModal = useCallback(() => {
    setModalType(PB_ACTIVE_MODAL.INFO);
  }, []);
  const openBookingModal = useCallback(() => {
    setModalType(PB_ACTIVE_MODAL.BOOKING);
  }, []);

  const closeModals = useCallback(() => {
    setModalType(PB_ACTIVE_MODAL.NONE);
  }, []);

  return {
    modalType,
    openBookingModal,
    openInfoModal,
    closeModals,
  };
};
