import { getRouteInformationData } from "./RouteInformationHelpers";

const firstInbound = {
  airline: {
    code: "BF",
    imageUrl: "https://images.kiwi.com/airlines/64/BF.png",
    name: "French Bee",
  },
  bagsRecheckRequired: false,
  dateOfArrival: "Dec 20 2021",
  dateOfDeparture: "Dec 19 2021",
  destination: "Paris",
  destinationAirport: "Paris Orly",
  destinationAirportCode: "ORY",
  destinationId: "ORY",
  durationInSec: 25800,
  flightClass: "",
  flightNumber: "BF721",
  guarantee: false,
  id: "BF721",
  layoverTimeInSec: undefined,
  localArrival: "2021-12-20T12:35:00",
  localDeparture: "2021-12-19T23:25:00",
  nightsInDestination: 3,
  origin: "New York",
  originAirport: "Newark Liberty International",
  originAirportCode: "EWR",
  originId: "EWR",
  timeOfArrival: "12:35",
  timeOfDeparture: "23:25",
};

const lastInbound = {
  airline: {
    code: "UA",
    imageUrl: "https://images.kiwi.com/airlines/64/UA.png",
    name: "United Airlines",
  },
  bagsRecheckRequired: false,
  dateOfArrival: "Dec 23 2021",
  dateOfDeparture: "Dec 23 2021",
  destination: "New York",
  destinationAirport: "Newark Liberty International",
  destinationAirportCode: "EWR",
  destinationId: "EWR",
  durationInSec: 29700,
  flightClass: "",
  flightNumber: "UA56",
  guarantee: false,
  id: "UA56",
  layoverTimeInSec: undefined,
  localArrival: "2021-12-23T11:40:00",
  localDeparture: "2021-12-23T09:25:00",
  nightsInDestination: undefined,
  origin: "Paris",
  originAirport: "Charles de Gaulle Airport",
  originAirportCode: "CDG",
  originId: "CDG",
  timeOfArrival: "11:40",
  timeOfDeparture: "09:25",
};

describe("getRouteInformationData", () => {
  test("should return correctly structured data for RouteInformation component", () => {
    expect(getRouteInformationData(firstInbound, lastInbound)).toEqual({
      dateOfArrival: "Dec 23 2021",
      dateOfDeparture: "Dec 19 2021",
      destination: "New York",
      destinationAirportCode: "EWR",
      nightsInDestination: undefined,
      onDetailsButtonClick: undefined,
      origin: "New York",
      originAirportCode: "EWR",
      timeOfArrival: "11:40",
      timeOfDeparture: "23:25",
    });
  });
});
