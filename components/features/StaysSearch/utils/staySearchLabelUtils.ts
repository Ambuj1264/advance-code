import {
  StaySearchBreakfastAvailabilities,
  StaySearchParkingAvailabilities,
  StaySearchWifiAvailabilities,
} from "../types/staysSearchEnums";

import { StayProductType } from "types/enums";
import { removeSecondsFromTimeString } from "utils/dateUtils";

export const getProductTypeLabel = (productType: StayProductType, t: TFunction) => {
  switch (productType) {
    case StayProductType.APARTMENT:
      return t("Apartment");
    case StayProductType.BED_AND_BREAKFAST:
      return t("Bed and breakfast");
    case StayProductType.CASTLE:
      return t("Castle");
    case StayProductType.COTTAGE:
      return t("Cottage");
    case StayProductType.GUESTHOUSE:
      return t("Guesthouse");
    case StayProductType.HOSTEL:
      return t("Hostel");
    case StayProductType.HOTEL:
      return t("Hotel");
    case StayProductType.RESORT:
      return t("Resort");

    default:
      return productType;
  }
};

export const getParkingSpotLabel = (parking: StaySearchParkingAvailabilities, t: TFunction) => {
  switch (parking) {
    case StaySearchParkingAvailabilities.STREET_PARKING:
      return t("Street parking");
    case StaySearchParkingAvailabilities.PRIVATE_PARKING:
      return t("Private parking");
    case StaySearchParkingAvailabilities.SECURED_PARKING:
      return t("Secured parking");
    case StaySearchParkingAvailabilities.PARKING_GARAGE:
      return t("Parking garage");
    case StaySearchParkingAvailabilities.FREE_PARKING:
      return t("Free parking");
    case StaySearchParkingAvailabilities.ACCESSIBLE_PARKING:
      return t("Accessible parking");
    case StaySearchParkingAvailabilities.PARKING_AVAILABLE:
      return t("Available");

    default:
      return parking;
  }
};

export const getBreakfastLabel = (breakfast: StaySearchBreakfastAvailabilities, t: TFunction) => {
  switch (breakfast) {
    case StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE:
      return t("available");
    case StaySearchBreakfastAvailabilities.BREAKFAST_AVAILABLE_FOR_FREE:
      return t("included");
    case StaySearchBreakfastAvailabilities.BREAKFAST_IN_THE_ROOM:
      return t("in the room");
    default:
      return "";
  }
};

export const getWifiLabel = (wifi: StaySearchWifiAvailabilities, t: TFunction) => {
  switch (wifi) {
    case StaySearchWifiAvailabilities.PAID_WIFI:
      return t("Paid");
    case StaySearchWifiAvailabilities.PORTABLE_WIFI:
    case StaySearchWifiAvailabilities.WIRELESS_INTERNET:
    case StaySearchWifiAvailabilities.WIFI_AVAILABLE:
      return t("Available");
    case StaySearchWifiAvailabilities.WIFI_AVAILABLE_FOR_FREE:
      return t("Free");
    default:
      return "";
  }
};

export const getCheckinOutLabel = (
  timeOfCheckin: string | undefined,
  timeOfCheckout: string | undefined,
  t: TFunction
) => {
  if (timeOfCheckin && timeOfCheckout) return t("Check-in & check-out");
  if (timeOfCheckin) return t("Check-in");
  if (timeOfCheckout) return t("Check-out");
  return "";
};

export const getCheckinOutValue = (
  timeOfCheckin: string | undefined,
  timeOfCheckout: string | undefined
) => {
  if (timeOfCheckin && timeOfCheckout)
    return `${removeSecondsFromTimeString(timeOfCheckin)} & ${removeSecondsFromTimeString(
      timeOfCheckout
    )}`;

  return removeSecondsFromTimeString(`${timeOfCheckin || timeOfCheckout}`);
};
