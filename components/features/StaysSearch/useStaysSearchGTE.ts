import { useCallback, useMemo, useRef } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { getOrElse } from "fp-ts/lib/Option";

import StaysSearchQueryGTE from "./queries/StaysSearchQueryGTE.graphql";
import StaysSearchMapQueryGTE from "./queries/StaysSearchMapQueryGTE.graphql";
import {
  constructStaysMapDataGTE,
  constructStaysProductGTE,
  constructStaysSearchFiltersGTE,
  getStarRatingValues,
  getStaysSelectedFilters,
} from "./utils/staysSearchPageUtils";
import { StayFilterSectionType } from "./types/staysSearchEnums";

import useAccommodationSearchQueryParams, {
  decodeOccupanciesArray,
} from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { noCacheHeaders } from "utils/apiUtils";
import useCurrency from "hooks/useCurrency";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { getDatesInFuture } from "components/ui/DatePicker/utils/datePickerUtils";
import useGetIpCountryCode from "hooks/useGetIpCountryCode";
import useQueryClient from "hooks/useQueryClient";

const PRODUCTS_PER_PAGE = 24;

export const useStaysSearchQueryGTE = () => {
  const { t: accommodationT } = useTranslation(Namespaces.accommodationNs);
  const { t: accommodationSearchT } = useTranslation(Namespaces.accommodationSearchNs);
  const { ipCountryCode } = useGetIpCountryCode();
  const ipCountryCodeMissing = ipCountryCode === "";
  const { currencyCode: maybeCurrencyCode } = useCurrency();
  const currencyCode = getOrElse(() => "")(maybeCurrencyCode);
  const [
    {
      id,
      dateFrom,
      dateTo,
      type,
      review_score: reviewScore,
      categories,
      meals_included: mealsIncluded,
      room_preferences: roomPreferences,
      hotel_amenities: hotelAmenities,
      star_ratings: starRatings,
      orderBy,
      orderDirection,
      price,
      nextPageId,
      prevPageId,
      occupancies: encodedOccupancies,
    },
    setQueryParams,
  ] = useAccommodationSearchQueryParams();

  const occupancies = decodeOccupanciesArray(encodedOccupancies);
  const allGuests = getTotalGuests(occupancies);
  const rooms = occupancies.length;
  const adults = allGuests.numberOfAdults;
  const children = allGuests.childrenAges;
  const { fromDate, toDate } = getDatesInFuture(dateFrom, dateTo);
  const nextPageNumber = Number(nextPageId);
  const prevPageNumber = Number(prevPageId);
  const page = nextPageNumber || prevPageNumber || 1;

  const [fetchMap, { data: queryMap, loading: queryMapLoading, error: queryMapError }] =
    useLazyQuery<{
      searchMap: StaysSearchTypes.StaysSearchMapQuery;
    }>(StaysSearchMapQueryGTE);

  const searchInput: StaysSearchTypes.StaySearchQueryGTEInput = useMemo(() => {
    return {
      dateCheckingIn: fromDate || "",
      dateCheckingOut: toDate || "",
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE + 1,
      reviewScore,
      mealsIncluded,
      inputValue: id,
      categories,
      bedPreferences: roomPreferences,
      hotelAmenities,
      roomTypes: roomPreferences,
      starRatings: getStarRatingValues(starRatings),
      orderbyType: orderBy?.toUpperCase(),
      orderDirection: orderDirection?.toUpperCase(),
      priceFrom: price !== undefined ? Number(price[0]) : undefined,
      priceTo: price !== undefined ? Number(price[1]) : undefined,
      currency: currencyCode,
      occupancies,
      alpha2CountryCodeOfCustomer: ipCountryCode,
    };
  }, [
    categories,
    currencyCode,
    fromDate,
    toDate,
    occupancies,
    hotelAmenities,
    id,
    mealsIncluded,
    orderBy,
    orderDirection,
    page,
    price,
    reviewScore,
    roomPreferences,
    starRatings,
    ipCountryCode,
  ]);

  const {
    data: querySearchData,
    loading: searchLoading,
    error: querySearchError,
    variables: querySearchVariables,
  } = useQueryClient<
    {
      searchAvailabilities: StaysSearchTypes.StaysSearchQueryGTEData;
    },
    { input: StaysSearchTypes.StaySearchQueryGTEInput }
  >(StaysSearchQueryGTE, {
    variables: {
      input: searchInput,
    },
    fetchPolicy: "no-cache",
    skip: currencyCode === "" || ipCountryCodeMissing,
    context: {
      headers: noCacheHeaders,
    },
  });
  const querySearchLoading = searchLoading || ipCountryCodeMissing;
  const isCurrencyBeingChanged = currencyCode !== querySearchData?.searchAvailabilities.currency;
  const staysCurrency = querySearchData?.searchAvailabilities.currency ?? "";

  const fetchMapData = useCallback(() => {
    if (querySearchLoading || querySearchError || !querySearchVariables?.input || queryMapError)
      return;

    fetchMap({
      variables: {
        input: {
          ...querySearchVariables.input,
          take: 3000,
          skip: 0,
        },
      },
    });
  }, [fetchMap, queryMapError, querySearchError, querySearchLoading, querySearchVariables?.input]);

  const stayResults = useMemo(
    () =>
      querySearchData?.searchAvailabilities.cards
        ? querySearchData.searchAvailabilities.cards.slice(0, PRODUCTS_PER_PAGE).map(card =>
            constructStaysProductGTE({
              card,
              adults,
              children,
              rooms,
              dateFrom: fromDate,
              dateTo: toDate,
              productId: id,
              t: accommodationT,
              isLoading: querySearchLoading,
              mealsIncluded,
              roomPreferences,
              occupancies,
            })
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [querySearchData?.searchAvailabilities, querySearchLoading, occupancies]
  );

  const hasNextPage = querySearchData?.searchAvailabilities.cards?.length === PRODUCTS_PER_PAGE + 1;

  const filters = useMemo(() => {
    if (!querySearchData?.searchAvailabilities) return [] as FilterSectionListType;

    const {
      starRatingFilters,
      facilitiesFilters,
      productTypeFilters,
      mealTypeFilters,
      roomTypeFilters,
      priceDistribution,
      priceMinimum,
      priceMaximum,
    } = querySearchData.searchAvailabilities;

    const availableFilters = [
      starRatingFilters,
      productTypeFilters,
      priceDistribution
        ? {
            id: StayFilterSectionType.Price,
            options: priceDistribution,
          }
        : undefined,
      mealTypeFilters,
      roomTypeFilters,
      facilitiesFilters,
    ].filter(Boolean) as StaysSearchTypes.QuerySearchFilter[];

    const constructedFilterSections = constructStaysSearchFiltersGTE(
      availableFilters,
      priceMinimum?.defaultPrice ?? 0,
      priceMaximum?.defaultPrice ?? 0,
      accommodationSearchT
    );

    return constructedFilterSections as FilterSectionListType;
  }, [accommodationSearchT, querySearchData?.searchAvailabilities]);

  const onClearFilters = useCallback(() => {
    setQueryParams(
      {
        dateFrom: fromDate,
        dateTo: toDate,
        type,
        id,
        adults,
        children,
        rooms,
        nextPageId: nextPageNumber > 1 ? String(nextPageNumber) : undefined,
        prevPageId: prevPageNumber > 1 ? String(prevPageNumber) : undefined,
        page: undefined,
        orderBy,
        orderDirection,
      },
      QueryParamTypes.PUSH
    );
  }, [
    adults,
    children,
    fromDate,
    toDate,
    id,
    orderBy,
    orderDirection,
    prevPageNumber,
    nextPageNumber,
    rooms,
    setQueryParams,
    type,
  ]);

  const totalProductsCount = querySearchData?.searchAvailabilities.productCountTotal ?? 0;

  const totalPages = Math.ceil(totalProductsCount / PRODUCTS_PER_PAGE) ?? 0;
  const mapData = queryMap?.searchMap.cards?.length
    ? constructStaysMapDataGTE(
        queryMap.searchMap.cards,
        adults,
        children,
        occupancies,
        rooms,
        fromDate,
        toDate,
        mealsIncluded,
        roomPreferences
      )
    : undefined;

  const lastSuccessfullMapData = useRef(mapData);

  if (mapData !== undefined) lastSuccessfullMapData.current = mapData;

  const selectedFilters = useMemo(
    () =>
      getStaysSelectedFilters({
        reviewScore,
        categories,
        mealsIncluded,
        roomPreferences,
        hotelAmenities,
        starRatings,
        price,
        filters,
        currencyCode,
        convertCurrency: value => value,
      }),
    [
      reviewScore,
      categories,
      mealsIncluded,
      roomPreferences,
      hotelAmenities,
      starRatings,
      price,
      filters,
      currencyCode,
    ]
  );
  return {
    onClearFilters,
    filters,
    totalPages,
    totalAccommodations: totalProductsCount,
    // this is needed to not cause map flickering when we're changing filters while keeping map open
    mapData: queryMapLoading ? lastSuccessfullMapData.current : mapData,
    mapDataLoading: queryMapLoading || querySearchLoading,
    products: stayResults,
    currencyCode: staysCurrency,
    isLoading: querySearchLoading || currencyCode === "",
    isCurrencyBeingChanged,
    currentPage: page,
    selectedFilters,
    hasNextPage,
    hasPreviousPage: page > 1,
    fetchMapData,
  };
};
