import {
  constructFormError,
  getCarUniquePickupLocations,
  getCarTiedReturnLocations,
  setInitializeExtras,
} from "../carBookingWidgetUtils";

import { BookingWidgetFormError } from "types/enums";

describe("constructFormErrors", () => {
  test("should return correct form errors as true", () => {
    const input = {
      selectedExtras: [],
      pickupSpecify: "",
      dropoffSpecify: "",
      isHotelPickup: true,
      isCarnect: false,
    };
    expect(constructFormError(input)).toEqual([BookingWidgetFormError.EMPTY_ANSWER]);
  });
  test("should return correct form errors as true", () => {
    const input = {
      selectedExtras: [],
      pickupSpecify: "",
      dropoffSpecify: "",
      isHotelPickup: false,
      isHotelDropoff: true,
      isCarnect: true,
    };
    expect(constructFormError(input)).toEqual([]);
  });
  test("should return correct form errors as true", () => {
    const selectedExtras = [
      {
        id: "222",
        count: 1,
        questionAnswers: [
          {
            key: "first_name",
            answer: "",
            identifier: "1",
          },
          {
            key: "last_name",
            answer: "",
            identifier: "1",
          },
        ],
      },
    ];
    const input = {
      selectedExtras,
      pickupSpecify: "",
      dropoffSpecify: "",
      isCarnect: true,
    };
    expect(constructFormError(input)).toEqual([BookingWidgetFormError.EMPTY_ANSWER]);
  });
  test("should return correct no form errors", () => {
    const selectedExtras = [
      {
        id: "222",
        count: 1,
        questionAnswers: [
          {
            key: "first_name",
            answer: "Anna",
            identifier: "1",
          },
          {
            key: "last_name",
            answer: "Jónsdóttir",
            identifier: "1",
          },
        ],
      },
    ];
    const input = {
      selectedExtras,
      pickupSpecify: "",
      dropoffSpecify: "",
      isCarnect: true,
    };
    expect(constructFormError(input)).toEqual([]);
  });
});

const ParisAirport2ParisCity = {
  idContext: "offer1",
  pickupLocation: {
    name: "Paris Airport",
    locationType: "airport",
  },
  returnLocation: {
    name: "Paris",
    locationType: "city",
  },
};

const ParisCity2ParisAirport = {
  idContext: "offer1",
  pickupLocation: {
    name: "Paris",
    locationType: "city",
  },
  returnLocation: {
    name: "Paris Airport",
    locationType: "airport",
  },
};

const ParisCity2ParisCity = {
  idContext: "offer1",
  pickupLocation: {
    name: "Paris",
    locationType: "city",
  },
  returnLocation: {
    name: "Paris",
    locationType: "city",
  },
};

describe("getCarUniquePickupLocations", () => {
  it("returns unique pickup locations across available offers", () => {
    expect(
      getCarUniquePickupLocations([
        ParisAirport2ParisCity,
        ParisCity2ParisAirport,
        ParisCity2ParisCity,
      ])
    ).toEqual([ParisAirport2ParisCity, ParisCity2ParisAirport]);
  });

  it("if no unique locations found - returns available offer", () => {
    expect(getCarUniquePickupLocations(undefined, ParisAirport2ParisCity)).toEqual([
      ParisAirport2ParisCity,
    ]);
  });
});

describe("getCarTiedReturnLocations", () => {
  it("returns offers matching the pickup location only", () => {
    expect(
      getCarTiedReturnLocations(
        [ParisAirport2ParisCity, ParisCity2ParisAirport, ParisCity2ParisCity],
        ParisAirport2ParisCity
      )
    ).toEqual([ParisAirport2ParisCity]);

    expect(
      getCarTiedReturnLocations(
        [ParisAirport2ParisCity, ParisCity2ParisAirport, ParisCity2ParisCity],
        ParisCity2ParisAirport
      )
    ).toEqual([ParisCity2ParisAirport, ParisCity2ParisCity]);
  });

  it("returns offers matching the pickup location only", () => {
    expect(
      getCarTiedReturnLocations(
        [ParisAirport2ParisCity, ParisCity2ParisAirport, ParisCity2ParisCity],
        ParisAirport2ParisCity
      )
    ).toEqual([ParisAirport2ParisCity]);
  });

  it("if no offers matching the selected pickup location - returns selected pickup location", () => {
    expect(
      getCarTiedReturnLocations(
        [ParisAirport2ParisCity, ParisAirport2ParisCity, ParisAirport2ParisCity],
        ParisCity2ParisAirport
      )
    ).toEqual([ParisCity2ParisAirport]);
  });
});

const extras = [
  {
    id: "1",
    count: 0,
    questionAnswers: [],
  },
  {
    id: "2",
    count: 0,
    questionAnswers: [],
  },
  {
    id: "3",
    count: 0,
    questionAnswers: [],
  },
];

const preSelectedExtras = [
  {
    id: "1",
    name: "GPS",
    count: 1,
    price: 2000,
    translationKeys: {
      keys: [],
    },
  },
  {
    id: "3",
    name: "Booster Seat(4-12 years)",
    count: 1,
    price: 2000,
    translationKeys: {
      keys: [],
    },
  },
];

const expectedExtrasResult = [
  {
    id: "1",
    count: 1,
    questionAnswers: [],
  },
  {
    id: "2",
    count: 0,
    questionAnswers: [],
  },
  {
    id: "3",
    count: 1,
    questionAnswers: [],
  },
];

describe("setInitializeExtras", () => {
  it("It adds the pre selected extras to the array of extras", () => {
    expect(setInitializeExtras(extras, preSelectedExtras)).toEqual(expectedExtrasResult);
  });
});
