import React, { useCallback } from "react";
import { useTheme } from "emotion-theming";
import Router from "next/router";

import ProductFooter from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import {
  constructExpiredGTETourSearchLink,
  constructGTETourProductProps,
  constructGTETourQuickFactsCart,
} from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import ExpiryTimer from "components/ui/ExpiryTimer";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const GTETourProduct = ({
  tour,
  Icon,
  className,
  onRemoveClick,
  onInformationClick,
  isSellOut,
  onExpired,
  isExpiredOffer,
  expiredTimeDifference,
  isRemovingFromCart,
  isPriceLoading = false,
  isPaymentLink,
}: {
  tour: OrderTypes.GTETour;
  Icon: React.ElementType<any>;
  className?: string;
  onRemoveClick?: () => void;
  onInformationClick?: () => void;
  isSellOut?: boolean;
  onExpired: () => void;
  isExpiredOffer: boolean;
  expiredTimeDifference?: number;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink: boolean;
}) => {
  const theme: Theme = useTheme();
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: commonT } = useTranslation();
  const isMobile = useIsMobile();
  const quickFacts = constructGTETourQuickFactsCart(tour);
  const productPropsDesktop = constructGTETourProductProps(tour.valueProps, cartT);
  const productPropsMobile = productPropsDesktop.slice(0, 1);
  const expiredClientRoute = constructExpiredGTETourSearchLink(isExpiredOffer, tour);

  const onEditClick = useCallback(() => {
    // eslint-disable-next-line functional/immutable-data
    Router.push(
      {
        pathname: tour.clientRoute.route,
        query: tour.clientRoute.query,
      },
      tour.editLinkUrl,
      { shallow: true }
    );
  }, [tour.clientRoute.query, tour.clientRoute.route, tour.editLinkUrl]);

  return (
    <CardContainer
      className={className}
      isExpiredOffer={isExpiredOffer}
      data-testid="itemContainerTour"
      isRemovingAnotherItem={isRemovingFromCart}
    >
      <ProductCardActionHeader
        isExpiredOffer={isExpiredOffer}
        title={isExpiredOffer ? cartT("Unavailable") : tour.type ?? orderT("Tours & tickets")}
        Icon={Icon}
        onInformationClick={onInformationClick}
        onEditClick={tour.editable && !isPaymentLink ? onEditClick : undefined}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverview
        title={tour.title}
        imageUrl={tour.imageUrl}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        discountAmount={tour.discountAmount}
        priceDiscountAmountValue={tour.discountAmountPriceObject?.priceDisplayValue}
        priceDiscountAmountCurrency={tour.discountAmountPriceObject?.currency}
        discountPercentage={tour.discountPercentage}
        isSellOut={isSellOut}
        expiryTimer={
          expiredTimeDifference && (
            <ExpiryTimer
              numberOfSecondsUntilExpiry={expiredTimeDifference}
              onExpired={onExpired}
              isExpired={isExpiredOffer}
            />
          )
        }
      />
      <ProductFooter
        clientRoute={expiredClientRoute}
        isPriceLoading={isPriceLoading}
        price={tour.totalPrice}
        priceDisplayValue={tour.priceObject?.priceDisplayValue}
        priceDisplayCurrency={tour.priceObject?.currency}
        isExpiredOffer={isExpiredOffer}
        productProps={isMobile ? productPropsMobile : productPropsDesktop}
        priceSubtitle={commonT("Price for {numberOfTravelers} travelers", {
          numberOfTravelers: tour.numberOfTravelers,
        })}
        shouldHideLoadingPrice={isPaymentLink}
      />
    </CardContainer>
  );
};

export default GTETourProduct;
