import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { PaymentMethodName, PaymentMethodType } from "./types/cartEnums";
import { LoadingPrice } from "./sharedCartComponents";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import Button from "components/ui/Inputs/Button";
import { Namespaces } from "shared/namespaces";
import { ButtonSize } from "types/enums";
import { useTranslation } from "i18n";
import { mqMin } from "styles/base";
import { typographySubtitle1, typographyH4, typographyCaption } from "styles/typography";
import { fontSizeCaption, fontSizeCaptionSmall, greyColor, gutters } from "styles/variables";
import Price, { Container } from "components/ui/Search/Price";

const MobileStickyFooter = CustomNextDynamic(
  () => import("components/ui/StickyFooter/MobileStickyFooter"),
  {
    loading: () => null,
  }
);

const ButtonWrapper = styled.div`
  width: unset;
  ${mqMin.large} {
    margin-top: ${gutters.small / 2}px;
    width: 290px;
  }
`;

const Wrapper = styled.div([
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${gutters.large}px;
    width: 100%;
    button {
      ${typographySubtitle1};
    }
  `,
]);

const StyledPrice = styled(Price)`
  ${Container} {
    ${typographyH4};
    line-height: 24px;
  }
`;

const StyledLoadingPrice = styled(LoadingPrice)(
  () => css`
    margin-left: 0;
  `
);

const PaymentMethodFee = styled.div`
  ${typographyCaption};
  margin-top: -${gutters.small / 4}px;
  color: ${greyColor};
  font-size: ${fontSizeCaptionSmall};

  ${mqMin.large} {
    margin-top: 0;
    font-size: ${fontSizeCaption};
    line-height: 24px;
  }
`;

const PaymentFormFooter = ({
  totalAmount,
  currency,
  onMobileContinueClick,
  onSubmit,
  loading,
  isPaymentStep,
  skipPriceToInt,
  activePaymentMethod,
  percentageOfTotal,
}: {
  totalAmount: number;
  currency: string;
  onMobileContinueClick?: () => void;
  onSubmit: () => void;
  loading: boolean;
  isPaymentStep: boolean;
  skipPriceToInt?: boolean;
  activePaymentMethod: CartTypes.PaymentMethod;
  percentageOfTotal?: number;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.cartNs);
  const isMobile = useIsMobile();
  const onClick = onMobileContinueClick || onSubmit;
  const isPaymentButtonDisabled = totalAmount <= 0 || loading;
  const { paymentFeePercentage = 0, name, type, priceObject } = activePaymentMethod;
  const isPaymentFeePresent = paymentFeePercentage > 0;

  const totalAmountWithPaymentFee = priceObject?.price || totalAmount;

  // TODO - worth improving when we combine payment methods into the cart loading.

  // when we switch between currencies - the payment method switch is done a bit afterwards, at another component's level.
  // this leads to the price flickering case when we have received a new "total", "currency" but still receiving
  // an old "activePaymentMethod".
  // so we have to check currencies to ensure the payment method setup has been completed.
  const isActivePaymentMethodLoading = Boolean(
    priceObject?.price ? activePaymentMethod.priceObject?.currency !== currency : false
  );

  const paymentMethodFeeText = isPaymentFeePresent
    ? t("Including a {paymentFeePercentage}% {paymentMethodName} fee", {
        paymentFeePercentage,
        paymentMethodName:
          type === PaymentMethodType.SAVED_CARD || type === PaymentMethodType.MAYA_CREDIT_CARD
            ? PaymentMethodName.CREDIT_CARD
            : name,
      })
    : undefined;

  const percentageOfPaymentLinkTotal =
    percentageOfTotal && parseInt(percentageOfTotal.toString(), 10) !== 100
      ? t("Equals {percentageOfTotal}% of the full price", {
          percentageOfTotal,
        })
      : undefined;

  return isMobile ? (
    <MobileStickyFooter
      data-testid="paymentFormFooter"
      leftContent={
        <>
          {loading || isActivePaymentMethodLoading ? (
            <StyledLoadingPrice />
          ) : (
            <Price
              value={totalAmountWithPaymentFee}
              displayValue={priceObject?.priceDisplayValue}
              currency={priceObject?.currency || currency}
              isTotalPrice
              shouldSkipIntConversion={skipPriceToInt}
            />
          )}
          {percentageOfPaymentLinkTotal && (
            <PaymentMethodFee>{percentageOfPaymentLinkTotal}</PaymentMethodFee>
          )}
          {paymentMethodFeeText ? (
            <PaymentMethodFee>{paymentMethodFeeText}</PaymentMethodFee>
          ) : null}
        </>
      }
      rightContent={
        <ButtonWrapper>
          <Button
            color="action"
            theme={theme}
            loading={loading || isActivePaymentMethodLoading}
            onClick={onClick}
            disabled={isPaymentButtonDisabled}
            id="paymentFormButton"
          >
            {isPaymentStep ? t("Reserve Instantly") : t("Continue")}
          </Button>
        </ButtonWrapper>
      }
    />
  ) : (
    <Wrapper data-testid="paymentFormFooter">
      {isActivePaymentMethodLoading ? (
        <StyledLoadingPrice />
      ) : (
        <StyledPrice
          value={totalAmountWithPaymentFee}
          displayValue={priceObject?.priceDisplayValue}
          currency={priceObject?.currency || currency}
          isTotalPrice
          shouldSkipIntConversion={skipPriceToInt}
        />
      )}
      {percentageOfPaymentLinkTotal && (
        <PaymentMethodFee>{percentageOfPaymentLinkTotal}</PaymentMethodFee>
      )}
      {paymentMethodFeeText ? <PaymentMethodFee>{paymentMethodFeeText}</PaymentMethodFee> : null}
      <ButtonWrapper>
        <Button
          color="action"
          buttonSize={ButtonSize.Medium}
          theme={theme}
          loading={loading || isActivePaymentMethodLoading}
          onClick={onClick}
          disabled={isPaymentButtonDisabled}
          id="paymentFormButton"
        >
          {t("Reserve Instantly")}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default PaymentFormFooter;
