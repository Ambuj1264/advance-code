import {
  ITINERARY_TOUR_DIFFICULTY,
  PB_CARD_TYPE,
  PB_ITINERARY_TRAVELMODE_TYPE,
  PB_TICKET_TYPE,
} from "../types/postBookingEnums";

import {
  getAdultsOrChildrenLabel,
  getCarPickupOrDropoffDateLabel,
  getCheckinOrCheckoutLabel,
  getDistanceLabel,
  getFlightArrivalOrDepartureSummaryLabel,
  getFlightBagsSummaryLabel,
  getInceptionLabel,
  getOpenCloseLabel,
  getPopulationLabel,
  getRoomTypesLabel,
  getTimeToSpendLabel,
  getTitleLabel,
  getTransportationTextLabel,
  getDifficultyLabel,
  getTicketButtonLabel,
} from "./pbCardLabelConstructionUtils";
import { mockedTFunc } from "./postBookingCardUtils.test";

import { SupportedLanguages } from "types/enums";

describe("getAdultsOrChildrenLabel", () => {
  it("adults label", () => {
    expect(
      getAdultsOrChildrenLabel(
        {
          numberOfAdults: 1,
          numberOfChildren: 0,
          numberOfInfants: 0,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{adultsCount} adults", tOptions:{"adultsCount":1}');
  });
  it("adults and children label", () => {
    expect(
      getAdultsOrChildrenLabel(
        {
          numberOfAdults: 1,
          numberOfChildren: 1,
          numberOfInfants: 0,
        },
        mockedTFunc
      )
    ).toBe(
      'tLabel:"{adultsCount} adults and {childrenCount} children", tOptions:{"adultsCount":1,"childrenCount":1}'
    );
  });
  it("adults, children and infants label", () => {
    expect(
      getAdultsOrChildrenLabel(
        {
          numberOfAdults: 1,
          numberOfChildren: 1,
          numberOfInfants: 1,
        },
        mockedTFunc
      )
    ).toBe(
      'tLabel:"{adultsCount} adults, {childrenCount} children and {infantsCount} infants", tOptions:{"adultsCount":1,"childrenCount":1,"infantsCount":1}'
    );
  });
});

describe("getFlightArrivalOrDepartureSummaryLabel", () => {
  it("constructs arrival info label", () => {
    expect(
      getFlightArrivalOrDepartureSummaryLabel(
        {
          date: "2022-07-01T21:25:40.000Z",
          airportCityName: "Paris",
          airportCode: "CDG",
          airportName: "some airport",
        },
        SupportedLanguages.English
      )
    ).toBe("Fri, Jul 01 Paris some airport CDG 21:25");
  });

  it("when date is missed", () => {
    expect(
      getFlightArrivalOrDepartureSummaryLabel(
        {
          airportCityName: "Paris",
          airportCode: "CDG",
          airportName: "some airport",
        },
        SupportedLanguages.English
      )
    ).toBe("Paris some airport CDG");
  });

  it("when the only date available", () => {
    expect(
      getFlightArrivalOrDepartureSummaryLabel(
        {
          date: "2022-07-01T21:25:40.000Z",
        },
        SupportedLanguages.English
      )
    ).toBe("Fri, Jul 01 21:25");
  });

  it("when airportName is missed", () => {
    expect(
      getFlightArrivalOrDepartureSummaryLabel(
        {
          date: "2022-07-01T21:25:40.000Z",
          airportCityName: "Paris",
          airportCode: "CDG",
        },
        SupportedLanguages.English
      )
    ).toBe("Fri, Jul 01 Paris CDG 21:25");
  });
});

describe("getFlightBagsSummaryLabel", () => {
  it("bags carried", () => {
    expect(
      getFlightBagsSummaryLabel(
        {
          bagsCarried: 1,
          bagsChecked: 0,
          bagsInCabin: 0,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{count} x Carried", tOptions:{"count":1}');
  });

  it("bags checked", () => {
    expect(
      getFlightBagsSummaryLabel(
        {
          bagsCarried: 0,
          bagsChecked: 0,
          bagsInCabin: 1,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{count} x Cabin", tOptions:{"count":1}');
  });

  it("bags in Cabin", () => {
    expect(
      getFlightBagsSummaryLabel(
        {
          bagsCarried: 0,
          bagsChecked: 1,
          bagsInCabin: 0,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{count} x Checked", tOptions:{"count":1}');
  });

  it("carried, checked and in cabin", () => {
    expect(
      getFlightBagsSummaryLabel(
        {
          bagsCarried: 1,
          bagsChecked: 1,
          bagsInCabin: 1,
        },
        mockedTFunc
      )
    ).toBe(
      'tLabel:"{count} x Checked", tOptions:{"count":1},tLabel:"{count} x Carried", tOptions:{"count":1},tLabel:"{count} x Cabin", tOptions:{"count":1}'
    );
  });
});

describe("getTitleLabel", () => {
  it("title for the flight card", () => {
    expect(
      getTitleLabel(
        {
          cardType: PB_CARD_TYPE.FLIGHT_ARRIVING,
          departureCityName: "Milan",
          arrivalCityName: "Madrid",
        },
        mockedTFunc
      )
    ).toBe('tLabel:"Flight from {from} to {to}", tOptions:{"from":"Milan","to":"Madrid"}');

    expect(
      getTitleLabel(
        {
          cardType: PB_CARD_TYPE.FLIGHT_RETURN,
          departureCityName: "Milan",
          arrivalCityName: "Madrid",
        },
        mockedTFunc
      )
    ).toBe('tLabel:"Flight from {from} to {to}", tOptions:{"from":"Milan","to":"Madrid"}');
  });

  describe("car card title", () => {
    it("has city name capitalized if city name does not contain spaces", () => {
      expect(
        getTitleLabel(
          {
            cardType: PB_CARD_TYPE.CAR_RENTAL,
            cityName: "KEFLAVIK",
          },
          mockedTFunc
        )
      ).toBe('tLabel:"Car rental in {cityName}", tOptions:{"cityName":"Keflavik"}');
    });

    it("has city name unmodified if it contains spaces", () => {
      expect(
        getTitleLabel(
          {
            cardType: PB_CARD_TYPE.CAR_RENTAL,
            cityName: "Rio de Janeiro",
          },
          mockedTFunc
        )
      ).toBe('tLabel:"Car rental in {cityName}", tOptions:{"cityName":"Rio de Janeiro"}');
    });

    it("has empty city name if it's undefined", () => {
      expect(
        getTitleLabel(
          {
            cardType: PB_CARD_TYPE.CAR_RENTAL,
            cityName: undefined,
          },
          mockedTFunc
        )
      ).toBe('tLabel:"Car rental in {cityName}", tOptions:{"cityName":""}');
    });
  });
  it("title for the stay card", () => {
    expect(
      getTitleLabel(
        {
          cardType: PB_CARD_TYPE.STAY,
          name: "Best hotel in Rome",
        },
        mockedTFunc
      )
    ).toBe("Best hotel in Rome");
  });
  it("title for the attraction card", () => {
    expect(
      getTitleLabel(
        {
          cardType: PB_CARD_TYPE.ATTRACTION,
          name: "Visit coliseum",
        },
        mockedTFunc
      )
    ).toBe("Visit coliseum");
  });
});

describe("getDistanceLabel", () => {
  it("displays m when meters <100", () => {
    expect(
      getDistanceLabel(
        {
          travelDistanceInMeters: 65,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{distance} m", tOptions:{"distance":65}');
  });

  it("displays in km meters >= 100", () => {
    expect(
      getDistanceLabel(
        {
          travelDistanceInMeters: 123,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{distance} km", tOptions:{"distance":0.1}');
  });

  it("displays km without .0 fractions", () => {
    expect(
      getDistanceLabel(
        {
          travelDistanceInMeters: 1000,
        },
        mockedTFunc
      )
    ).toBe('tLabel:"{distance} km", tOptions:{"distance":1}');
  });
});

describe("getCheckinOrCheckoutLabel", () => {
  it("checking label", () => {
    expect(
      getCheckinOrCheckoutLabel(
        {
          date: "2022-07-02T11:00:00.999Z",
          timeString: "11:00",
          isCheckin: true,
        },
        SupportedLanguages.English,
        mockedTFunc
      )
    ).toBe('tLabel:"{day} from {time}", tOptions:{"day":"Jul 02","time":"11:00"}');
  });

  it("checkout label", () => {
    expect(
      getCheckinOrCheckoutLabel(
        {
          date: "2022-07-02T14:00:00.000Z",
          timeString: "14:00",
          isCheckin: false,
        },
        SupportedLanguages.English,
        mockedTFunc
      )
    ).toBe('tLabel:"{day} before {time}", tOptions:{"day":"Jul 02","time":"14:00"}');
  });
});

describe("getCarPickupOrDropoffDateLabel", () => {
  it("when time from and time to are known", () => {
    expect(
      getCarPickupOrDropoffDateLabel(
        "2022-07-02T09:00:00.000Z",
        "2022-07-02T14:00:00.000Z",
        SupportedLanguages.English
      )
    ).toBe("Sat, Jul 02 09:00-14:00");
  });
  it("when time from is known", () => {
    expect(
      getCarPickupOrDropoffDateLabel("2022-07-02T09:00:00.000Z", "", SupportedLanguages.English)
    ).toBe("Sat, Jul 02 09:00");
  });
  it("when time to is known", () => {
    expect(
      getCarPickupOrDropoffDateLabel("", "2022-07-02T09:00:00.000Z", SupportedLanguages.English)
    ).toBe("Sat, Jul 02 09:00");
  });
  it("when nothing is known", () => {
    expect(
      getCarPickupOrDropoffDateLabel("", "2022-07-02T09:00:00.000Z", SupportedLanguages.English)
    ).toBe("Sat, Jul 02 09:00");
  });
});

describe("getInceptionLabel", () => {
  it("returns month, year and date", () => {
    expect(
      getInceptionLabel(
        {
          inceptionDay: 15,
          inceptionMonth: 12,
          inceptionYear: 1900,
        },
        SupportedLanguages.English
      )
    ).toEqual("December 15, 1900");
  });
  it("returns month and year when day unknown", () => {
    expect(
      getInceptionLabel(
        {
          inceptionMonth: 12,
          inceptionYear: 1900,
        },
        SupportedLanguages.English
      )
    ).toEqual("December 1900");
  });
  it("returns year when no day and month unknown", () => {
    expect(
      getInceptionLabel(
        {
          inceptionYear: 1900,
        },
        SupportedLanguages.English
      )
    ).toEqual("1900");
  });
  it("returns nothing when only month known", () => {
    expect(
      getInceptionLabel(
        {
          inceptionMonth: 12,
        },
        SupportedLanguages.English
      )
    ).toEqual("");
  });
  it("returns nothing when nothing supplied", () => {
    expect(getInceptionLabel({}, SupportedLanguages.English)).toEqual("");
  });
});

describe("getOpenCloseLabel", () => {
  it("open and close timings are different", () => {
    expect(getOpenCloseLabel({ timeCloses: "21:00", timeOpens: "10:00" })).toBe("10:00-21:00");
  });

  it("open and close timings are the whole day", () => {
    expect(getOpenCloseLabel({ timeCloses: "00:00", timeOpens: "00:00" })).toBe("24h");
  });
});

describe("getPopulationLabel", () => {
  it("when populationYear year and populationCount are known", () => {
    expect(
      getPopulationLabel({
        populationCount: 10000000,
        populationYear: 1934,
      })
    ).toBe("10,000,000 (1934)");
  });

  it("when only populationCount is known", () => {
    expect(getPopulationLabel({ populationCount: 345000 })).toBe("345,000");
  });

  it("when only populationYear is known", () => {
    expect(getPopulationLabel({ populationYear: 3345 })).toBe("");
  });
});

describe("getRoomTypesLabel", () => {
  it("returns proper rooms count for room types", () => {
    expect(
      getRoomTypesLabel({
        roomTypes: ["standard", "standard", "premium"],
      })
    ).toBe("2 standard, 1 premium");
  });

  it("returns nothing when no room types or they're empty", () => {
    expect(
      getRoomTypesLabel({
        roomTypes: [],
      })
    ).toBe("");

    expect(getRoomTypesLabel({})).toBe("");
  });
});

describe("getTimeToSpendLabel", () => {
  it("hours and minutes", () => {
    expect(getTimeToSpendLabel({ timeToSpend: "01:15" }, mockedTFunc)).toBe(
      'tLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":15}'
    );
  });

  it("hours", () => {
    expect(getTimeToSpendLabel({ timeToSpend: "05:00" }, mockedTFunc)).toBe(
      'tLabel:"{numberOfHours} hours", tOptions:{"numberOfHours":5}'
    );
  });

  it("minutes", () => {
    expect(getTimeToSpendLabel({ timeToSpend: "00:15" }, mockedTFunc)).toBe(
      'tLabel:"{minutes}m", tOptions:{"minutes":15}'
    );
  });
  it("nothing", () => {
    expect(getTimeToSpendLabel({ timeToSpend: "00:00" }, mockedTFunc)).toBe("");
    expect(getTimeToSpendLabel({ timeToSpend: "" }, mockedTFunc)).toBe("");
    expect(getTimeToSpendLabel({}, mockedTFunc)).toBe("");
  });
});

describe("getTransportationTextLabel", () => {
  it("shows walk timings and distance", () => {
    expect(
      getTransportationTextLabel(
        {
          travelDistanceInMeters: 10000,
          travelDuration: "01:15",
          travelMode: PB_ITINERARY_TRAVELMODE_TYPE.WALK,
        },
        mockedTFunc
      )
      // walk => 10 km, 1h15m
    ).toBe(
      'tLabel:"Walk ", tOptions:undefinedtLabel:"{distance} km", tOptions:{"distance":10}, tLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":15}'
    );
  });

  it("shows flight timings and distance", () => {
    expect(
      getTransportationTextLabel(
        {
          travelDistanceInMeters: 10000,
          travelDuration: "01:15",
          travelMode: PB_ITINERARY_TRAVELMODE_TYPE.FLIGHT,
        },
        mockedTFunc
      )
      // flight => 10 km, 1h15m
    ).toBe(
      'tLabel:"Flight ", tOptions:undefinedtLabel:"{distance} km", tOptions:{"distance":10}, tLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":15}'
    );
  });

  it("shows drive timings and distance", () => {
    expect(
      getTransportationTextLabel(
        {
          travelDistanceInMeters: 10000,
          travelDuration: "01:15",
          travelMode: PB_ITINERARY_TRAVELMODE_TYPE.DRIVING,
        },
        mockedTFunc
      )
      // drive => 10 km, 1h15m
    ).toBe(
      'tLabel:"Drive ", tOptions:undefinedtLabel:"{distance} km", tOptions:{"distance":10}, tLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":15}'
    );
  });

  it("shows distance when time unknown", () => {
    expect(
      getTransportationTextLabel(
        {
          travelDistanceInMeters: 10000,
          travelMode: PB_ITINERARY_TRAVELMODE_TYPE.FLIGHT,
        },
        mockedTFunc
      )
      // flight => 10 km
    ).toBe('tLabel:"Flight ", tOptions:undefinedtLabel:"{distance} km", tOptions:{"distance":10}');
  });

  it("shows time when distance unknown", () => {
    expect(
      getTransportationTextLabel(
        {
          travelDuration: "01:15",
          travelMode: PB_ITINERARY_TRAVELMODE_TYPE.FLIGHT,
        },
        mockedTFunc
      )
      // flight => 1h15m
    ).toBe(
      'tLabel:"Flight ", tOptions:undefinedtLabel:"{hours}h {minutes}m", tOptions:{"hours":1,"minutes":15}'
    );
  });
});

describe("getDifficultyLabel", () => {
  it("returns difficulty easy label", () => {
    expect(getDifficultyLabel({ difficulty: ITINERARY_TOUR_DIFFICULTY.EASY }, mockedTFunc)).toBe(
      'tLabel:"Easy", tOptions:undefined'
    );
  });

  it("returns difficulty Medium label", () => {
    expect(getDifficultyLabel({ difficulty: ITINERARY_TOUR_DIFFICULTY.MEDIUM }, mockedTFunc)).toBe(
      'tLabel:"Medium", tOptions:undefined'
    );
  });

  it("returns difficulty Hard label", () => {
    expect(getDifficultyLabel({ difficulty: ITINERARY_TOUR_DIFFICULTY.HARD }, mockedTFunc)).toBe(
      'tLabel:"Hard", tOptions:undefined'
    );
  });

  it("returns difficulty Hard label", () => {
    expect(getDifficultyLabel({ difficulty: undefined }, mockedTFunc)).toBe("");
  });
});

describe("getTicketButtonLabel", () => {
  it("flight boarding pass", () => {
    expect(getTicketButtonLabel(PB_TICKET_TYPE.FLIGHT_BOARDING_PASS, mockedTFunc)).toBe(
      'tLabel:"Boarding pass", tOptions:undefined'
    );
  });
  it("flight e-ticket", () => {
    expect(getTicketButtonLabel(PB_TICKET_TYPE.FLIGHT_ETICKET, mockedTFunc)).toBe(
      'tLabel:"Flight ticket", tOptions:undefined'
    );
  });
  it("voucher ticket", () => {
    expect(getTicketButtonLabel(PB_TICKET_TYPE.VOUCHER, mockedTFunc)).toBe(
      'tLabel:"Voucher", tOptions:undefined'
    );
  });
});
