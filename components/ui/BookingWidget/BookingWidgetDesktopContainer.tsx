import React from "react";
import { Option } from "fp-ts/lib/Option";

import BookingWidgetFooter from "./BookingWidgetFooter/BookingWidgetFooter";
import BookingWidgetTopBanner from "./BookingWidgetHeader/BookingWidgetTopBanner";
import BookingWidgetDesktopWrapper from "./BookingWidgetDesktopWrapper";

const BookingWidgetDesktopContainer = ({
  children,
  footerText,
  className,
  error,
  price,
  discount,
  discountValue,
  isPriceLoading,
  isDiscountLoading,
  isFormLoading,
  isTotalPrice,
  currency,
  priceSubtext,
  fullPrice,
  onFooterButtonClick,
  footerPriceInfo,
  shouldFormatPrice,
  priceOnArrival,
  footerBelowContent,
  footerAdditionalHeight,
  showOverlay,
  isButtonDisabled = false,
  pricePlaceholder,
  flightLoading,
  priceDisplayValue,
}: {
  children: React.ReactNode;
  className?: string;
  footerText: string;
  error?: string;
  price?: number;
  discount: Option<number>;
  discountValue?: number;
  isPriceLoading: boolean;
  isDiscountLoading?: boolean;
  currency: string;
  isTotalPrice: boolean;
  isFormLoading: boolean;
  priceSubtext: string;
  fullPrice?: number;
  onFooterButtonClick?: () => void;
  shouldFormatPrice?: boolean;
  footerPriceInfo?: string | React.ReactNode;
  priceOnArrival?: number;
  footerBelowContent?: React.ReactNode;
  footerAdditionalHeight?: number;
  showOverlay?: boolean;
  isButtonDisabled?: boolean;
  pricePlaceholder?: string;
  flightLoading?: boolean;
  priceDisplayValue?: string;
}) => {
  return (
    <BookingWidgetDesktopWrapper
      className={className}
      footerAdditionalHeight={footerAdditionalHeight}
      showOverlay={showOverlay}
      footer={
        <BookingWidgetFooter
          error={error}
          price={price}
          discount={discount}
          discountValue={discountValue}
          isPriceLoading={isPriceLoading}
          isDiscountLoading={isDiscountLoading}
          currency={currency}
          isTotalPrice={isTotalPrice}
          isFormLoading={isFormLoading}
          buttonText={footerText}
          fullPrice={fullPrice}
          onButtonClick={onFooterButtonClick}
          footerPriceInfo={footerPriceInfo}
          shouldFormatPrice={shouldFormatPrice}
          priceOnArrival={priceOnArrival}
          footerBelowContent={footerBelowContent}
          footerAdditionalHeight={footerAdditionalHeight}
          priceSubtext={isButtonDisabled ? "" : priceSubtext}
          isDisabled={isButtonDisabled}
          pricePlaceholder={pricePlaceholder}
          flightLoading={flightLoading}
          priceDisplayValue={priceDisplayValue}
        />
      }
    >
      <>
        <BookingWidgetTopBanner hasSelectedDates={isTotalPrice} discount={discount} />
        {children}
      </>
    </BookingWidgetDesktopWrapper>
  );
};

export default BookingWidgetDesktopContainer;
