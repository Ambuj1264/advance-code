import React from "react";
import Link from "@travelshift/ui/components/Inputs/Link";
import BaseCartIcon from "@travelshift/ui/icons/cart.svg";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import styles from "@travelshift/ui/components/Header/NavigationBar/Cart.scss";

import Popover from "components/ui/Popover/Popover";
import useSession from "hooks/useSession";

type Props = {
  theme: Theme;
  cartTexts: HeaderTypes.CartTexts;
  cartLink: string;
  id: string;
};
type CartIconProps = {
  totalItemsQuantity?: number;
  theme: Theme;
};
const CartIcon = ({ totalItemsQuantity, theme }: CartIconProps) => (
  <span className={styles.iconWrapper} styleName="iconWrapper">
    <BaseCartIcon
      className={styles.cartIcon}
      styleName="cartIcon"
      style={{
        fill: theme.colors.primary,
      }}
    />
    {totalItemsQuantity !== undefined && totalItemsQuantity > 0 && (
      <span
        className={styles.bubble}
        data-testid="cart-item-count"
        styleName="bubble"
        style={{
          backgroundColor: totalItemsQuantity > 0 ? theme.colors.action : "",
        }}
      >
        {totalItemsQuantity}
      </span>
    )}
  </span>
);

const OldCart = ({ theme, cartTexts, cartLink, id }: Props) => {
  const { cart } = useSession();

  const totalItemsQuantity = cart && cart.totalItemsQuantity;
  return totalItemsQuantity !== undefined && totalItemsQuantity > 0 ? (
    <Link id={`navBar${id}`} href={cartLink} className={styles.button} styleName="button">
      <CartIcon totalItemsQuantity={totalItemsQuantity} theme={theme} />
    </Link>
  ) : (
    <Popover
      title={cartTexts.cartTitle}
      trigger={
        <button id={`navBar${id}Empty`} type="button" className={styles.button} styleName="button">
          <CartIcon totalItemsQuantity={totalItemsQuantity} theme={theme} />
        </button>
      }
    >
      <div className={styles.wrapper} styleName="wrapper" data-testid="cartEmptyText">
        {cartTexts.cartEmptyText}
      </div>
    </Popover>
  );
};

export default OldCart;
