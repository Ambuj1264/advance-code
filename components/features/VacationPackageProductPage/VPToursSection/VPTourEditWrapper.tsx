import React, { useEffect, useMemo, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPTourStateContext, VPTourCallbackContext } from "../contexts/VPTourStateContext";

import VPTourEditButton from "./VPTourEditButton";
import { constructTourModalId } from "./utils/vpToursUtils";

import { useGTETourBookingWidgetContext } from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetStateContext";
import {
  getTravelerOptions,
  getPriceGroups,
} from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import GTETourAgeBandsQuery from "components/features/GTETourProductPage/GTETourBookingWidget/queries/GTETourAgeBandsQuery.graphql";
import { noCacheHeaders } from "utils/apiUtils";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

const VPTourEditWrapper = ({
  productId,
  editModalId,
  editModalTitle,
  isFormEditModal = false,
  dayNumber,
  tourDate,
  isProductSubmitted,
  occupancies,
}: {
  productId: string;
  editModalId: VPActiveModalTypes;
  editModalTitle?: { Icon: React.ElementType; title: string };
  isFormEditModal?: boolean;
  dayNumber: number;
  tourDate: string;
  isProductSubmitted: boolean;
  occupancies: StayBookingWidgetTypes.Occupancy[];
}) => {
  const [isEditModalActive, toggleEditModal] = useOnToggleModal(
    editModalId,
    constructTourModalId(productId, dayNumber)
  );
  const numberOfTravelers = useMemo(() => {
    const totalGuests = getTotalGuests(occupancies);
    return {
      adults: totalGuests.numberOfAdults,
      children: totalGuests.childrenAges,
    };
  }, [occupancies]);
  const { selectedTours } = useContext(VPTourStateContext);
  const { onSetSingleTourLoading } = useContext(VPTourCallbackContext);
  const existingTour = selectedTours.find(selectedTour => {
    const matchedTourId = selectedTour.productCode === productId;
    const matchedTourDate = tourDate !== "" ? selectedTour.travelDate === tourDate : true;
    return matchedTourId && matchedTourDate;
  });

  const {
    setContextState,
    selectedTourOption,
    numberOfTravelers: tourTravelers,
  } = useGTETourBookingWidgetContext();
  const { loading } = useQuery<{
    toursAndTicketsGetAgeBands: GTETourBookingWidgetTypes.QueryAgeBandData;
  }>(GTETourAgeBandsQuery, {
    variables: {
      productCode: productId,
    },
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    skip: !productId,
    onError: () => {
      setContextState({
        isError: true,
        isAvailabilityLoading: false,
      });
      if (!isEditModalActive) {
        toggleEditModal();
      }
      onSetSingleTourLoading(false);
    },
    onCompleted: ({ toursAndTicketsGetAgeBands }) => {
      const existingTourTravelers = existingTour?.paxMix;
      setContextState({
        numberOfTravelers:
          !existingTourTravelers && !selectedTourOption
            ? getTravelerOptions(
                toursAndTicketsGetAgeBands,
                numberOfTravelers.adults,
                numberOfTravelers.children
              )
            : existingTourTravelers || tourTravelers,
        priceGroups: getPriceGroups(toursAndTicketsGetAgeBands),
        maxTravelersPerBooking: toursAndTicketsGetAgeBands.maxTravelersPerBooking,
        requiresAdultForBooking: toursAndTicketsGetAgeBands.requiresAdultForBooking,
      });
    },
  });
  useEffect(() => {
    if (loading) {
      setContextState({
        isAvailabilityLoading: true,
      });
    }
  }, [setContextState, loading]);

  return (
    <VPTourEditButton
      productId={productId}
      editModalTitle={editModalTitle}
      isFormEditModal={isFormEditModal}
      dayNumber={dayNumber}
      isProductSubmitted={isProductSubmitted}
      editModalActive={isEditModalActive}
      toggleEditModal={toggleEditModal}
    />
  );
};

export default VPTourEditWrapper;
