import React from "react";

import StayProduct from "./StayProduct";
import CartInfoModals from "./CartInfoModals";
import useRemoveFromCartHandler from "./hooks/useRemoveFromCartHandler";
import { useCartContext } from "./contexts/CartContextState";

import {
  constructGTEStayRoomDetails,
  constructGTEStayServiceDetails,
  constructPaymentDetails,
  constructStayServiceDetails,
  isGTEStayConstructType,
} from "components/ui/Order/utils/orderUtils";
import HotelIcon from "components/icons/house-heart.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { Product, SupportedLanguages } from "types/enums";
import useToggle from "hooks/useToggle";

const StayCartContainer = ({
  stay,
  activeLocale,
  fetchUserData,
  isSellOut,
  onRemoveItemClick,
  isRemovingFromCart,
  isPaymentLink,
}: {
  stay: OrderTypes.QueryStayConstruct | OrderTypes.QueryGTEStayConstruct;
  activeLocale: SupportedLanguages;
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
  const stayId = stay.id ?? `unknown-stay-id-${stay.title}`;
  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType: Product.STAY,
    isProductAvailable: stay.available,
    title: stay.title,
    id: stayId,
    removeId: stay.cartItemId,
    price: stay.priceObject.price,
    toggleShowRemoveModal,
    fetchUserData,
    onRemoveItemClick,
  });

  const serviceDetails = isGTEStayConstructType(stay)
    ? constructGTEStayServiceDetails({ stay, activeLocale, orderT })
    : constructStayServiceDetails({ stay, activeLocale, orderT });

  const roomDetails = isGTEStayConstructType(stay)
    ? constructGTEStayRoomDetails({
        stay,
        activeLocale,
        orderT,
      })
    : undefined;

  return (
    <>
      <StayProduct
        stay={stay}
        onRemoveClick={isPaymentLink ? undefined : handleRemoveClick}
        onInformationClick={toggleShowInformationModal}
        isSellOut={isSellOut}
        isRemovingFromCart={isRemovingFromCart}
        isPriceLoading={isLoadingCartProducts}
        isPaymentLink={isPaymentLink}
      />
      <CartInfoModals
        title={stay.title!}
        Icon={HotelIcon}
        removeId={stay.cartItemId}
        serviceDetails={serviceDetails}
        extraSections={roomDetails ? [roomDetails] : undefined}
        paymentDetails={
          isPaymentLink && !stay.totalPrice
            ? undefined
            : constructPaymentDetails({
                priceObject: stay.priceObject,
                orderT,
                isCartInfo: true,
              })
        }
        showRemoveModal={showRemoveModal}
        toggleShowRemoveModal={toggleShowRemoveModal}
        showInformationModal={showInformationModal}
        onRemoveItemClick={isPaymentLink ? undefined : onRemoveItemClick}
        toggleShowInformationModal={toggleShowInformationModal}
        id={stayId}
        price={stay.totalPrice}
        productType={Product.STAY}
        fetchUserData={fetchUserData}
      />
    </>
  );
};

export default StayCartContainer;
