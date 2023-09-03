import { useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";

import {
  constructFlightCartInput,
  writeFlightDataToLocalStorage,
  lsKeyFlightPaxInfo,
  lsKeyFlightContactInfo,
} from "./utils/flightUtils";
import AddFlightToCartMutation from "./queries/AddFlightToCartMutation.graphql";

import { useSettings } from "contexts/SettingsContext";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { datalayerAddProductToCart, DatalayerProduct } from "components/ui/Tracking/trackingUtils";
import { SupportedCurrencies } from "types/enums";
import { useCurrencyWithDefault } from "hooks/useCurrency";

const useAddFlightToCart = ({
  passengers,
  contactDetails,
  bookingToken,
  cartLink,
  passportRequired,
  datalayerProduct,
  cartItemId,
  healthDeclarationChecked,
  sessionId,
}: {
  passengers: FlightTypes.PassengerDetails[];
  contactDetails: FlightTypes.ContactDetails;
  bookingToken: string;
  cartLink: string;
  passportRequired: boolean;
  datalayerProduct: DatalayerProduct;
  cartItemId?: string;
  healthDeclarationChecked?: boolean;
  sessionId?: string;
}) => {
  const { marketplaceBaseCurrency } = useSettings();
  const { currencyCode } = useCurrencyWithDefault();
  const [addToCartMutation, { data, loading, error }] = useMutation<
    FlightTypes.MutationAddFlightToCartData,
    { input: FlightTypes.MutationAddFlightToCartInput }
  >(AddFlightToCartMutation);

  const addToCart = () => {
    datalayerAddProductToCart(datalayerProduct, marketplaceBaseCurrency as SupportedCurrencies);
    addToCartMutation({
      variables: {
        input: constructFlightCartInput({
          passengers,
          bookingToken,
          contactDetails,
          passportRequired,
          cartItemId,
          healthDeclarationChecked,
          sessionId,
          currencyCode,
        }),
      },
      fetchPolicy: "no-cache",
    });
  };

  useEffect(() => {
    if (data?.addFlightToCart?.success && data?.addFlightToCart?.available) {
      const lsPassengers = passengers.map(passenger => ({
        ...passenger,
        bags: {
          handBags: [],
          holdBags: [],
        },
      }));
      writeFlightDataToLocalStorage(lsPassengers, lsKeyFlightPaxInfo);
      writeFlightDataToLocalStorage(contactDetails, lsKeyFlightContactInfo);
      // eslint-disable-next-line functional/immutable-data
      window.location.href = addLeadingSlashIfNotPresent(cartLink);
    }
  }, [cartLink, contactDetails, data, error, passengers]);
  return {
    addToCartMutation: addToCart,
    addToCartLoading:
      (data && data.addFlightToCart.success && data.addFlightToCart.available) || loading,
    notAvailable: data && !data.addFlightToCart.available,
    isError: error,
  };
};

export default useAddFlightToCart;
