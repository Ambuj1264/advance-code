import { range } from "fp-ts/lib/Array";
import IcelandFlag from "@travelshift/ui/icons/Flags/iceland-flag.svg";
import DenmarkFlag from "@travelshift/ui/icons/Flags/denmark-flag.svg";

import { mockImage0 } from "utils/mockData/mockGlobalData";
import { PageType, GraphCMSPageType } from "types/enums";

export const mockOriginLeg: FlightSearchTypes.Flight = {
  id: "origin",
  origin: "Reykjavík",
  originAirport: "Keflavík",
  originId: "airport:KEF",
  originAirportCode: "KEF",
  destination: "London",
  destinationId: "airport:LHR",
  destinationAirport: "Heathrow",
  destinationAirportCode: "LHR",
  dateOfDeparture: "Fri 8 Jan",
  dateOfArrival: "Sat 9 Jan",
  timeOfDeparture: "15:30",
  timeOfArrival: "00:30",
  nightsInDestination: 6,
  flightClass: "Economy",
  durationInSec: 22800,
  flightNumber: "AH 6062",
  airline: {
    code: "BA",
    imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
    name: "British Airways",
  },
  localArrival: "2021-04-08T04:30:00",
  localDeparture: "2021-04-07T22:50:00",
  bagsRecheckRequired: false,
  guarantee: false,
};

export const mockOriginLeg0: FlightSearchTypes.Flight = {
  id: "origin",
  origin: "Reykjavík",
  originAirport: "Keflavík",
  originAirportCode: "KEF",
  originId: "airport:KEF",
  destination: "London",
  destinationId: "airport:LHR",
  destinationAirport: "Heathrow",
  destinationAirportCode: "LHR",
  dateOfDeparture: "Fri 8 Jan",
  dateOfArrival: "Sat 9 Jan",
  timeOfDeparture: "15:30",
  timeOfArrival: "00:30",
  layoverTimeInSec: 7200,
  flightClass: "Economy",
  durationInSec: 22800,
  flightNumber: "AH 6062",
  airline: {
    code: "BA",
    imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
    name: "British Airways",
  },
  localArrival: "2021-04-08T04:30:00",
  localDeparture: "2021-04-07T22:50:00",
  bagsRecheckRequired: false,
  guarantee: false,
};

export const mockOriginLeg01: FlightSearchTypes.Flight = {
  id: "origin",
  origin: "London",
  originAirport: "Heathrow",
  originId: "airport:LHR",
  originAirportCode: "LHR",
  destination: "Hong Kong",
  destinationAirport: "Hong Kong International",
  destinationAirportCode: "HKG",
  destinationId: "airport:HKG",
  dateOfDeparture: "Sat 9 Jan",
  dateOfArrival: "Sun 10 Jan",
  localArrival: "2021-04-08T04:30:00",
  localDeparture: "2021-04-07T22:50:00",
  timeOfDeparture: "15:30",
  timeOfArrival: "00:30",
  nightsInDestination: 6,
  flightClass: "Economy",
  durationInSec: 53000,
  flightNumber: "VS 206",
  airline: {
    code: "VA",
    imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
    name: "Virgin Atlantic Airways",
  },
  bagsRecheckRequired: false,
  guarantee: false,
};

export const mockOriginLeg10: FlightSearchTypes.Flight = {
  id: "destination",
  origin: "Hong Kong",
  originAirport: "Hong Kong International",
  originAirportCode: "HKG",
  originId: "airport:HKG",
  destination: "London",
  destinationId: "airport:LHR",
  destinationAirport: "Heathrow",
  destinationAirportCode: "LHR",
  dateOfDeparture: "Fri 14 Jan",
  localArrival: "2021-04-08T04:30:00",
  localDeparture: "2021-04-07T22:50:00",
  dateOfArrival: "Fri 15 Jan",
  timeOfDeparture: "16:30",
  timeOfArrival: "1:30",
  layoverTimeInSec: 60 * 60 * 8,
  durationInSec: 53000,
  flightClass: "Economy",
  flightNumber: "AH 6062",
  airline: {
    code: "VA",
    imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
    name: "Virgin Atlantic Airways",
  },
  bagsRecheckRequired: false,
  guarantee: false,
};

export const mockOriginLeg1: FlightSearchTypes.Flight = {
  id: "destination",
  origin: "London",
  originAirport: "Heathrow",
  originAirportCode: "LHR",
  originId: "airport:LHR",
  destination: "Reykjavík",
  destinationId: "airport:KEF",
  destinationAirport: "Keflavík",
  destinationAirportCode: "KEF",
  dateOfDeparture: "Fri 15 Jan",
  dateOfArrival: "Fri 15 Jan",
  timeOfDeparture: "09:30",
  timeOfArrival: "12:30",
  durationInSec: 20300,
  flightClass: "Business",
  flightNumber: "AH 6062",
  airline: {
    code: "BA",
    imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
    name: "British Airways",
  },
  localArrival: "2021-04-08T04:30:00",
  localDeparture: "2021-04-07T22:50:00",
  bagsRecheckRequired: false,
  guarantee: false,
};

export const mockFlight0 = [mockOriginLeg0, mockOriginLeg1];

export const mockRoute0 = (id: number) =>
  ({
    id: "origin",
    numberOfStops: 0,
    totalDurationSec: mockOriginLeg.durationInSec,
    airlines: [
      {
        code: "BA",
        imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
        name: "British Airways",
      },
    ],
    flights: [
      {
        ...mockOriginLeg,
        id: `origin${id}`,
      },
    ],
  } as FlightSearchTypes.Route);

export const mockRoute01 = {
  id: "origin",
  numberOfStops: 1,
  totalDurationSec: mockOriginLeg0.durationInSec + mockOriginLeg01.durationInSec,
  airlines: [
    {
      code: "BA",
      imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
      name: "British Airways",
    },
    {
      code: "VA",
      imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
      name: "Virgin Atlantic Airways",
    },
  ],
  flights: [mockOriginLeg0, mockOriginLeg01],
} as FlightSearchTypes.Route;

export const mockRoute1 = (id: number) => ({
  id: "destination",
  numberOfStops: 1,
  totalDurationSec: mockOriginLeg1.durationInSec,
  airlines: [
    {
      code: "BA",
      imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
      name: "British Airways",
    },
  ],
  flights: [
    {
      ...mockOriginLeg1,
      id: `destination${id}`,
    },
  ],
});

export const mockRoute10 = {
  id: "destination",
  numberOfStops: 0,
  totalDurationSec: mockOriginLeg10.durationInSec + mockOriginLeg1.durationInSec,
  airlines: [
    {
      code: "VA",
      imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
      name: "Virgin Atlantic Airways",
    },
    {
      code: "BA",
      imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
      name: "British Airways",
    },
  ],
  flights: [mockOriginLeg10, mockOriginLeg1],
};

export const mockRoute10shorter = {
  id: "destination",
  numberOfStops: 0,
  totalDurationSec: mockOriginLeg10.durationInSec,
  airlines: [
    {
      code: "VA",
      imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
      name: "Virgin Atlantic Airways",
    },
    {
      code: "BA",
      imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
      name: "British Airways",
    },
  ],
  flights: [mockOriginLeg10, mockOriginLeg1],
};

export const mockFlightItineraries0 = range(1, 24).map(id => ({
  id: `${id}`,
  price: 1337,
  outboundRoute: mockRoute0(id),
  inboundRoute: mockRoute1(id),
  numberOfPassengers: 1,
}));

export const mockSingleFlightItinerary = {
  id: `origin`,
  price: 1337,
  outboundRoute: mockRoute0(1),
};

export const mockComplexFlightItinerary = {
  id: `origin`,
  price: 1337,
  linkUrl: "",
  outboundRoute: mockRoute01,
  inboundRoute: mockRoute10,
  clientRoute: {
    as: "/",
    route: PageType.FLIGHT,
  },
  numberOfPassengers: 2,
};

export const mockComplexFlightItinerary0 = {
  selected: false,
  id: `origin`,
  price: 1337,
  linkUrl: "",
  outboundRoute: mockRoute01,
  inboundRoute: mockRoute10shorter,
  clientRoute: {
    as: "/",
    route: PageType.FLIGHT,
  },
  numberOfPassengers: 2,
};

const mockComplexFlightItinerary1 = {
  selected: true,
  id: `origin`,
  price: 1000,
  linkUrl: "",
  outboundRoute: mockRoute01,
  inboundRoute: mockRoute10,
  clientRoute: {
    as: "/",
    route: PageType.FLIGHT,
  },
  numberOfPassengers: 2,
};

const mockComplexFlightItinerary2 = {
  selected: false,
  id: `origin`,
  price: 1200,
  linkUrl: "",
  outboundRoute: mockRoute01,
  inboundRoute: mockRoute10,
  clientRoute: {
    as: "/",
    route: PageType.FLIGHT,
  },
  numberOfPassengers: 2,
};

export const mockItineraryArray = [
  mockComplexFlightItinerary0,
  mockComplexFlightItinerary1,
  mockComplexFlightItinerary2,
];

export const mockCabinFilters0 = [
  {
    id: "1",
    name: "Apply mixed classes",
  },
  {
    id: "2",
    name: "Economy",
    checked: true,
  },
  {
    id: "1",
    name: "Premium economy",
  },
  {
    id: "1",
    name: "Business",
  },
  {
    id: "1",
    name: "First class",
  },
];

export const mockPriceFilters0 = {
  min: 5000,
  max: 300000,
  filters: [
    {
      id: "5000",
      count: 5,
    },
    {
      id: "35000",
      count: 10,
    },
    {
      id: "130000",
      count: 3,
    },
    {
      id: "55000",
      count: 1,
    },
    {
      id: "92000",
      count: 8,
    },
    {
      id: "273000",
      count: 7,
    },
    {
      id: "300000",
      count: 1,
    },
  ],
};

export const mockTimeFilters0 = {
  min: 2,
  max: 25,
  filters: [
    {
      id: "2",
      count: 5,
    },
    {
      id: "3",
      count: 20,
    },
    {
      id: "4",
      count: 35,
    },
    {
      id: "5",
      count: 1,
    },
    {
      id: "6",
      count: 8,
    },
    {
      id: "7",
      count: 12,
    },
    {
      id: "8",
      count: 15,
    },
    {
      id: "9",
      count: 3,
    },
    {
      id: "15",
      count: 14,
    },
    {
      id: "19",
      count: 15,
    },
  ],
};

export const mockFlightImageCard0 = {
  title: "Flights to Reykjavík",
  country: "Iceland",
  image: mockImage0,
  linkUrl: "/iceland/best-flights/to-reykjavik",
  OriginIcon: undefined,
  slug: "to-reykjavik",
  DestinationIcon: IcelandFlag,
  imageWidth: 100,
  imageHeight: 100,
  pageType: GraphCMSPageType.Flights,
};

export const mockFlightImageCard1 = {
  title: "Flights from Copenhagen to Reykjavík",
  country: "Iceland",
  image: mockImage0,
  linkUrl: "/iceland/best-flights/from-copenhagen-to-reykjavik",
  slug: "from-copenhagen-to-reykjavik",
  OriginIcon: DenmarkFlag,
  DestinationIcon: IcelandFlag,
  imageWidth: 100,
  imageHeight: 100,
  pageType: GraphCMSPageType.Flights,
};

export const mockOutBoundOneWayRouteData = {
  airline: {
    code: "FI",
    name: "Icelandair",
    imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
  },
  cityFrom: {
    code: "REK",
    name: "Reykjavík",
  },
  cityTo: {
    code: "STO",
    name: "Stockholm",
  },
  flightClass: "Economy",
  flightNumber: "306",
  flyFrom: {
    code: "KEF",
    name: "Keflavík International",
  },
  flyTo: {
    code: "ARN",
    name: "Stockholm Arlanda",
  },
  layOverSec: 0,
  durationSec: 42300,
  localArrival: "2021-04-29T12:45:00",
  localDeparture: "2021-04-29T07:35:00",
  bagsRecheckRequired: false,
  guarantee: false,
} as FlightSearchTypes.QueryRoute;

export const mockOutBoundOneWayRoute = {
  flights: [
    {
      id: "FI306",
      flightNumber: "FI306",
      destination: "Stockholm",
      destinationAirport: "Stockholm Arlanda",
      destinationAirportCode: "ARN",
      origin: "Reykjavík",
      originAirport: "Keflavík International",
      originAirportCode: "KEF",
      originId: "KEF",
      destinationId: "ARN",
      dateOfDeparture: "Apr 29 2021",
      dateOfArrival: "Apr 29 2021",
      timeOfDeparture: "07:35",
      timeOfArrival: "12:45",
      localArrival: "2021-04-29T12:45:00",
      localDeparture: "2021-04-29T07:35:00",
      flightClass: "Economy",
      airline: {
        code: "FI",
        name: "Icelandair",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
      },
      durationInSec: 42300,
      layoverTimeInSec: undefined,
      nightsInDestination: undefined,
      bagsRecheckRequired: false,
      guarantee: false,
    },
  ],
  numberOfStops: 1,
};

export const mockIternaryDataOneWay = {
  id: "mockFlightId",
  linkUrl: "",
  clientRoute: {
    route: "/flight",
    as: "",
  },
  price: 715,
  totalDurationSec: 42300,
  nightsInDestination: 0,
  inboundRoute: [],
  inboundDurationSec: 0,
  outboundRoute: [mockOutBoundOneWayRouteData],
  outboundDurationSec: 42300,
  isOneway: true,
  numberOfPassengers: 2,
};

export const mockIternaryOneWay = {
  id: "mockFlightId",
  linkUrl: "",
  clientRoute: {
    route: "/flight",
    as: "",
  },
  price: 715,
  totalDurationSec: 42300,
  nightsInDestination: undefined,
  inboundRoute: undefined,
  outboundRoute: {
    ...mockOutBoundOneWayRoute,
    numberOfStops: 1,
    totalDurationSec: mockIternaryDataOneWay.outboundDurationSec,
    airlines: [
      {
        code: "FI",
        name: "Icelandair",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
      },
    ],
  },
  numberOfPassengers: 2,
};

export const sortedFlights = [
  {
    clientRoute: {
      as: "/",
      route: "flight",
    },
    flightRanking: "BEST",
    id: "origin",
    inboundRoute: {
      airlines: [
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 14 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          layoverTimeInSec: 28800,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Hong Kong",
          originAirport: "Hong Kong International",
          originAirportCode: "HKG",
          originId: "airport:HKG",
          timeOfArrival: "1:30",
          timeOfDeparture: "16:30",
        },
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 15 Jan",
          destination: "Reykjavík",
          destinationAirport: "Keflavík",
          destinationAirportCode: "KEF",
          destinationId: "airport:KEF",
          durationInSec: 20300,
          flightClass: "Business",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "12:30",
          timeOfDeparture: "09:30",
        },
      ],
      id: "destination",
      numberOfStops: 0,
      totalDurationSec: 53000,
    },
    selected: false,
    linkUrl: "",
    numberOfPassengers: 2,
    outboundRoute: {
      airlines: [
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sat 9 Jan",
          dateOfDeparture: "Fri 8 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 22800,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "origin",
          layoverTimeInSec: 7200,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Reykjavík",
          originAirport: "Keflavík",
          originAirportCode: "KEF",
          originId: "airport:KEF",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sun 10 Jan",
          dateOfDeparture: "Sat 9 Jan",
          destination: "Hong Kong",
          destinationAirport: "Hong Kong International",
          destinationAirportCode: "HKG",
          destinationId: "airport:HKG",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "VS 206",
          guarantee: false,
          id: "origin",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          nightsInDestination: 6,
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
      ],
      id: "origin",
      numberOfStops: 1,
      totalDurationSec: 75800,
    },
    price: 1337,
  },
  {
    clientRoute: {
      as: "/",
      route: "flight",
    },
    flightRanking: "CHEAPEST",
    id: "origin",
    inboundRoute: {
      airlines: [
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 14 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          layoverTimeInSec: 28800,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Hong Kong",
          originAirport: "Hong Kong International",
          originAirportCode: "HKG",
          originId: "airport:HKG",
          timeOfArrival: "1:30",
          timeOfDeparture: "16:30",
        },
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 15 Jan",
          destination: "Reykjavík",
          destinationAirport: "Keflavík",
          destinationAirportCode: "KEF",
          destinationId: "airport:KEF",
          durationInSec: 20300,
          flightClass: "Business",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "12:30",
          timeOfDeparture: "09:30",
        },
      ],
      id: "destination",
      numberOfStops: 0,
      totalDurationSec: 73300,
    },
    selected: true,
    linkUrl: "",
    numberOfPassengers: 2,
    outboundRoute: {
      airlines: [
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sat 9 Jan",
          dateOfDeparture: "Fri 8 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 22800,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "origin",
          layoverTimeInSec: 7200,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Reykjavík",
          originAirport: "Keflavík",
          originAirportCode: "KEF",
          originId: "airport:KEF",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sun 10 Jan",
          dateOfDeparture: "Sat 9 Jan",
          destination: "Hong Kong",
          destinationAirport: "Hong Kong International",
          destinationAirportCode: "HKG",
          destinationId: "airport:HKG",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "VS 206",
          guarantee: false,
          id: "origin",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          nightsInDestination: 6,
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
      ],
      id: "origin",
      numberOfStops: 1,
      totalDurationSec: 75800,
    },
    price: 1000,
  },
  {
    clientRoute: {
      as: "/",
      route: "flight",
    },
    flightRanking: "FASTEST",
    id: "origin",
    inboundRoute: {
      airlines: [
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 14 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          layoverTimeInSec: 28800,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Hong Kong",
          originAirport: "Hong Kong International",
          originAirportCode: "HKG",
          originId: "airport:HKG",
          timeOfArrival: "1:30",
          timeOfDeparture: "16:30",
        },
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Fri 15 Jan",
          dateOfDeparture: "Fri 15 Jan",
          destination: "Reykjavík",
          destinationAirport: "Keflavík",
          destinationAirportCode: "KEF",
          destinationId: "airport:KEF",
          durationInSec: 20300,
          flightClass: "Business",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "destination",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "12:30",
          timeOfDeparture: "09:30",
        },
      ],
      id: "destination",
      numberOfStops: 0,
      totalDurationSec: 73300,
    },
    selected: false,
    linkUrl: "",
    numberOfPassengers: 2,
    outboundRoute: {
      airlines: [
        {
          code: "BA",
          imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
          name: "British Airways",
        },
        {
          code: "VA",
          imageUrl: "//images.kiwi.com/airlines/32/VS.png?default=airline.png",
          name: "Virgin Atlantic Airways",
        },
      ],
      flights: [
        {
          airline: {
            code: "BA",
            imageUrl: "https://images.kiwi.com/airlines/32/BA.png?default=airline.png",
            name: "British Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sat 9 Jan",
          dateOfDeparture: "Fri 8 Jan",
          destination: "London",
          destinationAirport: "Heathrow",
          destinationAirportCode: "LHR",
          destinationId: "airport:LHR",
          durationInSec: 22800,
          flightClass: "Economy",
          flightNumber: "AH 6062",
          guarantee: false,
          id: "origin",
          layoverTimeInSec: 7200,
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          origin: "Reykjavík",
          originAirport: "Keflavík",
          originAirportCode: "KEF",
          originId: "airport:KEF",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
        {
          airline: {
            code: "VA",
            imageUrl: "https://images.kiwi.com/airlines/32/VA.png?default=airline.png",
            name: "Virgin Atlantic Airways",
          },
          bagsRecheckRequired: false,
          dateOfArrival: "Sun 10 Jan",
          dateOfDeparture: "Sat 9 Jan",
          destination: "Hong Kong",
          destinationAirport: "Hong Kong International",
          destinationAirportCode: "HKG",
          destinationId: "airport:HKG",
          durationInSec: 53000,
          flightClass: "Economy",
          flightNumber: "VS 206",
          guarantee: false,
          id: "origin",
          localArrival: "2021-04-08T04:30:00",
          localDeparture: "2021-04-07T22:50:00",
          nightsInDestination: 6,
          origin: "London",
          originAirport: "Heathrow",
          originAirportCode: "LHR",
          originId: "airport:LHR",
          timeOfArrival: "00:30",
          timeOfDeparture: "15:30",
        },
      ],
      id: "origin",
      numberOfStops: 1,
      totalDurationSec: 75800,
    },
    price: 1200,
  },
];
