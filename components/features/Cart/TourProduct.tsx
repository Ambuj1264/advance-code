import React, { useCallback } from "react";
import { useTheme } from "emotion-theming";
import Router from "next/router";

import ProductFooter from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import {
  constructTourProductProps,
  constructTourQuickFactsCart,
  constructSingularTourType,
} from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import { getUnavailableTourClientRoute } from "components/ui/Order/utils/orderUtils";
import useDynamicUrl from "hooks/useDynamicUrl";
import { PageType } from "types/enums";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useActiveLocale from "hooks/useActiveLocale";

const TourProduct = ({
  tour,
  Icon,
  className,
  onRemoveClick,
  onInformationClick,
  isSellOut,
  isRemovingFromCart,
  isPriceLoading,
  isPaymentLink,
}: {
  tour: OrderTypes.Tour;
  Icon: React.ElementType<any>;
  className?: string;
  onRemoveClick?: () => void;
  onInformationClick?: () => void;
  isSellOut?: boolean;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink: boolean;
}) => {
  const theme: Theme = useTheme();
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: commonT } = useTranslation();
  const isMobile = useIsMobile();
  const quickFacts = constructTourQuickFactsCart(tour, useActiveLocale());
  const productPropsDesktop = constructTourProductProps(tour.valueProps);
  const productPropsMobile = productPropsDesktop.slice(0, 1);
  const tourSearchPageUrl = useDynamicUrl("tourSearchLegacy" as PageType);
  const tourUnavailable = !tour.available;

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

  const singularTourType = constructSingularTourType(tour.type);

  return (
    <CardContainer
      className={className}
      isExpiredOffer={tourUnavailable}
      data-testid="itemContainerTour"
      isRemovingAnotherItem={isRemovingFromCart}
    >
      <ProductCardActionHeader
        isExpiredOffer={tourUnavailable}
        title={tourUnavailable ? cartT("Unavailable") : orderT(singularTourType)}
        Icon={Icon}
        onInformationClick={onInformationClick}
        onEditClick={tour.editable && !isPaymentLink ? onEditClick : undefined}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverview
        title={tour.title}
        imageUrl={tour.imageUrl}
        clientRoute={!tourUnavailable ? tour.clientRoute : undefined}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        discountAmount={tour.discountAmount}
        priceDiscountAmountValue={tour.discountAmountPriceObject?.priceDisplayValue}
        priceDiscountAmountCurrency={tour.discountAmountPriceObject?.currency}
        discountPercentage={tour.discountPercentage}
        isSellOut={isSellOut}
      />
      <ProductFooter
        isPriceLoading={isPriceLoading}
        price={tour.totalPrice}
        priceDisplayValue={tour.priceObject?.priceDisplayValue}
        priceDisplayCurrency={tour.priceObject?.currency}
        isExpiredOffer={tourUnavailable}
        clientRoute={
          !tourUnavailable
            ? tour.clientRoute
            : getUnavailableTourClientRoute(tour, tourSearchPageUrl)
        }
        productProps={isMobile ? productPropsMobile : productPropsDesktop}
        priceSubtitle={commonT("Price for {numberOfTravelers} travelers", {
          numberOfTravelers: tour.numberOfTravelers,
        })}
        shouldHideLoadingPrice={isPaymentLink}
      />
    </CardContainer>
  );
};

export default TourProduct;
