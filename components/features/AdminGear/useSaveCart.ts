import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import SaveCartMutation from "./graphql/SaveCartMutation.graphql";

import { CartQueryParam } from "types/enums";

const useSaveCart = ({ toggleSaveCartModal }: { toggleSaveCartModal: () => void }) => {
  const [isCartLinkCopied, setIsCartLinkCopied] = useState(false);
  const [isSavingCartError, setIsSavingCartError] = useState(false);
  const [isCheckingNavigatorPermissions, setIsCheckingNavigatorPermissions] = useState(false);
  const [cartLink, setCartLink] = useState<string>();

  const [saveCart, { loading: isCartSaveLoading }] = useMutation<
    CartTypes.SaveCartResponse,
    CartTypes.SaveCartParams
  >(SaveCartMutation, {
    onCompleted: data => {
      const savedCartData = data.saveCart;

      if (savedCartData.success) {
        const { linkId } = savedCartData;
        setIsSavingCartError(false);
        setCartLink(
          `${window.location.origin}${window.location.pathname}?${CartQueryParam.SAVED_CART_ID}=${linkId}`
        );

        if (navigator.clipboard) {
          setIsCheckingNavigatorPermissions(true);
          // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
          navigator.permissions
            .query({ name: "clipboard-write" as PermissionName })
            .then(result => {
              if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard
                  .writeText(
                    `${window.location.origin}${window.location.pathname}?${CartQueryParam.SAVED_CART_ID}=${linkId}`
                  )
                  .then(() => setIsCartLinkCopied(true))
                  .catch(() => setIsCartLinkCopied(false));
              }
            })
            .catch(() => {
              setIsCartLinkCopied(false);
            })
            .finally(() => setIsCheckingNavigatorPermissions(false));
        }
      } else {
        setIsSavingCartError(true);
      }
      toggleSaveCartModal();
    },
    onError: () => setIsSavingCartError(true),
  });

  const handleSaveCart = () => {
    saveCart({
      variables: {
        input: { cartId: "" },
      },
    });
  };

  return {
    handleSaveCart,
    isCartLinkCopied,
    isSavingCartError,
    isCartSaveLoading: isCartSaveLoading || isCheckingNavigatorPermissions,
    cartLink,
  };
};

export default useSaveCart;
