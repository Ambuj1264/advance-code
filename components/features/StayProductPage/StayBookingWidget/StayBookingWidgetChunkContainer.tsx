import React from "react";

import StayBookingWidgetContainer from "./StayBookingWidgetContainer";
import useGetStayAvailability from "./useGetStayAvailability";

import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import { Product, SupportedCurrencies } from "types/enums";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import useEffectOnce from "hooks/useEffectOnce";

const StayBookingWidgetChunkContainer = ({
  productId,
  productPageUri,
  productTitle,
  fromPrice,
  ipCountryCode,
}: {
  productId: number;
  productPageUri: string;
  productTitle: string;
  fromPrice: number;
  ipCountryCode?: string;
}) => {
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  useEffectOnce(() => {
    datalayerProductView(
      {
        id: productId.toString(),
        name: productTitle,
        price: fromPrice.toString(),
        productType: Product.STAY,
        marketplace,
      },
      marketplaceBaseCurrency as SupportedCurrencies
    );
    productDetailsDataLayerPush({
      name: productTitle,
      id: productId.toString(),
      price: fromPrice,
      category: Product.TOUR,
    });
  });
  useGetStayAvailability({ productId, ipCountryCode });
  return (
    <BookingWidgetErrorBoundary>
      <StayBookingWidgetContainer
        productId={productId}
        productPageUri={productPageUri}
        title={productTitle}
      />
    </BookingWidgetErrorBoundary>
  );
};

export default StayBookingWidgetChunkContainer;
