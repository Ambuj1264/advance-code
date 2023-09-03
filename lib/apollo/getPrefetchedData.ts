import { NextPageContext } from "next";
import { ApolloClient, QueryOptions } from "apollo-client";

import { redirectCheck } from "./redirectCheck";

import { isBrowser } from "utils/helperUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrefetchedData = async <T = Record<string, any>>(
  apollo: ApolloClient<unknown>,
  ctx: NextPageContext,
  query: QueryOptions<any>,
  skipBrowserCheck = false
) => {
  if (isBrowser && !skipBrowserCheck) return { result: null, errorStatusCode: undefined };

  const result = await apollo.query(query).catch(e => e);
  const isError = result instanceof Error;
  const data = result?.data;
  const hasNullResult =
    !data ||
    (data && Object.values(data).some(value => value === null || (value as any).length === 0));
  let errorStatusCode;

  if (isError) {
    errorStatusCode = 500;
  } else if (hasNullResult) {
    errorStatusCode = 404;
  }

  if (errorStatusCode) {
    errorStatusCode = await redirectCheck(apollo, ctx, errorStatusCode);
  }

  return { result: result as T, errorStatusCode };
};
