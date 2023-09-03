import { CardType, OrderPaymentProvider } from "components/features/Cart/types/cartEnums";

type QuerySavedCardsContent = {
  id: number;
  cardType: CardType;
  pan: string;
  expYear: string;
  expMonth: string;
  currencyCode: string;
  isUsersPrimaryCard?: boolean;
  firstName?: string;
  lastName?: string;
  businessId?: string;
  businessName?: string;
  businessAddress?: string;
  providers?: OrderPaymentProvider;
  created: string;
};

export type QuerySavedCards = {
  userCards: {
    savedCards: QuerySavedCardsContent[];
  };
};

export type AddSavedCardsResponse = {
  addUserCards: {
    savedCards: QuerySavedCardsContent[];
  };
};

export type DeleteSavedCardsResponse = {
  deleteUserCard: {
    savedCards: QuerySavedCardsContent[];
  };
};

export type paymentStateVariables = {
  primaryId: string;
  isTokenizing: boolean;
  genericError: string;
  isSuccessTimeout: boolean;
  showModal: boolean;
  creditCardType?: CardType;
};

export enum StateFields {
  primaryId = "primaryId",
  isTokenizing = "isTokenizing",
  genericError = "genericError",
  isSuccessTimeout = "isSuccessTimeout",
  showModal = "showModal",
  creditCardType = "creditCardType",
}
