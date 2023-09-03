import { QueryHookOptions, useQuery } from "@apollo/react-hooks";
// eslint-disable-next-line import/no-extraneous-dependencies
import { OperationVariables, QueryResult } from "@apollo/react-common";
import { DocumentNode } from "graphql";

export default function useQueryClient<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const result = useQuery(query, { ...options, ssr: false });

  // fixes SSR/client mismatch in case ssr: false and skip: true
  // https://github.com/apollographql/apollo-client/issues/9096
  const fixedLoading = options?.skip && typeof window === "undefined" ? false : result.loading;

  // eslint-disable-next-line functional/immutable-data
  result.loading = fixedLoading;

  return result;
}
