import React from "react";

import CartInfoModals from "./CartInfoModals";
import CustomProduct from "./CustomProduct";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructCustomsServiceDetails,
  constructPaymentDetails,
} from "components/ui/Order/utils/orderUtils";
import CheckListIcon from "components/icons/checklist.svg";
import HotelIcon from "components/icons/house-heart.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Product } from "types/enums";
import useToggle from "hooks/useToggle";

const CustomsCartContainer = ({
  customProduct,
  fetchUserData,
  onRemoveItemClick,
  isRemovingFromCart,
}: {
  customProduct: OrderTypes.QueryCustomsConstruct;
  fetchUserData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
  isRemovingFromCart?: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.CUSTOM,
    isProductAvailable: customProduct.available,
    title: customProduct.title,
    id: customProduct.id,
    removeId: customProduct.cartItemId,
    price: customProduct.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });
  const { isPaymentLink } = customProduct;

  return (
    <>
      <CustomProduct
        customProduct={customProduct}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        isRemovingFromCart={isRemovingFromCart}
        isPriceLoading={isLoadingCartProducts}
      />
      <CartInfoModals
        title={customProduct.title!}
        Icon={isPaymentLink ? CheckListIcon : HotelIcon}
        removeId={customProduct.cartItemId}
        serviceDetails={constructCustomsServiceDetails({
          customProduct,
          orderT,
        })}
        paymentDetails={
          isPaymentLink && !customProduct.totalPrice
            ? undefined
            : constructPaymentDetails({
                priceObject: customProduct.priceObject,
                orderT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        toggleShowRemoveModal={toggleShowRemoveModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        showInformationModal={showInformationModal}
        toggleShowInformationModal={toggleShowInformationModal}
        id={customProduct.id}
        price={customProduct.totalPrice}
        productType={Product.CUSTOM}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default CustomsCartContainer;
