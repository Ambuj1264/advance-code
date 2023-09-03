import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useEffect, useMemo, useRef, useState } from "react";

import GTIVpCachedPriceQuery from "../queries/GTIVpCachedPriceQuery.graphql";
import GTIVpPriceQuery from "../queries/GTIVpPriceQuery.graphql";
import {
  normalizeLivePricingCachedData,
  normalizeLivePricingData,
} from "../utils/tourBookingWidgetUtils";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { GTIVpLivePricingType } from "types/enums";
import { useDebouncedCallback } from "hooks/useDebounce";

const LIVE_PRICING_DEBOUNCE = 250;

// https://travelshift.slite.com/app/docs/gknd6n3tKQi-hA
const useGTIVPrices = ({
  slug,
  startDate,
  travelers,
  childrenAges,
  isLivePricing,
  skip = false,
  onCompleted,
  onCompletedNonDefaultOptions,
  setVpOptions,
}: {
  slug: string;
  startDate?: Date;
  travelers: number;
  skip?: boolean;
  childrenAges?: number[];
  isLivePricing: boolean;
  onCompleted?: (data?: TourBookingWidgetTypes.QueryVpPrices, startDate?: string) => void;
  onCompletedNonDefaultOptions?: (data?: TourBookingWidgetTypes.QueryVpPrices) => void;
  setVpOptions?: (vpPricesOptions?: TourBookingWidgetTypes.QueryVpOptions[]) => void;
}) => {
  const requestCount = useRef(0);
  const normalizedStartDate = startDate;
  const formattedStartDate = normalizedStartDate
    ? getFormattedDate(normalizedStartDate, yearMonthDayFormat)
    : undefined;
  const GTIvpPricesVariables = useMemo(
    () => ({
      slug,
      startDate: formattedStartDate,
      travelers,
      childrenAges,
    }),
    [childrenAges, formattedStartDate, slug, travelers]
  );
  const shouldSkipGTIVpPricesQuery = !isLivePricing;
  const shouldSkipGTIVpNonCachesQuery = shouldSkipGTIVpPricesQuery || !formattedStartDate;
  // We should use state here because apollo-hooks return data as undefined while refetching (because of no cache)
  const [priceCachedData, setPriceCachedData] = useState<{
    data?: TourBookingWidgetTypes.QueryVpPrices;
    startDate?: string;
  }>({
    data: undefined,
    startDate: undefined,
  });
  const [livePriceDefaultOptionsData, setLivePriceDefaultOptionsData] =
    useState<TourBookingWidgetTypes.QueryVpPrices>();

  const [fetchLivePricingDefaultOptions, { loading: isGTIVpLivePriceDefaultOptionsLoading }] =
    useLazyQuery<TourBookingWidgetTypes.QueryVpPrices>(GTIVpPriceQuery, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      onCompleted: data => {
        setLivePriceDefaultOptionsData(data);
        onCompleted?.(data);
      },
    });

  const shouldSkipGTICachedQuery =
    shouldSkipGTIVpPricesQuery || Boolean(livePriceDefaultOptionsData);

  const { loading: isGTIVpCachingPriceLoading, data: vpCachingPriceData } =
    useQuery<TourBookingWidgetTypes.QueryVpPrices>(GTIVpCachedPriceQuery, {
      variables: {
        ...GTIvpPricesVariables,
        isCachedPrice: true,
      },
      skip: skip || shouldSkipGTICachedQuery,
      context: { headers: noCacheHeaders },
      notifyOnNetworkStatusChange: true,
      onError: () => {
        setPriceCachedData({ data: undefined, startDate: undefined });
      },
    });

  useEffect(() => {
    if (!skip && vpCachingPriceData) {
      setPriceCachedData({
        data: vpCachingPriceData,
        startDate: GTIvpPricesVariables.startDate,
      });
    }

    if ((shouldSkipGTIVpNonCachesQuery || isGTIVpLivePriceDefaultOptionsLoading) && onCompleted) {
      onCompleted(vpCachingPriceData);
    }
  }, [
    GTIvpPricesVariables.startDate,
    isGTIVpLivePriceDefaultOptionsLoading,
    onCompleted,
    shouldSkipGTIVpNonCachesQuery,
    skip,
    vpCachingPriceData,
  ]);

  const [
    fetchLivePriceRestOptions,
    { data: livePriceRestOptionsData, loading: isGTIVpLivePriceRestOptionsLoading },
  ] = useLazyQuery<TourBookingWidgetTypes.QueryVpPrices>(GTIVpPriceQuery, {
    fetchPolicy: "no-cache",
    onCompleted: onCompletedNonDefaultOptions,
  });

  const debouncedFetchLivePricingDefaultData = useDebouncedCallback(
    fetchLivePricingDefaultOptions,
    LIVE_PRICING_DEBOUNCE
  );
  const debouncedFetchLivePriceRestOptions = useDebouncedCallback(
    fetchLivePriceRestOptions,
    LIVE_PRICING_DEBOUNCE
  );

  useEffect(() => {
    if (shouldSkipGTIVpPricesQuery || skip) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const livePricingAbortController = new AbortController();

    const requestContext = {
      headers: noCacheHeaders,
      fetchOptions: {
        controller: livePricingAbortController,
      },
    };

    if (formattedStartDate && !shouldSkipGTIVpNonCachesQuery) {
      // this ref is used to force the apollo link constucting a new context for the query.
      // see https://github.com/apollographql/apollo-client/issues/4150 for more tech details
      // TLDR: apollo link instance is the same if the same variables,
      // so I'm hacking it this way by updating the variable so the new abortController is passed down
      requestCount.current += 1;
      debouncedFetchLivePricingDefaultData({
        variables: {
          ...GTIvpPricesVariables,
          priceDataType: GTIVpLivePricingType.DEFAULT,
          isCachedPrice: false,
          requestCount: requestCount.current,
        },
        context: requestContext,
      });

      debouncedFetchLivePriceRestOptions({
        variables: {
          ...GTIvpPricesVariables,
          priceDataType: GTIVpLivePricingType.NOT_DEFAULT,
          isCachedPrice: false,
          requestCount: requestCount.current,
        },
        context: requestContext,
      });
    }

    return () => {
      livePricingAbortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formattedStartDate,
    shouldSkipGTIVpPricesQuery,
    shouldSkipGTIVpNonCachesQuery,
    slug,
    travelers,
    childrenAges,
    skip,
  ]);

  const normalizedPriceData: TourBookingWidgetTypes.QueryVpPrices | undefined = useMemo(
    () =>
      isGTIVpLivePriceRestOptionsLoading
        ? normalizeLivePricingCachedData(priceCachedData.data, livePriceDefaultOptionsData)
        : normalizeLivePricingData(livePriceDefaultOptionsData, livePriceRestOptionsData),
    [
      isGTIVpLivePriceRestOptionsLoading,
      livePriceDefaultOptionsData,
      livePriceRestOptionsData,
      priceCachedData,
    ]
  );

  // We can't move this inside onComplete because we combine normalizedPriceData from 2 queries.
  useEffect(() => {
    if (setVpOptions && normalizedPriceData?.monolithVacationPackage) {
      setVpOptions(normalizedPriceData.monolithVacationPackage.options);
    }
  }, [setVpOptions, normalizedPriceData]);

  const isGTIVpLivePriceLoading =
    skip || isGTIVpLivePriceDefaultOptionsLoading || isGTIVpLivePriceRestOptionsLoading;

  const hasPriceCachedDataForSelectedDate =
    priceCachedData.data && priceCachedData.startDate === normalizedStartDate;

  return {
    GTIVpPricesData: normalizedPriceData?.monolithVacationPackage,
    isGTIVpDefaultOptionsLoading: isGTIVpLivePriceDefaultOptionsLoading,
    shouldShowFromPrice: hasPriceCachedDataForSelectedDate && !shouldSkipGTICachedQuery,
    isGTIVpLivePriceLoading: isGTIVpLivePriceLoading || isGTIVpCachingPriceLoading,
  };
};

export default useGTIVPrices;
