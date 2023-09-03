import React from "react";
import { useTheme } from "emotion-theming";

import { getPaymentLinkTypeTitle } from "../PaymentLink/utils/paymentLinkUtils";

import ProductFooter from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import { constructCustomProductProps, constructCustomsQuickFactsCart } from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import useActiveLocale from "hooks/useActiveLocale";
import CheckList from "components/icons/checklist.svg";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";

const CustomProduct = ({
  customProduct,
  className,
  onRemoveClick,
  onEditClick,
  onInformationClick,
  isRemovingFromCart,
  isPriceLoading = false,
}: {
  customProduct: OrderTypes.QueryCustomsConstruct;
  className?: string;
  onRemoveClick?: () => void;
  onEditClick?: () => void;
  onInformationClick?: () => void;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
}) => {
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const quickFacts = constructCustomsQuickFactsCart(customProduct, activeLocale);
  const productProps = constructCustomProductProps(orderT);
  const { isPaymentLink } = customProduct;
  const isExpiredOffer = !customProduct.available;
  const expiredProductTitle = isPaymentLink ? orderT("Unavailable") : orderT("Sold out");
  const customProductTitle = customProduct.type
    ? getPaymentLinkTypeTitle(customProduct.type, orderT)
    : "";

  return (
    <CardContainer
      className={className}
      isExpiredOffer={isPaymentLink ? isExpiredOffer : false}
      data-testid="itemContainerCustom"
      isRemovingAnotherItem={isRemovingFromCart}
    >
      <ProductCardActionHeader
        isExpiredOffer={isExpiredOffer}
        title={isExpiredOffer ? expiredProductTitle : customProductTitle}
        Icon={CheckList}
        onInformationClick={onInformationClick}
        onEditClick={isPaymentLink ? undefined : onEditClick}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverview
        title={customProduct.title}
        imageUrl={customProduct.imageUrl}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        discountAmount={customProduct.discountAmount}
        priceDiscountAmountValue={customProduct.discountAmountPriceObject?.priceDisplayValue}
        priceDiscountAmountCurrency={customProduct.discountAmountPriceObject?.currency}
        discountPercentage={customProduct.discountPercentage}
      />
      <ProductFooter
        isExpiredOffer={isExpiredOffer}
        isPriceLoading={isPriceLoading}
        price={customProduct.totalPrice}
        priceDisplayValue={customProduct.priceObject?.priceDisplayValue}
        priceDisplayCurrency={customProduct.priceObject?.currency}
        productProps={productProps}
        shouldFormatPrice={!isPaymentLink}
        shouldShowOriginalPrice={isPaymentLink}
        canSearchAgain={!isPaymentLink}
        priceSubtitle={
          customProduct?.numberOfTravelers && customProduct.numberOfTravelers > 0
            ? commonT("Price for {numberOfTravelers} travelers", {
                numberOfTravelers: customProduct.numberOfTravelers,
              })
            : undefined
        }
        shouldHideLoadingPrice={isPaymentLink}
      />
    </CardContainer>
  );
};

export default CustomProduct;
