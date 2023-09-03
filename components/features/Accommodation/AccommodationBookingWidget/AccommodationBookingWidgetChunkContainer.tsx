import React, { memo } from "react";

import useEffectOnce from "hooks/useEffectOnce";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import { Product, SupportedCurrencies } from "types/enums";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import StayBookingWidgetContainer from "components/features/StayProductPage/StayBookingWidget/StayBookingWidgetContainer";
import useGetAccommodationAvailability from "components/features/StayProductPage/StayBookingWidget/useGetAccommodationAvailability";

const AccomodationBookingWidgetChunkContainer = ({
  basePrice,
  id,
  title,
  categoryId,
}: {
  basePrice: number;
  id: number;
  title: string;
  categoryId?: number;
}) => {
  const { marketplace, marketplaceBaseCurrency } = useSettings();

  useEffectOnce(() => {
    datalayerProductView(
      {
        id: id.toString(),
        name: title,
        price: basePrice.toString(),
        productType: Product.STAY,
        marketplace,
      },
      marketplaceBaseCurrency as SupportedCurrencies
    );
    productDetailsDataLayerPush({
      name: title,
      id: id.toString(),
      price: basePrice,
      category: Product.STAY,
    });
  });
  useGetAccommodationAvailability({ productId: id });
  return (
    <BookingWidgetErrorBoundary>
      <StayBookingWidgetContainer
        productId={id}
        productPageUri=""
        title={title}
        categoryId={categoryId}
      />
    </BookingWidgetErrorBoundary>
  );
};

export default memo(AccomodationBookingWidgetChunkContainer);
