import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

import { InputWithIconWrapper } from "../sharedCartComponents";

import Input from "components/ui/Inputs/Input";
import {
  cleanNumber,
  getCreditCardType,
  getCreditCardTypeFromAdyenAPI,
} from "components/features/Cart/utils/creditCardUtils";
import { CardType, OrderPaymentProvider } from "components/features/Cart/types/cartEnums";
import getCardTypeIcon from "components/features/Cart/utils/getCardTypeIcon";
import useTokenizeCard from "hooks/useTokenizeCard";
import { Namespaces } from "shared/namespaces";

const CardIconWrapper = styled.span``;

const API_LOOKUP_TIMEOUT = 800;
const CARD_LENGTH_TO_CHECK_ON_API = 12;
const REGULAR_CVV_LENGTH = 3;
const AMEX_CVV_LENGTH = 4;

const useCreditCardInput = ({
  cardNumber,
  creditCardType = CardType.UNKNOWN,
  handleCardNumberChange,
  handleBlur,
  paymentProviderSettings,
  InputComponent = Input,
  placeholder = "1234 5678 9012 3456",
  disabled = false,
  isEditing = true,
  onCreditCardTypeChange,
  isCardNumberBlurred,
  isCardNumberError,
}: {
  cardNumber: string;
  creditCardType?: CardType;
  handleCardNumberChange: (event: React.ChangeEvent<HTMLInputElement>, cardType: CardType) => void;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
  InputComponent?: React.ElementType;
  placeholder?: string;
  disabled?: boolean;
  isEditing?: boolean;
  onCreditCardTypeChange?: (cardType: CardType) => void;
  isCardNumberBlurred: boolean;
  isCardNumberError: boolean;
}) => {
  const [isFetchingCardType, setIsFetchingCartType] = useState(false);
  const [cardType, setCardType] = useState<CardType>(creditCardType);
  const [cardSubType, setCardSubType] = useState<CardType>();
  const isAmexCard = cardType === CardType.AMEX;
  const CardIcon = getCardTypeIcon(cardType);
  const CardSubTypeIcon = cardSubType ? getCardTypeIcon(cardSubType) : null;
  const tokenizeCard = useTokenizeCard(paymentProviderSettings);
  const lookupTimeout = useRef<NodeJS.Timeout>();
  const isCardUnknown = cardNumber !== "" && cardType === CardType.UNKNOWN;
  const isCardNumberInvalid = isCardNumberBlurred && (isCardNumberError || isCardUnknown);
  const isPayMayaActive =
    paymentProviderSettings.preferredPaymentProvider === OrderPaymentProvider.PAYMAYA;
  const { t } = useTranslation(Namespaces.cartNs);

  const cardErrorMessage = isCardUnknown
    ? t("This card type is not supported")
    : t("Invalid card number");

  const handleCardBrandChange = useCallback(
    (newCreditCardType: CardType) => {
      setCardType(newCreditCardType);
      if (onCreditCardTypeChange) {
        onCreditCardTypeChange(newCreditCardType);
      }
    },
    [onCreditCardTypeChange]
  );

  useEffect(() => {
    setCardType(creditCardType);
  }, [creditCardType]);

  const lookupCardNumberOnAdyenApi = useCallback(
    async (cardNumberValue: string) => {
      if (!isPayMayaActive && cardNumberValue.length >= CARD_LENGTH_TO_CHECK_ON_API) {
        const { tokenizedAdyenCard, hasTokenizationError } = await tokenizeCard({
          cardInformation: {
            pan: cardNumberValue,
          },
          activePaymentProvider: OrderPaymentProvider.ADYEN,
        });

        if (!hasTokenizationError) {
          setIsFetchingCartType(true);
          const [creditCardTypeFromApi, creditCardSubTypeFromApi] =
            await getCreditCardTypeFromAdyenAPI({
              tokenizedCard: tokenizedAdyenCard[0].cardToken,
              paymentProviderSettings,
            }).finally(() => setIsFetchingCartType(false));

          if (creditCardTypeFromApi) {
            handleCardBrandChange(creditCardTypeFromApi);
          }

          if (creditCardSubTypeFromApi) {
            setCardSubType(creditCardSubTypeFromApi);
          }
        }
      }
    },
    [handleCardBrandChange, isPayMayaActive, paymentProviderSettings, tokenizeCard]
  );

  const onChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCardNumberValue = cleanNumber(event.target.value);
      const newCardType = getCreditCardType(newCardNumberValue, isPayMayaActive);

      if (newCardType !== cardType) {
        setCardSubType(undefined);
      }

      clearTimeout(lookupTimeout.current);

      handleCardBrandChange(newCardType);

      handleCardNumberChange(event, newCardType);

      lookupTimeout.current = setTimeout(
        () => lookupCardNumberOnAdyenApi(newCardNumberValue),
        API_LOOKUP_TIMEOUT
      );
    },
    [
      cardType,
      handleCardBrandChange,
      handleCardNumberChange,
      isPayMayaActive,
      lookupCardNumberOnAdyenApi,
    ]
  );

  const CreditCardInput = (
    <InputWithIconWrapper>
      <InputComponent
        id="cardNumber"
        name="cardNumber"
        inputMode="numeric"
        autocomplete="cc-number"
        placeholder={placeholder}
        value={cardNumber}
        onChange={onChange}
        onBlur={handleBlur}
        error={isCardNumberInvalid}
        maxLength={24}
        useDebounce={false}
        disabled={disabled}
        isEditing={isEditing}
      />
      <CardIconWrapper data-testid={`card-icon-${cardType}`}>
        <CardIcon />
        {CardSubTypeIcon && <CardSubTypeIcon />}
      </CardIconWrapper>
    </InputWithIconWrapper>
  );

  return {
    CreditCardInput,
    creditCardType: cardType,
    numberCvvDigits: isAmexCard ? AMEX_CVV_LENGTH : REGULAR_CVV_LENGTH,
    isCardNumberInvalid,
    cardErrorMessage,
    isFetchingCardType,
  };
};

export default useCreditCardInput;
