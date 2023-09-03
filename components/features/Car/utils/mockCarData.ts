import { CarProvider } from "types/enums";
import CarIcon from "components/icons/car.svg";
import TravellersIcon from "components/icons/travellers.svg";
import BagIcon from "components/icons/bag-handle.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import CarGasIcon from "components/icons/gas-load.svg";
import RoadIcon from "components/icons/road-straight.svg";
import WalletIcon from "components/icons/money-wallet-open.svg";
import CarSearchIcon from "components/icons/car-actions-search-1.svg";
import RoadWoodsIcon from "components/icons/road-woods.svg";
import BestPriceIcon from "components/icons/check-shield.svg";
import CancellationIcon from "components/icons/file-text-remove.svg";
import CustomerSupportIcon from "components/icons/phone-support.svg";
import SnowIcon from "components/icons/temperature-snowflake-1.svg";
import { mockCarImage0, mockCarImage1, mockCarImage2 } from "utils/mockData/mockGlobalData";

const mockEstablishmentName0 = "City Car Rental";
const mockEstablishmentUrl = "https://guidetoiceland.imgix.net/484215/x/0.jpg";

export const mockQueryEstablishmentImage0 = {
  id: 0,
  url: mockEstablishmentUrl,
  name: mockEstablishmentName0,
};

const mockEstablishmentImage0 = {
  id: "0",
  url: mockEstablishmentUrl,
  name: mockEstablishmentName0,
};

const mockAvailableInsurance0: CarTypes.QueryAvailableExtras = {
  id: 319,
  name: "Collision damage waiver",
  price: 0,
  code: "CDW",
  required: true,
  chargePerDay: false,
  multiple: false,
  description:
    "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
};

const mockAvailableInsurance1: CarTypes.QueryAvailableExtras = {
  id: 366,
  name: "Super collision damage waiver",
  price: 2500,
  code: "SCDW",
  required: false,
  chargePerDay: false,
  multiple: false,
  description:
    "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
};

const mockAvailableInsurance2: CarTypes.QueryAvailableExtras = {
  id: 367,
  name: "Gravel protection",
  price: 2000,
  code: "GPC",
  required: false,
  chargePerDay: false,
  multiple: false,
  description:
    "The Gravel protection covers the windscreen, headlights and the body of the car from damages resulting from gravel hurled at the vehicle.",
};

const mockAvailableExtras0: CarTypes.QueryAvailableExtras = {
  id: 1,
  name: "GPS",
  price: 1200,
  code: "GPS",
  required: true,
  chargePerDay: true,
  multiple: false,
  description: "Garmin unit with the latest update. Many of different language options.",
};

const mockAvailableExtras1: CarTypes.QueryAvailableExtras = {
  id: 2,
  name: "Map",
  price: 2500,
  code: "MP",
  required: false,
  chargePerDay: false,
  multiple: false,
  description: "Includes highland and off-road and a lot of details of services around the island.",
};

const mockAvailableExtras2: CarTypes.QueryAvailableExtras = {
  id: 5,
  name: "Extra driver",
  price: 2000,
  code: "ED",
  required: false,
  chargePerDay: true,
  multiple: false,
  description: "Includes highland and off-road and a lot of details of services around the island.",
};

const mockIncludedItems1: CarTypes.QueryIncludedItems = {
  id: 1,
  name: "Any insurances",
  coverageAmount: 0,
  coverageCurrency: "ISK",
  description: "The Gravel protection covers the windscreen,",
};

const mockIncludedItems2: CarTypes.QueryIncludedItems = {
  id: 2,
  name: "GPS",
  coverageAmount: 0,
  coverageCurrency: "ISK",
  description: "Garmin unit with the latest update. Many of different language options.",
};

const mockIncludedItems3: CarTypes.QueryIncludedItems = {
  id: 3,
  name: "Extra driver",
  coverageAmount: 0,
  coverageCurrency: "ISK",
  description: "Good for those long trips.",
};

export const mockReviewTotalScore0 = "4.9";

export const mockReviewTotalCount0 = 87;

export const mockQueryCar0: CarTypes.QueryCar = {
  id: "0",
  url: "/car0",
  orSimilar: true,
  establishment: {
    id: "5441",
    name: mockEstablishmentName0,
    image: mockQueryEstablishmentImage0,
  },
};

export const mockCategoryStringQuickFact = {
  id: "0",
  label: "Category",
  value: "Jeep / SUV",
  Icon: CarIcon,
};

export const mockSeatsQuickFact = {
  id: "1",
  label: "People",
  value: {
    key: "Seats {numberOfSeats} people",
    options: {
      numberOfSeats: 5,
    },
  },
  Icon: TravellersIcon,
  translateValue: true,
};

export const mockLuggageQuickFact = {
  id: "2",
  label: "Large bags",
  value: {
    key: "{numberOfBags} bags",
    options: {
      numberOfBags: 3,
    },
  },
  Icon: BagIcon,
  translateValue: true,
};

export const mockTransmissionQuickFact = {
  id: "3",
  label: "Transmission",
  value: "Manual",
  Icon: CarGearIcon,
};

export const mockFuelQuickFact = {
  id: "4",
  label: "Fuel policy",
  value: "Gasoline",
  Icon: CarGasIcon,
};

export const mockMilageQuickFact = {
  id: "5",
  label: "Milage",
  value: "Unlimited",
  Icon: RoadIcon,
};

export const mockDepositQuickFact = {
  id: "6",
  label: "Deposit",
  value: "Required",
  Icon: WalletIcon,
  translateValue: true,
};

export const mockYearQuickFact = {
  id: "7",
  label: "Year",
  value: "2016",
  Icon: CarIcon,
};

export const mockDoorsQuickFact = {
  id: "8",
  label: "Doors",
  value: {
    key: "{numberOfDoors} doors",
    options: {
      numberOfDoors: 5,
    },
  },
  Icon: CarSearchIcon,
  translateValue: true,
};

export const mockHighlandCapabilitiesQuickFact = {
  id: "9",
  label: "Highland Capabilities",
  value: "Yes",
  Icon: RoadWoodsIcon,
  translateValue: true,
};

export const mockAirconQuickFact = {
  id: "10",
  label: "Aircon",
  value: "Included",
  Icon: SnowIcon,
  translateValue: true,
};

export const commonLocationDetails = {
  address: "Keflavík airport",
  phoneNumber: "1234567",
  cityName: "Keflavík",
  locationId: 0,
  streetNumber: "Keflavík airrport",
  postalCode: "235",
  country: "Iceland",
  lat: 63.99,
  lng: -22.61,
  name: "Keflavík airport",
  openingHours: [
    {
      isOpen: true,
      openFrom: "08:00",
      openTo: "16:00",
      dayOfWeek: 1,
    },
    {
      isOpen: true,
      openFrom: "08:00",
      openTo: "16:00",
      dayOfWeek: 2,
    },
  ],
};

const mockMapData = {
  latitude: 63.99,
  longitude: -22.61,
  location: "Keflavík airrport",
  zoom: 5,
  points: [],
  options: {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  },
  isCountryMap: true,
};

export const mockLocationDetails = {
  pickup: {
    ...commonLocationDetails,
    isAirportPickup: true,
    isHotelPickup: false,
    mapData: mockMapData,
  },
  dropoff: {
    ...commonLocationDetails,
    isAirportDropoff: true,
    isHotelDropoff: false,
    mapData: mockMapData,
  },
};

export const mockInsuranceInfo = {
  policyName: "Full Protection",
  description:
    "You can face unexpected costs during your trip because certain repair types and costs are not covered by the car hire company",
  inclusionsList: [
    {
      title: "Excess charges for damages",
      content:
        "Your rental has an excess. This is the amount that can be deducted for repairs to the body of the vehicle or if the vehicle is stolen.",
      translationKeys: {
        keys: [],
      },
    },
    {
      title: "Damages commonly excluded by rental companies",
      content:
        "Collision Damage Waivers often exclude repair/replacement of windows, windscreens, tyres, wheels, roof, underbody & more.",
      translationKeys: {
        keys: [],
      },
    },
    {
      title: "Additional charges applied when your vehicle is damaged",
      content:
        "Whenever there is any damageto your vehicle there  will be administration charges and relocation & loss of use charges.",
      translationKeys: {
        keys: [],
      },
    },
  ],
  disclaimer:
    "You confirm you have  read and agree to the Policy terms. The insurance is arranged by Cover Genious Limited and underwritten by Collision Insurance Europe Limited who are authorised and regulated by the FCA , and the MFSA respectively.",
  translationKeys: {
    keys: [],
  },
};

export const mockCar0: CarTypes.Car = {
  cover: {
    name: "Suzuki Vitara 2016",
    images: [mockCarImage0, mockCarImage1, mockCarImage2],
  },
  orSimilar: true,
  valuePropositions: [
    { Icon: CancellationIcon, title: "Free cancellation" },
    { Icon: CustomerSupportIcon, title: "24/7 customer support" },
    { Icon: BestPriceIcon, title: "Best price guarantee" },
  ],
  reviewTotalScore: Number(mockReviewTotalScore0),
  reviewTotalCount: mockReviewTotalCount0,
  quickFacts: [
    mockCategoryStringQuickFact,
    mockSeatsQuickFact,
    mockLuggageQuickFact,
    mockTransmissionQuickFact,
    mockFuelQuickFact,
    mockMilageQuickFact,
    mockDepositQuickFact,
    mockYearQuickFact,
    mockDoorsQuickFact,
    mockHighlandCapabilitiesQuickFact,
    mockAirconQuickFact,
  ],
  establishment: {
    id: "5441",
    name: mockEstablishmentName0,
    image: mockEstablishmentImage0,
  },
  discountPercent: 10,
  locationDetails: mockLocationDetails,
  insuranceInformation: mockInsuranceInfo,
};

export const mockAvailableInsurances: CarTypes.QueryAvailableExtras[] = [
  mockAvailableInsurance0,
  mockAvailableInsurance1,
  mockAvailableInsurance2,
];

export const mockExtrasData = [
  {
    id: "1",
    name: "GPS",
    price: 0,
    included: true,
    multiple: false,
    code: "GPS",
    description: "Complimentary Latest Model Garmin SatNav GPS",
  },
  {
    id: "4",
    name: "Roof box",
    price: 5000,
    included: false,
    multiple: true,
    code: "RB",
    description:
      "Sturdy roof box for additional luggage space, up to 2 large bags or 5 small bags.",
  },
  {
    id: "6",
    name: "Booster",
    price: 1000,
    included: false,
    multiple: true,
    code: "BT",
    description:
      "Protect your children at all times Nothing matters more than your children‘s safety. Icelandic law requires that children must be seated in a safety seat. When you book a rental car with us, make sure you request a safety seat for each child travelling with you. There are three different options available, depending on the age or height of the child. You can choose the seat you need while making your online reservation",
  },
  {
    id: "38",
    name: "Wifi",
    price: 5000,
    included: false,
    multiple: false,
    code: "WF",
    description:
      "free portable wifi device, up to 1GB data free. Unlimited wifi data cost ISK5000 for the whole trip.",
  },
  {
    id: "5",
    name: "Extra driver",
    price: 2000,
    included: false,
    multiple: true,
    code: "ED",
    description: "Let someone else take the wheel.",
  },
] as OptionsTypes.Option[];

export const mockInsurancesData = [
  {
    id: "319",
    name: "Collision damage waiver",
    price: 0,
    included: true,
    multiple: false,
    code: "CDW",
    description:
      "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
  },
  {
    id: "367",
    name: "Gravel protection",
    price: 4000,
    included: false,
    multiple: false,
    code: "GP",
    description:
      "The Gravel protection covers the windscreen, headlights and the body of the car from damages resulting from gravel hurled at the vehicle. \nThis insurance lowers the excess / self risk in respect of windshield caused by gravel to ISK 20,000, Self risk in other damages ISK 0.",
  },
  {
    id: "368",
    name: "Sand & ash damage waiver",
    price: 4000,
    included: false,
    multiple: false,
    code: "SADW",
    description:
      "Sand and Ash Protection ( SAAP) covers damages caused by Ash / Sandstorm to the paint of the car, lights and plastic. Excess/self risk for SAAP reduced from ISK1,500,000 down to ISK150,000.",
  },
  {
    id: "366",
    name: "Super collision damage waiver",
    price: 5000,
    included: false,
    multiple: false,
    code: "SCDW",
    description:
      "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
  },
] as OptionsTypes.Option[];

export const mockFormData = {
  fromDate: "2020-02-28",
  toDate: "2020-02-29",
  pickupId: "1",
  dropoffId: "1",
  pickupTime: "10:30",
  dropoffTime: "10:30",
  extras: mockExtrasData,
  insurances: mockInsurancesData,
};

export const mockCarOfferData = {
  pickupLocation: "Keflavík airport",
  pickupSpecify: "",
  dropoffSpecify: "",
  dropoffLocation: "Keflavík airport",
  includedItems: [mockIncludedItems1, mockIncludedItems2, mockIncludedItems3],
  availableInsurancesItems: [
    mockAvailableInsurance0,
    mockAvailableInsurance1,
    mockAvailableInsurance2,
  ],
  availableExtrasItems: [mockAvailableExtras0, mockAvailableExtras1, mockAvailableExtras2],
};

export const mockCarIncludedOption = {
  id: "319",
  name: "Collision damage waiver",
  price: 0,
  included: false,
  multiple: true,
  code: "CDW",
  description:
    "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
} as OptionsTypes.Option;

export const mockCarMultipleOption = {
  id: "319",
  name: "Collision damage waiver",
  price: 0,
  included: false,
  multiple: true,
  code: "CDW",
  description:
    "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
} as OptionsTypes.Option;

export const mockCarCheckboxOption = {
  id: "319",
  name: "Collision damage waiver",
  price: 0,
  included: false,
  multiple: false,
  code: "CDW",
  description:
    "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
} as OptionsTypes.Option;

export const mockAvailableListItem1: SharedTypes.Icon = {
  id: "319",
  title: "Collision damage waiver",
  isClickable: true,
  description:
    "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
};

export const mockAvailableListItem2: SharedTypes.Icon = {
  id: "366",
  title: "Super collision damage waiver",
  isClickable: true,
  description:
    "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
};

export const mockAvailableListItem3: SharedTypes.Icon = {
  id: "367",
  title: "Gravel protection",
  isClickable: true,
  description:
    "The Gravel protection covers the windscreen, headlights and the body of the car from damages resulting from gravel hurled at the vehicle.",
};

export const mockAvailableItemList = [
  mockAvailableListItem1,
  mockAvailableListItem2,
  mockAvailableListItem3,
] as SharedTypes.Icon[];

export const mockCarRentalQueryOpeningHours01 = [
  {
    isOpen: true,
    openFrom: "00:01",
    openTo: "08:59",
    dayOfWeek: 0,
  },
  {
    isOpen: true,
    openFrom: "08:30",
    openTo: "18:30",
    dayOfWeek: 0,
  },
  {
    isOpen: true,
    openFrom: "19:01",
    openTo: "23:59",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHoursMerged01 = [
  {
    isOpen: true,
    openFrom: "00:01",
    openTo: "18:30",
    dayOfWeek: 0,
  },
  {
    isOpen: true,
    openFrom: "19:01",
    openTo: "23:59",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHours02 = [
  {
    isOpen: true,
    openFrom: "07:00",
    openTo: "18:00",
    dayOfWeek: 2,
  },
];

export const mockCarRentalQueryOpeningHours03 = [
  {
    isOpen: true,
    openFrom: "08:00",
    openTo: "18:00",
    dayOfWeek: 0,
  },
  {
    isOpen: true,
    openFrom: "09:00",
    openTo: "18:00",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHoursMerged03 = [
  {
    isOpen: true,
    openFrom: "08:00",
    openTo: "18:00",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHours04 = [
  {
    isOpen: true,
    openFrom: "00:00",
    openTo: "09:00",
    dayOfWeek: 0,
  },
  {
    isOpen: true,
    openFrom: "09:00",
    openTo: "12:00",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHoursMerged04 = [
  {
    isOpen: true,
    openFrom: "00:00",
    openTo: "12:00",
    dayOfWeek: 0,
  },
];

export const mockCarRentalQueryOpeningHours05 = [
  ...mockCarRentalQueryOpeningHours03,
  ...mockCarRentalQueryOpeningHours04,
].sort((a, b) => (a.openFrom <= b.openFrom ? -1 : 1));

export const mockCarRentalQueryOpeningHoursMerged05 = [
  {
    isOpen: true,
    openFrom: "00:00",
    openTo: "18:00",
    dayOfWeek: 0,
  },
];

export const mockCarRentalAddToCartData: CarTypes.AddCarToCartData = {
  driverAge: "45",
  driverCountryCode: "IS",
  dropoffId: 0,
  dropoffSpecify: "",
  from: new Date("2022-05-18T07:00:00.000Z"),
  to: new Date("2022-05-19T07:00:00.000Z"),
  id: "iGqYYJrLd06vn8uKsemnNA-160",
  pickupId: 0,
  pickupSpecify: "",
  provider: CarProvider.CARNECT,
  queryDropoffId: "1171,1",
  queryPickupId: "1171,1",
  extras: [],
  selectedExtras: [
    {
      id: "13",
      count: 1,
      questionAnswers: [],
    },
    {
      id: "7",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "8",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "222",
      count: 0,
      questionAnswers: [],
    },
  ],
  insurances: [
    {
      id: "CDW",
      name: "Collision Damage Waiver",
      price: 0,
      included: false,
      multiple: false,
      code: "CDW",
      pricePerDay: true,
      max: 1,
      description: "with excess up to  180,573",
      payOnLocation: false,
      questions: [],
    },
    {
      id: "413",
      name: "Full Protection",
      price: 4875.48,
      included: false,
      multiple: false,
      code: "413",
      pricePerDay: false,
      max: 1,
      description: "",
      payOnLocation: false,
      questions: [],
    },
  ],
  selectedInsurances: [
    {
      id: "CDW",
      selected: false,
      code: "CDW",
    },
    {
      id: "413",
      selected: true,
      code: "413",
    },
  ],
};

export const mockCarRentalAddToCartDataExtra: OptionsTypes.Option = {
  id: "5",
  name: "Additional Driver",
  price: 0,
  included: true,
  multiple: false,
  code: "",
  pricePerDay: true,
  max: 1,
  description:
    "1 Extra driver is free of charge. Only those named as drivers in the rental agreement are allowed to drive the vehicle. Maximum 3 drivers per booking. Price for 3rd driver is 500 ISK per day, payable upon arrival.",
  payOnLocation: false,
  questions: [],
};

export const mockCarAddCarToCarInput = {
  carDropoffDate: "2022-05-19",
  carDropoffId: 0,
  carDropoffSpecificValue: "",
  carDropoffTime: "07:00",
  carPickupDate: "2022-05-18",
  carPickupId: 0,
  carPickupSpecificValue: "",
  carPickupTime: "07:00",
  carnectOfferId: "iGqYYJrLd06vn8uKsemnNA-160",
  driverAge: "45",
  driverCountryCode: "IS",
  externalDropoffId: "1171,1",
  externalPickupId: "1171,1",
  extras: [
    {
      id: 13,
      questionAnswers: [],
      selected_value: "1",
    },
  ],
  id: null,
  insurances: ["413"],
};

export const mockGTECarRentalAddToCartData1: CarTypes.AddCarGTEToCartData = {
  id: "RFmV3lX0EEycIreA139XfQ-433",
  selectedExtras: [
    {
      id: "8",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "9",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "222",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "13",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "10",
      count: 0,
      questionAnswers: [],
    },
  ],
  selectedInsurances: [
    {
      id: "CDW",
      selected: false,
      code: "CDW",
    },
    {
      id: "SLI",
      selected: false,
      code: "SLI",
    },
    {
      id: "413",
      selected: false,
      code: "413",
    },
  ],
  driverAge: "45",
  driverCountryCode: "DE",
};

export const mockGTECarRentalInput1: CarTypes.MutationGTEAddCarToCartInput = {
  driverAge: 45,
  driverCountryCode: "DE",
  extras: [],
  insurances: [],
  offerId: "RFmV3lX0EEycIreA139XfQ-433",
};

export const mockGTECarRentalAddToCartData2: CarTypes.AddCarGTEToCartData = {
  ...mockGTECarRentalAddToCartData1,
  selectedExtras: [
    ...mockGTECarRentalAddToCartData1.selectedExtras,
    {
      id: "222",
      count: 1,
      questionAnswers: [
        {
          key: "extra_222_firstname",
          answer: "rrrr",
          identifier: "1",
        },
        {
          key: "extra_222_lastname",
          answer: "bbbb",
          identifier: "1",
        },
        {
          key: "extra_222_age",
          answer: "19",
          identifier: "1",
        },
      ],
    },
    {
      id: "10",
      count: 1,
      questionAnswers: [],
    },
  ],
};

export const mockGTECarRentalInput2: CarTypes.MutationGTEAddCarToCartInput = {
  ...mockGTECarRentalInput1,
  extras: [
    {
      count: 1,
      id: 222,
      questionAnswers: [
        {
          answer: "rrrr",
          identifier: "1",
          key: "extra_222_firstname",
        },
        {
          answer: "bbbb",
          identifier: "1",
          key: "extra_222_lastname",
        },
        {
          answer: "19",
          identifier: "1",
          key: "extra_222_age",
        },
      ],
    },
    {
      count: 1,
      id: 10,
      questionAnswers: [],
    },
  ],
};
