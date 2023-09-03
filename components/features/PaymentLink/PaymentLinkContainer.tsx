import React, { useState } from "react";
import { StringParam, useQueryParams } from "use-query-params";
import { useTranslation } from "react-i18next";
import { toUndefined } from "fp-ts/lib/Option";
import { useRouter } from "next/router";

import useFinalizeCheckout from "../Cart/hooks/useFinalizeCheckout";
import PaymentForm from "../Cart/PaymentForm";
import { NotificationContextProvider } from "../ProductPageNotification/contexts/NotificationStateContext";
import { CartContextStateProvider } from "../Cart/contexts/CartContextState";
import ProductOverviewContainer from "../Cart/ProductOverviewContainer";
import CartHeader from "../Cart/CartHeader";
import {
  CartContainerColumn,
  CartContainerRow,
  CartStyledProductNotification,
  CartWrapperContainer,
} from "../Cart/sharedCartComponents";
import {
  getPaymentSuccessRedirectUrl,
  redirectToFrontPage,
  redirectToMobilePaymentRoute,
  trackPurchase,
} from "../Cart/utils/cartUtils";
import AdminGearLoader from "../AdminGear/AdminGearLoader";
import { OrderPaymentProvider } from "../Cart/types/cartEnums";
import useFetchCartData from "../Cart/hooks/useFetchCartData";

import { constructPaymentLinkCart, isPaymentLinkActive } from "./utils/paymentLinkUtils";

import {
  CartQueryParam,
  Marketplace,
  PaymentLinkQueryParam,
  SupportedCurrencies,
} from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import useCurrency from "hooks/useCurrency";
import OrderErrorBoundary from "components/ui/Order/OrderErrorBoundary";
import useDocumentHidden from "hooks/useDocumentHidden";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useSession from "hooks/useSession";
import useActiveLocale from "hooks/useActiveLocale";
import { emptyFunction } from "utils/helperUtils";
import useEffectOnce from "hooks/useEffectOnce";

const PaymentLinkContainer = ({
  finalizeCheckoutInput,
  isPayment,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
  isPayment?: boolean;
}) => {
  const [finalizeCheckoutInputState, setFinalizeCheckoutInput] = useState<
    CartTypes.FinalizeCheckoutInput | undefined
  >(finalizeCheckoutInput);

  const { t } = useTranslation(Namespaces.orderNs);
  const isMobile = useIsMobile();
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const { currencyCode, isCurrencyEmpty } = useCurrency();
  const activeLocale = useActiveLocale();
  const router = useRouter();
  const isGTTP = marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;

  const [{ paymentLinkId: queryParamPaymentLinkId, paymentProvider: queryParamPaymentProvider }] =
    useQueryParams({
      [PaymentLinkQueryParam.PAYMENT_LINK_ID]: StringParam,
      [CartQueryParam.PAYMENT_PROVIDER]: StringParam,
    });

  const handleRedirectToPaymentReceipt = () => {
    const { redirectLink } = getPaymentSuccessRedirectUrl({
      activeLocale,
      isPaymentLink: true,
    });
    router.push({
      pathname: redirectLink,
      query: {
        paymentLinkId: queryParamPaymentLinkId,
      },
    });
  };

  const {
    cart: cartData,
    fetchPaymentLinkData,
    loading: paymentLinkWithProvidersLoading,
    error: paymentLinkWithProvidersError,
    paymentLinkWithProvidersData,
  } = useFetchCartData({
    queryParamPaymentLinkId,
    currencyCode,
    isCurrencyEmpty,
    finalizeCheckoutInputState,
    isPaymentLink: true,
    onPaymentLinkAlreadyPaid: handleRedirectToPaymentReceipt,
    queryParamPaymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
  });

  const onSuccesfullCheckout = () => {
    if (cartData && queryParamPaymentLinkId) {
      trackPurchase({
        cartData,
        marketplace,
        paymentId: queryParamPaymentLinkId,
        currency: marketplaceBaseCurrency as SupportedCurrencies,
      });
    }
    handleRedirectToPaymentReceipt();
  };

  const { finalizePaymentLinkError, isOrderAuthorised, isFinalizedCheckoutLoading } =
    useFinalizeCheckout({
      finalizeCheckoutInput: finalizeCheckoutInputState,
      onSuccesfullCheckout,
      paymentLinkId: queryParamPaymentLinkId,
    });

  const { user, isLoading: isSessionLoading } = useSession();

  useDocumentHidden({
    onDocumentHiddenStatusChange: isCurrencyEmpty ? emptyFunction : fetchPaymentLinkData,
    debounceTimer: 5 * 60 * 1000,
  });

  const onMobileContinueClick =
    !isPayment && isMobile
      ? redirectToMobilePaymentRoute({
          activeLocale,
          finalizeCheckoutInput,
          paymentLinkId: queryParamPaymentLinkId,
          paymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
        })
      : undefined;

  useEffectOnce(() => {
    if (!queryParamPaymentLinkId) {
      redirectToFrontPage({ marketplace, activeLocale });
    }
  });

  if (
    isOrderAuthorised ||
    paymentLinkWithProvidersData?.payByLinkWithPaymentProviders?.payByLink?.paid
  ) {
    return <DefaultPageLoading title={t("Your payment confirmation will appear soon...")} />;
  }

  if (
    !paymentLinkWithProvidersData ||
    paymentLinkWithProvidersError ||
    isCurrencyEmpty ||
    paymentLinkWithProvidersData.payByLinkWithPaymentProviders?.payByLink?.cart?.itemCount === 0 ||
    (!user && isSessionLoading)
  ) {
    return <DefaultPageLoading />;
  }
  const shouldHideForm = isMobile && !isPayment;
  const paymentLinkData = paymentLinkWithProvidersData?.payByLinkWithPaymentProviders?.payByLink;
  const { paymentProviderSettings } = paymentLinkWithProvidersData.payByLinkWithPaymentProviders;

  const {
    type,
    amount,
    currency,
    expiresAt,
    paid,
    cancelled,
    cart: {
      flights,
      cars,
      tours,
      stays,
      toursAndTickets,
      customs,
      vacationPackages,
      customerInfo,
      priceObject,
    },
    percentageOfTotal,
  } = paymentLinkData;

  const isActivePayment = isPaymentLinkActive({
    serverTime: paymentProviderSettings?.serverTime,
    expiresAt,
  });

  const paymentLinkCustomProducts = constructPaymentLinkCart({
    cancelled,
    paid,
    customs,
    currency: currency ?? toUndefined(currencyCode),
    expiresAt,
    type,
    isActivePayment,
  });

  const adminGearLinks = [
    {
      url: `&${CartQueryParam.PAYMENT_PROVIDER}=${OrderPaymentProvider.ADYEN}`,
      name: `Force ${OrderPaymentProvider.ADYEN}`,
    },
    {
      url: `&${CartQueryParam.PAYMENT_PROVIDER}=${OrderPaymentProvider.SALTPAY}`,
      name: `Force ${OrderPaymentProvider.SALTPAY}`,
    },
  ];

  const adjustedAmount = isActivePayment && !cancelled ? priceObject.price || amount : 0;

  return (
    <OrderErrorBoundary componentName="paymentLinkContainer">
      <CartWrapperContainer>
        <CartContextStateProvider
          paymentError={finalizePaymentLinkError}
          is3DSIframeDisabled={false}
          is3DSModalToggled
        >
          <NotificationContextProvider>
            <CartHeader
              isPaymentLinkPage
              customerName={customerInfo?.name}
              expiryDate={expiresAt}
              isActivePayment={isActivePayment}
              isCancelled={cancelled}
            />
            <CartContainerRow>
              <CartContainerColumn>
                <PaymentForm
                  shouldHideForm={shouldHideForm}
                  total={adjustedAmount}
                  currency={priceObject.currency}
                  onMobileContinueClick={onMobileContinueClick}
                  finalizedCheckoutError={finalizePaymentLinkError}
                  isFinalizedCheckoutLoading={isFinalizedCheckoutLoading}
                  setFinalizeCheckoutInput={setFinalizeCheckoutInput}
                  isCheckoutDisabled={paymentLinkWithProvidersLoading}
                  paymentProviderSettings={paymentProviderSettings}
                  user={user}
                  defaultCustomerInfo={customerInfo}
                  paymentLinkId={queryParamPaymentLinkId}
                  onSuccesfullCheckout={onSuccesfullCheckout}
                  queryParamPaymentProvider={queryParamPaymentProvider}
                  percentageOfTotal={percentageOfTotal}
                />
                <CartStyledProductNotification id="payment-link-notifications" />
              </CartContainerColumn>
              {(!isMobile || !isPayment) && (
                <CartContainerColumn>
                  <OrderErrorBoundary componentName="productsInPaymentLinkCart">
                    <ProductOverviewContainer
                      isLoadingCartProducts={paymentLinkWithProvidersLoading}
                      queryCustoms={paymentLinkCustomProducts}
                      queryFlights={flights}
                      queryCars={cars}
                      queryTours={tours}
                      queryStays={stays}
                      queryToursAndTickets={toursAndTickets}
                      queryVacationPackages={vacationPackages}
                      carProductBaseUrl=""
                      carSearchBaseUrl=""
                      fetchCartData={emptyFunction}
                      fetchUserData={emptyFunction}
                      isPaymentLink
                    />
                  </OrderErrorBoundary>
                </CartContainerColumn>
              )}
            </CartContainerRow>
          </NotificationContextProvider>
        </CartContextStateProvider>
      </CartWrapperContainer>
      {isGTTP ? null : <AdminGearLoader links={adminGearLinks} hideCommonLinks />}
    </OrderErrorBoundary>
  );
};

export default PaymentLinkContainer;
