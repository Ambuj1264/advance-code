import React from "react";
import styled from "@emotion/styled";

import { fontWeightBold, fontSizeMiddleCaption, greyColor } from "styles/variables";
import BookingWidgetFooterPriceWithInfo, {
  FooterInfoText,
} from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPriceWithInfo";
import {
  Price,
  Currency,
  PriceWrapper,
} from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterPrice";

const FooterPriceWithInfoWrapper = styled.div`
  ${FooterInfoText} {
    font-size: ${fontSizeMiddleCaption};
    line-height: ${fontSizeMiddleCaption};
  }
`;

const StyledBookingWidgetFooterPriceWithInfo = styled(BookingWidgetFooterPriceWithInfo)`
  ${Price} {
    font-size: 18px;
    font-weight: ${fontWeightBold};
  }

  ${Currency} {
    color: ${greyColor};
  }

  ${PriceWrapper} {
    color: ${greyColor};
  }
`;

const VPBookingWidgetFooterPriceWithInfo = ({
  price,
  currency,
  isPriceLoading,
  isTotalPrice,
  info,
}: {
  price: number;
  currency: string;
  isPriceLoading: boolean;
  isTotalPrice: boolean;
  info: string;
}) => {
  return (
    <FooterPriceWithInfoWrapper>
      <StyledBookingWidgetFooterPriceWithInfo
        price={price}
        currency={currency}
        isPriceLoading={isPriceLoading}
        isTotalPrice={isTotalPrice}
        info={info}
      />
    </FooterPriceWithInfoWrapper>
  );
};

export default VPBookingWidgetFooterPriceWithInfo;
