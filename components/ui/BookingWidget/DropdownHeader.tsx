import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Namespaces } from "shared/namespaces";
import currencyFormatter, { getPriceSign } from "utils/currencyFormatUtils";
import { Trans } from "i18n";
import { typographyBody2, typographyCaption } from "styles/typography";
import { blackColor, gutters, greyColor } from "styles/variables";
import { skeletonPulse } from "styles/base";

const Price = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.action};
  `
);

const DropdownHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${gutters.small}px;
`;

export const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const PriceWrapper = styled.div([
  typographyCaption,
  css`
    color: ${greyColor};
    line-height: 20px;
  `,
]);

const IncludedWrapper = styled(PriceWrapper)(
  ({ theme }) => css`
    color: ${theme.colors.action};
  `
);

export const OptionPriceSkeleton = styled.div([
  skeletonPulse,
  css`
    width: 60px;
    height: 15px;
  `,
]);

export const Header = styled.div([
  typographyBody2,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const DropdownHeader = ({
  title,
  price,
  isIncluded,
  isDefault,
  perPerson,
  currency,
  convertCurrency,
  isLivePricing,
  isGTIVpDefaultOptionsLoading,
  isGTIVpLivePriceLoading,
  isSelectedNonDefaultOption,
}: {
  title: string;
  price: number;
  isIncluded: boolean;
  isDefault?: boolean;
  perPerson: boolean;
  currency: string;
  convertCurrency: (value: number) => number;
  isLivePricing?: boolean;
  isGTIVpDefaultOptionsLoading?: boolean;
  isGTIVpLivePriceLoading?: boolean;
  isSelectedNonDefaultOption?: boolean;
}) => {
  const hasPrice = Boolean(price);
  const shouldShowPrice = isLivePricing ? false : hasPrice;
  const shouldShowSkeleton =
    isGTIVpDefaultOptionsLoading ||
    (isGTIVpLivePriceLoading && !isDefault && (!hasPrice || isSelectedNonDefaultOption));

  return (
    <DropdownHeaderWrapper>
      <Header>{title}</Header>
      {shouldShowSkeleton && <OptionPriceSkeleton />}
      {!shouldShowSkeleton && shouldShowPrice && (
        <PriceWrapper>
          <Trans
            ns={Namespaces.tourBookingWidgetNs}
            i18nKey="perPerson"
            values={{
              price: `${getPriceSign(price)}${currencyFormatter(
                convertCurrency(Math.abs(price))
              )} ${currency}`,
              perPerson,
            }}
            components={[<Price />]}
          />
        </PriceWrapper>
      )}
      {!shouldShowSkeleton && isIncluded && (
        <IncludedWrapper>
          <Trans>Included</Trans>
        </IncludedWrapper>
      )}
    </DropdownHeaderWrapper>
  );
};

export default DropdownHeader;
