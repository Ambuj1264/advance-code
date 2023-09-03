import {
  mockRoute0,
  mockRoute10,
  mockOutBoundOneWayRouteData,
  mockOutBoundOneWayRoute,
  mockIternaryDataOneWay,
  mockIternaryOneWay,
} from "./flightsMockData";
import {
  getFlightClassString,
  constructRoute,
  constructFlightItinerary,
} from "./flightsSharedUtils";

const fakeTranslate = (value: string) => value;

describe("getFlightClassString", () => {
  test("should concattenate the flight classes if they are correct", () => {
    expect(getFlightClassString(fakeTranslate as TFunction, mockRoute0(1), mockRoute10)).toEqual(
      "Economy + Business"
    );
  });
});

// TODO: Add test for two way flight.
describe("constructRoute", () => {
  beforeAll(() => {
    // eslint-disable-next-line functional/immutable-data,no-extend-native
    Date.prototype.getTimezoneOffset = jest.fn(() => -180);
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data,no-extend-native
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);
  });

  test("should construct route 'One way'", () => {
    expect(constructRoute([mockOutBoundOneWayRouteData], undefined)).toEqual(
      mockOutBoundOneWayRoute
    );
  });
});

describe("constructFlightItinerary", () => {
  test("should construct Flight Itinerary 'One way'", () => {
    expect(constructFlightItinerary(mockIternaryDataOneWay)).toEqual(mockIternaryOneWay);
  });
});
