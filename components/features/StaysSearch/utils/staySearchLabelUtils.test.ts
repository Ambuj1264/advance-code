import {
  StaySearchBreakfastAvailabilities,
  StaySearchParkingAvailabilities,
  StaySearchWifiAvailabilities,
} from "../types/staysSearchEnums";

import { getParkingSpotLabel, getBreakfastLabel, getWifiLabel } from "./staySearchLabelUtils";

import { fakeTranslate } from "utils/testUtils";

describe("getBreakfastLabel", () => {
  it("available", () => {
    expect(
      getBreakfastLabel(StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE, fakeTranslate)
    ).toEqual("available");
  });

  it("free", () => {
    expect(
      getBreakfastLabel(
        StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE_FOR_FREE,
        fakeTranslate
      )
    ).toEqual("included");
  });

  it("in the room", () => {
    expect(
      getBreakfastLabel(StaySearchBreakfastAvailabilities.BREAKFAST_IN_THE_ROOM, fakeTranslate)
    ).toEqual("in the room");
  });

  it("returns empty string if unknown availability type", () => {
    expect(getBreakfastLabel("unkown" as StaySearchBreakfastAvailabilities, fakeTranslate)).toEqual(
      ""
    );
  });
});

describe("getWifiLabel", () => {
  it("Paid", () => {
    expect(getWifiLabel(StaySearchWifiAvailabilities.PAID_WIFI, fakeTranslate)).toEqual("Paid");
  });

  it("Available", () => {
    expect(getWifiLabel(StaySearchWifiAvailabilities.PORTABLE_WIFI, fakeTranslate)).toEqual(
      "Available"
    );
    expect(getWifiLabel(StaySearchWifiAvailabilities.WIRELESS_INTERNET, fakeTranslate)).toEqual(
      "Available"
    );

    expect(getWifiLabel(StaySearchWifiAvailabilities.WIFI_AVAILABLE, fakeTranslate)).toEqual(
      "Available"
    );
  });

  it("Free", () => {
    expect(
      getWifiLabel(StaySearchWifiAvailabilities.WIFI_AVAILABLE_FOR_FREE, fakeTranslate)
    ).toEqual("Free");
  });

  it("returns empty string if unknown availability type", () => {
    expect(getWifiLabel("unkown" as StaySearchWifiAvailabilities, fakeTranslate)).toEqual("");
  });
});

describe("getParkingSpotLabel", () => {
  describe("when parking type is known - it returns the proper parking label", () => {
    it("handles StreetParking", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.STREET_PARKING, fakeTranslate)
      ).toEqual("Street parking");
    });
    it("handles PrivateParking", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.PRIVATE_PARKING, fakeTranslate)
      ).toEqual("Private parking");
    });
    it("handles SecuredParking", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.SECURED_PARKING, fakeTranslate)
      ).toEqual("Secured parking");
    });
    it("handles ParkingGarage", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.PARKING_GARAGE, fakeTranslate)
      ).toEqual("Parking garage");
    });
    it("handles FreeParking", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.FREE_PARKING, fakeTranslate)
      ).toEqual("Free parking");
    });
    it("handles AccessibleParking", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.ACCESSIBLE_PARKING, fakeTranslate)
      ).toEqual("Accessible parking");
    });
    it("handles ParkingAvailable", () => {
      expect(
        getParkingSpotLabel(StaySearchParkingAvailabilities.PARKING_AVAILABLE, fakeTranslate)
      ).toEqual("Available");
    });
  });

  it("returns parkingType if it's unknown", () => {
    expect(
      getParkingSpotLabel(
        "someUnknownTypeOfParking" as StaySearchParkingAvailabilities,
        fakeTranslate
      )
    ).toEqual("someUnknownTypeOfParking");
  });
});
