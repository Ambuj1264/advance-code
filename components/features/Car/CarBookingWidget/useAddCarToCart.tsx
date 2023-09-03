/* eslint-disable camelcase */
import { useContext } from "react";
import { useMutation } from "@apollo/react-hooks";

import AddToCartMutation from "../queries/AddCarToCartMutation.graphql";
import AddToCartGTEMutation from "../queries/AddCarToCartGTEMutation.graphql";
import { constructCarRentalCartInput, constructGTECarRentalCartInput } from "../utils/carUtils";

import CarBookingWidgetConstantContext from "./contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetStateContext from "./contexts/CarBookingWidgetStateContext";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { CarProvider, Marketplace, Product, SupportedCurrencies } from "types/enums";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { datalayerAddProductToCart } from "components/ui/Tracking/trackingUtils";
import { useSettings } from "contexts/SettingsContext";

const useAddCarToCart = (provider: CarProvider) => {
  const { marketplace } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    id,
    from,
    to,
    pickupId,
    dropoffId,
    queryPickupId,
    queryDropoffId,
    driverAge,
    driverCountryCode,
    cartLink,
    title,
    editItem,
  } = useContext(CarBookingWidgetConstantContext);
  const {
    extras,
    selectedExtras,
    insurances,
    selectedInsurances,
    pickupSpecify,
    dropoffSpecify,
    fullPrice,
  } = useContext(CarBookingWidgetStateContext);
  const [addToCartMutation, { data, loading }] = useMutation<
    {
      addCarToCart: {
        success: boolean;
      };
    },
    CarTypes.MutationAddCarToCarInput
  >(AddToCartMutation, {
    onCompleted: ({ addCarToCart }) => {
      if (addCarToCart.success) {
        // eslint-disable-next-line functional/immutable-data
        window.location.href = addLeadingSlashIfNotPresent(cartLink);
      }
    },
  });

  const [addToCartGTEMutation, { data: gteData, loading: gteLoading }] = useMutation<
    {
      carAddToCart: {
        success: boolean;
      };
    },
    {
      input: CarTypes.MutationGTEAddCarToCartInput;
    }
  >(AddToCartGTEMutation, {
    onCompleted: ({ carAddToCart }) => {
      if (carAddToCart.success) {
        // eslint-disable-next-line functional/immutable-data
        window.location.href = addLeadingSlashIfNotPresent(cartLink);
      }
    },
  });
  const addToCart = () => {
    datalayerAddProductToCart(
      {
        id,
        name: title,
        productType: Product.CAR,
        price: convertCurrency(fullPrice!).toString(),
        marketplace,
      },
      currencyCode as SupportedCurrencies
    );

    addToCartMutation({
      variables: constructCarRentalCartInput({
        driverAge,
        driverCountryCode,
        dropoffId,
        dropoffSpecify,
        from,
        to,
        id,
        pickupId,
        pickupSpecify,
        provider,
        queryDropoffId,
        queryPickupId,
        extras,
        selectedExtras,
        insurances,
        selectedInsurances,
        cartId: editItem,
      }),
    });
  };
  const addToCartGTE = () => {
    datalayerAddProductToCart(
      {
        id,
        name: title,
        productType: Product.CAR,
        price: convertCurrency(fullPrice!).toString(),
        marketplace,
      },
      currencyCode as SupportedCurrencies
    );
    addToCartGTEMutation({
      variables: {
        input: constructGTECarRentalCartInput({
          id,
          selectedExtras,
          selectedInsurances,
          driverAge,
          driverCountryCode,
        }),
      },
    });
  };
  if (marketplace === Marketplace.GUIDE_TO_EUROPE) {
    return {
      addToCartMutation: addToCartGTE,
      addToCartLoading: (gteData && gteData.carAddToCart.success) || gteLoading,
      isNotSuccessful: gteData && !gteData.carAddToCart.success,
    };
  }
  return {
    addToCartMutation: addToCart,
    addToCartLoading: (data && data.addCarToCart.success) || loading,
    isNotSuccessful: data && !data.addCarToCart.success,
  };
};

export default useAddCarToCart;
