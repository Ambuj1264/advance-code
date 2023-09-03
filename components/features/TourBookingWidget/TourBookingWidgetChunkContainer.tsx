import React from "react";
import { useMediaQuery } from "react-responsive";

import TourBookingWidgetProvider from "./TourBookingWidgetProvider";
import TourBookingWidgetAvailableDatesOnLoad from "./TourBookingWidgetAvailableDatesOnLoad";

import CustomNextDynamic from "lib/CustomNextDynamic";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import BookingWidgetMobileLoadingContainer from "components/ui/BookingWidget/BookingWidgetMobileLoadingContainer";
import { breakpointsMax } from "styles/variables";
import useToggle from "hooks/useToggle";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import useEffectOnce from "hooks/useEffectOnce";
import { Product, SupportedCurrencies } from "types/enums";

const BookingWidgetContainer = CustomNextDynamic(
  () => import("components/features/TourBookingWidget/TourBookingWidgetContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const BookingWidgetFooterMobileContainer = CustomNextDynamic(
  () => import("components/features/TourBookingWidget/TourBookingWidgetFooterMobileContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetMobileLoadingContainer />,
  }
);

const BookingWidgetChunkContainer = ({
  id,
  tourType,
  basePrice,
  isLivePricing,
  lengthOfTour,
  slug,
  isFreePickup,
  transport,
  bookUrl,
  lowestPriceGroupSize,
  title,
  currentRequestAuth,
  cartItem,
}: {
  id: number;
  tourType: string;
  basePrice: number;
  isLivePricing: boolean;
  lengthOfTour: number;
  slug: string;
  isFreePickup: boolean;
  transport: PickupTransport;
  bookUrl: string;
  lowestPriceGroupSize: number;
  title: string;
  currentRequestAuth?: string;
  cartItem: number;
}) => {
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const [isModalOpen, toggleModal] = useToggle(false);

  useEffectOnce(() => {
    datalayerProductView(
      {
        id: id.toString(),
        name: title,
        price: basePrice.toString(),
        productType: Product.TOUR,
        marketplace,
      },
      marketplaceBaseCurrency as SupportedCurrencies
    );
    productDetailsDataLayerPush({
      name: title,
      id: id.toString(),
      price: basePrice,
      category: Product.TOUR,
    });
  });

  return (
    <BookingWidgetErrorBoundary>
      <TourBookingWidgetProvider
        id={id}
        tourType={tourType}
        isLivePricing={isLivePricing}
        basePrice={basePrice}
        lengthOfTour={lengthOfTour}
        slug={slug}
        isFreePickup={isFreePickup}
        transport={transport}
        lowestPriceGroupSize={lowestPriceGroupSize}
        title={title}
        currentRequestAuth={currentRequestAuth}
        cartItem={cartItem}
      >
        <div suppressHydrationWarning style={{ display: "contents" }}>
          {typeof window !== "undefined" && (isModalOpen || !isMobile) && (
            <BookingWidgetContainer
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
              bookUrl={bookUrl}
            />
          )}
          <TourBookingWidgetAvailableDatesOnLoad />
        </div>
        <BookingWidgetFooterMobileContainer toggleModal={toggleModal} isModalOpen={isModalOpen} />
      </TourBookingWidgetProvider>
    </BookingWidgetErrorBoundary>
  );
};

export default BookingWidgetChunkContainer;
