import { useQuery } from "@apollo/react-hooks";

import { constructSimilarTours } from "./utils/gteTourUtils";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidget/GTETourBookingWidgetStateContext";
import GTESimilarToursQuery from "./queries/GTESimilarToursQuery.graphql";

import useTourSearchParams from "components/features/SearchPage/useTourSearchQueryParams";
import { getGTETourQueryParams } from "components/features/GTETourSearchPage/utils/gteTourSearchUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

export const getSimilarToursInput = ({
  startingLocationId,
  from,
  to,
  adults,
  children,
  requestId,
  productId,
}: {
  startingLocationId?: string;
  from?: string;
  to?: string;
  adults: number;
  children: number;
  requestId?: string;
  productId?: string;
}) => ({
  input: {
    destinationId: startingLocationId,
    from,
    to,
    adults,
    children,
    infants: 0,
    requestId,
    productId,
  },
});

export const useGTESimilarToursQuery = ({
  startingLocationId,
  productId,
}: {
  startingLocationId?: string;
  productId?: string;
}) => {
  const { t: tourT } = useTranslation(Namespaces.tourNs);
  const { selectedDates } = useGTETourBookingWidgetContext();
  const [{ adults = 1, children = 0, requestId, childrenAges, dateFrom }] = useTourSearchParams();
  const hasQueryParams = Boolean(adults > 1 || children || requestId || childrenAges || dateFrom);
  const { data: queryData, loading: queryLoading } = useQuery<{
    toursAndTicketsSimilarTours: GTETourSearchTypes.QueryTour[];
  }>(GTESimilarToursQuery, {
    variables: getSimilarToursInput({
      from: selectedDates.from
        ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
        : undefined,
      to: selectedDates.to ? getFormattedDate(selectedDates.to, yearMonthDayFormat) : undefined,
      adults,
      children,
      startingLocationId,
      requestId,
      productId,
    }),
  });
  const queryParams = hasQueryParams
    ? getGTETourQueryParams(
        Math.max(adults, 1),
        children,
        childrenAges,
        getFormattedDate(selectedDates.from || new Date(), yearMonthDayFormat)
      )
    : undefined;
  const similarTours = queryData
    ? constructSimilarTours(queryData.toursAndTicketsSimilarTours, tourT, queryParams, productId)
    : [];
  return {
    similarTours,
    similarToursLoading: queryLoading,
  };
};
