import { TourType } from "types/enums";
import {
  mockQueryImage0,
  mockQueryImage1,
  mockQueryImage2,
  mockQueryImages0,
  mockImage0,
  mockImage1,
  mockImage2,
  mockImages0,
  mockParagraphText0,
  mockName0,
} from "utils/mockData/mockGlobalData";

export const mockVideoUrl0 = "https://www.youtube.com/embed/f-AD8GCZ9Ts";

export const mockReviewTotalScore0 = "4.7";

export const mockReviewTotalCount0 = 200;

export const mockDurationAsText = "5 days";

export const mockDurationInSeconds = 126400;

export const mockQueryLanguages = [
  {
    name: "Icelandic",
  },
  {
    name: "English",
  },
];

export const mockGuideInformation0 =
  "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export const mockLinkUrl0 = "/connect-with-locals/arni-freyr-gestsson";

export const mockQueryGuide0: QueryGuide = {
  id: 0,
  name: "Daniel Benediktsson",
  information: mockGuideInformation0,
  avatarImage: mockQueryImage0,
  images: [mockQueryImage1, mockQueryImage2],
  coverImage: mockQueryImage0,
  linkUrl: mockLinkUrl0,
  languages: mockQueryLanguages,
};

export const mockQueryGuide1: QueryGuide = {
  id: 0,
  name: "Daniel Benediktsson",
  information: mockGuideInformation0,
  avatarImage: mockQueryImage0,
  images: [],
  coverImage: mockQueryImage0,
  linkUrl: mockLinkUrl0,
  languages: [],
};

export const mockQueryTour0: QueryTour = {
  id: 0,
  url: "",
  basePrice: 199,
  currency: "ISK",
  name: mockName0,
  isIndexed: true,
  isLivePricing: false,
  establishment: {
    id: 1,
    name: mockName0,
    url: "",
  },
  tourType: TourType.Day,
  information: "",
  additionalInformation: "",
  image: mockQueryImage0,
  images: [mockQueryImage1],
  durationInSeconds: mockDurationInSeconds,
  isFreePickup: false,
  reviewTotalScore: mockReviewTotalScore0,
  reviewTotalCount: mockReviewTotalCount0,
  durationAsText: mockDurationAsText,
  languages: mockQueryLanguages,
  difficultyLevel: 1,
  availabilityPeriod: "May. - Oct.",
  minimumAge: 0,
  shouldBringItems: [],
  includedItems: [],
  activityItems: [],
  attractionsItems: [],
  contentTemplates: [],
  itinerary: [],
  videoUrl: mockVideoUrl0,
  guides: [],
  props: [],
  specs: [],
  transport: {
    pickup: "",
    pickupType: "",
    departureNote: "",
    enableNotKnown: false,
    required: true,
    price: 0,
    airports: [],
    places: [],
  },
  metadata: {
    title: "",
    description: "",
  },
  priceGroups: {
    adults: {
      lowestPriceGroupSize: 3,
    },
  },
  localePrice: {
    price: 100,
    currency: "EUR",
  },
};

export const mockQueryTour1: QueryTour = {
  id: 1,
  url: "",
  basePrice: 199,
  currency: "ISK",
  name: mockName0,
  isIndexed: true,
  isLivePricing: true,
  establishment: {
    id: 1,
    name: mockName0,
    url: "",
  },
  tourType: TourType.Day,
  information: "",
  additionalInformation: "",
  image: undefined,
  images: [mockQueryImage0],
  durationInSeconds: mockDurationInSeconds,
  isFreePickup: false,
  reviewTotalScore: mockReviewTotalScore0,
  reviewTotalCount: mockReviewTotalCount0,
  durationAsText: mockDurationAsText,
  languages: mockQueryLanguages,
  difficultyLevel: 1,
  availabilityPeriod: "May. - Oct.",
  minimumAge: 0,
  shouldBringItems: [],
  includedItems: [],
  activityItems: [],
  attractionsItems: [],
  contentTemplates: [],
  itinerary: [],
  videoUrl: mockVideoUrl0,
  guides: [],
  props: [],
  specs: [],
  transport: {
    pickup: "",
    pickupType: "",
    departureNote: "",
    enableNotKnown: false,
    required: true,
    price: 0,
    airports: [],
    places: [],
  },
  metadata: {
    title: "",
    description: "",
  },
  priceGroups: {
    adults: {
      lowestPriceGroupSize: 3,
    },
  },
  localePrice: {
    price: 200,
    currency: "USD",
  },
};

export const mockGuide0: Guide = {
  id: "0",
  name: "Daniel Benediktsson",
  information: mockGuideInformation0,
  avatarImage: mockImage0,
  images: [mockImage0, mockImage1, mockImage2],
  linkUrl: mockLinkUrl0,
  languages: "Icelandic, English",
};

export const mockGuide1: Guide = {
  id: "0",
  name: "Daniel Benediktsson",
  information: mockGuideInformation0,
  avatarImage: mockImage0,
  images: [mockImage0],
  linkUrl: mockLinkUrl0,
  languages: undefined,
};

export const mockTour0: Tour = {
  id: "0",
  url: "",
  isIndexed: true,
  currency: "ISK",
  name: mockName0,
  establishment: { name: mockName0, url: "" },
  tourType: TourType.Day,
  information: "",
  additionalInformation: undefined,
  images: [mockImage0, mockImage1],
  reviewTotalScore: Number(mockReviewTotalScore0),
  reviewTotalCount: mockReviewTotalCount0,
  shouldBringItems: [],
  includedItems: [],
  activityItems: [],
  attractionsItems: [],
  contentTemplates: [],
  mapData: {
    location: "",
    latitude: 0,
    longitude: 0,
    zoom: 5,
    points: [],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  },
  itinerary: [],
  videoUrl: mockVideoUrl0,
  guides: [],
  isFreePickup: false,
  props: [],
  specs: [],
  transport: {
    pickup: "",
    pickupType: "",
    departureNote: "",
    enableNotKnown: false,
    required: true,
    price: 0,
    places: [],
  },
  metadata: {
    title: "",
    description: "",
  },
  lowestPriceGroupSize: 3,
  localePrice: {
    price: 100,
    currency: "EUR",
  },
  isLivePricing: false,
};

export const mockTour1: Tour = {
  id: "1",
  url: "",
  isIndexed: true,
  currency: "ISK",
  name: mockName0,
  establishment: { name: mockName0, url: "" },
  tourType: TourType.Day,
  information: "",
  additionalInformation: undefined,
  images: [mockImage0],
  reviewTotalScore: Number(mockReviewTotalScore0),
  reviewTotalCount: mockReviewTotalCount0,
  shouldBringItems: [],
  includedItems: [],
  activityItems: [],
  attractionsItems: [],
  mapData: {
    location: "",
    latitude: 0,
    longitude: 0,
    zoom: 5,
    points: [],
    options: {
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  },
  contentTemplates: [],
  itinerary: [],
  videoUrl: mockVideoUrl0,
  guides: [],
  isFreePickup: false,
  props: [],
  specs: [],
  transport: {
    pickup: "",
    pickupType: "",
    departureNote: "",
    enableNotKnown: false,
    required: true,
    price: 0,
    places: [],
  },
  metadata: {
    title: "",
    description: "",
  },
  lowestPriceGroupSize: 3,
  localePrice: {
    price: 200,
    currency: "USD",
  },
  isLivePricing: true,
};

export const mockQueryContentTemplate0: QueryContentTemplate = {
  id: 0,
  name: mockName0,
  information: mockParagraphText0,
  items: [
    {
      id: 0,
      name: mockName0,
      information: mockParagraphText0,
      images: mockQueryImages0,
    },
  ],
};

export const mockContentTemplate0: ContentTemplate = {
  id: "0",
  name: mockName0,
  information: mockParagraphText0,
  items: [
    {
      id: "0",
      name: mockName0,
      information: mockParagraphText0,
      images: mockImages0,
    },
  ],
};

export const mockQueryItineraryItem0: QueryItineraryItem = {
  id: 0,
  day: 1,
  name: mockName0,
  information: mockParagraphText0,
  image: mockQueryImage0,
  contentTemplates: [{ id: "0" }, { id: "1" }],
};

export const mockQueryItineraryItemWithEmptyContentTemplate: QueryItineraryItem = {
  id: 0,
  day: 1,
  name: mockName0,
  information: mockParagraphText0,
  image: mockQueryImage0,
  contentTemplates: [],
};

export const mockItineraryItem0: ItineraryItem = {
  id: "0",
  numberOfDay: "1",
  name: mockName0,
  information: mockParagraphText0,
  image: mockImage0,
  hasContentTemplates: true,
};

export const mockItineraryItemWithEmptyContentTemplate: ItineraryItem = {
  id: "0",
  numberOfDay: "1",
  name: mockName0,
  information: mockParagraphText0,
  image: mockImage0,
  hasContentTemplates: false,
};

export const shuffleArray = <T>(arr: T[]): T[] => {
  return arr
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);
};

export const mockListItems = [
  {
    id: "0",
    name: "Keflavik International Airport",
  },
  {
    id: "1",
    name: "Reykjavík",
  },
  {
    id: "2",
    name: "Jökulsárlón",
  },
  {
    id: "3",
    name: "Skaftafell",
  },
  {
    id: "4",
    name: "Langjökull",
  },
] as SharedTypes.AutocompleteItem[];

export const mockQueryAttraction01: QueryAttraction = {
  id: 22,
  name: "Blue Lagoon",
  latitude: 63.881549835205,
  longitude: -22.453763961792,
  location: "Path into the Blue Lagoon, Iceland",
  url: "/travel-iceland/drive/blue-lagoon",
  image: {
    id: "695571",
    url: "https://guidetoiceland.imgix.net/695571/x/0/enjoy-the-soothing-warm-water-in-iceland-s-most-famous-attraction-the-blue-lagoon.jpg?ixlib=php-3.3.0&w=&h=&crop=faces&fit=crop",
    name: "Enjoy the soothing warm water in Iceland's most famous attraction, the Blue Lagoon",
  },
  reviewTotalScore: "4.5",
  reviewTotalCount: 21726,
};

export const mockQueryAttraction02: QueryAttraction = {
  id: 2437,
  name: "Daku Island",
  latitude: 0,
  longitude: 0,
  location: "Siargao",
  url: "/destinations-and-attractions/daku-island",
  image: {
    id: "198649",
    url: "https://gttp.imgix.net/198649/x/0/daku-island.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=&h=&crop=faces&fit=crop",
    name: "Daku Island",
  },
  reviewTotalScore: "4.9",
  reviewTotalCount: 92,
};
