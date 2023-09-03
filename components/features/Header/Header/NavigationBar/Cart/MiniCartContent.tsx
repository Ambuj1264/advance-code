import React, { useState } from "react";

import CartProduct from "./CartProduct";
import { CartItem, FlightCartItem, CarCartItem, CartItemWithExpiry } from "./MiniCart";
import FlightCartProduct from "./FlightCartProduct";
import CarCartProduct from "./CarCartProduct";
import CartProductWithExpiry from "./CartProductWithExpiry";

import PackagesIcon from "components/icons/distance.svg";
import HotelIcon from "components/icons/house-heart.svg";
import { Product } from "types/enums";

type MiniCartTypes = {
  [Product.FLIGHT]?: FlightCartItem[];
  [Product.CAR]?: CarCartItem[];
  [Product.TOUR]?: CartItem[];
  [Product.STAY]?: CartItem[];
  [Product.GTEStay]?: CartItem[];
  [Product.CUSTOM]?: CartItem[];
  [Product.GTETour]?: CartItemWithExpiry[];
  [Product.VacationPackage]?: CartItemWithExpiry[];
};

type Unarray<T> = T extends Array<infer U> ? U : T;
// fix for TS2349: This expression is not callable
type MiniCartTypesUnionArrayLoopFix = Unarray<
  MiniCartTypes[keyof Exclude<MiniCartTypes, Product.INVOICE>]
>[];

const MiniCartContent = ({
  queryFlights,
  queryCars,
  queryTours,
  queryStays,
  queryGTEStays,
  queryCustoms,
  queryVacationPackages,
  queryToursAndTickets,
  fetchUserData,
}: {
  queryFlights?: FlightCartItem[];
  queryCars?: CarCartItem[];
  queryTours?: CartItem[];
  queryStays?: CartItem[];
  queryGTEStays?: CartItem[];
  queryCustoms?: CartItem[];
  queryVacationPackages?: CartItemWithExpiry[];
  queryToursAndTickets?: CartItemWithExpiry[];
  fetchUserData: () => void;
}) => {
  const [cartProducts, setCartProducts] = useState<MiniCartTypes>({
    [Product.FLIGHT]: queryFlights,
    [Product.CAR]: queryCars,
    [Product.TOUR]: queryTours,
    [Product.STAY]: queryStays,
    [Product.GTEStay]: queryGTEStays,
    [Product.CUSTOM]: queryCustoms,
    [Product.GTETour]: queryToursAndTickets,
    [Product.VacationPackage]: queryVacationPackages,
  });
  const handleRemoveCartItem =
    (productType: Exclude<Product, Product.INVOICE>) => (idToRemove: string) => {
      setCartProducts({
        ...cartProducts,
        [productType]: (cartProducts[productType] as MiniCartTypesUnionArrayLoopFix)?.filter(
          productItem => productItem?.cartItemId !== idToRemove
        ),
      });
    };
  return (
    <>
      {cartProducts[Product.TOUR]?.map((tour: CartItem, index: number) => (
        <CartProduct
          key={`MiniCartTourProduct${index.toString()}`}
          item={tour}
          productType={Product.TOUR}
          Icon={PackagesIcon}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.TOUR)}
        />
      ))}
      {cartProducts[Product.GTETour]?.map((tour: CartItemWithExpiry, index: number) => (
        <CartProductWithExpiry
          key={`MiniCartGTETourProduct${index.toString()}`}
          vacationPackage={tour}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.GTETour)}
        />
      ))}
      {cartProducts[Product.FLIGHT]?.map((flight: FlightCartItem, index: number) => (
        <FlightCartProduct
          key={`MiniCartFlightProduct${index.toString()}`}
          flight={flight}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.FLIGHT)}
        />
      ))}
      {cartProducts[Product.CAR]?.map((car: CarCartItem, index: number) => (
        <CarCartProduct
          key={`MiniCartCarProduct${index.toString()}`}
          car={car}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.CAR)}
        />
      ))}
      {cartProducts[Product.STAY]?.map((stay: CartItem, index: number) => (
        <CartProduct
          key={`MiniCartStayProduct${index.toString()}`}
          item={stay}
          productType={Product.STAY}
          Icon={HotelIcon}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.STAY)}
        />
      ))}
      {cartProducts[Product.GTEStay]?.map((stay: CartItem, index: number) => (
        <CartProduct
          key={`MiniCartStayProduct${index.toString()}`}
          item={stay}
          productType={Product.STAY}
          Icon={HotelIcon}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.GTEStay)}
        />
      ))}
      {cartProducts[Product.CUSTOM]?.map((custom: CartItem, index: number) => (
        <CartProduct
          key={`MiniCartCustomProduct${index.toString()}`}
          item={custom}
          productType={Product.CUSTOM}
          Icon={HotelIcon}
          fetchUserData={fetchUserData}
          onRemoveItemClick={handleRemoveCartItem(Product.CUSTOM)}
        />
      ))}
      {cartProducts[Product.VacationPackage]?.map(
        (vacationPackage: CartItemWithExpiry, index: number) => (
          <CartProductWithExpiry
            key={`MiniCartVacationPackageProduct${index.toString()}`}
            vacationPackage={vacationPackage}
            fetchUserData={fetchUserData}
            onRemoveItemClick={handleRemoveCartItem(Product.VacationPackage)}
          />
        )
      )}
    </>
  );
};

export default MiniCartContent;
