import {
  constructVpAddToCartFlightData,
  constructVpAddToCartInput,
  constructVpAddToCartStaysData,
} from "../vpBookingWidgetUtils";

import { mockPassenger1 } from "components/features/Flight/utils/flightMockData";
import { FlightRanking, SupportedCurrencies } from "types/enums";
import { mockComplexFlightItinerary0 } from "components/ui/FlightsShared/flightsMockData";
import { mockRoomCombination1 } from "components/features/StayProductPage/utils/stayMockData";

jest.mock("components/features/Flight/utils/flightUtils", () => ({
  __esModule: true,
  constructFlightCartInput: jest.fn(() => ({} as FlightTypes.MutationAddFlightToCartData)),
}));
jest.mock("components/features/Car/utils/carUtils", () => ({
  __esModule: true,
  constructGTECarRentalCartInput: jest.fn(() => ({} as CarTypes.AddCarGTEToCartData)),
}));
jest.mock("components/features/StayProductPage/StayBookingWidget/utils/cartUtils", () => ({
  __esModule: true,
  constructOldStayCartInput: jest.fn(() => ({} as StayBookingWidgetTypes.OldStayAddToCartData)),
}));

describe("constructVpAddToCartFlightData", () => {
  test("should correctly construct vp flight add to cart data", () => {
    expect(
      constructVpAddToCartFlightData({
        passengers: [mockPassenger1],
        selectedFlight: {
          ...mockComplexFlightItinerary0,
          flightRanking: FlightRanking.BEST,
          isSelected: true,
        },
        vacationIncludesFlight: true,
      })
    ).toEqual({
      bookingToken: mockComplexFlightItinerary0.id,
      passengers: [mockPassenger1],
    });
  });

  test("should correctly construct vp flight add to cart data if flight is not included", () => {
    expect(
      constructVpAddToCartFlightData({
        passengers: [mockPassenger1],
        selectedFlight: {
          ...mockComplexFlightItinerary0,
          flightRanking: FlightRanking.BEST,
          isSelected: true,
        },
        vacationIncludesFlight: false,
      })
    ).toEqual(undefined);
  });
});

describe("constructVpAddToCartStaysData", () => {
  const selectedHotelsRooms: VacationPackageTypes.SelectedVPStaysRoomType[] = [
    {
      productId: 21361,
      day: 1,
      groupedWithDays: [1],
      title: "DOUBLE Accessible",
      fromPrice: 544.192,
      roomCombinations: [mockRoomCombination1],
      dateCheckingIn: "2022-02-01T00:00:00.000Z",
      dateCheckingOut: "2022-02-02T00:00:00.000Z",
    },
  ];
  const mockSelectedHotel1 = selectedHotelsRooms[0];
  test("should correctly construct vp stays add to cart data", () => {
    expect(
      constructVpAddToCartStaysData({
        selectedHotelsRooms,
      })
    ).toEqual([
      {
        productId: mockSelectedHotel1.productId,
        availabilityIds: ["slobgpsj23"],
        isForVacationPackage: true,
      },
    ]);
  });
});

describe("constructVpAddToCartInput", () => {
  const vacationProductId = "mockVpId";
  const mockRequestId = "mockRequestId";
  const dateFrom = new Date("2021-12-09");
  const dateTo = new Date("2021-12-17");
  const adults = 2;
  const children = 0;
  const infants = 0;
  const selectedRooms: VacationPackageTypes.SelectedVPStaysRoomType[] = [
    {
      productId: 21361,
      day: 1,
      groupedWithDays: [1],
      title: "DOUBLE Accessible",
      fromPrice: 544.192,
      roomCombinations: [mockRoomCombination1],
      dateCheckingIn: "2022-02-01T00:00:00.000Z",
      dateCheckingOut: "2022-02-02T00:00:00.000Z",
    },
  ];
  const mockSelectedHotel1 = selectedRooms[0];
  test("should correctly construct vp add to cart input", () => {
    expect(
      constructVpAddToCartInput({
        vacationProductId,
        requestId: mockRequestId,
        dateFrom,
        dateTo,
        originCountryCode: "",
        occupancies: [
          {
            numberOfAdults: 2,
            childrenAges: [],
          },
        ],
        // mock construction function calls inside for each type of product.
        flightData: {
          passengers: [] as FlightTypes.PassengerDetails[],
          bookingToken: "bookingToken",
        },
        carData: {} as CarTypes.AddCarGTEToCartData,
        staysData: [
          {
            productId: mockSelectedHotel1.productId,
            availabilityIds: ["slobgpsj23"],
            isForVacationPackage: true,
          },
        ],
        selectedTours: [],
        currencyCode: SupportedCurrencies.EURO as string,
      })
    ).toEqual({
      id: vacationProductId,
      requestId: mockRequestId,
      adults,
      children,
      infants,
      paxMix: [
        {
          numberOfAdults: 2,
          childrenAges: [],
        },
      ],
      from: "2021-12-09",
      to: "2021-12-17",
      cars: [{}],
      flights: [{}],
      stayProducts: [
        {
          productId: mockSelectedHotel1.productId,
          availabilityIds: ["slobgpsj23"],
          isForVacationPackage: true,
        },
      ],
      toursAndTickets: [],
      originCountryCode: "",
      originId: undefined,
      originName: undefined,
    });
  });
});
