import {
  mockQueryAccommodation0,
  mockQueryAccommodation1,
  mockAccommodation0,
  mockAccommodation1,
} from "../mockAccommodationData";
import {
  constructAccommodation,
  constructAmenitiesItems,
  constructNearbyItems,
  formatTime,
  constructRoomFacts,
} from "../accommodationUtils";

import TravellerIcon from "components/icons/travellers.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import BreakfastIcon from "components/icons/breakfast.svg";
import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import BathroomIcon from "components/icons/bathroom-shower.svg";
import { mockQueryImages0, mockImage0 } from "utils/mockData/mockGlobalData";

const fakeTranslate = (value: string) => value;

describe("formatTime", () => {
  test("should return correctly formatted time", () => {
    expect(formatTime("16:00:00")).toEqual("16:00");
  });
});

describe("constructAmenitiesItems", () => {
  test("should return correctly constructed includedItems", () => {
    const result = constructAmenitiesItems([
      {
        id: 0,
        name: "Free Wifi",
      },
      {
        id: 1,
        name: "Free parking",
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Free Wifi",
      },
      {
        id: "1",
        title: "Free parking",
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
    expect(result[1].id).toEqual(expectedResult[1].id);
    expect(result[1].title).toEqual(expectedResult[1].title);
  });
});

describe("constructNearbyItems", () => {
  test("should return correctly constructed includedItems", () => {
    const commonNearbyItem = {
      image: mockImage0,
      url: "",
      type: "attraction",
      orm_name: "attraction",
      latitude: 0,
      longitude: 0,
      isGoogleReview: false,
      reviewTotalScore: 4,
      reviewTotalCount: 4,
    };
    const result = constructNearbyItems([
      {
        id: 0,
        title: "Reykjavik City Hall",
        ...commonNearbyItem,
      },
      {
        id: 1,
        title: "Downtown Bars",
        ...commonNearbyItem,
      },
    ]);
    const expectedResult = [
      {
        id: "0",
        title: "Reykjavik City Hall",
        image: mockImage0,
      },
      {
        id: "1",
        title: "Downtown Bars",
        image: mockImage0,
      },
    ];
    expect(result[0].id).toEqual(expectedResult[0].id);
    expect(result[0].title).toEqual(expectedResult[0].title);
    expect(result[1].id).toEqual(expectedResult[1].id);
    expect(result[1].title).toEqual(expectedResult[1].title);
  });
});

describe("constructRoomFacts", () => {
  const room: AccommodationTypes.QueryRoom = {
    id: 0,
    name: "Standard Double Room",
    privateBathroom: 1,
    size: 2,
    maxPersons: 3,
    bedOptions: "",
    roomImages: mockQueryImages0,
  };
  test("should return correctly constructed quick facts array", () => {
    expect(constructRoomFacts(room, true, 0, true, fakeTranslate as TFunction)).toEqual([
      {
        Icon: RoomSizeIcon,
        name: "Room size",
        value: `2 m2`,
      },
      {
        Icon: TravellerIcon,
        name: "Accommodates",
        value: "{numberOfPersons} persons",
      },
      {
        Icon: BathroomIcon,
        name: "Bathroom",
        value: "Private",
      },
      {
        Icon: BreakfastIcon,
        name: "Breakfast",
        value: "Available",
      },
      {
        Icon: WifiIcon,
        name: "Wifi",
        value: "Free",
      },
    ]);
  });
});

describe("constructAccommodation", () => {
  test("should return correctly constructed accommodation", () => {
    expect(constructAccommodation(mockQueryAccommodation0, fakeTranslate as TFunction)).toEqual(
      mockAccommodation0
    );
  });
  test("should return correctly constructed accommodation", () => {
    expect(constructAccommodation(mockQueryAccommodation1, fakeTranslate as TFunction)).toEqual(
      mockAccommodation1
    );
  });
});
