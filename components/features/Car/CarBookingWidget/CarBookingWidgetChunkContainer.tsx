import React from "react";
import { useMediaQuery } from "react-responsive";

import CarBookingWidgetProvider from "./CarBookingWidgetProvider";

import CustomNextDynamic from "lib/CustomNextDynamic";
import BookingWidgetMobileLoadingContainer from "components/ui/BookingWidget/BookingWidgetMobileLoadingContainer";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import { breakpointsMax } from "styles/variables";
import CarSearchWidgetProvider from "components/ui/CarSearchWidget/CarSearchWidgetProvider";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import useToggle from "hooks/useToggle";
import { CarProvider } from "types/enums";

const CarBookingWidgetContainer = CustomNextDynamic(() => import("./CarBookingWidgetContainer"), {
  ssr: false,
  loading: () => <BookingWidgetLoadingContainer />,
});

const CarBookingWidgetFooterMobile = CustomNextDynamic(
  () => import("./CarBookingWidgetFooterMobile"),
  { ssr: false, loading: () => <BookingWidgetMobileLoadingContainer /> }
);

const CarBookingWidgetChunkContainer = ({
  cartLink,
  offerId,
  from,
  to,
  pickupId,
  queryPickupId,
  dropoffId,
  queryDropoffId,
  searchPageUrl,
  carOffer,
  discount,
  editItem,
  provider,
  driverCountryCode,
  driverAge,
  title,
  queryPickupLocationName,
  queryDropoffLocationName,
  offerDropoffLocationName,
  offerPickupLocationName,
  editCarOfferCartId,
}: {
  cartLink: string;
  offerId: string;
  from: Date;
  to: Date;
  pickupId: number;
  queryPickupId: string;
  dropoffId: number;
  queryDropoffId: string;
  searchPageUrl: string;
  carOffer: CarTypes.CarOffer;
  discount?: number;
  editItem?: number;
  provider: CarProvider;
  driverCountryCode?: string;
  driverAge?: string;
  title: string;
  queryPickupLocationName?: string;
  queryDropoffLocationName?: string;
  offerDropoffLocationName: string;
  offerPickupLocationName: string;
  editCarOfferCartId?: string;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <BookingWidgetErrorBoundary>
      <CarBookingWidgetProvider
        isModalOpen={isModalOpen}
        provider={provider}
        toggleModal={toggleModal}
        cartLink={cartLink}
        id={offerId}
        from={from}
        to={to}
        pickupId={pickupId}
        dropoffId={dropoffId}
        queryPickupId={queryPickupId}
        queryDropoffId={queryDropoffId}
        searchPageUrl={searchPageUrl}
        carOffer={carOffer}
        discount={discount}
        editItem={editItem}
        driverCountryCode={driverCountryCode}
        driverAge={driverAge}
        title={title}
        queryPickupLocationName={offerPickupLocationName}
        queryDropoffLocationName={offerDropoffLocationName}
        editCarOfferCartId={editCarOfferCartId}
      >
        <CarSearchWidgetProvider
          selectedDates={{ from, to }}
          pickupId={queryPickupId}
          dropoffId={queryDropoffId}
          dropoffLocationName={queryDropoffLocationName || offerDropoffLocationName}
          pickupLocationName={queryPickupLocationName || offerPickupLocationName}
        >
          <div suppressHydrationWarning style={{ display: "contents" }}>
            {typeof window !== "undefined" && (isModalOpen || !isMobile) && (
              <CarBookingWidgetContainer provider={provider} />
            )}
          </div>
          {isMobile && !isModalOpen && <CarBookingWidgetFooterMobile />}
        </CarSearchWidgetProvider>
      </CarBookingWidgetProvider>
    </BookingWidgetErrorBoundary>
  );
};

export default CarBookingWidgetChunkContainer;
