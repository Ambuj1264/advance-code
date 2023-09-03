import React from "react";

import { Container, Currency, Wrapper } from "./Price";

import { Trans } from "i18n";
import currencyFormatter, { localizedPriceString } from "utils/currencyFormatUtils";
import { Namespaces } from "shared/namespaces";

const PricePayNow = ({
  className,
  value,
  displayValue,
  currency,
  isStrikeThroughPrice,
  shouldSkipPriceToInt,
}: {
  className?: string;
  value: number;
  displayValue?: string;
  currency: string;
  isStrikeThroughPrice?: boolean;
  shouldSkipPriceToInt?: boolean;
}) => {
  const formattedPrice =
    displayValue ||
    (shouldSkipPriceToInt ? localizedPriceString({ price: value }) : currencyFormatter(value));
  return (
    <Wrapper className={className} isStrikeThroughPrice={isStrikeThroughPrice}>
      <Trans
        ns={Namespaces.carBookingWidgetNs}
        i18nKey="Pay now {price}"
        defaults="Pay now <0>{price}</0>"
        components={[<Container data-testid="productPrice">price</Container>]}
        values={{
          price: formattedPrice,
        }}
      />
      <Currency>{currency}</Currency>
    </Wrapper>
  );
};

export default PricePayNow;
