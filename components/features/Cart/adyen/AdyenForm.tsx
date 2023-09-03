import styled from "@emotion/styled";
import React, { memo, MutableRefObject, useCallback, useEffect, useRef } from "react";
import AdyenCheckout from "@adyen/adyen-web";
import Core from "@adyen/adyen-web/dist/types/core";

import {
  constructCommonCheckoutParams,
  constructPaymentMutationParams,
  getAdyenConfig,
} from "../utils/cartUtils";
import { OrderPaymentProvider, PaymentMethodType } from "../types/cartEnums";
import { useCartContext } from "../contexts/CartContextState";

import GooglePay from "./components/GooglePay";
import Alipay from "./components/Alipay";
import PayPal from "./components/PayPal";
import ApplePay from "./components/ApplePay";
import Ideal from "./components/Ideal";
import Sofort from "./components/Sofort";
import Klarna from "./components/Klarna";
import WeChat from "./components/WeChat";

import { SupportedCurrencies, SupportedLanguages } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const Container = styled.div``;

const AdyenForm = ({
  activeLocale,
  handlePaymentMutation,
  adyenRef,
  customerInfoInput,
  onError,
  setFinalizeCheckoutInput,
  paymentConfig,
  paymentMethods,
  normalizedAdyenPaymentMethods,
  activePaymentMethod,
  isFormInvalid,
  ipCountryCode,
  paymentLinkId,
}: {
  activeLocale: SupportedLanguages;
  handlePaymentMutation: CartTypes.CheckoutMutation | PaymentLinkTypes.PayForPaymentLinkMutation;
  adyenRef: MutableRefObject<CartTypes.AdyenRefType | null>;
  customerInfoInput: CartTypes.CustomerInfoInput;
  onError: (error?: { errorMessage?: string }) => void;
  setFinalizeCheckoutInput: (finalizeCheckoutInput: CartTypes.FinalizeCheckoutInput) => void;
  paymentConfig?: CartTypes.QueryPaymentProviderConfig;
  paymentMethods?: CartTypes.AdyenPaymentMethods;
  normalizedAdyenPaymentMethods?: CartTypes.PaymentMethod[];
  activePaymentMethod: CartTypes.PaymentMethod;
  isFormInvalid: boolean;
  ipCountryCode?: string;
  paymentLinkId?: string;
}) => {
  const [isAdyenCheckoutReady, setAdyenCheckoutReady] = React.useState(false);
  const checkoutRef = useRef<Core | null>(null);
  const { websiteName } = useSettings();

  const customerInfo = useRef(customerInfoInput);

  const { setContextState } = useCartContext();

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    customerInfo.current = customerInfoInput;
  }, [customerInfoInput]);

  // Because of adyen limitations we are doing amount convertation on API side, for example when exactAmount=5562.3812,
  // adyenAmount will be 556238, This is how adyen handles fraction numbers.
  const { adyenAmount, adyenCurrency } = activePaymentMethod || {};

  const handleIsFormLoading = useCallback(
    (isLoading: boolean) => {
      setContextState({ isFormLoading: isLoading });
    },
    [setContextState]
  );

  const handleSetPaymentError = useCallback(
    (error?: { errorMessage?: string }) => {
      setContextState({ paymentError: error });
    },
    [setContextState]
  );

  useEffect(() => {
    const initializeAdyenCheckout = async () => {
      if (paymentMethods && paymentConfig) {
        const onSubmit = (state: any) => {
          setContextState({ paymentError: undefined, isFormLoading: true });

          const commonCheckoutParams = constructCommonCheckoutParams({
            customerInfoInput: customerInfo.current,
            currency: adyenCurrency as SupportedCurrencies,
            activeLocale,
            ipCountryCode,
            paymentLinkId,
          });

          handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: {
                ...commonCheckoutParams,
                paymentMethod: state.data.paymentMethod,
                paymentProvider: OrderPaymentProvider.ADYEN,
              },
              paymentLinkId,
            })
          );
        };

        const configuration = getAdyenConfig({
          paymentMethodsResponse: paymentMethods,
          activeLocale,
          onSubmit,
          onError,
          paymentConfig,
        });

        if (checkoutRef.current) {
          checkoutRef.current.update(configuration);
        } else {
          checkoutRef.current = await new (AdyenCheckout as any)(configuration);
          setAdyenCheckoutReady(true);
        }
      }
    };

    initializeAdyenCheckout();
  }, [
    adyenCurrency,
    activeLocale,
    paymentMethods,
    handlePaymentMutation,
    onError,
    paymentConfig,
    setContextState,
    ipCountryCode,
    paymentLinkId,
  ]);

  if (
    !isAdyenCheckoutReady ||
    !normalizedAdyenPaymentMethods ||
    !paymentConfig ||
    !adyenAmount ||
    !adyenCurrency
  )
    return null;

  const { type: activePaymentMethodType } = activePaymentMethod;

  return (
    <Container data-testid={`${OrderPaymentProvider.ADYEN}-components-container`}>
      {activePaymentMethodType === PaymentMethodType.GOOGLE_PAY && (
        <GooglePay
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          paymentConfig={paymentConfig}
          countryCode={customerInfo.current.nationality}
          amount={adyenAmount}
          currency={adyenCurrency}
          websiteName={websiteName}
          setLoadingForm={handleIsFormLoading}
        />
      )}
      {activePaymentMethodType === PaymentMethodType.APPLE_PAY && (
        <ApplePay
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          websiteName={websiteName}
          countryCode={customerInfo.current.nationality}
          amount={adyenAmount}
          currency={adyenCurrency}
          setLoadingForm={handleIsFormLoading}
        />
      )}
      {(activePaymentMethodType === PaymentMethodType.ALI_PAY ||
        activePaymentMethodType === PaymentMethodType.ALI_PAY_MOBILE) && (
        <Alipay
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
        />
      )}
      {(activePaymentMethodType === PaymentMethodType.WECHAT_QR ||
        activePaymentMethodType === PaymentMethodType.WECHAT_PAY) && (
        <WeChat
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          setFinalizeCheckoutInput={setFinalizeCheckoutInput}
        />
      )}
      {activePaymentMethodType === PaymentMethodType.PAYPAL && (
        <PayPal
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          paymentConfig={paymentConfig}
          countryCode={customerInfo.current.nationality}
          amount={adyenAmount}
          currency={adyenCurrency}
          setFinalizeCheckoutInput={setFinalizeCheckoutInput}
          setLoadingForm={handleIsFormLoading}
          setPaymentError={handleSetPaymentError}
          isFormInvalid={isFormInvalid}
        />
      )}
      {activePaymentMethodType === PaymentMethodType.IDEAL && (
        <Ideal
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          adyenEnvironment={paymentConfig.environment}
        />
      )}
      {activePaymentMethodType === PaymentMethodType.SOFORT && (
        <Sofort checkoutRef={checkoutRef} adyenRef={adyenRef} />
      )}
      {(activePaymentMethodType === PaymentMethodType.KLARNA_PAY_NOW ||
        activePaymentMethodType === PaymentMethodType.KLARNA_PAY_LATER ||
        activePaymentMethodType === PaymentMethodType.KLARNA_PAY_OVER) && (
        <Klarna
          checkoutRef={checkoutRef}
          adyenRef={adyenRef}
          paymentMethods={normalizedAdyenPaymentMethods}
          activePaymentMethod={activePaymentMethod}
        />
      )}
    </Container>
  );
};

export default memo(AdyenForm);
