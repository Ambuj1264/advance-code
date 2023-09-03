import { useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";

import AddGTETourToCartMutation from "./queries/addGTETourToCart.graphql";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { constructGTETourCartInput } from "./utils/cartUtils";

import { Product, SupportedCurrencies } from "types/enums";
import { datalayerAddProductToCart } from "components/ui/Tracking/trackingUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { useSettings } from "contexts/SettingsContext";
import { getLanguagePrefix, addLeadingSlashIfNotPresent } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";

const useAddGTETourToCart = ({
  productCode,
  productUrl,
  title = "",
}: {
  productCode: string;
  productUrl: string;
  title?: string;
}) => {
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    selectedDates,
    numberOfTravelers,
    selectedTourOption,
    bookingQuestions,
    travelerQuestions,
    allowCustomTravelerPickup,
    totalPrice,
  } = useGTETourBookingWidgetContext();
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const [addToCartMutation, { data, loading, error }] = useMutation<
    {
      addToursAndTicketToCart: {
        success: boolean;
      };
    },
    {
      input: GTETourBookingWidgetTypes.MutationAddGTETourToCartInput;
    }
  >(AddGTETourToCartMutation, {
    onCompleted: ({ addToursAndTicketToCart }) => {
      if (addToursAndTicketToCart.success) {
        const cartLink = addLeadingSlashIfNotPresent(`${languagePrefix}cart`);
        // eslint-disable-next-line functional/immutable-data
        window.location.href = cartLink;
      }
    },
  });
  const addToCart = useCallback(() => {
    datalayerAddProductToCart(
      {
        id: productCode,
        name: title,
        productType: Product.GTETour,
        price: convertCurrency(totalPrice).toString(),
        marketplace,
      },
      currencyCode as SupportedCurrencies
    );
    const input = constructGTETourCartInput({
      productCode,
      travelDate: selectedDates.from!,
      numberOfTravelers,
      bookingQuestions,
      travelerQuestions,
      selectedTourOption: selectedTourOption!,
      productUrl,
      allowCustomTravelerPickup,
    });
    addToCartMutation({
      variables: {
        input,
      },
      fetchPolicy: "no-cache",
    });
  }, [
    addToCartMutation,
    numberOfTravelers,
    bookingQuestions,
    travelerQuestions,
    selectedTourOption,
    selectedDates,
  ]);
  const success = Boolean(data?.addToursAndTicketToCart?.success) && !error;
  return {
    addToCartMutation: addToCart,
    addToCartLoading: loading || success,
  };
};

export default useAddGTETourToCart;
