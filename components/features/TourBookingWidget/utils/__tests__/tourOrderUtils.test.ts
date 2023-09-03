import { constructOrderFormData } from "../tourOrderUtils";
import { mockDate1, mockDate2 } from "../mockBookingWidgetData";

describe("constructOrderFormData", () => {
  const pickupInformation1 = {
    pickupType: "pickup_list",
    pickupTime: "08:00",
    pickupAddress: "",
    placeId: 176,
    pickupFlightNumber: "",
    dropoffTime: "",
    dropoffPlaceId: 0,
    dropoffAddress: "",
    dropoffType: "",
    dropoffFlightNumber: "",
    specialRequest: "",
  };
  const pickupInformation2 = {
    pickupType: "package_address",
    pickupTime: "08:00",
    pickupAddress: "Skólavörðustígur 40",
    placeId: 0,
    pickupFlightNumber: "",
    dropoffTime: "13:00",
    dropoffPlaceId: 0,
    dropoffAddress: "",
    dropoffType: "package_airport",
    dropoffFlightNumber: "F12345",
    specialRequest: "",
  };
  const contactInformation = {
    name: "Hekla",
    phone: "1234567",
    email: "hekla@hekla.is",
    country: "IS",
  };
  const selectedDates = {
    from: mockDate1,
    to: mockDate2,
  };
  const tourId = 156;
  const pickupPlaceId = 176;
  const selectedPickupTime = "08:00";
  const numberOfTravelers = { adults: 4, teenagers: 1, children: 1 };
  const isFlexible = true;
  const hasPickup = true;
  const pickupInfo1 = `{"pickup":"pickup_list","pickup_place_id":"176","special_request":""}`;
  const pickupInfo2 = `{"pickup":"package_address","pickup_address":"Skólavörðustígur 40","dropoff":"package_airport","dropoff_airport_id":"1","dropoff_flight_number":"F12345","dropoff_departure_time":"13:00","special_request":""}`;
  const contactInfo = `{"name":"Hekla","phone":"1234567","email":"hekla@hekla.is","country":"IS"}`;
  const result1 = {
    date: "2019-05-06",
    time: "08:00",
    departureFlex: "1",
    adults: "4",
    teenagers: "1",
    children: "1",
    childrenAges: [],
    pickupType: "pickup_list",
    tourPickup: "1",
    tourId: "156",
    pickupInfo: pickupInfo1,
    contactInfo,
  };
  const result2 = {
    ...result1,
    pickupType: "package_address",
    pickupInfo: pickupInfo2,
  };
  test("", () => {
    expect(
      constructOrderFormData({
        tourId,
        selectedDates,
        selectedPickupTime,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        hasPickup,
        pickupPlaceId,
        pickupInformation: pickupInformation1,
        contactInformation,
      })
    ).toEqual(result1);
  });
  test("", () => {
    expect(
      constructOrderFormData({
        tourId,
        selectedDates,
        selectedPickupTime,
        numberOfTravelers,
        childrenAges: [],
        isFlexible,
        hasPickup,
        pickupPlaceId,
        pickupInformation: pickupInformation2,
        contactInformation,
      })
    ).toEqual(result2);
  });
});
