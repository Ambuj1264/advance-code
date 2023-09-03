import { QueryHookOptions, useQuery } from "@apollo/react-hooks";
// eslint-disable-next-line import/no-extraneous-dependencies
import { OperationVariables, QueryResult } from "@apollo/react-common";
import { DocumentNode } from "graphql";

// stale-while-revalidate query hook, use with cache-and-network fetchPolicy
export function useSwrQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const result = useQuery(query, options);

  let inCache = true;
  if (result.loading) {
    try {
      result.client.readQuery({
        query,
        variables: result.variables,
      });
    } catch (error) {
      inCache = false;
    }
  }
  // eslint-disable-next-line functional/immutable-data
  result.loading = !inCache;
  return result;
}
