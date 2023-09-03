import { StaySearchGTEValueProp } from "../types/staysSearchEnums";

import {
  getCheckinOutLabel,
  getCheckinOutValue,
  getParkingSpotLabel,
  getProductTypeLabel,
  getWifiLabel,
} from "./staySearchLabelUtils";

import InstantConfirmation from "components/icons/tags-check.svg";
import PhoneSupport from "components/icons/phone-support.svg";
import Cancellation from "components/icons/file-text-remove.svg";
import Star from "components/icons/star.svg";
import Gps from "components/icons/gps.svg";
import Clock from "components/icons/clock.svg";
import Parking from "components/icons/discount-parking.svg";
import Breakfast from "components/icons/breakfast.svg";
import Wifi from "components/icons/wifi-check.svg";
import { StayProductType } from "types/enums";

// 1. Cancellation (Free or conditional)
// 2. 24/7 customer support
// 3. Instant confirmation.
const valuePropsOrder: { [key in StaySearchGTEValueProp]: number } = {
  [StaySearchGTEValueProp.CANCELLATION_FREE]: 1,
  [StaySearchGTEValueProp.CANCELLATION_CONDITIONAL]: 2,
  [StaySearchGTEValueProp.SUPPORT24_HOURS]: 3,
  [StaySearchGTEValueProp.INSTANT_CONFIRMATION]: 4,
};

const constructValueProp = (
  valueProp: StaySearchGTEValueProp,
  t: TFunction
): SharedTypes.ProductProp | undefined => {
  switch (valueProp) {
    case StaySearchGTEValueProp.CANCELLATION_CONDITIONAL:
      return {
        Icon: Cancellation,
        title: t("Conditional cancellation"),
      };

    case StaySearchGTEValueProp.CANCELLATION_FREE:
      return {
        Icon: Cancellation,
        title: t("Free cancellation"),
      };

    case StaySearchGTEValueProp.INSTANT_CONFIRMATION:
      return {
        Icon: InstantConfirmation,
        title: t("Instant confirmation"),
      };

    case StaySearchGTEValueProp.SUPPORT24_HOURS:
      return {
        Icon: PhoneSupport,
        title: t("24/7 customer support"),
      };

    default:
      return undefined;
  }
};

export const constructStaySearchGTEProductProps = (
  t: TFunction,
  valueProps?: StaySearchGTEValueProp[]
): SharedTypes.ProductProp[] => {
  if (!valueProps || valueProps.length === 0) return [] as SharedTypes.ProductProp[];

  valueProps.sort((prop1, prop2) => valuePropsOrder[prop1] - valuePropsOrder[prop2]);

  return valueProps
    .map(prop => constructValueProp(prop, t))
    .filter(Boolean) as SharedTypes.ProductProp[];
};

export const constructStaySearchGTEProductSpecs = (
  t: TFunction,
  quickfacts?: StaysSearchTypes.StaysSearchQueryGTEQuickfact
): SharedTypes.ProductSpec[] => {
  const {
    hotelStarRating,
    distanceFromCityCenter,
    timeOfCheckOut,
    timeOfCheckIn,
    productType,
    parking,
    breakfast,
    wirelessInternet,
  } = quickfacts || {};
  return [
    productType === StayProductType.HOTEL && hotelStarRating
      ? {
          Icon: Star,
          name: t("Category"),
          value: t("{starClass} star hotel", { starClass: hotelStarRating }),
        }
      : undefined,
    productType && productType !== StayProductType.HOTEL
      ? {
          Icon: Star,
          name: t("Category"),
          value: getProductTypeLabel(productType, t),
        }
      : undefined,
    distanceFromCityCenter
      ? {
          Icon: Gps,
          name: t("Location"),
          value: t("{distanceFromCenter} km from centre", {
            distanceFromCenter: distanceFromCityCenter,
          }),
        }
      : undefined,
    timeOfCheckIn || timeOfCheckOut
      ? {
          Icon: Clock,
          name: getCheckinOutLabel(timeOfCheckIn, timeOfCheckOut, t),
          value: getCheckinOutValue(timeOfCheckIn, timeOfCheckOut),
        }
      : undefined,
    parking
      ? {
          Icon: Parking,
          name: t("Parking"),
          value: getParkingSpotLabel(parking, t),
        }
      : undefined,
    breakfast
      ? {
          Icon: Breakfast,
          name: t("Breakfast"),
          value: t("Available"),
        }
      : undefined,
    wirelessInternet
      ? {
          Icon: Wifi,
          name: t("Wifi"),
          value: getWifiLabel(wirelessInternet, t),
        }
      : undefined,
  ].filter(Boolean) as SharedTypes.ProductSpec[];
};
