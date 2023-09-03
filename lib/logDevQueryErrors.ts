/* eslint-disable no-console,import/no-extraneous-dependencies */
import { OperationVariables, QueryResult } from "@apollo/react-common";
import { DocumentNode } from "graphql";

import { isDev } from "../utils/globalUtils";

const colorReset = "\x1b[0m";
const colorMagenta = "\x1b[35m";
const colorRed = "\x1b[31m";

const getQueryName = (queryDocument: { query: DocumentNode; variables?: any }) => {
  const queryName =
    queryDocument.query.loc?.source?.body?.split("{")[0] ||
    // @ts-ignore
    queryDocument.query.definitions[0]?.name?.value;
  return `${colorMagenta}${queryName} variables:${JSON.stringify(
    queryDocument.variables
  )}${colorReset}`;
};
export const logDevQueryErrors = (
  requiredQueryResults: QueryResult<{ data: any }, OperationVariables>[],
  nonRequiredQueriesResult: {
    status: "fulfilled" | "rejected";
    value: { data: any };
  }[],
  requiredQueries: { query: DocumentNode }[],
  nonRequiredQueries: { query: DocumentNode }[]
) => {
  if (typeof window !== "undefined" || !isDev()) return;

  const queries = [...requiredQueries, ...nonRequiredQueries];
  const queryResults = [
    ...requiredQueryResults,
    ...nonRequiredQueriesResult.map(({ value }) => value),
  ];

  queryResults.forEach((result, i) => {
    if (result instanceof Error)
      console.log(
        `${colorRed}SSR error: query result instanceof Error, ${getQueryName(queries[i])}`,
        result
      );
  });

  // eslint-disable-next-line consistent-return
  queryResults.forEach((result, i) => {
    const currentQueryInfo = getQueryName(queries[i]);

    if (!result?.data) {
      return console.log(
        `${colorRed}SSR error: empty query result data, ${currentQueryInfo}`,
        result
      );
    }
    Object.values(result?.data).forEach((value: any) => {
      if (value === null || value.length === 0)
        console.log(`${colorRed}SSR error: empty query result value, ${currentQueryInfo}`, result);
    });
  });
};
