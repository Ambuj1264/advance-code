import React, { ElementType, useCallback } from "react";

import { ProductNotificationType } from "../ProductPageNotification/contexts/NotificationStateContext";
import { useAddNotification } from "../ProductPageNotification/contexts/NotificationStateHooks";

import RemoveCartItemModal from "./RemoveCartItemModal";
import InformationCartItemModal from "./InformationCartItemModal";
import useRemoveItemFromCart from "./hooks/useRemoveItemFromCart";

import { ColorScheme, Product } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { datalayerRemoveProductFromCart } from "components/ui/Tracking/trackingUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import WarningIcon from "components/icons/warning.svg";

const CartInfoModals = ({
  id,
  title = "",
  Icon,
  removeId,
  showRemoveModal,
  toggleShowRemoveModal,
  showInformationModal,
  toggleShowInformationModal,
  serviceDetails,
  paymentDetails,
  extraSections = [],
  price,
  productType,
  fetchUserData,
  onRemoveItemClick,
}: {
  id: string | number;
  title?: string;
  Icon: ElementType<SVGElement>;
  removeId?: string;
  showRemoveModal: boolean;
  toggleShowRemoveModal: () => void;
  showInformationModal: boolean;
  toggleShowInformationModal: () => void;
  serviceDetails: OrderTypes.VoucherProduct;
  paymentDetails?: OrderTypes.VoucherProduct;
  extraSections?: OrderTypes.VoucherProduct[];
  productType: Product;
  price: number;
  fetchUserData: () => void;
  onRemoveItemClick?: (idToRemove: string) => void;
}) => {
  const { marketplace } = useSettings();
  const { t: cartT } = useTranslation(Namespaces.cartNs);
  const onAddNotification = useAddNotification();

  const onCompleted = () => {
    datalayerRemoveProductFromCart({
      id: id?.toString(),
      name: title || "",
      productType,
      marketplace,
      price: price.toString(),
    });
    const removeCartItemNotification = {
      ribbonText: cartT("{productName} was removed from your cart", {
        productName: title,
      }),
      notificationColor: ColorScheme.primary,
      productType,
      customIcon: Icon,
    } as ProductNotificationType;
    onAddNotification(removeCartItemNotification);
    fetchUserData();
  };

  const onError = () => {
    const removeCartItemError = {
      ribbonText: cartT(
        "There was an error while removing this item from your cart. Please try again later."
      ),
      productType,
      customIcon: WarningIcon,
    } as ProductNotificationType;
    onAddNotification(removeCartItemError);
  };

  const { removeItemFromCartMutation, loading } = useRemoveItemFromCart({
    onCompleted,
    onError,
    fetchUserData,
  });
  const handleRemoveItem = useCallback(() => {
    if (!removeId || loading) return;

    onRemoveItemClick?.(removeId!);

    toggleShowRemoveModal();

    removeItemFromCartMutation({
      variables: {
        cartItemId: removeId,
      },
    });
  }, [loading, onRemoveItemClick, removeId, removeItemFromCartMutation, toggleShowRemoveModal]);

  return (
    <>
      {showRemoveModal && (
        <RemoveCartItemModal
          title={title}
          onClose={toggleShowRemoveModal}
          Icon={Icon}
          onRemoveClick={handleRemoveItem}
        />
      )}
      {showInformationModal && (
        <InformationCartItemModal
          onClose={toggleShowInformationModal}
          title={title}
          Icon={Icon}
          serviceDetails={serviceDetails}
          extraSections={extraSections}
          paymentDetails={paymentDetails}
        />
      )}
    </>
  );
};

export default CartInfoModals;
