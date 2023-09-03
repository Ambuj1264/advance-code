import memoizeOne from "memoize-one";

import { GraphCMSPageType } from "types/enums";
import { asPathWithoutQueryParams } from "utils/routerUtils";

export const getCarSearchPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.Cars,
  metadataUri: asPath ? asPathWithoutQueryParams(asPath) : undefined,
}));

export const doesCarPageHasFilters = ({
  dateFrom,
  dateTo,
  pickupId,
  dropoffId,
  orderBy,
}: {
  dateFrom?: string;
  dateTo?: string;
  pickupId?: string;
  dropoffId?: string;
  orderBy?: string;
}) => {
  return Boolean(dateFrom || dateTo || pickupId || dropoffId || orderBy);
};
