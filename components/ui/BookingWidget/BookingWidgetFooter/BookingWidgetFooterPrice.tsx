import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { gutters, blackColor, greyColor, fontSizeH5 } from "styles/variables";
import { typographyCaption, typographySubtitle1 } from "styles/typography";
import { skeletonPulse } from "styles/base";
import { Trans } from "i18n";
import { formatPrice } from "utils/currencyFormatUtils";

export type Props = {
  className?: string;
  price?: number;
  isPriceLoading: boolean;
  currency: string;
  isTotalPrice: boolean;
  shouldFormatPrice?: boolean;
  priceDisplayValue?: string;
};

type HiddenProps = {
  isHidden: boolean;
};

const PriceLoading = styled.div<HiddenProps>(({ isHidden }) => [
  skeletonPulse,
  css`
    display: ${isHidden ? "none" : "block"};
    width: 150px;
    height: 32px;
  `,
]);

export const Price = styled.span([
  typographySubtitle1,
  css`
    margin: 0 ${gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
    font-size: ${fontSizeH5};
  `,
]);

export const Currency = styled.span`
  color: ${rgba(greyColor, 0.7)};
  text-transform: uppercase;
`;

export const PriceWrapper = styled.div`
  display: flex;
  color: ${rgba(greyColor, 0.7)};
  line-height: 30px;
`;

const Wrapper = styled.div([
  typographyCaption,
  css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 50px;
  `,
]);

const PriceText = styled.div<HiddenProps>(
  ({ isHidden }) => `
    display: ${isHidden ? "none" : "block"};
  `
);

const BookingWidgetFooterPrice = memo(
  ({
    className,
    price,
    isPriceLoading,
    currency,
    isTotalPrice,
    shouldFormatPrice = true,
    priceDisplayValue,
  }: Props) => {
    const formattedPrice = priceDisplayValue || formatPrice(price, shouldFormatPrice);
    const showPrice = price !== undefined && price !== 0 && !isPriceLoading;
    return (
      <Wrapper className={className}>
        <PriceWrapper data-testid="footerPrice">
          <PriceLoading id="footerPriceLoading" isHidden={!isPriceLoading} />
          <PriceText isHidden={!showPrice} id="footerPriceText">
            {isTotalPrice ? (
              <Trans
                data-testid="footerPriceValue"
                i18nKey="Total {price}"
                defaults="Total <0>{price}</0>"
                components={[<Price data-testid="footerPriceValue">price</Price>]}
                values={{ price: formattedPrice }}
              />
            ) : (
              <Trans
                i18nKey="From {price}"
                defaults="From <0>{price}</0>"
                components={[<Price data-testid="footerPriceValue">price</Price>]}
                values={{ price: formattedPrice }}
              />
            )}
            <Currency>{currency}</Currency>
          </PriceText>
        </PriceWrapper>
      </Wrapper>
    );
  }
);

export default BookingWidgetFooterPrice;
