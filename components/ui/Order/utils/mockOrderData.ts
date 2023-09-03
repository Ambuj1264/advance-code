import { addDays } from "date-fns";

import {
  MealType,
  OrderStayCancellationType,
} from "components/features/StayProductPage/StayBookingWidget/types/enums";
import { CarProvider, CarProviderId, QueryTourPickup, TourType } from "types/enums";
import { EditableStatus } from "components/features/Voucher/types/VoucherEnums";

export const mockQueryFlightCart0 = {
  id: "138569904",
  bookingToken: "138569904",
  title: "Reykjavik to Copenhagen and back",
  cartItemId: "11c3953c-eaa9-4663-8ae0-e4d0e13a9ea8",
  adults: 1,
  children: 0,
  infants: 0,
  numberOfPassengers: 1,
  nightsInDestination: 1,
  inboundDurationSec: 70500,
  outboundDurationSec: 66600,
  totalDurationSec: 137100,
  available: true,
  baggage: [
    {
      id: "personal_item",
      category: "personal_item",
      price: 0,
      length: 40,
      width: 10,
      height: 30,
      count: 1,
      weight: 2,
    },
    {
      id: "cabin_bag",
      category: "cabin_bag",
      price: 0,
      length: 55,
      width: 23,
      height: 35,
      count: 1,
      weight: 8,
    },
  ],
  isEditable: false,
  expiredTime: "2021-02-22T15:02:34.438Z",
  price: 199775.15,
  priceObject: {
    priceDisplayValue: "199775.15",
    defaultPrice: 199775.15,
    currency: "ISK",
    price: 199775.15,
  },
  outboundRoute: [
    {
      airline: {
        code: "LH",
        name: "Lufthansa",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
      },
      cityFrom: {
        code: null,
        name: "Reykjavik",
      },
      cityTo: {
        code: null,
        name: "Frankfurt",
      },
      flightClass: "Economy",
      flightNumber: "857",
      flyFrom: {
        code: "KEF",
        name: "Keflavík International",
      },
      flyTo: {
        code: "FRA",
        name: "Frankfurt International Airport",
      },
      layOverSec: 0,
      durationSec: 12900,
      localArrival: "2021-03-11T19:30:00.000Z",
      localDeparture: "2021-03-11T14:55:00.000Z",
    },
    {
      airline: {
        code: "LH",
        name: "Lufthansa",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
      },
      cityFrom: {
        code: null,
        name: "Frankfurt",
      },
      cityTo: {
        code: null,
        name: "Belgrade",
      },
      flightClass: "Economy",
      flightNumber: "1410",
      flyFrom: {
        code: "FRA",
        name: "Frankfurt International Airport",
      },
      flyTo: {
        code: "BEG",
        name: "Belgrade Nikola Tesla",
      },
      layOverSec: 6000,
      durationSec: 6600,
      localArrival: "2021-03-11T23:00:00.000Z",
      localDeparture: "2021-03-11T21:10:00.000Z",
    },
    {
      airline: {
        code: "OS",
        name: "Austrian Airlines",
        imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
      },
      cityFrom: {
        code: null,
        name: "Belgrade",
      },
      cityTo: {
        code: null,
        name: "Vienna",
      },
      flightClass: "Economy",
      flightNumber: "738",
      flyFrom: {
        code: "BEG",
        name: "Belgrade Nikola Tesla",
      },
      flyTo: {
        code: "VIE",
        name: "Vienna International Airport",
      },
      layOverSec: 24900,
      durationSec: 4500,
      localArrival: "2021-03-12T07:10:00.000Z",
      localDeparture: "2021-03-12T05:55:00.000Z",
    },
    {
      airline: {
        code: "OS",
        name: "Austrian Airlines",
        imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
      },
      cityFrom: {
        code: null,
        name: "Vienna",
      },
      cityTo: {
        code: null,
        name: "Copenhagen",
      },
      flightClass: "Economy",
      flightNumber: "301",
      flyFrom: {
        code: "VIE",
        name: "Vienna International Airport",
      },
      flyTo: {
        code: "CPH",
        name: "Airport Copenhagen",
      },
      layOverSec: 1500,
      durationSec: 6600,
      localArrival: "2021-03-12T09:25:00.000Z",
      localDeparture: "2021-03-12T07:35:00.000Z",
    },
  ],
  inboundRoute: [
    {
      airline: {
        code: "KL",
        name: "KLM Royal Dutch Airlines",
        imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
      },
      cityFrom: {
        code: null,
        name: "Copenhagen",
      },
      cityTo: {
        code: null,
        name: "Amsterdam",
      },
      flightClass: "Economy",
      flightNumber: "1134",
      flyFrom: {
        code: "RKE",
        name: "Airport Copenhagen (RKE)",
      },
      flyTo: {
        code: "AMS",
        name: "Amsterdam Airport Schiphol",
      },
      layOverSec: 0,
      durationSec: 5100,
      localArrival: "2021-03-13T19:50:00.000Z",
      localDeparture: "2021-03-13T18:25:00.000Z",
    },
    {
      airline: {
        code: "KL",
        name: "KLM Royal Dutch Airlines",
        imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
      },
      cityFrom: {
        code: null,
        name: "Amsterdam",
      },
      cityTo: {
        code: null,
        name: "Oslo",
      },
      flightClass: "Economy",
      flightNumber: "1151",
      flyFrom: {
        code: "AMS",
        name: "Amsterdam Airport Schiphol",
      },
      flyTo: {
        code: "OSL",
        name: "Oslo Airport, Gardermoen",
      },
      layOverSec: 2700,
      durationSec: 6300,
      localArrival: "2021-03-13T22:20:00.000Z",
      localDeparture: "2021-03-13T20:35:00.000Z",
    },
    {
      airline: {
        code: "LH",
        name: "Lufthansa",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
      },
      cityFrom: {
        code: null,
        name: "Oslo",
      },
      cityTo: {
        code: null,
        name: "Frankfurt",
      },
      flightClass: "Economy",
      flightNumber: "865",
      flyFrom: {
        code: "OSL",
        name: "Oslo Airport, Gardermoen",
      },
      flyTo: {
        code: "FRA",
        name: "Frankfurt International Airport",
      },
      layOverSec: 30000,
      durationSec: 8400,
      localArrival: "2021-03-14T09:00:00.000Z",
      localDeparture: "2021-03-14T06:40:00.000Z",
    },
    {
      airline: {
        code: "LH",
        name: "Lufthansa",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
      },
      cityFrom: {
        code: null,
        name: "Frankfurt",
      },
      cityTo: {
        code: null,
        name: "Reykjavik",
      },
      flightClass: "Economy",
      flightNumber: "856",
      flyFrom: {
        code: "FRA",
        name: "Frankfurt International Airport",
      },
      flyTo: {
        code: "KEF",
        name: "Keflavík International",
      },
      layOverSec: 7800,
      durationSec: 13800,
      localArrival: "2021-03-14T14:00:00.000Z",
      localDeparture: "2021-03-14T11:10:00.000Z",
    },
  ],
};

export const mockQueryFlightAvailable: OrderTypes.QueryFlightItineraryCart = {
  ...mockQueryFlightCart0,
  expiredTime: addDays(new Date(), 7).toISOString(),
};

export const mockFlightCart0 = {
  bookingToken: "138569904",
  adults: 1,
  available: true,
  baggage: [
    {
      category: "personal_item",
      count: 1,
      height: 30,
      id: "personal_item",
      length: 40,
      price: 0,
      weight: 2,
      width: 10,
    },
    {
      category: "cabin_bag",
      count: 1,
      height: 35,
      id: "cabin_bag",
      length: 55,
      price: 0,
      weight: 8,
      width: 23,
    },
  ],
  cartItemId: "11c3953c-eaa9-4663-8ae0-e4d0e13a9ea8",
  children: 0,
  clientRoute: {
    as: "/best-flights/details?adults=1&children=0&infants=0&dateFrom=2021-03-11&returnDateFrom=2021-03-14&destinationId=CPH&destinationName=Copenhagen&originId=KEF&originName=Reykjavik&flightType=round&cabinType=M&maxStops=any&cartItemId=11c3953c-eaa9-4663-8ae0-e4d0e13a9ea8",
    query: {
      adults: "1",
      cabinType: "M",
      children: "0",
      dateFrom: "2021-03-11",
      destinationId: "CPH",
      destinationName: "Copenhagen",
      flightType: "round",
      infants: "0",
      originId: "KEF",
      originName: "Reykjavik",
      returnDateFrom: "2021-03-14",
      maxStops: "any",
      cartItemId: "11c3953c-eaa9-4663-8ae0-e4d0e13a9ea8",
    },
    route: "/flightSearch",
  },
  expiredTime: "2021-02-22T15:02:34.438Z",
  id: "138569904",
  inboundDurationSec: 70500,
  inboundRoute: {
    airlines: [
      {
        code: "KL",
        imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
        name: "KLM Royal Dutch Airlines",
      },
      {
        code: "KL",
        imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
        name: "KLM Royal Dutch Airlines",
      },
      {
        code: "LH",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
        name: "Lufthansa",
      },
      {
        code: "LH",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
        name: "Lufthansa",
      },
    ],
    flights: [
      {
        airline: {
          code: "KL",
          imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
          name: "KLM Royal Dutch Airlines",
        },
        dateOfArrival: "Mar 13 2021",
        dateOfDeparture: "Mar 13 2021",
        destination: "Amsterdam",
        destinationAirport: "Amsterdam Airport Schiphol",
        destinationAirportCode: "AMS",
        destinationId: "AMS",
        durationInSec: 5100,
        flightClass: "Economy",
        flightNumber: "KL1134",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        id: "KL1134",
        layoverTimeInSec: undefined,
        localArrival: "2021-03-13T19:50:00.000Z",
        localDeparture: "2021-03-13T18:25:00.000Z",
        nightsInDestination: undefined,
        origin: "Copenhagen",
        originAirport: "Airport Copenhagen (RKE)",
        originAirportCode: "RKE",
        originId: "RKE",
        timeOfArrival: "19:50",
        timeOfDeparture: "18:25",
      },
      {
        airline: {
          code: "KL",
          imageUrl: "https://images.kiwi.com/airlines/64/KL.png",
          name: "KLM Royal Dutch Airlines",
        },
        dateOfArrival: "Mar 13 2021",
        dateOfDeparture: "Mar 13 2021",
        destination: "Oslo",
        destinationAirport: "Oslo Airport, Gardermoen",
        destinationAirportCode: "OSL",
        bagsRecheckRequired: undefined,
        guarantee: undefined,
        destinationId: "OSL",
        durationInSec: 6300,
        flightClass: "Economy",
        flightNumber: "KL1151",
        id: "KL1151",
        layoverTimeInSec: 2700,
        localArrival: "2021-03-13T22:20:00.000Z",
        localDeparture: "2021-03-13T20:35:00.000Z",
        nightsInDestination: undefined,
        origin: "Amsterdam",
        originAirport: "Amsterdam Airport Schiphol",
        originAirportCode: "AMS",
        originId: "AMS",
        timeOfArrival: "22:20",
        timeOfDeparture: "20:35",
      },
      {
        airline: {
          code: "LH",
          imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
          name: "Lufthansa",
        },
        dateOfArrival: "Mar 14 2021",
        dateOfDeparture: "Mar 14 2021",
        destination: "Frankfurt",
        destinationAirport: "Frankfurt International Airport",
        destinationAirportCode: "FRA",
        destinationId: "FRA",
        durationInSec: 8400,
        flightClass: "Economy",
        flightNumber: "LH865",
        id: "LH865",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        layoverTimeInSec: 30000,
        localArrival: "2021-03-14T09:00:00.000Z",
        localDeparture: "2021-03-14T06:40:00.000Z",
        nightsInDestination: undefined,
        origin: "Oslo",
        originAirport: "Oslo Airport, Gardermoen",
        originAirportCode: "OSL",
        originId: "OSL",
        timeOfArrival: "09:00",
        timeOfDeparture: "06:40",
      },
      {
        airline: {
          code: "LH",
          imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
          name: "Lufthansa",
        },
        dateOfArrival: "Mar 14 2021",
        dateOfDeparture: "Mar 14 2021",
        destination: "Reykjavik",
        destinationAirport: "Keflavík International",
        destinationAirportCode: "KEF",
        destinationId: "KEF",
        durationInSec: 13800,
        flightClass: "Economy",
        flightNumber: "LH856",
        id: "LH856",
        layoverTimeInSec: 7800,
        localArrival: "2021-03-14T14:00:00.000Z",
        localDeparture: "2021-03-14T11:10:00.000Z",
        nightsInDestination: undefined,
        origin: "Frankfurt",
        originAirport: "Frankfurt International Airport",
        originAirportCode: "FRA",
        originId: "FRA",
        timeOfArrival: "14:00",
        timeOfDeparture: "11:10",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
      },
    ],
    numberOfStops: 4,
    totalDurationSec: 70500,
  },
  infants: 0,
  isEditable: false,
  linkUrl:
    "/best-flights/details?adults=1&children=0&infants=0&dateFrom=2021-03-11&returnDateFrom=2021-03-14&destinationId=CPH&destinationName=Copenhagen&originId=KEF&originName=Reykjavik&flightType=round&cabinType=M&maxStops=any&cartItemId=11c3953c-eaa9-4663-8ae0-e4d0e13a9ea8",
  nightsInDestination: 1,
  numberOfPassengers: 1,
  outboundDurationSec: 66600,
  outboundRoute: {
    airlines: [
      {
        code: "LH",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
        name: "Lufthansa",
      },
      {
        code: "LH",
        imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
        name: "Lufthansa",
      },
      {
        code: "OS",
        imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
        name: "Austrian Airlines",
      },
      {
        code: "OS",
        imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
        name: "Austrian Airlines",
      },
    ],
    flights: [
      {
        airline: {
          code: "LH",
          imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
          name: "Lufthansa",
        },
        dateOfArrival: "Mar 11 2021",
        dateOfDeparture: "Mar 11 2021",
        destination: "Frankfurt",
        destinationAirport: "Frankfurt International Airport",
        destinationAirportCode: "FRA",
        destinationId: "FRA",
        durationInSec: 12900,
        flightClass: "Economy",
        flightNumber: "LH857",
        id: "LH857",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        layoverTimeInSec: undefined,
        localArrival: "2021-03-11T19:30:00.000Z",
        localDeparture: "2021-03-11T14:55:00.000Z",
        nightsInDestination: undefined,
        origin: "Reykjavik",
        originAirport: "Keflavík International",
        originAirportCode: "KEF",
        originId: "KEF",
        timeOfArrival: "19:30",
        timeOfDeparture: "14:55",
      },
      {
        airline: {
          code: "LH",
          imageUrl: "https://images.kiwi.com/airlines/64/LH.png",
          name: "Lufthansa",
        },
        dateOfArrival: "Mar 11 2021",
        dateOfDeparture: "Mar 11 2021",
        destination: "Belgrade",
        destinationAirport: "Belgrade Nikola Tesla",
        destinationAirportCode: "BEG",
        destinationId: "BEG",
        durationInSec: 6600,
        flightClass: "Economy",
        flightNumber: "LH1410",
        id: "LH1410",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        layoverTimeInSec: 6000,
        localArrival: "2021-03-11T23:00:00.000Z",
        localDeparture: "2021-03-11T21:10:00.000Z",
        nightsInDestination: undefined,
        origin: "Frankfurt",
        originAirport: "Frankfurt International Airport",
        originAirportCode: "FRA",
        originId: "FRA",
        timeOfArrival: "23:00",
        timeOfDeparture: "21:10",
      },
      {
        airline: {
          code: "OS",
          imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
          name: "Austrian Airlines",
        },
        dateOfArrival: "Mar 12 2021",
        dateOfDeparture: "Mar 12 2021",
        destination: "Vienna",
        destinationAirport: "Vienna International Airport",
        destinationAirportCode: "VIE",
        destinationId: "VIE",
        durationInSec: 4500,
        flightClass: "Economy",
        flightNumber: "OS738",
        id: "OS738",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        layoverTimeInSec: 24900,
        localArrival: "2021-03-12T07:10:00.000Z",
        localDeparture: "2021-03-12T05:55:00.000Z",
        nightsInDestination: undefined,
        origin: "Belgrade",
        originAirport: "Belgrade Nikola Tesla",
        originAirportCode: "BEG",
        originId: "BEG",
        timeOfArrival: "07:10",
        timeOfDeparture: "05:55",
      },
      {
        airline: {
          code: "OS",
          imageUrl: "https://images.kiwi.com/airlines/64/OS.png",
          name: "Austrian Airlines",
        },
        dateOfArrival: "Mar 12 2021",
        dateOfDeparture: "Mar 12 2021",
        destination: "Copenhagen",
        destinationAirport: "Airport Copenhagen",
        destinationAirportCode: "CPH",
        destinationId: "CPH",
        durationInSec: 6600,
        flightClass: "Economy",
        flightNumber: "OS301",
        id: "OS301",
        guarantee: undefined,
        bagsRecheckRequired: undefined,
        layoverTimeInSec: 1500,
        localArrival: "2021-03-12T09:25:00.000Z",
        localDeparture: "2021-03-12T07:35:00.000Z",
        nightsInDestination: 1,
        origin: "Vienna",
        originAirport: "Vienna International Airport",
        originAirportCode: "VIE",
        originId: "VIE",
        timeOfArrival: "09:25",
        timeOfDeparture: "07:35",
      },
    ],
    numberOfStops: 4,
    totalDurationSec: 66600,
  },
  price: 199775.15,
  priceObject: {
    priceDisplayValue: "199775.15",
    defaultPrice: 199775.15,
    currency: "ISK",
    price: 199775.15,
  },
  selected: undefined,
  title: "{origin} to {destination} and back",
  totalDurationSec: 137100,
};

export const mockDirectQueryFlight = {
  id: "143942843",
  bookingToken: "143942843",
  title: "Reykjavik to Copenhagen and back",
  cartItemId: "83d14d3d-3cac-460c-8a73-55c50402c6bd",
  adults: 1,
  available: true,
  children: 0,
  infants: 0,
  numberOfPassengers: 1,
  nightsInDestination: 2,
  inboundDurationSec: 4500,
  outboundDurationSec: 18900,
  totalDurationSec: 23400,
  baggage: [
    {
      id: "personal_item",
      category: "personal_item",
      price: 0,
      length: 40,
      width: 10,
      height: 30,
      count: 1,
      weight: 5,
    },
    {
      id: "cabin_bag",
      category: "cabin_bag",
      price: 0,
      length: 55,
      width: 20,
      height: 40,
      count: 1,
      weight: 10,
    },
  ],
  isEditable: false,
  expiredTime: "2021-04-21T10:42:30.819Z",
  price: 322,
  priceObject: {
    priceDisplayValue: "322",
    defaultPrice: 322,
    currency: "USD",
    price: 322,
  },
  outboundRoute: [
    {
      airline: {
        code: "FI",
        name: "Icelandair",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
      },
      cityFrom: {
        code: null,
        name: "Reykjavik",
      },
      cityTo: {
        code: null,
        name: "Copenhagen",
      },
      flightClass: "Economy",
      flightNumber: "204",
      flyFrom: {
        code: "KEF",
        name: "Keflavík International",
      },
      flyTo: {
        code: "CPH",
        name: "Airport Copenhagen",
      },
      layOverSec: 0,
      durationSec: 11700,
      localArrival: "2021-05-12T13:00:00.000Z",
      localDeparture: "2021-05-12T07:45:00.000Z",
    },
  ],
  inboundRoute: [
    {
      airline: {
        code: "FI",
        name: "Icelandair",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
      },
      cityFrom: {
        code: null,
        name: "Copenhagen",
      },
      cityTo: {
        code: null,
        name: "Reykjavik",
      },
      flightClass: "Economy",
      flightNumber: "205",
      flyFrom: {
        code: "CPH",
        name: "Airport Copenhagen",
      },
      flyTo: {
        code: "KEF",
        name: "Keflavík International",
      },
      layOverSec: 0,
      durationSec: 11700,
      localArrival: "2021-05-14T15:25:00.000Z",
      localDeparture: "2021-05-14T14:10:00.000Z",
    },
  ],
};

export const mockDirectCartFlight = {
  adults: 1,
  available: true,
  baggage: [
    {
      category: "personal_item",
      count: 1,
      height: 30,
      id: "personal_item",
      length: 40,
      price: 0,
      weight: 5,
      width: 10,
    },
    {
      category: "cabin_bag",
      count: 1,
      height: 40,
      id: "cabin_bag",
      length: 55,
      price: 0,
      weight: 10,
      width: 20,
    },
  ],
  bookingToken: "143942843",
  cartItemId: "83d14d3d-3cac-460c-8a73-55c50402c6bd",
  children: 0,
  clientRoute: {
    as: "/best-flights/details?adults=1&children=0&infants=0&dateFrom=2021-05-12&returnDateFrom=2021-05-14&destinationId=CPH&destinationName=Copenhagen&originId=KEF&originName=Reykjavik&flightType=round&cabinType=M&maxStops=any&cartItemId=83d14d3d-3cac-460c-8a73-55c50402c6bd",
    query: {
      adults: "1",
      cabinType: "M",
      children: "0",
      dateFrom: "2021-05-12",
      destinationId: "CPH",
      destinationName: "Copenhagen",
      flightType: "round",
      infants: "0",
      maxStops: "any",
      originId: "KEF",
      originName: "Reykjavik",
      returnDateFrom: "2021-05-14",
      cartItemId: "83d14d3d-3cac-460c-8a73-55c50402c6bd",
    },
    route: "/flightSearch",
  },
  expiredTime: "2021-04-21T10:42:30.819Z",
  id: "143942843",
  inboundDurationSec: 4500,
  inboundRoute: {
    airlines: [
      {
        code: "FI",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
        name: "Icelandair",
      },
    ],
    flights: [
      {
        airline: {
          code: "FI",
          imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
          name: "Icelandair",
        },
        dateOfArrival: "May 14 2021",
        dateOfDeparture: "May 14 2021",
        destination: "Reykjavik",
        destinationAirport: "Keflavík International",
        destinationAirportCode: "KEF",
        destinationId: "KEF",
        durationInSec: 11700,
        flightClass: "Economy",
        flightNumber: "FI205",
        id: "FI205",
        layoverTimeInSec: undefined,
        localArrival: "2021-05-14T15:25:00.000Z",
        localDeparture: "2021-05-14T14:10:00.000Z",
        nightsInDestination: undefined,
        origin: "Copenhagen",
        originAirport: "Airport Copenhagen",
        originAirportCode: "CPH",
        originId: "CPH",
        timeOfArrival: "15:25",
        timeOfDeparture: "14:10",
      },
    ],
    numberOfStops: 1,
    totalDurationSec: 4500,
  },
  infants: 0,
  isEditable: false,
  linkUrl:
    "/best-flights/details?adults=1&children=0&infants=0&dateFrom=2021-05-12&returnDateFrom=2021-05-14&destinationId=CPH&destinationName=Copenhagen&originId=KEF&originName=Reykjavik&flightType=round&cabinType=M&maxStops=any&cartItemId=83d14d3d-3cac-460c-8a73-55c50402c6bd",
  nightsInDestination: 2,
  numberOfPassengers: 1,
  outboundDurationSec: 18900,
  outboundRoute: {
    airlines: [
      {
        code: "FI",
        imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
        name: "Icelandair",
      },
    ],
    flights: [
      {
        airline: {
          code: "FI",
          imageUrl: "https://images.kiwi.com/airlines/64/FI.png",
          name: "Icelandair",
        },
        dateOfArrival: "May 12 2021",
        dateOfDeparture: "May 12 2021",
        destination: "Copenhagen",
        destinationAirport: "Airport Copenhagen",
        destinationAirportCode: "CPH",
        destinationId: "CPH",
        durationInSec: 11700,
        flightClass: "Economy",
        flightNumber: "FI204",
        id: "FI204",
        layoverTimeInSec: undefined,
        localArrival: "2021-05-12T13:00:00.000Z",
        localDeparture: "2021-05-12T07:45:00.000Z",
        nightsInDestination: 2,
        origin: "Reykjavik",
        originAirport: "Keflavík International",
        originAirportCode: "KEF",
        originId: "KEF",
        timeOfArrival: "13:00",
        timeOfDeparture: "07:45",
      },
    ],
    numberOfStops: 1,
    totalDurationSec: 18900,
  },
  price: 322,
  priceObject: {
    currency: "USD",
    defaultPrice: 322,
    price: 322,
    priceDisplayValue: "322",
  },
  title: "{origin} to {destination} and back",
  totalDurationSec: 23400,
};

export const mockFlightsBagsServiceDetails = {
  label: "Bags",
  values: ["1x Personal item: 40 × 10 × 30 cm - 2 kg", "1x Cabin bag: 55 × 23 × 35 cm - 8 kg"],
};

export const mockCarRentalQueryCart0: OrderTypes.QueryCarRental = {
  id: "cars-2",
  offerId: "offerId80",
  cartItemId: "cars-3",
  provider: "Carnect",
  category: "Small",
  pickupId: "111",
  dropoffId: "111",
  flightNumber: "mock flight number",
  pickupLocation: "Keflavík Airport",
  pickupSpecify: "pickup specify",
  dropoffLocation: "Keflavík Airport",
  dropoffSpecify: "dropoff specify",
  numberOfDays: 2,
  priceOnArrival: 20,
  extras: [
    {
      id: "1",
      name: "GPS(Global Positioning System)",
      count: 1,
      price: 17.61,
    },
    {
      id: "2",
      name: "Map",
      count: 1,
      price: 16.3,
    },
    {
      id: "5",
      name: "Additional Driver",
      count: 3,
      price: 66.51,
    },
    {
      id: "7",
      name: "Child Seat(1-3 years)",
      count: 0,
      price: 76.32000000000001,
    },
    {
      id: "8",
      name: "Infant Seat(0-1 year)",
      count: 0,
      price: 76.32000000000001,
    },
    {
      id: "3",
      name: "Trailer",
      count: 1,
      price: 116.09,
    },
    {
      id: "13",
      name: "4G internet box",
      count: 1,
      price: 32.61,
    },
  ],
  insurances: [
    {
      id: "ALL",
      name: "Gold insurance",
      count: 1,
      price: 50.21,
    },
    {
      id: "SCDW",
      name: "Super collision damage waiver",
      count: 1,
      price: 19.56,
    },
    {
      id: "GP",
      name: "Gravel protection",
      count: 1,
      price: 19.56,
    },
    {
      id: "TP",
      name: "Theft protection",
      count: 1,
      price: 12.91,
    },
  ],
  priceBreakdown: [
    {
      id: "BSYAtmYBv",
      name: "Car rental for 2 days.",
      currency: "EUR",
      quantity: 1,
      pricePerUnit: 57,
      pricePerUnitDisplay: "57",
      totalPrice: 57,
      totalPriceDisplay: "57",
      priceObject: {
        priceDisplayValue: "57",
        defaultPrice: 57,
        currency: "EUR",
        price: 57,
      },
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: true,
      type: "Rental",
      translationKeys: {
        keys: [
          {
            key: "rental_name",
            variables: [
              {
                key: "YY0",
                value: "2",
              },
            ],
          },
        ],
      },
    },
  ],
  payOnArrival: [
    {
      id: "222",
      name: "Additional Driver",
      currency: "USD",
      quantity: 1,
      pricePerUnit: 25,
      pricePerUnitDisplay: "25",
      totalPrice: 25,
      totalPriceDisplay: "25",
      priceObject: {
        priceDisplayValue: "25",
        defaultPrice: 25,
        currency: "USD",
        price: 25,
      },
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: false,
      type: "Extra",
      translationKeys: {
        keys: [
          {
            key: "extra_222_name",
            variables: [],
          },
        ],
      },
    },
    {
      id: "13",
      name: "GPS (Global Positioning System)",
      currency: "USD",
      quantity: 1,
      pricePerUnit: 19.98,
      pricePerUnitDisplay: "20",
      totalPrice: 19.98,
      totalPriceDisplay: "20",
      priceObject: {
        priceDisplayValue: "20",
        defaultPrice: 20,
        currency: "USD",
        price: 20,
      },
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: false,
      type: "Extra",
      translationKeys: {
        keys: [
          {
            key: "extra_13_name",
            variables: [],
          },
        ],
      },
    },
    {
      id: "8",
      name: "Child Seat (1-3 years)",
      currency: "USD",
      quantity: 1,
      pricePerUnit: 29,
      pricePerUnitDisplay: "29",
      totalPrice: 29,
      totalPriceDisplay: "29",
      priceObject: {
        priceDisplayValue: "29",
        defaultPrice: 29,
        currency: "USD",
        price: 29,
      },
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: false,
      type: "Extra",
      translationKeys: {
        keys: [
          {
            key: "extra_8_name",
            variables: [],
          },
        ],
      },
    },
    {
      id: "7",
      name: "Infant Seat (0-1 year)",
      currency: "USD",
      quantity: 1,
      pricePerUnit: 29,
      pricePerUnitDisplay: "29",
      totalPrice: 29,
      totalPriceDisplay: "29",
      priceObject: {
        priceDisplayValue: "29",
        defaultPrice: 29,
        currency: "USD",
        price: 29,
      },
      isMinAmount: false,
      isMaxAmount: false,
      includeInBasePrice: false,
      type: "Extra",
      translationKeys: {
        keys: [
          {
            key: "extra_7_name",
            variables: [],
          },
        ],
      },
    },
  ],
  title: "Volkswagen Up!  2018 manual",
  totalPrice: 315,
  imageUrl: "https://guidetoiceland.imgix.net/273102/x/0/vw-up-2015-jpg",
  available: true,
  editable: true,
  locationDetails: {
    pickup: {
      address: "Keflavik International Airport, Keflavik",
      streetNumber: "Keflavik International Airport",
      cityName: "Keflavik",
      postalCode: "235",
      state: "Iceland",
      country: "Iceland",
      phoneNumber: "+354-5914000",
      openingHours: [
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 1,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 1,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 2,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 2,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 3,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 3,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 4,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 4,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 5,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 5,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 6,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 6,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 0,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 0,
        },
      ],
    },
    dropoff: {
      address: "Keflavik International Airport, Keflavik",
      streetNumber: "Keflavik International Airport",
      cityName: "Keflavik",
      postalCode: "235",
      state: "Iceland",
      country: "Iceland",
      phoneNumber: "+354-5914000",
      openingHours: [
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 1,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 1,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 2,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 2,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 3,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 3,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 4,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 4,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 5,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 5,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 6,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 6,
        },
        {
          isOpen: true,
          openFrom: "00:00",
          openTo: "01:00",
          dayOfWeek: 0,
        },
        {
          isOpen: true,
          openFrom: "06:00",
          openTo: "23:59",
          dayOfWeek: 0,
        },
      ],
    },
  },
  from: "2021-03-06T12:00:00.000Z",
  to: "2021-03-08T12:00:00.000Z",
  updated: "0001-01-01T00:00:00.000Z",
  createdTime: "2021-02-25T22:52:43.000Z",
  expiredTime: "2021-02-25T23:20:00.000Z",
  priceObject: {
    priceDisplayValue: "315",
    defaultPrice: 315,
    currency: "USD",
    price: 315,
  },
};

export const mockCustomProductDrink: OrderTypes.QueryCustomProduct = {
  id: "520",
  description: "Drinks for Gophercon group - bought at Kronan with cc 2033 (Omar)",
  date: "2021-06-25T00:00:00.000Z",
  days: null,
  options: {
    attachments: [],
    includedKm: null,
    quantity: 34,
    pickup: null,
    dropoff: null,
    flightNumber: null,
    travelers: null,
    email: null,
    phone: null,
  },
  price: 3437,
  title: "Drinks",
  cartItemId: "customs-2",
  totalPrice: 3437,
  imageUrl: "",
  available: true,
  editable: false,
  currency: "ISK",
  discountAmount: 0,
  discountPercentage: 0,
  from: "2021-06-25T00:00:00.000Z",
  to: "2021-06-25T00:00:00.000Z",
  updated: "2021-06-17T11:49:26.000Z",
  createdTime: "2021-06-17T11:49:26.726Z",
  isPaymentLink: false,
  priceObject: {
    priceDisplayValue: "3437",
    defaultPrice: 3437,
    currency: "ISK",
    price: 3437,
  },
};

export const mockCustomProductDrinkConstruct: OrderTypes.QueryCustomsConstruct = {
  ...mockCustomProductDrink,
  date: new Date("2021-06-25T00:00:00.000Z"),
  from: new Date("2021-06-25T00:00:00.000Z"),
  to: new Date("2021-06-25T00:00:00.000Z"),
  updated: new Date("2021-06-17T11:49:26.000Z"),
  createdTime: new Date("2021-06-17T11:49:26.726Z"),
};

export const mockCustomProductDrinkProductServiceDetails = {
  title: "Service details",
  sections: [
    {
      label: "Description",
      values: ["Drinks for Gophercon group - bought at Kronan with cc 2033 (Omar)"],
    },
    {
      label: "Date",
      values: ["{date} at {time}"],
    },
  ],
};

export const mockPaymentLinkInvoice: OrderTypes.QueryCustomProduct = {
  id: "001",
  description: "<p>Test invoice description</p>\n",
  date: "0001-01-01T00:00:00.000Z",
  days: null,
  price: 6.9,
  title: "Test invoice",
  cartItemId: "I-33698",
  totalPrice: 6.9,
  available: true,
  editable: false,
  currency: "USD",
  discountAmount: 0,
  discountPercentage: 0,
  from: "0001-01-01T00:00:00.000Z",
  to: "0001-01-01T00:00:00.000Z",
  updated: "0001-01-01T00:00:00.000Z",
  createdTime: "2023-02-21T15:17:08.324Z",
  isPaymentLink: true,
  invoiceNumber: "I-33698",
  bookingId: "T-548755",
  priceObject: {
    priceDisplayValue: "6.9",
    defaultPrice: 6.9,
    currency: "USD",
    price: 6.9,
  },
};

export const mockPaymentLinkInvoiceConstruct: OrderTypes.QueryCustomsConstruct = {
  ...mockPaymentLinkInvoice,
  date: new Date("0001-01-01T00:00:00.000Z"),
  from: new Date("0001-01-01T00:00:00.000Z"),
  to: new Date("0001-01-01T00:00:00.000Z"),
  updated: new Date("0001-01-01T00:00:00.000Z"),
  createdTime: new Date("2023-02-21T15:17:08.324Z"),
};

export const mockPaymentLinkInvoiceServiceDetails = {
  title: "Service details",
  sections: [
    {
      label: "Connected booking number",
      values: ["T-548755"],
    },
    {
      label: "Invoice number",
      values: ["I-33698"],
    },
    {
      label: "Description",
      values: ["Test invoice description\n"],
    },
  ],
};

export const mockVoucherPaidPaymentLinkInvoice: VoucherTypes.VoucherQueryCustomProduct = {
  bookingNumber: "T-548755",
  externalId: "I-33697",
  bookingDate: "2023-02-21T11:21:13.866Z",
  editableStatus: EditableStatus.UNAVAILABLE,
  vatAmount: 0,
  vatPercentage: 0,
  cart: {
    id: "001",
    description: "<p>This is a description</p>\n",
    date: "0001-01-01T00:00:00.000Z",
    days: null,
    price: 6.9,
    title: "Test February 21st 2023",
    cartItemId: "I-33697",
    totalPrice: 6.9,
    available: true,
    editable: false,
    currency: "USD",
    discountAmount: 0,
    discountPercentage: 0,
    from: "0001-01-01T00:00:00.000Z",
    to: "0001-01-01T00:00:00.000Z",
    updated: "0001-01-01T00:00:00.000Z",
    createdTime: "2023-02-21T11:21:13.866Z",
    isPaymentLink: true,
    invoiceNumber: "I-33697",
    bookingId: "T-548755",
    priceObject: {
      priceDisplayValue: "6.9",
      defaultPrice: 6.9,
      currency: "USD",
      price: 6.9,
    },
  },
  voucherPriceObjects: [
    {
      priceObject: {
        priceDisplayValue: "6.9",
        defaultPrice: 6.9,
        currency: "USD",
        price: 6.9,
      },
      vatPriceObject: {
        priceDisplayValue: "0",
        defaultPrice: 0,
        currency: "USD",
        price: 0,
      },
    },
  ],
};

export const mockPaidPaymentLinkInvoiceConstruct: OrderTypes.QueryCustomsConstruct = {
  ...mockVoucherPaidPaymentLinkInvoice.cart,
  date: new Date("0001-01-01T00:00:00.000Z"),
  from: new Date("0001-01-01T00:00:00.000Z"),
  to: new Date("0001-01-01T00:00:00.000Z"),
  updated: new Date("0001-01-01T00:00:00.000Z"),
  createdTime: new Date("2023-02-21T11:21:13.866Z"),
};

export const mockPaidPaymentLinkInvoiceServiceDetails = {
  title: "Service details",
  sections: [
    {
      label: "Connected booking number",
      values: ["T-548755"],
    },
    {
      label: "Invoice number",
      values: ["I-33697"],
    },
    {
      label: "Paid date",
      values: ["February 21, 2023, 11:21 AM"],
    },
    {
      label: "Description",
      values: ["This is a description\n"],
    },
  ],
};

const carnectProvider = CarProvider.CARNECT;
const carnectProviderId = CarProviderId.CARNECT;
const carRentalLink =
  `/baseUrl/search-results/book/Volkswagen%20Up!%20%202018%20manual/${mockCarRentalQueryCart0.offerId}` +
  `?from=2021-03-06 12:00&to=2021-03-08 12:00` +
  `&pickup_id=${mockCarRentalQueryCart0.pickupId}` +
  `&dropoff_id=${mockCarRentalQueryCart0.dropoffId}` +
  `&provider=${carnectProviderId}` +
  `&driverAge=45` +
  `&category=${mockCarRentalQueryCart0.category}&pickupLocationName=${encodeURI(
    "Keflavík Airport"
  )}&dropoffLocationName=${encodeURI("Keflavík Airport")}`;

export const mockCarRentalCart0: OrderTypes.CarRental = {
  ...mockCarRentalQueryCart0,
  provider: carnectProvider,
  from: new Date(mockCarRentalQueryCart0.from as string),
  to: new Date(mockCarRentalQueryCart0.to as string),
  updated: new Date(mockCarRentalQueryCart0.updated as string),
  createdTime: new Date(mockCarRentalQueryCart0.createdTime as string),
  expiredTime: new Date(mockCarRentalQueryCart0.expiredTime as string),
  clientRoute: {
    route: "/car",
    as: carRentalLink,
    query: {
      carId: mockCarRentalQueryCart0.offerId,
      category: mockCarRentalQueryCart0.category,
      dropoff_id: mockCarRentalQueryCart0.dropoffId,
      pickup_id: mockCarRentalQueryCart0.pickupId,
      provider: "1",
      from: "2021-03-06 12:00",
      to: "2021-03-08 12:00",
      carName: "Volkswagen Up!  2018 manual",
      driverAge: "45",
      dropoffLocationName: "Keflavík Airport",
      pickupLocationName: "Keflavík Airport",
    },
  },
  cartItemIdParsed: 3,
  linkUrl: carRentalLink,
  editLinkUrl: `${carRentalLink}&cart_item=3`,
};

export const mockCarRentalCart0ExtrasServiceDetails = [
  {
    label: "Extras",
    values: [
      "GPS(Global Positioning System)",
      "Map",
      "3x Additional Driver",
      "Child Seat(1-3 years)",
      "Infant Seat(0-1 year)",
      "Trailer",
      "4G internet box",
    ],
  },
];

export const mockCarRentalCart0InsurancesServiceDetails = [
  {
    label: "Insurances",
    values: [
      "Gold insurance",
      "Super collision damage waiver",
      "Gravel protection",
      "Theft protection",
    ],
  },
];

export const mockSelfDriveTour: OrderTypes.QueryTour = {
  tourId: 352,
  type: TourType.SelfDrive,
  linkUrl: "/book-holiday-trips/aurora-holiday-in-iceland-7-days",
  adults: 1,
  teenagers: 0,
  children: 0,
  category: {
    id: 0,
    uri: "category/uri",
    name: "some tour category",
  },
  extras: [
    {
      extraId: "76807",
      name: "Accommodation",
      answer: "Comfort (private room, private bath)",
      included: true,
      price: 89662,
      required: true,
    },
    {
      extraId: "76808",
      name: "Car",
      answer: "Comfort 4WD Automatic",
      included: true,
      price: 44531,
      required: true,
    },
    {
      extraId: "76806",
      name: "Blue Lagoon (minimum age 2)",
      answer: "Comfort Entrance",
      included: true,
      price: 9900,
      required: true,
    },
    {
      extraId: "82399",
      name: "Activity on day 2",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77588",
      name: "Activity on day 3",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77589",
      name: "Activity on day 4",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77781",
      name: "Activity on day 5",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77690",
      name: "Activity on day 6",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "85077",
      name: "Add Dinners",
      answer: "No",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "80504",
      name: "Cancellation Insurance",
      answer: "Yes",
      included: true,
      price: 7000,
      required: true,
    },
  ],
  valueProps: [
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "travelPlan",
      title: "Perfect travel plan",
    },
    {
      iconId: "fullyCustomizable",
      title: "Fully customizable",
    },
    {
      iconId: "carAndAccommodation",
      title: "Car & accommodation",
    },
  ],
  specs: [
    {
      iconId: "tourStartingTime",
      name: "Starting time",
      value: "Flexible",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "7 days",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Sep. - Apr.",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "None",
    },
  ],
  durationSec: 604800,
  durationText: "7 days",
  title: "Spectacular 7 Day Northern Lights Self Drive Tour of Iceland to a Unique Ice Cave",
  cartItemId: "tours-2",
  totalPrice: 151093,
  imageUrl:
    "https://guidetoiceland.imgix.net/4679/x/0/northern-lights-dancing-over-the-jet-black-church-at-budir-in-snaefellsnes.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: "2021-03-24T00:00:00.000Z",
  to: "2021-03-31T00:00:00.000Z",
  updated: "2021-03-03T11:55:25.394Z",
  createdTime: "2021-03-03T11:55:25.394Z",
  pickup: QueryTourPickup.NO_PICKUP,
  whatToBringItems: [
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
  ],
  priceObject: {
    priceDisplayValue: "151093",
    defaultPrice: 151093,
    currency: "ISK",
    price: 151093,
  },
};

export const mockDayTour: OrderTypes.QueryTour = {
  tourId: 820,
  linkUrl: "/book-holiday-trips/glacier-caving-in-vatnajokull",
  type: TourType.Day,
  adults: 3,
  teenagers: 0,
  children: 0,
  extras: [],
  category: {},
  valueProps: [
    {
      iconId: "freeCancellation",
      title: "Free cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
  ],
  specs: [
    {
      iconId: "tourStarts",
      name: "Tour starts",
      value: "Jökulsárlón, Iceland",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "3 hours",
    },
    {
      iconId: "difficultyEasy",
      name: "Difficulty",
      value: "Easy",
    },
    {
      iconId: "guidedLanguage",
      name: "Languages",
      value: "English",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Oct. - Mar.",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "8 years old",
    },
  ],
  durationSec: 10800,
  durationText: "3 hours",
  title: "Best  Ice Cave Tour in Vatnajokull Glacier Starting from Jokulsarlon Glacier Lagoon",
  cartItemId: "tours-4",
  totalPrice: 59700,
  imageUrl:
    "https://guidetoiceland.imgix.net/526962/x/0/woman-in-yellow-coat-at-the-vatnajokull-ice-cave.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: "2021-03-23T00:00:00.000Z",
  to: "2021-03-23T03:00:00.000Z",
  updated: "2021-03-03T11:55:28.732Z",
  createdTime: "2021-03-03T11:55:28.732Z",
  pickup: QueryTourPickup.PRICED_PICKUP,
  pickupLocation: "Pick up location",
  departurePoint: "Mock departurePoint info",
  whatToBringItems: [
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
    {
      id: 5482,
      name: "Camera",
      included: true,
    },
  ],
  startingLocation: { locationName: "Jökulsárlón, Iceland" },
  endingLocation: { locationName: "Jökulsárlón, Iceland" },
  priceObject: {
    priceDisplayValue: "59,700",
    defaultPrice: 59700,
    currency: "ISK",
    price: 59700,
  },
};

export const mockVacationPackageTour: OrderTypes.QueryTour = {
  tourId: 1562,
  linkUrl: "/book-holiday-trips/iceland-summer-vacation-4-day-3-nights",
  type: TourType.Package,
  adults: 3,
  teenagers: 1,
  children: 2,
  category: {},
  extras: [
    {
      extraId: "76927",
      name: "Accommodation",
      answer: "Comfort (private room, private bath)",
      included: true,
      price: 391310,
      required: true,
    },
    {
      extraId: "76716",
      name: "Blue Lagoon",
      answer: "Comfort Entrance",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "76717",
      name: "Golden Circle Tour",
      answer: "Sightseeing Bus Tour",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "76718",
      name: "South Coast Tour",
      answer: "South Coast sightseeing bus tour",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "85122",
      name: "Add Dinners",
      answer: "No",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "80555",
      name: "Cancellation Insurance",
      answer: "Yes",
      included: true,
      price: 25000,
      required: true,
    },
  ],
  valueProps: [
    {
      iconId: "travelPlan",
      title: "Perfect travel plan",
    },
    {
      iconId: "fullyCustomizable",
      title: "Fully customizable",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
  ],
  specs: [
    {
      iconId: "tourStarts",
      name: "Tour starts",
      value: "Keflavík Airport",
    },
    {
      iconId: "tourStartingTime",
      name: "Starting time",
      value: "Flexible",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "4 days",
    },
    {
      iconId: "endingPlace",
      name: "Ending place",
      value: "Keflavík Airport",
    },
    {
      iconId: "guidedLanguage",
      name: "Languages",
      value: "English",
    },
    {
      iconId: "difficultyEasy",
      name: "Difficulty",
      value: "Easy",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Apr. - Aug.",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "None",
    },
  ],
  durationSec: 345600,
  durationText: "4 days",
  title: "Scenic 4 Day Summer Vacation Package in Iceland with the Golden Circle",
  cartItemId: "tours-7",
  totalPrice: 416310,
  imageUrl:
    "https://guidetoiceland.imgix.net/504090/x/0/the-waters-of-thingvellir-national-park-are-incredibly-clear-and-clean.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: "2021-05-20T00:00:00.000Z",
  to: "2021-05-24T00:00:00.000Z",
  updated: "2021-03-11T20:28:40.775Z",
  createdTime: "2021-03-11T20:28:40.775Z",
  pickup: QueryTourPickup.PRICED_PICKUP,
  pickupLocation: "Pick up location",
  whatToBringItems: [
    {
      id: 5479,
      name: "Warm and waterproof clothing",
      included: true,
    },
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
    {
      id: 5481,
      name: "Swimsuit and Towel",
      included: true,
    },
    {
      id: 5482,
      name: "Camera",
      included: true,
    },
  ],
  startingLocation: { locationName: "Keflavík Airport" },
  endingLocation: { locationName: "Keflavík Airport" },
  priceObject: {
    priceDisplayValue: "416310",
    defaultPrice: 416310,
    currency: "ISK",
    price: 416310,
  },
};

export const mockSelfDriveTourCart: OrderTypes.Tour = {
  id: "352",
  type: TourType.SelfDrive,
  adults: 1,
  teenagers: 0,
  children: 0,
  category: {
    id: 0,
    uri: "category/uri",
    name: "some tour category",
  },
  extras: [
    {
      extraId: "76807",
      name: "Accommodation",
      answer: "Comfort (private room, private bath)",
      included: true,
      price: 89662,
      required: true,
    },
    {
      extraId: "76808",
      name: "Car",
      answer: "Comfort 4WD Automatic",
      included: true,
      price: 44531,
      required: true,
    },
    {
      extraId: "76806",
      name: "Blue Lagoon (minimum age 2)",
      answer: "Comfort Entrance",
      included: true,
      price: 9900,
      required: true,
    },
    {
      extraId: "82399",
      name: "Activity on day 2",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77588",
      name: "Activity on day 3",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77589",
      name: "Activity on day 4",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77781",
      name: "Activity on day 5",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "77690",
      name: "Activity on day 6",
      answer: "Sightseeing",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "85077",
      name: "Add Dinners",
      answer: "No",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "80504",
      name: "Cancellation Insurance",
      answer: "Yes",
      included: true,
      price: 7000,
      required: true,
    },
  ],
  valueProps: [
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "travelPlan",
      title: "Perfect travel plan",
    },
    {
      iconId: "fullyCustomizable",
      title: "Fully customizable",
    },
    {
      iconId: "carAndAccommodation",
      title: "Car & accommodation",
    },
  ],
  specs: [
    {
      iconId: "tourStartingTime",
      name: "Starting time",
      value: "Flexible",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "7 days",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Sep. - Apr.",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "None",
    },
  ],
  durationSec: 604800,
  durationText: "7 days",
  title: "Spectacular 7 Day Northern Lights Self Drive Tour of Iceland to a Unique Ice Cave",
  cartItemId: "tours-2",
  totalPrice: 151093,
  imageUrl:
    "https://guidetoiceland.imgix.net/4679/x/0/northern-lights-dancing-over-the-jet-black-church-at-budir-in-snaefellsnes.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: new Date("2021-03-24T00:00:00.000Z"),
  to: new Date("2021-03-31T00:00:00.000Z"),
  updated: new Date("2021-03-03T11:55:25.394Z"),
  createdTime: new Date("2021-03-03T11:55:25.394Z"),
  numberOfTravelers: 1,
  linkUrl: "/book-holiday-trips/aurora-holiday-in-iceland-7-days",
  clientRoute: {
    query: {
      slug: "aurora-holiday-in-iceland-7-days",
    },
    route: "/tour",
    as: "/book-holiday-trips/aurora-holiday-in-iceland-7-days",
  },
  editLinkUrl: "/book-holiday-trips/aurora-holiday-in-iceland-7-days?cart_item=2&adults=1",
  pickup: QueryTourPickup.NO_PICKUP,
  whatToBringItems: [
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
  ],
  priceObject: {
    priceDisplayValue: "151093",
    defaultPrice: 151093,
    currency: "ISK",
    price: 151093,
  },
};

export const mockDayTourCart: OrderTypes.Tour = {
  id: "820",
  type: TourType.Day,
  adults: 3,
  teenagers: 0,
  children: 0,
  extras: [],
  category: {},
  valueProps: [
    {
      iconId: "freeCancellation",
      title: "Free cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
  ],
  specs: [
    {
      iconId: "tourStarts",
      name: "Tour starts",
      value: "Jökulsárlón, Iceland",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "3 hours",
    },
    {
      iconId: "difficultyEasy",
      name: "Difficulty",
      value: "Easy",
    },
    {
      iconId: "guidedLanguage",
      name: "Languages",
      value: "English",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Oct. - Mar.",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "8 years old",
    },
  ],
  durationSec: 10800,
  durationText: "3 hours",
  title: "Best  Ice Cave Tour in Vatnajokull Glacier Starting from Jokulsarlon Glacier Lagoon",
  cartItemId: "tours-4",
  totalPrice: 59700,
  imageUrl:
    "https://guidetoiceland.imgix.net/526962/x/0/woman-in-yellow-coat-at-the-vatnajokull-ice-cave.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: new Date("2021-03-23T00:00:00.000Z"),
  to: new Date("2021-03-23T03:00:00.000Z"),
  updated: new Date("2021-03-03T11:55:28.732Z"),
  createdTime: new Date("2021-03-03T11:55:28.732Z"),
  numberOfTravelers: 3,
  clientRoute: {
    query: {
      slug: "glacier-caving-in-vatnajokull",
    },
    route: "/tour",
    as: "/book-holiday-trips/glacier-caving-in-vatnajokull",
  },
  linkUrl: "/book-holiday-trips/glacier-caving-in-vatnajokull",
  editLinkUrl: "/book-holiday-trips/glacier-caving-in-vatnajokull?cart_item=4&adults=3",
  pickup: QueryTourPickup.PRICED_PICKUP,
  pickupLocation: "Pick up location",
  departurePoint: "Mock departurePoint info",
  whatToBringItems: [
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
    {
      id: 5482,
      name: "Camera",
      included: true,
    },
  ],
  startingLocation: { locationName: "Jökulsárlón, Iceland" },
  endingLocation: { locationName: "Jökulsárlón, Iceland" },
  priceObject: {
    priceDisplayValue: "59,700",
    defaultPrice: 59700,
    currency: "ISK",
    price: 59700,
  },
};
export const mockDayTourCartWithExtras: OrderTypes.Tour = {
  ...mockDayTourCart,
  extras: [
    {
      extraId: "80194",
      name: "Regular Car",
      answer: "",
      answers: ["LPN: BH1234YA", "Length: 5m"],
      included: false,
      price: 5060,
      required: false,
    },
  ],
};

export const mockVacationPackageTourCart: OrderTypes.Tour = {
  type: TourType.Package,
  adults: 3,
  teenagers: 1,
  children: 2,
  category: {},
  extras: [
    {
      extraId: "76927",
      name: "Accommodation",
      answer: "Comfort (private room, private bath)",
      included: true,
      price: 391310,
      required: true,
    },
    {
      extraId: "76716",
      name: "Blue Lagoon",
      answer: "Comfort Entrance",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "76717",
      name: "Golden Circle Tour",
      answer: "Sightseeing Bus Tour",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "76718",
      name: "South Coast Tour",
      answer: "South Coast sightseeing bus tour",
      included: true,
      price: 0,
      required: true,
    },
    {
      extraId: "85122",
      name: "Add Dinners",
      answer: "No",
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "80555",
      name: "Cancellation Insurance",
      answer: "Yes",
      included: true,
      price: 25000,
      required: true,
    },
  ],
  valueProps: [
    { iconId: "travelPlan", title: "Perfect travel plan" },
    { iconId: "fullyCustomizable", title: "Fully customizable" },
    { iconId: "customerSupport", title: "24/7 customer support" },
  ],
  specs: [
    { iconId: "tourStarts", name: "Tour starts", value: "Keflavík Airport" },
    { iconId: "tourStartingTime", name: "Starting time", value: "Flexible" },
    { iconId: "duration", name: "Duration", value: "4 days" },
    { iconId: "endingPlace", name: "Ending place", value: "Keflavík Airport" },
    { iconId: "guidedLanguage", name: "Languages", value: "English" },
    { iconId: "difficultyEasy", name: "Difficulty", value: "Easy" },
    { iconId: "availability", name: "Available", value: "Apr. - Aug." },
    { iconId: "minAge", name: "Minimum age", value: "None" },
  ],
  durationSec: 345600,
  durationText: "4 days",
  title: "Scenic 4 Day Summer Vacation Package in Iceland with the Golden Circle",
  cartItemId: "tours-7",
  totalPrice: 416310,
  imageUrl:
    "https://guidetoiceland.imgix.net/504090/x/0/the-waters-of-thingvellir-national-park-are-incredibly-clear-and-clean.jpg?w=&h=&crop=faces&fit=crop",
  available: true,
  editable: true,
  from: new Date("2021-05-20T00:00:00.000Z"),
  to: new Date("2021-05-24T00:00:00.000Z"),
  updated: new Date("2021-03-11T20:28:40.775Z"),
  createdTime: new Date("2021-03-11T20:28:40.775Z"),
  id: "1562",
  numberOfTravelers: 6,
  clientRoute: {
    query: {
      slug: "iceland-summer-vacation-4-day-3-nights",
    },
    route: "/tour",
    as: "/book-holiday-trips/iceland-summer-vacation-4-day-3-nights",
  },
  linkUrl: "/book-holiday-trips/iceland-summer-vacation-4-day-3-nights",
  editLinkUrl:
    "/book-holiday-trips/iceland-summer-vacation-4-day-3-nights?cart_item=7&adults=3&children=2&teenagers=1",
  pickup: QueryTourPickup.PRICED_PICKUP,
  pickupLocation: "Pick up location",
  whatToBringItems: [
    {
      id: 5479,
      name: "Warm and waterproof clothing",
      included: true,
    },
    {
      id: 5480,
      name: "Winter hiking shoes",
      included: true,
    },
    {
      id: 5481,
      name: "Swimsuit and Towel",
      included: true,
    },
    {
      id: 5482,
      name: "Camera",
      included: true,
    },
  ],
  startingLocation: { locationName: "Keflavík Airport" },
  endingLocation: { locationName: "Keflavík Airport" },
  priceObject: {
    priceDisplayValue: "416310",
    defaultPrice: 416310,
    currency: "ISK",
    price: 416310,
  },
};

export const mockMultiDayTourCart: OrderTypes.Tour = {
  id: "777",
  numberOfTravelers: 1,
  type: TourType.MultiDay,
  linkUrl: "/book-holiday-trips/8-day-ultimate-iceland-highlight-hitter",
  editLinkUrl: "/book-holiday-trips/8-day-ultimate-iceland-highlight-hitter",
  clientRoute: {
    query: {
      slug: "8-day-ultimate-iceland-highlight-hitter",
    },
    route: "/tour",
    as: "/book-holiday-trips/8-day-ultimate-iceland-highlight-hitter",
  },
  category: {
    id: 333,
    name: "Multi-Day Tours",
    uri: "/book-trips-holiday/adventure-tours/multi-day-tours",
  },
  adults: 1,
  teenagers: 0,
  children: 0,
  discountAmount: 0,
  discountPercentage: 0,
  extras: [
    {
      extraId: "86131",
      name: "Accommodation",
      answer: "",
      answers: [
        "Number of twin rooms (two people per room): 1",
        "Number of single rooms (Single room fee extra must be selected and paid to guarantee a single room) : 0",
        "Number of triple rooms (three persons per room): 0",
        "Number of double rooms (two people per room) : 0",
      ],
      included: false,
      price: 0,
      required: true,
    },
    {
      extraId: "86133",
      name: "Hiking Boots",
      answer: "What is your shoe size?: 40 EUR / 7.5 US",
      answers: [],
      included: false,
      price: 4500,
      required: false,
    },
    {
      extraId: "88290",
      name: "Luggage Storage",
      answer: "",
      answers: [],
      included: false,
      price: 5000,
      required: false,
    },
    {
      extraId: "86140",
      name: "Waterproof Jacket",
      answer: "What is your jacket size?: XL",
      answers: [],
      included: false,
      price: 4500,
      required: false,
    },
    {
      extraId: "86141",
      name: "Waterproof Pants",
      answer: "What is your pant size?: S",
      answers: [],
      included: false,
      price: 4500,
      required: false,
    },
  ],
  valueProps: [
    {
      iconId: "",
      title: "24/7 customer support",
    },
    {
      iconId: "",
      title: "Best price guarantee",
    },
    {
      iconId: "",
      title: "Free pickup",
    },
    {
      iconId: "",
      title: "Instant confirmation",
    },
  ],
  specs: [
    {
      iconId: "tourStarts",
      name: "Tour starts",
      value: "Reykjavík, Iceland",
    },
    {
      iconId: "tourStartingTime",
      name: "Starting time",
      value: "at 08:00",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "8 days",
    },
    {
      iconId: "endingPlace",
      name: "Ending place",
      value: "Reykjavík, Iceland",
    },
    {
      iconId: "guidedLanguage",
      name: "Languages",
      value: "English",
    },
    {
      iconId: "difficultyEasy",
      name: "Difficulty",
      value: "Easy",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "All year",
    },
    {
      iconId: "minAge",
      name: "Minimum age",
      value: "8 years old",
    },
  ],
  durationSec: 608400,
  durationText: "8 days and 1 hour",
  title: "Immersive 8-Day Ring Road, Highlands and Snaefellsnes Peninsula Tour from Reykjavik",
  cartItemId: "tours-4",
  totalPrice: 348490,
  imageUrl:
    "https://guidetoiceland.imgix.net/540962/x/0/251736b8-bd76-40bd-8473-e5bb11dfd40d-jpg?crop=faces&fit=crop&h=239&ixlib=php-3.3.0&w=239",
  available: true,
  editable: true,
  from: new Date("2023-02-22T08:00:00.000Z"),
  to: new Date("2023-03-01T09:00:00.000Z"),
  updated: new Date("2023-01-17T15:13:49.000Z"),
  createdTime: new Date("2023-01-17T15:13:49.000Z"),
  departureInformation: "",
  whatToBringItems: [
    {
      id: 39274,
      name: "Warm outdoor clothing",
      included: true,
    },
    {
      id: 45096,
      name: "Good hiking shoes",
      included: true,
    },
    {
      id: 45097,
      name: "A waterproof jacket and pants",
      included: true,
    },
    {
      id: 45098,
      name: "Hat and gloves",
      included: true,
    },
  ],
  pickup: QueryTourPickup.FREE_PICKUP,
  pickupLocation: " Hótel Ísland Spa & Wellness - Ármúli 9",
  startingLocation: {
    locationName: "Reykjavík, Iceland",
  },
  endingLocation: {
    locationName: "Reykjavík, Iceland",
  },
  priceObject: {
    priceDisplayValue: "348,490",
    defaultPrice: 348490,
    currency: "ISK",
    price: 348490,
  },
};

export const mockSelfDriveTourServiceData = {
  title: "Service details",
  sections: [
    { label: "Duration", values: ["7 days"] },
    { label: "Travellers", values: ["{numberOfAdults} adults"] },
    { label: "Starts", values: ["{date} at {time}"] },
    { label: "Ends", values: ["{date} at {time}"] },
    { label: "Product provider", values: ["Guide To Iceland"] },
    { label: "Emergency phone", values: ["+1113213"] },
    {
      isExtras: true,
      label: "Accommodation",
      values: ["Comfort (private room, private bath), {totalNights} nights"],
    },
    {
      isExtras: true,
      label: "Car",
      values: ["Comfort 4WD Automatic, {numberOfDays} day rental"],
    },
    {
      isExtras: true,
      label: "Blue Lagoon (minimum age 2)",
      values: ["Comfort Entrance"],
    },
    { isExtras: true, label: "Activity on day 2", values: ["Sightseeing"] },
    { isExtras: true, label: "Activity on day 3", values: ["Sightseeing"] },
    { isExtras: true, label: "Activity on day 4", values: ["Sightseeing"] },
    { isExtras: true, label: "Activity on day 5", values: ["Sightseeing"] },
    { isExtras: true, label: "Activity on day 6", values: ["Sightseeing"] },
    { isExtras: true, label: "Add Dinners", values: ["No"] },
    { isExtras: true, label: "Cancellation Insurance", values: ["Yes"] },
    {
      label: "What to bring",
      values: ["Winter hiking shoes"],
    },
  ],
};

export const mockDayTourServiceData = {
  title: "Service details",
  sections: [
    { label: "Duration", values: ["3 hours"] },
    { label: "Travellers", values: ["{numberOfAdults} adults"] },
    { label: "Starts", values: ["{date} at {time}"] },
    { label: "Ends", values: ["{date} at {time}"] },
    { label: "Product provider", values: ["Guide To Iceland"] },
    { label: "Emergency phone", values: ["+1113213"] },
    { label: "Starting location", values: ["Jökulsárlón, Iceland"] },
    { label: "Departure location", values: ["Mock departurePoint info"] },
    { label: "Ending location", values: ["Jökulsárlón, Iceland"] },
    {
      label: "Pickup",
      values: ["Pick up location"],
    },
    {
      label: "What to bring",
      values: ["Winter hiking shoes, Camera"],
    },
  ],
};
export const mockDayTourServiceDataWithExtraAnswers = {
  title: "Service details",
  sections: [
    { label: "Duration", values: ["3 hours"] },
    { label: "Travellers", values: ["{numberOfAdults} adults"] },
    { label: "Starts", values: ["{date} at {time}"] },
    { label: "Ends", values: ["{date} at {time}"] },
    { label: "Product provider", values: ["Guide To Iceland"] },
    { label: "Emergency phone", values: ["+1113213"] },
    { label: "Starting location", values: ["Jökulsárlón, Iceland"] },
    { label: "Departure location", values: ["Mock departurePoint info"] },
    { label: "Ending location", values: ["Jökulsárlón, Iceland"] },
    {
      label: "Pickup",
      values: ["Pick up location"],
    },
    { isExtras: true, label: "Regular Car", values: [" LPN: BH1234YA, Length: 5m"] },
    {
      label: "What to bring",
      values: ["Winter hiking shoes, Camera"],
    },
  ],
};

export const mockPackageTourServiceData = {
  title: "Service details",
  sections: [
    { label: "Duration", values: ["4 days"] },
    {
      label: "Travellers",
      values: [
        "{numberOfAdults} adults, {numberOfTeenagers} teenagers and {numberOfChildren} children",
      ],
    },
    { label: "Starts", values: ["{date} at {time}"] },
    { label: "Ends", values: ["{date} at {time}"] },
    { label: "Product provider", values: ["Guide To Iceland"] },
    { label: "Emergency phone", values: ["+1113213"] },
    { label: "Starting location", values: ["Keflavík Airport"] },
    { label: "Ending location", values: ["Keflavík Airport"] },
    {
      label: "Pickup",
      values: ["Pick up location"],
    },
    {
      isExtras: true,
      label: "Accommodation",
      values: ["Comfort (private room, private bath), {totalNights} nights"],
    },
    { isExtras: true, label: "Blue Lagoon", values: ["Comfort Entrance"] },
    {
      isExtras: true,
      label: "Golden Circle Tour",
      values: ["Sightseeing Bus Tour"],
    },
    {
      isExtras: true,
      label: "South Coast Tour",
      values: ["South Coast sightseeing bus tour"],
    },
    { isExtras: true, label: "Add Dinners", values: ["No"] },
    { isExtras: true, label: "Cancellation Insurance", values: ["Yes"] },
    {
      label: "What to bring",
      values: ["Warm and waterproof clothing, Winter hiking shoes, Swimsuit and Towel, Camera"],
    },
  ],
};

export const mockMultiDayTourServiceData = {
  title: "Service details",
  sections: [
    { label: "Duration", values: ["8 days and 1 hour"] },
    { label: "Travellers", values: ["{numberOfAdults} adults"] },
    { label: "Starts", values: ["{date} at {time}"] },
    { label: "Ends", values: ["{date} at {time}"] },
    { label: "Product provider", values: ["Guide To Iceland"] },
    { label: "Emergency phone", values: ["+1113213"] },
    { label: "Starting location", values: ["Reykjavík, Iceland"] },
    { label: "Ending location", values: ["Reykjavík, Iceland"] },
    { label: "Pickup", values: [" Hótel Ísland Spa & Wellness - Ármúli 9"] },
    {
      isExtras: true,
      label: "Accommodation",
      values: [
        " Number of twin rooms (two people per room): 1, Number of single rooms (Single room fee extra must be selected and paid to guarantee a single room) : 0, Number of triple rooms (three persons per room): 0, Number of double rooms (two people per room) : 0",
      ],
    },
    { isExtras: true, label: "Hiking Boots", values: ["What is your shoe size?: 40 EUR / 7.5 US"] },
    { isExtras: true, label: "Luggage Storage", values: [""] },
    { isExtras: true, label: "Waterproof Jacket", values: ["What is your jacket size?: XL"] },
    { isExtras: true, label: "Waterproof Pants", values: ["What is your pant size?: S"] },
    {
      label: "What to bring",
      values: [
        "Warm outdoor clothing, Good hiking shoes, A waterproof jacket and pants, Hat and gloves",
      ],
    },
    { label: "Accommodation", values: ["{totalNights} nights"] },
  ],
};

export const mockQueryStay0: OrderTypes.QueryStay = {
  id: 2416,
  productId: 2168,
  address: "Eskihlíð 3, Reykjavik",
  type: "hotel",
  uri: "/accommodation/iceland-hotels-reykjavik/nordurey-hotel-city-garden",
  numberOfGuests: 3,
  numberOfAdults: 0,
  numberOfChildren: 0,
  valueProps: [
    {
      iconId: "cancellation",
      title: "Conditional cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
    {
      iconId: "parking",
      title: "Parking available",
    },
  ],
  rooms: [
    {
      id: 4979,
      type: "room",
      name: "Standard twin room",
      privateBathroom: true,
      size: 9,
      maxPersons: 2,
      roomBookings: [
        {
          extraBedCount: 0,
          adults: 1,
          children: 0,
          mesh: "",
          requestId: "",
          source: "",
          masterRateCode: "1014BB",
          extras: [],
        },
      ],
    },
    {
      id: 4980,
      type: "room",
      name: "Standard triple room",
      privateBathroom: true,
      size: 0,
      maxPersons: 3,
      roomBookings: [
        {
          extraBedCount: 0,
          adults: 1,
          children: 1,
          mesh: "",
          requestId: "",
          source: "",
          masterRateCode: "1015BB",
          extras: [],
        },
      ],
    },
    {
      id: 4978,
      type: "room",
      name: "Standard double room with shared bathroom",
      privateBathroom: false,
      size: 0,
      maxPersons: 2,
      roomBookings: [
        {
          extraBedCount: 0,
          adults: 1,
          children: 1,
          mesh: "",
          requestId: "",
          source: "",
          masterRateCode: "1013BB",
          extras: [],
        },
      ],
    },
  ],
  specs: [
    {
      iconId: "hotelCategory",
      name: "Category",
      value: "3 Star Hotel",
    },
    {
      iconId: "hotelLocation",
      name: "Location",
      value: "Hrísateigur 14, Reykjavík",
    },
    {
      iconId: "hotelBreakfast",
      name: "Breakfast",
      value: "Available",
    },
    {
      iconId: "hotelCheckInOut",
      name: "Check-in & out",
      value: "14:00; 11:00",
    },
    {
      iconId: "hotelParking",
      name: "Parking",
      value: "Free parking",
    },
  ],
  title: "Alba Guesthouse",
  cartItemId: "hotels-1",
  totalPrice: 192162,
  imageUrl:
    "https://guidetoiceland.imgix.net/648581/x/0/74891165-jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&s=afe4fb0360b47d7c2391e20cbadbcd2b",
  available: true,
  editable: true,
  cancellationPolicy: "2021-04-01T00:00:00.000Z",
  cancellationString: "Free cancellation before: 1 April, 2021",
  from: "2021-04-25T15:00:00.000Z",
  to: "2021-04-30T11:00:00.000Z",
  updated: "2021-03-12T13:08:31.202Z",
  createdTime: "2021-03-12T13:08:31.202Z",
  priceObject: {
    priceDisplayValue: "192,162",
    defaultPrice: 192162,
    currency: "ISK",
    price: 192162,
  },
};

export const mockQueryStay1 = {
  ...mockQueryStay0,
  id: 2356,
  productId: 1234,
  from: "2021-05-02T15:00:00.000Z",
  to: "2021-05-03T11:00:00.000Z",
  title: "Hotel Alda",
};

export const mockQueryGTETour = {
  id: 2934,
  productCode: "132289",
  productOptionCode: "VJI234DG",
  linkUrl: "",
  paxMix: [
    {
      numberOfTravelers: 2,
      ageBand: "ADULT",
    },
  ],
  languageGuide: {
    language: "en",
    type: "AUDIO",
  },
  extras: [],
  durationSec: 120,
  durationText: "2 hours",
  pickup: "",
  advancedNoticeSec: 0,
  bookingRef: "SGVJOR346",
  startTime: "09:00",
  title: "Sunset cruise on Signa",
  cartItemId: "tours-and-tickets-1",
  totalPrice: 184,
  priceObject: {
    priceDisplayValue: "184",
    defaultPrice: 184,
    currency: "EUR",
    price: 184,
  },
  imageUrl:
    "https://guidetoiceland.imgix.net/648581/x/0/74891165-jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&s=afe4fb0360b47d7c2391e20cbadbcd2b",
  available: true,
  editable: false,
  currency: "EUR",
  valueProps: [
    {
      iconId: "cancellation",
      title: "Conditional cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
  ],
  option: {
    id: 111,
    title: "08.30 - Premium Entrance ",
  },
  bookingQuestionAnswers: [],
  startingLocation: {
    locationName: "",
  },
  from: "2021-04-25T09:00:00.000Z",
  to: "2021-04-25T11:00:00.000Z",
  updated: "2021-03-12T13:08:31.202Z",
  createdTime: "2021-03-12T13:08:31.202Z",
};

export const mockQueryGTEStay0Room1: OrderTypes.QueryStayProductCartRoom = {
  availabilityId: "3dcbcba5-e8d6-4295-8a7c-5ce5f367b000",
  name: "DOUBLE STANDARD",
  mealType: MealType.ALL_INCLUSIVE,
  number: 1,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  dateFreeCancellationUntil: "2023-02-10T08:59:00.000Z",
};
export const mockQueryGTEStay0Room2: OrderTypes.QueryStayProductCartRoom = {
  availabilityId: "737e0c11-ae3e-4465-ac46-f87e3736ba4a",
  name: "Double or Twin Room with Bath - Free WiFi",
  mealType: MealType.BED_AND_BREAKFAST,
  cancellationType: OrderStayCancellationType.NON_REFUNDABLE,
  number: 2,
  dateFreeCancellationUntil: "2023-02-08T09:00:00.000Z",
};

export const mockQueryGTEStay0: OrderTypes.QueryGTEStay = {
  id: "ccf751b0-099e-4fc6-87b3-ad9a70f6e744",
  title: "Hotel Caron",
  totalPrice: 1113.079,
  currency: "EUR",
  available: true,
  editable: true,
  imageUrl: "https://media.graphassets.com/mY0uMnURymcG9gb6KHVg",
  discountAmount: 0,
  discountPercentage: 0,
  cartItemId: "ccf751b0-099e-4fc6-87b3-ad9a70f6e744",
  dateCheckingIn: "2023-02-13T00:00:00.000Z",
  dateCheckingOut: "2023-02-15T00:00:00.000Z",
  totalNumberOfAdults: 2,
  totalNumberOfChildren: 0,
  childrenAges: [],
  isForVacationPackage: false,
  from: "2023-02-13T11:00:00.000Z",
  to: "2023-02-15T14:30:00.000Z",
  createdTime: "2022-11-23T09:43:07.205Z",
  updated: "2022-11-23T09:43:26.873Z",
  dateCreated: "2022-11-23T09:43:07.205Z",
  dateUpdated: "2022-11-23T09:43:26.873Z",
  product: {
    productId: 479794,
    name: "Hotel Caron",
    address: "3 RUE CARON",
    productPageUri: "/france/best-hotels-and-places-to-stay/details/hotel-caron",
    valueProps: [],
    specs: [],
    timeCheckingIn: "11:00",
    timeCheckingOut: "14:30",
  },
  rooms: [mockQueryGTEStay0Room1, mockQueryGTEStay0Room2],
  priceObject: {
    priceDisplayValue: "1113.079",
    defaultPrice: 1113.079,
    currency: "ISK",
    price: 1113.079,
  },
};

export const mockQueryGTEStayConstruct0: OrderTypes.QueryGTEStayConstruct = {
  ...mockQueryGTEStay0,
  productId: 479794,
  title: "Hotel Caron",
  imageUrl: "https://media.graphassets.com/mY0uMnURymcG9gb6KHVg",
  from: new Date("2023-02-13T11:00:00.000Z"),
  to: new Date("2023-02-15T14:30:00.000Z"),
  updated: new Date("2022-11-23T09:43:26.873Z"),
  createdTime: new Date("2022-11-23T09:43:07.205Z"),
  clientRoute: {
    as: "/france/best-hotels-and-places-to-stay/details/hotel-caron",
    query: {
      slug: "hotel-caron",
    },
    route: "/gteStay",
  },
  linkUrl: "/france/best-hotels-and-places-to-stay/details/hotel-caron",
};

export const mockQueryGTEStay0ServiceDetails = {
  sections: [
    {
      label: "label:Duration, options:undefined",
      values: ['label:{totalNights} nights, options:{"totalNights":2}'],
    },
    {
      label: "label:Guests, options:undefined",
      values: ['label:{numberOfAdults} adults, options:{"numberOfAdults":2}'],
    },
    {
      label: "label:Check in, options:undefined",
      values: ["February 13, 2023, 11:00"],
    },
    {
      label: "label:Check out, options:undefined",
      values: ["February 15, 2023, 14:30"],
    },
    {
      label: "label:Hotel, options:undefined",
      values: ["Hotel Caron"],
    },
    {
      label: "label:Address, options:undefined",
      values: ["3 RUE CARON"],
    },
  ],
  title: "label:Service details, options:undefined",
};

export const mockQueryGTEStay0RoomDetails = {
  sections: [
    {
      label: "label:Room type, options:undefined",
      shouldStartFromNewLine: true,
      values: ["DOUBLE STANDARD"],
    },
    {
      label: "label:Meal, options:undefined",
      values: ["All inclusive"],
    },
    {
      label: "label:Cancellation policy, options:undefined",
      values: ['label:Free cancellation before {date}, options:{"date":"Feb 10"}'],
    },
    {
      label: "label:Room booking reference, options:undefined",
      values: ["TF6288295"],
    },
    {
      label: "label:Room type, options:undefined",
      shouldStartFromNewLine: true,
      values: ["Double or Twin Room with Bath - Free WiFi"],
    },
    {
      label: "label:Meal, options:undefined",
      values: ["Breakfast included"],
    },
    {
      label: "label:Cancellation policy, options:undefined",
      values: ["label:Non-refundable, options:undefined"],
    },
    {
      label: "label:Room booking reference, options:undefined",
      values: ["TF6288296"],
    },
  ],
  title: "label:Room details, options:undefined",
};

export const mockQueryStayConstruct0: OrderTypes.QueryStayConstruct = {
  ...mockQueryStay0,
  from: new Date(mockQueryStay0.from as string),
  to: new Date(mockQueryStay0.to as string),
  updated: new Date(mockQueryStay0.updated as string),
  createdTime: new Date(mockQueryStay0.createdTime as string),
  clientRoute: {
    as: "/accommodation/iceland-hotels-reykjavik/nordurey-hotel-city-garden/?cart_item=1&f=1619362800000&t=1619780400000",
    query: {
      cart_item: "1",
      f: "1619362800000",
      slug: "nordurey-hotel-city-garden",
      t: "1619780400000",
    },
    route: "/accommodationProduct",
  },
  linkUrl:
    "/accommodation/iceland-hotels-reykjavik/nordurey-hotel-city-garden/?cart_item=1&f=1619362800000&t=1619780400000",
};

export const mockQueryStayConstruct1: OrderTypes.QueryStayConstruct = {
  ...mockQueryStay1,
  from: new Date(mockQueryStay1.from as string),
  to: new Date(mockQueryStay1.to as string),
  updated: new Date(mockQueryStay1.updated as string),
  createdTime: new Date(mockQueryStay1.createdTime as string),
  clientRoute: {
    as: "/accommodation/iceland-hotels-reykjavik/nordurey-hotel-city-garden/?cart_item=1&f=1619362800000&t=16197804002350",
    query: {
      cart_item: "1",
      f: "1619362800000",
      slug: "nordurey-hotel-city-garden",
      t: "16197804002350",
    },
    route: "/accommodationProduct",
  },
  linkUrl:
    "/accommodation/iceland-hotels-reykjavik/nordurey-hotel-city-garden/?cart_item=1&f=1619362800000&t=16197804002350",
};

export const mockQueryStayConstructCancellation: OrderTypes.QueryStayConstruct = {
  ...mockQueryStayConstruct0,
  specs: [],
};

const totalMockCartDataPrice =
  Math.ceil(mockQueryFlightAvailable.price) * 2 +
  Math.ceil(mockCarRentalQueryCart0.totalPrice) * 2 +
  Math.ceil(mockDayTour.totalPrice) +
  Math.ceil(mockVacationPackageTour.totalPrice) +
  Math.ceil(mockQueryStay0.totalPrice) * 2 +
  Math.ceil(mockQueryGTEStay0.totalPrice) * 2;

export const mockCartData: CartTypes.CartData = {
  flights: [mockQueryFlightAvailable, mockQueryFlightAvailable],
  cars: [mockCarRentalQueryCart0, mockCarRentalQueryCart0],
  tours: [mockDayTour, mockVacationPackageTour],
  stays: [mockQueryStay0, mockQueryStay0],
  gteStays: [mockQueryGTEStay0, mockQueryGTEStay0],
  vacationPackages: [],
  toursAndTickets: [],
  customs: [],
  itemCount: 8,
  totalPrice: totalMockCartDataPrice,
  totalOnArrival: 0,
  customerInfo: {
    name: "Test address",
    email: "email",
    nationality: "AS",
    phoneNumber: "+11111111111",
    termsAgreed: true,
  },
  priceObject: {
    defaultPrice: 0,
    price: totalMockCartDataPrice,
    priceDisplayValue: `${totalMockCartDataPrice}`,
    currency: "not-important",
  },
};

export const mockPaymentDetails = {
  title: "Payment details",
  sections: [{ label: "Total price", values: ["123 USD"] }],
};

export const mockPaymentDetailsInCartInfoModal = {
  title: "Payment details",
  sections: [{ label: "Item price", values: ["123 USD"] }],
};

export const mockPaymentDetailsWithBackendPrice = {
  title: "Payment details",
  sections: [{ label: "Total price", values: ["123.00 USD"] }],
};

export const mockPaymentDetails1 = {
  title: "Payment details",
  sections: [
    {
      label: "Total price",
      subtitles: [
        {
          label: "Inclusive of VAT (10%):",
          values: ["15 USD"],
        },
      ],
      values: ["150 USD"],
    },
  ],
};

export const mockCarRentalPaymentDetails = {
  sections: [
    {
      label: "Pay now",
      values: ["315 USD"],
    },
    {
      label: "Pay on location",
      values: [
        "25 USD - extra_222_name",
        "20 USD - extra_13_name",
        "29 USD - extra_8_name",
        "29 USD - extra_7_name",
      ],
    },
    {
      label: "Total price",
      subtitles: [null],
      values: ["315 USD"],
    },
  ],
  title: "Payment details",
};

export const mockCarRentalPaymentDetails1 = {
  sections: [
    {
      label: "Total price",
      subtitles: [null],
      values: ["315 USD"],
    },
  ],
  title: "Payment details",
};

export const mockCarRentalPaymentDetails2 = {
  sections: [
    {
      label: "Total price",
      subtitles: [
        {
          label: "Inclusive of VAT (11%):",
          values: ["37 USD"],
        },
      ],
      values: ["315 USD"],
    },
  ],
  title: "Payment details",
};

export const mockCarRentalPaymentDetailsWithBackendPrice = {
  sections: [
    {
      label: "Total price",
      subtitles: [
        {
          label: "Inclusive of VAT (11%):",
          values: ["37 USD"],
        },
      ],
      values: ["100,000 USD"],
    },
  ],
  title: "Payment details",
};

export const mockQueryVacationPackage: OrderTypes.QueryVacationPackageProduct = {
  id: "ISL-3DAY-KEF-KEF",
  title: "3 day trip through Reykjanesbær and Reykjavik",
  flights: [mockQueryFlightCart0],
  cars: [mockCarRentalQueryCart0],
  stays: [],
  gteStays: [mockQueryGTEStay0],
  toursAndTickets: [mockQueryGTETour],
  currency: "ISK",
  editable: false,
  imageUrl:
    "https://image.shutterstock.com/image-photo/coconut-sunglasses-strawhat-tropical-beach-600w-1751794199.jpg",
  available: true,
  cartItemId: "b808d111-6d65-479c-942a-feb1d90c1122",
  totalPrice: 135.5772664835165,
  priceObject: {
    priceDisplayValue: "135.5772664835165",
    defaultPrice: 135.5772664835165,
    currency: "ISK",
    price: 135.5772664835165,
  },
  startPlace: "Mock start place",
  endPlace: "Mock end place",
  createdTime: "2021-11-25T13:32:40.2526838+00:00",
  expiredTime: "2077-11-25T13:32:40.2526838+00:00",
  updated: "2021-11-25T13:32:40.2527424+00:00",
  from: "2021-12-12T00:00:00",
  to: "2021-12-14T00:00:00",
  children: 0,
  infants: 0,
  adults: 1,
};

export const mockConstructVacationPackage: OrderTypes.QueryVacationPackageConstruct = {
  id: "ISL-3DAY-KEF-KEF",
  title: "3 day trip through Reykjanesbær and Reykjavik",
  flights: [mockFlightCart0],
  cars: [mockCarRentalCart0],
  gteStays: [mockQueryGTEStayConstruct0],
  stays: [],
  toursAndTickets: [mockQueryGTETour],
  currency: "ISK",
  editable: false,
  imageUrl:
    "https://image.shutterstock.com/image-photo/coconut-sunglasses-strawhat-tropical-beach-600w-1751794199.jpg",
  available: true,
  cartItemId: "b808d111-6d65-479c-942a-feb1d90c1122",
  totalPrice: 135.5772664835165,
  priceObject: {
    priceDisplayValue: "135.5772664835165",
    defaultPrice: 135.5772664835165,
    currency: "ISK",
    price: 135.5772664835165,
  },
  startPlace: "Mock start place",
  endPlace: "Mock end place",
  createdTime: new Date("2021-11-25T13:32:40.2526838+00:00"),
  expiredTime: new Date("2077-11-25T13:32:40.2526838+00:00"),
  updated: new Date("2021-11-25T13:32:40.2527424+00:00"),
  from: new Date("2021-12-12T00:00:00"),
  to: new Date("2021-12-14T00:00:00"),
  children: 0,
  infants: 0,
  adults: 1,
};

export const mockVacationPackageServiceDetails = {
  sections: [
    {
      label: "Duration",
      values: ["{totalDays} days, {totalNights} nights"],
    },
    {
      label: "Travellers",
      values: ["{totalTravellers} travellers"],
    },
    {
      label: "Starts",
      values: ["December 12, 2021"],
    },
    {
      label: "Ends",
      values: ["December 14, 2021"],
    },
    {
      label: "Starting location",
      values: ["Keflavík International (KEF)"],
    },
    {
      label: "Ending location",
      values: ["Keflavík International (KEF)"],
    },
    {
      label: "Flights",
      values: ["{origin} to {destination} and back"],
    },
    {
      label: "Bags",
      values: ["1x Personal item: 40 × 10 × 30 cm - 2 kg", "1x Cabin bag: 55 × 23 × 35 cm - 8 kg"],
    },
    {
      label: "Stays",
      values: ["{numberOfNights} nights at {stay}"],
    },
    {
      label: "Experiences",
      values: ["Sunset cruise on Signa at 09:00 on Apr 25"],
    },
    {
      label: "Car rental",
      values: ["Volkswagen Up!  2018 manual, {numberOfDays} day rental"],
    },
    ...mockCarRentalCart0InsurancesServiceDetails,
    ...mockCarRentalCart0ExtrasServiceDetails,
  ],
  title: "Service details",
};

export const mockVacationPackageWithoutFlightsServiceDetails = {
  sections: [
    {
      label: "Duration",
      values: ["{totalDays} days, {totalNights} nights"],
    },
    {
      label: "Travellers",
      values: ["{totalTravellers} travellers"],
    },
    {
      label: "Starts",
      values: ["December 12, 2021"],
    },
    {
      label: "Ends",
      values: ["December 14, 2021"],
    },
    {
      label: "Starting location",
      values: ["Mock start place"],
    },
    {
      label: "Ending location",
      values: ["Mock end place"],
    },
    {
      label: "Stays",
      values: ["{numberOfNights} nights at {stay}"],
    },
    {
      label: "Experiences",
      values: ["Sunset cruise on Signa at 09:00 on Apr 25"],
    },
    {
      label: "Car rental",
      values: ["Volkswagen Up!  2018 manual, {numberOfDays} day rental"],
    },
    ...mockCarRentalCart0InsurancesServiceDetails,
    ...mockCarRentalCart0ExtrasServiceDetails,
  ],
  title: "Service details",
};

export const mockCardInformation = {
  pan: "5454545454545454",
  expMonth: "03",
  expYear: "30",
  cvc: "737",
};
