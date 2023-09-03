import React, { useContext } from "react";

import CarSearchWidgetDesktop from "components/ui/CarSearchWidget/CarSearchWidgetDesktop";
import { SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";
import CarSearchWidgetStateContext from "components/ui/CarSearchWidget/contexts/CarSearchWidgetStateContext";

const CarSearchWidgetDesktopContainer = () => {
  const {
    driverAge,
    driverCountry,
    dropoffLocationName,
    dropoffId,
    pickupId,
    pickupLocationName,
    selectedDates,
  } = useContext(CarSearchWidgetStateContext);
  return (
    <SearchWidgetDesktop>
      <CarSearchWidgetDesktop
        driverAge={driverAge}
        driverCountry={driverCountry}
        dropoffLocationName={dropoffLocationName}
        dropoffId={dropoffId}
        pickupId={pickupId}
        pickupLocationName={pickupLocationName}
        selectedDates={selectedDates}
      />
    </SearchWidgetDesktop>
  );
};

export default CarSearchWidgetDesktopContainer;
