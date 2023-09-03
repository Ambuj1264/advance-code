import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import ArrowCircle from "components/icons/arrow-circle.svg";
import { gutters, borderRadius } from "styles/variables";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import Price, { Container } from "components/ui/Search/Price";
import { typographySubtitle1 } from "styles/typography";

const CardFooterWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${gutters.small / 2}px;
    border-radius: 0px 0px ${borderRadius} ${borderRadius};
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);

const CardFooter = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${gutters.small / 4}px;
  height: 24px;
  padding-right: ${gutters.small / 2}px;
  overflow: hidden;
`;

export const ArrowCircleStyledGreen = styled(ArrowCircle)(
  ({ theme }) => css`
    margin-left: ${gutters.small / 2}px;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.action};
  `
);

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  margin-left: auto;
  white-space: nowrap;
  ${Container} {
    ${typographySubtitle1}
  }
`;

const MapCardFooter = ({ price, displayValue }: { price: number; displayValue?: string }) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  return (
    <CardFooterWrapper>
      <CardFooter>
        <ArrowCircleStyledGreen />
        <PriceWrapper>
          <Price
            value={convertCurrency(price)}
            currency={currencyCode}
            displayValue={displayValue}
          />
        </PriceWrapper>
      </CardFooter>
    </CardFooterWrapper>
  );
};

export default MapCardFooter;
