import { encode } from "@googlemaps/polyline-codec";
import memoizeOne from "memoize-one";

import { DEFAULT_STREETVIEW_RADIUS, DEFAULT_ZOOM, OUTER_CIRCLE } from "../mapConstants";

import { mapStaticStyles } from "./mapStyles";

import { isBrowser } from "utils/helperUtils";
import { mapboxAccessToken } from "utils/constants";

const CIRCLE_DETAILS = 8;

export const getHexColor = (color: string, opacity?: number) => {
  const hexColor = color.replace("#", "0x");
  if (opacity === undefined) {
    return hexColor;
  }
  const opacityInt = Math.round(opacity * 255);
  const opacityHex = opacityInt.toString(16);
  const opacityHexFormatted = opacityHex.length === 1 ? `0${opacityHex}` : opacityHex;

  return `${hexColor.slice(0, 8)}${opacityHexFormatted}`;
};

export type Point = [number, number];

export const pointsToString = (points: Point[]) => {
  return points.map(point => `${point[0].toFixed(3)},${point[1].toFixed(3)}`).join("|");
};

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const getCircleCoordinates = (
  latitude: number,
  longitude: number,
  radius: number,
  detail = 8
): Point[] => {
  const EARTH_RADIUS_IN_METERS = 6371000;
  const latitudeInRadians = toRadians(latitude);
  const longitudeInRadians = toRadians(longitude);
  const distanceInRadians = radius / EARTH_RADIUS_IN_METERS;

  const points: Point[] = [];
  for (let degree = 0; degree <= 360; degree += detail) {
    const degreeInRadians = toRadians(degree);

    const pointLatitude = Math.asin(
      Math.sin(latitudeInRadians) * Math.cos(distanceInRadians) +
        Math.cos(latitudeInRadians) * Math.sin(distanceInRadians) * Math.cos(degreeInRadians)
    );

    const pointLongitude =
      longitudeInRadians +
      Math.atan2(
        Math.sin(degreeInRadians) * Math.sin(distanceInRadians) * Math.cos(latitudeInRadians),
        Math.cos(distanceInRadians) - Math.sin(latitudeInRadians) * Math.sin(pointLatitude)
      );

    // eslint-disable-next-line functional/immutable-data
    points.push([toDegrees(pointLatitude), toDegrees(pointLongitude)]);
  }

  return points;
};

export const getStaticCirclePath = ({
  latitude,
  longitude,
  radius,
  details,
  fillColor,
  fillOpacity,
}: {
  latitude: number;
  longitude: number;
  radius: number;
  details: number;
  fillColor: string;
  fillOpacity?: number;
}) => {
  const circlePoints = getCircleCoordinates(latitude, longitude, radius, details);
  const circlePointsString = pointsToString(circlePoints);
  const circlePath = `fillcolor:${getHexColor(
    fillColor,
    fillOpacity
  )}|weight:0|${circlePointsString}`;

  return encodeURIComponent(circlePath);
};

export const getStaticMapUrl = (map: SharedTypes.Map, googleApiKey: string) => {
  const outerCirclePath = getStaticCirclePath({
    latitude: map.latitude,
    longitude: map.longitude,
    radius: OUTER_CIRCLE.radius,
    details: CIRCLE_DETAILS,
    fillColor: OUTER_CIRCLE.fillColor,
    fillOpacity: OUTER_CIRCLE.fillOpacity,
  });

  // static map image has restriction in size
  // we have to stretch the cover image with CSS which affects the zoom.
  // so zoom is less accurate compare to map from JS API
  const compensatedStaticMapZoom = (map.zoom || DEFAULT_ZOOM) - 1;
  return `https://maps.googleapis.com/maps/api/staticmap?zoom=${compensatedStaticMapZoom}&size=1392x430&scale=2&key=${googleApiKey}&path=${outerCirclePath}`;
};

export const getMapboxStaticMapUrl = (
  map: SharedTypes.Map,
  isMobile: boolean,
  width = 448,
  height = 312
) => {
  const baseUrl = "https://api.mapbox.com/styles/v1/sigurdurgudbr/cl8cymrbv003614pqvug4e093";

  const imgWidth = isBrowser && isMobile ? window.innerWidth : width;
  const circlePoints = getCircleCoordinates(
    map.latitude,
    map.longitude,
    OUTER_CIRCLE.radius,
    CIRCLE_DETAILS
  );
  const polyline = encodeURIComponent(encode(circlePoints));
  const points =
    map.points?.map(point => `pin-s+2f7ddd(${point.longitude},${point.latitude})`).join(",") || "";

  return `${baseUrl}/static/${points},path-0(${polyline})/auto/${
    imgWidth > 1280 ? 1280 : imgWidth
  }x${height}@2x?access_token=${mapboxAccessToken}`;
};

export const getMapDataWithMapboxStaticImage = memoizeOne(
  (
    isMobile: boolean,
    mapData?: SharedTypes.Map,
    coverMapWidth?: number,
    coverMapHeight?: number
  ) => {
    if (!mapData)
      return {
        coverMapData: undefined,
        contentMapData: undefined,
      };

    return {
      coverMapData: {
        ...mapData,
        staticMapImage: {
          id: "mapImage",
          url: getMapboxStaticMapUrl(mapData, isMobile, coverMapWidth, coverMapHeight),
        },
      },
      contentMapData: {
        ...mapData,
        staticMapImage: {
          id: "mapImage",
          url: getMapboxStaticMapUrl(mapData, isMobile),
        },
      },
    };
  }
);

export const getStaticStyledMapUrl = (map: SharedTypes.Map, googleApiKey: string) => {
  return `${getStaticMapUrl(map, googleApiKey)}&style=${mapStaticStyles}`;
};

export const getEmbeddedStreetViewUrl = (
  map: Pick<SharedTypes.Map, "latitude" | "longitude">,
  googleApiKey: string,
  isOutdoorLocation = false
) =>
  `//www.google.com/maps/embed/v1/streetview?key=${googleApiKey}&location=${encodeURIComponent(
    `${map.latitude},${map.longitude}`
  )}${isOutdoorLocation ? "&source=outdoor" : ""}`;

export const getGoogleEmbeddedPlaceUrl = (
  destination: Pick<SharedTypes.Map, "latitude" | "longitude">,
  googleApiKey: string,
  googlePlaceId?: string
) => {
  const queryString = googlePlaceId
    ? `place_id:${googlePlaceId}`
    : encodeURIComponent(`${destination.latitude},${destination.longitude}`);
  return `//www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${queryString}`;
};

export const getGoogleMapDirectionPageUrl = ({
  coords,
  googlePlaceId,
  travelMode,
}: {
  coords: Pick<SharedTypes.Map, "latitude" | "longitude">;
  googlePlaceId?: string;
  travelMode?: "driving" | "walking" | "transit";
}) => {
  const travelModeQuery = travelMode ? `&travelmode=${travelMode}` : "";
  const destinationPlaceIdQuery = googlePlaceId ? `&destination_place_id=${googlePlaceId}` : "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${coords.latitude},${coords.longitude}`
  )}${destinationPlaceIdQuery}${travelModeQuery}`;
};

export const getGoogleMapStreetViewPageUrl = (map: SharedTypes.Map) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(
    `${map.latitude},${map.longitude}`
  )}`;

export const getCoverMapImage = (map: SharedTypes.Map, googleApiKey: string) =>
  ({
    ...map.staticMapImage,
    url: map.staticMapImage?.url ?? getStaticStyledMapUrl(map, googleApiKey),
  } as Image);

export const getStreetViewDataForPoint = (
  googleStreetView: google.maps.StreetViewService | undefined,
  point: SharedTypes.MapPoint
): Promise<{
  data: google.maps.StreetViewPanoramaData;
  status: google.maps.StreetViewStatus;
}> => {
  return new Promise(resolve => {
    googleStreetView?.getPanoramaByLocation(
      {
        lat: point.latitude,
        lng: point.longitude,
      },
      DEFAULT_STREETVIEW_RADIUS,
      (data, status) => {
        resolve({ data, status });
      }
    );
  });
};
