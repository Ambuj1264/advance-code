import { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";

import AddVPToCartMutation from "../queries/AddVPToCartMutation.graphql";
import {
  constructVpAddToCartFlightData,
  constructVpAddToCartInput,
  constructVpAddToCartStaysData,
} from "../VPBookingWidget/utils/vpBookingWidgetUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { SupportedCurrencies } from "types/enums";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { datalayerAddProductToCart, DatalayerProduct } from "components/ui/Tracking/trackingUtils";

const useAddVpToCart = ({
  vacationProductId,
  requestId,
  dateFrom,
  dateTo,
  occupancies,
  vacationIncludesFlight,
  selectedFlight,
  passengers,
  selectedCarId,
  selectedExtras,
  selectedInsurances,
  driverAge,
  driverCountryCode,
  selectedHotelsRooms,
  cartLink,
  datalayerProduct,
  origin,
  originId,
  vpCountryCode,
  selectedTours,
  vacationIncludesCar,
  carPickupId,
}: {
  vacationProductId: string;
  requestId: string;
  dateFrom: Date;
  dateTo: Date;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  vacationIncludesFlight: boolean;
  selectedFlight?: VacationPackageTypes.VacationFlightItinerary;
  passengers: FlightTypes.PassengerDetails[];
  selectedCarId?: string;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  driverAge: string;
  driverCountryCode: string;
  selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[];
  cartLink: string;
  datalayerProduct: DatalayerProduct;
  origin: string;
  originId: string;
  vpCountryCode: string;
  selectedTours: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput[];
  vacationIncludesCar: boolean;
  carPickupId?: string;
}) => {
  const [addToCartMutation, { data, loading, error }] = useMutation<
    VacationPackageTypes.MutationAddVpToCartData,
    { input: VacationPackageTypes.MutationAddVpToCartInput }
  >(AddVPToCartMutation);
  const { currencyCode } = useCurrencyWithDefault();
  const addToCart = useCallback(() => {
    datalayerAddProductToCart(datalayerProduct, currencyCode as SupportedCurrencies);

    const flightData = constructVpAddToCartFlightData({
      vacationIncludesFlight,
      selectedFlight,
      passengers,
    });

    const carData = vacationIncludesCar
      ? {
          id: selectedCarId!,
          selectedExtras,
          selectedInsurances,
          driverAge,
          driverCountryCode,
        }
      : undefined;

    const staysData = constructVpAddToCartStaysData({
      selectedHotelsRooms,
    });
    addToCartMutation({
      variables: {
        input: constructVpAddToCartInput({
          vacationProductId,
          requestId,
          dateFrom,
          dateTo,
          occupancies,
          flightData,
          carData,
          staysData,
          originName: origin,
          originId,
          originCountryCode: vpCountryCode,
          selectedTours,
          currencyCode,
          carPickupId,
        }),
      },
      fetchPolicy: "no-cache",
    });
  }, [
    addToCartMutation,
    currencyCode,
    datalayerProduct,
    dateFrom,
    dateTo,
    driverAge,
    driverCountryCode,
    origin,
    originId,
    passengers,
    requestId,
    selectedCarId,
    selectedExtras,
    selectedFlight,
    selectedInsurances,
    selectedHotelsRooms,
    occupancies,
    vacationIncludesFlight,
    vacationProductId,
    vpCountryCode,
    selectedTours,
    vacationIncludesCar,
    carPickupId,
  ]);

  useEffect(() => {
    if (data?.addVacationPackageToCart?.success) {
      // eslint-disable-next-line functional/immutable-data
      window.location.href = addLeadingSlashIfNotPresent(cartLink);
    }
  }, [cartLink, data, error]);

  return {
    addToCartMutation: addToCart,
    isAddToCartLoading: loading,
    isError: error,
  };
};

export default useAddVpToCart;
