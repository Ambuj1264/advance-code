import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FlightsCartContainer from "./FlightsCartContainer";
import CarRentalCartContainer from "./CarRentalCartContainer";
import TourCartContainer from "./TourCartContainer";
import GTETourCartContainer from "./GTETourCartContainer";
import StayCartContainer from "./StayCartContainer";
import CustomsCartContainer from "./CustomsCartContainer";
import VacationPackageCartContainer from "./VacationPackageCartContainer";
import { useCartContext } from "./contexts/CartContextState";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import useActiveLocale from "hooks/useActiveLocale";
import { DefaultMarginBottom, DefaultMarginTop } from "styles/base";
import useDynamicUrl from "hooks/useDynamicUrl";
import { PageType, Product, Marketplace } from "types/enums";
import {
  constructCartCarRentals,
  constructCartFlights,
  constructCartStays,
  constructCartTours,
  constructCartVacationPackages,
  constructCustomProducts,
  constructCartGTETours,
  constructGTECartStays,
} from "components/ui/Order/utils/orderUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";

const Container = styled.div([DefaultMarginBottom]);

const Wrapper = styled.div([
  css`
    display: flex;

    & + & {
      ${DefaultMarginTop}
    }
  `,
]);

type ProductTypes = {
  [Product.FLIGHT]?: OrderTypes.QueryFlightItineraryCart[];
  [Product.CAR]?: OrderTypes.QueryCarRental[];
  [Product.TOUR]?: OrderTypes.QueryTour[];
  [Product.STAY]?: OrderTypes.QueryStay[];
  [Product.GTEStay]?: OrderTypes.QueryGTEStay[];
  [Product.GTETour]?: OrderTypes.QueryGTETour[];
  [Product.CUSTOM]?: OrderTypes.QueryCustomProduct[];
  [Product.VacationPackage]?: OrderTypes.QueryVacationPackageProduct[];
};

type Unarray<T> = T extends Array<infer U> ? U : T;
// fix for TS2349: This expression is not callable
type ProductTypesUnionArrayLoopFix = Unarray<
  ProductTypes[keyof Exclude<ProductTypes, Product.INVOICE>]
>[];

const ProductOverviewContainer = ({
  queryFlights,
  queryCars,
  queryTours,
  queryStays,
  queryGTEStays,
  queryToursAndTickets,
  queryCustoms,
  queryVacationPackages,
  carProductBaseUrl,
  fetchUserData,
  fetchCartData,
  carSearchBaseUrl,
  isLoadingCartProducts,
  isPaymentLink = false,
}: {
  queryFlights?: OrderTypes.QueryFlightItineraryCart[];
  queryCars?: OrderTypes.QueryCarRental[];
  queryTours?: OrderTypes.QueryTour[];
  queryStays?: OrderTypes.QueryStay[];
  queryGTEStays?: OrderTypes.QueryGTEStay[];
  queryToursAndTickets?: OrderTypes.QueryGTETour[];
  queryCustoms?: OrderTypes.QueryCustomProduct[];
  queryVacationPackages?: OrderTypes.QueryVacationPackageProduct[];
  carProductBaseUrl: string;
  fetchUserData: () => void;
  fetchCartData: () => void;
  carSearchBaseUrl: string;
  isLoadingCartProducts?: boolean;
  isPaymentLink?: boolean;
}) => {
  const { removeMutationLoading, setContextState } = useCartContext();
  const [cartProducts, setCartProducts] = useState<ProductTypes>({
    [Product.FLIGHT]: queryFlights,
    [Product.CAR]: queryCars,
    [Product.TOUR]: queryTours,
    [Product.STAY]: queryStays,
    [Product.GTEStay]: queryGTEStays,
    [Product.GTETour]: queryToursAndTickets,
    [Product.CUSTOM]: queryCustoms,
    [Product.VacationPackage]: queryVacationPackages,
  });
  const { t: flightT } = useTranslation(Namespaces.flightNs);
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  const flightSearchBaseUrl = useDynamicUrl(PageType.FLIGHTSEARCH);
  const flightProducts = cartProducts[Product.FLIGHT];
  const flightsInCart = flightProducts
    ? constructCartFlights(flightProducts, flightT, flightSearchBaseUrl)
    : [];
  const carRentalsInCart = constructCartCarRentals(carProductBaseUrl, cartProducts[Product.CAR]);
  const toursInCart = constructCartTours(cartProducts[Product.TOUR]);
  const staysInCart = constructCartStays(isGTE, cartProducts[Product.STAY]);
  const gteStaysInCart = constructGTECartStays(cartProducts[Product.GTEStay]);
  const customProductsInCart = constructCustomProducts(cartProducts[Product.CUSTOM]);
  const gteToursInCart = constructCartGTETours(cartProducts[Product.GTETour]);
  const vacationPackagesInCart = constructCartVacationPackages({
    vacationPackages: cartProducts[Product.VacationPackage],
    flightT,
    flightSearchBaseUrl,
    carProductBaseUrl,
  });
  const sharedProps = {
    activeLocale,
    currencyCode,
    convertCurrency,
    isPaymentLink,
  };

  useEffect(() => {
    setContextState({ isLoadingCartProducts });
  }, [isLoadingCartProducts, setContextState]);

  useEffect(() => {
    setCartProducts({
      [Product.FLIGHT]: queryFlights,
      [Product.CAR]: queryCars,
      [Product.TOUR]: queryTours,
      [Product.STAY]: queryStays,
      [Product.GTEStay]: queryGTEStays,
      [Product.CUSTOM]: queryCustoms,
      [Product.VacationPackage]: queryVacationPackages,
      [Product.GTETour]: queryToursAndTickets,
    });
  }, [
    setCartProducts,
    queryFlights,
    queryCars,
    queryTours,
    queryStays,
    queryCustoms,
    queryVacationPackages,
    queryToursAndTickets,
    queryGTEStays,
  ]);

  const handleRemoveCartItem =
    (productType: Exclude<Product, Product.INVOICE>) => (idToRemove: string) => {
      setCartProducts({
        ...cartProducts,
        [productType]: (cartProducts[productType] as ProductTypesUnionArrayLoopFix)?.filter(
          productItem => productItem?.cartItemId !== idToRemove
        ),
      });
    };

  return (
    <Container>
      {flightsInCart.map(flight => (
        <Wrapper key={flight.id}>
          <FlightsCartContainer
            flight={flight}
            fetchUserData={fetchUserData}
            onRemoveItemClick={handleRemoveCartItem(Product.FLIGHT)}
            fetchCartData={fetchCartData}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {carRentalsInCart.map(carRental => (
        <Wrapper key={carRental.cartItemId}>
          <CarRentalCartContainer
            carRental={carRental}
            fetchUserData={fetchUserData}
            carSearchBaseUrl={carSearchBaseUrl}
            onRemoveItemClick={handleRemoveCartItem(Product.CAR)}
            fetchCartData={fetchCartData}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {toursInCart.map((tourItem, index) => (
        <Wrapper key={tourItem.cartItemId}>
          <TourCartContainer
            tour={tourItem}
            fetchUserData={fetchUserData}
            isSellOut={tourItem.available && index === 0}
            onRemoveItemClick={handleRemoveCartItem(Product.TOUR)}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {gteToursInCart.map((tourItem, index) => (
        <Wrapper key={tourItem.cartItemId}>
          <GTETourCartContainer
            tour={tourItem}
            fetchUserData={fetchUserData}
            isSellOut={tourItem.available && index === 0}
            onRemoveItemClick={handleRemoveCartItem(Product.GTETour)}
            fetchCartData={fetchCartData}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {staysInCart.map((stayItem, index) => (
        <Wrapper key={stayItem.cartItemId}>
          <StayCartContainer
            stay={stayItem}
            fetchUserData={fetchUserData}
            isSellOut={stayItem.available && index === 0}
            onRemoveItemClick={handleRemoveCartItem(Product.STAY)}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {gteStaysInCart.map((stayItem, index) => (
        <Wrapper key={stayItem.cartItemId}>
          <StayCartContainer
            stay={stayItem}
            fetchUserData={fetchUserData}
            isSellOut={stayItem.available && index === 0}
            onRemoveItemClick={handleRemoveCartItem(Product.STAY)}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {customProductsInCart?.map(customProductItem => (
        <Wrapper key={customProductItem.cartItemId}>
          <CustomsCartContainer
            customProduct={customProductItem}
            fetchUserData={fetchUserData}
            onRemoveItemClick={handleRemoveCartItem(Product.CUSTOM)}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
      {vacationPackagesInCart?.map(vacationPackageProduct => (
        <Wrapper key={vacationPackageProduct.cartItemId}>
          <VacationPackageCartContainer
            vacationPackageProduct={vacationPackageProduct}
            fetchUserData={fetchUserData}
            fetchCartData={fetchCartData}
            onRemoveItemClick={handleRemoveCartItem(Product.VacationPackage)}
            isRemovingFromCart={removeMutationLoading}
            {...sharedProps}
          />
        </Wrapper>
      ))}
    </Container>
  );
};

export default ProductOverviewContainer;
