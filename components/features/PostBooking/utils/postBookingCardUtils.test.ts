import { PB_CARD_TYPE, PB_ITINERARY_ICON_TYPE } from "../types/postBookingEnums";
import { PostBookingTypes } from "../types/postBookingTypes";

import {
  constructPBProductCard,
  constructPBProductVacationCard,
  getCardImageUrlOrDefault,
} from "./postBookingCardUtils";

import NotImportantSVGIconMock from "components/icons/check-in.svg";
import { SupportedLanguages } from "types/enums";
import { gteImgixUrl } from "utils/imageUtils";

jest.mock("utils/helperUtils", () => ({
  __esModule: true, // this property makes it work
  normalizeGraphCMSLocale: (value: any) => value,
}));

const commonProps: Pick<
  PostBookingTypes.ItineraryCard,
  | "id"
  | "bookingId"
  | "orderId"
  | "imageUrl"
  | "bookingNumber"
  | "phoneNumber"
  | "googlePlace"
  | "latitude"
  | "longitude"
  | "bagsCarried"
  | "bagsChecked"
  | "bagsInCabin"
  | "isBreakfastIncluded"
  | "numberOfAdults"
  | "numberOfChildren"
  | "numberOfInfants"
  | "tourId"
> = {
  id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
  bookingId: 999,
  orderId: 777,
  tourId: "3517LONWICK",
  isBreakfastIncluded: false,
  imageUrl: "https://guidetoeurope.com/best-attraction.png",
  bookingNumber: "ATT-B-NR-100",
  phoneNumber: "+380000000000",
  numberOfAdults: 2,
  numberOfChildren: 1,
  numberOfInfants: 1,
  bagsCarried: 0,
  bagsChecked: 0,
  bagsInCabin: 0,
  latitude: 10.2,
  longitude: 10.1,
  googlePlace: {
    latitude: 10.2,
    longitude: 10.1,
    userRatingAverage: 10,
    userRatingCount: 9,
    googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
  },
};

export const mockedTFunc: TFunction = (label, options) =>
  // @ts-ignore
  `tLabel:"${label}", tOptions:${JSON.stringify(options)}`;

describe("constructPBProductCard", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("flight card props", () => {
    const flightCardWithETicket: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      numberOfInfants: 0,
      phoneNumber: undefined,
      googlePlace: undefined,
      latitude: 10.2,
      longitude: 10.1,
      cardType: PB_CARD_TYPE.FLIGHT_ARRIVING,
      eTicketUrl: "http://e.ticket.url/ticket.pdf",
      boardingPassButtonUrl: undefined,

      departureCityName: "Odesa",
      departureAirportCode: "ODS",
      departureAirportName: "Odesa International airport",
      departureDate: "2022-07-01T08:25:00.000Z",

      arrivalCityName: "Nice",
      arrivalDate: "2022-07-02T18:25:00.000Z",
      arrivalAirportName: "Nice Côte d Azur International",
      arrivalAirportCode: "NCE",
      name: "not important",

      flightNumber: "FFF111",
      airlineName: "Rayanair",
      bagsCarried: 1,
      bagsChecked: 2,
      bagsInCabin: 3,
    };

    const flightReturnCardWithEticketAndBoardingPass: PostBookingTypes.ItineraryCard = {
      ...flightCardWithETicket,
      boardingPassButtonUrl: "http://link.to/ticket.pdf",
      numberOfAdults: 1,
      numberOfChildren: 0,
      numberOfInfants: 0,
      bagsCarried: 0,
      bagsInCabin: 0,
      bagsChecked: 0,
      cardType: PB_CARD_TYPE.FLIGHT_RETURN,
    };

    expect(
      constructPBProductCard(flightCardWithETicket, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      ticket: {
        type: "FLIGHT_ETICKET",
        url: "http://e.ticket.url/ticket.pdf",
      },
      heading: 'tLabel:"Flight", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Departure",
          value: "Fri, Jul 01 Odesa Odesa International airport ODS 08:25",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Arrival",
          value: "Sat, Jul 02 Nice Nice Côte d Azur International NCE 18:25",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Flight number",
          value: "FFF111",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Airline",
          value: "Rayanair",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Passengers",
          value:
            'tLabel:"{adultsCount} adults and {childrenCount} children", tOptions:{"adultsCount":2,"childrenCount":1}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Bags",
          // 3 bags labels joined with a comma
          value:
            'tLabel:"{count} x Checked", tOptions:{"count":2},tLabel:"{count} x Carried", tOptions:{"count":1},tLabel:"{count} x Cabin", tOptions:{"count":3}',
        },
      ],
      rating: 0,
      reviewsCount: 0,
      streetViewEnabled: true,
      title: 'tLabel:"Flight from {from} to {to}", tOptions:{"from":"Odesa","to":"Nice"}',
      type: "FLIGHT_ARRIVING",
    });

    expect(
      constructPBProductCard(
        flightReturnCardWithEticketAndBoardingPass,
        SupportedLanguages.English,
        true,
        mockedTFunc
      )
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      ticket: {
        url: "http://link.to/ticket.pdf",
        type: "FLIGHT_BOARDING_PASS",
      },
      heading: 'tLabel:"Flight", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Departure",
          value: "Fri, Jul 01 Odesa Odesa International airport ODS 08:25",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Arrival",
          value: "Sat, Jul 02 Nice Nice Côte d Azur International NCE 18:25",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Flight number",
          value: "FFF111",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Airline",
          value: "Rayanair",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Passengers",
          value: 'tLabel:"{adultsCount} adults", tOptions:{"adultsCount":1}',
        },
      ],
      rating: 0,
      reviewsCount: 0,
      streetViewEnabled: true,
      title: 'tLabel:"Flight from {from} to {to}", tOptions:{"from":"Odesa","to":"Nice"}',
      type: "FLIGHT_RETURN",
    });
  });
  it("stay card props", () => {
    const stayCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.STAY,
      name: "Simple 5 star hotel",
      type: "Hotel",
      dateOfCheckin: "2022-07-02T11:00:00.000Z",
      dateOfCheckout: "2022-07-03T15:00:00.000Z",
      isBreakfastIncluded: true,
      roomTypes: ["standard"],
      numberOfAdults: 2,
      numberOfChildren: 1,
      numberOfInfants: 1,
      timeOfCheckin: "11:00",
      timeOfCheckout: "15:00",
    };

    expect(
      constructPBProductCard(stayCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      heading: 'tLabel:"Hotel", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      phoneno: "+380000000000",
      googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Check-in date",
          value: 'tLabel:"{day} from {time}", tOptions:{"day":"Jul 02","time":"11:00"}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Check-out date",
          value: 'tLabel:"{day} before {time}", tOptions:{"day":"Jul 03","time":"15:00"}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Booking number",
          value: "ATT-B-NR-100",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Guests",
          value:
            'tLabel:"{adultsCount} adults, {childrenCount} children and {infantsCount} infants", tOptions:{"adultsCount":2,"childrenCount":1,"infantsCount":1}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Room",
          value: "1 standard",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Breakfast",
          value: 'tLabel:"included", tOptions:undefined',
        },
      ],
      rating: 10,
      reviewsCount: 9,
      streetViewEnabled: true,
      title: "Simple 5 star hotel",
      type: "STAY",
    });
  });
  it("bar card props", () => {
    const barCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.BAR,
      name: "Cozy place",
      type: "Drink",
      timeOpens: "11:00",
      timeCloses: "23:00",
      budget: "100 $",
      travelDistanceInMeters: 100,
    };

    expect(
      constructPBProductCard(barCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      heading: 'tLabel:"Drink", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      phoneno: "+380000000000",
      googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Type",
          value: "Drink",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Open",
          value: "11:00-23:00",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Budget",
          value: "100 $",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Distance",
          value: 'tLabel:"{distance} km", tOptions:{"distance":0.1}',
        },
      ],
      rating: 10,
      reviewsCount: 9,
      streetViewEnabled: true,
      title: "Cozy place",
      type: "BAR",
    });
  });
  it("restaurant card props", () => {
    const restaurantCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.RESTAURANT,
      name: "Pizza place",
      type: "Bistro",
      timeOpens: "08:00",
      timeCloses: "23:00",
      budget: "10 $",
      travelDistanceInMeters: 10,
      isExpired: true,
    };

    expect(
      constructPBProductCard(restaurantCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      heading: 'tLabel:"Restaurant", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      phoneno: "+380000000000",
      googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
      isExpired: true,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Type",
          value: "Bistro",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Open",
          value: "08:00-23:00",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Budget",
          value: "10 $",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Distance",
          value: 'tLabel:"{distance} m", tOptions:{"distance":10}',
        },
      ],
      rating: 10,
      reviewsCount: 9,
      streetViewEnabled: true,
      title: "Pizza place",
      type: "RESTAURANT",
    });
  });
  it("car card props", () => {
    const carCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.CAR_RENTAL,
      cityName: "Madrid",
      isExpired: true,
      name: "car provider",
      type: "car",
      dateOfPickupFrom: "2022-07-01T12:00:00.000Z",
      dateOfPickupTo: "2022-07-01T12:00:00.000Z",
      pickUpLocation: "Japan, st1",
      dateOfDropoffFrom: "2022-07-05T12:00:00.000Z",
      dateOfDropoffTo: "2022-07-05T13:00:00.000Z",
      dropOffLocation: "Japan, st2",
    };

    expect(
      constructPBProductCard(carCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      heading: 'tLabel:"Car", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      phoneno: "+380000000000",
      googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
      isExpired: true,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Pick-up date",
          value: "Fri, Jul 01 12:00",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Pick-up location",
          value: "Japan, st1",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Car rental",
          value: "car provider",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Booking number",
          value: "ATT-B-NR-100",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Drop-off date",
          value: "Tue, Jul 05 12:00-13:00",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Drop-off location",
          value: "Japan, st2",
        },
      ],
      rating: 10,
      reviewsCount: 9,
      streetViewEnabled: true,
      title: 'tLabel:"Car rental in {cityName}", tOptions:{"cityName":"Madrid"}',
      type: "CAR_RENTAL",
    });
  });
  it("attraction card props", () => {
    const attractionCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.ATTRACTION,
      voucherUrl: "http://voucher.url/voucher.pdf",
      name: "Plaza Mayor Square",
      type: "Museum",
      inceptionDay: 27,
      inceptionMonth: 5,
      inceptionYear: 2022,
      timeOpens: "00:00",
      timeCloses: "00:00",
      entrance: "50 cents",
      timeToSpend: "01:30",
      address: "C. de Bailén, s/n, 28071 Madrid",
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
    };

    expect(
      constructPBProductCard(attractionCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      ticket: {
        type: "VOUCHER",
        url: "http://voucher.url/voucher.pdf",
      },
      heading: 'tLabel:"Attraction", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      phoneno: "+380000000000",
      googlePlaceId: "ChIJgUbEo8cfqokR5lP9_Wh_DaM",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Type",
          value: "Museum",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Founded",
          value: "May 27, 2022",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Open",
          value: "24h",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Entrance",
          value: "50 cents",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Spend",
          value: 'tLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":30}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Address",
          value: "C. de Bailén, s/n, 28071 Madrid",
        },
      ],
      rating: 10,
      reviewsCount: 9,
      streetViewEnabled: true,
      title: "Plaza Mayor Square",
      type: "ATTRACTION",
    });
  });
  it("city card props", () => {
    const cityCard: PostBookingTypes.ItineraryCard = {
      ...commonProps,
      cardType: PB_CARD_TYPE.CITY,
      name: "Madrid",
      phoneNumber: undefined,
      googlePlace: undefined,
      type: "City",
      countryName: "Spain",
      timezone: "GMT+2",
      populationCount: 3200000,
      populationYear: 2022,
      region: "central Spain",
      size: "604.3",
    };

    expect(
      constructPBProductCard(cityCard, SupportedLanguages.English, true, mockedTFunc)
    ).toStrictEqual({
      bookingId: 999,
      orderId: 777,
      photoReference: undefined,
      coords: {
        lat: 10.2,
        lon: 10.1,
      },
      tourId: "3517LONWICK",
      bookingReference: "ATT-B-NR-100",
      heading: 'tLabel:"City", tOptions:undefined',
      id: "6e93fc2b-3f5e-42a8-9cc9-5fd0c1a1b64f",
      image: "https://guidetoeurope.com/best-attraction.png",
      isExpired: false,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Type",
          value: "City",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Country",
          value: "Spain",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Region Name",
          value: "central Spain",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Timezone",
          value: "GMT+2",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Size",
          value: "604.3 km²",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Population",
          value: "3,200,000 (2022)",
        },
      ],
      rating: 0,
      reviewsCount: 0,
      streetViewEnabled: true,
      title: "Madrid",
      type: "CITY",
    });
  });
});

describe("constructPBProductVacationCard", () => {
  it("maps the property from vacation entry to the product card", () => {
    expect(
      constructPBProductVacationCard(
        {
          cardType: PB_CARD_TYPE.VACATION_PACKAGE,
          icon: PB_ITINERARY_ICON_TYPE.UNDEFINED,
          isBreakfastIncluded: false,
          orderId: 833,
          isExpired: true,
          bookingId: 1,
          id: "TUR-5DAY-BJV-BJV-ROADTRIP",
          imageUrl: "https://media.graphassets.com/z6GQ7hSyT6CmESMXixoB",
          dateOfVacationStart: "2022-07-20T10:00:00.000Z",
          dateOfVacationEnd: "2022-07-24T23:40:00.000Z",
          numberOfAdults: 3,
          numberOfChildren: 1,
          numberOfInfants: 1,
          numberOfStayNights: 2,
          hasFlights: false,
          hasCarRentals: true,
        },
        SupportedLanguages.English,
        // @ts-ignore
        mockedTFunc
      )
    ).toEqual({
      orderId: 833,
      bookingId: 1,
      heading: 'tLabel:"Vacation Package", tOptions:undefined',
      id: "TUR-5DAY-BJV-BJV-ROADTRIP",
      image: "https://media.graphassets.com/z6GQ7hSyT6CmESMXixoB",
      isExpired: true,
      quickfacts: [
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-1",
          label: "Vacation starts",
          value: "Wed, Jul 20, 10:00",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-2",
          label: "Vacation ends",
          value: "Sun, Jul 24, 23:40",
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-3",
          label: "Travelers",
          value:
            'tLabel:"{adultsCount} adults, {childrenCount} children and {infantsCount} infants", tOptions:{"adultsCount":3,"childrenCount":1,"infantsCount":1}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-4",
          label: "Hotel",
          value: 'tLabel:"{nrOfNights} nights", tOptions:{"nrOfNights":2}',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-5",
          label: "Flights",
          value: 'tLabel:"No", tOptions:undefined',
        },
        {
          Icon: NotImportantSVGIconMock,
          id: "icon-6",
          label: "Car rental",
          value: 'tLabel:"Yes", tOptions:undefined',
        },
      ],
      rating: 0,
      reviewsCount: 0,
      title: "",
      type: "TRAVELPLAN",
    });
  });
});

describe("getCardImageUrlOrDefault", () => {
  it("returns image with imageHandle if provided", () => {
    expect(
      getCardImageUrlOrDefault(PB_CARD_TYPE.STAY, "not-important-image-url-link", "IMAGEHANDLE")
    ).toBe(`${gteImgixUrl}/IMAGEHANDLE`);
  });
  it("returns image if imageUrl available and imageHandle is not provided", () => {
    expect(getCardImageUrlOrDefault(PB_CARD_TYPE.STAY, "https://stay-image-url.com/ksjhkasd")).toBe(
      "https://stay-image-url.com/ksjhkasd"
    );
  });
  describe("when no image URL provided", () => {
    it("returns the image for Attraction card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.ATTRACTION)).toBe(
        `${gteImgixUrl}/3wioAyjRa6CBJUOzzOU1`
      );
    });
    it("returns the image for Tour card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.TOUR)).toBe(
        `${gteImgixUrl}/bAvL6ZqtQyWtpZg2JgQJ`
      );
    });
    it("returns the image for Stay card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.STAY)).toBe(
        `${gteImgixUrl}/nopEjsEdQuGX0RqBUxZm`
      );
    });
    it("returns the image for Flight card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.FLIGHT_ARRIVING)).toBe(
        `${gteImgixUrl}/ieTAEspR7qNXDt3bqjFJ`
      );
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.FLIGHT_RETURN)).toBe(
        `${gteImgixUrl}/ieTAEspR7qNXDt3bqjFJ`
      );
    });
    it("returns the image for Restaurant card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.RESTAURANT)).toBe(
        `${gteImgixUrl}/onf4zgrOQlGH6HIcVDkC`
      );
    });
    it("returns the image for Bar card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.BAR)).toBe(
        `${gteImgixUrl}/HrvlXxTMS3KONUx6iR3v`
      );
    });
    it("returns the image for Car rental card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.CAR_RENTAL)).toBe(
        `${gteImgixUrl}/5nwFQgQ9ilWL2ZfDjdrQ`
      );
    });
    it("returns the image for City rental card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.CITY)).toBe(
        `${gteImgixUrl}/uKYDlcViTwW974ze7Psl`
      );
    });

    it("returns the image for Travelplan card", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.TRAVELPLAN)).toBe(
        `${gteImgixUrl}/V7VDnCT5RCGFAwvG2Mmq`
      );
    });

    it("returns the default image for unknown card type", () => {
      expect(getCardImageUrlOrDefault(PB_CARD_TYPE.UNDEFINED)).toBe(
        `${gteImgixUrl}/XaXMglrtSoqPcU3CxOQu`
      );
    });
  });
});
