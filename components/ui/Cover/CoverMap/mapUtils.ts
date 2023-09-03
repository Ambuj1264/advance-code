import { getGoogleMapDirectionPageUrl } from "./Google/mapUtils";
import { getBaiduMapDirectionPageUrl } from "./Baidu/mapUtils";

import { MapCardType, MapPointType, MAP_TYPE, Marketplace } from "types/enums";
import { getStaticDirPath } from "utils/globalUtils";

export const getMarkerIconByPointType = (pointType: MapPointType): string => {
  const iconPath = `${getStaticDirPath()}/icons/map`;

  switch (pointType) {
    case MapPointType.DAY_TOUR:
    case MapPointType.TOUR: {
      return `${iconPath}/tour-marker.png`;
    }

    case MapPointType.PACKAGE_TOUR:
    case MapPointType.SELF_DRIVE_TOUR: {
      return `${iconPath}/self-drive-tour-marker.png`;
    }

    case MapPointType.HOTEL: {
      return `${iconPath}/hotel-marker.png`;
    }

    case MapPointType.CAR: {
      return `${iconPath}/car-marker.png`;
    }

    case MapPointType.ATTRACTION: {
      return `${iconPath}/attraction-marker.png`;
    }

    // MapPointType.DESTINATION
    default: {
      return `${iconPath}/destination-marker.png`;
    }
  }
};

export const getMarkersByTypes = (
  markers: (GoogleMapTypes.MarkerWithData | BaiduMapTypes.MarkerWithData)[]
): MapTypes.MarkerWithDataByTypes => {
  const markersByType: MapTypes.MarkerWithDataByTypes = {};
  const markerTypes: { [key: string]: string } = { ...MapPointType };
  const markerTypesKey = Object.keys(markerTypes);

  markerTypesKey.forEach(markerType => {
    // eslint-disable-next-line functional/immutable-data
    markersByType[markerTypes[markerType as MapPointType]] = [];
  });

  markers.forEach(markerItem => {
    // eslint-disable-next-line functional/immutable-data
    if (markersByType[markerItem.pointData.type]) {
      markersByType[markerItem.pointData.type].push(markerItem);
    } else {
      markersByType[MapPointType.FALLBACK_POINT].push(markerItem);
    }
  });

  return markersByType;
};

export const getMapCardData = (
  data: MapTypes.MapCardInfoType,
  currentPointData: SharedTypes.MapPoint
): SharedTypes.MapPoint => {
  // eslint-disable-next-line no-underscore-dangle
  if (data?.__typename === MapCardType.ATTRACTION) {
    const attractionsMapCardData = data as MapTypes.MapCardAttractionsType;

    return {
      ...currentPointData,
      ...(attractionsMapCardData
        ? {
            title: attractionsMapCardData.name,
            image: attractionsMapCardData.image,
            url: attractionsMapCardData.url,
            isGoogleReview: attractionsMapCardData?.isGoogleReview,
            reviewTotalCount: attractionsMapCardData?.reviewTotalCount,
            reviewTotalScore: parseFloat(attractionsMapCardData?.reviewTotalScore),
          }
        : {}),
    };
  }

  const tourMapCardData = data as MapTypes.MapCardTourType;

  return {
    ...currentPointData,
    ...(tourMapCardData
      ? {
          title: tourMapCardData.name,
          image: tourMapCardData.image,
          url: tourMapCardData.front_url,
          isGoogleReview: false,
          reviewTotalCount: tourMapCardData?.review_count,
          reviewTotalScore: tourMapCardData?.review_score,
        }
      : {}),
  };
};

export const getMapDirectionsUrl = (map: SharedTypes.Map, mapType: MAP_TYPE) => {
  if (mapType === MAP_TYPE.GOOGLE) return getGoogleMapDirectionPageUrl({ coords: map });
  return getBaiduMapDirectionPageUrl(map);
};

export const constructMapCardQueryVariables = (
  mapPoint: SharedTypes.MapPoint,
  mapType: MAP_TYPE,
  marketplace: Marketplace
) => {
  const type =
    marketplace === Marketplace.GUIDE_TO_EUROPE && mapType === MAP_TYPE.GOOGLE
      ? mapPoint.type
      : mapPoint.orm_name;
  const isPostBooking = mapPoint.context?.bookingId != null;

  return {
    id: mapPoint.id,
    bookingId: mapPoint.context?.bookingId ?? -1,
    isAttraction: !isPostBooking && type === MapPointType.ATTRACTION,
    isTour: !isPostBooking && type === MapPointType.TOUR,
    isPostBooking,
  };
};
