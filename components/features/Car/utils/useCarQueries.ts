import { useQuery } from "@apollo/react-hooks";
import { useCallback, useContext, useEffect } from "react";

import checkCarOffer from "../queries/CheckCarQuery.graphql";
import CarBookingWidgetConstantContext from "../CarBookingWidget/contexts/CarBookingWidgetConstantContext";

import useDocumentHidden from "hooks/useDocumentHidden";
import { CarProvider } from "types/enums";
import { getFormattedDate, isoFormat } from "utils/dateUtils";

const CHECKED_POLL_INTERVAL_MS = 60000;

export const useCheckCarOffer = ({
  selectedCarId,
  skip = false,
}: {
  selectedCarId?: string;
  skip?: boolean;
}) => {
  const {
    pickupId,
    dropoffId,
    from: carFromDate,
    to: carToDate,
  } = useContext(CarBookingWidgetConstantContext);
  const dateFromISO = getFormattedDate(carFromDate, isoFormat);
  const dateToISO = getFormattedDate(carToDate, isoFormat);
  const {
    data: offerData,
    error: offerError,
    startPolling,
    stopPolling,
  } = useQuery<CarTypes.QueryCarOfferData>(checkCarOffer, {
    skip,
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
    notifyOnNetworkStatusChange: true,
    ...(!skip ? { pollInterval: CHECKED_POLL_INTERVAL_MS } : {}),
    onCompleted: () => {
      if (!offerError) {
        startPolling(CHECKED_POLL_INTERVAL_MS);
      } else {
        stopPolling();
      }
    },
  });

  const offerValid = Boolean(offerData && offerData.carOffer.offer && !offerError);

  useEffect(() => {
    if (!offerValid || skip) {
      stopPolling();
    }
  }, [skip, offerValid, stopPolling]);

  const onDocumentHiddenStatusChange = useCallback(() => {
    const isHidden = document.visibilityState === "hidden";
    if (isHidden) {
      stopPolling();
    }
    if (!isHidden && !skip) {
      startPolling(CHECKED_POLL_INTERVAL_MS);
    }
  }, [startPolling, stopPolling, skip]);

  useDocumentHidden({ onDocumentHiddenStatusChange });

  return {
    offerData,
    offerValid,
  };
};
