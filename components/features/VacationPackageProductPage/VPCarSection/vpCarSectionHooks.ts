import { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { VPCarStateContext } from "../contexts/VPCarStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import { useTranslation } from "i18n";
import CarOfferQuery from "components/features/Car/queries/CarOfferQuery.graphql";
import CarBookingWidgetConstantContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetConstantContext";
import { CarProvider } from "types/enums";
import { getFormattedDate, isoFormat } from "utils/dateUtils";
import { constructOffer } from "components/features/Car/utils/carUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Namespaces } from "shared/namespaces";
import { noCacheHeaders } from "utils/apiUtils";

export const useOnSelectCarOffer = () => {
  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const { t: carT } = useTranslation(Namespaces.carNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    pickupId,
    dropoffId,
    from: carFromDate,
    to: carToDate,
  } = useContext(CarBookingWidgetConstantContext);
  const dateFromISO = getFormattedDate(carFromDate, isoFormat);
  const dateToISO = getFormattedDate(carToDate, isoFormat);
  const { carResults, carOffersLoading, selectedCarId, shouldSkipPolling } =
    useContext(VPCarStateContext);
  const { onSetVPCarOffer } = useContext(VPActionCallbackContext);
  const carOffersReady = Boolean(!carOffersLoading && carResults && carResults.length > 0);
  const {
    data: carOfferData,
    error: carOfferError,
    loading: carOfferLoading,
  } = useQuery<CarTypes.QueryCarOfferData>(CarOfferQuery, {
    variables: {
      input: {
        offerReference: selectedCarId,
        provider: CarProvider.CARNECT,
        from: dateFromISO,
        to: dateToISO,
        pickupLocationId: String(pickupId),
        returnLocationId: String(dropoffId),
      },
    },
    skip: !selectedCarId || !carOffersReady || shouldSkipPolling,
    notifyOnNetworkStatusChange: true,
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    onCompleted: carData => {
      const { carOffer } = constructOffer(
        carnectT,
        carT,
        convertCurrency,
        currencyCode,
        "",
        carData
      );
      onSetVPCarOffer(carOffer);
    },
  });

  return {
    carOfferData,
    carOfferError,
    carOfferLoading,
  };
};
