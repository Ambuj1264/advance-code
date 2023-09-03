import React, { useEffect } from "react";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";
import styled from "@emotion/styled";
import { StringParam, useQueryParams } from "use-query-params";
import { ButtonSize } from "@travelshift/ui/types/enums";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import { css } from "@emotion/core";
import { toUndefined } from "fp-ts/lib/Option";

import MiniCartContent from "./MiniCartContent";
import MiniCartLoading from "./MiniCartLoading";
import EmptyMiniCart from "./EmptyMiniCart";
import { StyledCartButton } from "./CartComponents";

import useSession from "hooks/useSession";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import MiniCartQuery from "components/features/Cart/queries/MiniCartQuery.graphql";
import { CartQueryParam, CarProvider } from "types/enums";
import { noCacheHeaders } from "utils/apiUtils";
import { styledWebkitScrollbar } from "styles/base";
import useCurrency from "hooks/useCurrency";
import useQueryClient from "hooks/useQueryClient";

export type SharedCartItem = {
  itemId: string;
  cartItemId: string;
  title: string;
  available: boolean;
  totalPrice: number;
  priceObject: SharedTypes.PriceObject;
};

export type CartItem = SharedCartItem & {
  imageUrl: string;
};
export type FlightCartItem = SharedCartItem & {
  expiredTime?: string;
};

export type CartItemWithExpiry = CartItem & {
  expiredTime: string;
};
export type CarCartItem = CartItem & {
  expiredTime: string;
  provider?: CarProvider;
};

const MiniCartContentWrapper = styled.div(
  () => css`
    max-height: calc(70vh - 50px);
    overflow-y: scroll;
    ${styledWebkitScrollbar};
  `
);

const MiniCart = ({
  theme,
  cartLink,
  productLinks,
  setIsLoading,
  isRemovingItem,
}: {
  theme: Theme;
  cartLink: string;
  productLinks: ReadonlyArray<HeaderTypes.HeaderLink>;
  setIsLoading: (loading: boolean) => void;
  isRemovingItem: boolean;
}) => {
  const { t } = useTranslation(Namespaces.headerNs);
  const { currencyCode } = useCurrency();
  const currency = toUndefined(currencyCode);
  const [{ cartId: queryParamsCartId }] = useQueryParams({
    [CartQueryParam.CART_ID]: StringParam,
  });
  const {
    data,
    loading,
    error,
    refetch: fetchCartData,
  } = useQueryClient<{
    cart: {
      flights: FlightCartItem[];
      cars: CarCartItem[];
      tours: CartItem[];
      stays: CartItem[];
      gteStays: CartItem[];
      customs: CartItem[];
      vacationPackages: CartItemWithExpiry[];
      toursAndTickets: CartItemWithExpiry[];
      itemCount: number;
    };
  }>(MiniCartQuery, {
    fetchPolicy: "no-cache",
    context: { headers: noCacheHeaders },
    variables: { cartId: queryParamsCartId, currency },
    skip: !currency,
    notifyOnNetworkStatusChange: true,
  });
  const { refetch: fetchSessionData, isLoading: isSessionLoading } = useSession();
  const onCartItemRemove = () => Promise.all([fetchCartData(), fetchSessionData()]);

  useEffect(() => {
    setIsLoading(loading || isSessionLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isSessionLoading]);

  if (((data?.cart?.itemCount === 0 || !data) && !loading) || error) {
    return <EmptyMiniCart links={productLinks} />;
  }

  return (
    <>
      {loading && !data ? (
        <MiniCartLoading />
      ) : (
        <MiniCartContentWrapper>
          <MiniCartContent
            queryFlights={data?.cart.flights}
            queryCars={data?.cart.cars}
            queryTours={data?.cart.tours}
            queryStays={data?.cart.stays}
            queryGTEStays={data?.cart.gteStays}
            queryCustoms={data?.cart.customs}
            queryVacationPackages={data?.cart.vacationPackages}
            queryToursAndTickets={data?.cart.toursAndTickets}
            fetchUserData={onCartItemRemove}
          />
        </MiniCartContentWrapper>
      )}
      <StyledCartButton
        id="goToCartButton"
        href={cartLink}
        buttonSize={ButtonSize.Medium}
        theme={theme}
        color="action"
      >
        {isRemovingItem ? <Bubbles /> : t("Go to cart")}
      </StyledCartButton>
    </>
  );
};
export default MiniCart;
