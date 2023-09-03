import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import { Option, isSome } from "fp-ts/lib/Option";

import BookingWidgetFooterPriceWithInfo from "./BookingWidgetFooterPriceWithInfo";
import useBookingWidgetDiscount from "./hooks/useBookingWidgetDiscount";

import BookingWidgetFooterBanner from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooterBanner";
import { container, singleLineTruncation, skeletonPulse } from "styles/base";
import { ButtonSize } from "types/enums";
import { whiteColor, boxShadowTop, gutters, zIndex } from "styles/variables";
import Button from "components/ui/Inputs/Button";
import Tooltip from "components/ui/Tooltip/Tooltip";

const Wrapper = styled.div(
  container,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: ${boxShadowTop};
    height: 80px;
    padding: ${gutters.small / 2}px;
    background-color: ${whiteColor};
  `
);

const ButtonWrapper = styled.div`
  margin-left: auto;
  min-width: 50%;
  /* stylelint-disable-next-line selector-max-type */
  button {
    ${singleLineTruncation}
  }
`;

export const Container = styled.div<{ additinalHeight: number }>(
  ({ additinalHeight }) =>
    css`
      position: absolute;
      bottom: 0;
      z-index: ${zIndex.z2};
      width: 100%;
      min-height: ${80 + additinalHeight}px;
    `
);

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
`;

export const DiscountSkeleton = styled.div([
  skeletonPulse,
  css`
    width: 75px;
    height: 11px;
  `,
]);

const BookingWidgetFooter = ({
  error,
  price,
  discount,
  discountValue,
  isPriceLoading,
  isDiscountLoading,
  currency,
  isTotalPrice,
  isFormLoading,
  buttonText,
  priceSubtext,
  fullPrice,
  onButtonClick,
  footerPriceInfo,
  shouldFormatPrice = true,
  priceOnArrival,
  footerBelowContent,
  footerAdditionalHeight = 0,
  isDisabled = false,
  pricePlaceholder,
  flightLoading,
  priceDisplayValue,
}: {
  error?: string;
  price?: number;
  discount: Option<number>;
  discountValue?: number;
  isPriceLoading: boolean;
  isDiscountLoading?: boolean;
  currency: string;
  isTotalPrice: boolean;
  isFormLoading: boolean;
  buttonText: string;
  priceSubtext: string;
  fullPrice?: number;
  onButtonClick?: () => void;
  shouldFormatPrice?: boolean;
  footerPriceInfo?: string | React.ReactNode;
  priceOnArrival?: number;
  footerBelowContent?: React.ReactNode;
  footerAdditionalHeight?: number;
  isDisabled?: boolean;
  pricePlaceholder?: string;
  flightLoading?: boolean;
  priceDisplayValue?: string;
}) => {
  const theme: Theme = useTheme();
  const isLoading = isFormLoading || isPriceLoading || flightLoading;

  const footerContent = () => {
    return (
      <>
        {footerPriceInfo ? (
          <BookingWidgetFooterPriceWithInfo
            price={
              priceOnArrival && priceOnArrival > 0 && price !== undefined
                ? price + priceOnArrival
                : price
            }
            isPriceLoading={isPriceLoading || price === undefined}
            currency={currency}
            isTotalPrice={isTotalPrice}
            info={footerPriceInfo}
            hasDiscount={isSome(discount)}
            shouldFormatPrice={shouldFormatPrice}
            pricePlaceholder={pricePlaceholder}
            priceDisplayValue={priceDisplayValue}
          />
        ) : (
          <BookingWidgetFooterPriceWithInfo
            price={price}
            isPriceLoading={isPriceLoading || price === undefined}
            currency={currency}
            isTotalPrice={isTotalPrice}
            shouldFormatPrice={shouldFormatPrice}
            info={priceSubtext}
            pricePlaceholder={pricePlaceholder}
            priceDisplayValue={priceDisplayValue}
          />
        )}
        <ButtonWrapper>
          <Button
            color="action"
            buttonSize={ButtonSize.Medium}
            theme={theme}
            disabled={isDisabled || isLoading}
            type={onButtonClick ? "button" : "submit"}
            loading={isLoading}
            onClick={() => {
              if (!error) {
                onButtonClick?.();
              }
            }}
            testId="continueBookButton"
          >
            {buttonText}
          </Button>
        </ButtonWrapper>
      </>
    );
  };

  const { hasDiscount, DiscountLabel } = useBookingWidgetDiscount({
    price,
    fullPrice,
    discount,
    discountValue,
    shouldFormatPrice,
    currency,
  });

  return (
    <Container additinalHeight={footerAdditionalHeight}>
      <Wrapper>
        {error ? (
          <Tooltip title={error} fullWidth>
            <TooltipContent>{footerContent()}</TooltipContent>
          </Tooltip>
        ) : (
          footerContent()
        )}
      </Wrapper>
      {hasDiscount && (
        <BookingWidgetFooterBanner
          bannerContent={isDiscountLoading ? <DiscountSkeleton /> : <DiscountLabel />}
        />
      )}
      {footerBelowContent}
    </Container>
  );
};

export default memo(BookingWidgetFooter);
