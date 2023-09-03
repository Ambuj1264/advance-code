import React, { useCallback, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

import FixedRangeDatePickerDesktop from "../ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerDesktop";

import { getTourPickup } from "./utils/tourBookingWidgetUtils";
import DatePickerContainer from "./DatePicker/DatePickerContainer";
import ToursTravelersContainer from "./Travelers/ToursTravelersContainer";
import PickupTimeContainer from "./PickupTime/PickupTimeContainer";
import ExperiencesContainer from "./Experiences/ExperiencesContainer";
import BookingWidgetView from "./types/enums";
import TransportContainer, { TransportWrapper } from "./Transport/TransportContainer";
import PrivateOptionContainer from "./PrivateOption/PrivateOptionContainer";
import TravelersInput from "./Travelers/TravelersInput";
import { Wrapper as PickupTimeDropdownWrapper } from "./PickupTime/PickupTimeDropdown";
import { useGetAvailableDates } from "./hooks/useGetAvailableDates";
import { useGetTravelersPriceGroups } from "./hooks/useGetTravelersPriceGroups";

import { TourType } from "types/enums";
import { Wrapper } from "components/ui/Inputs/ContentDropdown";
import MobileSectionHeading, {
  Wrapper as MobileSectionHeadingWrapper,
} from "components/ui/BookingWidget/MobileSectionHeading";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { emptyArray } from "utils/constants";
import {
  DropdownLoading,
  DropdownLoadingLabel,
  LoadingSectionContent,
  LoadingSectionContentWrapper,
  LoadingSectionLabel,
} from "components/ui/BookingWidget/BookingWidgetLoadingContainer";

const noop = () => {};
const travelersPricesMock = { adults: 0, teenagers: 0, children: 0 };

const StyledFixedRangeDatePicker = styled(FixedRangeDatePickerDesktop)(
  () => css`
    margin-top: 0;
    ${Wrapper} {
      padding: 0;
    }
  `
);

const StyledTravelersInput = styled(TravelersInput)(
  () => css`
    margin: 0 0 ${gutters.small}px 0;
    ${Wrapper} {
      padding: 0;
    }
  `
);

const StyledPickupTimeContainer = styled(PickupTimeContainer)(
  () => css`
    ${PickupTimeDropdownWrapper} {
      margin-bottom: ${gutters.small}px;
    }
  `
);

const StyledTransportContainer = styled(TransportContainer)(
  () => css`
    ${TransportWrapper} {
      margin: ${gutters.small}px 0;
    }
  `
);

const StyledMobileSectionHeading = styled(MobileSectionHeading)(
  () => css`
    ${MobileSectionHeadingWrapper} {
      justify-content: flex-start;
    }
  `
);

const TourBookingWidgetMobileSteps = ({
  id,
  tourType,
  bookingWidgetView,
  lengthOfTour,
  selectedDates,
  onDateSelection,
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  childrenAges,
  onSetTravelersPriceGroups,
  onSetSelectedPickupTime,
  numberOfTravelers,
  selectedPickupTime,
  travelerPrices,
  experiences,
  availableTimes,
  isLoadingAvailableTimes,
  selectedExperiences,
  onSetSelectedExperience,
  onSetDefaultNumberOfTravelers,
  isFreePickup,
  startDate,
  endDate,
  transport,
  selectedTransportLocation,
  onSetSelectedTransportLocation,
  setHasPickup,
  hasPickup,
  pickupPrice,
  pickupPrices,
  cartItem,
  isLoadingOptions,
  isPrivate,
  isLivePricing,
  selectedPrivateOptions,
  togglePrivateState,
  hasSomeAvailablePickups,
  maxTravelers,
  onBookingWidgetViewChange,
}: {
  id: number;
  tourType: string;
  bookingWidgetView: BookingWidgetView;
  lengthOfTour: number;
  selectedDates: SharedTypes.SelectedDates;
  selectedPickupTime?: string;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  isLoadingAvailableTimes: boolean;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  experiences: ExperiencesTypes.Experience[][];
  onSetSelectedPickupTime: (selectedTime: string) => void;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange: (value: number, index: number) => void;
  childrenAges: number[];
  onSetTravelersPriceGroups: (value: TravelersTypes.PriceGroup[]) => void;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  isFreePickup: boolean;
  startDate?: string;
  endDate?: string;
  transport: PickupTransport;
  selectedTransportLocation: PickupLocation;
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
  pickupPrices: TourBookingWidgetTypes.PickupPrices;
  cartItem?: TourBookingWidgetTypes.EditItem;
  isLoadingOptions: boolean;
  isPrivate: boolean;
  isLivePricing: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  togglePrivateState: () => void;
  hasSomeAvailablePickups?: boolean;
  maxTravelers?: number;
  onBookingWidgetViewChange: (bookingWidgetView: BookingWidgetView) => void;
}) => {
  const { loading, constructedDates } = useGetAvailableDates();
  const hasSelectedDates = selectedDates.from !== undefined;

  const openDates = useCallback(() => {
    onBookingWidgetViewChange(BookingWidgetView.Dates);
  }, [onBookingWidgetViewChange]);

  const openTravelers = useCallback(() => {
    onBookingWidgetViewChange(BookingWidgetView.Travelers);
  }, [onBookingWidgetViewChange]);

  const { t: commonT } = useTranslation(Namespaces.commonNs);

  useEffect(() => {
    if (!loading && bookingWidgetView === BookingWidgetView.Default && !selectedDates.from) {
      onBookingWidgetViewChange(BookingWidgetView.Dates);
    }
  }, [bookingWidgetView, loading, onBookingWidgetViewChange, selectedDates.from]);

  const {
    isPriceGroupLoading,
    error: priceGroupsError,
    priceGroups,
  } = useGetTravelersPriceGroups({
    onSetDefaultNumberOfTravelers,
    onSetTravelersPriceGroups,
    numberOfTravelers,
    id,
    skipFetchingPriceGroups: !hasSelectedDates,
  });

  if (priceGroupsError) throw priceGroupsError;
  if (
    bookingWidgetView !== BookingWidgetView.Dates &&
    (loading || (!isLivePricing && (isPriceGroupLoading || priceGroups.length === 0)))
  )
    return (
      <>
        <StyledMobileSectionHeading>{commonT("Travel details")}</StyledMobileSectionHeading>
        <LoadingSectionContentWrapper>
          <DropdownLoadingLabel />
          <DropdownLoading />
          <DropdownLoadingLabel />
          <DropdownLoading css={{ marginBottom: 0 }} />
        </LoadingSectionContentWrapper>
        <StyledMobileSectionHeading>
          <LoadingSectionLabel />
        </StyledMobileSectionHeading>
        <LoadingSectionContentWrapper>
          <DropdownLoadingLabel />
          <DropdownLoading />
          <LoadingSectionContent />
        </LoadingSectionContentWrapper>
      </>
    );

  return (
    <>
      {bookingWidgetView === BookingWidgetView.Default && (
        <>
          <StyledMobileSectionHeading>{commonT("Travel details")}</StyledMobileSectionHeading>
          <StyledFixedRangeDatePicker
            selectedDates={selectedDates}
            dates={constructedDates!}
            lengthOfTour={lengthOfTour}
            onDateInputClick={openDates}
            onDateSelection={noop}
            canOpenDropdown={false}
          />
          <StyledTravelersInput
            priceGroups={priceGroups || emptyArray}
            numberOfTravelers={numberOfTravelers}
            childrenAges={childrenAges}
            // travelerPrices are used only in travelers input dropdown content
            // but we display only a dropdown trigger - without the content
            travelerPrices={travelersPricesMock}
            onNumberOfTravelersChange={noop}
            isLivePricing={isLivePricing}
            canOpenDropdown={false}
            showAsDropdown
            onInputClick={openTravelers}
          />
          {tourType !== TourType.SelfDrive && (
            <StyledPickupTimeContainer
              isFreePickup={isFreePickup}
              onSetSelectedPickupTime={onSetSelectedPickupTime}
              selectedPickupTime={selectedPickupTime}
              availableTimes={availableTimes}
              isLoadingAvailableTimes={isLoadingAvailableTimes}
              departureNote={transport.departureNote}
              pickupType={transport.pickupType}
              numberOfTravelers={numberOfTravelers}
              hasPickup={getTourPickup(transport.pickupType, hasPickup)}
            />
          )}
          <PrivateOptionContainer
            isPrivate={isPrivate}
            privateOptions={selectedPrivateOptions}
            togglePrivateState={togglePrivateState}
            numberOfTravelers={numberOfTravelers}
          />
          {hasSomeAvailablePickups && (
            <StyledTransportContainer
              transport={transport}
              selectedTransportLocation={selectedTransportLocation}
              onSetSelectedTransportLocation={onSetSelectedTransportLocation}
              pickupPrices={pickupPrices}
              setHasPickup={setHasPickup}
              hasPickup={hasPickup}
              pickupPrice={pickupPrice}
            />
          )}
          <ExperiencesContainer
            selectedExperiences={selectedExperiences}
            onSetSelectedExperience={onSetSelectedExperience}
            experiences={experiences}
            numberOfTravelers={numberOfTravelers}
            editItem={cartItem}
            isLoadingOptions={isLoadingOptions}
          />
        </>
      )}
      {bookingWidgetView === BookingWidgetView.Dates && (
        <DatePickerContainer
          onDateSelection={onDateSelection}
          lengthOfTour={lengthOfTour}
          selectedDates={selectedDates}
          editItem={cartItem}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {bookingWidgetView === BookingWidgetView.Travelers && (
        <ToursTravelersContainer
          id={id}
          onSetTravelersPriceGroups={onSetTravelersPriceGroups}
          numberOfTravelers={numberOfTravelers}
          onNumberOfTravelersChange={onNumberOfTravelersChange}
          onChildrenAgesChange={onChildrenAgesChange}
          childrenAges={childrenAges}
          onSetDefaultNumberOfTravelers={onSetDefaultNumberOfTravelers}
          travelerPrices={travelerPrices}
          hasSelectedDates={selectedDates.from !== undefined}
          maxTravelers={maxTravelers}
          isLivePricing={isLivePricing}
          isMobile
        />
      )}
    </>
  );
};

export default TourBookingWidgetMobileSteps;
