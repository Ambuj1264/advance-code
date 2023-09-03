import React from "react";

import NewMobileRoomAndGuestPicker from "../RoomAndGuestPicker/NewMobileRoomAndGuestPicker";

import VacationLocationPickerMobileStep from "components/ui/VacationPackageSearchWidget/VacationLocationPickerMobileStep";
import { Namespaces } from "shared/namespaces";

const VacationTravelDetailsMobileSteps = ({
  defaultOriginId,
  defaultDestinationId,
  defaultDestination,
  defaultOrigin,
  origin,
  destination,
  onOriginLocationChange,
  onDestinationLocationChange,
  toggleVacationIncludesFlight,
  vacationIncludesFlight,
  occupancies,
  onOccupanciesChange,
  forceOriginFocus,
  forceDestinationFocus,
}: {
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  destination?: string;
  onOriginLocationChange: (originId?: string, originName?: string, countryCode?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  toggleVacationIncludesFlight: () => void;
  vacationIncludesFlight: boolean;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  onOccupanciesChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  forceOriginFocus?: boolean;
  forceDestinationFocus?: boolean;
}) => {
  return (
    <>
      <VacationLocationPickerMobileStep
        onOriginLocationChange={onOriginLocationChange}
        onDestinationLocationChange={onDestinationLocationChange}
        origin={origin}
        destination={destination}
        defaultOrigin={defaultOrigin}
        defaultOriginId={defaultOriginId}
        defaultDestination={defaultDestination}
        defaultDestinationId={defaultDestinationId}
        toggleVacationIncludesFlight={toggleVacationIncludesFlight}
        vacationIncludesFlight={vacationIncludesFlight}
        forceOriginFocus={forceOriginFocus}
        forceDestinationFocus={forceDestinationFocus}
      />
      <NewMobileRoomAndGuestPicker
        occupancies={occupancies}
        onSetOccupancies={onOccupanciesChange}
        onSetRooms={onOccupanciesChange}
        namespace={Namespaces.vacationPackageNs}
      />
    </>
  );
};

export default VacationTravelDetailsMobileSteps;
