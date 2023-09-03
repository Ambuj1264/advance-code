import React from "react";

import GTETourProduct from "./GTETourProduct";
import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import useProductOfferExpired from "./hooks/useProductOfferExpired";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructPaymentDetails,
  constructGTETourServiceDetails,
  getTourIconByType,
} from "components/ui/Order/utils/orderUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import { Product, TourType } from "types/enums";

const GTETourCartContainer = ({
  tour,
  fetchUserData,
  isSellOut,
  onRemoveItemClick,
  fetchCartData,
  isRemovingFromCart,
  isPaymentLink,
}: {
  tour: OrderTypes.GTETour;
  fetchUserData: () => void;
  fetchCartData: () => void;
  isSellOut?: boolean;
  onRemoveItemClick: (idToRemove: string) => void;
  isRemovingFromCart?: boolean;
  isPaymentLink: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const { type, available, title, id, cartItemId, totalPrice } = tour;
  const tourIcon = getTourIconByType(type as TourType);
  const { onExpired, isExpiredOffer, expiredTimeDifference } = useProductOfferExpired({
    isAvailable: available,
    fetchCartData,
  });
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.GTETour,
    isProductAvailable: !isExpiredOffer,
    title,
    id,
    removeId: cartItemId,
    price: tour.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  return (
    <>
      <GTETourProduct
        tour={tour}
        Icon={tourIcon}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        isSellOut={isSellOut}
        onExpired={onExpired}
        isExpiredOffer={isExpiredOffer}
        expiredTimeDifference={expiredTimeDifference}
        isRemovingFromCart={isRemovingFromCart}
        isPriceLoading={isLoadingCartProducts}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={title!}
        Icon={tourIcon}
        removeId={cartItemId}
        serviceDetails={constructGTETourServiceDetails({
          tour,
          orderT,
        })}
        paymentDetails={
          isPaymentLink && !totalPrice
            ? undefined
            : constructPaymentDetails({
                priceObject: tour.priceObject,
                orderT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        toggleShowRemoveModal={toggleShowRemoveModal}
        showInformationModal={showInformationModal}
        toggleShowInformationModal={toggleShowInformationModal}
        id={id}
        price={totalPrice}
        productType={Product.TOUR}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default GTETourCartContainer;
