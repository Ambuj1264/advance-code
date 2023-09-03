declare namespace FlightSearchTypes {
  type PassengerType = "adults" | "children" | "infants";

  type Passengers = { [passengerType in PassengerType]: number };

  type CabinType = "M" | "W" | "C" | "F";

  type FlightType = "round" | "oneway";

  type FlightLocations = {
    flightGetLocations: {
      locations: SharedTypes.Autocomplete[];
    };
  };

  type Airline = {
    code: string;
    imageUrl: string;
    name: string;
  };

  type Flight = {
    id: string;
    origin: string;
    originAirport: string;
    originAirportCode: string;
    originId: string;
    destinationId: string;
    destination: string;
    destinationAirport: string;
    destinationAirportCode: string;
    dateOfDeparture: string;
    dateOfArrival: string;
    timeOfDeparture: string;
    timeOfArrival: string;
    localArrival: string;
    localDeparture: string;
    layoverTimeInSec?: number;
    nightsInDestination?: number;
    airline: Airline;
    durationInSec: number;
    flightClass: string;
    flightNumber: string;
    bagsRecheckRequired?: boolean;
    guarantee?: boolean;
  };

  type Route = {
    flights: Flight[];
    numberOfStops: number;
    totalDurationSec: number;
    airlines: Airline[];
  };

  type FlightItinerary = {
    selected?: boolean;
    id: string;
    price: number;
    linkUrl?: string;
    title?: string;
    clientRoute?: SharedTypes.ClientRoute;
    inboundRoute?: Route;
    outboundRoute: Route;
    expiredTime?: string;
    numberOfPassengers: number;
    // we have priceObject only in cart, but this component is used in flight search results as well
    priceObject?: SharedTypes.PriceObject;
  };

  type QueryPlace = {
    code: string;
    name: string;
  };

  type QueryRoute = {
    airline: Airline;
    cityFrom: QueryAirport;
    cityTo: QueryAirport;
    flightClass: string;
    flightNumber: string;
    flyFrom: QueryPlace;
    flyTo: QueryPlace;
    layOverSec: number;
    localArrival: string;
    localDeparture: string;
    durationSec: number;
    bagsRecheckRequired?: boolean;
    guarantee?: boolean;
  };

  type QueryFlightItinerary = {
    selected?: boolean;
    nightsInDestination: number;
    bookingToken: string;
    inboundDurationSec: number;
    outboundDurationSec: number;
    totalDurationSec: number;
    price: number;
    linkUrl?: string;
    inboundRoute?: QueryRoute[];
    outboundRoute: QueryRoute[];
    expiredTime?: string;
  };

  type FlightRangeFilter = {
    minValue: number;
    maxValue: number;
    count: number;
  };

  type FlightSearchFilters = {
    durationSec: FlightRangeFilter[];
    lengthOfLayoverSec: FlightRangeFilter[];
    price: FlightRangeFilter[];
  };

  type FlightSearchResult = {
    searchId: string;
    resultCount: number;
    filters: FlightSearchFilters;
    itineraries: QueryFlightItinerary[];
  };

  type FlightSearchResults = {
    flightSearch: FlightSearchResult;
  };

  type FlightSearchVariables = {
    originId?: string;
    destinationId?: string;
    adults: number;
    children: number;
    infants: number;
    cabinType?: string;
    flightType?: string;
    priceFrom?: number;
    priceTo?: number;
    durationFromSec?: number;
    durationToSec?: number;
    layoverLengthFromSec?: number;
    layoverLengthToSec?: number;
    searchId?: string | null;
    departureDateFrom?: string;
    returnDateFrom?: string;
    orderBy?: string;
    offset: number;
    departureTo?: string;
    returnTo?: string;
    maxNumberOfStops?: number;
    searchId?: string;
  };
}
