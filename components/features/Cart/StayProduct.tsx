import React from "react";
import { useTheme } from "emotion-theming";
import { differenceInDays } from "date-fns";

import ProductFooter from "./ProductFooter";
import ProductOverview from "./CartProductOverview";
import { constructStayProductProps, constructStaysQuickFactsCart } from "./utils/cartUtils";
import { CardContainer } from "./sharedCartComponents";

import { useSettings } from "contexts/SettingsContext";
import useDynamicUrl from "hooks/useDynamicUrl";
import { PageType, Marketplace } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import HotelIcon from "components/icons/house-heart.svg";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import {
  getUnavailableStayClientRoute,
  isGTEStayConstructType,
} from "components/ui/Order/utils/orderUtils";

const StayProduct = ({
  stay,
  className,
  onRemoveClick,
  onEditClick,
  onInformationClick,
  isSellOut,
  isRemovingFromCart,
  isPriceLoading = false,
  isPaymentLink,
}: {
  stay: OrderTypes.QueryStayConstruct | OrderTypes.QueryGTEStayConstruct;
  className?: string;
  onRemoveClick?: () => void;
  onEditClick?: () => void;
  onInformationClick?: () => void;
  isSellOut?: boolean;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink: boolean;
}) => {
  const { marketplace } = useSettings();
  const theme: Theme = useTheme();
  const activeLocale = useActiveLocale();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const isMobile = useIsMobile();
  const accommodationSearchPageUrl = useDynamicUrl("accommodation" as PageType);
  const staySearchPageUrl = useDynamicUrl("gteStaysSearch" as PageType);
  const searchPageUrl =
    marketplace === Marketplace.GUIDE_TO_EUROPE ? staySearchPageUrl : accommodationSearchPageUrl;
  const quickFacts = constructStaysQuickFactsCart(stay, activeLocale);
  const productPropsDesktop = constructStayProductProps(
    orderT,
    isGTEStayConstructType(stay) ? stay.product?.valueProps ?? [] : stay.valueProps
  );
  const productPropsMobile = productPropsDesktop.slice(0, 1);
  const isExpiredOffer = !stay.available;
  const totalNights = differenceInDays(
    new Date(stay.to).setHours(0, 0, 0, 0),
    new Date(stay.from).setHours(0, 0, 0, 0)
  );

  return (
    <CardContainer
      className={className}
      isExpiredOffer={isExpiredOffer}
      data-testid="itemContainerStay"
      isRemovingAnotherItem={isRemovingFromCart}
    >
      <ProductCardActionHeader
        isExpiredOffer={isExpiredOffer}
        title={isExpiredOffer ? orderT("Sold out") : orderT("Accommodation")}
        Icon={HotelIcon}
        onInformationClick={onInformationClick}
        onEditClick={isPaymentLink ? undefined : onEditClick}
        onRemoveClick={onRemoveClick}
        disableActions={isRemovingFromCart}
      />
      <ProductOverview
        title={stay.title}
        imageUrl={stay.imageUrl}
        clientRoute={!isExpiredOffer ? stay.clientRoute : undefined}
        quickFacts={quickFacts}
        iconColor={theme.colors.primary}
        namespace={Namespaces.cartNs}
        discountAmount={stay.discountAmount}
        priceDiscountAmountValue={stay.discountAmountPriceObject?.priceDisplayValue}
        priceDiscountAmountCurrency={stay.discountAmountPriceObject?.currency}
        discountPercentage={stay.discountPercentage}
        isSellOut={isSellOut}
      />
      <ProductFooter
        isExpiredOffer={isExpiredOffer}
        isPriceLoading={isPriceLoading}
        price={stay.totalPrice}
        priceDisplayValue={stay.priceObject?.priceDisplayValue}
        priceDisplayCurrency={stay.priceObject?.currency}
        clientRoute={
          !isExpiredOffer
            ? stay.clientRoute
            : getUnavailableStayClientRoute(
                stay,
                searchPageUrl,
                marketplace === Marketplace.GUIDE_TO_EUROPE
              )
        }
        productProps={isMobile ? productPropsMobile : productPropsDesktop}
        priceSubtitle={orderT("Price for {numberOfGuests} guests for {totalNights} nights", {
          numberOfGuests: isGTEStayConstructType(stay)
            ? stay.totalNumberOfAdults + stay.totalNumberOfChildren
            : stay.numberOfGuests,
          totalNights,
        })}
        shouldHideLoadingPrice={isPaymentLink}
      />
    </CardContainer>
  );
};

export default StayProduct;
