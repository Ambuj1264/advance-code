import React from "react";

import CartProduct from "./CartProduct";
import { CartItem, CarCartItem } from "./MiniCart";

import { Product } from "types/enums";
import CarIcon from "components/icons/car.svg";
import useProductOfferExpired from "components/features/Cart/hooks/useProductOfferExpired";

const CarCartProduct = ({
  car,
  fetchUserData,
  onRemoveItemClick,
}: {
  car: CarCartItem;
  fetchUserData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
}) => {
  const { isExpiredOffer } = useProductOfferExpired({
    isAvailable: car.available,
    expiredTime: car.expiredTime,
  });
  return (
    <CartProduct
      item={car as CartItem}
      productType={Product.CAR}
      Icon={CarIcon}
      isAvailable={!isExpiredOffer}
      fetchUserData={fetchUserData}
      onRemoveItemClick={onRemoveItemClick}
    />
  );
};

export default CarCartProduct;
