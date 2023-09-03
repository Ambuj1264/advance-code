/* eslint-disable react/no-danger */
import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";

import { LoadingPrice } from "./sharedCartComponents";

import MaybeClientLink from "components/ui/MaybeClientLink";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { gutters, greyColor } from "styles/variables";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import Price from "components/ui/Search/Price";
import PricePayNow from "components/ui/Search/PricePayNow";
import ArrowCircle from "components/icons/arrow-circle.svg";
import { typographyCaption, typographyCaptionSmall, typographySubtitle2 } from "styles/typography";
import { Trans } from "i18n";
import { formatPriceAsInt } from "utils/currencyFormatUtils";
import ProductFeaturesList from "components/ui/Search/ProductFeaturesList";

const StyledMaybeClientLink = styled(MaybeClientLink)`
  width: 100%;
`;

export const FooterContainer = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    margin: 0 -${gutters.small}px -${gutters.small}px -${gutters.small}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);

export const CardFooter = styled.div<{ hasPriceSubtitle: boolean }>(
  ({ hasPriceSubtitle }) =>
    css`
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: flex-end;
      margin-top: ${gutters.large / 2}px;
      margin-bottom: ${gutters.large / 2}px;
      height: ${hasPriceSubtitle ? 40 : 28}px;
      padding: 0 ${gutters.small}px;
    `
);

export const ArrowCircleStyledGreen = styled(ArrowCircle)(
  ({ theme }) => css`
    margin-right: 3px;
    margin-left: ${gutters.small / 2}px;
    width: 20px;
    height: 20px;
    fill: ${theme.colors.action};
  `
);

export const PriceWrapper = styled.div<{
  alignRight?: boolean;
  hasPriceSubtitle?: boolean;
}>(
  ({ alignRight, hasPriceSubtitle = false }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: ${hasPriceSubtitle ? "center" : "flex-end"};
    margin-left: auto;
    text-align: ${alignRight ? " right" : "left"};
    white-space: nowrap;
  `
);

const PriceSubtitleWrapper = styled.div`
  ${typographyCaptionSmall};
  margin-top: -${gutters.small / 4}px;
  color: ${greyColor};
`;

export const StyledButton = styled(Button, { shouldForwardProp: () => true })([
  typographySubtitle2,
  css`
    margin-left: ${gutters.small}px;
    min-width: 144px;
    max-width: 200px;
  `,
]);

export const StyledSmallButton = styled(Button, {
  shouldForwardProp: () => true,
})([
  typographyCaption,
  css`
    margin-left: ${gutters.small}px;
    width: auto;
    min-width: 114px;
    max-width: 144px;
    font-weight: 600;
  `,
]);

const RelativePositionedWrapper = styled.div`
  position: relative;
`;

const StyledFooterColumn = styled.div<{ includesPrice?: boolean }>(({ includesPrice }) => [
  css`
    display: flex;
    flex-grow: 1;
    flex-shrink: ${includesPrice ? 0 : 1};
    flex-wrap: wrap;
    line-height: 42px;
    overflow: hidden;
  `,
  !includesPrice &&
    css`
      height: 20px;
    `,
]);

const ProductFooter = ({
  price,
  priceDisplayValue,
  priceDisplayCurrency,
  isPayNowPrice,
  className,
  clientRoute,
  productProps,
  isExpiredOffer,
  priceSubtitle,
  showLargeButton,
  isAction,
  useRegularlink,
  shouldFormatPrice = true,
  isCarProduct = false,
  shouldShowOriginalPrice,
  canSearchAgain = true,
  isPriceLoading = false,
  shouldHideLoadingPrice = false,
}: {
  price: number;
  priceDisplayValue?: string;
  priceDisplayCurrency?: string;
  isPayNowPrice?: boolean;
  className?: string;
  clientRoute?: SharedTypes.ClientRoute;
  productProps: SharedTypes.ProductProp[];
  showLargeButton?: boolean;
  isAction?: boolean;
  isExpiredOffer?: boolean;
  priceSubtitle?: ReactNode;
  useRegularlink?: boolean;
  shouldFormatPrice?: boolean;
  isCarProduct?: boolean;
  shouldShowOriginalPrice?: boolean;
  canSearchAgain?: boolean;
  isPriceLoading?: boolean;
  shouldHideLoadingPrice?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const priceValue = shouldShowOriginalPrice ? price : convertCurrency(price);
  const formattedPrice = isCarProduct
    ? formatPriceAsInt(priceValue, shouldFormatPrice)
    : priceValue;
  const theme: Theme = useTheme();

  return (
    <FooterContainer className={className}>
      <StyledMaybeClientLink
        clientRoute={clientRoute}
        useRegularLink={useRegularlink}
        target={useRegularlink ? "_blank" : undefined}
      >
        <CardFooter hasPriceSubtitle className={className}>
          {isAction &&
            (showLargeButton ? (
              <StyledButton color="action" theme={theme}>
                <Trans>Book</Trans>
              </StyledButton>
            ) : (
              <ArrowCircleStyledGreen theme={theme} />
            ))}
          {canSearchAgain && !isAction && isExpiredOffer && (
            <StyledSmallButton color="action" theme={theme} buttonSize={ButtonSize.Tiny}>
              <Trans>Search again</Trans>
            </StyledSmallButton>
          )}
          <StyledFooterColumn includesPrice>
            {!isPriceLoading && priceValue ? (
              <PriceWrapper alignRight={isPayNowPrice} hasPriceSubtitle>
                {isPayNowPrice ? (
                  <PricePayNow
                    value={formattedPrice}
                    displayValue={priceDisplayValue}
                    currency={priceDisplayCurrency || currencyCode}
                    isStrikeThroughPrice={isExpiredOffer}
                    shouldSkipPriceToInt={shouldShowOriginalPrice}
                  />
                ) : (
                  <Price
                    value={formattedPrice}
                    displayValue={priceDisplayValue}
                    currency={priceDisplayCurrency || currencyCode}
                    isTotalPrice
                    isStrikeThroughPrice={isExpiredOffer}
                    shouldFormatPrice={shouldFormatPrice}
                    shouldSkipIntConversion={shouldShowOriginalPrice}
                  />
                )}
                {priceSubtitle && (
                  <PriceSubtitleWrapper data-testid="priceSubtitle">
                    {priceSubtitle}
                  </PriceSubtitleWrapper>
                )}
              </PriceWrapper>
            ) : (
              !shouldHideLoadingPrice && <LoadingPrice />
            )}
          </StyledFooterColumn>
          <RelativePositionedWrapper>
            <StyledFooterColumn>
              {!isExpiredOffer && productProps.length > 0 && (
                <ProductFeaturesList
                  productProps={productProps.slice(0, 3)}
                  truncateTextTrigger={String(priceValue ?? "")}
                  isTileCard
                />
              )}
            </StyledFooterColumn>
          </RelativePositionedWrapper>
        </CardFooter>
      </StyledMaybeClientLink>
    </FooterContainer>
  );
};

export default ProductFooter;
