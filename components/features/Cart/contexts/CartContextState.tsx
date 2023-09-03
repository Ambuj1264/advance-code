import { CardType } from "../types/cartEnums";

import contextFactory from "contexts/contextFactory";

type CartContextType = {
  removeMutationLoading: boolean;
  is3DSModalToggled: boolean;
  is3DSIframeDisabled: boolean;
  threeDSFormData?: CartTypes.NormalizedForm3dsData;
  paymentError?: { errorMessage?: string };
  isFormLoading: boolean;
  isLoadingCartProducts: boolean;
  creditCardType?: CardType;
  noDismissMiniCartPopOver?: boolean;
  isFetchingAPICardType: boolean;
};

const defaultState: CartContextType = {
  removeMutationLoading: false,
  is3DSModalToggled: true,
  is3DSIframeDisabled: false,
  threeDSFormData: undefined,
  paymentError: undefined,
  isFormLoading: false,
  creditCardType: undefined,
  isLoadingCartProducts: false,
  noDismissMiniCartPopOver: false,
  isFetchingAPICardType: false,
};

const { context, Provider, useContext } = contextFactory<CartContextType>(defaultState);

export default context;
export const CartContextStateProvider = Provider;
export const useCartContext = useContext;
