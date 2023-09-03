import {
  StaySearchBreakfastAvailabilities,
  StaySearchGTEValueProp,
  StaySearchParkingAvailabilities,
  StaySearchWifiAvailabilities,
} from "../types/staysSearchEnums";

import {
  constructStaySearchGTEProductSpecs,
  constructStaySearchGTEProductProps,
} from "./staySearchCardProps";

import NotImportantIconMock from "components/icons/tags-check.svg";
import { fakeTranslate, fakeTranslateWithValues } from "utils/testUtils";
import { StayProductType } from "types/enums";

describe("constructStaySearchGTEProductProps", () => {
  it("returns product specs in sorted order", () => {
    expect(
      constructStaySearchGTEProductProps(fakeTranslate, [
        StaySearchGTEValueProp.SUPPORT24_HOURS,
        StaySearchGTEValueProp.INSTANT_CONFIRMATION,
        StaySearchGTEValueProp.CANCELLATION_CONDITIONAL,
        StaySearchGTEValueProp.CANCELLATION_FREE,
      ])
    ).toEqual([
      {
        Icon: NotImportantIconMock,
        title: "Free cancellation",
      },
      {
        Icon: NotImportantIconMock,
        title: "Conditional cancellation",
      },
      {
        Icon: NotImportantIconMock,
        title: "24/7 customer support",
      },
      {
        Icon: NotImportantIconMock,
        title: "Instant confirmation",
      },
    ]);
  });
  it("skips unknown product specs", () => {
    expect(
      constructStaySearchGTEProductProps(fakeTranslate, [
        StaySearchGTEValueProp.INSTANT_CONFIRMATION,
        "UNKNOWN_VALUE_PROP" as StaySearchGTEValueProp,
      ])
    ).toEqual([
      {
        Icon: NotImportantIconMock,
        title: "Instant confirmation",
      },
    ]);
  });
});

describe("constructStaySearchGTEProductSpecs", () => {
  describe("category quickfact", () => {
    it("displays stay star rating if it's a hotel", () => {
      expect(
        constructStaySearchGTEProductSpecs(fakeTranslateWithValues, {
          productType: StayProductType.HOTEL,
          hotelStarRating: 5,
        })
      ).toEqual([
        {
          Icon: NotImportantIconMock,
          name: "label:Category, options:undefined",
          value: 'label:{starClass} star hotel, options:{"starClass":5}',
        },
      ]);
    });

    it("displays stay type if it is not a hotel", () => {
      expect(
        constructStaySearchGTEProductSpecs(fakeTranslate, {
          productType: StayProductType.COTTAGE,
          hotelStarRating: 4,
        })
      ).toEqual([
        {
          Icon: NotImportantIconMock,
          name: "Category",
          value: "Cottage",
        },
      ]);
    });
  });
  describe("checking & checkout quickfact", () => {
    it("merges checking & checkout quickfacts into a single TIME_OF_CHECK_IN_AND_OUT", () => {
      expect(
        constructStaySearchGTEProductSpecs(fakeTranslate, {
          timeOfCheckIn: "13:30:00",
          timeOfCheckOut: "15:00",
        })
      ).toEqual([
        {
          Icon: NotImportantIconMock,
          name: "Check-in & check-out",
          value: "13:30 & 15:00",
        },
      ]);
    });

    it("does not merge time if checkin/out is not available", () => {
      expect(
        constructStaySearchGTEProductSpecs(fakeTranslate, {
          timeOfCheckIn: "12:45:00",
        })
      ).toEqual([
        {
          Icon: NotImportantIconMock,
          name: "Check-in",
          value: "12:45",
        },
      ]);

      expect(
        constructStaySearchGTEProductSpecs(fakeTranslate, {
          timeOfCheckOut: "12:45:00",
        })
      ).toEqual([
        {
          Icon: NotImportantIconMock,
          name: "Check-out",
          value: "12:45",
        },
      ]);
    });
  });
  it("constructs quicfacts in the defined order", () => {
    expect(
      constructStaySearchGTEProductSpecs(fakeTranslateWithValues, {
        breakfast: StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE,
        distanceFromCityCenter: 1.8,
        parking: StaySearchParkingAvailabilities.SECURED_PARKING,
        productType: StayProductType.HOTEL,
        hotelStarRating: 5,
        timeOfCheckIn: "13:30",
        timeOfCheckOut: "12:45:00",
        wirelessInternet: StaySearchWifiAvailabilities.WIFI_AVAILABLE,
      })
    ).toEqual([
      {
        Icon: NotImportantIconMock,
        name: "label:Category, options:undefined",
        value: 'label:{starClass} star hotel, options:{"starClass":5}',
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Location, options:undefined",
        value: 'label:{distanceFromCenter} km from centre, options:{"distanceFromCenter":1.8}',
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Check-in & check-out, options:undefined",
        value: "13:30 & 12:45",
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Parking, options:undefined",
        value: "label:Secured parking, options:undefined",
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Breakfast, options:undefined",
        value: "label:Available, options:undefined",
      },
      {
        Icon: NotImportantIconMock,
        name: "label:Wifi, options:undefined",
        value: "label:Available, options:undefined",
      },
    ]);
  });
});
