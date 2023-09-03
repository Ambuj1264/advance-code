import {
  MealType,
  OrderStayCancellationType,
  RoomType,
  BedType,
} from "../StayBookingWidget/types/enums";

import RoomSizeIcon from "components/icons/expand-horizontal-4.svg";
import PersonsIcon from "components/icons/travellers.svg";
import BedIcon from "components/icons/hotel-bedroom.svg";
import ShowerIcon from "components/icons/bathroom-shower.svg";
import WifiIcon from "components/icons/wifi-check.svg";
import { Availability } from "types/enums";

const queryImage1 = {
  id: "",
  caption: "",
  handle: "t2NQlNGASw29a2qIN0Qs",
};

export const image1 = {
  id: "",
  name: "",
  url: `https://gte-gcms.imgix.net/t2NQlNGASw29a2qIN0Qs`,
};
export const mockStayRoomOffer1: StayBookingWidgetTypes.RoomOffer = {
  roomOfferName: "Double room with mountain view",
  availableRooms: 2,
  priceObject: {
    price: 122,
    currency: "EUR",
    priceDisplayValue: "122",
  },
  roomOfferRateReference: "2987RO-13249yfhn1",
  mealType: MealType.ROOM_ONLY,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  freeCancellationUntil: new Date("2022-11-14"),
  availabilityIds: ["13249yfhn1"],
  isSelected: true,
  numberOfSelectedRooms: 2,
};

export const mockStayRoomOffer2: StayBookingWidgetTypes.RoomOffer = {
  roomOfferName: "Double room with ocean view",
  availableRooms: 1,
  priceObject: {
    price: 132,
    currency: "EUR",
    priceDisplayValue: "132",
  },
  mealType: MealType.ROOM_ONLY,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  freeCancellationUntil: new Date("2022-11-14"),
  availabilityIds: ["1324fk2w381"],
  isSelected: false,
  numberOfSelectedRooms: 0,
};

export const mockStayRoomOffer3: StayBookingWidgetTypes.RoomOffer = {
  roomOfferName: "Twin room with mountain view",
  availableRooms: 3,
  priceObject: {
    price: 142,
    currency: "EUR",
    priceDisplayValue: "142",
  },
  mealType: MealType.ROOM_ONLY,
  cancellationType: OrderStayCancellationType.NON_REFUNDABLE,
  freeCancellationUntil: undefined,
  availabilityIds: ["132493ufhjnyfhn1"],
  isSelected: false,
  numberOfSelectedRooms: 0,
};

export const mockStayRoomOffer4: StayBookingWidgetTypes.RoomOffer = {
  roomOfferName: "Double room with mountain view",
  availableRooms: 2,
  priceObject: {
    price: 122,
    currency: "EUR",
    priceDisplayValue: "122",
  },
  mealType: MealType.BED_AND_BREAKFAST,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  freeCancellationUntil: new Date("2022-11-14"),
  availabilityIds: ["13249yfhn1"],
  isSelected: false,
  numberOfSelectedRooms: 0,
};

export const mockStayRoomOffer5: StayBookingWidgetTypes.RoomOffer = {
  roomOfferName: "Twin room with mountain view",
  availableRooms: 3,
  priceObject: {
    price: 142,
    currency: "EUR",
    priceDisplayValue: "142",
  },
  mealType: MealType.ROOM_ONLY,
  cancellationType: OrderStayCancellationType.NON_REFUNDABLE,
  freeCancellationUntil: undefined,
  availabilityIds: ["132493ufhjnyfhn1"],
  isSelected: false,
  numberOfSelectedRooms: 0,
};

export const mockStayRoomType: StayBookingWidgetTypes.RoomType = {
  roomTypeId: "DOUBLE_ROOM-Double-room",
  roomTypeName: "Double room",
  roomType: RoomType.DOUBLE_ROOM,
  fromPriceObject: {
    price: 105,
    currency: "EUR",
    priceDisplayValue: "105",
  },
  totalAvailableRooms: 2,
  images: [image1, image1],
  numberOfPersons: 2,
  productSpecs: [
    {
      Icon: PersonsIcon,
      value: "2 persons",
    },
    {
      Icon: RoomSizeIcon,
      value: "14m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "1x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private",
    },
    {
      Icon: WifiIcon,
      value: "Free",
    },
  ],
  roomDetails: [],
  roomOffers: [mockStayRoomOffer1, mockStayRoomOffer2],
};

export const mockStayRoomType1: StayBookingWidgetTypes.RoomType = {
  roomTypeId: "DOUBLE_ROOM-Double-room",
  roomTypeName: "Double room",
  roomType: RoomType.DOUBLE_ROOM,
  fromPriceObject: {
    price: 105,
    currency: "EUR",
    priceDisplayValue: "105",
  },
  totalAvailableRooms: 2,
  images: [image1, image1],
  numberOfPersons: 2,
  productSpecs: [
    {
      Icon: PersonsIcon,
      value: "{numberOfPersons} persons",
    },
    {
      Icon: RoomSizeIcon,
      value: "{roomSize}m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "1x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private",
    },
    {
      Icon: WifiIcon,
      value: "Free",
    },
  ],
  roomDetails: [],
  roomOffers: [mockStayRoomOffer4],
};

export const mockStayRoomType2: StayBookingWidgetTypes.RoomType = {
  roomTypeId: "TWIN_BED_ROOM-Twin-room",
  roomTypeName: "Twin room",
  roomType: RoomType.TWIN_BED_ROOM,
  fromPriceObject: {
    price: 122,
    currency: "EUR",
    priceDisplayValue: "122",
  },
  totalAvailableRooms: 2,
  images: [image1, image1],
  numberOfPersons: 2,
  productSpecs: [
    {
      Icon: PersonsIcon,
      value: "{numberOfPersons} persons",
    },
    {
      Icon: RoomSizeIcon,
      value: "{roomSize}m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "1x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private",
    },
    {
      Icon: WifiIcon,
      value: "Free",
    },
  ],
  roomDetails: [],
  roomOffers: [mockStayRoomOffer4, mockStayRoomOffer5],
};

export const mockStayQueryRoomOffer1: StayBookingWidgetTypes.QueryRoomOffer = {
  roomOfferName: "Double room with mountain view",
  availableRooms: 2,
  priceObject: {
    price: 122,
    currency: "EUR",
    priceDisplayValue: "122",
  },
  mealType: MealType.BED_AND_BREAKFAST,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  freeCancellationUntil: "2022-11-14",
  availabilityIds: ["13249yfhn1"],
};

export const mockStayQueryRoomOffer2: StayBookingWidgetTypes.QueryRoomOffer = {
  roomOfferName: "Twin room with mountain view",
  availableRooms: 3,
  priceObject: {
    price: 142,
    currency: "EUR",
    priceDisplayValue: "142",
  },
  mealType: MealType.ROOM_ONLY,
  cancellationType: OrderStayCancellationType.NON_REFUNDABLE,
  freeCancellationUntil: undefined,
  availabilityIds: ["132493ufhjnyfhn1"],
};

export const mockQueryStayRoomType1: StayBookingWidgetTypes.QueryRoomType = {
  roomTypeName: "Double room",
  roomType: RoomType.DOUBLE_ROOM,
  fromPriceObject: {
    price: 105,
    currency: "EUR",
    priceDisplayValue: "105",
  },
  totalAvailableRooms: 2,
  roomTypeInfo: {
    images: [queryImage1, queryImage1],
    numberOfPersons: 2,
    roomSize: 14,
    beds: [
      {
        bedType: BedType.DOUBLE,
        count: 1,
      },
    ],
    privateShower: true,
    wifiAvailability: Availability.FREE,
    amenities: [],
  },
  roomOffers: [mockStayQueryRoomOffer1],
};

export const mockQueryStayRoomType2: StayBookingWidgetTypes.QueryRoomType = {
  roomTypeName: "Twin room",
  roomType: RoomType.TWIN_BED_ROOM,
  fromPriceObject: {
    price: 122,
    currency: "EUR",
    priceDisplayValue: "122",
  },
  totalAvailableRooms: 2,
  roomTypeInfo: {
    images: [queryImage1, queryImage1],
    numberOfPersons: 2,
    roomSize: 14,
    beds: [
      {
        bedType: BedType.DOUBLE,
        count: 1,
      },
    ],
    privateShower: true,
    wifiAvailability: Availability.FREE,
    amenities: [],
  },
  roomOffers: [mockStayQueryRoomOffer1, mockStayQueryRoomOffer2],
};

export const mockQueryRoomCombinationRoom1: StayBookingWidgetTypes.QueryRoomCombinationRoom = {
  roomName: "Double room",
  images: [queryImage1, queryImage1],
  numberOfPersons: 2,
  roomSize: 12,
  beds: [
    {
      bedType: BedType.DOUBLE,
      count: 1,
    },
  ],
  privateShower: true,
  wifiAvailability: Availability.FREE,
  amenities: [],
};

export const mockQueryRoomCombinationRoom2: StayBookingWidgetTypes.QueryRoomCombinationRoom = {
  roomName: "Double room",
  images: [queryImage1, queryImage1],
  numberOfPersons: 2,
  roomSize: 12,
  beds: [
    {
      bedType: BedType.DOUBLE,
      count: 1,
    },
  ],
  privateShower: true,
  wifiAvailability: Availability.FREE,
  amenities: [],
};

const mockRoomCombinationAvailability1: StayBookingWidgetTypes.QueryRoomCombinationAvailability = {
  availabilityId: "slobgpsj23",
  freeCancellationUntil: "2022-11-14",
  mealType: MealType.BED_AND_BREAKFAST,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  isSelected: true,
  priceObject: {
    price: 105,
    currency: "EUR",
    priceDisplayValue: "105",
  },
};

const mockRoomCombinationAvailability2: StayBookingWidgetTypes.QueryRoomCombinationAvailability = {
  availabilityId: "slobgpsj2sdvb3",
  freeCancellationUntil: "2022-11-16",
  mealType: MealType.BED_AND_BREAKFAST,
  cancellationType: OrderStayCancellationType.FEE_APPLIES,
  isSelected: false,
  priceObject: {
    price: 114,
    currency: "EUR",
    priceDisplayValue: "114",
  },
};

export const mockQueryRoomCombination1: StayBookingWidgetTypes.QueryRoomCombination = {
  rooms: [mockQueryRoomCombinationRoom1, mockQueryRoomCombinationRoom2],
  availabilities: [mockRoomCombinationAvailability1],
};

export const mockQueryRoomCombination2: StayBookingWidgetTypes.QueryRoomCombination = {
  rooms: [
    {
      roomName: "Double room",
      images: [queryImage1, queryImage1],
      numberOfPersons: 2,
      roomSize: 12,
      beds: [
        {
          bedType: BedType.DOUBLE,
          count: 1,
        },
      ],
      privateShower: true,
      wifiAvailability: Availability.FREE,
      amenities: [],
    },
    {
      roomName: "Twin room",
      images: [queryImage1, queryImage1],
      numberOfPersons: 2,
      roomSize: 12,
      beds: [
        {
          bedType: BedType.SINGLE,
          count: 2,
        },
      ],
      privateShower: true,
      wifiAvailability: Availability.FREE,
      amenities: [],
    },
  ],
  availabilities: [mockRoomCombinationAvailability2],
};

export const mockRoomCombination1: StayBookingWidgetTypes.RoomCombination = {
  roomCombinationId: "Double-room-Double-room",
  title: "2x Double room",
  images: [image1, image1, image1, image1],
  productSpecs: [
    {
      Icon: PersonsIcon,
      value: "{numberOfPersons} persons, {numberOfRooms} rooms",
    },
    {
      Icon: RoomSizeIcon,
      value: "{roomSize}m\u00B2 + {roomSize}m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "2x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private, Private",
    },
    {
      Icon: WifiIcon,
      value: "Free, Free",
    },
  ],
  isSelected: true,
  availabilities: [
    {
      availabilityId: "slobgpsj23",
      freeCancellationUntil: new Date("2022-11-14"),
      priceObject: {
        price: 105,
        currency: "EUR",
        priceDisplayValue: "105",
      },
      mealType: MealType.BED_AND_BREAKFAST,
      cancellationType: OrderStayCancellationType.FEE_APPLIES,
      isSelected: true,
    },
  ],
  rooms: [
    {
      roomName: "Double room",
      images: [image1, image1],
      numberOfPersons: 2,
      productSpecs: [
        {
          Icon: PersonsIcon,
          value: "{numberOfPersons} persons",
        },
        {
          Icon: RoomSizeIcon,
          value: "{roomSize}m\u00B2",
        },
        {
          Icon: BedIcon,
          value: "1x Double bed",
        },
        {
          Icon: ShowerIcon,
          value: "Private",
        },
        {
          Icon: WifiIcon,
          value: "Free",
        },
      ],
      roomDetails: [],
    },
    {
      roomName: "Double room",
      images: [image1, image1],
      numberOfPersons: 2,
      productSpecs: [
        {
          Icon: PersonsIcon,
          value: "{numberOfPersons} persons",
        },
        {
          Icon: RoomSizeIcon,
          value: "{roomSize}m\u00B2",
        },
        {
          Icon: BedIcon,
          value: "1x Double bed",
        },
        {
          Icon: ShowerIcon,
          value: "Private",
        },
        {
          Icon: WifiIcon,
          value: "Free",
        },
      ],
      roomDetails: [],
    },
  ],
};

export const mockRoomCombination2: StayBookingWidgetTypes.RoomCombination = {
  roomCombinationId: "Double-room-Twin-room",
  title: "Double room + Twin room",
  images: [image1, image1, image1, image1],
  productSpecs: [
    {
      Icon: PersonsIcon,
      value: "{numberOfPersons} persons, {numberOfRooms} rooms",
    },
    {
      Icon: RoomSizeIcon,
      value: "{roomSize}m\u00B2 + {roomSize}m\u00B2",
    },
    {
      Icon: BedIcon,
      value: "2x Single bed, 1x Double bed",
    },
    {
      Icon: ShowerIcon,
      value: "Private, Private",
    },
    {
      Icon: WifiIcon,
      value: "Free, Free",
    },
  ],
  isSelected: false,
  availabilities: [
    {
      availabilityId: "slobgpsj2sdvb3",
      freeCancellationUntil: new Date("2022-11-16"),
      priceObject: {
        price: 114,
        currency: "EUR",
        priceDisplayValue: "114",
      },
      mealType: MealType.BED_AND_BREAKFAST,
      cancellationType: OrderStayCancellationType.FEE_APPLIES,
      isSelected: false,
    },
  ],
  rooms: [
    {
      roomName: "Double room",
      images: [image1, image1],
      numberOfPersons: 2,
      productSpecs: [
        {
          Icon: PersonsIcon,
          value: "{numberOfPersons} persons",
        },
        {
          Icon: RoomSizeIcon,
          value: "{roomSize}m\u00B2",
        },
        {
          Icon: BedIcon,
          value: "1x Double bed",
        },
        {
          Icon: ShowerIcon,
          value: "Private",
        },
        {
          Icon: WifiIcon,
          value: "Free",
        },
      ],
      roomDetails: [],
    },
    {
      roomName: "Twin room",
      images: [image1, image1],
      numberOfPersons: 2,
      productSpecs: [
        {
          Icon: PersonsIcon,
          value: "{numberOfPersons} persons",
        },
        {
          Icon: RoomSizeIcon,
          value: "{roomSize}m\u00B2",
        },
        {
          Icon: BedIcon,
          value: "2x Single bed",
        },
        {
          Icon: ShowerIcon,
          value: "Private",
        },
        {
          Icon: WifiIcon,
          value: "Free",
        },
      ],
      roomDetails: [],
    },
  ],
};
