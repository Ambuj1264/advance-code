import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  ItemWrapper,
  ItemContentWrapper,
  CloseButtonWrapper,
  CloseIcon,
  Text,
} from "./CartComponents";
import RemoveFromCartModal from "./RemoveFromCartModal";
import { CartItem } from "./MiniCart";

import {
  redCinnabarColor,
  whiteColor,
  gutters,
  greyColor,
  placeholderColor,
} from "styles/variables";
import useRemoveFromCartHandler from "components/features/Cart/hooks/useRemoveFromCartHandler";
import { Product } from "types/enums";
import useToggle from "hooks/useToggle";
import { typographyBody2 } from "styles/typography";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ImageComponent from "components/ui/ImageComponent";
import { getHttpsUrl } from "utils/helperUtils";
import { useCartContext } from "components/features/Cart/contexts/CartContextState";

const OfferExpired = styled.div(
  typographyBody2,
  css`
    color: ${redCinnabarColor};
  `
);

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 60px;
  min-width: 60px;
  max-height: 60px;
  background-color: ${whiteColor};
`;

const AvatarImage = styled(ImageComponent)<{
  isAvailable: boolean;
  isRemovingItem: boolean;
}>(({ isAvailable, isRemovingItem }) => [
  css`
    height: auto;
    object-fit: cover;
    object-position: center;
  `,
  isRemovingItem &&
    css`
      opacity: 0.5;
    `,
  !isAvailable &&
    css`
      opacity: 0.7;
    `,
]);

export const TextWrapper = styled.div<{ isAvailable?: boolean }>(({ isAvailable = true }) => [
  css`
    margin: 0 ${gutters.large / 2}px;
    width: 100%;
    text-align: left;
  `,
  !isAvailable &&
    css`
      color: ${greyColor};
    `,
]);

const StyledCloseButtonWrapper = styled(CloseButtonWrapper)<{
  isRemovingAnotherItem: boolean;
}>(({ isRemovingAnotherItem = false }) => [
  isRemovingAnotherItem &&
    css`
      background-color: ${placeholderColor};
      cursor: not-allowed;
    `,
]);

const CartProduct = ({
  productType,
  item,
  Icon,
  isAvailable = true,
  fetchUserData,
  onRemoveItemClick,
}: {
  productType: Product;
  item: CartItem;
  Icon: React.ElementType<any>;
  isAvailable?: boolean;
  fetchUserData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
}) => {
  const { t } = useTranslation(Namespaces.orderNs);

  const [showRemoveModal, toggleShowRemoveModal] = useToggle();
  const { removeMutationLoading, setContextState } = useCartContext();
  const handleToggleModal = useCallback(() => {
    setContextState({ noDismissMiniCartPopOver: !showRemoveModal });
    toggleShowRemoveModal();
  }, [setContextState, showRemoveModal, toggleShowRemoveModal]);

  const { handleRemoveClick } = useRemoveFromCartHandler({
    productType,
    isProductAvailable: isAvailable,
    title: item.title,
    id: item.itemId,
    removeId: item.cartItemId,
    price: item.priceObject.defaultPrice,
    toggleShowRemoveModal: handleToggleModal,
    fetchUserData,
    onRemoveItemClick,
  });

  const imgixParams = {
    fit: "clip",
    h: 100,
    w: 100,
    q: 70,
  };

  return (
    <>
      <ItemWrapper isAvailable={isAvailable}>
        <ImageWrapper>
          <AvatarImage
            isAvailable={isAvailable}
            imageAlt={`${item.title} image`}
            imageUrl={getHttpsUrl(item.imageUrl)}
            imgixParams={imgixParams}
            backgroundColor="white"
            isRemovingItem={removeMutationLoading}
          />
        </ImageWrapper>
        <ItemContentWrapper>
          <TextWrapper isAvailable={isAvailable}>
            <Text>{item.title}</Text>
            {!isAvailable && <OfferExpired>{t("Offer expired")}</OfferExpired>}
          </TextWrapper>
          <StyledCloseButtonWrapper
            onClick={handleRemoveClick}
            isAvailable={isAvailable}
            isRemovingAnotherItem={removeMutationLoading}
          >
            <CloseIcon />
          </StyledCloseButtonWrapper>
        </ItemContentWrapper>
      </ItemWrapper>
      <RemoveFromCartModal
        title={item.title}
        Icon={Icon}
        removeId={item.cartItemId}
        showRemoveModal={showRemoveModal}
        toggleShowRemoveModal={handleToggleModal}
        id={item.itemId}
        price={item.totalPrice}
        productType={productType}
        fetchUserData={fetchUserData}
        onRemoveItemClick={onRemoveItemClick}
      />
    </>
  );
};

export default CartProduct;
