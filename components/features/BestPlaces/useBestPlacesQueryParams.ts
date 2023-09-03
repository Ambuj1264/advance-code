import {
  useQueryParams,
  StringParam,
  NumberParam,
  NumericArrayParam,
  ArrayParam,
} from "use-query-params";

import { BestPlacesQueryParam, BestPlacesPage } from "types/enums";
import { StartingLocationTypes } from "components/ui/Map/utils/mapUtils";

const useBestPlacesQueryParams = () => {
  const queryType = {
    [BestPlacesQueryParam.ORDER_BY]: StringParam,
    [BestPlacesQueryParam.ACTIVE_TAB]: StringParam,
    [BestPlacesQueryParam.DESTINATION_ID]: NumberParam,
    [BestPlacesQueryParam.ATTRACTION_IDS]: NumericArrayParam,
    [BestPlacesQueryParam.STARTING_LOCATION_ID]: StringParam,
    [BestPlacesQueryParam.LATITUDE]: NumberParam,
    [BestPlacesQueryParam.LONGITUDE]: NumberParam,
    [BestPlacesQueryParam.STARTING_LOCATION_TYPES]: ArrayParam,
    [BestPlacesQueryParam.STARTING_LOCATION_NAME]: StringParam,
    [BestPlacesQueryParam.PAGE]: NumberParam,
    [BestPlacesQueryParam.CHILDREN]: NumberParam,
  };
  const [queryParams, setQueryParams] = useQueryParams(queryType);
  const {
    activeTab,
    orderBy,
    destinationId,
    attractionIds,
    startingLocationId,
    lat,
    lng,
    startingLocationName,
    startingLocationTypes,
    page = 1,
    children,
  } = queryParams;

  return [
    {
      activeTab: activeTab as BestPlacesPage,
      orderBy,
      destinationId,
      attractionIds,
      startingLocationId,
      lat,
      lng,
      startingLocationName,
      startingLocationTypes: startingLocationTypes as StartingLocationTypes[],
      page,
      children,
    },
    setQueryParams,
  ] as const;
};

export default useBestPlacesQueryParams;
