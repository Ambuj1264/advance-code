import { range, findFirst } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined, map } from "fp-ts/lib/Option";

import { getRoomOfferReference, getRoomTypeId } from "./stayBookingWidgetUtils";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { getQueryParams } from "utils/helperUtils";
import { getTotalGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

export const constructRoomCartRates = (
  rooms: StayBookingWidgetTypes.RoomOffer[],
  detailedRooms: StayBookingWidgetTypes.QueryDetailedRoom[]
) =>
  rooms.reduce((roomList, room) => {
    if (!room.isSelected) {
      return roomList;
    }
    const detailedRoom = detailedRooms.find(
      detailed =>
        getRoomOfferReference(detailed.rates[0].rateReference, detailed.rates[0].mesh) ===
        room.roomOfferRateReference
    );

    if (detailedRoom) {
      const rates = range(0, room.numberOfSelectedRooms - 1).map(index => {
        const rate = detailedRoom.rates[index];
        return {
          provider: rate.provider,
          rateReference: rate.rateReference,
          subprovider: rate.subProvider,
          mesh: rate.mesh,
          numberOfAdults: rate.roomRates[0].numberOfAdults,
          numberOfChildren: rate.roomRates[0].numberOfChildren,
          price: {
            currency: rate.price.currency,
            value: rate.price.value,
          },
        };
      });
      return [...roomList, ...rates];
    }
    return roomList;
  }, [] as StayBookingWidgetTypes.CartRate[]);

export const constructCartRates = (
  groupedRates: StayBookingWidgetTypes.QueryGroupedRate[],
  roomTypes: StayBookingWidgetTypes.RoomType[]
) =>
  roomTypes.reduce((roomTypeList, roomType) => {
    const groupedRate = groupedRates.find(room => {
      const { roomType: roomTypeCode } = room.detailedRooms[0].rates[0].roomRates[0].room[0];
      const groupedRateId = getRoomTypeId(room.title, roomTypeCode);
      return groupedRateId === roomType.roomTypeId;
    });
    const cartRoom = constructRoomCartRates(roomType.roomOffers, groupedRate?.detailedRooms ?? []);
    return [...roomTypeList, ...cartRoom];
  }, [] as StayBookingWidgetTypes.CartRate[]);

export const constructGTIStayCartInput = ({
  groupedRates,
  roomTypes,
  selectedDates,
  occupancies,
  productPageUri,
  productId,
  cartItemId,
}: StayBookingWidgetTypes.StayAddToCartData) => {
  const numberOfGuests = getTotalGuests(occupancies);
  return {
    cartItemId,
    dateCheckingIn: getFormattedDate(selectedDates.from!, yearMonthDayFormat),
    dateCheckingOut: getFormattedDate(selectedDates.to!, yearMonthDayFormat),
    totalNumberOfAdults: numberOfGuests.numberOfAdults,
    totalNumberOfChildren: numberOfGuests.childrenAges.length,
    childrenAges: numberOfGuests.childrenAges,
    rates: constructCartRates(groupedRates, roomTypes),
    productPageUri,
    productId,
  };
};

export const constructOldRoomCartRates = (rooms: StayBookingWidgetTypes.DetailedRoom[]) =>
  rooms.reduce((roomList, room) => {
    if (!room.isSelected) {
      return roomList;
    }
    const rates = range(0, room.numberOfSelectedRooms - 1).map(index => {
      const rate = room.rates[index];
      return {
        provider: rate.provider,
        rateReference: rate.rateReference,
        subprovider: rate.subProvider,
        mesh: rate.mesh,
        numberOfAdults: rate.roomRates[0].numberOfAdults,
        numberOfChildren: rate.roomRates[0].numberOfChildren,
        price: {
          currency: rate.price.currency,
          value: rate.price.value,
        },
      };
    });
    return [...roomList, ...rates];
  }, [] as StayBookingWidgetTypes.CartRate[]);

export const constructOldCartRates = (roomTypes: StayBookingWidgetTypes.GroupedRate[]) =>
  roomTypes.reduce((roomTypeList, roomType) => {
    const cartRoom = constructOldRoomCartRates(roomType.detailedRooms);
    return [...roomTypeList, ...cartRoom];
  }, [] as StayBookingWidgetTypes.CartRate[]);

export const constructOldStayCartInput = ({
  roomTypes,
  selectedDates,
  numberOfGuests,
  productPageUri,
  productId,
  cartItemId,
}: StayBookingWidgetTypes.OldStayAddToCartData) => ({
  cartItemId,
  dateCheckingIn: getFormattedDate(selectedDates.from!, yearMonthDayFormat),
  dateCheckingOut: getFormattedDate(selectedDates.to!, yearMonthDayFormat),
  totalNumberOfAdults: numberOfGuests.adults,
  totalNumberOfChildren: numberOfGuests.children.length,
  childrenAges: numberOfGuests.children,
  rates: constructOldCartRates(roomTypes),
  productPageUri,
  productId,
});

export const constructStayCartInput = ({
  productId,
  roomCombinations,
}: {
  productId: number;
  roomCombinations: StayBookingWidgetTypes.RoomCombination[];
}) => {
  const selectedRoomCombination = roomCombinations.find(roomCombination =>
    roomCombination.availabilities.some(availability => availability.isSelected)
  );
  const selectedAvailabilityId = selectedRoomCombination
    ? selectedRoomCombination.availabilities.find(availability => availability.isSelected)
        ?.availabilityId ?? ""
    : "";

  return {
    productId,
    availabilityIds: [selectedAvailabilityId],
    isForVacationPackage: false,
  };
};

export const getCartItemIdFromQuery = () =>
  pipe(
    getQueryParams(),
    findFirst(([key]) => key === "cart_item"),
    map(([, value]) => value),
    toUndefined
  );

export const getCartItem = (cartItems?: StayBookingWidgetTypes.CartStay[], cartItemId?: string) =>
  cartItems?.find(
    (cartItem: StayBookingWidgetTypes.CartStay) =>
      Number(cartItem.cartItemId?.replace(/[^0-9.]/g, "")) === Number(cartItemId)
  );
