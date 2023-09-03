/* eslint-disable react/no-danger */
import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";

import Button from "../Inputs/Button";

import ProductFeaturesList from "./ProductFeaturesList";

import { gutters, greyColor } from "styles/variables";
import Price from "components/ui/Search/Price";
import ArrowCircle from "components/icons/arrow-circle.svg";
import { singleLineTruncation, skeletonPulse } from "styles/base";
import { typographyCaptionSmall, typographySubtitle2 } from "styles/typography";
import { ButtonSize } from "types/enums";
import { Trans } from "i18n";

export const CardFooterWrapper = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${gutters.small / 4}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);

export const CardFooter = styled.div<{ hasPriceSubtitle: boolean }>(
  ({ hasPriceSubtitle }) =>
    css`
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      margin-top: ${gutters.small / 2}px;
      margin-bottom: ${gutters.small / 2}px;
      height: ${hasPriceSubtitle ? 40 : 28}px;
      padding: 0 ${gutters.small / 2}px 0 ${gutters.small}px;
    `
);

const StyledFooterColumn = styled.div<{ includesPrice?: boolean }>(({ includesPrice }) => [
  css`
    display: flex;
    flex-grow: 1;
    flex-shrink: ${includesPrice ? 0 : 1};
    align-items: center;
  `,
  !includesPrice &&
    css`
      overflow: hidden;
    `,
]);

export const ArrowCircleStyledGreen = styled(ArrowCircle)<{}>(
  ({ theme }) => css`
    margin-right: 3px;
    margin-left: ${gutters.small / 2}px;
    width: 20px;
    height: 20px;
    fill: ${theme.colors.action};
  `
);

export const LoadingPrice = styled.span([
  skeletonPulse,
  css`
    margin-left: auto;
    width: 40%;
    height: 26px;
  `,
]);

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  margin-left: auto;
  white-space: nowrap;
`;

const PriceSubtitleWrapper = styled.div`
  ${typographyCaptionSmall};
  margin-top: -${gutters.large / 4}px;
  color: ${greyColor};
`;

const StyledButton = styled(Button, { shouldForwardProp: () => true })([
  typographySubtitle2,
  css`
    margin-left: ${gutters.small}px;
    min-width: 144px;
    max-width: 200px;
  `,
]);

const StyledProductFeaturesList = styled(ProductFeaturesList)([
  singleLineTruncation,
  `
    max-width: 160px;
    margin-right: ${gutters.small / 4}px;
  `,
]);

const TileProductCardFooter = ({
  price,
  priceDisplayValue,
  currency,
  productProps,
  priceSubtitle,
  isTotalPrice,
  shouldFormatPrice,
  showLargeButton,
  className,
  isAction = true,
  isStrikeThroughPrice,
  isPriceLoading,
}: {
  price?: number;
  priceDisplayValue?: string;
  currency: string;
  productProps: SharedTypes.ProductProp[];
  priceSubtitle?: ReactNode;
  isTotalPrice?: boolean;
  shouldFormatPrice?: boolean;
  showLargeButton?: boolean;
  className?: string;
  isAction?: boolean;
  isStrikeThroughPrice?: boolean;
  isPriceLoading?: boolean;
}) => {
  const theme: Theme = useTheme();
  return (
    <CardFooterWrapper>
      <CardFooter
        hasPriceSubtitle={Boolean(priceSubtitle)}
        className={className}
        data-testid="cardFooter"
      >
        <StyledFooterColumn>
          {productProps.length > 0 && (
            <StyledProductFeaturesList
              productProps={productProps}
              isTileCard
              truncateTextTrigger={String(price ?? "")}
            />
          )}
        </StyledFooterColumn>
        <StyledFooterColumn includesPrice>
          {price && !isPriceLoading ? (
            <PriceWrapper>
              <Price
                displayValue={priceDisplayValue}
                value={price}
                currency={currency}
                isTotalPrice={isTotalPrice}
                shouldFormatPrice={shouldFormatPrice}
                isStrikeThroughPrice={isStrikeThroughPrice}
              />
              {priceSubtitle && <PriceSubtitleWrapper>{priceSubtitle}</PriceSubtitleWrapper>}
            </PriceWrapper>
          ) : (
            <LoadingPrice />
          )}
          {isAction &&
            (showLargeButton ? (
              <StyledButton color="action" theme={theme} buttonSize={ButtonSize.Small}>
                {!isStrikeThroughPrice ? <Trans>Book</Trans> : <Trans>Search again</Trans>}
              </StyledButton>
            ) : (
              <ArrowCircleStyledGreen />
            ))}
        </StyledFooterColumn>
      </CardFooter>
    </CardFooterWrapper>
  );
};

export default TileProductCardFooter;
