import React, { useCallback } from "react";

import RemoveCartItemModal from "components/features/Cart/RemoveCartItemModal";
import useRemoveItemFromCart from "components/features/Cart/hooks/useRemoveItemFromCart";
import { Product } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import { datalayerRemoveProductFromCart } from "components/ui/Tracking/trackingUtils";

const CartInfoModals = ({
  id,
  title = "",
  Icon,
  removeId,
  showRemoveModal,
  toggleShowRemoveModal,
  price,
  productType,
  fetchUserData,
  onRemoveItemClick,
}: {
  id: string | number;
  title?: string;
  Icon: React.ElementType<any>;
  removeId?: string;
  showRemoveModal: boolean;
  toggleShowRemoveModal: () => void;
  productType: Product;
  price: number;
  fetchUserData: () => void;
  onRemoveItemClick?: (idToRemove: string) => void;
}) => {
  const { marketplace } = useSettings();
  const onCompleted = () => {
    datalayerRemoveProductFromCart({
      id: id.toString(),
      name: title || "",
      productType,
      marketplace,
      price: price.toString(),
    });
    fetchUserData();
  };
  const { removeItemFromCartMutation, loading } = useRemoveItemFromCart({
    onCompleted,
    fetchUserData,
  });

  const handleRemoveItem = useCallback(() => {
    if (!removeId || loading) return;
    onRemoveItemClick?.(removeId!);
    removeItemFromCartMutation({
      variables: {
        cartItemId: removeId,
      },
    });
    toggleShowRemoveModal();
  }, [loading, onRemoveItemClick, removeId, removeItemFromCartMutation, toggleShowRemoveModal]);

  return showRemoveModal ? (
    <RemoveCartItemModal
      title={title}
      onClose={toggleShowRemoveModal}
      Icon={Icon}
      onRemoveClick={handleRemoveItem}
    />
  ) : null;
};

export default CartInfoModals;
