import { useRef, useCallback } from "react";
import { useRouter } from "next/router";

import {
  constructFlightItineraries,
  constructFlightSearchFilters,
  getFlightDatesInFuture,
  getFlightSearchQueryVariables,
} from "./utils/flightSearchUtils";
import useFlightSearchQueryParams, { FlightOrderBy } from "./utils/useFlightSearchQueryParams";
import FlightSearchQuery from "./queries/FlightSearchQuery.graphql";

import { scrollSearchPageToTop } from "components/ui/Search/utils/sharedSearchUtils";
import useToggle from "hooks/useToggle";
import useEffectOnce from "hooks/useEffectOnce";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { noCacheHeaders } from "utils/apiUtils";
import { getTotalPages } from "utils/helperUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import useQueryClient from "hooks/useQueryClient";

const useFlightSearch = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation(Namespaces.flightNs);
  const currentSearchIdRef = useRef<string | null>(null);
  const updateSearchId = (newSearchId: string | null) => {
    currentSearchIdRef.current = newSearchId;
  };
  const [
    {
      originId,
      originName,
      destinationId,
      destinationName,
      dateFrom,
      dateTo,
      returnDateTo,
      returnDateFrom,
      adults = 1,
      children = 0,
      infants = 0,
      cabinType,
      flightType,
      price = [undefined, undefined],
      duration = [undefined, undefined],
      stopover = [undefined, undefined],
      orderBy = FlightOrderBy.BEST,
      page = 1,
      maxStops,
      cartItemId,
    },
    setQueryParams,
  ] = useFlightSearchQueryParams();
  const { fromDate, toDate, returnFromDate, returnToDate } = getFlightDatesInFuture(
    dateFrom,
    dateTo,
    returnDateFrom,
    returnDateTo
  );
  const variables = getFlightSearchQueryVariables({
    originId,
    destinationId,
    adults,
    children,
    infants,
    cabinType,
    flightType,
    priceFrom: price[0] !== undefined ? Number(price[0]) : undefined,
    priceTo: price[1] !== undefined ? Number(price[1]) : undefined,
    durationFromSec: duration[0] ? Number(duration[0]) : undefined,
    durationToSec: duration[1] ? Number(duration[1]) : undefined,
    layoverLengthFromSec: stopover[0] ? Number(stopover[0]) : undefined,
    layoverLengthToSec: stopover[1] ? Number(stopover[1]) : undefined,
    searchId: currentSearchIdRef?.current,
    departureDateFrom: fromDate,
    returnDateFrom: returnFromDate,
    orderBy,
    offset: (page - 1) * PRODUCT_SEARCH_RESULT_LIMIT,
    departureTo: toDate,
    returnTo: returnToDate,
    maxNumberOfStops: maxStops === "any" ? undefined : Number(maxStops),
  });

  const [isBrowser, setIsBrowser] = useToggle(false);

  useEffectOnce(setIsBrowser);

  const { data, loading } = useQueryClient<
    FlightSearchTypes.FlightSearchResults,
    FlightSearchTypes.FlightSearchVariables
  >(FlightSearchQuery, {
    variables,
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
    onCompleted: resultData => {
      scrollSearchPageToTop();
      if (currentSearchIdRef && !currentSearchIdRef.current) {
        updateSearchId(resultData.flightSearch.searchId);
      }
    },
  });

  const isLoading = loading || !isBrowser;
  const filters = data?.flightSearch
    ? constructFlightSearchFilters(data?.flightSearch.filters)
    : {
        priceFilters: undefined,
        durationFilters: undefined,
        stopoverFilters: undefined,
      };

  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        originId,
        originName,
        destinationId,
        destinationName,
        dateFrom,
        dateTo,
        returnDateFrom,
        returnDateTo,
        adults,
        children,
        infants,
        cabinType,
        flightType,
        maxStops: "any",
      },
      QueryParamTypes.PUSH
    );
  }, [
    originId,
    originName,
    destinationId,
    destinationName,
    dateFrom,
    dateTo,
    returnDateFrom,
    returnDateTo,
    adults,
    children,
    infants,
    cabinType,
    flightType,
    setQueryParams,
  ]);

  const flightResults = constructFlightItineraries(
    flightType === "oneway",
    cleanAsPathWithLocale(asPath),
    t,
    adults,
    children,
    infants,
    data?.flightSearch.itineraries,
    cartItemId
  );
  const totalResults = data?.flightSearch.resultCount ?? 0;
  const totalPages = getTotalPages(totalResults, PRODUCT_SEARCH_RESULT_LIMIT);
  const hasSearchFilters = Boolean(originId && destinationId && dateFrom);
  const hasNoFilters =
    !filters.priceFilters?.filters?.length &&
    !filters.stopoverFilters?.filters?.length &&
    !filters.durationFilters?.filters?.length &&
    page === 1 &&
    maxStops === "any";
  const noAvailableStopover = maxStops === "0";
  return {
    isLoading,
    filters,
    hasNoFilters,
    totalPages,
    hasSearchFilters,
    flightResults,
    onClearFilters,
    totalResults,
    updateSearchId,
    page,
    noAvailableStopover,
  };
};

export default useFlightSearch;
