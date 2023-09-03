import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import VoucherHeader from "../Voucher/VoucherHeader";

import CartValueProps from "./CartValueProps";

import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { typographyH4, typographyH5 } from "styles/typography";
import { mqMin, DefaultMarginTop, DefaultMarginBottom } from "styles/base";
import { toLocalizedLongDateFormat } from "utils/dateUtils";
import useActiveLocale from "hooks/useActiveLocale";

export const CART_HEADER_ID = "cart-header";

const Header = styled.h1<{}>(({ theme }) => [
  typographyH5,
  css`
    color: ${theme.colors.primary};
    ${mqMin.medium} {
      ${typographyH4};
    }
  `,
]);

const HeaderContainer = styled.div([
  DefaultMarginTop,
  DefaultMarginBottom,
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  `,
]);

const StyledVoucherHeader = styled(VoucherHeader)`
  ${DefaultMarginTop};
  flex: 0 0 auto;
  max-width: 930px;
`;

const CartHeader = ({
  shouldDisplayTrip,
  isPaymentLinkPage,
  customerName,
  expiryDate,
  isActivePayment = true,
  isCancelled,
}: {
  shouldDisplayTrip?: boolean;
  isPaymentLinkPage?: boolean;
  customerName?: string;
  expiryDate?: SharedTypes.iso8601DateTime;
  isActivePayment?: boolean;
  isCancelled?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.orderNs);
  const activeLocale = useActiveLocale();
  const isCancelledText = isCancelled ? ` <br> This payment link has expired.` : "";
  const expireDateText = expiryDate
    ? ` <br> ${t(`This link ${isActivePayment ? "expires" : "has expired"} on {date}`, {
        date: toLocalizedLongDateFormat(new Date(expiryDate as string), activeLocale, {
          hourCycle: "h23",
        }),
      })}`
    : "";
  const customerText = t(
    `{customerName} ${
      customerName ? "h" : "H"
    }ere's a payment link to finalize your booking. After the purchase you will receive a voucher.`,
    {
      customerName: customerName ? `${customerName.trim()}, ` : "",
    }
  );

  const customHeader = `${customerText}${isCancelledText || expireDateText}`;

  return (
    <HeaderContainer id={CART_HEADER_ID}>
      <Header>
        {shouldDisplayTrip ? (
          <Trans ns={Namespaces.cartNs}>Your trip</Trans>
        ) : (
          <Trans ns={Namespaces.cartNs}>Complete your reservation</Trans>
        )}
      </Header>
      <CartValueProps />
      {isPaymentLinkPage ? (
        <StyledVoucherHeader
          isError={!isActivePayment || isCancelled}
          customHeader={customHeader}
        />
      ) : null}
    </HeaderContainer>
  );
};

export default CartHeader;
