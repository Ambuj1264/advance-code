import { useCallback, useState } from "react";

import { paymentStateVariables, StateFields } from "../types/savedCardsTypes";
import { getInitialStateValues } from "../utils/SavedCardsUtils";

const useCardsStateVariables = (savedCards: CartTypes.QuerySaltPaySavedCard[]) => {
  const [stateData, setStateData] = useState<paymentStateVariables>(
    getInitialStateValues(savedCards)
  );
  const handleStateDataChange = useCallback(
    (
      fieldName: StateFields,
      updatedInfo: React.ChangeEvent<HTMLInputElement> | string | boolean | undefined
    ) => {
      setStateData({ ...stateData, [fieldName]: updatedInfo });
    },
    [stateData]
  );

  const handleMultiStateDataChange = useCallback(
    (
      valueArray: {
        field: StateFields;
        value: React.ChangeEvent<HTMLInputElement> | string | boolean;
      }[]
    ) => {
      const [first, second] = valueArray;

      setStateData({
        ...stateData,
        [first.field]: first.value,
        [second.field]: second.value,
      });
    },
    [stateData]
  );

  const toggleModal = useCallback(() => {
    const { showModal } = stateData;
    setStateData({ ...stateData, [StateFields.showModal]: !showModal });
  }, [stateData]);

  return {
    stateData,
    handleStateDataChange,
    handleMultiStateDataChange,
    toggleModal,
  };
};

export default useCardsStateVariables;
