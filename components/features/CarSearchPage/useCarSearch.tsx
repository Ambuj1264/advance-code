import { useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";

import CarProvidersQuery from "./queries/CarProvidersQuery.graphql";
import CarSearchQuery from "./queries/CarSearchQuery.graphql";

import { useSwrQuery } from "hooks/useSwrQuery";
import { cacheOnClient30M } from "utils/apiUtils";
import { CarProvider } from "types/enums";

const useCarSearch = (
  carSearchQueryFilters: CarSearchTypes.CarSearchQueryFilters,
  isSearchResults: boolean
) => {
  const { data: carProvidersData, loading: carProvidersDataLoading } = useQuery<{
    settings: {
      cars: {
        carSearchProviders: string;
      };
    };
  }>(CarProvidersQuery);
  const providers = carProvidersData?.settings?.cars?.carSearchProviders ?? "";

  const shouldSkipQuery = (provider: CarProvider) =>
    !isSearchResults || !providers.includes(provider);

  const {
    data: guideData,
    loading: guideLoading,
    error: guideError,
  } = useSwrQuery<CarSearchTypes.QueryCarsSearch>(CarSearchQuery, {
    variables: {
      input: {
        ...carSearchQueryFilters,
        provider: CarProvider.GUIDE,
        skipTranslate: true,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: shouldSkipQuery(CarProvider.GUIDE),
    context: { headers: cacheOnClient30M },
  });
  const {
    data: carenData,
    loading: carenLoading,
    error: carenError,
  } = useSwrQuery<CarSearchTypes.QueryCarsSearch>(CarSearchQuery, {
    variables: {
      input: {
        ...carSearchQueryFilters,
        provider: CarProvider.CAREN,
        skipTranslate: true,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: shouldSkipQuery(CarProvider.CAREN),
    context: { headers: cacheOnClient30M },
  });
  const {
    data: carnectData,
    loading: carnectLoading,
    error: carnectError,
  } = useSwrQuery<CarSearchTypes.QueryCarsSearch>(CarSearchQuery, {
    variables: {
      input: {
        ...carSearchQueryFilters,
        provider: CarProvider.CARNECT,
        skipTranslate: true,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: shouldSkipQuery(CarProvider.CARNECT),
    context: { headers: cacheOnClient30M },
  });

  const combinedCars = useMemo(
    () => [
      ...((!guideLoading && !guideError ? guideData?.carOffers?.offers : undefined) ?? []),
      ...((!carenLoading && !carenError ? carenData?.carOffers?.offers : undefined) ?? []),
      ...((!carnectLoading && !carnectError ? carnectData?.carOffers?.offers : undefined) ?? []),
    ],
    [
      carenData?.carOffers?.offers,
      carenError,
      carenLoading,
      carnectData?.carOffers?.offers,
      carnectError,
      carnectLoading,
      guideData?.carOffers?.offers,
      guideError,
      guideLoading,
    ]
  );
  const combinedFilters = useMemo(
    () => [
      ...(guideData?.carOffers?.filters ?? []),
      ...(carenData?.carOffers?.filters ?? []),
      ...(carnectData?.carOffers?.filters ?? []),
    ],
    [carenData?.carOffers?.filters, carnectData?.carOffers?.filters, guideData?.carOffers?.filters]
  );
  return {
    combinedCars,
    combinedFilters,
    allProvidersLoading:
      carProvidersDataLoading || (guideLoading && carenLoading && carnectLoading),
    someProviderLoading:
      carProvidersDataLoading ||
      (guideLoading && !guideError) ||
      (carenLoading && !carenError) ||
      (carnectLoading && !carnectError),
  };
};

export default useCarSearch;
