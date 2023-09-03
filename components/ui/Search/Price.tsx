import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Trans } from "i18n";
import { typographyH5, typographyCaption } from "styles/typography";
import { blackColor, greyColor, gutters } from "styles/variables";
import { formatPrice, localizedPriceString } from "utils/currencyFormatUtils";

export const Wrapper = styled.div<{ isStrikeThroughPrice?: boolean }>(
  ({ isStrikeThroughPrice }) => [
    isStrikeThroughPrice &&
      css`
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          left: 0;
          margin-top: calc(0.125em / 2 * -1);
          border-bottom: 0.125em solid ${rgba(blackColor, 0.3)};
          line-height: 1em;
        }
      `,
    css`
      position: relative;
      height: 28px;
      color: ${greyColor};
      line-height: 28px;
      ${typographyCaption};
    `,
  ]
);

export const Container = styled.span([
  typographyH5,
  css`
    margin-right: ${gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
    line-height: 24px;
  `,
]);

export const Currency = styled.span`
  color: ${greyColor};
  text-transform: uppercase;
`;

const Price = ({
  className,
  value,
  displayValue,
  currency,
  isTotalPrice = false,
  shouldFormatPrice = true,
  isStrikeThroughPrice,
  shouldSkipIntConversion = false,
}: {
  className?: string;
  value: number;
  displayValue?: string;
  currency: string;
  isTotalPrice?: boolean;
  shouldFormatPrice?: boolean;
  isStrikeThroughPrice?: boolean;
  shouldSkipIntConversion?: boolean;
}) => {
  const formattedPrice = displayValue || formatPrice(value, shouldFormatPrice);

  const formattedPriceWithoutCeil = displayValue || localizedPriceString({ price: value });

  return (
    <Wrapper className={className} isStrikeThroughPrice={isStrikeThroughPrice}>
      {isTotalPrice ? (
        <Trans
          i18nKey="Total {price}"
          defaults="Total <0>{price}</0>"
          components={[<Container data-testid="productPrice">Total price</Container>]}
          values={{
            price: shouldSkipIntConversion ? formattedPriceWithoutCeil : formattedPrice,
          }}
        />
      ) : (
        <Trans
          i18nKey="From {price}"
          defaults="From <0>{price}</0>"
          components={[<Container data-testid="productPrice">From price</Container>]}
          values={{
            price: shouldSkipIntConversion ? formattedPriceWithoutCeil : formattedPrice,
          }}
        />
      )}
      <Currency data-testid="productCurrency">{currency}</Currency>
    </Wrapper>
  );
};

export default Price;
