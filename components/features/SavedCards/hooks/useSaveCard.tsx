import { useMutation } from "@apollo/react-hooks";
import { useCallback } from "react";
import { FormInput } from "@travelshift/ui/hooks/useForm";

import SaveCardMutation from "../queries/AddSavedCardMutation.graphql";
import SetPrimaryMutation from "../queries/SetPrimaryMethodMutation.graphql";
import { AddSavedCardsResponse, StateFields } from "../types/savedCardsTypes";
import { creditCardObject, genericErrorMessage } from "../utils/SavedCardsUtils";

import { noCacheHeaders } from "utils/apiUtils";
import lazyCaptureException from "lib/lazyCaptureException";
import { isProd } from "utils/globalUtils";

const useSaveCard = (
  setSavedCards: React.Dispatch<React.SetStateAction<CartTypes.QuerySaltPaySavedCard[]>>,
  setValues: React.Dispatch<
    React.SetStateAction<{
      [name: string]: FormInput;
    }>
  >,
  setActivePaymentMethod: React.Dispatch<React.SetStateAction<CartTypes.PaymentMethod>>,
  setStateVariables: (
    fieldName: StateFields,
    updatedInfo: React.ChangeEvent<HTMLInputElement> | string | boolean
  ) => void,
  initialValues: any
) => {
  const [saveCardMutation, { data, loading, error }] = useMutation<AddSavedCardsResponse>(
    SaveCardMutation,
    {
      context: {
        headers: noCacheHeaders,
      },
      onCompleted: response => {
        setStateVariables(StateFields.genericError, "");
        const savedCards = response?.addUserCards.savedCards;
        setSavedCards(savedCards ?? []);
        setValues(initialValues);
        if (savedCards.length > 0) {
          setActivePaymentMethod(creditCardObject as CartTypes.PaymentMethod);
        }
      },
      onError: e => {
        if (isProd()) {
          lazyCaptureException(new Error("Error on saved payments page while saving card."), {
            errorInfo: {
              // @ts-ignore
              errorMessage: e.message,
            },
          });
        }
        setStateVariables(StateFields.genericError, genericErrorMessage);
      },
    }
  );

  const [setPrimaryMethod, { data: PrimaryData, loading: PrimaryLoading, error: PrimaryError }] =
    useMutation<AddSavedCardsResponse>(SetPrimaryMutation, {
      context: {
        headers: noCacheHeaders,
      },
      onError: () => {
        setStateVariables(
          StateFields.genericError,
          "Unable to set card as primary payment method, try again later."
        );
      },
    });

  const saveCard = useCallback(
    (input: any) => {
      saveCardMutation({
        variables: {
          input,
        },
      });
    },
    [saveCardMutation]
  );

  const setPrimary = useCallback(
    (input: any) => {
      setPrimaryMethod({
        variables: {
          input,
        },
      });
    },
    [setPrimaryMethod]
  );

  const savingCardLoading = loading || PrimaryLoading;

  const savingCardError = error || PrimaryError;

  const savingCardResponse = data || PrimaryData;

  return {
    saveCard,
    setPrimary,
    savingCardLoading,
    savingCardError,
    savingCardResponse,
  };
};

export default useSaveCard;
