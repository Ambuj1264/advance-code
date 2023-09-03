import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQueryParams, StringParam } from "use-query-params";
import { flatten } from "fp-ts/lib/Array";
import { toUndefined } from "fp-ts/lib/Option";

import { getCarProductUrl, getCarSearchUrl } from "../Car/utils/carUtils";
import AdminGearLoader from "../AdminGear/AdminGearLoader";
import { NotificationContextProvider } from "../ProductPageNotification/contexts/NotificationStateContext";

import CartHeader from "./CartHeader";
import PaymentForm from "./PaymentForm";
import ProductOverviewContainer from "./ProductOverviewContainer";
import {
  trackPurchase,
  getPaymentSuccessRedirectUrl,
  getVPTitles,
  redirectToMobilePaymentRoute,
  redirectToCartRoute,
} from "./utils/cartUtils";
import useFinalizeCheckout from "./hooks/useFinalizeCheckout";
import { CartContextStateProvider } from "./contexts/CartContextState";
import CartVpTravellerDetailsForm from "./CartVpTravellerDetailsForm";
import { OrderPaymentProvider } from "./types/cartEnums";
import useCartByLink from "./hooks/useCartByLink";
import useFetchCartData from "./hooks/useFetchCartData";
import {
  CartContainerColumn,
  CartContainerRow,
  CartStyledProductNotification,
  CartWrapperContainer,
} from "./sharedCartComponents";

import { useSettings } from "contexts/SettingsContext";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { CartQueryParam, SupportedCurrencies, Marketplace } from "types/enums";
import useSession from "hooks/useSession";
import useActiveLocale from "hooks/useActiveLocale";
import useDocumentHidden from "hooks/useDocumentHidden";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useOptimizeExperiments from "components/ui/Experiments/useOptimizeExperiment";
import { ActiveExperiments } from "components/ui/Experiments/experimentEnums";
import FlightProvider from "components/features/Flight/FlightProvider";
import OrderErrorBoundary from "components/ui/Order/OrderErrorBoundary";
import { emptyFunction } from "utils/helperUtils";
import useCurrency from "hooks/useCurrency";

const CartContainer = ({
  isPayment,
  finalizeCheckoutInput,
}: {
  isPayment?: boolean;
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
}) => {
  useOptimizeExperiments({
    experimentName: ActiveExperiments.NEW_CART,
    experimentVariation: "1",
  });
  const [finalizeCheckoutInputState, setFinalizeCheckoutInput] = useState<
    CartTypes.FinalizeCheckoutInput | undefined
  >(finalizeCheckoutInput);

  const { t } = useTranslation(Namespaces.orderNs);
  const router = useRouter();
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const { currencyCode, isCurrencyEmpty } = useCurrency();
  const isMobile = useIsMobile();
  const activeLocale = useActiveLocale();
  const [updatedCustomerInfo, setUpdatedCustomerInfo] =
    useState<CartTypes.CommonCustomerInfoInput>();
  const isGTTP = marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;

  const [{ cartId: queryParamsCartId, savedCartId, paymentProvider: queryParamPaymentProvider }] =
    useQueryParams({
      [CartQueryParam.CART_ID]: StringParam,
      [CartQueryParam.SAVED_CART_ID]: StringParam,
      [CartQueryParam.PAYMENT_PROVIDER]: StringParam,
    });
  const { refetch: fetchSessionData, user, isLoading: isSessionLoading } = useSession();

  const {
    cart: cartData,
    fetchCartData,
    cartWithProvidersData,
    error: cartWithProvidersError,
    loading: cartWithProvidersLoading,
  } = useFetchCartData({
    currencyCode,
    isCurrencyEmpty,
    finalizeCheckoutInputState,
    queryParamsCartId,
    savedCartId,
    queryParamPaymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
  });

  useCartByLink({ fetchSessionData, activeLocale, savedCartId });

  useDocumentHidden({
    onDocumentHiddenStatusChange: isCurrencyEmpty ? emptyFunction : fetchCartData,
    debounceTimer: 5 * 60 * 1000,
  });

  const hasVPInCart = cartData?.vacationPackages && cartData?.vacationPackages.length > 0;

  const onSuccesfullCheckout = (
    voucherId?: string,
    bookedProducts?: CartTypes.CheckoutBookedProducts[],
    forgotPasswordLink?: string,
    userCreated?: boolean
  ) => {
    if (cartData && voucherId) {
      trackPurchase({
        cartData,
        bookedProducts,
        marketplace,
        paymentId: voucherId,
        currency: marketplaceBaseCurrency as SupportedCurrencies,
      });
    }
    const { isPasswordLink, redirectLink } = getPaymentSuccessRedirectUrl({
      activeLocale,
      hasVPInCart,
      forgotPasswordLink,
      userCreated,
    });
    const queryParams =
      hasVPInCart && !userCreated && voucherId
        ? {
            trip: getVPTitles(cartData.vacationPackages),
            voucherId,
          }
        : {
            voucherId,
          };
    // need to pass in the password link as a string so that it won't get encoded
    const routerObj = isPasswordLink
      ? redirectLink
      : {
          pathname: redirectLink,
          query: queryParams,
        };

    router.push(routerObj);
  };

  const { finalizedCheckoutError, isOrderAuthorised, isFinalizedCheckoutLoading } =
    useFinalizeCheckout({
      finalizeCheckoutInput: finalizeCheckoutInputState,
      onSuccesfullCheckout,
    });

  const onCartItemRemove = useCallback(
    () => Promise.all([fetchCartData(), fetchSessionData()]),
    [fetchCartData, fetchSessionData]
  );

  const { price: totalPrice, currency } = cartData?.priceObject || {
    price: 0,
  };

  const handleScreenSizeBasedRouting = useCallback(() => {
    if (totalPrice !== 0 && !isPayment && isMobile && cartData?.itemCount === 1) {
      redirectToMobilePaymentRoute({
        activeLocale,
        finalizeCheckoutInput,
        paymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
      })();
      return;
    }
    if (isPayment && !isMobile) {
      redirectToCartRoute({
        activeLocale,
        finalizeCheckoutInput,
        paymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
      })();
    }
  }, [
    activeLocale,
    cartData?.itemCount,
    finalizeCheckoutInput,
    isMobile,
    isPayment,
    queryParamPaymentProvider,
    totalPrice,
  ]);

  useEffect(() => {
    handleScreenSizeBasedRouting();
  }, [handleScreenSizeBasedRouting, isMobile, isPayment]);

  if (isOrderAuthorised) {
    return <DefaultPageLoading title={t("Your booking confirmation will appear soon...")} />;
  }

  if (
    !cartWithProvidersData ||
    cartWithProvidersError ||
    isCurrencyEmpty ||
    (!user && isSessionLoading) ||
    (totalPrice > 0 && cartData?.itemCount === 1 && !isPayment && isMobile)
  ) {
    return <DefaultPageLoading />;
  }
  const onMobileContinueClick =
    !isPayment && isMobile
      ? redirectToMobilePaymentRoute({
          activeLocale,
          finalizeCheckoutInput,
          paymentProvider: queryParamPaymentProvider as OrderPaymentProvider,
        })
      : undefined;

  const {
    cartWithPaymentProviders: {
      cart: {
        flights,
        cars,
        tours,
        stays,
        gteStays,
        toursAndTickets,
        customs,
        vacationPackages,
        customerInfo: defaultCustomerInfo,
      },
      paymentProviderSettings,
    },
    carProductBaseUrl,
    carSearchBaseUrl,
  } = cartWithProvidersData;
  const carSearchUrl = getCarSearchUrl(marketplace, activeLocale, carSearchBaseUrl);
  const carProductUrl = getCarProductUrl(marketplace, activeLocale, carProductBaseUrl);

  const vacationPackage = vacationPackages?.[0];
  const vacationPackageFlight = vacationPackage?.flights[0];
  const isVacationPackageAvailable = vacationPackage?.available ?? false;
  const shouldHideForm = isMobile && !isPayment;
  const adminGearLinks = [
    { url: "?isPassthrough=1", name: "Access old cart" },
    ...(isGTTP
      ? []
      : [
          {
            url: `?${CartQueryParam.PAYMENT_PROVIDER}=${OrderPaymentProvider.ADYEN}`,
            name: `Force ${OrderPaymentProvider.ADYEN}`,
          },
          {
            url: `?${CartQueryParam.PAYMENT_PROVIDER}=${OrderPaymentProvider.SALTPAY}`,
            name: `Force ${OrderPaymentProvider.SALTPAY}`,
          },
        ]),
  ];

  const numberOfProducs = flatten<unknown>([
    flights,
    cars,
    tours,
    stays,
    gteStays,
    toursAndTickets,
    customs,
    vacationPackages,
  ]).length;
  const moreThanOneProduct = numberOfProducs > 1;

  return (
    <OrderErrorBoundary componentName="cartContainer">
      <CartWrapperContainer>
        <CartContextStateProvider
          paymentError={finalizedCheckoutError}
          is3DSIframeDisabled={false}
          is3DSModalToggled
        >
          <NotificationContextProvider>
            <CartHeader shouldDisplayTrip={!isPayment && isMobile && moreThanOneProduct} />
            <CartContainerRow>
              <CartContainerColumn>
                <FlightProvider
                  queryAdults={vacationPackageFlight?.adults}
                  queryChildren={vacationPackageFlight?.children}
                  queryInfants={vacationPackageFlight?.infants}
                  dateOfDeparture={vacationPackage?.from as string}
                  defaultNationality={user?.countryCode}
                  passportRequired={Boolean(vacationPackageFlight?.documentNeed)}
                >
                  {vacationPackageFlight && isVacationPackageAvailable && !shouldHideForm && (
                    <CartVpTravellerDetailsForm />
                  )}
                  <PaymentForm
                    shouldHideForm={shouldHideForm}
                    total={totalPrice}
                    currency={currency || toUndefined(currencyCode)}
                    onMobileContinueClick={onMobileContinueClick}
                    onSuccesfullCheckout={onSuccesfullCheckout}
                    finalizedCheckoutError={finalizedCheckoutError}
                    isFinalizedCheckoutLoading={isFinalizedCheckoutLoading}
                    defaultCustomerInfo={defaultCustomerInfo}
                    setFinalizeCheckoutInput={setFinalizeCheckoutInput}
                    isCheckoutDisabled={cartWithProvidersLoading}
                    vpFlightBookingToken={vacationPackageFlight?.bookingToken}
                    paymentProviderSettings={paymentProviderSettings}
                    user={user}
                    queryParamPaymentProvider={queryParamPaymentProvider}
                    setUpdatedCustomerInfo={setUpdatedCustomerInfo}
                  />
                </FlightProvider>
                <CartStyledProductNotification id="cart-notifications" />
              </CartContainerColumn>

              {(!isMobile || !isPayment) && (
                <CartContainerColumn>
                  <OrderErrorBoundary componentName="productsInCart">
                    <ProductOverviewContainer
                      isLoadingCartProducts={cartWithProvidersLoading}
                      queryFlights={flights}
                      queryCars={cars}
                      queryTours={tours}
                      queryStays={stays}
                      queryGTEStays={gteStays}
                      queryToursAndTickets={toursAndTickets}
                      queryCustoms={customs}
                      queryVacationPackages={vacationPackages}
                      carProductBaseUrl={carProductUrl}
                      fetchUserData={onCartItemRemove}
                      carSearchBaseUrl={carSearchUrl}
                      fetchCartData={fetchCartData}
                    />
                  </OrderErrorBoundary>
                </CartContainerColumn>
              )}
            </CartContainerRow>
          </NotificationContextProvider>
        </CartContextStateProvider>
      </CartWrapperContainer>
      <AdminGearLoader
        links={adminGearLinks}
        hideCommonLinks
        customerInfo={updatedCustomerInfo ?? defaultCustomerInfo}
        refetchCartData={fetchCartData}
      />
    </OrderErrorBoundary>
  );
};

export default CartContainer;
