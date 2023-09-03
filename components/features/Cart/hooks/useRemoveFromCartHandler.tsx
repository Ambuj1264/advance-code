import { useCallback } from "react";

import useRemoveItemFromCart from "./useRemoveItemFromCart";

import { Product } from "types/enums";
import { datalayerRemoveProductFromCart } from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";

const useRemoveFromCartHandler = ({
  toggleShowRemoveModal,
  isProductAvailable,
  id,
  productType,
  price,
  removeId,
  fetchUserData,
  title,
  onRemoveItemClick,
}: {
  toggleShowRemoveModal: () => void;
  isProductAvailable: boolean;
  id: string | number;
  productType: Product;
  removeId?: string;
  price: number;
  fetchUserData: () => void;
  title?: string;
  onRemoveItemClick?: (idToRemove: string) => void;
}) => {
  const { marketplace } = useSettings();
  const onCompleted = () => {
    datalayerRemoveProductFromCart({
      id: id?.toString(),
      name: title || "",
      productType,
      marketplace,
      price: price.toString(),
    });
    fetchUserData();
  };
  const { removeItemFromCartMutation } = useRemoveItemFromCart({
    onCompleted,
    fetchUserData,
  });

  const handleRemoveClick = useCallback(() => {
    if (!isProductAvailable) {
      onRemoveItemClick?.(removeId!);
      removeItemFromCartMutation({
        variables: {
          cartItemId: removeId!,
        },
      });
    } else {
      toggleShowRemoveModal();
    }
  }, [
    isProductAvailable,
    onRemoveItemClick,
    removeId,
    removeItemFromCartMutation,
    toggleShowRemoveModal,
  ]);

  return { handleRemoveClick };
};

export default useRemoveFromCartHandler;
