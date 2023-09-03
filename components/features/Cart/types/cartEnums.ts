export enum OrderResultCode {
  AUTHORISED = "AUTHORISED",
  REDIRECT = "REDIRECT",
  PENDING = "PENDING",
  REFUSED = "REFUSED",
  CANCELLED = "CANCELLED",
  ERROR = "ERROR",
}

export enum PaymentMethodType {
  CREDIT_CARD = "scheme",
  SAVED_CARD = "storedCard",
  APPLE_PAY = "applepay",
  GOOGLE_PAY = "paywithgoogle",
  ALI_PAY = "alipay",
  ALI_PAY_MOBILE = "alipay_wap",
  PAYPAL = "paypal",
  IDEAL = "ideal",
  SOFORT = "directEbanking",
  KLARNA_PAY_NOW = "klarna_paynow",
  KLARNA_PAY_OVER = "klarna_account",
  KLARNA_PAY_LATER = "klarna",
  WECHAT_PAY = "wechatpayWeb",
  WECHAT_QR = "wechatpayQR",
  // MAYA ONLY
  MAYA_CREDIT_CARD = "CARD",
  MAYA_QR = "DYNAMICQRPAYMENT",
  MAYA_WALLET_SINGLE_PAYMENT = "WALLETSINGLEPAYMENT",
}

export enum PaymentMethodOrderType {
  MAYA_CREDIT_CARD = "CARD",
  MAYA_QR = "DYNAMIC_QR_PAYMENT",
  MAYA_WALLET_SINGLE_PAYMENT = "WALLET_SINGLE_PAYMENT",
  UNKNOWN = "UNKNOWN",
}

export enum PaymentMethodName {
  SOFORT = "Sofort",
  KLARNA = "Klarna",
  CREDIT_CARD = "Credit Card",
  // MAYA ONLY
  MAYA_CREDIT_CARD = "Card",
  MAYA_QR = "DynamicQrPayment",
  MAYA_WALLET_SINGLE_PAYMENT = "WalletSinglePayment",
}

export enum CardType {
  VISA = "visa",
  MASTERCARD = "mc",
  AMEX = "amex",
  MAESTRO = "maestro",
  UNIONPAY = "cup",
  CARTE_BANCAIRE = "cartebancaire",
  UNKNOWN = "unknown",
  // GTTP only
  JCB = "jcb",
}

export enum OrderPaymentProvider {
  ADYEN = "ADYEN",
  SALTPAY = "SALTPAY",
  PAYMAYA = "PAYMAYA",
}

export enum OrderPaymentEnvironment {
  LIVE = "live",
  TEST = "test",
  // PayMaya
  DEVELOPMENT = "Development",
  PRODUCTION = "Production",
}

export enum SaltPayEnvironment {
  LIVE = "ecommerce",
  TEST = "test",
}

export enum AdyenGooglePayEnvironment {
  LIVE = "PRODUCTION",
  TEST = "TEST",
}

export enum FinalizeCheckoutAdyenParams {
  PaRes = "PaRes",
  MD = "MD",
}

export enum FinalizeCheckoutSaltPayParams {
  cres = "cres",
  pares = "pares",
}

// Payment Link Only
export enum OrderPayByLinkType {
  INVOICE = "INVOICE",
  RESERVATION_LINK = "RESERVATION_LINK",
}

export enum GraphCMSMarketplaces {
  GUIDE_TO_EUROPE = "GUIDE_TO_EUROPE",
  GUIDE_TO_THE_PHILIPPINES = "GUIDE_TO_THE_PHILIPPINES",
  GUIDE_TO_ICELAND = "GUIDE_TO_ICELAND",
  ICELAND_PHOTO_TOURS = "ICELAND_PHOTO_TOURS",
  NORWAY_TRAVEL_GUIDE = "NORWAY_TRAVEL_GUIDE",
}

export enum BroadcastChannelCartActions {
  REFETCH_CART_DATA = "refetch-cart-data",
}
