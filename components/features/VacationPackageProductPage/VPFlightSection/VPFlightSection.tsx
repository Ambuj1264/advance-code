import React, { memo, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { ApolloError, NetworkStatus } from "apollo-client";

import FlightStateContext from "../../Flight/contexts/FlightStateContext";
import { getBagCount, getQueryBaggage } from "../../Flight/utils/flightUtils";
import { useFlightQuery } from "../../Flight/useFlightQueries";
import { VPFlightStateContext, VPFlightCallbackContext } from "../contexts/VPFlightStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";

import VPProductFlightCard from "./VPProductFlightCard";
import { useOnFlightItinerarySelect } from "./vpFlightSectionHooks";

import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import FlightCardSkeleton from "components/ui/FlightsShared/FlightCardSkeleton";
import { useAddNotification } from "components/features/ProductPageNotification/contexts/NotificationStateHooks";
import { Product } from "types/enums";
import useOnDidUpdate from "hooks/useOnDidUpdate";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledCardSkeleton = styled(FlightCardSkeleton)`
  height: 451px;
`;

const VPFlightSectionContent = ({
  flightSearchResults,
  onItinerarySelectHandler,
  selectedFlightId,
  flightBaggageQueryError,
  flightSearchLoading,
  flightSearchError,
}: {
  flightSearchResults: VacationPackageTypes.VacationFlightItinerary[];
  onItinerarySelectHandler: (selectedProductId: string) => void;
  flightSearchLoading: boolean;
  selectedFlightId?: string;
  flightBaggageQueryError?: ApolloError;
  flightSearchError?: ApolloError;
}) => {
  if (flightSearchLoading) {
    return (
      <ProductCardRow>
        {[...Array(3)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledSimilarProductsColumn key={`VPSkeleton${i.toString()}`} productsCount={3}>
            <StyledCardSkeleton />
          </StyledSimilarProductsColumn>
        ))}
      </ProductCardRow>
    );
  }

  if (flightSearchError || flightSearchResults.length === 0) return null;
  return (
    <ProductCardRow>
      {flightSearchResults.map((itineraryItem: VacationPackageTypes.VacationFlightItinerary) => {
        return (
          <StyledSimilarProductsColumn
            key={itineraryItem.id}
            productsCount={flightSearchResults.length}
          >
            <VPProductFlightCard
              itinerary={itineraryItem}
              onItinerarySelect={onItinerarySelectHandler}
              selectedFlightId={selectedFlightId}
              flightBaggageQueryError={flightBaggageQueryError}
            />
          </StyledSimilarProductsColumn>
        );
      })}
    </ProductCardRow>
  );
};

const MemoizedVPFlightSectionContent = memo(VPFlightSectionContent);

const VPFlightSection = () => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const {
    selectedFlight,
    flightsResults,
    flightSearchLoading,
    flightSearchError,
    flightSearchStatus,
    flightsRefetching,
    flightsLoadError,
  } = useContext(VPFlightStateContext);
  const { occupancies, staysLoadError } = useContext(VPStayStateContext);
  const { flightSearchRefetch } = useContext(VPFlightCallbackContext);
  const { onVPFlightItinerarySelect, onIncludeVPFlightsToggle } =
    useContext(VPActionCallbackContext);
  const numberOfTravelers = getTravelersFromOccupancies(occupancies);
  const selectedFlightId = selectedFlight?.id;
  const { passengers } = useContext(FlightStateContext);
  const { flightQueryData, flightBaggageQueryError } = useOnFlightItinerarySelect();

  const { flightError, flightData, flightsInvalid } = useFlightQuery({
    queryBaggage: getQueryBaggage(passengers),
    bagCount: getBagCount(passengers),
    hasError: Boolean(
      flightBaggageQueryError || !flightQueryData?.flightCheckFlight || staysLoadError
    ),
    adults: numberOfTravelers.adults,
    children: numberOfTravelers.children,
    infants: numberOfTravelers.infants,
    bookingToken: selectedFlightId,
    skip: Boolean(
      !selectedFlightId || !flightQueryData || flightSearchLoading || flightSearchError
    ),
  });
  const onAddNotification = useAddNotification();

  useEffect(() => {
    if (flightsLoadError) {
      onIncludeVPFlightsToggle(false);
      onAddNotification({
        ribbonText: t("Cannot find flights for selected dates. Please, try to choose other dates."),
        productType: Product.FLIGHT,
      });
    }
  }, [flightsLoadError, onAddNotification, t, onIncludeVPFlightsToggle]);

  const isExpiredFlight =
    !flightSearchLoading && !flightSearchError && flightsInvalid && flightData && !flightError;

  useEffect(() => {
    if (isExpiredFlight) {
      flightSearchRefetch();
    }
  }, [isExpiredFlight, flightSearchRefetch]);

  useOnDidUpdate(() => {
    if (flightSearchStatus === NetworkStatus.ready && flightsRefetching) {
      onAddNotification({
        ribbonText:
          "The previously selected flight offers have expired and we have replaced them with new offers for you!",
        productType: Product.FLIGHT,
      });
    }
  }, [flightSearchStatus, flightsRefetching, onAddNotification]);

  return (
    <MemoizedVPFlightSectionContent
      selectedFlightId={selectedFlightId}
      onItinerarySelectHandler={onVPFlightItinerarySelect}
      flightSearchResults={flightsResults}
      flightSearchLoading={flightSearchLoading}
      flightSearchError={flightSearchError}
      flightBaggageQueryError={flightBaggageQueryError}
    />
  );
};
export default VPFlightSection;
