import React, { useCallback, useContext, useMemo } from "react";

import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { VPStateContext } from "../contexts/VPStateContext";
import useAddVpToCart from "../hooks/useAddVpToCart";
import { VPCarStateContext } from "../contexts/VPCarStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import { VPTourStateContext } from "../contexts/VPTourStateContext";
import {
  VPPriceStateContext,
  VP_DEFAULT_CAR_DESTINATION_ID,
} from "../contexts/VPPriceStateContext";
import { VPModalStateContext } from "../contexts/VPModalStateContext";

import VPBookingWidgetDesktop from "./VPBookingWidgetDesktop";
import VPBookingWidgetMobile from "./VPBookingWidgetMobile";

import useEffectOnce from "hooks/useEffectOnce";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import { Product, SupportedCurrencies } from "types/enums";
import CarBookingWidgetStateContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetStateContext";
import FlightStateContext from "components/features/Flight/contexts/FlightStateContext";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";

const VPBookingWidget = ({
  title,
  destinationName,
  destinationId,
  vacationPackageDays,
  cartLink,
}: {
  title?: string;
  destinationName?: string;
  destinationId?: string;
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  cartLink: string;
}) => {
  const isMobile = useIsMobile();
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const { tripId, requestId, selectedDates, vpCountryCode, isSadPathWithoutParams } =
    useContext(VPStateContext);
  const { isMobileSearchOpen, bookingWidgetView, isBookingStepsOpen } =
    useContext(VPModalStateContext);
  const { vpPrice, isVPPriceAvailable } = useContext(VPPriceStateContext);
  const { selectedTours } = useContext(VPTourStateContext);
  const { vacationIncludesFlight, selectedFlight, origin, originId } =
    useContext(VPFlightStateContext);
  const {
    vacationIncludesCar,
    selectedCarId,
    driverAge,
    driverCountryCode,
    carPriceDestinationId,
  } = useContext(VPCarStateContext);
  const { selectedHotelsRooms, occupancies } = useContext(VPStayStateContext);
  const { selectedExtras, selectedInsurances } = useContext(CarBookingWidgetStateContext);
  const { passengers } = useContext(FlightStateContext);
  const carPickupId =
    carPriceDestinationId === VP_DEFAULT_CAR_DESTINATION_ID ? undefined : carPriceDestinationId;

  const datalayerProduct = useMemo(
    () => ({
      id: tripId,
      name: title || "",
      price: vpPrice ? vpPrice.toString() : "",
      productType: Product.VacationPackage,
      marketplace,
    }),
    [marketplace, vpPrice, title, tripId]
  );

  useEffectOnce(() => {
    datalayerProductView(datalayerProduct, marketplaceBaseCurrency as SupportedCurrencies);
    productDetailsDataLayerPush({
      name: title || "",
      id: tripId,
      price: vpPrice,
      category: Product.VacationPackage,
    });
  });

  const { addToCartMutation, isAddToCartLoading } = useAddVpToCart({
    requestId,
    vacationProductId: tripId,
    dateFrom: selectedDates.from!,
    dateTo: selectedDates.to!,
    occupancies,
    vacationIncludesCar,
    vacationIncludesFlight,
    passengers,
    selectedFlight,

    selectedCarId,
    selectedExtras,
    selectedInsurances,
    driverAge,
    driverCountryCode,
    carPickupId,

    selectedHotelsRooms,

    datalayerProduct,
    cartLink,

    origin,
    originId,
    vpCountryCode,

    selectedTours,
  });

  const onAddToCart = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      const isFlightValidationPassed = vacationIncludesFlight ? Boolean(selectedFlight?.id) : true;
      const isCarValidationPassed = vacationIncludesCar ? selectedCarId : true;
      // TODO: Add validation from booking widget.
      if (isCarValidationPassed && isFlightValidationPassed && selectedHotelsRooms?.length) {
        addToCartMutation();
      }
    },
    [
      addToCartMutation,
      selectedCarId,
      selectedFlight?.id,
      vacationIncludesFlight,
      vacationIncludesCar,
      selectedHotelsRooms?.length,
    ]
  );

  return (
    <BookingWidgetErrorBoundary>
      <BookingWidgetForm id="vp-booking-widget-form" method="POST" onSubmit={onAddToCart}>
        {isMobile ? (
          <VPBookingWidgetMobile
            onAddToCart={onAddToCart}
            destinationName={destinationName}
            destinationId={destinationId}
            vacationPackageDays={vacationPackageDays}
            isAddToCartLoading={isAddToCartLoading}
            isVPPriceAvailable={isVPPriceAvailable}
            isMobileSearchOpen={isMobileSearchOpen}
            bookingWidgetView={bookingWidgetView}
            isBookingStepsOpen={isBookingStepsOpen}
            isSadPathWithoutParams={isSadPathWithoutParams}
          />
        ) : (
          <VPBookingWidgetDesktop
            onAddToCart={onAddToCart}
            destinationName={destinationName}
            destinationId={destinationId}
            vacationPackageDays={vacationPackageDays}
            isAddToCartLoading={isAddToCartLoading}
            isVPPriceAvailable={isVPPriceAvailable}
          />
        )}
      </BookingWidgetForm>
    </BookingWidgetErrorBoundary>
  );
};

export default VPBookingWidget;
