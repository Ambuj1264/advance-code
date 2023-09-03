import { useMutation } from "@apollo/react-hooks";
// eslint-disable-next-line import/no-extraneous-dependencies
import { MutationFunctionOptions } from "@apollo/react-common";
import { toUndefined } from "fp-ts/lib/Option";

import RemoveItemFromCartMutation from "../queries/RemoveCartItemMutation.graphql";
import cartWithPaymentProvidersQuery from "../queries/CartWithProvidersQuery.graphql";
import { useCartContext } from "../contexts/CartContextState";
import { BroadcastChannelCartActions } from "../types/cartEnums";

import lazyCaptureException from "lib/lazyCaptureException";
import { isDev } from "utils/globalUtils";
import useBroadcastChannel from "hooks/useBroadcastChannel";
import { BroadcastChannelNames } from "types/enums";
import useCurrency from "hooks/useCurrency";

const useRemoveItemFromCart = ({
  onCompleted,
  onError,
  fetchUserData,
}: {
  onCompleted: () => void;
  onError?: () => void;
  fetchUserData?: () => void;
}) => {
  const { currencyCode } = useCurrency();
  const { setContextState } = useCartContext();
  const { postMessageHandler } = useBroadcastChannel({
    channelName: BroadcastChannelNames.MINICART,
  });

  const [removeItemFromCartMutation, { data, loading }] = useMutation<
    { removeCartItemFromCart: { success: boolean; message: string } },
    { cartItemId: string }
  >(RemoveItemFromCartMutation, {
    refetchQueries: [
      {
        query: cartWithPaymentProvidersQuery,
        variables: {
          currencyCode: toUndefined(currencyCode),
        },
        context: {
          fetchOptions: {
            method: "POST",
          },
        },
      },
    ],
    onCompleted: (...args) => {
      setContextState({ removeMutationLoading: false });
      if (args[0]?.removeCartItemFromCart?.success) {
        postMessageHandler({
          actionName: BroadcastChannelCartActions.REFETCH_CART_DATA,
        });
        onCompleted();
      } else {
        onError?.();
      }
    },
    // Fast reload always throws an error on dev environments and apollo doesn't know how to handle it.
    // Therefore, whenever we're serving this locally, onError is always called
    // even though the mutation was successfully completed.
    // https://github.com/apollographql/react-apollo/issues/3862
    onError: isDev()
      ? undefined
      : apolloError => {
          onError?.();
          fetchUserData?.();
          lazyCaptureException(new Error(`Error on removeItemFromCart mutation`), {
            errorInfo: {
              // @ts-ignore
              errorMessage: apolloError,
            },
          });
          setContextState({ removeMutationLoading: false });
        },
  });

  return {
    removeItemFromCartMutation: (
      ...args: [
        MutationFunctionOptions<
          { removeCartItemFromCart: { success: boolean; message: string } },
          { cartItemId: string }
        >
      ]
    ) => {
      setContextState({ removeMutationLoading: true });
      return removeItemFromCartMutation(...args);
    },
    data,
    loading,
  };
};

export default useRemoveItemFromCart;
