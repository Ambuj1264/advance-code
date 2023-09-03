import { isEmptyString } from "@travelshift/ui/utils/validationUtils";

import { paymentStateVariables } from "../types/savedCardsTypes";

import { OrderPaymentProvider, PaymentMethodType } from "components/features/Cart/types/cartEnums";
import { getInitialCreditCardFormValues } from "components/features/Cart/utils/creditCardUtils";

export const creditCardObject = {
  id: "creditCard",
  name: "Credit Card",
  provider: "SALTPAY",
  type: "scheme",
};

export const genericErrorMessage =
  "Unfortunately we couldn't save this payment method, please make sure the information is correct and try again.";

export const getInitialSavedPaymentValues = (t: TFunction) => {
  const initialCreditCardValues = getInitialCreditCardFormValues({ cartT: t });

  return {
    ...initialCreditCardValues,
    firstName: {
      value: "",
      isValueInvalid: isEmptyString,
    },
    lastName: {
      value: "",
      isValueInvalid: isEmptyString,
    },
    isBusinessTraveller: {
      value: false,
    },
    companyName: {
      value: "",
    },
    companyId: {
      value: "",
    },
    companyAddress: {
      value: "",
    },
  };
};

export const getInitialPrimary = (cards: CartTypes.QuerySaltPaySavedCard[]): string => {
  const primarycard = cards.find(card => card.isUsersPrimaryCard);

  if (primarycard) {
    return String(primarycard.id);
  }
  return "";
};

export const getInitialStateValues = (
  cards: CartTypes.QuerySaltPaySavedCard[]
): paymentStateVariables => {
  return {
    primaryId: getInitialPrimary(cards),
    isTokenizing: false,
    genericError: "",
    isSuccessTimeout: false,
    showModal: false,
  };
};

export const getCardInfoToDisplay = (activePaymentMethod: CartTypes.PaymentMethod) => {
  if (activePaymentMethod.type === PaymentMethodType.CREDIT_CARD) {
    return undefined;
  }
  const {
    firstName,
    lastName,
    businessId,
    businessName,
    businessAddress,
    expMonth,
    expYear,
    cardType,
    isUsersPrimaryCard,
  } = activePaymentMethod;
  const isBusiness = Boolean(businessId || businessName);
  const filler = "**** **** **** ";
  const expiry = `${expMonth}/${expYear}`;
  const dummyCvv = "***";
  const cardNumber = filler + activePaymentMethod.name;
  return {
    cardNumber,
    expiry,
    dummyCvv,
    cardType,
    firstName,
    lastName,
    isBusiness,
    businessName,
    businessId,
    businessAddress,
    isUsersPrimaryCard,
  };
};

export const constructSaveCardMutationInput = ({
  tokenizedAdyen,
  tokenizedSaltPay,
  cvc,
  firstName,
  lastName,
  businessAddress,
  businessId,
  businessName,
  isUsersPrimaryCard,
}: {
  tokenizedSaltPay: {
    cardToken: string;
    currency: string;
    paymentProvider: OrderPaymentProvider;
  }[];
  tokenizedAdyen: {
    cardToken: string;
    currency: string;
    paymentProvider: OrderPaymentProvider;
  }[];
  cvc: string;
  firstName?: string;
  lastName?: string;
  businessId?: string;
  businessName?: string;
  businessAddress?: string;
  isUsersPrimaryCard?: boolean;
}) => {
  const saltPayCards = tokenizedSaltPay.map(card => {
    return {
      cardToken: card.cardToken,
      currency: card.currency,
      securityCode: cvc,
      paymentProvider: card.paymentProvider,
    };
  });

  return {
    firstName,
    lastName,
    businessId,
    businessName,
    businessAddress,
    isUsersPrimaryCard,
    cardTokensToSave: [
      ...saltPayCards,
      {
        cardToken: tokenizedAdyen[0].cardToken,
        currency: "ISK",
        securityCode: cvc,
        paymentProvider: tokenizedAdyen[0].paymentProvider,
      },
    ],
  };
};
