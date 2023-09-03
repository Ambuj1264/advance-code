// eslint-disable-next-line import/no-duplicates
import dateFnsParse from "date-fns/parse";
import { pipe } from "fp-ts/lib/pipeable";
import { findFirst } from "fp-ts/lib/Array";
import { fromNullable, map, toUndefined, getOrElse } from "fp-ts/lib/Option";
// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";

import { getTourPickup } from "./tourBookingWidgetUtils";

import { TransportPickup } from "types/enums";
import { yearMonthDayFormat } from "utils/dateUtils";

const constructOrderItem = (item: TourOrderTypes.QueryItem, orderId: number) => ({
  itemId: orderId,
  productId: item.productId,
  type: item.type,
  name: item.name,
  persons: item.persons,
  adults: item.adults,
  teenagers: item.teenagers || 0,
  children: item.children || 0,
  date: dateFnsParse(item.date, yearMonthDayFormat, new Date()),
  time: item.time,
  tourDetails: {
    pickupType: item.tourDetails.pickupType,
    tourPickup: item.tourDetails.tourPickup,
    placeId: item.tourDetails.placeId || 0,
    placeName: item?.tourDetails.placeName?.trim() ?? "",
    pickupAddress: item.tourDetails.pickupAddress || "",
    pickupTime: item.tourDetails.pickupTime || "",
    pickupAirportId: item.tourDetails.pickupAirportId || 0,
    pickupFlightNumber: item.tourDetails.pickupFlightNumber || "",
    dropoffTime: item.tourDetails.dropoffTime || "",
    dropoffPlaceId: item.tourDetails.dropoffPlaceId || 0,
    dropoffAddress: item.tourDetails.dropoffAddress || "",
    dropoffAirportId: item.tourDetails.dropoffAirportId || 0,
    dropoffFlightNumber: item.tourDetails.dropoffFlightNumber || "",
    options: item.tourDetails.options ?? [],
  },
  editLock: item.editLock,
});

export const constructOrder = (order: TourOrderTypes.QueryOrder) =>
  pipe(
    fromNullable(order.orderAsCart),
    map(orderAsCart => ({
      id: orderAsCart.id,
      customerData: orderAsCart.customerData,
      items: order.orderAsCart.items.map((item: TourOrderTypes.QueryItem) =>
        constructOrderItem(item, order.orderAsCart.id)
      ),
    })),
    toUndefined
  );

export const getOrderItem = (productId: number, orderItems: TourBookingWidgetTypes.EditItem[]) =>
  pipe(
    orderItems,
    findFirst((orderItem: TourBookingWidgetTypes.EditItem) => orderItem.productId === productId),
    toUndefined
  );

export const constructOrderFormData = ({
  tourId,
  selectedDates,
  selectedPickupTime = "",
  numberOfTravelers,
  childrenAges,
  isFlexible,
  hasPickup,
  pickupPlaceId,
  pickupInformation,
  contactInformation,
}: {
  tourId: number;
  selectedDates: SharedTypes.SelectedDates;
  selectedPickupTime?: string;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges: number[];
  isFlexible: boolean;
  pickupPlaceId: number;
  hasPickup: boolean;
  pickupInformation: TourOrderTypes.PickupInformation;
  contactInformation: TourOrderTypes.ContactInformation;
}): TourBookingWidgetTypes.FormData => {
  const { adults, teenagers, children } = numberOfTravelers;
  const date = pipe(
    selectedDates.from,
    fromNullable,
    map(fromDate => format(fromDate, yearMonthDayFormat)),
    getOrElse(() => "")
  );
  const time = pipe(
    selectedPickupTime,
    fromNullable,
    map(selectedTime => (selectedTime === "Flexible" ? "" : selectedTime)),
    getOrElse(() => "")
  );
  const { pickupType } = pickupInformation;
  const { dropoffType } = pickupInformation;
  const airportPickup = `"pickup_airport_id":"1","pickup_flight_number":"${pickupInformation.pickupFlightNumber}",`;
  const packageAddressPickup = `"pickup_address":"${pickupInformation.pickupAddress}",`;
  const otherPickup = `"pickup_place_id":"${pickupPlaceId}",`;
  const airportDropoff = `"dropoff_airport_id":"1","dropoff_flight_number":"${pickupInformation.dropoffFlightNumber}","dropoff_departure_time":"${pickupInformation.dropoffTime}",`;
  const packageAddressDropoff = `"dropoff_address":"${pickupInformation.dropoffAddress}",`;
  const pickupValues = () => {
    if (pickupType === TransportPickup.Airport) {
      return airportPickup;
    }
    if (pickupType === TransportPickup.PackageAddress) {
      return packageAddressPickup;
    }
    return otherPickup;
  };
  const dropoffValues = () => {
    if (dropoffType === TransportPickup.Airport) {
      return airportDropoff;
    }
    if (dropoffType === TransportPickup.PackageAddress) {
      return packageAddressDropoff;
    }
    return "";
  };
  const dropoff = dropoffType !== "" ? `"dropoff":"${dropoffType}",` : "";
  const pickupInfo = `{"pickup":"${pickupType}",${pickupValues()}${dropoff}${dropoffValues()}"special_request":"${
    pickupInformation.specialRequest
  }"}`;
  const pickupTime =
    pickupType === TransportPickup.Airport || pickupType === TransportPickup.PackageAddress
      ? pickupInformation.pickupTime
      : time;
  const contactInfo = `{"name":"${contactInformation.name}","phone":"${contactInformation.phone}","email":"${contactInformation.email}","country":"${contactInformation.country}"}`;
  return {
    date,
    time: pickupTime,
    departureFlex: isFlexible ? "1" : "0",
    adults: adults.toString(),
    teenagers: teenagers.toString(),
    children: children.toString(),
    childrenAges,
    pickupType,
    tourPickup: getTourPickup(pickupType, hasPickup) ? "1" : "0",
    tourId: tourId.toString(),
    pickupInfo,
    contactInfo,
  };
};
