import React from "react";
import styled from "@emotion/styled";

import { getTourPickup } from "./utils/tourBookingWidgetUtils";
import DatePickerContainer from "./DatePicker/DatePickerContainer";
import ToursTravelersContainer from "./Travelers/ToursTravelersContainer";
import PickupTimeContainer from "./PickupTime/PickupTimeContainer";
import TransportContainer from "./Transport/TransportContainer";
import ExperiencesContainer from "./Experiences/ExperiencesContainer";
import PrivateOptionContainer from "./PrivateOption/PrivateOptionContainer";

import { BookingWidgetFormError, TourType } from "types/enums";
import { gutters } from "styles/variables";

const BookingWidgetBody = styled.div`
  margin: 0 ${gutters.large}px;
  margin-bottom: ${gutters.large}px;
`;

const TourBookingWidgetDesktop = ({
  id,
  tourType,
  onDateSelection,
  lengthOfTour,
  selectedDates,
  numberOfTravelers,
  childrenAges,
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  onSetTravelersPriceGroups,
  onSetSelectedPickupTime,
  selectedPickupTime,
  onSetSelectedTransportLocation,
  selectedTransportLocation,
  availableTimes,
  travelerPrices,
  experiences,
  isLoadingAvailableTimes,
  selectedExperiences,
  onSetSelectedExperience,
  onSetDefaultNumberOfTravelers,
  isFreePickup,
  formErrors,
  transport,
  setHasPickup,
  hasPickup,
  pickupPrice,
  pickupPrices,
  editItem,
  isLoadingOptions,
  isPrivate,
  isLivePricing,
  selectedPrivateOptions,
  togglePrivateState,
  hasSomeAvailablePickups,
  maxTravelers,
}: {
  id: number;
  tourType: string;
  lengthOfTour: number;
  selectedDates: SharedTypes.SelectedDates;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges?: number[];
  selectedPickupTime?: string;
  selectedTransportLocation: PickupLocation;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  isLoadingAvailableTimes: boolean;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  experiences: ExperiencesTypes.Experience[][];
  onSetSelectedPickupTime: (selectedTime: string) => void;
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange: (value: number, index: number) => void;
  onSetTravelersPriceGroups: (value: TravelersTypes.PriceGroup[]) => void;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  isFreePickup: boolean;
  transport: PickupTransport;
  formErrors: BookingWidgetFormError[];
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
  pickupPrices: TourBookingWidgetTypes.PickupPrices;
  editItem?: TourBookingWidgetTypes.EditItem;
  isLoadingOptions: boolean;
  isPrivate: boolean;
  isLivePricing: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  togglePrivateState: () => void;
  hasSomeAvailablePickups: boolean;
  maxTravelers?: number;
}) => {
  return (
    <>
      <DatePickerContainer
        onDateSelection={onDateSelection}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        editItem={editItem}
      />
      <BookingWidgetBody>
        {!formErrors.includes(BookingWidgetFormError.EMPTY_DATES) && (
          <>
            <ToursTravelersContainer
              id={id}
              numberOfTravelers={numberOfTravelers}
              childrenAges={childrenAges}
              onNumberOfTravelersChange={onNumberOfTravelersChange}
              onChildrenAgesChange={onChildrenAgesChange}
              onSetTravelersPriceGroups={onSetTravelersPriceGroups}
              onSetDefaultNumberOfTravelers={onSetDefaultNumberOfTravelers}
              travelerPrices={travelerPrices}
              hasSelectedDates={selectedDates.from !== undefined}
              maxTravelers={maxTravelers}
              isLivePricing={isLivePricing}
            />
            {tourType !== TourType.SelfDrive && (
              <PickupTimeContainer
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
              <TransportContainer
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
              experiences={experiences}
              onSetSelectedExperience={onSetSelectedExperience}
              numberOfTravelers={numberOfTravelers}
              editItem={editItem}
              isLoadingOptions={isLoadingOptions}
            />
          </>
        )}
      </BookingWidgetBody>
    </>
  );
};
export default TourBookingWidgetDesktop;
