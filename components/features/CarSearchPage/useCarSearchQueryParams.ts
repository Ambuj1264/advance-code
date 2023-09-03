import { useQueryParams, StringParam, ArrayParam, NumberParam, DateParam } from "use-query-params";

import { CarFilterQueryParam } from "types/enums";
import { ValidDateStringParam } from "utils/customQueryParamTypes";

const useCarSearchQueryParams = () => {
  const [
    {
      orderBy,
      orderDirection,
      dateFrom,
      dateTo,
      pickupId,
      dropoffId,
      pickupGeoLocation,
      dropoffGeoLocation,
      carType,
      includedInsurances,
      seats,
      supplier,
      carFeatures,
      depositAmount,
      includedExtras,
      supplierLocation,
      fuelPolicy,
      fuelType,
      milage,
      driverAge,
      driverCountryCode,
      pickupLocationName,
      dropoffLocationName,
      page = 1,
      /* eslint-disable camelcase */
      from_submit,
      to_submit,
      similar_to,
      /* eslint-enable camelcase */
      editCarOfferCartId,
      carLocationType,
    },
    setQueryParams,
  ] = useQueryParams({
    [CarFilterQueryParam.ORDER_BY]: StringParam,
    [CarFilterQueryParam.ORDER_DIRECTION]: StringParam,
    [CarFilterQueryParam.PICKUP_LOCATION_ID]: StringParam,
    [CarFilterQueryParam.DROPOFF_LOCATION_ID]: StringParam,
    [CarFilterQueryParam.PICKUP_GEO_LOCATION]: StringParam,
    [CarFilterQueryParam.DROPOFF_GEO_LOCATION]: StringParam,
    [CarFilterQueryParam.PICKUP_LOCATION_NAME]: StringParam,
    [CarFilterQueryParam.DROPOFF_LOCATION_NAME]: StringParam,
    [CarFilterQueryParam.DATE_FROM]: ValidDateStringParam,
    [CarFilterQueryParam.DATE_TO]: ValidDateStringParam,
    [CarFilterQueryParam.CAR_TYPE]: ArrayParam,
    [CarFilterQueryParam.INCLUDED_INSURANCES]: ArrayParam,
    [CarFilterQueryParam.SEATS]: ArrayParam,
    [CarFilterQueryParam.SUPPLIER]: ArrayParam,
    [CarFilterQueryParam.CAR_FEATURES]: ArrayParam,
    [CarFilterQueryParam.DEPOSIT_AMOUNT]: ArrayParam,
    [CarFilterQueryParam.INCLUDED_EXTRAS]: ArrayParam,
    [CarFilterQueryParam.SUPPLIER_LOCATION]: ArrayParam,
    [CarFilterQueryParam.FUEL_POLICY]: ArrayParam,
    [CarFilterQueryParam.MILAGE]: ArrayParam,
    [CarFilterQueryParam.DRIVER_AGE]: NumberParam,
    [CarFilterQueryParam.DRIVER_COUNTRY]: StringParam,
    [CarFilterQueryParam.PAGE]: NumberParam,
    [CarFilterQueryParam.FUEL_TYPE]: ArrayParam,
    [CarFilterQueryParam.FROM_SUBMIT]: DateParam,
    [CarFilterQueryParam.TO_SUBMIT]: DateParam,
    [CarFilterQueryParam.SIMILAR_TO]: StringParam,
    [CarFilterQueryParam.EDIT_CAR_OFFER_CART_ID]: StringParam,
    [CarFilterQueryParam.CAR_LOCATION_TYPE]: StringParam,
  });

  return [
    {
      orderBy,
      orderDirection,
      dateFrom,
      dateTo,
      dropoffId,
      pickupId,
      pickupGeoLocation,
      dropoffGeoLocation,
      carType,
      includedInsurances,
      seats,
      supplier,
      carFeatures,
      depositAmount,
      includedExtras,
      supplierLocation,
      fuelPolicy,
      fuelType,
      milage,
      driverAge,
      driverCountryCode,
      page,
      pickupLocationName,
      dropoffLocationName,
      /* eslint-disable camelcase */
      from_submit,
      to_submit,
      similar_to,
      /* eslint-enable camelcase */
      editCarOfferCartId,
      carLocationType,
    },
    setQueryParams,
  ] as const;
};

export default useCarSearchQueryParams;
