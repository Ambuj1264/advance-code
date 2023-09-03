import { BestPlacesPage } from "types/enums";

const POINTS_LIMIT = 1000;

export const COUNTRY_MAP_RAIUS = 1000;
const CITY_MAP_RADIUS = 30;

export const getSearchRadius = (isCountryMap?: boolean) =>
  isCountryMap ? COUNTRY_MAP_RAIUS : CITY_MAP_RADIUS;

export const getNearByPointsLimits = (activeTab?: BestPlacesPage) => ({
  attractionsLimit: activeTab !== BestPlacesPage.DESTINATIONS ? POINTS_LIMIT : 0,
  destinationLimit: activeTab !== BestPlacesPage.ATTRACTIONS ? POINTS_LIMIT : 0,
});
