import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import useForm from "@travelshift/ui/hooks/useForm";

import FlightStateContext from "../Flight/contexts/FlightStateContext";
import FlightCallbackContext from "../Flight/contexts/FlightCallbackContext";
import useGetIpCountryCode from "../../../hooks/useGetIpCountryCode";

import PaymentFormFooter from "./PaymentFormFooter";
import PaymentFooterCheckboxes from "./PaymentFooterCheckboxes";
import { Column, RestWrapper } from "./sharedCartComponents";
import PaymentFormBusinessInputs from "./PaymentFormBusinessInputs";
import PaymentError from "./PaymentError";
import {
  constructCommonCheckoutParams,
  DEFAULT_CREDIT_CARD_PAYMENT_METHOD,
  checkIfAdyenOnlyCardType,
  getInitialPaymentFormValues,
  normalizeAdyenPaymentMethods,
  getActivePaymentConfig,
  normalizePayMayaPaymentMethods,
  getEachPaymentProviderConfig,
  constructPaymentMutationParams,
} from "./utils/cartUtils";
import { useCartContext } from "./contexts/CartContextState";
import useCheckout from "./hooks/useCheckout";
import {
  getInitialCreditCardFormValues,
  getSupportedCardTypes,
  getNomalizedPayMayaCCTokenErrorMessage,
} from "./utils/creditCardUtils";
import usePaymentMethods from "./hooks/usePaymentMethods";
import PaymentMethods from "./PaymentMethods";
import {
  CardType,
  OrderPaymentProvider,
  PaymentMethodOrderType,
  PaymentMethodType,
} from "./types/cartEnums";
import CreditCardForm from "./CreditCardForm";
import CartValueProps from "./CartValueProps";
import CreditCard3dsForm from "./CreditCard3dsForm";
import PaymentMethodsSkeleton from "./PaymentMethodsSkeleton";
import { CART_HEADER_ID } from "./CartHeader";

import lazyCaptureException from "lib/lazyCaptureException";
import MarketplaceInformation from "components/ui/Order/MarketplaceInformation";
import OrderErrorBoundary from "components/ui/Order/OrderErrorBoundary";
import CustomNextDynamic from "lib/CustomNextDynamic";
import Input from "components/ui/Inputs/Input";
import InputWrapper, { Label } from "components/ui/InputWrapper";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import PhoneNumberInputContainer from "components/ui/Inputs/PhoneNumberInputContainer";
import NationalityDropdown from "components/ui/Inputs/Dropdown/NationalityDropdown";
import Row from "components/ui/Grid/Row";
import useActiveLocale from "hooks/useActiveLocale";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { SupportedCurrencies } from "types/enums";
import useTokenizeCard from "hooks/useTokenizeCard";
import { fixIOSInputZoom, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import { StyledInput as PhoneInput } from "components/ui/Inputs/PhoneNumberInput";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const AdyenForm = CustomNextDynamic(() => import("./adyen/AdyenForm"), {
  ssr: false,
  loading: () => null,
});

// The position of the PayPal button associated with this div.
const PaymentFormWrapper = styled.div`
  position: relative;
`;

const Wrapper = styled.div(() => [
  fixIOSInputZoom,
  css`
    @supports (-webkit-touch-callout: none) {
      ${mqMax.large} {
        input {
          width: 125%;
          padding-top: 12px;
          padding-left: ${gutters.small + 2}px;
          transform: scale(0.7999);
        }

        ${PhoneInput} {
          input {
            margin-top: 0;
          }
        }
      }
    }
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  `,
]);

const LabelWrapper = styled.div`
  position: relative;
  width: 100%;
  & + & {
    margin-top: ${gutters.large / 2}px;
  }
`;

const PaymentForm = ({
  total,
  currency,
  onMobileContinueClick,
  shouldHideForm,
  finalizedCheckoutError,
  onSuccesfullCheckout,
  defaultCustomerInfo,
  setFinalizeCheckoutInput,
  isCheckoutDisabled,
  vpFlightBookingToken,
  paymentProviderSettings,
  user,
  paymentLinkId,
  queryParamPaymentProvider,
  isFinalizedCheckoutLoading,
  setUpdatedCustomerInfo,
  percentageOfTotal,
}: {
  total: number;
  onMobileContinueClick?: () => void;
  shouldHideForm?: boolean;
  finalizedCheckoutError?: {
    errorMessage?: string;
  };
  onSuccesfullCheckout: (
    voucherId?: string,
    bookedProducts?: CartTypes.CheckoutBookedProducts[],
    forgotPasswordLink?: string,
    userCreated?: boolean
  ) => void;
  defaultCustomerInfo?: OrderTypes.CustomerInfo;
  setFinalizeCheckoutInput: (finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput) => void;
  isCheckoutDisabled: boolean;
  vpFlightBookingToken?: string;
  paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
  user?: User;
  paymentLinkId?: string;
  queryParamPaymentProvider?: string;
  isFinalizedCheckoutLoading?: boolean;
  currency?: string;
  setUpdatedCustomerInfo?: (customerInfo: CartTypes.CommonCustomerInfoInput) => void;
  percentageOfTotal?: number;
}) => {
  const isMobile = useIsMobile();
  const adyenRef = useRef<CartTypes.AdyenRefType>(null);
  const { t } = useTranslation(Namespaces.orderNs);
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const { t: commonT } = useTranslation();
  const activeLocale = useActiveLocale();
  const { currencyCode: currencyCodeWithDefault } = useCurrencyWithDefault();
  const displayedCurrency = currency || currencyCodeWithDefault;
  const { onFormSubmit: onPassengerDetailsFormSubmit } = useContext(FlightCallbackContext);
  const {
    passengers: vpFlightPassengers,
    formErrors: { passengerFormErrors },
  } = useContext(FlightStateContext);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const tokenizeCard = useTokenizeCard(paymentProviderSettings);
  const { preferredPaymentProvider, paymentProviders } = paymentProviderSettings;

  const { adyenPaymentConfig, payMayaPaymentConfig, saltPayPaymentConfig } =
    getEachPaymentProviderConfig(paymentProviders);

  const activePaymentProvider = (queryParamPaymentProvider ??
    preferredPaymentProvider) as OrderPaymentProvider;

  const [activePaymentMethod, setActivePaymentMethod] = useState<CartTypes.PaymentMethod>({
    ...DEFAULT_CREDIT_CARD_PAYMENT_METHOD(activePaymentProvider),
    isUsersPrimaryCard: false,
    provider: activePaymentProvider,
  });

  const { ipCountryCode } = useGetIpCountryCode();

  const {
    setContextState,
    isFormLoading,
    paymentError,
    creditCardType,
    isFetchingAPICardType,
    is3DSModalToggled,
    threeDSFormData,
    removeMutationLoading,
  } = useCartContext();

  const is3DSModalActive = threeDSFormData && is3DSModalToggled;

  const activePaymentConfig = getActivePaymentConfig({
    saltPayPaymentConfig,
    adyenPaymentConfig,
    payMayaPaymentConfig,
    activePaymentProvider,
  });

  const isSaveCardEnabled = activePaymentConfig?.enableSaveCard ?? false;

  const isInvalidPassengersForm = useMemo(
    () =>
      vpFlightBookingToken
        ? passengerFormErrors.some(passengerFormError => passengerFormError.isInvalid)
        : false,
    [passengerFormErrors, vpFlightBookingToken]
  );

  const validatePassengersForm = useCallback(() => {
    if (isInvalidPassengersForm) {
      document.getElementById(CART_HEADER_ID)?.scrollIntoView({ behavior: "smooth" });
    }
    onPassengerDetailsFormSubmit();
  }, [isInvalidPassengersForm, onPassengerDetailsFormSubmit]);

  const isCreditCardPaymentType =
    activePaymentMethod.type === PaymentMethodType.CREDIT_CARD ||
    activePaymentMethod.type === PaymentMethodType.MAYA_CREDIT_CARD;

  const {
    values: {
      name,
      email,
      phoneNumber,
      country,
      isBusinessTraveller,
      companyId,
      companyName,
      saveCard,
      termsAgreed,
      companyAddress,
    },
    errors: {
      name: isNameError,
      email: isEmailError,
      country: isCountryError,
      termsAgreed: termsAgreedError,
    },
    blurredInputs: {
      name: isNameBlurred,
      email: isEmailBlurred,
      country: isCountryBlurred,
      termsAgreed: isTermsAgreedBlurred,
    },
    handleChange,
    handleBlur,
    handleMultipleChanges,
    handleSubmit: handlePaymentFormSubmit,
    isFormInvalid,
  } = useForm({
    initialValues: getInitialPaymentFormValues({
      defaultCartCustomerInfo: defaultCustomerInfo,
      userProfileInfo: user,
      activeLocale,
    }),
  });
  const [nationality, setNationality] = useState(country.value as string);
  const customerInfoInput: CartTypes.CustomerInfoInput = useMemo(() => {
    return {
      name: name.value as string,
      email: email.value as string,
      phoneNumber: phoneNumber.value as string,
      nationality,
      businessId: isBusinessTraveller.value ? (companyId.value as string) : undefined,
      companyName: isBusinessTraveller.value ? (companyName.value as string) : undefined,
      companyAddress: isBusinessTraveller.value ? (companyAddress.value as string) : undefined,
      termsAgreed: termsAgreed.value as boolean,
      vpFlightData: vpFlightBookingToken
        ? {
            bookingToken: vpFlightBookingToken,
            passengers: vpFlightPassengers,
          }
        : undefined,
    };
  }, [
    name.value,
    email.value,
    phoneNumber.value,
    nationality,
    isBusinessTraveller,
    companyId.value,
    companyName.value,
    companyAddress.value,
    termsAgreed.value,
    vpFlightBookingToken,
    vpFlightPassengers,
  ]);

  const [businessInputsState, setBusinessInputsState] = useState({
    companyName: activePaymentMethod.businessName ?? "",
    companyAddress: activePaymentMethod.businessAddress ?? "",
    companyId: activePaymentMethod.businessId ?? "",
    isBusinessTraveller: isBusinessTraveller.value as boolean,
  });

  const populateMaybeBusinessValues = useCallback(
    (shouldUseActivePaymentMethod?: boolean) => {
      const isBusinessPaymentMethod = Boolean(
        shouldUseActivePaymentMethod
          ? activePaymentMethod.businessId && activePaymentMethod.businessName
          : businessInputsState.isBusinessTraveller
      );
      const businessInputsEvents = [
        {
          target: {
            type: "checkbox",
            checked: isBusinessPaymentMethod,
            name: "isBusinessTraveller",
          },
        },
        {
          target: {
            value: shouldUseActivePaymentMethod
              ? activePaymentMethod.businessName ?? ""
              : businessInputsState.companyName ?? "",
            name: "companyName",
          },
        },
        {
          target: {
            value: shouldUseActivePaymentMethod
              ? activePaymentMethod.businessId ?? ""
              : businessInputsState.companyId ?? "",
            name: "companyId",
          },
        },
        {
          target: {
            value: shouldUseActivePaymentMethod
              ? activePaymentMethod.businessAddress ?? ""
              : businessInputsState.companyAddress ?? "",
            name: "companyAddress",
          },
        },
      ] as unknown as React.ChangeEvent<HTMLInputElement>[];

      handleMultipleChanges(businessInputsEvents);
    },
    [activePaymentMethod, handleMultipleChanges, businessInputsState]
  );

  const onError = useCallback(
    (error?: { errorMessage?: string }) => {
      setContextState({ paymentError: error, is3DSIframeDisabled: false });
    },
    [setContextState]
  );

  const on3dsRedirect = useCallback(
    (normalized3dsData: CartTypes.NormalizedForm3dsData) => {
      setContextState({ threeDSFormData: normalized3dsData });
    },
    [setContextState]
  );

  const onPayMayaCheckout = useCallback((url: string) => {
    window.location.assign(url);
  }, []);

  const onCreditCardTypeChange = useCallback(
    (newCreditCardType: CardType) => {
      setContextState({ creditCardType: newCreditCardType });
    },
    [setContextState]
  );

  const handlePaymentMutation = useCheckout({
    onError,
    onSuccesfullCheckout,
    on3dsRedirect,
    activePaymentMethod,
    adyenRef,
    activeLocale,
    paymentLinkId,
    onPayMayaCheckout,
    creditCardType,
  });

  const { data: queryPaymentMethods, loading: isPaymentMethodsLoading } = usePaymentMethods({
    shopperLocale: activeLocale,
    currency: displayedCurrency as SupportedCurrencies,
    amount: total,
    ipCountryCode,
    countryCode: nationality,
    paymentLinkId,
    skip: isCheckoutDisabled,
  });

  const { travelshiftPaymentMethods, savedCards: saltPaySavedCards = [] } =
    queryPaymentMethods?.paymentMethodsForCart || {};

  const commonCheckoutParams = useMemo(
    () =>
      constructCommonCheckoutParams({
        customerInfoInput,
        currency: displayedCurrency as SupportedCurrencies,
        activeLocale,
        ipCountryCode,
        paymentLinkId,
        paymentProvider: activePaymentProvider,
      }),
    [
      customerInfoInput,
      displayedCurrency,
      activeLocale,
      ipCountryCode,
      paymentLinkId,
      activePaymentProvider,
    ]
  );

  const normalizedAdyenPaymentMethods = useMemo(
    () =>
      activePaymentProvider === OrderPaymentProvider.PAYMAYA
        ? []
        : normalizeAdyenPaymentMethods({
            paymentMethods: travelshiftPaymentMethods?.paymentMethods,
            isMobile,
          }),
    [activePaymentProvider, travelshiftPaymentMethods?.paymentMethods, isMobile]
  );

  const normalizedPayMayaPaymentMethods = useMemo(
    () =>
      activePaymentProvider !== OrderPaymentProvider.PAYMAYA
        ? []
        : normalizePayMayaPaymentMethods(travelshiftPaymentMethods?.paymentMethods),
    [activePaymentProvider, travelshiftPaymentMethods?.paymentMethods]
  );

  const {
    values: creditCardValues,
    errors: creditCardErrors,
    validationErrorMessages: creditCardErrorMessages,
    blurredInputs: creditCardBlurredInputs,
    handleChange: handleCreditCardChange,
    handleBlur: handleCreditCardBlur,
    handleSubmit: handleCreditCardSubmit,
    isFormInvalid: isCreditCardFormInvalid,
  } = useForm({
    initialValues: getInitialCreditCardFormValues({
      cartT,
      defaultCustomerInfo,
      user,
      hasHolderName: isSaveCardEnabled,
    }),
    handleBeforeSubmit: validatePassengersForm,
    isInvalidValues: isInvalidPassengersForm,
    onSubmit: async () => {
      if (!isCreditCardFormInvalid && !isFormInvalid) {
        setContextState({ isFormLoading: true });
        const [expMonth, expYear] = (creditCardValues.expiryDate.value as string).split("/");
        const cvc = creditCardValues.cvvNumber.value as string;
        const pan = creditCardValues.cardNumber.value as string;
        const holderName = creditCardValues.holderName.value as string;
        const shouldSaveCard = saveCard.value as boolean;

        const supportedCardTypes = getSupportedCardTypes(normalizedAdyenPaymentMethods);
        const isAmexAvailable = supportedCardTypes.includes(CardType.AMEX);
        const isCarteBancaireAvailable = supportedCardTypes.includes(CardType.CARTE_BANCAIRE);
        const {
          companyId: businessId,
          companyName: businessName,
          companyAddress: businessAddress,
        } = commonCheckoutParams.customerInfo;
        const holderNameToArray = holderName.split(" ");
        const holderFirstName = holderNameToArray.shift() ?? "";
        const holderLastName = holderNameToArray.join(" ") ?? "";

        const isAdyenOnlyCardType = checkIfAdyenOnlyCardType(activePaymentProvider, creditCardType);

        // Not all currencies support AMEX or CARTE_BANCAIRE.
        if (isAdyenOnlyCardType && !isAmexAvailable && !isCarteBancaireAvailable) {
          onError({
            errorMessage: t(
              "Unfortunately, we don't support {cardType} for this currency. Please switch to another currency or select a different payment method.",
              {
                cardType: creditCardType,
              }
            ),
          });
          return;
        }

        const currentPaymentProvider = isAdyenOnlyCardType
          ? OrderPaymentProvider.ADYEN
          : activePaymentMethod.provider;

        const {
          tokenizedSaltPayCard,
          tokenizedAdyenCard,
          tokenizedPayMayaCard,
          hasTokenizationError,
          payMayaError,
        } = await tokenizeCard({
          cardInformation: {
            pan,
            expMonth,
            expYear,
            cvc,
          },
          activePaymentProvider: currentPaymentProvider,
          shouldSaveCard,
          creditCardType,
        });
        if (hasTokenizationError) {
          setContextState({ is3DSModalToggled: false });
          lazyCaptureException(new Error(`Error on cart page while tokenizing card`), {
            errorInfo: {
              currentPaymentProvider,
              creditCardType,
              shouldSaveCard,
              [OrderPaymentProvider.ADYEN]: {
                adyenPaymentConfig,
                adyenCSEScript: window.adyen,
              },
              [OrderPaymentProvider.SALTPAY]: {
                saltPayPaymentConfig,
                saltPayBAPIjs: window.BAPIjs,
              },
              [OrderPaymentProvider.PAYMAYA]: {
                payMayaPaymentConfig,
                ...payMayaError,
              },
            },
          });
          onError({
            errorMessage: getNomalizedPayMayaCCTokenErrorMessage(
              payMayaError as CartTypes.PayMayaTokenizeDataError,
              cartT
            ),
          });
          return;
        }
        const saveCardParams = shouldSaveCard
          ? {
              firstName: holderFirstName,
              lastName: holderLastName,
              isUsersPrimaryCard: saltPaySavedCards.length === 0,
              businessId,
              businessName,
              businessAddress,
            }
          : undefined;

        if (currentPaymentProvider === OrderPaymentProvider.SALTPAY) {
          const [saltPayTokenizedCard, ...saltPayCardToSave] = tokenizedSaltPayCard;
          const cardToSave = [...saltPayCardToSave, ...tokenizedAdyenCard];
          const saltpayCheckoutParams = {
            ...commonCheckoutParams,
            cvc,
            saveCard: shouldSaveCard,
            cardToSave,
            paymentProvider: OrderPaymentProvider.SALTPAY,
            tokenizedCard: saltPayTokenizedCard.cardToken,
          };

          handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: saltpayCheckoutParams,
              saveCardParams,
              paymentLinkId,
            })
          );
        }

        if (currentPaymentProvider === OrderPaymentProvider.ADYEN) {
          const adyenCheckoutParams = {
            ...commonCheckoutParams,
            cvc,
            saveCard: shouldSaveCard,
            cardToSave: tokenizedSaltPayCard,
            paymentProvider: OrderPaymentProvider.ADYEN,
            tokenizedCard: tokenizedAdyenCard[0].cardToken,
          };

          handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: adyenCheckoutParams,
              saveCardParams,
              paymentLinkId,
            })
          );
        }
        if (currentPaymentProvider === OrderPaymentProvider.PAYMAYA) {
          const payMayaCheckoutParams = {
            ...commonCheckoutParams,
            cvc,
            cardToSave: [],
            saveCard: shouldSaveCard,
            paymentProvider: OrderPaymentProvider.PAYMAYA,
            tokenizedCard: tokenizedPayMayaCard[0].cardToken,
            paymentType: PaymentMethodOrderType.MAYA_CREDIT_CARD,
          };

          handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: payMayaCheckoutParams,
              saveCardParams,
              paymentLinkId,
            })
          );
        }
      }
    },
  });

  const onChangeNationality = useCallback((nationalityCountryCode: string) => {
    setNationality(nationalityCountryCode);
  }, []);

  const handleSubmit = useCallback(
    // eslint-disable-next-line consistent-return
    (event?: React.SyntheticEvent) => {
      if ((event?.target as Element)?.id === "disableIframeButton") {
        // should the user have chosen to disable the iframe, we need to create a new
        // checkout request as the previously generated data is no longer valid
        setContextState({ is3DSIframeDisabled: true });
      }
      setContextState({
        is3DSModalToggled: true,
        paymentError: undefined,
        threeDSFormData: undefined,
      });

      handlePaymentFormSubmit();

      if (isCreditCardPaymentType) {
        return handleCreditCardSubmit();
      }

      if (
        (activePaymentMethod.type === PaymentMethodType.MAYA_WALLET_SINGLE_PAYMENT ||
          activePaymentMethod.type === PaymentMethodType.MAYA_QR) &&
        !isFormInvalid
      ) {
        setContextState({ isFormLoading: true });

        return handlePaymentMutation(
          constructPaymentMutationParams({
            checkoutParams: {
              ...commonCheckoutParams,
              paymentType: activePaymentMethod.paymentType,
              paymentProvider: OrderPaymentProvider.PAYMAYA,
            },
            paymentLinkId,
          })
        );
      }

      if (
        // We can submit PayPal only using PayPal button. See usePaypalPaymentMethod for more detail.
        activePaymentMethod.type !== PaymentMethodType.PAYPAL &&
        activePaymentMethod.type !== PaymentMethodType.SAVED_CARD &&
        !isFormInvalid
      ) {
        return adyenRef?.current?.[
          activePaymentMethod.type as CartTypes.AdditionalDataPaymentMethodType
        ]?.submit();
      }

      if (!isFormInvalid && activePaymentMethod.type === PaymentMethodType.SAVED_CARD) {
        if (
          activePaymentMethod.provider === OrderPaymentProvider.SALTPAY &&
          activePaymentMethod.pan
        ) {
          setContextState({ isFormLoading: true });

          return handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: {
                ...commonCheckoutParams,
                tokenizedCard: `pan_${activePaymentMethod.pan}`,
                paymentProvider: OrderPaymentProvider.SALTPAY,
              },
              paymentLinkId,
            })
          );
        }

        if (activePaymentMethod.provider === OrderPaymentProvider.ADYEN && activePaymentMethod.id) {
          setContextState({ isFormLoading: true });
          return handlePaymentMutation(
            constructPaymentMutationParams({
              checkoutParams: {
                ...commonCheckoutParams,
                paymentMethod: {
                  storedPaymentMethodId: activePaymentMethod.id,
                  type: PaymentMethodType.CREDIT_CARD,
                },
                paymentProvider: OrderPaymentProvider.ADYEN,
              },
              paymentLinkId,
            })
          );
        }

        lazyCaptureException(new Error(`Error on cart page while checking out with saved card`), {
          errorInfo: {
            activePaymentProvider,
            activePaymentMethod,
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handlePaymentFormSubmit,
      handleCreditCardSubmit,
      isFormInvalid,
      activePaymentMethod,
      handlePaymentMutation,
      commonCheckoutParams,
      adyenRef,
    ]
  );

  const commonErrorMessage = commonT("Field is required");

  const handleBusinessInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBusinessInputsState(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value || event.target.checked,
      }));
      handleChange(event);
    },
    [handleChange]
  );

  const isCartLoading =
    removeMutationLoading ||
    isCheckoutDisabled ||
    isFetchingAPICardType ||
    isFinalizedCheckoutLoading ||
    (isFormLoading && !paymentError);

  useEffect(() => {
    if (isCreditCardPaymentType) {
      setActivePaymentMethod(prevState => ({
        ...prevState,
        provider: activePaymentProvider,
      }));
    }
    const isSavedCardSelected = activePaymentMethod.type === PaymentMethodType.SAVED_CARD;
    setIsReadOnly(isSavedCardSelected);
    populateMaybeBusinessValues(isSavedCardSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activePaymentProvider,
    activePaymentMethod.type,
    activePaymentMethod.pan,
    isCreditCardPaymentType,
  ]);

  useEffect(() => {
    if (finalizedCheckoutError) {
      onError(finalizedCheckoutError);
      setContextState({ isFormLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizedCheckoutError]);

  useEffect(() => {
    if (commonCheckoutParams.customerInfo !== undefined) {
      setUpdatedCustomerInfo?.(commonCheckoutParams.customerInfo);
    }
  }, [commonCheckoutParams.customerInfo, setUpdatedCustomerInfo]);

  return (
    <OrderErrorBoundary>
      <PaymentFormWrapper data-testid="cartPaymentForm">
        {!shouldHideForm && (
          <>
            <Wrapper>
              <Row>
                <Column>
                  <InputWrapper
                    label={cartT("Full name")}
                    id="name"
                    hasError={isNameError}
                    customErrorMessage={cartT("Please provide your full name")}
                  >
                    <Input
                      id="name"
                      name="name"
                      placeholder={cartT("Add your full name")}
                      value={name.value as string}
                      onChange={handleChange}
                      error={isNameBlurred && isNameError}
                      onBlur={handleBlur}
                      autocomplete="name"
                      useDebounce={false}
                    />
                  </InputWrapper>
                </Column>
                <Column>
                  <InputWrapper
                    label={t("Email")}
                    id="email"
                    hasError={isEmailBlurred && isEmailError}
                    customErrorMessage={cartT("Please provide a valid email address")}
                  >
                    <Input
                      id="email"
                      name="email"
                      placeholder={cartT("Add contact email")}
                      value={email.value as string}
                      onChange={handleChange}
                      error={isEmailBlurred && isEmailError}
                      onBlur={handleBlur}
                      autocomplete="email"
                      useDebounce={false}
                    />
                  </InputWrapper>
                </Column>
                <Column>
                  <PhoneNumberInputContainer
                    hasError={false}
                    phoneNumber={phoneNumber.value as string}
                    onPhoneNumberChange={(number: string) =>
                      handleChange({
                        target: {
                          value: number,
                          name: "phoneNumber",
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    placeholder={cartT("Add a phone number")}
                  />
                </Column>
                <Column>
                  <NationalityDropdown
                    hasError={isCountryBlurred && isCountryError}
                    nationality={nationality}
                    onChange={onChangeNationality}
                  />
                </Column>
                <PaymentFormBusinessInputs
                  isBusinessTraveller={isBusinessTraveller.value as boolean}
                  companyName={companyName.value as string}
                  companyAddress={companyAddress.value as string}
                  companyId={companyId.value as string}
                  handleChange={handleBusinessInputChange}
                  handleBlur={handleBlur}
                  isReadOnly={isReadOnly}
                />
                {isMobile ? <CartValueProps isMobileValuePropTags /> : null}
              </Row>
              {country.value && total > 0 && (
                <RestWrapper>
                  <LabelWrapper>
                    <Label isRequired={false}>{t("Payment methods")}</Label>
                  </LabelWrapper>
                  {isPaymentMethodsLoading || isCheckoutDisabled ? (
                    <PaymentMethodsSkeleton />
                  ) : (
                    <>
                      <PaymentMethods
                        activePaymentMethod={activePaymentMethod}
                        setActivePaymentMethod={setActivePaymentMethod}
                        activePaymentProvider={activePaymentProvider}
                        queryAdyenPaymentMethods={travelshiftPaymentMethods}
                        normalizedAdyenPaymentMethods={normalizedAdyenPaymentMethods}
                        normalizedPayMayaPaymentMethods={normalizedPayMayaPaymentMethods}
                        saltPaySavedCards={saltPaySavedCards}
                        isCartPage
                      />
                      {isCreditCardPaymentType && (
                        <CreditCardForm
                          values={creditCardValues}
                          errors={creditCardErrors}
                          errorMessages={creditCardErrorMessages}
                          blurredInputs={creditCardBlurredInputs}
                          handleChange={handleCreditCardChange}
                          handleBlur={handleCreditCardBlur}
                          commonErrorMessage={commonErrorMessage}
                          paymentProviderSettings={paymentProviderSettings}
                          customerName={name.value as string}
                          isSaveCardAvailable={isSaveCardEnabled}
                          activePaymentMethod={activePaymentMethod}
                          onCreditCardTypeChange={onCreditCardTypeChange}
                        />
                      )}
                      <CreditCard3dsForm
                        setFinalizeCheckoutInput={setFinalizeCheckoutInput}
                        resubmitForm={handleSubmit}
                        activeLocale={activeLocale}
                      />
                      {activePaymentProvider !== OrderPaymentProvider.PAYMAYA && (
                        <AdyenForm
                          activeLocale={activeLocale}
                          handlePaymentMutation={handlePaymentMutation}
                          adyenRef={adyenRef}
                          customerInfoInput={customerInfoInput}
                          onError={onError}
                          setFinalizeCheckoutInput={setFinalizeCheckoutInput}
                          paymentConfig={adyenPaymentConfig}
                          paymentMethods={travelshiftPaymentMethods}
                          normalizedAdyenPaymentMethods={normalizedAdyenPaymentMethods}
                          activePaymentMethod={activePaymentMethod}
                          isFormInvalid={isFormInvalid}
                          ipCountryCode={ipCountryCode}
                          paymentLinkId={paymentLinkId}
                        />
                      )}
                    </>
                  )}
                </RestWrapper>
              )}
            </Wrapper>
            <Row>
              <PaymentFooterCheckboxes
                handleChange={handleChange}
                termsAgreed={termsAgreed.value as boolean}
                hasError={isTermsAgreedBlurred && termsAgreedError}
                disableTopMargin={
                  isCreditCardPaymentType && !isPaymentMethodsLoading && !isCheckoutDisabled
                }
                saveCard={saveCard.value as boolean}
                canShowSaveCard={Boolean(
                  total > 0 &&
                    isSaveCardEnabled &&
                    isCreditCardPaymentType &&
                    !isPaymentMethodsLoading
                )}
              />
            </Row>
          </>
        )}
        {paymentError && !isFinalizedCheckoutLoading && !is3DSModalActive && (
          <PaymentError paymentError={paymentError} />
        )}
        <PaymentFormFooter
          totalAmount={total}
          currency={displayedCurrency}
          onMobileContinueClick={onMobileContinueClick}
          onSubmit={handleSubmit}
          loading={isCartLoading}
          isPaymentStep={!shouldHideForm}
          skipPriceToInt={Boolean(paymentLinkId)}
          activePaymentMethod={activePaymentMethod}
          percentageOfTotal={percentageOfTotal}
        />
        {!shouldHideForm && <MarketplaceInformation />}
      </PaymentFormWrapper>
    </OrderErrorBoundary>
  );
};

export default PaymentForm;
