// TODO: REMOVE THIS FILE

export const coverImagesMock = [
  {
    id: "404595",
    url: "https://guidetoiceland.imgix.net/404595/x/0/iceland-s-golden-circle-ultimate-guide-and-top-9-detours-21-jpg",
    name: "Gullfoss was almost lost to a hydro-electric dam, but for the work of one farmhand.",
  },
  {
    id: "331988",
    url: "https://guidetoiceland.imgix.net/331988/x/0/gullfoss",
    name: "Gullfoss",
  },
];

export const defaultCoordsMock = {
  latitude: 46.46666717529297,
  longitude: 11.64999961853027,
};

export const postBookingItineraryMock = {
  startDate: "2023-06-21T14:00:00.000Z",
  endDate: "2023-06-23T14:00:00.000Z",
};

export const MOCK_TRAVEL_ID = 123;

export const MOCKED_TOURS_ANDS_EXPERIENCES = {
  isPaymentDetailsHidden: false,
  editableStatus: "UNAVAILABLE",
  paymentMethod: null,
  orderStatus: null,
  externalId: "BR-585725096",
  id: "TE-93",
  cart: {
    id: 856541975,
    productCode: "3517LONWICK",
    productOptionCode: "TG13",
    linkUrl: "/the-united-kingdom/best-tours-and-tickets/details/wicked-the-musical-theater-show",
    paxMix: [
      {
        ageBand: "ADULT",
        numberOfTravelers: 1,
        __typename: "OrderTourPaxMix",
      },
    ],
    languageGuide: null,
    extras: [
      {
        id: "1552283",
        name: "All taxes, fees and handling charges",
        answer: null,
        included: true,
        price: 0,
        required: true,
        count: null,
        __typename: "OrderTourCartExtra",
      },
    ],
    valueProps: [],
    durationSec: 10800,
    durationText: "3 hours ",
    pickup: "NO_PICKUP",
    advancedNoticeSec: 172800,
    bookingRef: "BR-585725092",
    startTime: "19:30",
    title: "Wicked the Musical Theater Show",
    cartItemId: "82da914a-dfc9-4513-a499-3b2bee349dee",
    totalPrice: 224.22,
    imageUrl:
      "https://hare-media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/d7/12/ad.jpg",
    available: true,
    editable: false,
    currency: "EUR",
    from: "2022-08-16T00:00:00.000Z",
    to: "2022-08-16T00:00:00.000Z",
    startingLocation: {
      locationName: "Wicked",
      __typename: "OrderTourCartLocation",
    },
    bookingQuestionAnswers: [
      {
        answer: "",
        label: "Special requirements",
        question: "SPECIAL_REQUIREMENTS",
        travelerNum: null,
        unit: null,
        __typename: "OrderTourBookingQuestionAnswers",
      },
      {
        answer: "ADULT",
        label: "Age band",
        question: "AGEBAND",
        travelerNum: 1,
        unit: null,
        __typename: "OrderTourBookingQuestionAnswers",
      },
      {
        answer: "gfds",
        label: "First name",
        question: "FULL_NAMES_FIRST",
        travelerNum: 1,
        unit: null,
        __typename: "OrderTourBookingQuestionAnswers",
      },
      {
        answer: "gfdsgfdsgfsd",
        label: "Last name",
        question: "FULL_NAMES_LAST",
        travelerNum: 1,
        unit: null,
        __typename: "OrderTourBookingQuestionAnswers",
      },
    ],
    __typename: "OrderTourAndTicketCartInfo",
  },
};

export const fallbackCarPickupData = {
  address: "",
  streetNumber: "",
  cityName: "",
  postalCode: "",
  state: "",
  country: "",
  phoneNumber: "",
  openingHours: [
    {
      dayOfWeek: 0,
      isOpen: false,
      openFrom: "",
      openTo: "",
    },
  ],
};
