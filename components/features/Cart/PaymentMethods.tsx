import React, { memo, useCallback, useEffect, useMemo } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import getCardTypeIcon from "./utils/getCardTypeIcon";
import getPaymentMethodIcon from "./utils/getPaymentMethodIcon";
import { OrderPaymentProvider, PaymentMethodType } from "./types/cartEnums";
import {
  constructPaymentMethods,
  normalizeAdyenSavedCards,
  normalizeSaltPaySavedCards,
} from "./utils/cartUtils";
import { PaymentMethodsContainer } from "./sharedCartComponents";

import { typographyCaptionSmall } from "styles/typography";
import {
  borderRadiusSmall,
  boxShadowTileRegular,
  greenColor,
  greyColor,
  gutters,
  guttersPx,
} from "styles/variables";
import { singleLineTruncation } from "styles/base";
import CreditCartIcon from "components/icons/cart/credit-card.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const PaymentMethodItem = styled.div(({ isSelected }: { isSelected?: boolean }) => [
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: ${guttersPx.smallHalf};
    border: 1px solid ${rgba(greyColor, 0.4)};
    border-radius: ${borderRadiusSmall};
    width: 90px;
    min-width: 70px;
    height: 48px;
    padding: ${guttersPx.smallHalf} 18px 0;
    cursor: pointer;
    outline: none;
    &:hover {
      box-shadow: ${boxShadowTileRegular};
    }
  `,
  isSelected &&
    css`
      box-shadow: ${boxShadowTileRegular};
      cursor: default;
      border-color: transparent;
      outline: 2px solid ${greenColor};
    `,
]);

const PaymentIconWrapper = styled.div<{ isLargeSVG: boolean }>(
  ({ isLargeSVG }) => `
  min-height: 20px;
  svg {
    display: block;
    width: ${isLargeSVG ? 42 : 32}px;
    padding-top: ${isLargeSVG ? gutters.large / 4 : 0}px;
  }
`
);

const PaymentMethodTitle = styled.div([
  typographyCaptionSmall,
  singleLineTruncation,
  css`
    display: inline;
    min-width: 0;
    max-width: calc(100% + ${gutters.small * 2}px);
    color: ${greyColor};
  `,
]);

const PaymentMethods = ({
  activePaymentMethod,
  setActivePaymentMethod,
  activePaymentProvider,
  saltPaySavedCards,
  normalizedAdyenPaymentMethods = [],
  normalizedPayMayaPaymentMethods = [],
  queryAdyenPaymentMethods,
  isCartPage = false,
}: {
  activePaymentMethod: CartTypes.PaymentMethod;
  setActivePaymentMethod: (paymentMethod: CartTypes.PaymentMethod) => void;
  activePaymentProvider: OrderPaymentProvider;
  saltPaySavedCards: CartTypes.QuerySaltPaySavedCard[];
  normalizedAdyenPaymentMethods?: CartTypes.PaymentMethod[];
  normalizedPayMayaPaymentMethods?: CartTypes.PaymentMethod[];
  queryAdyenPaymentMethods?: CartTypes.AdyenPaymentMethods;
  isCartPage?: boolean;
  currency?: string;
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.cartNs);
  const creditCardConfig = normalizedAdyenPaymentMethods.find(
    payment => payment.type === PaymentMethodType.CREDIT_CARD
  );

  const savedAdyenCards = useMemo(
    () =>
      normalizeAdyenSavedCards({
        adyenSavedCards: queryAdyenPaymentMethods?.storedPaymentMethods,
        savedCards: saltPaySavedCards,
        creditCardConfig,
      }),
    [queryAdyenPaymentMethods?.storedPaymentMethods, saltPaySavedCards, creditCardConfig]
  );

  const normalizedSaltPaySavedCards = useMemo(
    () =>
      normalizeSaltPaySavedCards({
        savedCards: saltPaySavedCards,
        creditCardConfig,
      }),
    [saltPaySavedCards, creditCardConfig]
  );

  const paymentMethods = normalizedPayMayaPaymentMethods.length
    ? normalizedPayMayaPaymentMethods
    : constructPaymentMethods({
        isSaltPayProviderActive: activePaymentProvider === OrderPaymentProvider.SALTPAY,
        savedAdyenCards,
        normalizedAdyenPaymentMethods,
        normalizedSaltPaySavedCards,
      });

  useEffect(() => {
    if (paymentMethods.length) {
      // We assume that first payment method is always credit card, but in case of we have saved cards
      const firstPaymentProvider = paymentMethods[0];

      if (isCartPage) {
        if (activePaymentMethod.id !== firstPaymentProvider.id) {
          setActivePaymentMethod(firstPaymentProvider);
          return;
        }

        if (
          activePaymentMethod.priceObject?.currency !==
            firstPaymentProvider.priceObject?.currency ||
          activePaymentMethod.priceObject?.price !== firstPaymentProvider.priceObject?.price
        ) {
          const foundActivePaymentMethod = paymentMethods.find(
            payment => payment.id === activePaymentMethod.id
          );
          setActivePaymentMethod(foundActivePaymentMethod || firstPaymentProvider);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAdyenCards, normalizedSaltPaySavedCards]);

  const handleClick = useCallback(
    (selectedPaymentMethod: CartTypes.PaymentMethod) => {
      setActivePaymentMethod(selectedPaymentMethod);
    },
    [setActivePaymentMethod]
  );

  return (
    <PaymentMethodsContainer data-testid="paymentMethods">
      {paymentMethods.map(paymentMethod => {
        const PaymentMethodIcon =
          paymentMethod.provider === OrderPaymentProvider.SALTPAY ||
          paymentMethod.type === PaymentMethodType.SAVED_CARD
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              getCardTypeIcon(paymentMethod.cardType!, CreditCartIcon)
            : getPaymentMethodIcon(paymentMethod.type);

        return (
          <PaymentMethodItem
            key={`${paymentMethod.id}`}
            isSelected={paymentMethod.id === activePaymentMethod.id}
            onClick={() => handleClick(paymentMethod)}
          >
            <PaymentIconWrapper
              isLargeSVG={
                paymentMethod.type === PaymentMethodType.MAYA_QR ||
                paymentMethod.type === PaymentMethodType.MAYA_WALLET_SINGLE_PAYMENT
              }
            >
              <PaymentMethodIcon />
            </PaymentIconWrapper>
            {isMobile && paymentMethod.type === PaymentMethodType.SAVED_CARD ? (
              <PaymentMethodTitle>{paymentMethod.name.slice(4)}</PaymentMethodTitle>
            ) : (
              <PaymentMethodTitle>{t(paymentMethod.name)}</PaymentMethodTitle>
            )}
          </PaymentMethodItem>
        );
      })}
    </PaymentMethodsContainer>
  );
};

export default memo(PaymentMethods);
