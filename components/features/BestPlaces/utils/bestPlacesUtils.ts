import { Fragment } from "react";
import memoizeOne from "memoize-one";

import { constructDisabledFilter } from "components/features/SearchPage/utils/searchUtils";
import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import { FilterQueryEnum, FilterType } from "types/enums";
import { constructImage } from "utils/globalUtils";
import { StartingLocationTypes } from "components/ui/Map/utils/mapUtils";

export const convertRawBestPlacesFilter = (rawFilter: BestPlacesTypes.RawFilter) => ({
  id: rawFilter.id.toString(),
  name: rawFilter.name,
  ...(rawFilter.latitude && { latitude: rawFilter.latitude }),
  ...(rawFilter.longitude && { longitude: rawFilter.longitude }),
});

export const convertRawBestPlacesFilters = (
  queryBestPlacesFilters: BestPlacesTypes.QueryBestPlacesFilters
): BestPlacesTypes.Filters => ({
  destinations: queryBestPlacesFilters.attractions.map(convertRawBestPlacesFilter) || [],
  attractions: queryBestPlacesFilters.attractionTypes.map(convertRawBestPlacesFilter) || [],
});

export const constructBestPlacesFilters = (
  defaultFilters?: BestPlacesTypes.Filters,
  filters?: BestPlacesTypes.Filters
) => {
  if (!defaultFilters)
    return {
      destinations: [],
      attractions: [],
    };
  if (!filters) return defaultFilters;

  return {
    destinations: constructDisabledFilter(defaultFilters.destinations, filters.destinations),
    attractions: constructDisabledFilter(defaultFilters.attractions, filters.attractions),
  };
};

export const constructBestPlacesFilterSections = (): FilterSectionListType =>
  [
    { key: FilterQueryEnum.DESTINATION_ID, type: FilterType.RADIO },
    { key: FilterQueryEnum.ATTRACTION_IDS, type: FilterType.CHECKBOX },
  ].map(filterQueryParam => ({
    sectionId: filterQueryParam.key,
    filters: [],
    title: filterQueryParam.key,
    Icon: Fragment,
    type: filterQueryParam.type,
  }));

export const constructBestPlaces = (queryBestPlaces: BestPlacesTypes.QueryBestPlace[]) => {
  return queryBestPlaces.map(queryBestPlace => ({
    id: queryBestPlace.id,
    image: constructImage(queryBestPlace.image),
    headline: queryBestPlace.name,
    address: queryBestPlace.location,
    description: queryBestPlace.excerptDescription,
    linkUrl: queryBestPlace.url,
    averageRating: Number(queryBestPlace.reviewTotalScore),
    reviewsCount: queryBestPlace.reviewTotalCount,
    nofollow: !queryBestPlace.hasTranslation,
  }));
};

export const normalizeBestPlacesCoverData = (
  queryBestPlacesPageHeader?: BestPlacesTypes.QueryBestPlacesPageHeader
) => {
  if (!queryBestPlacesPageHeader) {
    return {
      name: "",
      description: "",
      image: { id: "", url: "" },
    };
  }

  const {
    metadata: { title: name },
    header: { image },
  } = queryBestPlacesPageHeader;

  return {
    name,
    image: constructImage(image),
  };
};

export const normalizeDestinationName = (destinationName?: string) =>
  destinationName ? destinationName.split(",")[0] : "";

export const getDestnationFilterData = memoizeOne(
  (destinationId?: number, filters?: BestPlacesTypes.Filters) => {
    if (!destinationId || !filters) return {};

    const activeDestination = filters?.destinations.find(
      destinationItem => destinationItem.id === String(destinationId)
    );
    const activeDestinationLatitude = activeDestination?.latitude;
    const activeDestinationLongitude = activeDestination?.longitude;

    if (activeDestination && activeDestinationLatitude && activeDestinationLongitude) {
      const activeDestinationName = activeDestination.name;

      // eslint-disable-next-line consistent-return
      return {
        startingLocationName: activeDestinationName,
        latitude: activeDestinationLatitude,
        longitude: activeDestinationLongitude,
        startingLocationTypes: [StartingLocationTypes.LOCALITY],
      };
    }

    return {};
  }
);
