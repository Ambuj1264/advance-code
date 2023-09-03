import { useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";

import OverallSearchPageQuery from "./queries/OverallSearchPageQuery.graphql";

import useDebounce from "hooks/useDebounce";
import useActiveLocale from "hooks/useActiveLocale";

interface overallSearchFilters {
  funnelTypes: string[];
  countryIds: string[];
  countryCodes: string[];
  countryNames: string[];
  cityIds: string[];
  cityNames: string[];
}

const useOverallSearchQuery = (
  filters: overallSearchFilters,
  limit: number,
  searchInput?: string,
  nextPage?: string
) => {
  const debouncedSearch = useDebounce(searchInput || "", 250);

  const [fetchSearchResults, { data, loading, error }] = useLazyQuery(OverallSearchPageQuery);
  const locale = useActiveLocale();
  useEffect(() => {
    if (searchInput && searchInput?.length > 2) {
      fetchSearchResults({
        variables: {
          input: {
            query: searchInput?.trim(),
            locale,
            nextPage,
            filters,
            limit,
          },
        },
      });
    }
  }, [debouncedSearch, nextPage]);

  if (loading) return { loading };
  if (error) return { error };
  if (data) return { data };
  return { data: null };
};

export default useOverallSearchQuery;
