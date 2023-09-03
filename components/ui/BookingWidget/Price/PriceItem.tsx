import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { greyColor } from "styles/variables";
import currencyFormatter, { roundPrice } from "utils/currencyFormatUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Trans } from "i18n";

const PriceWrapper = styled.span`
  color: ${greyColor};
  font-weight: 400;
`;

export const Price = styled.span(
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
      font-weight: 600;
    `
);

const PriceItem = ({
  price,
  shouldFormat = true,
  isTotal = true,
  priceDisplayValue,
  currency,
  skipConvertingCurrency = false,
}: {
  price: number;
  shouldFormat?: boolean;
  isTotal?: boolean;
  priceDisplayValue?: string;
  currency?: string;
  skipConvertingCurrency?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const formattedPrice = shouldFormat
    ? currencyFormatter(convertCurrency(price))
    : roundPrice(convertCurrency(price));
  const priceToShow = skipConvertingCurrency ? currencyFormatter(price) : formattedPrice;
  const priceString = `${priceDisplayValue || priceToShow} ${currency || currencyCode}`;
  if (isTotal) {
    return <span>+{priceString}</span>;
  }
  return (
    <PriceWrapper>
      <Trans
        i18nKey="From {price}"
        defaults="From <0>{price}</0>"
        components={[<Price>price</Price>]}
        values={{ price: priceString }}
      />
    </PriceWrapper>
  );
};

export default PriceItem;
