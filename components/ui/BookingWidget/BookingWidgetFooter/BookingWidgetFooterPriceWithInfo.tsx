import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import BookingWidgetFooterPrice, {
  Props as BookingWidgetFooterPriceProps,
  PriceWrapper,
} from "./BookingWidgetFooterPrice";

import { typographyCaption } from "styles/typography";
import { greyColor, gutters } from "styles/variables";

const Wrapper = styled.div<{ hasDiscount: boolean }>(
  ({ hasDiscount }) =>
    css`
      display: flex;
      flex-direction: column;
      padding-top: ${hasDiscount ? gutters.large / 4 : 0}px;
    `
);

export const FooterInfoText = styled.p([
  typographyCaption,
  css`
    color: ${rgba(greyColor, 0.7)};
  `,
]);

const StyledBookingWidgetFooterPrice = styled(BookingWidgetFooterPrice)([
  css`
    height: auto;

    ${PriceWrapper} {
      line-height: ${gutters.small}px;
    }
  `,
]);

const BookingWidgetFooterPriceWithInfo = memo(
  ({
    info,
    hasDiscount = false,
    shouldFormatPrice,
    isPriceLoading,
    pricePlaceholder,
    ...restProps
  }: BookingWidgetFooterPriceProps & {
    info: string | React.ReactNode;
    hasDiscount?: boolean;
    shouldFormatPrice?: boolean;
    isPriceLoading?: boolean;
    pricePlaceholder?: string;
  }) => {
    return (
      <Wrapper hasDiscount={hasDiscount}>
        <StyledBookingWidgetFooterPrice
          {...restProps}
          isPriceLoading={isPriceLoading}
          shouldFormatPrice={shouldFormatPrice}
        />
        <FooterInfoText>
          {isPriceLoading && pricePlaceholder ? pricePlaceholder : info}
        </FooterInfoText>
      </Wrapper>
    );
  }
);

export default BookingWidgetFooterPriceWithInfo;
