export const getRouteInformationData = (
  firstFlight: FlightSearchTypes.Flight,
  lastFlight: FlightSearchTypes.Flight,
  onClickFunction?: () => void
) => {
  return {
    dateOfDeparture: firstFlight.dateOfDeparture,
    timeOfDeparture: firstFlight.timeOfDeparture,
    origin: firstFlight.origin,
    originAirportCode: firstFlight.originAirportCode,
    destination: lastFlight.destination,
    dateOfArrival: lastFlight.dateOfArrival,
    timeOfArrival: lastFlight.timeOfArrival,
    destinationAirportCode: lastFlight.destinationAirportCode,
    nightsInDestination: lastFlight.nightsInDestination,
    onDetailsButtonClick: onClickFunction,
  };
};
