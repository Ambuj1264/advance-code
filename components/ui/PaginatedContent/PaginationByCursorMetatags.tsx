import React from "react";
import Head from "next/head";
import { stringify } from "use-query-params";

import { CursorPaginationQueryParams } from "types/enums";

const PaginationByCursorMetatags = ({
  hasNextPage,
  hasPreviousPage,
  nextPageCursor,
  prevPageCursor,
  canonical,
}: {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPageCursor?: string;
  prevPageCursor?: string;
  canonical: string;
}) => (
  <Head>
    {hasPreviousPage && (
      <link
        rel="prev"
        href={`${canonical}?${stringify({
          [CursorPaginationQueryParams.PREV_PAGE_ID]: prevPageCursor,
        })}`}
      />
    )}
    {hasNextPage && (
      <link
        rel="next"
        href={`${canonical}?${stringify({
          [CursorPaginationQueryParams.NEXT_PAGE_ID]: nextPageCursor,
        })}`}
      />
    )}
  </Head>
);
export default PaginationByCursorMetatags;
