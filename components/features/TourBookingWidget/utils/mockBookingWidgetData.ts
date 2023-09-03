import { parse } from "date-fns";

import { yearMonthDayFormat } from "utils/dateUtils";

export const mockDateString0 = "2019-05-05";
export const mockDateString1 = "2019-05-06";
export const mockDateString2 = "2019-05-07";
export const mockDateString3 = "2019-08-05";
export const mockDateString4 = "2019-05-31";
export const mockDateString5 = "2019-06-01";
export const mockDateString6 = "2019-05-09";

export const mockDate0: Date = parse(mockDateString0, yearMonthDayFormat, new Date());

export const mockDate1: Date = parse(mockDateString1, yearMonthDayFormat, new Date());

export const mockDate2: Date = parse(mockDateString2, yearMonthDayFormat, new Date());

export const mockDate3: Date = parse(mockDateString3, yearMonthDayFormat, new Date());

export const mockDate4: Date = parse(mockDateString4, yearMonthDayFormat, new Date());

export const mockDate5: Date = parse(mockDateString5, yearMonthDayFormat, new Date());

export const mockDate6: Date = parse(mockDateString6, yearMonthDayFormat, new Date());

export const mockDates0: SharedTypes.Dates = {
  unavailableDates: [],
  min: mockDate0,
  max: mockDate3,
};

export const mockDates1: SharedTypes.Dates = {
  unavailableDates: [mockDate0, mockDate2],
  min: mockDate0,
  max: mockDate3,
  availableDates: [mockDate5, mockDate6],
};

export const mockAdminDates1: SharedTypes.Dates = {
  unavailableDates: [mockDate0, mockDate2],
  min: undefined,
  max: mockDate3,
  availableDates: [mockDate5, mockDate6],
};

export const mockDates2: SharedTypes.Dates = {
  unavailableDates: [mockDate1],
  min: mockDate0,
  max: mockDate4,
};

export const mockQueryDate: TourBookingWidgetTypes.QueryDates = {
  unavailableDates: [mockDateString0, mockDateString2],
  min: mockDateString0,
  max: mockDateString3,
  availableDates: [mockDateString5, mockDateString6],
};

export const mockBookingWidgetTourData0: TourBookingWidgetTypes.BookingWidgetTourData = {
  basePrice: 199,
  lengthOfTour: 1,
};

export const mockQueryPickupPrices: TourBookingWidgetTypes.QueryPickupPrices = {
  pickup_priced_per_person: true,
  price_pickup: 200,
  price_pickup_child: 0,
  price_pickup_teenager: 100,
};

export const mockQueryPickupPrices2: TourBookingWidgetTypes.QueryPickupPrices = {
  pickup_priced_per_person: false,
  price_pickup: 200,
  price_pickup_child: 0,
  price_pickup_teenager: 100,
};

export const mockQueryTime0: TourBookingWidgetTypes.TimeWithPricesData = {
  isFlexible: 1,
  extras: [],
  time: "09:00",
  available: true,
  departureTime: "09:30",
  maxNumberOfTravelers: 10,
  minNumberOfTravelers: 0,
  priceAdult: 19000,
  priceAdult2: 19000,
  priceAdult3: 18000,
  priceAdult4: 17000,
  priceAdult5: 16000,
  priceChild: 8000,
  priceChild2: 8000,
  priceChild3: 8000,
  priceChild4: 8000,
  priceChild5: 8000,
  priceTeenager: 13000,
  priceTeenager2: 12000,
  priceTeenager3: 11000,
  priceTeenager4: 10000,
  priceTeenager5: 9000,
  pickupPrices: mockQueryPickupPrices,
  isPickupAvailable: true,
};

export const mockQueryTime1: TourBookingWidgetTypes.TimeWithPricesData = {
  isFlexible: 1,
  extras: [],
  time: "10:00",
  available: false,
  departureTime: "10:30",
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 10,
  priceAdult: 19000,
  priceAdult2: 19000,
  priceAdult3: 18000,
  priceAdult4: 17000,
  priceAdult5: 16000,
  priceChild: 8000,
  priceChild2: 8000,
  priceChild3: 8000,
  priceChild4: 8000,
  priceChild5: 8000,
  priceTeenager: 13000,
  priceTeenager2: 12000,
  priceTeenager3: 11000,
  priceTeenager4: 10000,
  priceTeenager5: 9000,
  isPickupAvailable: true,
  pickupPrices: mockQueryPickupPrices2,
};

export const mockQueryTime2: TourBookingWidgetTypes.TimeWithPricesData = {
  isFlexible: 1,
  extras: [],
  time: "11:00",
  available: true,
  departureTime: "11:30",
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 0,
  priceAdult: 19000,
  priceAdult2: 19000,
  priceAdult3: 19000,
  priceAdult4: 19000,
  priceAdult5: 19000,
  priceChild: 19000,
  priceChild2: 19000,
  priceChild3: 19000,
  priceChild4: 19000,
  priceChild5: 19000,
  priceTeenager: 19000,
  priceTeenager2: 19000,
  priceTeenager3: 19000,
  priceTeenager4: 19000,
  priceTeenager5: 19000,
  pickupPrices: mockQueryPickupPrices,
  isPickupAvailable: true,
};

export const mockQueryTimes0: ReadonlyArray<TourBookingWidgetTypes.TimeWithPricesData> = [
  mockQueryTime0,
  mockQueryTime1,
  mockQueryTime2,
];

export const mockPrices0: TourBookingWidgetTypes.Prices[] = [
  {
    adults: 19000,
    teenagers: 13000,
    children: 8000,
  },
  {
    adults: 19000,
    teenagers: 12000,
    children: 8000,
  },
  {
    adults: 18000,
    teenagers: 11000,
    children: 8000,
  },
  {
    adults: 17000,
    teenagers: 10000,
    children: 8000,
  },
  {
    adults: 16000,
    teenagers: 9000,
    children: 8000,
  },
];

export const mockPrices1: TourBookingWidgetTypes.Prices[] = [
  {
    adults: 19000,
    teenagers: 19000,
    children: 19000,
  },
  {
    adults: 19000,
    teenagers: 19000,
    children: 19000,
  },
  {
    adults: 19000,
    teenagers: 19000,
    children: 19000,
  },
  {
    adults: 19000,
    teenagers: 19000,
    children: 19000,
  },
  {
    adults: 19000,
    teenagers: 19000,
    children: 19000,
  },
];

export const mockPickupPrices: TourBookingWidgetTypes.PickupPrices = {
  pickupPricedPerPerson: true,
  prices: {
    adults: 200,
    teenagers: 100,
    children: 0,
  },
};

export const mockPickupPrices2: TourBookingWidgetTypes.PickupPrices = {
  pickupPricedPerPerson: false,
  prices: {
    adults: 200,
    teenagers: 100,
    children: 0,
  },
};

export const mockTime0: TourBookingWidgetTypes.Time = {
  extras: [],
  time: "Flexible",
  available: true,
  departureTime: "Flexible",
  prices: mockPrices0,
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 10,
  pickupPrices: mockPickupPrices,
  isPickupAvailable: true,
};

export const mockTime1: TourBookingWidgetTypes.Time = {
  extras: [],
  time: "09:00",
  available: true,
  departureTime: "09:30",
  prices: mockPrices0,
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 10,
  pickupPrices: mockPickupPrices,
  isPickupAvailable: true,
};

export const mockTime2: TourBookingWidgetTypes.Time = {
  extras: [],
  time: "10:00",
  available: false,
  departureTime: "10:30",
  prices: mockPrices0,
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 10,
  pickupPrices: mockPickupPrices2,
  isPickupAvailable: true,
};

export const mockTime3: TourBookingWidgetTypes.Time = {
  extras: [],
  time: "11:00",
  available: true,
  departureTime: "11:30",
  prices: mockPrices1,
  minNumberOfTravelers: 0,
  maxNumberOfTravelers: 0,
  pickupPrices: mockPickupPrices,
  isPickupAvailable: true,
};

export const mockTimes0: TourBookingWidgetTypes.Time[] = [
  mockTime0,
  mockTime1,
  mockTime2,
  mockTime3,
];

export const mockVpTimes0: TourBookingWidgetTypes.Time[] = [
  {
    ...mockTime0,
    prices: [],
    extras: undefined,
  },
  {
    ...mockTime1,
    prices: [],
    extras: undefined,
  },
  {
    ...mockTime2,
    prices: [],
    extras: undefined,
  },
  {
    ...mockTime3,
    prices: [],
    extras: undefined,
  },
];

export const mockTimes1: TourBookingWidgetTypes.Time[] = [mockTime0, mockTime1];

export const mockExperienceAnswer1: ExperiencesTypes.ExperienceAnswer = {
  id: "1",
  name: "4WD",
  prices: [350],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  included: false,
  isDefault: false,
};

export const mockExperienceAnswer2: ExperiencesTypes.ExperienceAnswer = {
  id: "2",
  name: "2WD",
  prices: [150],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  included: false,
  isDefault: false,
};

export const mockExperienceAnswer3: ExperiencesTypes.ExperienceAnswer = {
  id: "3",
  name: "6WD",
  prices: [550],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  included: false,
  isDefault: false,
};

export const mockExperience1: ExperiencesTypes.Experience = {
  id: "123",
  answers: [mockExperienceAnswer1, mockExperienceAnswer2, mockExperienceAnswer3],
  name: "Car",
  calculatePricePerPerson: true,
};

export const mockExperience2: ExperiencesTypes.Experience = {
  id: "124",
  answers: [mockExperienceAnswer1, mockExperienceAnswer2, mockExperienceAnswer3],
  name: "Accommodation",
  calculatePricePerPerson: false,
};

export const mockExperience3: ExperiencesTypes.Experience = {
  id: "125",
  answers: [mockExperienceAnswer1, mockExperienceAnswer2, mockExperienceAnswer3],
  name: "Blue lagoon",
  calculatePricePerPerson: true,
};

export const mockSelectedExperience1: TourBookingWidgetTypes.SelectedExperience = {
  experienceId: mockExperience1.id,
  answerId: "0",
  prices: [350],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  calculatePricePerPerson: true,
};

export const mockSelectedExperience2: TourBookingWidgetTypes.SelectedExperience = {
  experienceId: mockExperience2.id,
  answerId: "1",
  prices: [150],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  calculatePricePerPerson: false,
};

export const mockSelectedExperience3: TourBookingWidgetTypes.SelectedExperience = {
  experienceId: mockExperience3.id,
  answerId: "2",
  prices: [550],
  vpPrice: {
    selectedOptionDiff: 0,
  },
  calculatePricePerPerson: true,
};

export const mockSelectedExperiences: TourBookingWidgetTypes.SelectedExperiences = [
  mockSelectedExperience1,
  mockSelectedExperience2,
  mockSelectedExperience3,
];

export const mockSelectedTravelExperience1: TourBookingWidgetTypes.SelectedTravelerExperience = {
  experienceId: "12",
  count: 1,
  price: 100,
  answers: [
    {
      externalId: 123,
      question: "question",
      answer: "answer",
    },
  ],
  calculatePricePerPerson: false,
};

export const mockSelectedTravelExperience2: TourBookingWidgetTypes.SelectedTravelerExperience = {
  experienceId: "22",
  count: 1,
  price: 200,
  answers: [
    {
      externalId: 124,
      question: "question",
      answer: "answer",
    },
  ],
  calculatePricePerPerson: false,
};

export const mockSelectedTravelExperiences: TourBookingWidgetTypes.SelectedTravelerExperience[] = [
  mockSelectedTravelExperience1,
  mockSelectedTravelExperience2,
];

export const mockTravellers12PrivateOption = {
  id: 12,
  travellers: 12,
  price: 2000,
  season: "allyear",
};

export const mockTravellers8PrivateOption = {
  id: 8,
  travellers: 8,
  price: 8000,
  season: "allyear",
};

export const mockTravellers6PrivateOption = {
  id: 6,
  travellers: 6,
  price: 6000,
  season: "allyear",
};

export const mockTravellers4PrivateOption = {
  id: 4,
  travellers: 4,
  price: 4000,
  season: "allyear",
};

export const mockVpExperiences: ExperiencesTypes.Experience[] = [
  {
    id: "83383",
    name: "Glacier hike (minimum age 8)",
    price: 0,
    questions: [],
    calculatePricePerPerson: false,
    required: true,
    answers: [
      {
        id: "18f787f1e3d5eed670",
        name: "Skip the glacier hike",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: -11281.5,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "22b5bbff15dcf5f81c",
        name: "Join the glacier hike",
        prices: [11281.5],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "83384",
    name: "Jokulsarlon boat tour",
    price: 0,
    questions: [],
    calculatePricePerPerson: false,
    required: true,
    answers: [
      {
        id: "28be11d7fb33fb36b0",
        name: "Skip the boat tour",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: false,
        isDefault: true,
      },
      {
        id: "01119b7f4ddfdc6fa8",
        name: "Amphibian boat tour",
        prices: [6106.5],
        vpPrice: {
          selectedOptionDiff: 6106.5,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
];

export const mockVpExperiences1: ExperiencesTypes.Experience[] = [
  {
    id: "76870",
    name: "Accommodation",
    calculatePricePerPerson: false,
    answers: [
      {
        id: "3d2e97301413d81220",
        name: "Comfort (private bath)",
        prices: [27600],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "4aae67818440f37671",
        name: "Quality (handpicked hotels)",
        prices: [30960],
        vpPrice: {
          selectedOptionDiff: 3360,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "76871",
    name: "Car",
    calculatePricePerPerson: false,
    answers: [
      {
        id: "23371e50ec8e854382",
        name: "Super Budget 2WD Manual",
        prices: [25080],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "836182a58f3ab6a7ca",
        name: "Super Budget 2WD Automatic",
        prices: [30840],
        vpPrice: {
          selectedOptionDiff: 5760,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "567a666fd27587b4ae",
        name: "Budget 2WD Manual",
        prices: [29880],
        vpPrice: {
          selectedOptionDiff: 4800,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "911d01e94b21b7d6ec",
        name: "Budget 2WD Automatic",
        prices: [31776],
        vpPrice: {
          selectedOptionDiff: 6696,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "ae3b14ce1298cb2129",
        name: "Budget 4X4 Manual",
        prices: [39000],
        vpPrice: {
          selectedOptionDiff: 13920,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "e139504411fa9d47ae",
        name: "Comfort 4WD Manual",
        prices: [45240],
        vpPrice: {
          selectedOptionDiff: 20160,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "1ecabe2bb0c07a344c",
        name: "Comfort 4WD Automatic",
        prices: [47736],
        vpPrice: {
          selectedOptionDiff: 22656,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "235f1ad86f39252e6d",
        name: "Luxury 4WD Automatic",
        prices: [86040],
        vpPrice: {
          selectedOptionDiff: 60960,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "09a20302a9760e53a7",
        name: "4WD Van Manual",
        prices: [85440],
        vpPrice: {
          selectedOptionDiff: 60360,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "76869",
    name: "Blue Lagoon (minimum age 2)",
    calculatePricePerPerson: false,
    answers: [
      {
        id: "0f086bbf325508800b",
        name: "Skip the Blue Lagoon",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "0b44f43b6bcf3001f8",
        name: "Comfort Entrance",
        prices: [10788],
        vpPrice: {
          selectedOptionDiff: 10788,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "49b7bdb78cfb8a1007",
        name: "Premium Entrance",
        prices: [13788],
        vpPrice: {
          selectedOptionDiff: 13788,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
];

export const mockVpDefaultExperienceAnswers1: ExperiencesTypes.ExperienceAnswer[] = [
  {
    id: "3d2e97301413d81220",
    included: true,
    isDefault: true,
    name: "Comfort (private bath)",
    prices: [27600],
    vpPrice: {
      selectedOptionDiff: 0,
    },
  },
  {
    id: "23371e50ec8e854382",
    included: true,
    isDefault: true,
    name: "Super Budget 2WD Manual",
    prices: [25080],
    vpPrice: {
      selectedOptionDiff: 0,
    },
  },
  {
    id: "0f086bbf325508800b",
    included: true,
    isDefault: true,
    name: "Skip the Blue Lagoon",
    prices: [0],
    vpPrice: {
      selectedOptionDiff: 0,
    },
  },
];

export const mockVpSelectedExperiences: TourBookingWidgetTypes.SelectedExperiences = [
  {
    experienceId: "83383",
    answerId: "18f787f1e3d5eed670",
    prices: [0],
    vpPrice: {
      selectedOptionDiff: 0,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "83384",
    answerId: "28be11d7fb33fb36b0",
    prices: [0],
    vpPrice: {
      selectedOptionDiff: 0,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "87313",
    count: 0,
    price: 6900,
    calculatePricePerPerson: false,
  },
  {
    experienceId: "87314",
    count: 0,
    price: 1150,
    calculatePricePerPerson: false,
  },
];

export const mockVpSelectedExperiences1: TourBookingWidgetTypes.SelectedExperiences = [
  {
    experienceId: "76870",
    answerId: "3d2e97301413d81220",
    prices: [27600],
    vpPrice: {
      selectedOptionDiff: 0,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "76871",
    answerId: "23371e50ec8e854382",
    prices: [25080],
    vpPrice: {
      selectedOptionDiff: 0,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "76869",
    answerId: "0f086bbf325508800b",
    prices: [0],
    vpPrice: {
      selectedOptionDiff: 0,
    },
    calculatePricePerPerson: false,
  },
];

export const mockVpExperiences1WitSelectedPrices: ExperiencesTypes.Experience[] = [
  {
    id: "76870",
    name: "Accommodation",
    price: 41016,
    questions: [],
    calculatePricePerPerson: false,
    required: true,
    answers: [
      {
        id: "3d2e97301413d81220",
        name: "Comfort (private bath)",
        prices: [41016],
        vpPrice: {
          selectedOptionDiff: -38692.93094924926,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "4aae67818440f37671",
        name: "Quality (handpicked hotels)",
        prices: [79708],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "76871",
    name: "Car",
    price: 25080,
    questions: [],
    calculatePricePerPerson: false,
    required: true,
    answers: [
      {
        id: "23371e50ec8e854382",
        name: "Super Budget 2WD Manual",
        prices: [25080],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "836182a58f3ab6a7ca",
        name: "Super Budget 2WD Automatic",
        prices: [30840],
        vpPrice: {
          selectedOptionDiff: 5760,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "567a666fd27587b4ae",
        name: "Budget 2WD Manual",
        prices: [29880],
        vpPrice: {
          selectedOptionDiff: 4800,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "911d01e94b21b7d6ec",
        name: "Budget 2WD Automatic",
        prices: [31776],
        vpPrice: {
          selectedOptionDiff: 6696,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "ae3b14ce1298cb2129",
        name: "Budget 4X4 Manual",
        prices: [39000],
        vpPrice: {
          selectedOptionDiff: 13920,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "e139504411fa9d47ae",
        name: "Comfort 4WD Manual",
        prices: [45240],
        vpPrice: {
          selectedOptionDiff: 20160,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "1ecabe2bb0c07a344c",
        name: "Comfort 4WD Automatic",
        prices: [47736],
        vpPrice: {
          selectedOptionDiff: 22656,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "235f1ad86f39252e6d",
        name: "Luxury 4WD Automatic",
        prices: [86040],
        vpPrice: {
          selectedOptionDiff: 60960,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "09a20302a9760e53a7",
        name: "4WD Van Manual",
        prices: [85440],
        vpPrice: {
          selectedOptionDiff: 60360,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "76869",
    name: "Blue Lagoon (minimum age 2)",
    price: 0,
    questions: [],
    calculatePricePerPerson: false,
    required: true,
    answers: [
      {
        id: "0f086bbf325508800b",
        name: "Skip the Blue Lagoon",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: 0,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "0b44f43b6bcf3001f8",
        name: "Comfort Entrance",
        prices: [32364],
        vpPrice: {
          selectedOptionDiff: 32364,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "49b7bdb78cfb8a1007",
        name: "Premium Entrance",
        prices: [41364],
        vpPrice: {
          selectedOptionDiff: 41364,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
];

export const mockVpExtraWithUpdatedPrices: TourBookingWidgetTypes.Extra[] = [
  {
    id: "83383",
    disabled: false,
    price: 0,
    options: [
      {
        id: "18f787f1e3d5eed670",
        disabled: false,
        included: true,
        prices: [
          {
            price: 0,
            disabled: false,
          },
        ],
      },
      {
        id: "22b5bbff15dcf5f81c",
        disabled: false,
        included: false,
        prices: [
          {
            price: 33844.5,
            disabled: false,
          },
        ],
      },
    ],
  },
  {
    id: "83384",
    disabled: false,
    price: 0,
    options: [
      {
        id: "28be11d7fb33fb36b0",
        disabled: false,
        included: true,
        prices: [
          {
            price: 0,
            disabled: false,
          },
        ],
      },
      {
        id: "01119b7f4ddfdc6fa8",
        disabled: false,
        included: false,
        prices: [
          {
            price: 18319.5,
            disabled: false,
          },
        ],
      },
    ],
  },
  {
    id: "87313",
    disabled: false,
    price: 20700,
    options: [],
  },
  {
    id: "87314",
    disabled: false,
    price: 3450,
    options: [],
  },
];

export const mockVpExtra1WithUpdatedPrices: TourBookingWidgetTypes.Extra[] = [
  {
    id: "76870",
    disabled: false,
    price: 41016,
    options: [
      {
        id: "3d2e97301413d81220",
        disabled: false,
        included: true,
        prices: [
          {
            price: 41016,
            disabled: false,
          },
        ],
      },
      {
        id: "4aae67818440f37671",
        disabled: false,
        included: false,
        prices: [
          {
            price: 79708,
            disabled: false,
          },
        ],
      },
    ],
  },
  {
    id: "76871",
    disabled: false,
    price: 25080,
    options: [
      {
        id: "23371e50ec8e854382",
        disabled: false,
        included: true,
        prices: [
          {
            price: 25080,
            disabled: false,
          },
        ],
      },
      {
        id: "836182a58f3ab6a7ca",
        disabled: false,
        included: false,
        prices: [
          {
            price: 30840,
            disabled: false,
          },
        ],
      },
      {
        id: "567a666fd27587b4ae",
        disabled: false,
        included: false,
        prices: [
          {
            price: 29880,
            disabled: false,
          },
        ],
      },
      {
        id: "911d01e94b21b7d6ec",
        disabled: false,
        included: false,
        prices: [
          {
            price: 31776,
            disabled: false,
          },
        ],
      },
      {
        id: "ae3b14ce1298cb2129",
        disabled: false,
        included: false,
        prices: [
          {
            price: 39000,
            disabled: false,
          },
        ],
      },
      {
        id: "e139504411fa9d47ae",
        disabled: false,
        included: false,
        prices: [
          {
            price: 45240,
            disabled: false,
          },
        ],
      },
      {
        id: "1ecabe2bb0c07a344c",
        disabled: false,
        included: false,
        prices: [
          {
            price: 47736,
            disabled: false,
          },
        ],
      },
      {
        id: "235f1ad86f39252e6d",
        disabled: false,
        included: false,
        prices: [
          {
            price: 86040,
            disabled: false,
          },
        ],
      },
      {
        id: "09a20302a9760e53a7",
        disabled: false,
        included: false,
        prices: [
          {
            price: 85440,
            disabled: false,
          },
        ],
      },
    ],
  },
  {
    id: "76869",
    disabled: false,
    price: 0,
    options: [
      {
        id: "0f086bbf325508800b",
        disabled: false,
        included: false,
        prices: [
          {
            price: 0,
            disabled: false,
          },
        ],
      },
      {
        id: "0b44f43b6bcf3001f8",
        disabled: false,
        included: false,
        prices: [
          {
            price: 32364,
            disabled: false,
          },
        ],
      },
      {
        id: "49b7bdb78cfb8a1007",
        disabled: false,
        included: false,
        prices: [
          {
            price: 41364,
            disabled: false,
          },
        ],
      },
    ],
  },
];
