import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";
import ArrowIcon from "@travelshift/ui/icons/arrow.svg";

import currencyFormatter, { roundPrice } from "utils/currencyFormatUtils";
import { typographyCaption } from "styles/typography";
import {
  gutters,
  fontWeightSemibold,
  blackColor,
  greyColor,
  fontWeightBold,
  separatorColorLight,
  whiteColor,
} from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div<{ showBreakdown: boolean }>(({ showBreakdown }) => [
  typographyCaption,
  css`
    border-top: 1px solid ${separatorColorLight};
    width: 100%;
    padding: ${showBreakdown ? gutters.small / 2 : 0}px ${gutters.large}px;
    background-color: ${whiteColor};
  `,
]);

const Title = styled.div<{ theme: Theme }>(
  ({ theme }) =>
    css`
      margin-bottom: 5px;
      cursor: pointer;
      color: ${theme.colors.primary};
      line-height: 30px;
    `
);

const BreakdownTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 24px;
`;

const BreakdownTitle = styled.div`
  color: ${rgba(blackColor, 0.7)};
  font-weight: ${fontWeightSemibold};
`;

const BreakdownContainer = styled.div`
  width: 100%;
`;

const BreakdownItem = styled.div`
  padding-bottom: ${gutters.small / 4}px;
  color: ${greyColor};
`;

const BreakdownItemPrice = styled.span`
  margin: 0 ${gutters.small / 4}px;
  color: ${rgba(blackColor, 0.7)};
  font-weight: ${fontWeightBold};
`;

const StyledArrowIcon = styled(ArrowIcon)<{
  isExpanded: boolean;
}>(
  ({ isExpanded, theme }) => css`
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 5px;
    width: 8px;
    height: 8px;
    transform: ${isExpanded ? "rotate(90deg)" : "rotate(-90deg)"};
    fill: ${theme.colors.primary};
  `
);

const CarBookingWidgetPriceBreakdown = ({
  payNowItems,
  payOnArrivalItems,
  currency,
  convertCurrency,
  shouldFormatPrice = true,
  setFooterAdditionalHeight = () => {},
}: {
  payNowItems: CarBookingWidgetTypes.PriceBreakdownItem[];
  payOnArrivalItems: CarBookingWidgetTypes.PriceBreakdownItem[];
  currency: string;
  convertCurrency: (value: number) => number;
  shouldFormatPrice?: boolean;
  setFooterAdditionalHeight?: (additionalHeight: number) => void;
}) => {
  const theme: Theme = useTheme();
  const breakdownRef = useRef<HTMLDivElement>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  useEffect(() => {
    if (breakdownRef && showBreakdown && payOnArrivalItems) {
      setFooterAdditionalHeight(breakdownRef?.current?.clientHeight ?? 24);
    } else {
      setFooterAdditionalHeight(24);
    }
  }, [setFooterAdditionalHeight, showBreakdown, payOnArrivalItems]);
  return (
    <Wrapper ref={breakdownRef} showBreakdown={showBreakdown}>
      {showBreakdown ? (
        <BreakdownContainer>
          <Title theme={theme} onClick={() => setShowBreakdown(false)}>
            <Trans ns={Namespaces.carBookingWidgetNs}>Price breakdown</Trans>
            <StyledArrowIcon isExpanded={showBreakdown} />
          </Title>
          <BreakdownTitleWrapper>
            <BreakdownTitle>
              <Trans ns={Namespaces.carBookingWidgetNs}>Pay now</Trans>
            </BreakdownTitle>
          </BreakdownTitleWrapper>
          {payNowItems.map(payNowItem => {
            const payNowTotalPrice = convertCurrency(payNowItem.totalPrice);
            return (
              <BreakdownItem>
                {payNowItem.name}
                <BreakdownItemPrice>
                  {shouldFormatPrice
                    ? currencyFormatter(payNowTotalPrice)
                    : roundPrice(payNowTotalPrice)}
                </BreakdownItemPrice>
                {currency}
              </BreakdownItem>
            );
          })}
          <BreakdownTitleWrapper>
            <BreakdownTitle>
              <Trans ns={Namespaces.carBookingWidgetNs}>Pay on location</Trans>
            </BreakdownTitle>
          </BreakdownTitleWrapper>
          {payOnArrivalItems.map(payOnArrivalItem => {
            const payOnArrivalPrice = convertCurrency(payOnArrivalItem.totalPrice);
            return (
              <BreakdownItem>
                {payOnArrivalItem.name}
                <BreakdownItemPrice>
                  {shouldFormatPrice
                    ? currencyFormatter(payOnArrivalPrice)
                    : roundPrice(payOnArrivalPrice)}
                </BreakdownItemPrice>
                {currency}
              </BreakdownItem>
            );
          })}
        </BreakdownContainer>
      ) : (
        <Title theme={theme} onClick={() => setShowBreakdown(true)}>
          <Trans ns={Namespaces.carBookingWidgetNs}>Price breakdown</Trans>
          <StyledArrowIcon isExpanded={showBreakdown} />
        </Title>
      )}
    </Wrapper>
  );
};

export default CarBookingWidgetPriceBreakdown;
