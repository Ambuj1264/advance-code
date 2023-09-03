import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import BaseCartIcon from "@travelshift/ui/icons/cart.svg";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import { ButtonSize } from "@travelshift/ui/types/enums";
import { useTheme } from "emotion-theming";

import MiniCartLoading from "./MiniCartLoading";
import { StyledCartButton } from "./CartComponents";

import Popover from "components/ui/Popover/Popover";
import { PopoverWrapper } from "components/ui/Popover/PopoverContent";
import useSession from "hooks/useSession";
import { gutters, whiteColor, fontWeightBold, borderRadiusCircle } from "styles/variables";
import { resetAnchor, resetButton } from "styles/reset";
import { mqIE, mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useCartContext } from "components/features/Cart/contexts/CartContextState";
import CustomNextDynamic from "lib/CustomNextDynamic";

const Loading = () => {
  const { t } = useTranslation(Namespaces.headerNs);
  const theme: Theme = useTheme();
  return (
    <>
      <MiniCartLoading />
      <StyledCartButton
        id="goToCartButton"
        buttonSize={ButtonSize.Medium}
        theme={theme}
        color="action"
      >
        {t("Go to cart")}
      </StyledCartButton>
    </>
  );
};

const MiniCart = CustomNextDynamic(() => import("./MiniCart"), {
  ssr: false,
  loading: Loading,
});

const PopoverContentWrapper = styled.div`
  margin-top: -${gutters.small}px;
  width: 100%;
  ${mqMin.medium} {
    width: 331px;
  }
`;

const Button = styled.button(
  resetButton,
  resetAnchor,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
    ${mqIE} {
      overflow: visible;
    }
  `
);

const Bubble = styled.span(
  ({ theme }) => css`
    position: absolute;
    top: -5px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px ${whiteColor};
    border-radius: 50%;
    width: 14px;
    height: 14px;
    background-color: ${theme.colors.action};
    color: ${whiteColor};
    font-size: 8px;
    font-weight: ${fontWeightBold};
  `
);

const StyledCartIcon = styled(BaseCartIcon)(
  ({ theme }) => css`
    width: 22px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

const StyledPopover = styled(Popover)`
  position: static;
  ${mqMin.medium} {
    position: relative;
  }
  ${PopoverWrapper} {
    right: 0;
    left: 0;
    ${mqMin.medium} {
      right: -${gutters.large / 2}px;
      left: auto;
    }
  }
`;

const IconWrapper = styled.span`
  position: relative;
  line-height: 0;
`;

const BubbleLoading = styled.span`
  @keyframes scaleIcon {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
  border-radius: ${borderRadiusCircle};
  width: 50%;
  height: 50%;
  background: ${whiteColor};
  animation: scaleIcon 1200ms infinite ease-in-out;
`;

const CartIcon = ({
  totalItemsQuantity,
  isRemovingItem,
  isCartLoading,
}: {
  totalItemsQuantity?: number;
  isRemovingItem: boolean;
  isCartLoading: boolean;
}) => {
  return (
    <IconWrapper>
      <StyledCartIcon />
      {totalItemsQuantity !== undefined && totalItemsQuantity > 0 && (
        <Bubble>{isRemovingItem || isCartLoading ? <BubbleLoading /> : totalItemsQuantity}</Bubble>
      )}
    </IconWrapper>
  );
};

const Cart = ({
  theme,
  cartTexts,
  cartLink,
  id,
  links,
}: {
  theme: Theme;
  cartTexts: HeaderTypes.CartTexts;
  cartLink: string;
  id: string;
  links: ReadonlyArray<HeaderTypes.HeaderLink>;
}) => {
  const { cart, isLoading } = useSession();
  const { t } = useTranslation(Namespaces.cartNs);
  const totalItemsQuantity = cart && cart.totalItemsQuantity;
  const isEmpty = totalItemsQuantity === undefined || totalItemsQuantity === 0;
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { removeMutationLoading, noDismissMiniCartPopOver } = useCartContext();

  useEffect(() => {
    setIsCartLoading(isLoading);
  }, [isLoading]);

  return (
    <StyledPopover
      title={isEmpty ? cartTexts.cartEmptyText : t("Your trip")}
      Icon={BaseCartIcon}
      noDismiss={noDismissMiniCartPopOver}
      trigger={
        <Button id={`navBar${id}${isEmpty ? "Empty" : ""}`} type="button">
          <CartIcon
            totalItemsQuantity={totalItemsQuantity}
            isRemovingItem={removeMutationLoading}
            isCartLoading={isCartLoading}
          />
        </Button>
      }
      className="miniCart"
    >
      <PopoverContentWrapper>
        <MiniCart
          theme={theme}
          cartLink={cartLink}
          productLinks={links}
          setIsLoading={setIsCartLoading}
          isRemovingItem={removeMutationLoading}
        />
      </PopoverContentWrapper>
    </StyledPopover>
  );
};

export default Cart;
