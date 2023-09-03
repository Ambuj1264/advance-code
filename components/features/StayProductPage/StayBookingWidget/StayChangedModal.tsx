import React from "react";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { roundPrice } from "utils/currencyFormatUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import ProductChangedModal from "components/ui/ProductChangedModal";

const StayChangedModal = ({
  isInvalid,
  searchUrl,
  price,
  onModalClose,
}: {
  isInvalid: boolean;
  searchUrl: string;
  price: number;
  onModalClose: () => void;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const title = isInvalid
    ? t("Sorry, the selected room/s just sold out!")
    : t("Sorry, the price has changed to {price} {currencyCode}", {
        price: roundPrice(convertCurrency(price)),
        currencyCode,
      });
  const description = isInvalid
    ? t("Hurry and search for more similar room/s now before they sell out too!")
    : t(
        "Hotels often change the prices as arrival time approaches. We recommend purchasing your rooms now to avoid another price increase"
      );
  return (
    <ProductChangedModal
      isInvalid={false}
      searchUrl={searchUrl}
      onModalClose={onModalClose}
      title={title}
      description={description}
    />
  );
};

export default StayChangedModal;
