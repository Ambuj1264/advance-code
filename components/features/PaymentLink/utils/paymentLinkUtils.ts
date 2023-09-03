import { isBefore } from "date-fns";

import { OrderPayByLinkType } from "components/features/Cart/types/cartEnums";
import { removeHTMLCharactersFromText } from "utils/helperUtils";

export const isPaymentLinkActive = ({
  expiresAt,
  serverTime,
}: {
  expiresAt?: SharedTypes.iso8601DateTime;
  serverTime?: string;
}) => {
  const maybeServerTime = serverTime ? new Date(serverTime) : new Date();
  return expiresAt ? isBefore(maybeServerTime, new Date(expiresAt as string)) : true;
};

export const constructPaymentLinkCart = ({
  cancelled,
  paid,
  customs,
  currency,
  expiresAt,
  type,
  isActivePayment,
}: {
  cancelled?: boolean;
  paid?: boolean;
  customs: OrderTypes.QueryCustomProduct[];
  currency?: string;
  expiresAt?: SharedTypes.iso8601DateTime;
  type: OrderPayByLinkType;
  isActivePayment: boolean;
}): OrderTypes.QueryCustomProduct[] =>
  customs.map(custom => ({
    ...custom,
    description: custom.description?.length
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        removeHTMLCharactersFromText(custom.description)!
      : custom.description,
    currency: currency ?? custom.currency,
    available: custom.available && !cancelled && !paid && isActivePayment,
    expiresAt,
    type,
    imageUrl: custom.imageUrl || "https://media.graphassets.com/ZjA24uyDRwC9KewVgxIv",
  }));

export const getPaymentLinkTypeTitle = (type: OrderPayByLinkType, t: TFunction) => {
  switch (type) {
    case OrderPayByLinkType.INVOICE:
      return t("Invoice");
    case OrderPayByLinkType.RESERVATION_LINK:
      return t("Reservation");
    default:
      return type;
  }
};
