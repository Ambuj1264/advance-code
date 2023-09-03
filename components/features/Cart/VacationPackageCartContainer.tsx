import React from "react";

import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import VacationPackageProduct from "./VacationPackageProduct";
import useProductOfferExpired from "./hooks/useProductOfferExpired";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructPaymentDetails,
  constructVacationProductServiceDetails,
} from "components/ui/Order/utils/orderUtils";
import RouteIcon from "components/icons/tour-route.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Product } from "types/enums";
import useToggle from "hooks/useToggle";
import useActiveLocale from "hooks/useActiveLocale";

const VacationPackageCartContainer = ({
  vacationPackageProduct,
  fetchUserData,
  fetchCartData,
  onRemoveItemClick,
  isRemovingFromCart,
  isPaymentLink,
}: {
  vacationPackageProduct: OrderTypes.QueryVacationPackageConstruct;
  fetchUserData: () => void;
  fetchCartData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
  isRemovingFromCart?: boolean;
  isPaymentLink: boolean;
}) => {
  const { isLoadingCartProducts } = useCartContext();
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const locale = useActiveLocale();
  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const [showInformationModal, toggleShowInformationModal] = useToggle();
  const { onExpired, isExpiredOffer, expiredTimeDifference } = useProductOfferExpired({
    isAvailable: vacationPackageProduct.available,
    expiredTime: vacationPackageProduct.expiredTime,
    fetchCartData,
  });
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.VacationPackage,
    isProductAvailable: !isExpiredOffer,
    title: vacationPackageProduct.title,
    id: vacationPackageProduct.id,
    removeId: vacationPackageProduct.cartItemId,
    price: vacationPackageProduct.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  return (
    <>
      <VacationPackageProduct
        vacationPackageProduct={vacationPackageProduct}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        onExpired={onExpired}
        isExpiredOffer={isExpiredOffer}
        expiredTimeDifference={expiredTimeDifference}
        isRemovingFromCart={isRemovingFromCart}
        isPriceLoading={isLoadingCartProducts}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={vacationPackageProduct.title!}
        Icon={RouteIcon}
        removeId={vacationPackageProduct.cartItemId}
        serviceDetails={constructVacationProductServiceDetails({
          vacationPackageProduct,
          orderT,
          carnectT,
          locale,
        })}
        paymentDetails={
          isPaymentLink && !vacationPackageProduct.totalPrice
            ? undefined
            : constructPaymentDetails({
                priceObject: vacationPackageProduct.priceObject,
                orderT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        toggleShowRemoveModal={toggleShowRemoveModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        showInformationModal={showInformationModal}
        toggleShowInformationModal={toggleShowInformationModal}
        id={vacationPackageProduct.id}
        price={vacationPackageProduct.totalPrice}
        productType={Product.VacationPackage}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default VacationPackageCartContainer;
