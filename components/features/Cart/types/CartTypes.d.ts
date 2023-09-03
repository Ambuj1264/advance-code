declare namespace CartTypes {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { MutationFunctionOptions } from "@apollo/react-common";
  import { ExecutionResult } from "graphql";
  import { PaypalElement } from "@adyen/adyen-web/dist/types/components/PayPal/Paypal";
  import { ApplePayElement } from "@adyen/adyen-web/dist/types/components/ApplePay/ApplePay";
  import { GooglePayElement } from "@adyen/adyen-web/dist/types/components/GooglePay/GooglePay";
  import { IdealElement } from "@adyen/adyen-web/dist/types/components/Ideal/index";

  import {
    CardType,
    PaymentMethodType,
    OrderPaymentProvider,
    OrderPaymentEnvironment,
    PaymentMethodOrderType,
    OrderResultCode,
  } from "./cartEnums";

  // NB: Below is a replica of the interface found in @adyen/adyen-web/dist/types/types as we cannot unionize a type and interface together.
  // Doing so was causing the the resulting types to be cast as <any>
  export type AdyenPaymentMethod = {
    /**
     * The unique payment method code.
     */
    type: string;
    /**
     * The displayable name of this payment method.
     */
    name: string;
    /**
     * All input details to be provided to complete the payment with this payment method.
     */
    details?: object;
    /**
     * Configuration props as set by the merchant in the CA and received in the PM object in the /paymentMethods response
     */
    configuration?: object;
    /**
     * Brand for the selected gift card. For example: plastix, hmclub.
     */
    brand?: string;
    /**
     * List of possible brands. For example: visa, mc.
     */
    brands?: string[];
    /**
     * The funding source of the payment method.
     */
    fundingSource?: string;
    /**
     * The group where this payment method belongs to.
     */
    group?: PaymentMethodGroup;
  };

  /**
   * The group where this payment method belongs to.
   */
  export type AdyenPaymentMethodGroup = {
    /**
     * The name of the group.
     */
    name: string;
    /**
     * Echo data to be used if the payment method is displayed as part of this group.
     */
    paymentMethodData: string;
    /**
     * The unique code of the group.
     */
  };

  export type AdyenStoredPaymentMethod = AdyenPaymentMethod & {
    /**
     * The supported shopper interactions for this stored payment method.
     */
    supportedShopperInteractions: string[];
    /**
     * A unique identifier of this stored payment method.
     */
    storedPaymentMethodId?: string;
  };

  export type CartData = {
    flights: OrderTypes.QueryFlightItineraryCart[];
    cars: OrderTypes.QueryCarRental[];
    tours: OrderTypes.QueryTour[];
    stays: OrderTypes.QueryStay[];
    gteStays: OrderTypes.QueryGTEStay[];
    vacationPackages: OrderTypes.QueryVacationPackageProduct[];
    toursAndTickets: OrderTypes.QueryGTETour[];
    customs: OrderTypes.QueryCustomProduct[];
    itemCount: number;
    totalPrice: number;
    priceObject: SharedTypes.PriceObject;
    totalOnArrival: number;
    customerInfo?: OrderTypes.CustomerInfo;
  };

  export type QueryPaymentProviderConfig = {
    provider: OrderPaymentProvider;
    clientKey: string;
    merchantAccount: string;
    environment: OrderPaymentEnvironment;
    suggestedCurrency: string;
    enableSaveCard: boolean;
    clientPublicKey?: string | null;
    clientLibraryLocation?: string | null;
    additionalProviderSettings?: QueryPaymentProviderConfig[];
  };

  export type QuerySaltPaySavedCard = {
    id: number;
    cardType: CardType;
    pan: string;
    expYear: string;
    expMonth: string;
    currencyCode: string;
    created: string;
    isUsersPrimaryCard?: boolean;
    firstName?: string;
    lastName?: string;
    businessId?: string;
    businessName?: string;
    businessAddress?: string;
    providers?: OrderPaymentProvider;
  };

  export type PaymentMethodValues = {
    adyenAmount?: number;
    adyenCurrency?: import("types/enums").SupportedCurrencies;
    totalAmount?: number;
    totalCurrency?: import("types/enums").SupportedCurrencies;
    paymentFeePercentage?: number;
    paymentType?: PaymentMethodOrderType;
    priceObject?: SharedTypes.PriceObject;
  };

  // The adyen-web package (v5.17.0) had outdated types, missing some used in the API v69
  export type AdjustedAdyenPaymentMethod = SharedTypes.Override<
    AdyenPaymentMethod,
    {
      type: PaymentMethodType;
      configuration?: PaymentMethodConfiguration[];
      details?: PaymentMethodDetails[];
      brand?: CardType;
      brands?: CardTypes[];
    }
  > &
    PaymentMethodValues & {
      id?: string;
      issuers?: PaymentMethodDetailsIssuer[];
    };

  export type PaymentMethodDetailsIssuer = {
    disabled: boolean;
    id: string;
    name: string;
  };

  export type PaymentMethodDetails = {
    items: PaymentMethodDetailsIssuer[];
    key: string;
    type: string;
  };

  export type PaymentMethodConfiguration = {
    key: string;
    value: string;
  };

  export type AdditionalDataPaymentMethodType = Exclude<
    PaymentMethodType,
    | import("./cartEnums").PaymentMethodType.CREDIT_CARD
    | import("./cartEnums").PaymentMethodType.SAVED_CARD
    | import("./cartEnums").PaymentMethodType.MAYA_CREDIT_CARD
    | import("./cartEnums").PaymentMethodType.MAYA_QR
    | import("./cartEnums").PaymentMethodType.MAYA_WALLET_SINGLE_PAYMENT
  >;

  export type PaymentMethod = PaymentMethodValues & {
    id: string;
    type: PaymentMethodType;
    name: string;
    provider: OrderPaymentProvider;
    configuration?: PaymentMethodConfiguration[];
    details?: PaymentMethodDetails[];
    issuers?: PaymentMethodDetailsIssuer[];
    brands?: CardType[];
    // Only for saved cards.
    cardType?: CardType;
    index?: number;
    pan?: string;
    expMonth?: string;
    expYear?: string;
    firstName?: string;
    lastName?: string;
    businessId?: string;
    businessName?: string;
    businessAddress?: string;
    isUsersPrimaryCard?: boolean;
  };

  export type QueryPaymentMethods = {
    paymentMethodsForCart: {
      travelshiftPaymentMethods: AdyenPaymentMethods;
      savedCards: CartTypes.QuerySaltPaySavedCard[];
    };
  };

  export type QueryPaymentProviderSettings = {
    preferredPaymentProvider: OrderPaymentProvider;
    paymentProviders: QueryPaymentProviderConfig[];
    serverTime: string;
  };

  export type SavedPaymentProviderSettings = {
    paymentProviderSettings: QueryPaymentProviderSettings;
  };

  export type QueryCart = {
    carProductBaseUrl: string;
    carSearchBaseUrl: string;
    cart: CartData;
  };

  export type QueryCartWithProviders = {
    carProductBaseUrl: string;
    carSearchBaseUrl: string;
    cartWithPaymentProviders: {
      cart: CartData;
      paymentProviderSettings: QueryPaymentProviderSettings;
    };
  };

  export type FinalizeCheckoutInput = string | undefined | OrderPaymentProvider;

  export type CheckoutBookedProducts = {
    cartItemId: string;
    revenue: number;
    currency: string;
  };

  export type CustomerInfoInput = {
    name: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    businessId?: string;
    companyName?: string;
    companyAddress?: string;
    termsAgreed: boolean;
    vpFlightData?: VacationPackageTypes.VpFlightAddToCartData;
  };

  export type CommonCustomerInfoInput = Omit<
    OrderTypes.CustomerInfo,
    "termsAgreed" | "vpFlightData"
  >;

  type BrowserInfo = {
    acceptHeader: string;
    colorDepth: number;
    language: string;
    javaEnabled: boolean;
    screenHeight: number;
    screenWidth: number;
    userAgent: string;
    timeZoneOffset: number;
  };

  export type CommonCheckoutParams = {
    currency: string;
    returnUrl: string;
    customerInfo: CommonCustomerInfoInput;
    termsAgreed: boolean;
    flights?: CartTypes.MutationAddVpFlightToCartInput[];
    browserInfo?: BrowserInfo;
    ipCountryCode?: string;
  };

  export type AdyenCSECardDetails = {
    number: string;
    cvc?: string;
    expiryMonth?: string;
    expiryYear?: string;
    generationtime?: string;
  };

  type CardToSave = {
    cardToken: string;
    currency: string;
    paymentProvider: OrderPaymentProvider;
  };

  export type CheckoutParams = {
    currency: string;
    returnUrl: string;
    customerInfo: CommonCustomerInfoInput;
    termsAgreed: boolean;
    flights?: CartTypes.MutationAddVpFlightToCartInput[];
    saveCard?: boolean;
    cardToSave?: CardToSave[];
    // Adyen
    paymentMethod?: Pick<AdyenStoredPaymentMethod, "storedPaymentMethodId" | "type">;
    browserInfo?: BrowserInfo;
    // SaltPay
    tokenizedCard?: string;
    cvc?: string;
    paymentProvider: OrderPaymentProvider;
    // PayMaya
    paymentType?: PaymentMethodOrderType;
  };

  export type SaveCardParams = {
    isUsersPrimaryCard?: boolean;
    firstName?: string;
    lastName?: string;
    businessId?: string;
    businessName?: string;
    businessAddress?: string;
    cardTokensToSave?: CardToSave & { securityCode?: string };
  };

  export type CheckoutWithSaveCardParams = {
    checkoutParams?: CheckoutParams;
    saveCardParams?: SaveCardParams;
  };

  export type CheckoutQuery = {
    resultCode: OrderResultCode;
    success: boolean;
    jsonAction?: string;
    paymentProvider: OrderPaymentProvider;
    refusalReason?: string;
    bookedProducts?: CheckoutBookedProducts[];
    forgotPasswordUrl?: string;
    userCreated?: boolean;
    voucherId?: string;
  } | null;

  export type CheckoutMutation = (
    options?:
      | MutationFunctionOptions<{ checkout: CartTypes.CheckoutQuery }, CartTypes.CheckoutParams>
      | undefined
  ) => Promise<ExecutionResult<{ checkout: CartTypes.CheckoutQuery }>>;

  type AddVpFlightToCartPassenger = Omit<FlightTypes.AddFlightToCartPassenger, "baggage">;

  type MutationAddVpFlightToCartInput = Omit<
    FlightTypes.MutationAddFlightToCartInput,
    "passengers"
  > & {
    passengers: AddVpFlightToCartPassenger[];
  };

  type SaltPayTokenData = {
    Token: string;
    PAN: string;
    ExpYear: string;
    ExpMonth: string;
    Enabled: boolean;
    Used: boolean;
    ValidUntil: string;
  };

  type SaltPayForm3dsData = { Name: string; Value: string }[];

  type AdyenForm3dsData = {
    type: string;
    data: {
      [key: string]: string;
    };
    method: string;
    paymentData: string;
    paymentMethodType: string;
    url: string;
  };

  type NormalizedForm3dsData = {
    inputs: { name: string; value: string }[];
    action: string;
  };

  type SaltPayCardDetails = {
    pan: string;
    expYear?: string;
    expMonth?: string;
  };

  type CardInformation = {
    pan: string;
    expYear?: string;
    expMonth?: string;
    cvc?: string;
  };

  // Adyen has wrong types for stored payment methods.
  type StoredAdyenCards = {
    id: string;
    expiryMonth: string;
    expiryYear: string;
    lastFour: string;
    holderName?: string;
  } & AdyenStoredPaymentMethod;

  type AdyenPaymentMethods = {
    paymentMethods: AdjustedAdyenPaymentMethod[];
    storedPaymentMethods?: StoredAdyenCards[];
  };

  type ThreeDSIframeMessageEventData = {
    finalizeCheckoutInput: FinalizeCheckoutInput;
    isFinalizeCheckoutInputLoaded: boolean;
  };

  type AdyenComponent = {
    mount: (selector: string) => void;
    submit: () => void;
  };

  type AdyenRefType = {
    [PaymentMethodType.PAYPAL]?: PaypalElement;
    [PaymentMethodType.APPLE_PAY]?: ApplePayElement;
    [PaymentMethodType.GOOGLE_PAY]?: GooglePayElement;
    [PaymentMethodType.ALI_PAY]?: AdyenComponent;
    [PaymentMethodType.ALI_PAY_MOBILE]?: AdyenComponent;
    [PaymentMethodType.IDEAL]?: IdealElement;
    [PaymentMethodType.SOFORT]?: AdyenComponent;
    [PaymentMethodType.KLARNA_PAY_OVER]?: AdyenComponent;
    [PaymentMethodType.KLARNA_PAY_NOW]?: AdyenComponent;
    [PaymentMethodType.KLARNA_PAY_LATER]?: AdyenComponent;
    [PaymentMethodType.WECHAT_PAY]?: AdyenComponent;
    [PaymentMethodType.WECHAT_QR]?: AdyenComponent;
  };

  type PaymentLinkPayer = CartTypes.ReservationPaymentLink & {
    id: number;
    isInvalid: boolean;
    customlyAddedPercentage?: string;
  };

  type ReservationPaymentLink = {
    email: string;
    customerName: string;
    percentageOfTotal: number;
    expireDate?: SharedTypes.iso8601DateTime;
  };

  type CreateReservationParams = {
    input: {
      customerInfo: CommonCustomerInfoInput;
      paymentLinks: ReservationPaymentLink[];
      mainExpirationDate: SharedTypes.iso8601DateTime;
    };
  };

  type SaveCartParams = {
    input: {
      cartId: string;
    };
  };

  type SaveCartResponse = {
    saveCart: {
      linkId: string;
      success: boolean;
    };
  };

  type CreateCartByLinkParams = {
    input: {
      linkId: string;
    };
  };

  type CreateCartByLinkResponse = {
    saveCart: {
      linkId: string;
      message: string;
      success: boolean;
    };
  };

  type ConnectCartToPackageParams = {
    input: {
      packageId: string;
    };
  };

  type ChosenPackageDetailsInfo = {
    label?: string;
    value?: string;
  };

  type ChosenPackageDetails = {
    id: number;
    cancelled?: boolean;
    reservation?: boolean;
    urlAdminBooking: string;
    bookingNumber: string;
    customerName: string;
    customerEmail: string;
    tourName: string;
    duration: string;
    pickupTime: string;
    departureTime: string;
    dropoff: string;
    tourOperator: string;
    operatorPhoneNumber: string;
    operatorEmailAddress: string;
    pickupLocationObject: ChosenPackageDetailsInfo;
    pickupInformationObject: ChosenPackageDetailsInfo;
  };

  type ChosenPackageDetailsSection = {
    order: number;
    title: string;
    value: string;
    url?: string;
  };

  type AdyenCSECartType = {
    objname: string;
    cardtype: CardType;
  };

  type AdyenCSELibrary = {
    cardTypes: {
      [key: number]: AdyenCSECartType;
      size: number;
      determine: (cardNumber: string) => AdyenCSECartType;
    };
    encrypt: {
      createEncryption: (
        clientPublicKey: string,
        options: { enableValidations?: boolean }
      ) => {
        validate: (data: AdyenCSECardDetails) => {
          valid: boolean;
          number: boolean;
          luhn: boolean;
          year: boolean;
          expiryYear: boolean;
          unknown: string[];
        };
        encrypt: (data: AdyenCSECardDetails) => string;
      };
    };
  };

  type AdyenApiLookupBrands = {
    brand: CardType;
    cvcPolicy: string;
    enableLuhnCheck: boolean;
    expiryDatePolicy: string;
    localeBrand: string;
    showSocialSecurityNumber: boolean;
    supported: boolean;
  };

  type SaltPayLibrary = {
    setPublicToken: (clientKey?: string) => void;
    getToken: (
      cardDetails: CartTypes.SaltPayCardDetails,
      callback: (status: number, data: CartTypes.SaltPayTokenData) => {}
    ) => void;
  };

  type PayMayaTokenizeData = {
    createdAt?: SharedTypes.iso8601DateTime;
    issuer?: string;
    paymentTokenId?: string;
    state?: string;
    updatedAt?: SharedTypes.iso8601DateTime;
  };

  type PayMayaTokenizeDataError = {
    code?: string;
    error?: string;
    reference?: string;
    message?: string;
    parameters?: { description?: string; field?: string }[];
  };

  type PayMayaError = {
    errorMessage: string;
    paymentTokenURL: string;
    networkError?: {
      name: string;
      message: string;
      stack?: string;
    };
  } & PayMayaTokenizeDataError;
}
