import {
  MealType,
  OrderStayCancellationType,
  StayProvider,
  RoomType,
  PaymentType,
} from "../types/enums";

import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

export const mockStayGroupedRates: StayBookingWidgetTypes.QueryGroupedRate[] = [
  {
    title: "Double room",
    fromPrice: 105,
    rateReference: "",
    maxOccupancy: 2,
    detailedRooms: [
      {
        availableRooms: 2,
        rates: [
          {
            provider: StayProvider.ANIXE,
            productId: 478675,
            booked: false,
            canceled: false,
            rateReference: "2987RO",
            subProvider: "SUNHOTELS",
            mesh: "13249yfhn1",
            providerCode: "30749",
            providerBookingCode: "RO:SR_$_80928393_23_$_A1C0I0_*_",
            price: {
              currency: "EUR",
              value: 122,
            },
            roomRates: [
              {
                index: 1,
                roomRateName: "Double room with mountain view",
                room: [
                  {
                    name: "Superior Double",
                    roomType: RoomType.DOUBLE_ROOM,
                    specialType: "SR",
                    providerCode: "DSDYYYY",
                    subProviderCode: "23",
                  },
                ],
                meal: {
                  mealType: MealType.ROOM_ONLY,
                  subProviderCode: "1",
                },
                numberOfAdults: 2,
                numberOfChildren: 0,
                cancellationType: OrderStayCancellationType.FEE_APPLIES,
                paymentType: PaymentType.PAY_BEFORE,
              },
            ],
            cancellationPolicies: [
              {
                dateFrom: getFormattedDate(new Date(), yearMonthDayFormat),
                dateTo: getFormattedDate(new Date(), yearMonthDayFormat),
                price: {
                  currency: "EUR",
                  value: 78,
                },
              },
            ],
          },
          {
            provider: StayProvider.ANIXE,
            productId: 478675,
            booked: false,
            canceled: false,
            rateReference: "2987RO",
            subProvider: "SUNHOTELS",
            mesh: "13249yfhn1",
            providerCode: "30749",
            providerBookingCode: "RO:SR_$_80928393_23_$_A1C0I0_*_",
            price: {
              currency: "EUR",
              value: 122,
            },
            roomRates: [
              {
                index: 1,
                roomRateName: "Double room with mountain view",
                room: [
                  {
                    name: "Superior Double",
                    roomType: RoomType.DOUBLE_ROOM,
                    specialType: "SR",
                    providerCode: "DSDYYYY",
                    subProviderCode: "23",
                  },
                ],
                meal: {
                  mealType: MealType.ROOM_ONLY,
                  subProviderCode: "1",
                },
                numberOfAdults: 2,
                numberOfChildren: 0,
                cancellationType: OrderStayCancellationType.FEE_APPLIES,
                paymentType: PaymentType.PAY_BEFORE,
              },
            ],
            cancellationPolicies: [
              {
                dateFrom: getFormattedDate(new Date(), yearMonthDayFormat),
                dateTo: getFormattedDate(new Date(), yearMonthDayFormat),
                price: {
                  currency: "EUR",
                  value: 78,
                },
              },
            ],
          },
        ],
      },
      {
        availableRooms: 1,
        rates: [
          {
            provider: StayProvider.ANIXE,
            productId: 478675,
            booked: false,
            canceled: false,
            rateReference: "2987BB",
            subProvider: "SUNHOTELS",
            mesh: "1324fk2w381",
            providerCode: "30749",
            providerBookingCode: "RO:SR_$_91717932_1177_$_A1C0I0_*_",
            price: {
              currency: "EUR",
              value: 132,
            },
            roomRates: [
              {
                index: 1,
                roomRateName: "Double room with ocean view",
                room: [
                  {
                    name: "Superior Double",
                    roomType: RoomType.DOUBLE_ROOM,
                    specialType: "SR",
                    providerCode: "DSDYYYY",
                    subProviderCode: "1177",
                  },
                ],
                meal: {
                  mealType: MealType.ROOM_ONLY,
                  subProviderCode: "1",
                },
                numberOfAdults: 2,
                numberOfChildren: 0,
                cancellationType: OrderStayCancellationType.FEE_APPLIES,
                paymentType: PaymentType.PAY_BEFORE,
              },
            ],
            cancellationPolicies: [
              {
                dateFrom: getFormattedDate(new Date(), yearMonthDayFormat),
                dateTo: getFormattedDate(new Date(), yearMonthDayFormat),
                price: {
                  currency: "EUR",
                  value: 78,
                },
              },
            ],
          },
          {
            provider: StayProvider.ANIXE,
            productId: 478675,
            booked: false,
            canceled: false,
            rateReference: "2987BB",
            subProvider: "SUNHOTELS",
            mesh: "1324fk2w381",
            providerCode: "30749",
            providerBookingCode: "RO:SR_$_91717932_1177_$_A1C0I0_*_",
            price: {
              currency: "EUR",
              value: 132,
            },
            roomRates: [
              {
                index: 1,
                roomRateName: "Double room with ocean view",
                room: [
                  {
                    name: "Superior Double",
                    roomType: RoomType.DOUBLE_ROOM,
                    specialType: "SR",
                    providerCode: "DSDYYYY",
                    subProviderCode: "1177",
                  },
                ],
                meal: {
                  mealType: MealType.ROOM_ONLY,
                  subProviderCode: "1",
                },
                numberOfAdults: 1,
                numberOfChildren: 0,
                cancellationType: OrderStayCancellationType.FEE_APPLIES,
                paymentType: PaymentType.PAY_BEFORE,
              },
            ],
            cancellationPolicies: [
              {
                dateFrom: getFormattedDate(new Date(), yearMonthDayFormat),
                dateTo: getFormattedDate(new Date(), yearMonthDayFormat),
                price: {
                  currency: "EUR",
                  value: 78,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Double deluxe room",
    fromPrice: 97,
    rateReference: "",
    maxOccupancy: 2,
    detailedRooms: [
      {
        availableRooms: 2,
        rates: [
          {
            provider: StayProvider.ANIXE,
            productId: 478675,
            booked: false,
            canceled: false,
            rateReference: "2987DD",
            subProvider: "HOTELSTON",
            mesh: "13249yfafwhn1",
            providerCode: "55980692",
            providerBookingCode: "BB:SR_$_26402072261_3174311669_2359298_1_0_$_A1C0I0_*_",
            price: {
              currency: "EUR",
              value: 1992.716,
            },
            roomRates: [
              {
                index: 1,
                roomRateName: "Double room",
                room: [
                  {
                    name: "Standard Single",
                    roomType: RoomType.DOUBLE_ROOM,
                    specialType: "SR",
                    providerCode: "RANDOM9",
                    subProviderCode: "26402072261",
                  },
                ],
                meal: {
                  mealType: MealType.BED_AND_BREAKFAST,
                  subProviderCode: "2359298",
                },
                numberOfAdults: 2,
                numberOfChildren: 0,
                cancellationType: OrderStayCancellationType.UNKNOWN,
                paymentType: PaymentType.PAY_BEFORE,
              },
            ],
            cancellationPolicies: [],
          },
        ],
      },
    ],
  },
];

const expectedRoomRates = mockStayGroupedRates[0].detailedRooms[0].rates[0];

export const mockStayCartInputRates = [
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
];

export const mockStayCartInputRates2 = [
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
  {
    mesh: expectedRoomRates.mesh,
    numberOfAdults: 2,
    numberOfChildren: 0,
    price: {
      currency: expectedRoomRates.price.currency,
      value: 122,
    },
    provider: expectedRoomRates.provider,
    rateReference: expectedRoomRates.rateReference,
    subprovider: expectedRoomRates.subProvider,
  },
];
