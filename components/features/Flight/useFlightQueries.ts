import { useQuery } from "@apollo/react-hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { NetworkStatus } from "apollo-client";

import FlightContentQuery from "./queries/FlightContentQuery.graphql";
import useFlightQueryParams from "./utils/useFlightQueryParams";
import FlightQuery from "./queries/FlightQuery.graphql";

import useEffectOnce from "hooks/useEffectOnce";
import { noCacheHeaders } from "utils/apiUtils";
import useDocumentHidden from "hooks/useDocumentHidden";

const NON_CHECKED_POLL_INTERVAL_MS = 2000;
const CHECKED_POLL_INTERVAL_MS = 15000;
const NON_CHECKED_MAX_RETRIES = 30;

export const useFlightContentQuery = () => {
  const [{ adults = 1, children = 0, infants = 0, bookingToken }] = useFlightQueryParams();

  const nrOfInfants = infants > adults ? adults : infants;

  const {
    data: flightContentData,
    error: flightContentError,
    loading: flightContentLoading,
  } = useQuery<{
    flightCheckFlight: FlightTypes.QueryFlightContentData;
    cartLink: string;
  }>(FlightContentQuery, {
    skip: !bookingToken,
    variables: {
      input: {
        adults,
        bookingToken,
        children,
        infants: nrOfInfants,
        isHold: true,
        numberOfBags: 0,
        numberOfPassengers: adults + children + nrOfInfants,
      },
    },
  });

  return {
    flightContentData,
    flightContentError,
    flightContentLoading,
  };
};

export const useFlightQuery = ({
  queryBaggage,
  bagCount,
  hasError,
  adults = 1,
  children = 0,
  infants = 0,
  bookingToken,
  skip = false,
}: {
  queryBaggage: FlightTypes.QueryPassengerBaggage[];
  bagCount: number;
  hasError: boolean;
  adults: number;
  children: number;
  infants: number;
  bookingToken?: string;
  skip?: boolean;
}) => {
  const sessionId = useRef<string | null>();
  const nrOfInfants = infants > adults ? adults : infants;
  const skipFetchingFlightQuery = skip || !bookingToken || hasError;
  const [isChecked, setIsChecked] = useState(false);
  const [nonCheckedRetries, setNonCheckedRetries] = useState(0);
  const {
    data: flightData,
    loading: flightLoading,
    error: flightError,
    startPolling,
    stopPolling,
    networkStatus: flightQueryStatus,
  } = useQuery<{
    flightCheckFlight: FlightTypes.QueryFlightData;
  }>(FlightQuery, {
    skip: skipFetchingFlightQuery,
    variables: {
      input: {
        adults,
        bookingToken,
        children,
        infants: nrOfInfants,
        isHold: true,
        numberOfBags: bagCount || 0,
        passengers: queryBaggage,
        flightSessionId: sessionId.current,
      },
    },
    fetchPolicy: "no-cache",
    context: {
      headers: noCacheHeaders,
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: isChecked ? CHECKED_POLL_INTERVAL_MS : undefined,
    onCompleted: data => {
      const flightCheckFlight = data?.flightCheckFlight;

      if (
        !isChecked &&
        !flightCheckFlight?.flightsChecked &&
        nonCheckedRetries < NON_CHECKED_MAX_RETRIES
      ) {
        startPolling(NON_CHECKED_POLL_INTERVAL_MS);
        setNonCheckedRetries(nonCheckedRetries + 1);
        sessionId.current = flightCheckFlight?.sessionId;
        return;
      }
      if (nonCheckedRetries >= NON_CHECKED_MAX_RETRIES) {
        stopPolling();
        return;
      }

      if (!isChecked && flightCheckFlight?.flightsChecked === true) {
        setIsChecked(true);
        startPolling(CHECKED_POLL_INTERVAL_MS);
      }
      if (flightCheckFlight?.flightsInvalid === true) {
        stopPolling();
      }
      sessionId.current = flightCheckFlight?.sessionId;
    },
  });

  useEffect(() => {
    stopPolling();
  }, [skipFetchingFlightQuery, stopPolling]);

  const onDocumentHiddenStatusChange = useCallback(() => {
    const isHidden = document.visibilityState === "hidden";
    if (isHidden) stopPolling();
    if (!isHidden && !skipFetchingFlightQuery)
      startPolling(isChecked ? CHECKED_POLL_INTERVAL_MS : NON_CHECKED_POLL_INTERVAL_MS);
  }, [isChecked, skipFetchingFlightQuery, startPolling, stopPolling]);

  useDocumentHidden({ onDocumentHiddenStatusChange });

  useEffectOnce(() => {
    return () => {
      stopPolling?.();
      sessionId.current = null;
    };
  });

  const flightsChecked = flightError
    ? false
    : flightData?.flightCheckFlight?.flightsChecked ?? false;
  const flightsInvalid = flightData?.flightCheckFlight?.flightsInvalid ?? false;
  const flightPrice = flightData?.flightCheckFlight?.flightPrice ?? 0;
  const bagsPrice = flightData?.flightCheckFlight?.totalBagPrice ?? 0;
  const price = flightPrice + bagsPrice;
  const priceChange = flightData?.flightCheckFlight?.priceChange ?? false;
  const showHealthDeclaration = flightData?.flightCheckFlight?.showHealthDeclaration ?? false;
  const flightsRefetching = flightQueryStatus === NetworkStatus.setVariables;

  return {
    flightData,
    flightError,
    flightsChecked,
    flightsInvalid,
    flightLoading,
    price,
    priceChange,
    showHealthDeclaration,
    flightsRefetching,
  };
};
