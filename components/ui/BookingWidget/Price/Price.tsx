import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import PriceItem from "./PriceItem";

import InformationTooltip from "components/ui/Tooltip/InformationTooltip";
import { greyColor, gutters } from "styles/variables";
import { useTranslation } from "i18n";

export const PriceWrapper = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.action};
    text-align: right;
  `
);

const ExtraInfo = styled.div`
  margin-left: 2px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  color: ${greyColor};
`;

const InformationTooltipWrapper = styled.div`
  padding-right: ${gutters.small / 2}px;

  .infoButton {
    margin-left: 0;
    height: 100%;
  }
`;

const Price = ({
  price,
  priceDisplayValue,
  currency,
  extraInfo,
  extraInfoDescription,
  shouldFormatPrice,
  isTotal,
  skipConvertingCurrency = false,
  className,
}: {
  price: number;
  priceDisplayValue?: string;
  currency?: string;
  extraInfo?: string;
  extraInfoDescription?: string;
  shouldFormatPrice?: boolean;
  isTotal?: boolean;
  skipConvertingCurrency?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      {extraInfoDescription && (
        <InformationTooltipWrapper>
          <InformationTooltip information={extraInfoDescription} direction="right" />
        </InformationTooltipWrapper>
      )}
      <PriceWrapper className={className}>
        {price > 0 ? (
          <PriceItem
            price={price}
            shouldFormat={shouldFormatPrice}
            isTotal={isTotal}
            priceDisplayValue={priceDisplayValue}
            currency={currency}
            skipConvertingCurrency={skipConvertingCurrency}
          />
        ) : (
          t("Included")
        )}
      </PriceWrapper>
      {price > 0 && <ExtraInfo>{extraInfo && `/ ${extraInfo}`}</ExtraInfo>}
    </Wrapper>
  );
};

export default Price;
