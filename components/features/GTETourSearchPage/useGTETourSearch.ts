import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import GTETourSearchQuery from "./queries/GTETourSearchQuery.graphql";
import {
  constructTourSearchQueryVariables,
  constructGTETourSearchResults,
  constructTourSearchFilters,
  getTourSelectedFilters,
  getGTETourQueryParams,
} from "./utils/gteTourSearchUtils";

import useTourSearchParams from "components/features/SearchPage/useTourSearchQueryParams";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useCurrencyWithDefault } from "hooks/useCurrency";

export const useGTETourSearchQuery = () => {
  const { t: tourT } = useTranslation(Namespaces.tourNs);
  const [queryParams, setQueryParams] = useTourSearchParams();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    adults,
    children,
    childrenAges,
    dateFrom,
    dateTo,
    startingLocationId,
    startingLocationName,
    requestId,
  } = queryParams;

  const { data: queryData, loading: queryLoading } = useQuery<{
    gteTourSearch: GTETourSearchTypes.QueryTourData;
  }>(GTETourSearchQuery, {
    variables: constructTourSearchQueryVariables({ queryParams }),
  });

  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        adults,
        children,
        childrenAges,
        dateFrom,
        dateTo,
        startingLocationId,
        startingLocationName,
      },
      QueryParamTypes.PUSH
    );
  }, [
    adults,
    children,
    childrenAges,
    dateFrom,
    dateTo,
    startingLocationId,
    startingLocationName,
    setQueryParams,
  ]);
  const tourQueryParams = getGTETourQueryParams(
    adults,
    children,
    childrenAges,
    dateFrom,
    requestId
  );
  const tourResults = queryData
    ? constructGTETourSearchResults(queryData.gteTourSearch.nodes, tourT, tourQueryParams)
    : [];
  const filters = constructTourSearchFilters(queryData?.gteTourSearch?.filters);
  const totalTours = queryData?.gteTourSearch?.totalCount ?? 0;
  const pageInfo = queryData?.gteTourSearch?.pageInfo;
  const totalPages = totalTours > 0 ? Math.ceil(totalTours / 24) : 1;
  const numberOfTravellers = (queryParams?.adults ?? 0) + (queryParams?.children ?? 0);

  const selectedFilters = useMemo(
    () =>
      getTourSelectedFilters({
        queryParams,
        filters,
        currencyCode,
        convertCurrency,
      }),
    [queryParams, filters, currencyCode]
  );
  return {
    totalPages,
    totalTours,
    numberOfTravellers,
    tourResults,
    isLoading: queryLoading,
    filters,
    onClearFilters,
    pageInfo,
    selectedFilters,
  };
};
