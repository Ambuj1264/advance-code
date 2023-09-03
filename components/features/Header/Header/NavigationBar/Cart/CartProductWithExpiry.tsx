import React from "react";

import CartProduct from "./CartProduct";
import { CartItemWithExpiry } from "./MiniCart";

import useProductOfferExpired from "components/features/Cart/hooks/useProductOfferExpired";
import { Product } from "types/enums";
import CheckList from "components/icons/checklist.svg";

const CartProductWithExpiry = ({
  vacationPackage,
  fetchUserData,
  onRemoveItemClick,
}: {
  vacationPackage: CartItemWithExpiry;
  fetchUserData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
}) => {
  const { isExpiredOffer } = useProductOfferExpired({
    isAvailable: vacationPackage.available,
    expiredTime: vacationPackage.expiredTime,
  });

  return (
    <CartProduct
      item={vacationPackage}
      productType={Product.VacationPackage}
      Icon={CheckList}
      isAvailable={!isExpiredOffer}
      fetchUserData={fetchUserData}
      onRemoveItemClick={onRemoveItemClick}
    />
  );
};

export default CartProductWithExpiry;
