import useVacationSearchQueryParams from "../utils/useVacationSearchQueryParams";

export const useVPSearchQueryHasFilters = () => {
  const [queryParams] = useVacationSearchQueryParams();

  return {
    hasFilters: Object.values(queryParams).some(queryParam =>
      Array.isArray(queryParam) ? Boolean(queryParam.length) : Boolean(queryParam)
    ),
  };
};
