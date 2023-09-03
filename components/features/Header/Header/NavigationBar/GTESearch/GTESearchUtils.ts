import { getFlagIcon } from "@travelshift/ui/utils/flagUtils";

import IconLoading from "components/ui/utils/IconLoading";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { GraphCMSPageType, GTESearchCategories, GraphCMSPageVariation } from "types/enums";
import {
  lightBlueColor,
  carColor,
  attractionColor,
  gteSearchVacationPackagesColor,
  gteSearchFlightColor,
  gteSearchStaysColor,
  gteSearchToursColor,
  gteSearchRestaurantColor,
} from "styles/variables";

const CarIcon = CustomNextDynamic(() => import("components/icons/car.svg"), {
  loading: IconLoading,
});

const TourIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});

const StaysIcon = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});

const PackagesIcon = CustomNextDynamic(() => import("components/icons/distance.svg"), {
  loading: IconLoading,
});

const FlightIcon = CustomNextDynamic(() => import("components/icons/plane-1.svg"), {
  loading: IconLoading,
});

const RestaurantIcon = CustomNextDynamic(
  () => import("components/icons/restaurant-fork-knife.svg"),
  {
    loading: IconLoading,
  }
);

const LocationIcon = CustomNextDynamic(() => import("components/icons/location.svg"), {
  loading: IconLoading,
});

const InformationIcon = CustomNextDynamic(() => import("components/icons/information-circle.svg"), {
  loading: IconLoading,
});

const CameraIcon = CustomNextDynamic(() => import("components/icons/camera-1.svg"), {
  loading: IconLoading,
});

const SearchIcon = CustomNextDynamic(() => import("components/icons/search.svg"), {
  loading: IconLoading,
});

const GuideToEuropeFlag = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});

const checkForFlagIcon = (localeCode: string) => {
  const flagIcon = getFlagIcon(localeCode);
  return flagIcon === undefined ? GuideToEuropeFlag : flagIcon;
};

export const getIconAndCategoryLabel = (pageType: string | null, countryCode: string | null) => {
  // eslint-disable-next-line no-unneeded-ternary
  const localeCode = countryCode ? countryCode : "EU";
  switch (pageType) {
    case GraphCMSPageType.FrontPage:
      return {
        color: lightBlueColor,
        category: GTESearchCategories.FRONT_PAGE,
        icon: getFlagIcon("EU"),
      };
    case GraphCMSPageType.CountryPage:
      return {
        color: lightBlueColor,
        category: GTESearchCategories.COUNTRY_PAGE,
        icon: checkForFlagIcon(localeCode),
      };
    case "CityPage":
      return {
        color: lightBlueColor,
        category: GTESearchCategories.DESTINATIONS,
        icon: getFlagIcon(localeCode),
      };
    case GraphCMSPageType.VacationPackages:
    case GraphCMSPageType.VpProductPage:
      return {
        color: gteSearchVacationPackagesColor,
        category: GTESearchCategories.VACATIONS,
        icon: PackagesIcon,
      };
    case GraphCMSPageType.Flights:
      return {
        color: gteSearchFlightColor,
        category: GTESearchCategories.FLIGHTS,
        icon: FlightIcon,
      };
    case GraphCMSPageType.Stays:
    case GraphCMSPageVariation.staysProductPage:
      return {
        color: gteSearchStaysColor,
        category: GTESearchCategories.STAYS,
        icon: StaysIcon,
      };
    case GraphCMSPageType.Cars:
      return {
        color: carColor,
        category: GTESearchCategories.CARS,
        icon: CarIcon,
      };
    case GraphCMSPageType.Tours:
    case GraphCMSPageType.TourProductPage:
      return {
        color: gteSearchToursColor,
        category: GTESearchCategories.EXPERIENCES,
        icon: TourIcon,
      };
    case "Restaurants":
      return {
        color: gteSearchRestaurantColor,
        category: GTESearchCategories.RESTAURANTS,
        icon: RestaurantIcon,
      };
    case GraphCMSPageType.Destinations:
      return {
        color: lightBlueColor,
        category: GTESearchCategories.DESTINATIONS,
        icon: LocationIcon,
      };
    case GraphCMSPageType.Attractions:
      return {
        color: attractionColor,
        category: GTESearchCategories.ATTRACTIONS,
        icon: CameraIcon,
      };
    case GraphCMSPageType.Information:
      return {
        color: lightBlueColor,
        category: GTESearchCategories.INFORMATION,
        icon: InformationIcon,
      };
    default:
      return {
        color: lightBlueColor,
        category: GTESearchCategories.SEARCH,
        icon: SearchIcon,
      };
  }
};

export const checkIfFlag = (pageType: string | null) => {
  return (
    pageType === GraphCMSPageType.CountryPage ||
    pageType === "CityPage" ||
    pageType === GraphCMSPageType.FrontPage
  );
};
