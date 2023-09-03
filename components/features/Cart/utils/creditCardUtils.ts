import fetch from "isomorphic-unfetch";
// https://github.com/jaemok/credit-card-input/blob/master/creditcard.js
import { isEmptyString } from "@travelshift/ui/utils/validationUtils";

import { CardType, OrderPaymentProvider, PaymentMethodType } from "../types/cartEnums";

import { getAdyenCheckoutShopperUrl } from "./cartUtils";

import { getFormattedDate } from "utils/dateUtils";
import { getWithDefault } from "utils/helperUtils";
import lazyCaptureException from "lib/lazyCaptureException";

export const cleanNumber = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

export const validateExpiryDate = (cartT: TFunction) => (date: string) => {
  if (date.length < 5) {
    return cartT("Invalid date value");
  }

  const [month, year] = date.split("/");
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = parseInt(getFormattedDate(currentDate, "yy"), 10);

  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return cartT("The card is expired");
  }

  if (expiryYear > currentYear + 30) {
    return cartT("The date is too far in the future");
  }

  return undefined;
};

const isNumericValueValid = ({
  value,
  maxLength,
  minLength,
}: {
  value: string;
  maxLength: number;
  minLength: number;
}) => {
  const cleanValue = cleanNumber(value);
  return (
    /^\d+$/.test(cleanValue) && cleanValue.length >= minLength && cleanValue.length <= maxLength
  );
};

export const getInitialCreditCardFormValues = ({
  cartT,
  user,
  defaultCustomerInfo,
  hasHolderName = false,
}: {
  cartT: TFunction;
  user?: User;
  defaultCustomerInfo?: OrderTypes.CustomerInfo;
  hasHolderName?: boolean;
}) => {
  return {
    cardNumber: {
      value: "",
      isValueInvalid: (value: string) =>
        !isNumericValueValid({ value, maxLength: 24, minLength: 13 }),
    },
    expiryDate: {
      value: "",
      isValueInvalid: isEmptyString,
      validation: validateExpiryDate(cartT),
    },
    cvvNumber: {
      value: "",
      isValueInvalid: (value: string) =>
        !isNumericValueValid({ value, maxLength: 4, minLength: 3 }),
    },
    holderName: {
      value: getWithDefault({
        maybeValue: user?.name || defaultCustomerInfo?.name,
        defaultValue: "",
      }),
      isValueInvalid: hasHolderName ? isEmptyString : undefined,
    },
  };
};

// eslint-disable-next-line consistent-return
const getCaret = (input: HTMLInputElement) => {
  if ("selectionStart" in input) {
    return input.selectionStart;
  }

  if (document.selection) {
    (input as HTMLElement).focus();
    const sel = document.selection.createRange();
    const selLen = document.selection.createRange().text.length;

    sel.moveStart("character", -(input as HTMLInputElement).value.length);

    return sel.text.length - selLen;
  }
};

const setCaret = (input: HTMLInputElement, pos: number) => {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(pos, pos);
  }
};

export const formatCardNumber464 = (cardNumber: string): string =>
  [cardNumber.substring(0, 4), cardNumber.substring(4, 10), cardNumber.substring(10, 14)]
    .join(" ")
    .trim();

export const formatCardNumber465 = (cardNumber: string): string =>
  [cardNumber.substring(0, 4), cardNumber.substring(4, 10), cardNumber.substring(10, 15)]
    .join(" ")
    .trim();

export const formatCardNumber444 = (cardNumber: string): string =>
  cardNumber ? cardNumber.match(/\d{1,4}/g)?.join(" ") || "" : "";

const COMMON_CARD_TYPES = [
  {
    type: CardType.VISA,
    pattern: /^4/,
    format: formatCardNumber444,
    maxLength: 19,
  },
  {
    type: CardType.MASTERCARD,
    pattern: /^((5[12345])|(2[2-7]))/,
    format: formatCardNumber444,
    maxLength: 16,
  },
  {
    type: CardType.AMEX,
    pattern: /^3[47]/,
    format: formatCardNumber465,
    maxLength: 15,
  },
];

const MAYA_CARD_TYPES = [
  ...COMMON_CARD_TYPES,
  {
    type: CardType.JCB,
    pattern: /^(?:2131|1800|35)[0-9]{0,}/,
    format: formatCardNumber444,
    maxLength: 19,
  },
];

const CARD_TYPES = [
  ...COMMON_CARD_TYPES,
  {
    type: CardType.MAESTRO,
    format: formatCardNumber444,
    maxLength: 19,
  },
  {
    type: CardType.UNIONPAY,
    format: formatCardNumber444,
    maxLength: 19,
  },
  {
    type: CardType.CARTE_BANCAIRE,
    format: formatCardNumber444,
    maxLength: 16,
  },
];

export const getDefaultSupportedCardTypes = () =>
  Object.values(CardType).filter(
    brandItem => brandItem !== CardType.UNKNOWN && brandItem !== CardType.JCB
  );

export const getCreditCardType = (cardNumber: string, isPayMayaActive?: boolean): CardType => {
  // the value 12 corresponds to the constant CARD_LENGTH_TO_CHECK_ON_API in useCreditCardInput hook for Adyen
  const firstTwelve = cleanNumber(cardNumber.slice(0, 12));
  if (!firstTwelve) {
    return CardType.UNKNOWN;
  }

  if (isPayMayaActive) {
    const cardType = MAYA_CARD_TYPES.find(card => card.pattern.test(cleanNumber(cardNumber)));
    return cardType ? cardType.type : CardType.UNKNOWN;
  }

  const supportedBrands = getDefaultSupportedCardTypes();

  const cardType = window.adyen?.cardTypes?.determine?.(firstTwelve)?.cardtype;

  return supportedBrands?.includes(cardType) ? cardType : CardType.UNKNOWN;
};

export const getSupportedCardTypes = (normalizedAdyenPaymentMethods: CartTypes.PaymentMethod[]) =>
  normalizedAdyenPaymentMethods.find(
    paymentMethod => paymentMethod.type === PaymentMethodType.CREDIT_CARD
  )?.brands || [];

export const getCreditCardTypeFromAdyenAPI = async ({
  tokenizedCard,
  paymentProviderSettings,
}: {
  tokenizedCard: string;
  paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
}): Promise<CardType[] | []> => {
  const adyenConfig = paymentProviderSettings.paymentProviders.find(
    providerConfig => providerConfig.provider === OrderPaymentProvider.ADYEN
  );

  if (adyenConfig) {
    try {
      const supportedBrands = getDefaultSupportedCardTypes();
      const providerEnvironment = adyenConfig.environment;
      // Api from Adyen credit card component
      // https://github.com/Adyen/adyen-web/blob/master/packages/lib/src/components/internal/SecuredFields/binLookup/triggerBinLookUp.ts#L31
      const url = `${getAdyenCheckoutShopperUrl(providerEnvironment)}/v3/bin/binLookup?token=${
        adyenConfig.clientKey
      }`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({
          supportedBrands,
          encryptedBin: tokenizedCard,
        }),
      });

      const cardBrandResponse = await response.json();
      const cardBrandsData = cardBrandResponse?.brands as CartTypes.AdyenApiLookupBrands[];

      return cardBrandsData
        ? cardBrandsData
            .filter(cardBrandItem => cardBrandItem.supported)
            .reverse()
            .map(cardBrandItem => cardBrandItem.brand)
        : [];
    } catch (error) {
      lazyCaptureException(new Error(`Error in while receiving card brand from adyen API`), {
        errorInfo: {
          // @ts-ignore
          errorMessage: error.message,
        },
      });
    }
  }

  return [];
};

export const formatCreditCardNumber = (cardNumber: string, cardType: CardType = CardType.VISA) => {
  const cleanCardNumber = cleanNumber(cardNumber);
  const ALL_CARD_TYPES = [...CARD_TYPES, ...MAYA_CARD_TYPES];

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const i in ALL_CARD_TYPES) {
    const currentCardType = ALL_CARD_TYPES[i];

    if (cardType === currentCardType.type) {
      const clippedCardNumber = cleanCardNumber.substring(0, currentCardType.maxLength);
      return currentCardType.format(clippedCardNumber);
    }
  }
  const defaultCardNumber = cleanCardNumber.substring(0, ALL_CARD_TYPES[0].maxLength);

  return formatCardNumber444(defaultCardNumber);
};

export const handleCreditCardNumber = (
  event: React.ChangeEvent<HTMLInputElement>,
  cardType: CardType = CardType.VISA
) => {
  const input = event.target;
  const prevValue = input.value;
  const caretPosition = getCaret(input);
  const beforeCaretValue = prevValue.substring(0, caretPosition || 0);
  const beforeCaretFormattedValue = formatCreditCardNumber(beforeCaretValue, cardType);
  const updatedCaretPosition = beforeCaretFormattedValue.length;
  const newValue = formatCreditCardNumber(prevValue, cardType);

  if (prevValue === newValue) return;

  // eslint-disable-next-line functional/immutable-data
  input.value = newValue;
  setCaret(input, updatedCaretPosition);
};

export const formatExpiryDate = (expiryDate: string) => {
  const cleanDate = cleanNumber(expiryDate)
    .replace(/^([0]+)/g, "0") // 00 => 0
    .slice(0, 4);

  if (cleanDate.match(/^[2-9]$/)) {
    return `0${cleanDate}`;
  }

  if (cleanDate.match(/^1[^012]$/)) {
    return `01/${cleanDate.slice(-1)}`;
  }

  if (cleanDate.length > 2) {
    return `${cleanDate.slice(0, 2)}/${cleanDate.slice(2)}`;
  }

  return cleanDate;
};

// Source: https://hackmd.io/@paymaya-pg/ErrorCodes
export const getNomalizedPayMayaCCTokenErrorMessage = (
  payMayaErrorMessage: CartTypes.PayMayaTokenizeDataError,
  t: TFunction
) => {
  if (payMayaErrorMessage === undefined || !payMayaErrorMessage?.code) return undefined;
  const { code, message, parameters } = payMayaErrorMessage;
  const description = parameters?.[0]?.description;
  switch (code) {
    case "2553":
      return description || message || t("Missing/invalid parameters.");
    case "PY0070":
    case "PY0036":
      return t("This card type is not supported");
    default:
      return message || undefined;
  }
};
