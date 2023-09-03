import React from "react";

import TourProduct from "./TourProduct";
import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructPaymentDetails,
  constructTourServiceDetails,
  getTourIconByType,
} from "components/ui/Order/utils/orderUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import { Product } from "types/enums";

const TourCartContainer = ({
  tour,
  fetchUserData,
  isSellOut,
  onRemoveItemClick,
  isRemovingFromCart,
  isPaymentLink,
}: {
  tour: OrderTypes.Tour;
  fetchUserData: () => void;
  isSellOut?: boolean;
  onRemoveItemClick: (idToRemove: string) => void;
  isRemovingFromCart?: boolean;
  isPaymentLink: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const tourIcon = getTourIconByType(tour.type);
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.TOUR,
    isProductAvailable: tour.available,
    title: tour.title,
    id: tour.id,
    removeId: tour.cartItemId,
    price: tour.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  return (
    <>
      <TourProduct
        tour={tour}
        Icon={tourIcon}
        isPriceLoading={isLoadingCartProducts}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        isSellOut={isSellOut}
        isRemovingFromCart={isRemovingFromCart}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={tour.title!}
        Icon={tourIcon}
        removeId={tour.cartItemId}
        serviceDetails={constructTourServiceDetails({
          tour,
          orderT,
        })}
        paymentDetails={
          isPaymentLink && !tour.totalPrice
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
        id={tour.id}
        price={tour.totalPrice}
        productType={Product.TOUR}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default TourCartContainer;
