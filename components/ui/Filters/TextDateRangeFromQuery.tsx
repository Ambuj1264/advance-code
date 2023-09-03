import React, { ReactNode } from "react";
import { StringParam, useQueryParams } from "use-query-params";

import TextDateRange from "./TextDateRange";

const TextDateRangeFromQuery = ({
  children,
  from,
  to,
  withTime = false,
}: {
  children: ReactNode;
  from: string;
  to: string;
  withTime?: boolean;
}) => {
  const [dates] = useQueryParams({
    [from]: StringParam,
    [to]: StringParam,
  });

  const dateFrom = dates[from];
  const dateTo = dates[to];

  return (
    <TextDateRange dateFrom={dateFrom} dateTo={dateTo} withTime={withTime}>
      {children}
    </TextDateRange>
  );
};

export default TextDateRangeFromQuery;
