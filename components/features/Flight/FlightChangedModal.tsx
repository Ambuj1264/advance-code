import React from "react";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { roundPrice } from "utils/currencyFormatUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import ProductChangedModal from "components/ui/ProductChangedModal";

const FlightChangedModal = ({
  isInvalid,
  flightSearchUrl,
  price,
  onModalClose,
}: {
  isInvalid: boolean;
  flightSearchUrl: string;
  price: number;
  onModalClose: () => void;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const title = isInvalid
    ? t("Sorry, this flight just sold out!")
    : t("Sorry, the price has changed to {price} {currencyCode}", {
        price: roundPrice(convertCurrency(price)),
        currencyCode,
      });
  const description = isInvalid
    ? t("Hurry and search for more similar flights now before they sell out too!")
    : t(
        "Carriers often change the prices as departure time approach. We reccommend purchasing your ticket now to avoid another price increase"
      );
  return (
    <ProductChangedModal
      isInvalid={isInvalid}
      searchUrl={flightSearchUrl}
      onModalClose={onModalClose}
      title={title}
      description={description}
    />
  );
};

export default FlightChangedModal;
