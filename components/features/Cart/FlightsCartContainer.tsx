import React from "react";

import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import useProductOfferExpired from "./hooks/useProductOfferExpired";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructPaymentDetails,
  constructFlightServiceDetails,
} from "components/ui/Order/utils/orderUtils";
import FlightCard from "components/ui/FlightsShared/FlightCard";
import FlightIcon from "components/icons/plane-1.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Product, SupportedLanguages } from "types/enums";
import useToggle from "hooks/useToggle";

const FlightsCartContainer = ({
  flight,
  activeLocale,
  fetchUserData,
  onRemoveItemClick,
  fetchCartData,
  isRemovingFromCart,
  isPaymentLink = false,
}: {
  flight: OrderTypes.CartFlightItinerary;
  activeLocale: SupportedLanguages;
  fetchUserData: () => void;
  onRemoveItemClick?: (idToRemove: string) => void;
  fetchCartData: () => void;
  isRemovingFromCart?: boolean;
  isPaymentLink?: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const { onExpired, isExpiredOffer, expiredTimeDifference } = useProductOfferExpired({
    isAvailable: flight.available,
    expiredTime: flight.expiredTime,
    fetchCartData,
  });
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.FLIGHT,
    isProductAvailable: !isExpiredOffer,
    title: flight.title,
    id: flight.id,
    removeId: flight.cartItemId,
    price: flight.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  return (
    <>
      <FlightCard
        itinerary={flight}
        isPriceLoading={isLoadingCartProducts}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        expiredTimeDifference={expiredTimeDifference}
        isExpired={isExpiredOffer}
        onExpired={onExpired}
        hideDetailedModalFooter
        isRemovingFromCart={isRemovingFromCart}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={flight.title}
        Icon={FlightIcon}
        removeId={flight.cartItemId}
        serviceDetails={constructFlightServiceDetails({
          flight,
          orderT,
          activeLocale,
        })}
        paymentDetails={
          isPaymentLink && !flight.price
            ? undefined
            : constructPaymentDetails({
                priceObject: flight.priceObject,
                orderT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        toggleShowRemoveModal={toggleShowRemoveModal}
        showInformationModal={showInformationModal}
        toggleShowInformationModal={toggleShowInformationModal}
        id={flight.id}
        price={flight.price}
        productType={Product.FLIGHT}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default FlightsCartContainer;
