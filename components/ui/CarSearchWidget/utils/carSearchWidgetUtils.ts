import { encodeQueryParams, NumberParam, stringify, StringParam } from "use-query-params";

import { addLeadingSlashIfNotPresent } from "utils/helperUtils";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { AutoCompleteType, CarFilterQueryParam } from "types/enums";

export const getSearchPageLink = ({
  searchLink,
  selectedDates,
  pickupId,
  dropoffId,
  driverAge,
  driverCountry,
  pickupLocationName,
  dropoffLocationName,
  editItem,
}: {
  searchLink: string;
  selectedDates: SharedTypes.SelectedDates;
  pickupId?: string;
  dropoffId?: string;
  driverAge?: number;
  driverCountry?: string;
  pickupLocationName?: string;
  dropoffLocationName?: string;
  editItem?: number;
}) => {
  const from = selectedDates?.from ?? new Date();
  const to = selectedDates?.to ?? new Date();
  const dateFrom = getFormattedDate(from, yearMonthDayFormat);
  const dateTo = getFormattedDate(to, yearMonthDayFormat);

  const timeFrom = getFormattedDate(from, "HH:mm");

  const timeTo = getFormattedDate(to, "HH:mm");

  const queryParams = `?${stringify(
    encodeQueryParams(
      {
        [CarFilterQueryParam.PICKUP_LOCATION_ID]: StringParam,
        [CarFilterQueryParam.DROPOFF_LOCATION_ID]: StringParam,
        [CarFilterQueryParam.DATE_FROM]: StringParam,
        [CarFilterQueryParam.DATE_TO]: StringParam,
        [CarFilterQueryParam.DRIVER_AGE]: NumberParam,
        [CarFilterQueryParam.DRIVER_COUNTRY]: StringParam,
        [CarFilterQueryParam.DROPOFF_LOCATION_NAME]: StringParam,
        [CarFilterQueryParam.PICKUP_LOCATION_NAME]: StringParam,
        [CarFilterQueryParam.EDIT_CAR_OFFER_CART_ID]: NumberParam,
      },
      {
        [CarFilterQueryParam.PICKUP_LOCATION_ID]: pickupId,
        [CarFilterQueryParam.DROPOFF_LOCATION_ID]: dropoffId,
        [CarFilterQueryParam.DATE_FROM]: `${dateFrom} ${timeFrom}`,
        [CarFilterQueryParam.DATE_TO]: `${dateTo} ${timeTo}`,
        [CarFilterQueryParam.DRIVER_AGE]: driverAge,
        [CarFilterQueryParam.DRIVER_COUNTRY]: driverCountry,
        [CarFilterQueryParam.PICKUP_LOCATION_NAME]: pickupLocationName,
        [CarFilterQueryParam.DROPOFF_LOCATION_NAME]: dropoffLocationName,
        [CarFilterQueryParam.EDIT_CAR_OFFER_CART_ID]: editItem,
      }
    )
  )}`;
  return `${addLeadingSlashIfNotPresent(searchLink)}${queryParams}`;
};

export const getDriverCountryWithDefault = (countryCode: string) =>
  countryCode === "EU" ? "DE" : countryCode;

export const getCarAutocompleteOptions = (
  locations: CarPickupLocationTypes.QueryCarPickupLocation[]
) =>
  locations.map(({ locationId, name, type, geoLocation }) => ({
    id: locationId,
    name,
    type: type?.toLowerCase(),
    geoLocation,
  }));

export const getPlaceTypeByPlaceId = (placeId?: string) => {
  /**
   * Place id consists of 2 numbers separated by comma
   * 1st number - an id of the place
   * 2nd number - an id of the place type
   */
  if (!placeId) return AutoCompleteType.CITY;

  const [, id] = placeId.split(",");

  if (id === "2") return AutoCompleteType.AIRPORT;
  if (id === "6") return AutoCompleteType.TRAIN_STATION;

  return AutoCompleteType.CITY;
};
