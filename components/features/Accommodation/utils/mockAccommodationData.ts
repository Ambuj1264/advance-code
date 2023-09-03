import { MapPointType } from "types/enums";
import {
  mockQueryImage0,
  mockQueryImage1,
  mockQueryImage2,
  mockImage0,
  mockImage1,
  mockImage2,
} from "utils/mockData/mockGlobalData";

export const mockHotelCategory: AccommodationTypes.Category = {
  id: 0,
  type: "hotel",
  name: "Hotels",
  singularName: "Hotel",
  uri: "hotels",
};

export const mockApartmentCategory: AccommodationTypes.Category = {
  id: 0,
  type: "apartment",
  name: "Apartments",
  singularName: "Apartment",
  uri: "apartments",
};

export const mockReviewTotalScore0 = "4.7";

export const mockReviewTotalCount0 = 200;

export const mockQueryAccommodation0: AccommodationTypes.QueryAccommodation = {
  id: 0,
  basePrice: 10000,
  url: "/acc0",
  minDays: 1,
  type: "hotel",
  name: "Hotel Höfn",
  information: "",
  latitude: 50.0,
  longitude: -33.6,
  isExternal: true,
  isIndexed: false,
  isDirectBooking: true,
  isSingleUnit: false,
  category: mockHotelCategory,
  image: mockQueryImage0,
  images: [mockQueryImage1],
  amenities: [],
  wifiAvailable: true,
  wifiPrice: 0,
  location: "Víkurbraut, Hofn, IS",
  breakfastAvailable: true,
  rooms: [],
  description: "Best hotel you well sleep in",
  localePrice: {
    price: 200,
    currency: "EUR",
  },
  translations: [],
  establishment: {
    id: 1,
    name: "Amazing accommodation all day every day ehf.",
  },
  specs: [],
  metadata: {
    title: "B14 Apartments & Rooms",
    description: "Best hotel you well sleep in",
  },
  props: [],
  reviewTotalScore: mockReviewTotalScore0,
  reviewTotalCount: mockReviewTotalCount0,
  showReviews: true,
  isHighlight: true,
  isAvailable: true,
};

export const mockQueryAccommodation1: AccommodationTypes.QueryAccommodation = {
  id: 1,
  basePrice: 10000,
  url: "/acc1",
  minDays: 2,
  type: "apartment",
  isSingleUnit: false,
  name: "B14 Apartments & Rooms",
  information: "",
  latitude: 52.0,
  longitude: -44.9,
  isExternal: false,
  isIndexed: false,
  isDirectBooking: false,
  category: mockApartmentCategory,
  image: mockQueryImage0,
  images: [mockQueryImage1, mockQueryImage2],
  amenities: [],
  wifiAvailable: true,
  wifiPrice: 100,
  location: "Bankastræti 14, Reykjavik, IS",
  breakfastAvailable: false,
  rooms: [],
  description: "Best hotel you well sleep in",
  localePrice: {
    price: 100,
    currency: "USD",
  },
  translations: [],
  establishment: {
    id: 1,
    name: "Amazing accommodations all day every day ehf.",
  },
  specs: [],
  metadata: {
    title: "Hotel Höfn",
    description: "Best hotel you well sleep in",
  },
  props: [],
  reviewTotalScore: mockReviewTotalScore0,
  reviewTotalCount: mockReviewTotalCount0,
  showReviews: true,
  isHighlight: false,
  isAvailable: false,
};

export const mockAccommodation0: AccommodationTypes.Accommodation = {
  id: 0,
  name: "Hotel Höfn",
  url: "/acc0",
  minDays: 1,
  basePrice: 10000,
  type: "hotel",
  isSingleUnit: false,
  cover: {
    name: "Hotel Höfn",
    images: [mockImage0, mockImage1],
  },
  information: "",
  category: mockHotelCategory,
  amenitiesItems: [],
  nearbyItems: [],
  specs: [],
  rooms: [],
  mapData: {
    latitude: 50.0,
    longitude: -33.6,
    location: "Víkurbraut, Hofn, IS",
    zoom: 10,
    points: [
      {
        id: 0,
        latitude: 50.0,
        longitude: -33.6,
        orm_name: MapPointType.HOTEL,
        type: MapPointType.HOTEL,
        title: "Hotel Höfn",
        image: mockImage0,
        reviewTotalScore: Number(mockReviewTotalScore0),
        reviewTotalCount: mockReviewTotalCount0,
        isGoogleReview: false,
        excludeFromClusterisation: true,
      },
    ],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  },
  localePrice: {
    price: 200,
    currency: "EUR",
  },
  props: [],
  reviewTotalScore: Number(mockReviewTotalScore0),
  reviewTotalCount: mockReviewTotalCount0,
  showReviews: true,
  isHighlight: true,
  isAvailable: true,
};

export const mockAccommodation1: AccommodationTypes.Accommodation = {
  id: 1,
  basePrice: 10000,
  name: "B14 Apartments & Rooms",
  url: "/acc1",
  minDays: 2,
  type: "apartment",
  isSingleUnit: false,
  cover: {
    name: "B14 Apartments & Rooms",
    images: [mockImage0, mockImage1, mockImage2],
  },
  information: "",
  category: mockApartmentCategory,
  amenitiesItems: [],
  nearbyItems: [],
  specs: [],
  rooms: [],
  mapData: {
    latitude: 52.0,
    longitude: -44.9,
    location: "Bankastræti 14, Reykjavik, IS",
    zoom: 10,
    points: [
      {
        id: 1,
        latitude: 52.0,
        longitude: -44.9,
        orm_name: MapPointType.HOTEL,
        type: MapPointType.HOTEL,
        title: "B14 Apartments & Rooms",
        image: mockImage0,
        reviewTotalScore: Number(mockReviewTotalScore0),
        reviewTotalCount: mockReviewTotalCount0,
        isGoogleReview: false,
        excludeFromClusterisation: true,
      },
    ],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  },
  localePrice: {
    price: 100,
    currency: "USD",
  },
  props: [],
  reviewTotalScore: Number(mockReviewTotalScore0),
  reviewTotalCount: mockReviewTotalCount0,
  showReviews: true,
  isHighlight: false,
  isAvailable: false,
};

export const mockSimilarAccommodations: SharedTypes.SimilarProduct[] = [
  {
    id: "0",
    name: "Center Hotel Plaza",
    lowestPrice: 4500,
    image: {
      id: "0",
      url: "https://guidetoiceland.imgix.net/478905/x/0/center-hotel-plaza-0",
    },
    clientRoute: {
      query: {
        slug: "center-hotel-plaza-0",
      },
      route: "/accommodation",
      as: "/accommodation/hotels/center-hotel-arnarhvoll-1",
    },
    productProps: [],
    productSpecs: [],
    linkUrl: "/accommodation/hotels/center-hotel-arnarhvoll-1",
  },
  {
    id: "1",
    name: "Center Hotel Arnarhvoll",
    lowestPrice: 4500,
    image: {
      id: "1",
      url: "https://guidetoiceland.imgix.net/274099/x/0/center-hotel-arnarhvoll-2",
    },
    clientRoute: {
      query: {
        slug: "center-hotel-arnarhvoll-1",
      },
      route: "/accommodation",
      as: "/accommodation/hotels/center-hotel-arnarhvoll-1",
    },
    productProps: [],
    productSpecs: [],
    linkUrl: "/accommodation/hotels/center-hotel-arnarhvoll-1",
  },
  {
    id: "2",
    name: "Fosshótel Hekla",
    lowestPrice: 4500,
    image: {
      id: "2",
      url: "https://guidetoiceland.imgix.net/470919/x/0/fosshotel-hekla-0",
    },
    clientRoute: {
      query: {
        slug: "fosshotel-hekla-3",
      },
      route: "/accommodation",
      as: "/accommodation/hotels/fosshotel-hekla-3",
    },
    productProps: [],
    productSpecs: [],
    linkUrl: "/accommodation/hotels/fosshotel-hekla-3",
  },
];

export const mockQuerySearchAccommodation0: AccommodationSearchTypes.QuerySearchHotel = {
  accommodationId: 1226,
  name: "CenterHotel Plaza",
  linkUrl: "/accommodation/iceland-hotels-reykjavik/center-hotels-plaza",
  description:
    "The hotel is perfectly situated for enjoying all that Reykjavik has to offer, on the Ingólfstorg Square in the heart of the old city. Stay right next to numerous restaurants, shopping and nightlife. The largest tourist information centre is next door. The National Theatre, galleries and museums are ...",
  ssrPrice: 90742,
  reviewTotalScore: "4.1",
  reviewTotalCount: 880,
  searchBoost: 2,
  image: {
    id: 649923,
    url: "https://guidetoiceland.imgix.net/649923/x/0/102331057-jpg?ixlib=php-3.3.0",
    alt: "CenterHotel Plaza",
    name: "102331057.jpg",
  },
  specs: [
    {
      iconId: "hotelCategory",
      name: "Category",
      value: "3 Star Hotel",
    },
    {
      iconId: "hotelLocation",
      name: "Location",
      value: "Aðalstræti 4 101, Reykjavík, Iceland",
    },
    {
      iconId: "hotelBreakfast",
      name: "Breakfast",
      value: "Available",
    },
    {
      iconId: "hotelCheckInOut",
      name: "Check-in & out",
      value: "14:00; 12:00",
    },
    {
      iconId: "hotelParking",
      name: "Parking",
      value: "Free parking",
    },
  ],
  props: [
    {
      iconId: "cancellation",
      title: "Conditional cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
    { iconId: "parking", title: "Free parking" },
  ],
  price: undefined,
  stars: 3,
  popularity: 610,
  amenityIds: [
    { id: 7061 },
    { id: 7064 },
    { id: 7069 },
    { id: 7099 },
    { id: 7111 },
    { id: 7114 },
    { id: 7145 },
    { id: 7158 },
    { id: 7168 },
  ],
  category: { id: 1 },
  isAvailable: true,
  isHighlight: true,
  city: {
    name: "Reykjavik",
  },
};

export const mockQuerySearchAccommodation1: AccommodationSearchTypes.QuerySearchHotel = {
  accommodationId: 1226,
  name: "CenterHotel Plaza",
  linkUrl: "/accommodation/iceland-hotels-reykjavik/center-hotels-plaza",
  description:
    "The hotel is perfectly situated for enjoying all that Reykjavik has to offer, on the Ingólfstorg Square in the heart of the old city. Stay right next to numerous restaurants, shopping and nightlife. The largest tourist information centre is next door. The National Theatre, galleries and museums are ...",
  image: {
    id: 649923,
    url: "https://guidetoiceland.imgix.net/649923/x/0/102331057-jpg?ixlib=php-3.3.0",
    alt: "CenterHotel Plaza",
    name: "102331057.jpg",
  },
  specs: [],
  props: [],
  amenityIds: [],
  category: { id: 1 },
  popularity: 33,
  ssrPrice: 0,
  isAvailable: false,
  isHighlight: false,
};

export const mockSearchAccommodationProduct1 = {
  amenityIds: [],
  categoryId: 1,
  description:
    "The hotel is perfectly situated for enjoying all that Reykjavik has to offer, on the Ingólfstorg Square in the heart of the old city. Stay right next to numerous restaurants, shopping and nightlife. The largest tourist information centre is next door. The National Theatre, galleries and museums are ...",
  headline: "CenterHotel Plaza",
  averageRating: undefined,
  image: {
    alt: "CenterHotel Plaza",
    id: "649923",
    name: "CenterHotel Plaza",
    url: "https://guidetoiceland.imgix.net/649923/x/0/102331057-jpg",
  },
  id: 1226,
  linkUrl: "/accommodation/iceland-hotels-reykjavik/center-hotels-plaza",
  price: undefined,
  props: [],
  specs: [],
  stars: 0,
  ssrPrice: 0,
  popularity: 33,
  isAvailable: false,
  isHighlight: false,
};

export const mockSearchAccommodationProduct2 = {
  id: 3515,
  headline: "Hotel Stadarborg",
  description:
    "Hotel Stadarborg is a gorgeous hotel in the heart of the Eastfjords, perfect for those exploring the remote wilderness of this incredible region. Those looking for a modern room, in a hotel with a hot tub and sauna, will find it to be the perfect escape.\n\nLocation & Nearby\n\nHotel Stadarborg is a sev...",
  linkUrl: "/accommodation/hotels/hotel-stadarborg-1",
  price: 28839,
  image: {
    id: "571902",
    url: "https://guidetoiceland.imgix.net/571902/x/0/2020-04-16t11-46-17-574cd3a8-afea-4faf-95bc-ecf9cd4514cd-dsc-0528-jpg-jpg",
    alt: "Hotel Stadarborg is a hotel in the heart of East Iceland.",
    name: "Hotel Stadarborg is a hotel in the heart of East Iceland.",
  },
  specs: [],
  stars: 1,
  props: [],
  ssrPrice: 28839,
  averageRating: 4.2,
  reviewsCount: 93,
  popularity: 0,
  categoryId: 1,
  amenityIds: [7061, 7064, 7080],
  isHighlight: false,
  isAvailable: true,
};

export const mockSearchAccommodationProduct3 = {
  id: 3546,
  headline: "Icelandair Hotel Herad",
  description:
    "Icelandair Hotel Herad is a hotel in east Iceland with 60 rooms, found in the town of Egilsstadir. It is the perfect choice for those seeking a comfortable place to stay when embarking on a Ring Road adventure around the country or enjoying a holiday to the East Fjords.\n\nLocation & Nearby\n\nIcelandai...",
  linkUrl: "/accommodation/hotels/icelandair-hotel-herad-2",
  price: 46816,
  image: {
    id: "696239",
    url: "https://guidetoiceland.imgix.net/696239/x/0/2020-02-19t12-09-39-4b6fd4fe-ba9e-47c9-b3d2-4a86c1aafccc-icelandair-hotel-herad-exterior-09-jpg",
    alt: "Icelandair Hotel Herad is a large hotel in East Iceland.",
    name: "Icelandair Hotel Herad is a large hotel in East Iceland.",
  },
  specs: [],
  stars: 1,
  props: [],
  ssrPrice: 46816,
  averageRating: 0,
  reviewsCount: 0,
  popularity: 195,
  categoryId: 1,
  amenityIds: [7061, 7064, 7152],
  isHighlight: false,
  isAvailable: true,
};
