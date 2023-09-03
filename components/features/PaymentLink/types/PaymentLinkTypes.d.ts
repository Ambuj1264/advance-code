declare namespace PaymentLinkTypes {
  import { OrderPayByLinkType } from "../../Cart/types/cartEnums.ts";

  type PayByLinkData = {
    payByLinkId?: string;
    type: OrderPayByLinkType;
    amount: number;
    currency?: string;
    expiresAt: SharedTypes.iso8601DateTime;
    paid: boolean;
    cancelled: boolean;
    percentageOfTotal: number;
    cart: CartTypes.CartData;
  };

  export type PayForPaymentLinkParams = {
    input: Omit<CartTypes.CheckoutParams, "customerInfo" | "cardToSave" | "flights"> & {
      payByLinkId: string;
      saveCardParams?: CartTypes.SaveCardParams;
    };
  };

  export type QueryPaymentLinkWithProviders = {
    payByLinkWithPaymentProviders: {
      payByLink: PayByLinkData;
      paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
    };
  };

  export type PayForPaymentLinkQuery = Pick<
    CartTypes.CheckoutQuery,
    "resultCode" | "jsonAction" | "paymentProvider" | "refusalReason" | "success"
  >;

  export type PayForPaymentLinkMutation = (
    options?:
      | MutationFunctionOptions<{ checkout: PayForPaymentLinkQuery }, PayForPaymentLinkParams>
      | undefined
  ) => Promise<ExecutionResult<{ checkout: PayForPaymentLinkQuery }>>;

  export type PaymentLinkVoucher = {
    payByLinkVoucher: {
      payByLinkType?: OrderPayByLinkType;
      payerInfo?: OrderTypes.CustomerInfo;
    } & (VoucherTypes.GTEVoucherData | VoucherTypes.VoucherData);
  };
}
