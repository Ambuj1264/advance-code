import { SpecModelType, getSpecModel } from "./specModel";
import { ValuePropModelType, getValuePropModel } from "./valuePropModel";

export type RoomBookingsModelType = {
  extraBedCount: number;
  adults: number;
  children: number;
  mesh?: null;
  requestId?: null;
  source?: null;
  masterRateCode?: null;
  extras: [];
  __typename: string;
};

export const getRoomBookingsModelType = (): RoomBookingsModelType => ({
  extraBedCount: 0,
  adults: 2,
  children: 0,
  mesh: null,
  requestId: null,
  source: null,
  masterRateCode: null,
  extras: [],
  __typename: "OrderStayCartRoom",
});

export type RoomModelType = {
  id: number;
  type: string;
  name: string;
  privateBathroom: boolean;
  size: number;
  maxPersons: number;
  roomBookings: RoomBookingsModelType[];
  __typename: string;
};

export const getRoomModel = (): RoomModelType => ({
  id: 5951,
  type: "SR",
  name: "Cottages in Iceland",
  privateBathroom: true,
  size: 90,
  maxPersons: 7,
  roomBookings: [getRoomBookingsModelType()],
  __typename: "OrderStayCartRoom",
});

export type StayModelType = {
  id: number;
  productId: number;
  address: string;
  type: string;
  uri: string;
  numberOfGuests: number;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenAges: null;
  title: string;
  cartItemId: string;
  discountAmount: number;
  discountPercentage: number;
  totalPrice: number;
  imageUrl: string;
  available: boolean;
  editable: boolean;
  currency: string;
  from: string;
  to: string;
  updated: string;
  createdTime: string;
  cancellationPolicy: null;
  cancellationString: null;
  cityOsmId: null;
  cityName: null;
  countryOsmId: null;
  countryName: null;
  valueProps: ValuePropModelType[];
  rooms: RoomModelType[];
  specs: SpecModelType[];
  __typename: string;
};

export const getStayModel = (title?: string, totalPrice?: number): StayModelType => ({
  id: 1789975293,
  productId: 1234,
  address: "Brúnalaug ( Við þjóðveg 823 ), 601 Akureyri",
  type: "apartment",
  uri: "/accommodation/guesthouses/brunalaug-guesthouse-2",
  numberOfGuests: 2,
  numberOfAdults: 0,
  numberOfChildren: 0,
  childrenAges: null,
  title: title ?? "Brúnalaug Guesthouse - Holiday Home",
  cartItemId: "hotels-8",
  discountAmount: 0,
  discountPercentage: 0,
  totalPrice: totalPrice ?? 208000,
  imageUrl:
    "https://guidetoiceland.imgix.net/680984/x/0/119730558-jpg?crop=faces&fit=crop&h=239&ixlib=php-3.3.0&w=239",
  available: true,
  editable: true,
  currency: "ISK",
  from: "2022-08-16T00:00:00.000Z",
  to: "2022-08-24T00:00:00.000Z",
  updated: "2021-12-08T11:57:56.000Z",
  createdTime: "2021-12-08T11:57:56.000Z",
  cancellationPolicy: null,
  cancellationString: null,
  cityOsmId: null,
  cityName: null,
  countryOsmId: null,
  countryName: null,
  valueProps: [getValuePropModel()],
  rooms: [getRoomModel()],
  specs: [getSpecModel()],
  __typename: "OrderStayCartInfo",
});
