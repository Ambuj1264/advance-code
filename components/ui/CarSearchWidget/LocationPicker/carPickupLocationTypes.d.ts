declare namespace CarPickupLocationTypes {
  type QueryCarPickupLocation = {
    locationId: string;
    name: string;
    type: string;
    geoLocation: string;
  };
  type QueryCarPickupLocationsData = {
    availableLocations: {
      locations: QueryCarPickupLocation[];
    };
  };
}
