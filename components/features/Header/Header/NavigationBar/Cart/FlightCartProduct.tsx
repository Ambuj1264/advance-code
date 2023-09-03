import React, { useMemo } from "react";

import CartProduct from "./CartProduct";
import { CartItem, FlightCartItem } from "./MiniCart";

import FlightIcon from "components/icons/plane-1.svg";
import { isExpiredFlight } from "components/ui/FlightsShared/flightsSharedUtils";
import { Product } from "types/enums";
import { gteImgixUrl } from "utils/imageUtils";

const MiniCartContent = ({
  flight,
  fetchUserData,
  onRemoveItemClick,
}: {
  flight: FlightCartItem;
  fetchUserData: () => void;
  onRemoveItemClick: (idToRemove: string) => void;
}) => {
  const { isExpiredOffer } = useMemo(
    () => isExpiredFlight(flight.expiredTime),
    [flight.expiredTime]
  );
  const itemWithImage = {
    ...flight,
    imageUrl: `${gteImgixUrl}/XaXMglrtSoqPcU3CxOQu`,
  };
  return (
    <CartProduct
      item={itemWithImage as CartItem}
      productType={Product.FLIGHT}
      Icon={FlightIcon}
      isAvailable={!isExpiredOffer}
      fetchUserData={fetchUserData}
      onRemoveItemClick={onRemoveItemClick}
    />
  );
};

export default MiniCartContent;
