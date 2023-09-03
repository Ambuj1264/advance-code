import {
  mockRoomCombination1,
  mockRoomCombination2,
} from "components/features/StayProductPage/utils/stayMockData";

export const staysAvailabilityQueryMockParams = {
  dateCheckingIn: "2021-12-26",
  dateCheckingOut: "2021-12-30",
  numberOfAdults: 1,
  numberOfChildren: 0,
  childrenAges: [],
};

export const staysInfoModalContentMockParams = {
  productTitle: "Rosewood London",
  attractionsConditions: {
    latitude: 64.14049,
    longitude: -21.926903,
  },
  queryCondition: { stayProductId: 358917 },
  productId: 358917,
  searchUrl: "",
};

const stayMainImage = {
  id: "drh",
  handle: "SJOaplkew45g",
};

export const mockStayProduct: VacationPackageTypes.VacationPackageStayProduct = {
  day: 1,
  type: "Quality",
  price: 96.206,
  selected: true,
  name: "Danhostel Odense City",
  mainImage: stayMainImage,
  description:
    "<p>Enjoy your vacation in the city of Tommerup Stationsby at Danhostel Odense City. This 5-star hotel offers you everything you'll need for an enjoyable holiday, including elevator, private parking, and much more. </p>\n\n<p>This accommodation has an average rating of 3.7 out of 5 and has been reviewed by 155 guests. </p>\n\n<p>The distance from Danhostel Odense City to Aarhus Lufthavn is 64.7 miles (104.1 km). </p>\n\n<p>Danhostel Odense City is located in the neighborhood of Odense Kommune. This accommodation is ideal for exploring the most famous attractions in the city of Tommerup Stationsby. The 5-star hotel is located 14.8 miles (23.8 km) from the city center. </p>\n\n<p>The location of your hotel means you'll have easy access to the best attractions in the city of Tommerup Stationsby like Odense Zoo, H. C. Andersens House, and Danmarks Jernbanemuseum. The distance from the hotel to Odense Zoo is 1.9 miles (3.0 km). </p>\n\n<p>Danhostel Odense City has 4 different types of rooms available to relax in after a long day of traveling and exploring. </p>\n\n<p>Danhostel Odense City offers breakfast for a fee. </p>\n\n<p>Check-in at the hotel starts at 4:00 and check-out is before 10:00 AM. </p>\n\n<p>Danhostel Odense City is one of the most popular 5-star hotels in the city of Tommerup Stationsby. Reserve now before it's fully booked!</p>.",
  distanceFromCenter: 23.8,
  checkInTime: "4:00 PM",
  checkOutTime: "10:00 AM",
  quickFacts: [
    {
      icon: {
        handle: "f76Gf1D6QR2MH6zJeM3j",
      },
      title: null,
      name: {
        value: "{starClass} Star Hotel",
      },
    },
    {
      icon: {
        handle: "nAR07jOARKUqy7SMFOmK",
      },
      title: "Location",
      name: {
        value: "{distanceFromCenter} km from centre",
      },
    },
  ],
  productId: 454858,
  currency: "EUR",
  rating: 3.700000047683716,
  userRatingsTotal: 155,
  lat: 55.40112,
  lng: 10.38649,
  address: "Østre Stationsvej 31, Odense, Dk",
  starClass: 5,
  roomCombinations: [mockRoomCombination1],
  subtype: "Hotel",
  hotelRegionId: 280554,
  groupedWithDays: [1, 2],
};

export const mockStayProductNoQuickFacts: VacationPackageTypes.VacationPackageStayProduct = {
  day: 1,
  type: "Budget",
  price: 96.206,
  name: "Danhostel Odense City",
  mainImage: stayMainImage,
  description:
    "<p>Enjoy your vacation in the city of Tommerup Stationsby at Danhostel Odense City. This 5-star hotel offers you everything you'll need for an enjoyable holiday, including elevator, private parking, and much more. </p>\n\n<p>This accommodation has an average rating of 3.7 out of 5 and has been reviewed by 155 guests. </p>\n\n<p>The distance from Danhostel Odense City to Aarhus Lufthavn is 64.7 miles (104.1 km). </p>\n\n<p>Danhostel Odense City is located in the neighborhood of Odense Kommune. This accommodation is ideal for exploring the most famous attractions in the city of Tommerup Stationsby. The 5-star hotel is located 14.8 miles (23.8 km) from the city center. </p>\n\n<p>The location of your hotel means you'll have easy access to the best attractions in the city of Tommerup Stationsby like Odense Zoo, H. C. Andersens House, and Danmarks Jernbanemuseum. The distance from the hotel to Odense Zoo is 1.9 miles (3.0 km). </p>\n\n<p>Danhostel Odense City has 4 different types of rooms available to relax in after a long day of traveling and exploring. </p>\n\n<p>Danhostel Odense City offers breakfast for a fee. </p>\n\n<p>Check-in at the hotel starts at 4:00 and check-out is before 10:00 AM. </p>\n\n<p>Danhostel Odense City is one of the most popular 5-star hotels in the city of Tommerup Stationsby. Reserve now before it's fully booked!</p>.",
  distanceFromCenter: 23.8,
  checkInTime: "4:00 PM",
  checkOutTime: "10:00 AM",
  productId: 454858,
  currency: "EUR",
  rating: 3.700000047683716,
  userRatingsTotal: 155,
  lat: 55.40112,
  lng: 10.38649,
  address: "Østre Stationsvej 31, Odense, Dk",
  starClass: 5,
  roomCombinations: [mockRoomCombination2],
  selected: true,
  subtype: "Hotel",
  hotelRegionId: 280554,
  groupedWithDays: [1, 2],
};

const mockStaysProductBudget = { ...mockStayProduct, type: "Budget" };
const mockStaysProductQuality = {
  ...mockStayProduct,
  type: "Quality",
  selected: false,
};
const mockStaysProductComfort = {
  ...mockStayProduct,
  type: "Comfort",
  selected: false,
};

export const mockProductsArrayUnsorted = [
  mockStaysProductComfort,
  mockStaysProductQuality,
  mockStaysProductBudget,
];

export const mockProductsArraySorted = [
  mockStaysProductBudget,
  mockStaysProductComfort,
  mockStaysProductQuality,
];

export const mockVPSearchPageQueryParams = {
  tripId: "ISL-2DAY-KEF-KEF",
  requestId: "blah-requestId",
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [9, 1],
    },
  ],
  selectedDates: {
    from: new Date("2021-12-15:00:00:00"),
    to: new Date("2021-12-30:00:00:00"),
  },
  withQueryParams: true,
  isMobile: false,
};

export const mockVPStaysSearchQueryParams = {
  requestId: "blah-requestId",
  from: "2021-12-15",
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [9, 1],
    },
  ],
  vacationPackageId: "ISL-2DAY-KEF-KEF",
  isMobile: false,
};

export const mockVPSearchPageQueryParamsInfantsChildren = {
  ...mockVPSearchPageQueryParams,
  numberOfGuests: {
    adults: 1,
    children: [8, 5, 1, 2],
  },
  withQueryParams: true,
};

export const mockVPStaysSearchQueryParamsInfantsChildren = {
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [9, 1],
    },
  ],
  from: "2021-12-15",
  vacationPackageId: "ISL-2DAY-KEF-KEF",
  requestId: "blah-requestId",
  isMobile: false,
};

export const mockHotels: VacationPackageTypes.VacationPackageStayProduct[] = [
  mockStayProduct,
  {
    ...mockStayProduct,
    groupedWithDays: [1, 2],
    day: 1,
    productId: 454859,
    selected: true,
  },
  {
    ...mockStayProduct,
    groupedWithDays: [1, 2],
    day: 1,
    productId: 454860,
    selected: false,
  },
  { ...mockStayProduct, groupedWithDays: [1, 2], day: 2, productId: 454858 },
  {
    ...mockStayProduct,
    groupedWithDays: [1, 2],
    day: 2,
    productId: 454859,
    selected: true,
  },
  {
    ...mockStayProduct,
    groupedWithDays: [1, 2],
    day: 2,
    productId: 454860,
    selected: false,
  },
  {
    ...mockStayProduct,
    groupedWithDays: [3],
    day: 3,
    productId: 454861,
    selected: true,
  },
  { ...mockStayProduct, groupedWithDays: [3], day: 3, productId: 454862 },
  {
    ...mockStayProduct,
    groupedWithDays: [3],
    day: 3,
    productId: 454863,
    selected: false,
  },
  {
    ...mockStayProduct,
    groupedWithDays: [4, 5],
    day: 4,
    productId: 454864,
    selected: true,
  },
  { ...mockStayProduct, groupedWithDays: [4, 5], day: 4, productId: 454865 },
  {
    ...mockStayProduct,
    groupedWithDays: [4, 5],
    day: 4,
    productId: 454866,
    selected: false,
  },
  {
    ...mockStayProduct,
    groupedWithDays: [4, 5],
    day: 5,
    productId: 454864,
    selected: true,
  },
  { ...mockStayProduct, groupedWithDays: [4, 5], day: 5, productId: 454865 },
  {
    ...mockStayProduct,
    groupedWithDays: [4, 5],
    day: 5,
    productId: 454866,
    selected: false,
  },
];

export const mockSelectedRoom: VacationPackageTypes.SelectedVPStaysRoomType = {
  productId: 454858,
  day: 1,
  groupedWithDays: [1],
  title: "Title 1",
  fromPrice: 10,
  dateCheckingIn: "2021-12-26",
  dateCheckingOut: "2021-12-30",
  roomCombinations: [mockRoomCombination1],
};

export const mockSelectedRooms: VacationPackageTypes.SelectedVPStaysRoomType[] = [
  {
    ...mockSelectedRoom,
    groupedWithDays: [1, 2],
  },
  { ...mockSelectedRoom, day: 2, title: "Title 2", groupedWithDays: [1, 2] },
  {
    ...mockSelectedRoom,
    day: 3,
    groupedWithDays: [3],
    title: "Title 3",
    productId: 454862,
    roomCombinations: [
      {
        ...mockRoomCombination2,
        isSelected: true,
        availabilities: mockRoomCombination2.availabilities.map(availability => ({
          ...availability,
          isSelected: true,
        })),
      },
    ],
  },
];

const mockSelectedRoomType = {
  productId: 454858,
  day: 1,
  groupedWithDays: [1, 2],
  title: "2x Double room",
  fromPrice: 105,
  dateCheckingIn: "",
  dateCheckingOut: "",
  roomCombinations: [mockRoomCombination1],
};

export const mockSelectedRoomTypes = [
  mockSelectedRoomType,
  { ...mockSelectedRoomType, day: 3, productId: 454861, groupedWithDays: [3] },
  { ...mockSelectedRoomType, day: 4, productId: 454864, groupedWithDays: [4, 5] },
];
