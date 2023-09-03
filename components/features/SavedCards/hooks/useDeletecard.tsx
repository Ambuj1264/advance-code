import { useMutation } from "@apollo/react-hooks";
import { useCallback } from "react";

import DeleteCardMutation from "../queries/RemoveCardMutation.graphql";
import { DeleteSavedCardsResponse } from "../types/savedCardsTypes";
import { creditCardObject } from "../utils/SavedCardsUtils";

import { noCacheHeaders } from "utils/apiUtils";

const useDeleteCard = (
  setsavedCards: React.Dispatch<React.SetStateAction<CartTypes.QuerySaltPaySavedCard[]>>,
  setActivePaymentMethod: React.Dispatch<React.SetStateAction<CartTypes.PaymentMethod>>
) => {
  const [deleteCardMutation, { data, loading, error }] = useMutation<DeleteSavedCardsResponse>(
    DeleteCardMutation,
    {
      context: {
        headers: noCacheHeaders,
      },
      onCompleted: response => {
        const savedCards = response?.deleteUserCard.savedCards;
        setsavedCards(savedCards ?? []);
        if (savedCards.length > 0) {
          setActivePaymentMethod(creditCardObject as CartTypes.PaymentMethod);
        }
      },
    }
  );

  const deleteCard = useCallback(
    (input: { id: number }) => {
      deleteCardMutation({
        variables: {
          input,
        },
      });
    },
    [deleteCardMutation]
  );

  return {
    deleteCard,
    deletingCardLoading: loading,
    deletingCardError: error,
    deletingCardResponse: data,
  };
};

export default useDeleteCard;
