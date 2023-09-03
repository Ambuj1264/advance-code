import React, { useContext } from "react";

import { VPCarStateContext, VPCarCallbackContext } from "../contexts/VPCarStateContext";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import { useOnSelectCarOffer } from "./vpCarSectionHooks";
import VPCarSection from "./VPCarSection";

import useOnDidUpdate from "hooks/useOnDidUpdate";
import { useAddNotification } from "components/features/ProductPageNotification/contexts/NotificationStateHooks";
import { useCheckCarOffer } from "components/features/Car/utils/useCarQueries";

const VPCarSectionContextWrapper = ({ vacationLength }: { vacationLength: number }) => {
  const {
    carResults,
    selectedCarId,
    carOffersLoading,
    carOffersError,
    selectedCarOffer,
    carNotification,
    shouldSkipPolling,
  } = useContext(VPCarStateContext);
  const { vacationIncludesFlight, selectedFlight } = useContext(VPFlightStateContext);
  const { onCarOffersRefetch } = useContext(VPCarCallbackContext);
  const { carOfferData, carOfferLoading, carOfferError } = useOnSelectCarOffer();
  const { onSelectVPCarOffer } = useContext(VPActionCallbackContext);

  const { offerValid, offerData } = useCheckCarOffer({
    selectedCarId,
    skip: shouldSkipPolling,
  });

  const onAddNotification = useAddNotification();

  useOnDidUpdate(() => {
    if (!shouldSkipPolling && offerData && !offerValid) {
      onCarOffersRefetch();
    }
  }, [shouldSkipPolling, offerData, offerValid, onCarOffersRefetch]);
  useOnDidUpdate(() => {
    if (carNotification) {
      onAddNotification(carNotification);
    }
  }, [carNotification, onAddNotification]);

  return (
    <VPCarSection
      vacationLength={vacationLength}
      carOfferData={carOfferData}
      carOfferLoading={carOfferLoading}
      carOfferError={carOfferError}
      vpCarsByPopularity={carResults}
      carOffersLoading={carOffersLoading}
      carOffersError={carOffersError}
      constructOnSelectCarOffer={onSelectVPCarOffer}
      selectedCarId={selectedCarId}
      vacationIncludesFlight={vacationIncludesFlight}
      selectedFlight={selectedFlight}
      selectedCarOffer={selectedCarOffer}
    />
  );
};

export default VPCarSectionContextWrapper;
