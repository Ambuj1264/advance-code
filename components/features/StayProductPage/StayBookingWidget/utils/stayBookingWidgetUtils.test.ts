import { parse, startOfDay } from "date-fns";

import { MealType, OrderStayCancellationType, RoomType } from "../types/enums";
import {
  mockStayRoomType,
  mockStayRoomType2,
  mockQueryRoomCombinationRoom1,
  mockQueryRoomCombinationRoom2,
  mockQueryRoomCombination1,
  mockQueryRoomCombination2,
  mockRoomCombination1,
  mockRoomCombination2,
} from "../../utils/stayMockData";

import { mockStayGroupedRates } from "./mockStayUtilsData";
import {
  getSelectedRoomTypeCount,
  getRoomTypePrice,
  getTotalPrice,
  constructDates,
  constructGroupedRatesToStayData,
  constructRoomCombinations,
  constructRoomCombinationProductSpecs,
} from "./stayBookingWidgetUtils";

import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import PersonsIcon from "components/icons/travellers.svg";
import BedIcon from "components/icons/hotel-bedroom.svg";
import ShowerIcon from "components/icons/bathroom-shower.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";

const fakeTranslate = (value: string) => value;

describe("getSelectedRoomTypeCount", () => {
  test("should return correctly constructed attractions", () => {
    expect(getSelectedRoomTypeCount(mockStayRoomType)).toEqual(2);
  });
});

describe("getRoomTypePrice", () => {
  test("should return total price of selected rooms of this roomtype", () => {
    expect(getRoomTypePrice(100, mockStayRoomType)).toEqual(244);
  });
  test("should return from price because roomtype is not selected", () => {
    expect(getRoomTypePrice(100, mockStayRoomType2)).toEqual(100);
  });
});

describe("getTotalPrice", () => {
  test("should return total price of all selected rooms", () => {
    expect(getTotalPrice([mockStayRoomType, mockStayRoomType2])).toEqual(244);
  });
});

describe("constructDates", () => {
  const day1 = "2019-03-27";
  const day2 = "2019-03-28";
  test("Should create dates correctly", () => {
    const day1Parsed = parse(day1, yearMonthDayFormat, new Date());
    const day2Parsed = parse(day2, yearMonthDayFormat, new Date());
    const today = parse(
      getFormattedDate(new Date(), yearMonthDayFormat),
      yearMonthDayFormat,
      new Date()
    );
    const unavailableDates = [day1, day2];
    expect(constructDates({ min: day1, max: day2, unavailableDates })).toEqual({
      min: today,
      max: day2Parsed,
      unavailableDates: [day1Parsed, day2Parsed],
    });
  });

  test("Should create dates correctly when they are undefined", () => {
    expect(constructDates({ min: undefined, max: undefined, unavailableDates: [] })).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [],
    });
  });
  test("Should create dates with min undefined because user is admin", () => {
    expect(
      constructDates({ min: day1, max: undefined, unavailableDates: [] }, undefined, true)
    ).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [],
    });
  });
  test("Should remove first unavailableDate from the unavailable array if fromDate has been selected", () => {
    expect(
      constructDates(
        { min: day1, max: undefined, unavailableDates: [day2] },
        {
          from: new Date(day1),
          to: undefined,
        },
        true
      )
    ).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [],
    });
  });
  test("Should remove first unavailableDate from the unavailable array if fromDate has been selected", () => {
    expect(
      constructDates(
        {
          min: day1,
          max: undefined,
          unavailableDates: ["2019-03-27", "2019-03-30", "2019-03-31"],
        },
        { from: new Date(day2), to: undefined },
        true
      )
    ).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [new Date("2019-03-27"), new Date("2019-03-31")],
    });
  });
  test("Should not remove any unavailableDate because the selected from date does not have any unavailable dates descendants", () => {
    expect(
      constructDates(
        { min: day1, max: undefined, unavailableDates: [day2] },
        {
          from: new Date(day1),
          to: undefined,
        },
        true
      )
    ).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [],
    });
  });
  test("Should not crash if the toDate if earlier than fromDate", () => {
    expect(
      constructDates(
        { min: day1, max: undefined, unavailableDates: [] },
        {
          from: new Date(day2),
          to: new Date("2019-03-16"),
        },
        true
      )
    ).toEqual({
      min: undefined,
      max: undefined,
      unavailableDates: [],
    });
  });
});

describe("constructGroupedRatesToStayData", () => {
  test("should return correctly constructed roomTypes", () => {
    const roomTypes: StayBookingWidgetTypes.RoomType[] = [
      {
        roomTypeId: "DOUBLE_ROOM-Double-deluxe-room",
        roomTypeName: "Double deluxe room",
        roomType: RoomType.DOUBLE_ROOM,
        fromPriceObject: {
          price: 97,
          currency: "EUR",
          priceDisplayValue: "97",
        },
        totalAvailableRooms: undefined,
        images: [],
        numberOfPersons: 2,
        productSpecs: [],
        roomDetails: [],
        roomOffers: [
          {
            roomOfferName: "Double room",
            roomOfferRateReference: "2987DD-13249yfafwhn1",
            availableRooms: 2,
            priceObject: {
              price: 1992.716,
              currency: "EUR",
              priceDisplayValue: "1,993",
            },
            mealType: MealType.BED_AND_BREAKFAST,
            cancellationType: OrderStayCancellationType.UNKNOWN,
            freeCancellationUntil: undefined,
            availabilityIds: ["13249yfafwhn1"],
            isSelected: false,
            numberOfSelectedRooms: 0,
          },
        ],
      },
      {
        roomTypeId: "DOUBLE_ROOM-Double-room",
        roomTypeName: "Double room",
        roomType: RoomType.DOUBLE_ROOM,
        fromPriceObject: {
          price: 105,
          currency: "EUR",
          priceDisplayValue: "105",
        },
        totalAvailableRooms: undefined,
        images: [],
        numberOfPersons: 2,
        productSpecs: [],
        roomDetails: [],
        roomOffers: [
          {
            roomOfferName: "Double room with mountain view",
            roomOfferRateReference: "2987RO-13249yfhn1",
            availableRooms: 2,
            priceObject: {
              price: 122,
              currency: "EUR",
              priceDisplayValue: "122",
            },
            mealType: MealType.ROOM_ONLY,
            cancellationType: OrderStayCancellationType.FEE_APPLIES,
            freeCancellationUntil: startOfDay(new Date()),
            availabilityIds: ["13249yfhn1", "13249yfhn1"],
            isSelected: false,
            numberOfSelectedRooms: 0,
          },
          {
            roomOfferName: "Double room with ocean view",
            roomOfferRateReference: "2987BB-1324fk2w381",
            availableRooms: 1,
            priceObject: {
              price: 132,
              currency: "EUR",
              priceDisplayValue: "132",
            },
            mealType: MealType.ROOM_ONLY,
            cancellationType: OrderStayCancellationType.FEE_APPLIES,
            freeCancellationUntil: startOfDay(new Date()),
            availabilityIds: ["1324fk2w381", "1324fk2w381"],
            isSelected: false,
            numberOfSelectedRooms: 0,
          },
        ],
      },
    ];
    expect(
      constructGroupedRatesToStayData(fakeTranslate as TFunction, mockStayGroupedRates, [], [])
    ).toEqual(roomTypes);
  });
});

describe("constructRoomCombinations", () => {
  test("should return correctly constructed room combinations", () => {
    expect(
      constructRoomCombinations(
        [mockQueryRoomCombination1, mockQueryRoomCombination2],
        fakeTranslate as TFunction
      )
    ).toEqual([mockRoomCombination1, mockRoomCombination2]);
  });
});

describe("constructRoomCombinationProductSpecs", () => {
  const result = [
    {
      Icon: PersonsIcon,
      value: "{numberOfPersons} persons, {numberOfRooms} rooms",
    },
    {
      Icon: RoomSizeIcon,
      value: "{roomSize}m\u00B2 + {roomSize}m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "2x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private, Private",
    },
    {
      Icon: WifiIcon,
      value: "Free, Free",
    },
  ];
  test("should return correctly constructed room combination product specs", () => {
    expect(
      constructRoomCombinationProductSpecs(
        [mockQueryRoomCombinationRoom1, mockQueryRoomCombinationRoom2],
        fakeTranslate as TFunction
      )
    ).toEqual(result);
  });
});
