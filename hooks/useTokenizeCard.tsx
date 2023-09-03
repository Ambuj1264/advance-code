import { useCallback, useEffect } from "react";
import { loadScript } from "@travelshift/ui/hooks/useDynamicScript";

import {
  checkIfAdyenOnlyCardType,
  getPayMayaBaseURL,
} from "../components/features/Cart/utils/cartUtils";

import {
  CardType,
  OrderPaymentEnvironment,
  OrderPaymentProvider,
  SaltPayEnvironment,
} from "components/features/Cart/types/cartEnums";
import { cleanNumber } from "components/features/Cart/utils/creditCardUtils";

const getSaltPayToken = ({
  cardDetails,
  clientKey,
  currency,
}: {
  cardDetails: CartTypes.SaltPayCardDetails;
  clientKey?: string;
  currency: string;
}): Promise<{ token: string; currency: string }> => {
  return new Promise((resolve, reject) => {
    window.BAPIjs.setPublicToken(clientKey);
    window.BAPIjs.getToken(
      cardDetails,
      async (saltPayTokenStatus: number, saltPayTokenData?: CartTypes.SaltPayTokenData) => {
        if (saltPayTokenData && saltPayTokenData.Token) {
          resolve({
            token: saltPayTokenData.Token,
            currency,
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`Error: ${saltPayTokenStatus}`);
        }
      }
    );
  });
};

export const tokenizeSaltPayCard = async ({
  cardInformation,
  shouldSaveCard,
  saltPayPaymentConfig,
  activePaymentProvider,
}: {
  cardInformation: CartTypes.SaltPayCardDetails;
  shouldSaveCard: boolean;
  saltPayPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
  activePaymentProvider?: OrderPaymentProvider;
}): Promise<{
  tokenizedSaltPayCard: CartTypes.CardToSave[] | never[];
  isSaltPayError: boolean;
}> => {
  if (
    activePaymentProvider !== OrderPaymentProvider.PAYMAYA &&
    (activePaymentProvider === OrderPaymentProvider.SALTPAY || shouldSaveCard)
  ) {
    if (saltPayPaymentConfig && window.BAPIjs) {
      const { pan, expYear, expMonth } = cardInformation;
      const primarySettingConfig = {
        clientKey: saltPayPaymentConfig.clientKey,
        currency: saltPayPaymentConfig.suggestedCurrency,
      };
      const additionalProviderSettings =
        saltPayPaymentConfig.additionalProviderSettings
          ?.map(setting => ({
            clientKey: setting.clientKey,
            currency: setting.suggestedCurrency,
          }))
          .filter(config => config.currency !== primarySettingConfig.currency) ?? [];
      const allSettingsConfig = [
        primarySettingConfig,
        ...(shouldSaveCard ? additionalProviderSettings : []),
      ];
      const promisesWithTokens = allSettingsConfig.map(setting =>
        getSaltPayToken({
          cardDetails: {
            pan,
            expYear,
            expMonth,
          },
          clientKey: setting.clientKey,
          currency: setting.currency,
        })
      );
      const tokens = await Promise.all(promisesWithTokens).catch(() => {
        return [];
      });
      const hasError = !tokens.length || tokens.some(item => !item.token);
      const tokenizedSaltPayCard = tokens.map(currToken => ({
        cardToken: currToken?.token,
        currency: currToken?.currency,
        paymentProvider: OrderPaymentProvider.SALTPAY,
      }));

      return { tokenizedSaltPayCard, isSaltPayError: hasError };
    }

    return {
      tokenizedSaltPayCard: [],
      isSaltPayError: true,
    };
  }

  return {
    tokenizedSaltPayCard: [],
    isSaltPayError: false,
  };
};

export const tokenizePayMayaCard = async ({
  cardInformation,
  payMayaPaymentConfig,
  activePaymentProvider,
}: {
  cardInformation: CartTypes.CardInformation;
  payMayaPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
  activePaymentProvider?: OrderPaymentProvider;
}): Promise<{
  tokenizedPayMayaCard: CartTypes.CardToSave[] | never[];
  payMayaError?: CartTypes.PayMayaError;
}> => {
  if (
    activePaymentProvider === OrderPaymentProvider.PAYMAYA &&
    payMayaPaymentConfig?.clientPublicKey &&
    payMayaPaymentConfig?.environment
  ) {
    const { pan: number, expMonth, expYear, cvc } = cardInformation;
    const createPaymentTokenUrl = `https://${getPayMayaBaseURL(
      payMayaPaymentConfig.environment
    )}/payments/v1/payment-tokens`;

    const adjustedCardInfo = {
      card: {
        number,
        expMonth,
        expYear: `20${expYear}`,
        cvc,
      },
    };
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${payMayaPaymentConfig.clientPublicKey}`,
      },
      method: "POST",
      body: JSON.stringify(adjustedCardInfo),
    };
    const { tokenizedPayMayaCard, payMayaError } = await fetch(createPaymentTokenUrl, options)
      .then(res => res.json())
      .then((json: CartTypes.PayMayaTokenizeData | CartTypes.PayMayaTokenizeDataError) => {
        if ("paymentTokenId" in json && json.paymentTokenId) {
          return {
            tokenizedPayMayaCard: [
              {
                cardToken: json.paymentTokenId,
                currency: payMayaPaymentConfig.suggestedCurrency,
                paymentProvider: OrderPaymentProvider.PAYMAYA,
              },
            ],
            payMayaError: undefined,
          };
        }
        return {
          tokenizedPayMayaCard: [],
          payMayaError: {
            errorMessage: "No PayMaya paymentTokenId after tokenizing",
            paymentTokenURL: createPaymentTokenUrl,
            ...json,
          },
        };
      })
      .catch((e: Error) => {
        // eslint-disable-next-line no-console
        console.error("Error tokenizing card: ", e);
        return {
          tokenizedPayMayaCard: [],
          payMayaError: {
            errorMessage: "Network error while tokenizing a PayMaya card",
            paymentTokenURL: createPaymentTokenUrl,
            networkError: {
              ...e,
            },
          },
        };
      });
    return { tokenizedPayMayaCard, payMayaError };
  }
  return { tokenizedPayMayaCard: [], payMayaError: undefined };
};

export const tokenizeAdyenCard = ({
  cardInformation,
  adyenPaymentConfig,
  serverTime,
  shouldSaveCard,
  activePaymentProvider,
}: {
  cardInformation: CartTypes.CardInformation;
  adyenPaymentConfig?: CartTypes.QueryPaymentProviderConfig;
  serverTime: string;
  shouldSaveCard: boolean;
  activePaymentProvider?: OrderPaymentProvider;
}): {
  tokenizedAdyenCard: CartTypes.CardToSave[] | never[];
} => {
  if (
    activePaymentProvider !== OrderPaymentProvider.PAYMAYA &&
    (activePaymentProvider === OrderPaymentProvider.ADYEN || shouldSaveCard)
  ) {
    if (window.adyen && adyenPaymentConfig?.clientPublicKey && serverTime) {
      const { cvc, expYear, pan: number, expMonth: expiryMonth } = cardInformation;
      const cseInstance = window.adyen.encrypt.createEncryption(
        adyenPaymentConfig.clientPublicKey,
        {
          enableValidations: false,
        }
      );
      const cardData: CartTypes.AdyenCSECardDetails = {
        number,
        cvc,
        expiryMonth,
        expiryYear: `20${expYear}`,
        generationtime: serverTime,
      };

      return {
        tokenizedAdyenCard: [
          {
            cardToken: cseInstance.encrypt(cardData),
            currency: adyenPaymentConfig.suggestedCurrency,
            paymentProvider: OrderPaymentProvider.ADYEN,
          },
        ],
      };
    }
  }
  return { tokenizedAdyenCard: [] };
};

const useTokenizeCard = (paymentProviderSettings: CartTypes.QueryPaymentProviderSettings) => {
  const { serverTime, paymentProviders } = paymentProviderSettings;
  const saltPayPaymentConfig = paymentProviders?.find(
    config => config.provider === OrderPaymentProvider.SALTPAY
  );
  const adyenPaymentConfig = paymentProviders?.find(
    config => config.provider === OrderPaymentProvider.ADYEN
  );
  const payMayaPaymentConfig = paymentProviders?.find(
    config => config.provider === OrderPaymentProvider.PAYMAYA
  );

  useEffect(() => {
    if (saltPayPaymentConfig?.clientKey) {
      const saltPayUrl = `https://${
        saltPayPaymentConfig.environment === OrderPaymentEnvironment.LIVE
          ? SaltPayEnvironment.LIVE
          : SaltPayEnvironment.TEST
      }.borgun.is/resources/js/borgunpayment-js/borgunpayment.v1.min.js`;

      loadScript("saltPayScript", saltPayUrl);
    }
    if (adyenPaymentConfig?.clientKey && adyenPaymentConfig?.clientLibraryLocation) {
      loadScript(
        "adyenCSEScript",
        adyenPaymentConfig.clientLibraryLocation,
        {},
        // Adyen CSE library has a bug - when we call createEncryption first time the page is scrolling to the top
        // https://app.asana.com/0/413331704569864/1202589247887863/f
        () => {
          if (window.adyen && adyenPaymentConfig?.clientPublicKey) {
            window.adyen.encrypt.createEncryption(adyenPaymentConfig.clientPublicKey, {});
          }
        }
      );
    }
  }, [
    adyenPaymentConfig?.clientKey,
    adyenPaymentConfig?.clientLibraryLocation,
    adyenPaymentConfig?.clientPublicKey,
    adyenPaymentConfig?.environment,
    saltPayPaymentConfig?.clientKey,
    saltPayPaymentConfig?.environment,
  ]);

  return useCallback(
    async ({
      cardInformation,
      activePaymentProvider,
      creditCardType,
      shouldSaveCard = false,
    }: {
      cardInformation: CartTypes.CardInformation;
      activePaymentProvider?: OrderPaymentProvider;
      creditCardType?: CardType;
      shouldSaveCard?: boolean;
    }) => {
      const sanitizedCardInfo = {
        ...cardInformation,
        pan: cleanNumber(cardInformation.pan),
      };
      const { tokenizedAdyenCard } = tokenizeAdyenCard({
        cardInformation: sanitizedCardInfo,
        adyenPaymentConfig,
        serverTime,
        shouldSaveCard,
        activePaymentProvider,
      });

      const isAdyenOnlyCardType = activePaymentProvider
        ? checkIfAdyenOnlyCardType(activePaymentProvider, creditCardType)
        : false;

      const { tokenizedSaltPayCard, isSaltPayError } = await tokenizeSaltPayCard({
        saltPayPaymentConfig,
        cardInformation: sanitizedCardInfo,
        shouldSaveCard: shouldSaveCard && !isAdyenOnlyCardType,
        activePaymentProvider,
      });

      const { tokenizedPayMayaCard, payMayaError } = await tokenizePayMayaCard({
        payMayaPaymentConfig,
        cardInformation: sanitizedCardInfo,
        activePaymentProvider,
      });

      return {
        tokenizedAdyenCard,
        tokenizedSaltPayCard,
        tokenizedPayMayaCard,
        hasTokenizationError: isSaltPayError || payMayaError !== undefined,
        payMayaError,
      };
    },
    [adyenPaymentConfig, payMayaPaymentConfig, saltPayPaymentConfig, serverTime]
  );
};

export default useTokenizeCard;
