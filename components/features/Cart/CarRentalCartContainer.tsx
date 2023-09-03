import React from "react";

import CarProduct from "./CarProduct";
import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import useProductOfferExpired from "./hooks/useProductOfferExpired";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructCarRentalPaymentDetails,
  constructCarRentalsServiceDetails,
} from "components/ui/Order/utils/orderUtils";
import CarIcon from "components/icons/car.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Product, SupportedLanguages } from "types/enums";
import useToggle from "hooks/useToggle";

const CarRentalCartContainer = ({
  carRental,
  activeLocale,
  fetchUserData,
  carSearchBaseUrl,
  onRemoveItemClick,
  fetchCartData,
  isRemovingFromCart,
  isPaymentLink,
}: {
  carRental: OrderTypes.CarRental;
  activeLocale: SupportedLanguages;
  fetchUserData: () => void;
  fetchCartData: () => void;
  carSearchBaseUrl: string;
  onRemoveItemClick: (idToRemove: string) => void;
  isRemovingFromCart?: boolean;
  isPaymentLink: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const { onExpired, isExpiredOffer, expiredTimeDifference } = useProductOfferExpired({
    isAvailable: carRental.available,
    expiredTime: carRental.expiredTime,
    fetchCartData,
  });

  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.CAR,
    isProductAvailable: !isExpiredOffer,
    title: carRental.title,
    id: carRental.id,
    removeId: carRental.cartItemId,
    price: carRental.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  return (
    <>
      <CarProduct
        isPriceLoading={isLoadingCartProducts}
        carRental={carRental}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        carSearchBaseUrl={carSearchBaseUrl}
        onExpired={onExpired}
        isExpiredOffer={isExpiredOffer}
        expiredTimeDifference={expiredTimeDifference}
        isRemovingFromCart={isRemovingFromCart}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={carRental.title!}
        Icon={CarIcon}
        removeId={carRental.cartItemId}
        serviceDetails={constructCarRentalsServiceDetails({
          carRental,
          activeLocale,
          orderT,
          carnectT,
        })}
        paymentDetails={
          isPaymentLink && !carRental.totalPrice
            ? undefined
            : constructCarRentalPaymentDetails({
                carRental,
                orderT,
                carnectT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        toggleShowRemoveModal={toggleShowRemoveModal}
        showInformationModal={showInformationModal}
        toggleShowInformationModal={toggleShowInformationModal}
        id={carRental.id}
        price={carRental.totalPrice}
        productType={Product.CAR}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default CarRentalCartContainer;
