import { ProductNotificationType } from "./contexts/NotificationStateContext";

import TravelerIcon from "components/icons/traveler.svg";
import FlightIcon from "components/icons/flight-with-white.svg";
import HouseHeart from "components/icons/house-heart.svg";
import CarIcon from "components/icons/car-with-white.svg";
import RouteIcon from "components/icons/tour-route.svg";
import { Product } from "types/enums";

export const getIconByType = (productType: Product) => {
  switch (productType) {
    case Product.FLIGHT:
      return FlightIcon;
    case Product.CAR:
      return CarIcon;
    case Product.STAY:
      return HouseHeart;
    case Product.TOUR:
    case Product.GTETour:
      return TravelerIcon;
    case Product.VacationPackage:
      return RouteIcon;
    default:
      return undefined;
  }
};

export const pushNotificationQueue = (
  notifications: ProductNotificationType[],
  newNotification: ProductNotificationType
) => {
  return [...notifications, newNotification];
};

export const shiftNotificationQueue = (notifications: ProductNotificationType[]) => {
  return notifications.slice(1);
};
