import React from "react";
import { useQuery } from "@apollo/react-hooks";

import BestPlacesSearchQuery from "./queries/BestPlacesSearchQuery.graphql";
import BestPlacesContainer from "./BestPlacesContainer";
import {
  constructBestPlacesFilters,
  convertRawBestPlacesFilters,
  getDestnationFilterData,
} from "./utils/bestPlacesUtils";
import { getNearByPointsLimits, getSearchRadius } from "./utils/bestPlacesMapUtils";
import { useBestPlacesContext } from "./BestPlacesStateContext";
import useBestPlacesQueryParams from "./useBestPlacesQueryParams";
import GetNearByPoints from "./queries/GetNearbyPoints.graphql";

import useTimeToLiveUUID from "hooks/useTimeToLiveUUID";
import SpecificPlaceQuery from "hooks/queries/SpecificPlaceQuery.graphql";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import {
  checkIsCountryMap,
  constructMapData,
  StartingLocationTypes,
} from "components/ui/Map/utils/mapUtils";

export type BestPlacesSearchContainerProps = {
  isAttractionsPage: boolean;
  page?: number;
  attractionIds?: number[];
  orderBy?: string;
  lat?: number;
  lng?: number;
  startingLocationTypes?: StartingLocationTypes[];
  startingLocationId?: string;
  startingLocationName?: string;
  destinationId?: number;
};

const BestPlacesSearchContainer = ({
  landingData,
}: {
  landingData?: BestPlacesTypes.QueryBestPlacesLandingPage;
} & BestPlacesSearchContainerProps) => {
  const UUID = useTimeToLiveUUID({ timeToLiveInMs: 60000 });
  const isMobile = useIsMobile();

  const [
    {
      page,
      orderBy,
      activeTab,
      attractionIds: attractionTypeIds,
      lat: latitude,
      lng: longitude,
      startingLocationTypes,
      startingLocationId: selectedLocationId,
      startingLocationName: selectedLocationName,
      destinationId,
    },
  ] = useBestPlacesQueryParams();
  const { locationPlaceholder } = useBestPlacesContext();

  const settings = landingData?.settings || {
    latitude: undefined,
    longitude: undefined,
    searchAnyLocationString: undefined,
    frontBestPlacesMapImage: undefined,
    frontBestPlacesPageHeader: undefined,
  };

  const {
    data: {
      place: {
        name: placeName,
        location: { lat: placeLat, lng: placeLng },
      },
    } = { place: { location: {} } },
  } = useQuery<{
    place: SharedTypes.Place;
  }>(SpecificPlaceQuery, {
    skip: !selectedLocationId || Boolean(destinationId),
    variables: { placeId: selectedLocationId, sessionToken: UUID },
  });
  const specificPlaceLocationTypes = placeName && [StartingLocationTypes.LOCALITY];

  const convertedFiltersData =
    landingData && convertRawBestPlacesFilters(landingData.frontAttractionFilters);
  const filters = convertedFiltersData && constructBestPlacesFilters(convertedFiltersData);

  const activeDestination = getDestnationFilterData(destinationId, filters);

  const computedLatitude = activeDestination.latitude || placeLat || latitude || settings.latitude;
  const computedLongitude =
    activeDestination.longitude || placeLng || longitude || settings.longitude;
  const computedStartingLocationTypes =
    activeDestination.startingLocationTypes || specificPlaceLocationTypes || startingLocationTypes;
  const computedLocationPlaceholder =
    activeDestination.startingLocationName ||
    selectedLocationName ||
    placeName ||
    locationPlaceholder;

  const { data: { getNearbyPoints } = {} } = useQuery<{
    getNearbyPoints: SharedTypes.MapPoint[];
  }>(GetNearByPoints, {
    variables: {
      destinationId,
      latitude: computedLatitude,
      longitude: computedLongitude,
      radius: getSearchRadius(checkIsCountryMap(computedStartingLocationTypes)),
      attractionTypeIds,
      ...getNearByPointsLimits(activeTab),
    },
  });

  const mapData = constructMapData({
    defaultCoords:
      computedLatitude || computedLongitude
        ? {
            latitude: computedLatitude!,
            longitude: computedLongitude!,
          }
        : undefined,
    searchAnyLocationString: computedLocationPlaceholder,
    frontBestPlacesMapImage: settings.frontBestPlacesMapImage,
    startingLocationTypes: computedStartingLocationTypes,
    isMobile,
    points: getNearbyPoints,
  });

  const {
    error: searchError,
    data: searchData,
    loading: searchDataLoading,
  } = useQuery<BestPlacesTypes.QueryBestPlacesSearch>(BestPlacesSearchQuery, {
    variables: {
      type: activeTab,
      page,
      attractionTypeIds,
      radius: getSearchRadius(mapData.isCountryMap),
      sortBy: orderBy,
      ...(computedLatitude !== settings.latitude ? { centerLatitude: computedLatitude } : {}),
      ...(computedLongitude !== settings.longitude ? { centerLongitude: computedLongitude } : {}),
    },
  });

  if (searchError) {
    return null;
  }

  if (!landingData || !searchData) {
    return (
      <BestPlacesContainer locationPlaceholder={computedLocationPlaceholder!} mapData={mapData} />
    );
  }

  const bestPlacesMetadata = {
    ...searchData.searchAttractions.metadata,
    ...(activeTab === undefined
      ? { ...landingData.settings.frontBestPlacesPageHeader.metadata }
      : {}),
  };
  return (
    <BestPlacesContainer
      locationPlaceholder={computedLocationPlaceholder!}
      defaultFilters={filters}
      bestPlaces={searchData.searchAttractions.attractions}
      bestPlacesMetadata={bestPlacesMetadata}
      bestPlacesLoading={searchDataLoading}
      pageHeaderData={settings.frontBestPlacesPageHeader}
      mapData={mapData}
    />
  );
};

export default BestPlacesSearchContainer;
