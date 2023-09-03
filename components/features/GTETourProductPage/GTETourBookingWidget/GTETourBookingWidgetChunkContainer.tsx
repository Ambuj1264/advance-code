import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import GTETourAgeBandsQuery from "./queries/GTETourAgeBandsQuery.graphql";
import { getTravelerOptions, getPriceGroups } from "./utils/gteTourBookingWidgetUtils";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourBookingWidgetContainer from "./GTETourBookingWidgetContainer";

import { Product, SupportedCurrencies } from "types/enums";
import useTourSearchParams from "components/features/SearchPage/useTourSearchQueryParams";
import CustomNextDynamic from "lib/CustomNextDynamic";
import BookingWidgetMobileLoadingContainer from "components/ui/BookingWidget/BookingWidgetMobileLoadingContainer";
import useToggle from "hooks/useToggle";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import {
  datalayerProductView,
  productDetailsDataLayerPush,
} from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";
import useEffectOnce from "hooks/useEffectOnce";

const GTETourBookingWidgetFooterMobileContainer = CustomNextDynamic(
  () => import("./GTETourBookingWidgetFooterMobileContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetMobileLoadingContainer />,
  }
);

const GTETourBookingWidgetChunkContainer = ({
  productUrl,
  productId,
  numberOfDays,
  fromPrice,
  productTitle,
}: {
  productUrl: string;
  productId: string;
  numberOfDays: number;
  fromPrice: number;
  productTitle: string;
}) => {
  const { marketplace, marketplaceBaseCurrency } = useSettings();
  const { setContextState } = useGTETourBookingWidgetContext();
  const [{ adults, childrenAges }] = useTourSearchParams();
  const [isModalOpen, toggleModal] = useToggle(false);
  const { data: ageData } = useQuery<{
    toursAndTicketsGetAgeBands: GTETourBookingWidgetTypes.QueryAgeBandData;
  }>(GTETourAgeBandsQuery, {
    variables: {
      productCode: productId,
    },
    skip: !productId,
  });

  useEffect(() => {
    if (ageData) {
      setContextState({
        numberOfTravelers: getTravelerOptions(
          ageData.toursAndTicketsGetAgeBands,
          adults,
          childrenAges
        ),
        priceGroups: getPriceGroups(ageData.toursAndTicketsGetAgeBands),
        maxTravelersPerBooking: ageData.toursAndTicketsGetAgeBands.maxTravelersPerBooking,
        requiresAdultForBooking: ageData.toursAndTicketsGetAgeBands.requiresAdultForBooking,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setContextState, ageData]);

  useEffectOnce(() => {
    datalayerProductView(
      {
        id: productId,
        name: productTitle,
        price: fromPrice.toString(),
        productType: Product.GTETour,
        marketplace,
      },
      marketplaceBaseCurrency as SupportedCurrencies
    );
    productDetailsDataLayerPush({
      name: productTitle,
      id: productId,
      price: fromPrice,
      category: Product.GTETour,
    });
  });
  return (
    <BookingWidgetErrorBoundary>
      <GTETourBookingWidgetContainer
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        productUrl={productUrl}
        productId={productId}
        numberOfDays={numberOfDays}
        fromPrice={fromPrice}
        title={productTitle}
      />
      <GTETourBookingWidgetFooterMobileContainer
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        isFormLoading={false}
        fromPrice={fromPrice}
      />
    </BookingWidgetErrorBoundary>
  );
};

export default GTETourBookingWidgetChunkContainer;
