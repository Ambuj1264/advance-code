import { useContext, useMemo } from "react";

import {
  VPActiveModalTypes,
  VPModalStateContext,
  VPModalCallbackContext,
} from "./VPModalStateContext";

export const useOnToggleModal = (
  modalType: VPActiveModalTypes,
  modalId?: string | number
): [boolean, (e?: React.SyntheticEvent) => void] => {
  const { activeModalType, activeModalId } = useContext(VPModalStateContext);
  const { onToggleModal } = useContext(VPModalCallbackContext);
  const toggleValue =
    activeModalType === VPActiveModalTypes.None ? modalType : VPActiveModalTypes.None;
  const isModalActive = activeModalType === modalType && activeModalId === modalId;

  return useMemo(
    () => [
      isModalActive,
      function toggleEditModal() {
        onToggleModal(toggleValue, modalId);
      },
    ],
    [isModalActive, modalId, onToggleModal, toggleValue]
  );
};
