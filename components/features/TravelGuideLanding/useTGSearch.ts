import { useQuery } from "@apollo/react-hooks";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";
import { useEffect, useMemo } from "react";

import { constructMapData } from "../VacationPackageProductPage/utils/vacationPackageUtils";
import { constructDestinationsNearbyPoints } from "../TravelGuides/utils/travelGuideUtils";

import useTGSearchQueryParams from "./useTGSearchQueryParams";
import { constructTGLandingInput, constructTGSearchFilters } from "./TGLandingUtils/TGLandingUtils";

import { scrollSearchPageToTop } from "components/ui/Search/utils/sharedSearchUtils";
import { useIsDesktop } from "hooks/useMediaQueryCustom";
import TGDestinationsSearchQuery from "components/features/TravelGuides/queries/TGDestinationsSearchQuery.graphql";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const mapSortingToValue = (orderByValue?: string) => {
  if (orderByValue === "rating") return "TOP_RATED";
  return "MOST_POPLUAR";
};

export const useTGSearch = ({
  countryCode,
  type,
  countryName,
  skip,
}: {
  countryCode?: string;
  type?: string;
  countryName?: string;
  skip: boolean;
}) => {
  const isDesktop = useIsDesktop();
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  const [{ page = 1, cityIds: filterCityIds, countryIds, orderBy }] = useTGSearchQueryParams();
  const sortValue = mapSortingToValue(orderBy);
  const { countryCodes, cityIds } = useMemo(
    () => constructTGLandingInput(countryIds, filterCityIds),
    [countryIds, filterCityIds]
  );
  const input = useMemo(() => {
    return {
      cityId: 0,
      countryCode,
      countryCodes,
      cityIds,
      order: sortValue,
      page,
    };
  }, [cityIds, countryCode, countryCodes, page, sortValue]);

  const { data, loading } = useQuery<TravelGuideTypes.TGDestinationsSearchQueryResult>(
    TGDestinationsSearchQuery,
    {
      variables: {
        input,
      },
      skip,
    }
  );
  const destinations = data?.travelGuidesDestinations.destinations;
  const queryFilters = data?.travelGuidesDestinations.filters;
  const totalPages = data?.travelGuidesDestinations.totalPages;
  const mapData =
    destinations && destinations.length > 0
      ? constructMapData(
          destinations[0].location?.latitude || 10,
          destinations[0].location?.longitude || 10,
          destinations[0].name,
          constructDestinationsNearbyPoints(destinations)
        )
      : undefined;
  const filters = constructTGSearchFilters(queryFilters, travelGuidesT, type, countryName);
  const prevSearchDestinations = usePreviousState(destinations);
  const onTotalSearchDestinationsChange =
    prevSearchDestinations !== undefined &&
    prevSearchDestinations.length > 0 &&
    destinations !== prevSearchDestinations;

  useEffect(() => {
    if (!isDesktop && loading) {
      scrollSearchPageToTop({ behavior: "auto" });
    }
    if (onTotalSearchDestinationsChange && !loading) {
      scrollSearchPageToTop();
    }
  }, [onTotalSearchDestinationsChange, loading, isDesktop]);

  return {
    data,
    destinations,
    loading,
    mapData,
    filters,
    totalPages,
    page,
  };
};
