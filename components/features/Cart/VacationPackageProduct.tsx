import React from "react";
import { useTheme } from "emotion-theming";

import ProductFooter from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import {
  constructExpiredVPSearchLink,
  constructVacationPackageProps,
  constructVacationPackageQuickFactsCart,
} from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import ExpiryTimer from "components/ui/ExpiryTimer";
import useActiveLocale from "hooks/useActiveLocale";
import RouteIcon from "components/icons/tour-route.svg";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";

const VacationPackageProduct = ({
  vacationPackageProduct,
  className,
  onRemoveClick,
  onEditClick,
  onInformationClick,
  onExpired,
  isExpiredOffer,
  expiredTimeDifference,
  isRemovingFromCart,
  isPriceLoading = false,
  isPaymentLink,
}: {
  vacationPackageProduct: OrderTypes.QueryVacationPackageConstruct;
  className?: string;
  onRemoveClick?: () => void;
  onEditClick?: () => void;
  onExpired: () => void;
  onInformationClick: () => void;
  isExpiredOffer: boolean;
  expiredTimeDifference?: number;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink: boolean;
}) => {
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: commonT } = useTranslation();
  const quickFacts = constructVacationPackageQuickFactsCart(vacationPackageProduct, activeLocale);
  const productProps = constructVacationPackageProps(orderT);
  const expiredClientRoute = constructExpiredVPSearchLink(isExpiredOffer, vacationPackageProduct);
  const { children, adults, infants } = vacationPackageProduct;

  return (
    <CardContainer
      className={className}
      isExpiredOffer={isExpiredOffer}
      isRemovingAnotherItem={isRemovingFromCart}
      data-testid="itemContainerVacationPackage"
    >
      <ProductCardActionHeader
        isExpiredOffer={isExpiredOffer}
        title={isExpiredOffer ? orderT("Offer expired") : orderT("Vacation package")}
        Icon={RouteIcon}
        onInformationClick={onInformationClick}
        onEditClick={isPaymentLink ? undefined : onEditClick}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverview
        title={vacationPackageProduct.title}
        imageUrl={vacationPackageProduct.imageUrl}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        discountAmount={vacationPackageProduct.discountAmount}
        priceDiscountAmountValue={
          vacationPackageProduct.discountAmountPriceObject?.priceDisplayValue
        }
        priceDiscountAmountCurrency={vacationPackageProduct.discountAmountPriceObject?.currency}
        discountPercentage={vacationPackageProduct.discountPercentage}
        expiryTimer={
          expiredTimeDifference && (
            <ExpiryTimer
              numberOfSecondsUntilExpiry={expiredTimeDifference}
              onExpired={onExpired}
              isExpired={isExpiredOffer}
              shouldDisplayHours
            />
          )
        }
      />
      <ProductFooter
        isExpiredOffer={isExpiredOffer}
        isPriceLoading={isPriceLoading}
        price={vacationPackageProduct.totalPrice}
        priceDisplayValue={vacationPackageProduct.priceObject?.priceDisplayValue}
        priceDisplayCurrency={vacationPackageProduct.priceObject?.currency}
        productProps={productProps}
        clientRoute={expiredClientRoute}
        priceSubtitle={commonT("Price for {numberOfTravelers} travelers", {
          numberOfTravelers: children + adults + infants,
        })}
        shouldHideLoadingPrice={isPaymentLink}
      />
    </CardContainer>
  );
};

export default VacationPackageProduct;
