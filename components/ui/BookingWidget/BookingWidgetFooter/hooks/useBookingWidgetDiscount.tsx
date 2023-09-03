import React from "react";
import { Option, isSome } from "fp-ts/lib/Option";

import currencyFormatter from "utils/currencyFormatUtils";
import { Trans } from "i18n";
import { useCurrencyWithDefault } from "hooks/useCurrency";

// TODO: use this in others components
const useBookingWidgetDiscount = ({
  price,
  fullPrice,
  discount,
  discountValue,
  shouldFormatPrice = true,
  currency,
}: {
  price?: number;
  fullPrice?: number;
  discount: Option<number>;
  discountValue?: number; // only for GTI vp live pricing
  shouldFormatPrice?: boolean;
  currency: string;
}) => {
  const { convertCurrency } = useCurrencyWithDefault();
  const hasPrice = fullPrice !== undefined && price !== undefined && fullPrice > 0;
  const hasDiscount = discountValue !== undefined ? Boolean(discountValue) : isSome(discount);
  const normalizedDiscountValue =
    discountValue && discountValue > 0 ? convertCurrency(discountValue) : undefined;
  const amountToSave = normalizedDiscountValue || (hasPrice ? fullPrice - price : undefined);

  return {
    hasDiscount,
    DiscountLabel: () => (
      <Trans
        values={{
          amountToSave: shouldFormatPrice ? currencyFormatter(amountToSave) : amountToSave,
          currency,
        }}
        i18nKey="Save {amountToSave}"
        defaults="Save <0>{amountToSave}</0> {currency}"
        components={[<>amountToSave</>]}
      />
    ),
  };
};

export default useBookingWidgetDiscount;
