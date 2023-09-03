import { convertImage } from "utils/imageUtils";

const COUNTRY_MAP_DESKTOP_ZOOM = 6;

const COUNTRY_MAP_MOBILE_ZOOM = 5;

const CITY_MAP_ZOOM = 10;

const FALLBACK_COORDINATES = {
  latitude: 64.922772,
  longitude: -18.257224,
};

export enum StartingLocationTypes {
  COUNTRY = "COUNTRY",
  LOCALITY = "LOCALITY",
}

export const checkIsCountryMap = (types?: StartingLocationTypes[]) => {
  if (!types?.length) return true;

  return types.some(typeItem => typeItem === StartingLocationTypes.COUNTRY);
};
export const getMapZoom = (isCountryMap: boolean, isMobile: boolean) => {
  const countryMapZoom = isMobile ? COUNTRY_MAP_MOBILE_ZOOM : COUNTRY_MAP_DESKTOP_ZOOM;

  return isCountryMap ? countryMapZoom : CITY_MAP_ZOOM;
};

export const constructMapData = ({
  defaultCoords,
  searchAnyLocationString,
  startingLocationTypes,
  isMobile,
  frontBestPlacesMapImage,
  points = [],
}: {
  isMobile: boolean;
  defaultCoords?: {
    latitude: number;
    longitude: number;
  };
  searchAnyLocationString?: string;
  startingLocationTypes?: StartingLocationTypes[];
  frontBestPlacesMapImage?: QueryImage;
  points?: SharedTypes.MapPoint[];
}) => {
  const isCountryMap = checkIsCountryMap(startingLocationTypes);

  return {
    location: searchAnyLocationString || "",
    latitude: defaultCoords?.latitude ?? FALLBACK_COORDINATES.latitude,
    longitude: defaultCoords?.longitude ?? FALLBACK_COORDINATES.longitude,
    zoom: getMapZoom(isCountryMap, isMobile),
    isCountryMap,
    options: {
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    },
    points,
    ...(frontBestPlacesMapImage && {
      staticMapImage: convertImage(frontBestPlacesMapImage),
    }),
  };
};
