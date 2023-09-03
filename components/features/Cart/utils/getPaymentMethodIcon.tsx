import { ElementType } from "react";

import { PaymentMethodType } from "../types/cartEnums";

import ApplePayIcon from "components/icons/cart/applepay.svg";
import GooglePayIcon from "components/icons/cart/googlepay.svg";
import PayPalIcon from "components/icons/cart/paypal.svg";
import AliPayIcon from "components/icons/cart/alipay.svg";
import IdealIcon from "components/icons/cart/ideal.svg";
import SofortIcon from "components/icons/cart/sofort.svg";
import KlarnaIcon from "components/icons/cart/klarna.svg";
import WeChatIcon from "components/icons/cart/wechat.svg";
import CreditCartIcon from "components/icons/cart/credit-card.svg";
import PayMayaIcon from "components/icons/cart/maya.svg";

const getPaymentMethodIcon = (paymentMethodType: PaymentMethodType): ElementType => {
  let paymentIcon: ElementType;

  switch (paymentMethodType) {
    case PaymentMethodType.APPLE_PAY:
      paymentIcon = ApplePayIcon;
      break;
    case PaymentMethodType.GOOGLE_PAY:
      paymentIcon = GooglePayIcon;
      break;
    case PaymentMethodType.PAYPAL:
      paymentIcon = PayPalIcon;
      break;
    case PaymentMethodType.ALI_PAY:
    case PaymentMethodType.ALI_PAY_MOBILE:
      paymentIcon = AliPayIcon;
      break;
    case PaymentMethodType.IDEAL:
      paymentIcon = IdealIcon;
      break;
    case PaymentMethodType.SOFORT:
      paymentIcon = SofortIcon;
      break;
    case PaymentMethodType.KLARNA_PAY_NOW:
    case PaymentMethodType.KLARNA_PAY_LATER:
    case PaymentMethodType.KLARNA_PAY_OVER:
      paymentIcon = KlarnaIcon;
      break;
    case PaymentMethodType.WECHAT_PAY:
    case PaymentMethodType.WECHAT_QR:
      paymentIcon = WeChatIcon;
      break;
    case PaymentMethodType.MAYA_QR:
    case PaymentMethodType.MAYA_WALLET_SINGLE_PAYMENT:
      paymentIcon = PayMayaIcon;
      break;
    default:
      paymentIcon = CreditCartIcon;
  }

  return paymentIcon;
};

export default getPaymentMethodIcon;
