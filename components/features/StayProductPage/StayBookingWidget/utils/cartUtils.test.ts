import {
  StayProvider,
  RoomType,
  MealType,
  OrderStayCancellationType,
  PaymentType,
} from "../types/enums";
import {
  mockStayRoomOffer1,
  mockStayRoomOffer2,
  mockStayRoomOffer3,
  mockStayRoomType,
} from "../../utils/stayMockData";

import { constructRoomCartRates, getCartItem, constructGTIStayCartInput } from "./cartUtils";
import {
  mockStayCartInputRates,
  mockStayGroupedRates,
  mockStayCartInputRates2,
} from "./mockStayUtilsData";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

describe("constructRoomCartRates", () => {
  const commonRoomRate = {
    index: 1,
    room: [
      {
        name: "",
        roomType: RoomType.DOUBLE_ROOM,
        specialType: "",
        providerCode: "",
        subProviderCode: "",
      },
    ],
    meal: {
      mealType: MealType.ROOM_ONLY,
      subProviderCode: "",
    },
    numberOfAdults: 2,
    numberOfChildren: 0,
    cancellationType: OrderStayCancellationType.FEE_APPLIES,
    paymentType: PaymentType.PAY_BEFORE,
  };
  const commonRate = {
    provider: StayProvider.ANIXE,
    productId: 123,
    booked: false,
    canceled: false,
    subProvider: "SUNHOTES",
    providerCode: "",
    providerBookingCode: "",
    cancellationPolicies: [
      {
        dateFrom: getFormattedDate(new Date(), yearMonthDayFormat),
        dateTo: getFormattedDate(new Date(), yearMonthDayFormat),
        price: {
          currency: "EUR",
          value: 78,
        },
      },
    ],
  };
  const room1 = {
    availableRooms: 2,
    rates: [
      {
        ...commonRate,
        rateReference: "2987RO",
        mesh: "13249yfhn1",
        price: {
          currency: "EUR",
          value: 122,
        },
        roomRates: [
          {
            ...commonRoomRate,
            roomRateName: "Double room with mountain view",
          },
        ],
      },
      {
        ...commonRate,
        rateReference: "asjifg",
        mesh: "1324fk2w381",
        price: {
          currency: "EUR",
          value: 132,
        },
        roomRates: [
          {
            ...commonRoomRate,
            roomRateName: "Double room with ocean view",
          },
        ],
      },
    ],
  };
  const room2 = {
    availableRooms: 2,
    rates: [
      {
        ...commonRate,
        rateReference: "2987RO",
        mesh: "13249yfafwhn1",
        price: {
          currency: "EUR",
          value: 99,
        },
        roomRates: [
          {
            ...commonRoomRate,
            roomRateName: "Double room",
          },
        ],
      },
    ],
  };
  const result = [
    {
      provider: "ANIXE",
      rateReference: "2987RO",
      mesh: "13249yfhn1",
      subprovider: "SUNHOTES",
      numberOfAdults: 2,
      numberOfChildren: 0,
      price: {
        currency: "EUR",
        value: 122,
      },
    },
    {
      provider: "ANIXE",
      rateReference: "asjifg",
      mesh: "1324fk2w381",
      subprovider: "SUNHOTES",
      numberOfAdults: 2,
      numberOfChildren: 0,
      price: {
        currency: "EUR",
        value: 132,
      },
    },
  ];
  test("should return a correctly construct list of cart rooms", () => {
    expect(
      constructRoomCartRates(
        [mockStayRoomOffer1, mockStayRoomOffer2, mockStayRoomOffer3],
        [room1, room2]
      )
    ).toEqual(result);
  });
});

describe("getCartItem", () => {
  const cartStay1 = {
    cartItemId: "agjo149f",
    numberOfAdults: 2,
    numberOfChildren: 0,
    childrenAges: [],
    from: "2023-11-14",
    to: "2023-11-16",
    rooms: [],
  };
  const cartStay2 = {
    cartItemId: "bnsbapt469",
    numberOfAdults: 2,
    numberOfChildren: 1,
    childrenAges: [9],
    from: "2023-11-14",
    to: "2023-11-16",
    rooms: [],
  };
  const cartItemId = "bnsbapt469".replace(/[^0-9.]/g, "");
  test("should return a correct stay cartItem", () => {
    expect(getCartItem([cartStay1, cartStay2], cartItemId)).toEqual(cartStay2);
  });
  test("should return undefined because there is no cartItem with this cartItemId", () => {
    expect(getCartItem([cartStay1, cartStay2], "sbpnh395")).toEqual(undefined);
  });
  test("should return undefined because there are no cart items", () => {
    expect(getCartItem(undefined, cartItemId)).toEqual(undefined);
  });
  test("should return undefined because there is no cartItemId", () => {
    expect(getCartItem([cartStay1, cartStay2], undefined)).toEqual(undefined);
  });
});

describe("constructStayCartInput", () => {
  const selectedDates = {
    from: new Date("2022-01-20T00:00:00.000Z"),
    to: new Date("2022-01-24T00:00:00.000Z"),
  };
  const occupancies = [
    {
      numberOfAdults: 1,
      childrenAges: [],
    },
  ];
  const productPageUri = "/france/best-hotels-and-places-to-stay/details/hotel-vernet";
  const productId = 478675;

  test("should correctly construct stay cart input for 1 stay", () => {
    expect(
      constructGTIStayCartInput({
        groupedRates: mockStayGroupedRates,
        roomTypes: [mockStayRoomType],
        selectedDates,
        occupancies,
        productPageUri,
        productId,
      })
    ).toEqual({
      dateCheckingIn: "2022-01-20",
      dateCheckingOut: "2022-01-24",
      totalNumberOfAdults: 1,
      totalNumberOfChildren: 0,
      childrenAges: [],
      cartItemId: undefined,
      rates: mockStayCartInputRates,
      productPageUri,
      productId,
    });
  });

  test("should correctly construct cart input for 2 stays", () => {
    expect(
      constructGTIStayCartInput({
        groupedRates: [mockStayGroupedRates[0], mockStayGroupedRates[0]],
        roomTypes: [mockStayRoomType, mockStayRoomType],
        selectedDates,
        occupancies,
        productPageUri,
        productId,
      })
    ).toEqual({
      dateCheckingIn: "2022-01-20",
      dateCheckingOut: "2022-01-24",
      totalNumberOfAdults: 1,
      totalNumberOfChildren: 0,
      childrenAges: [],
      cartItemId: undefined,
      rates: mockStayCartInputRates2,
      productPageUri,
      productId,
    });
  });
});
