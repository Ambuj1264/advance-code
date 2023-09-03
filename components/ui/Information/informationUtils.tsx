import IconLoading from "../utils/IconLoading";
import { InformationIcon } from "../utils/informationIcon";

import CustomNextDynamic from "lib/CustomNextDynamic";

const TourEndsIcon = CustomNextDynamic(() => import("components/icons/pick-up.svg"), {
  loading: IconLoading,
});
const CombinationDetailsIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});
const BreakfastIcon = CustomNextDynamic(() => import("components/icons/breakfast.svg"), {
  loading: IconLoading,
});
const AccommodationIcon = CustomNextDynamic(() => import("components/icons/accommodation.svg"), {
  loading: IconLoading,
});
const ClockIcon = CustomNextDynamic(() => import("components/icons/clock.svg"), {
  loading: IconLoading,
});
const ParkingIcon = CustomNextDynamic(() => import("components/icons/discount-parking.svg"), {
  loading: IconLoading,
});
const RoomIcon = CustomNextDynamic(() => import("components/icons/bedroom.svg"), {
  loading: IconLoading,
});
const LocationIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});
const MinimumAgeIcon = CustomNextDynamic(() => import("components/icons/minAge.svg"), {
  loading: IconLoading,
});
const CalendarIcon = CustomNextDynamic(() => import("components/icons/calendar-empty.svg"), {
  loading: IconLoading,
});
const LanguageIcon = CustomNextDynamic(() => import("components/icons/language.svg"), {
  loading: IconLoading,
});
const DurationIcon = CustomNextDynamic(() => import("components/icons/duration.svg"), {
  loading: IconLoading,
});
const DifficultyEasyIcon = CustomNextDynamic(() => import("components/icons/difficulty-easy.svg"), {
  loading: IconLoading,
});
const DifficultyMediumIcon = CustomNextDynamic(
  () => import("components/icons/difficulty-medium.svg"),
  {
    loading: IconLoading,
  }
);
const DifficultyHardIcon = CustomNextDynamic(() => import("components/icons/difficulty-hard.svg"), {
  loading: IconLoading,
});
const TourStartsIcon = CustomNextDynamic(() => import("components/icons/guide.svg"), {
  loading: IconLoading,
});
const TravellersIcon = CustomNextDynamic(() => import("components/icons/travellers.svg"), {
  loading: IconLoading,
});
const WifiIcon = CustomNextDynamic(() => import("components/icons/wifi-check.svg"), {
  loading: IconLoading,
});
const TourEndIcon = CustomNextDynamic(() => import("components/icons/tour-end.svg"), {
  loading: IconLoading,
});

export enum ProductSpecId {
  TourStarts = "tourStarts",
  Duration = "duration",
  GuidedLanguage = "guidedLanguage",
  DifficultyEasy = "difficultyEasy",
  DifficultyModerate = "difficultyModerate",
  DifficultyDemanding = "difficultyDemanding",
  Availability = "availability",
  CombinationDetails = "combinationDetails",
  EndingTime = "endingTime",
  MinAge = "minAge",
  HotelCategory = "hotelCategory",
  HotelLocation = "hotelLocation",
  HotelBreakfast = "hotelBreakfast",
  HotelParking = "hotelParking",
  HotelCheckInOut = "hotelCheckInOut",
  HotelWifi = "hotelWifi",
  HotelSleeps = "hotelSleeps",
  HotelRoom = "hotelRoom",
  EndingPlace = "endingPlace",
  TourStartingTime = "tourStartingTime",
}

export const getIcon = (iconId: string) => {
  switch (iconId) {
    case ProductSpecId.TourStarts:
      return TourStartsIcon;
    case ProductSpecId.Duration:
      return DurationIcon;
    case ProductSpecId.GuidedLanguage:
      return LanguageIcon;
    case ProductSpecId.DifficultyEasy:
      return DifficultyEasyIcon;
    case ProductSpecId.DifficultyModerate:
      return DifficultyMediumIcon;
    case ProductSpecId.DifficultyDemanding:
      return DifficultyHardIcon;
    case ProductSpecId.Availability:
      return CalendarIcon;
    case ProductSpecId.CombinationDetails:
      return CombinationDetailsIcon;
    case ProductSpecId.EndingTime:
      return TourEndsIcon;
    case ProductSpecId.MinAge:
      return MinimumAgeIcon;
    case ProductSpecId.HotelBreakfast:
      return BreakfastIcon;
    case ProductSpecId.HotelLocation:
      return LocationIcon;
    case ProductSpecId.HotelCategory:
      return AccommodationIcon;
    case ProductSpecId.HotelWifi:
      return WifiIcon;
    case ProductSpecId.HotelSleeps:
      return TravellersIcon;
    case ProductSpecId.HotelCheckInOut:
    case ProductSpecId.TourStartingTime:
      return ClockIcon;
    case ProductSpecId.HotelParking:
      return ParkingIcon;
    case ProductSpecId.HotelRoom:
      return RoomIcon;
    case ProductSpecId.EndingPlace:
      return TourEndIcon;
    default:
      return InformationIcon;
  }
};
export const constructProductSpecs = (queryProductSpecs: SharedTypes.QueryProductSpec[]) =>
  queryProductSpecs.map((spec: SharedTypes.QueryProductSpec) => ({
    Icon: getIcon(spec.iconId),
    name: spec.name,
    value: spec.value,
  }));
