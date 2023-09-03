import { parse } from "date-fns";

import { getSearchPageLink, getPlaceTypeByPlaceId } from "../carSearchWidgetUtils";

import { yearMonthDayFormatWithTime } from "utils/dateUtils";
import { AutoCompleteType } from "types/enums";

describe("getSearchPageLink", () => {
  const searchPageLink = "process/search";
  const dateStringWithTime1 = "2019-05-05 10:30";
  const dateStringWithTime2 = "2019-05-06 10:30";
  const pickupId = "1";
  const dropoffId = "4";
  const selectedDates = {
    from: parse(dateStringWithTime1, yearMonthDayFormatWithTime, new Date()),
    to: parse(dateStringWithTime2, yearMonthDayFormatWithTime, new Date()),
  };
  test("should return included option, and empty multiple and checkbox arrays", () => {
    expect(
      getSearchPageLink({
        searchLink: searchPageLink,
        selectedDates,
        pickupId,
        dropoffId,
      })
    ).toEqual(
      `/${searchPageLink}?dateFrom=2019-05-05%2010%3A30&dateTo=2019-05-06%2010%3A30&dropoffId=4&pickupId=1`
    );
  });
  test("should return included option, and empty multiple and checkbox arrays", () => {
    expect(
      getSearchPageLink({
        searchLink: searchPageLink,
        selectedDates,
        pickupId,
        dropoffId,
        driverAge: 18,
        driverCountry: "IS",
      })
    ).toEqual(
      `/${searchPageLink}?dateFrom=2019-05-05%2010%3A30&dateTo=2019-05-06%2010%3A30&driverAge=18&driverCountryCode=IS&dropoffId=4&pickupId=1`
    );
  });
});

describe("getPlaceTypeByPlaceId", () => {
  /**
   * Place id consists of 2 numbers separated by comma
   * 1st number - an id of the place
   * 2nd number - an id of the place type
   */
  it("returns city by default", () => {
    expect(getPlaceTypeByPlaceId()).toEqual(AutoCompleteType.CITY);
  });

  it("returns airport if ,2 in placeid", () => {
    expect(getPlaceTypeByPlaceId("10,2")).toEqual(AutoCompleteType.AIRPORT);
  });

  it("returns train_station if ,6 in placeid", () => {
    expect(getPlaceTypeByPlaceId("10,6")).toEqual(AutoCompleteType.TRAIN_STATION);
  });

  it("returns city for other placeid cases", () => {
    expect(getPlaceTypeByPlaceId("10,1")).toEqual(AutoCompleteType.CITY);

    expect(getPlaceTypeByPlaceId("10,3")).toEqual(AutoCompleteType.CITY);
    expect(getPlaceTypeByPlaceId("10,4")).toEqual(AutoCompleteType.CITY);
    expect(getPlaceTypeByPlaceId("10,5")).toEqual(AutoCompleteType.CITY);

    expect(getPlaceTypeByPlaceId("10,7")).toEqual(AutoCompleteType.CITY);
  });
});
