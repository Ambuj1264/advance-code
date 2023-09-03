import { useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";

import OverallSearchQuery from "../../graphql/OverallSearchQuery.graphql";

import useDebounce from "hooks/useDebounce";
import useActiveLocale from "hooks/useActiveLocale";

const useOverallSearchQuery = (searchInput: string) => {
  const debouncedSearch = useDebounce(searchInput, 250);

  const [fetchSearchResults, { data, loading, error }] = useLazyQuery(OverallSearchQuery);
  const locale = useActiveLocale();
  useEffect(() => {
    if (searchInput?.length > 2) {
      fetchSearchResults({
        variables: {
          input: {
            query: searchInput.trim(),
            locale,
            useExtensiveSearch: true,
          },
        },
      });
    }
  }, [debouncedSearch]);

  if (loading) return { loading };
  if (error) return { error };
  if (data) return { data };
  return { data: null };
};

export default useOverallSearchQuery;
