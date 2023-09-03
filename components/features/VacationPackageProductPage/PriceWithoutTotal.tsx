import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useTranslation } from "i18n";
import currencyFormatter, { getPriceSign } from "utils/currencyFormatUtils";
import { Currency, Wrapper } from "components/ui/Search/Price";
import { gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Namespaces } from "shared/namespaces";

export const StyledPriceWrapper = styled(Wrapper)([
  typographySubtitle2,
  css`
    line-height: 28px;
  `,
]);

export const Container = styled.span`
  margin-right: ${gutters.small / 4}px;
`;

const PriceWithoutTotal = ({
  className,
  value,
  isPricePerDay = false,
}: {
  className?: string;
  value: number;
  isPricePerDay?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const priceWithCurrency = convertCurrency(Math.abs(value));
  const formattedPrice = currencyFormatter(priceWithCurrency);
  const sign = getPriceSign(value);
  return (
    <StyledPriceWrapper className={className}>
      {sign.length > 0 && <span>{sign}</span>}
      <Container data-testid="productPrice">{t("{price}", { price: formattedPrice })}</Container>
      <Currency>{currencyCode}</Currency>
      {isPricePerDay && <span>&nbsp;{t("per day")}</span>}
    </StyledPriceWrapper>
  );
};

export default PriceWithoutTotal;
