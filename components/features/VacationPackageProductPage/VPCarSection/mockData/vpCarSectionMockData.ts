import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import { getFormattedDate, isoFormat } from "utils/dateUtils";
import { mockImage0, mockUrl0, mockName0 } from "utils/mockData/mockGlobalData";
import CarIcon from "components/icons/car.svg";
import DepositIcon from "components/icons/money-wallet-open.svg";
import TravellersIcon from "components/icons/travellers.svg";
import BagIcon from "components/icons/bag-handle.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import CarGasIcon from "components/icons/gas-load.svg";
import CarSearchIcon from "components/icons/car-actions-search-1.svg";
import SnowIcon from "components/icons/temperature-snowflake-1.svg";

export const mockCarSelectedDates = {
  dateFrom: "2022-02-01 10:00",
  dateTo: "2022-02-10 10:00",
} as SharedTypes.SelectedDatesQuery;

export const mockISODates = {
  dateFromISO: getFormattedDate(new Date(mockCarSelectedDates.dateFrom!), isoFormat),
  dateToISO: getFormattedDate(new Date(mockCarSelectedDates.dateTo!), isoFormat),
};

export const mockCarSearchParams = {
  driverAge: "45",
  sourceCountry: "DE",
  from: mockISODates.dateFromISO,
};

export const mockCarSelectedInfo = {
  selectedDates: constructSelectedDatesFromQuery({
    dateFrom: mockCarSelectedDates.dateFrom,
    dateTo: mockCarSelectedDates.dateTo,
    withTime: true,
  }),
  pickupId: "46,1",
  dropoffId: "46,1",
  pickupLocationName: "Madrid, Spain",
  dropoffLocationName: "Madrid, Spain",
};

// UNIT TEST MOCK DATA
const commonCarInfo = {
  images: [
    {
      imageId: 0,
      url: mockUrl0,
      name: mockName0,
    },
  ],
  orSimilar: true,
};

const commonQuickfacts = {
  passengerQuantity: 4,
  bagQuantity: 3,
  manualTransmission: true,
  fuelPolicy: "FULL_TO_FULL",
  milage: {
    unlimited: true,
    distance: "",
  },
  model: 2002,
  depositRequired: true,
  doors: 4,
  highlandCapabilities: false,
  airConIncluded: true,
  minAge: 0,
  year: 2002,
};

const commonVehicleCharges = {
  discount: {
    percent: "0",
    amount: 0,
  },
};

const commonCar = {
  provider: "CARNECT",
  totalCharge: {
    estimatedTotalAmount: 123,
    currency: "USD",
  },
  included: [],
  vendor: {
    id: "1",
    reviewCount: 25,
    reviewAverageFormatted: "4.2",
    image: mockImage0,
    name: "Cars",
  },
  productProps: [],
  recommendedOrderScore: 3,
  priceOrderScore: 1,
  filters: [],
};

const smallCar1 = {
  ...commonCar,
  idContext: 2048273,
  carInfo: {
    vehicleCategory: "1",
    ...commonCarInfo,
    name: "Volkswagen Polo",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 89,
      },
    },
  },
  quickFacts: { category: "Small", ...commonQuickfacts },
};

const smallCar2 = {
  ...commonCar,
  idContext: 9572248,
  carInfo: {
    vehicleCategory: "1",
    ...commonCarInfo,
    name: "Renault Clio",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 91,
      },
    },
  },
  quickFacts: { category: "Small", ...commonQuickfacts },
};

const smallCar3 = {
  ...commonCar,
  idContext: 2048273,
  carInfo: {
    vehicleCategory: "1",
    ...commonCarInfo,
    name: "Volkswagen Polo",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 93,
      },
    },
  },
  quickFacts: { category: "Small", ...commonQuickfacts },
};

const mediumCar = {
  ...commonCar,
  idContext: 100000,
  carInfo: {
    vehicleCategory: "2",
    ...commonCarInfo,
    name: "A medium VW",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 93,
      },
    },
  },
  quickFacts: { category: "Medium", ...commonQuickfacts },
};

const premiumCar = {
  ...commonCar,
  idContext: 100001,
  carInfo: {
    vehicleCategory: "8",
    ...commonCarInfo,
    name: "A premium VW",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 93,
      },
    },
  },
  quickFacts: { category: "Premium", ...commonQuickfacts },
};

const largeCar = {
  ...commonCar,
  idContext: 100002,
  carInfo: {
    vehicleCategory: "3",
    ...commonCarInfo,
    name: "A large VW",
  },
  rentalRate: {
    vehicleCharges: {
      ...commonVehicleCharges,
      basePrice: {
        amount: 93,
      },
    },
  },
  quickFacts: { category: "Large", ...commonQuickfacts },
};

export const mockCombinedCars: CarSearchTypes.QueryCarSearch[] = [smallCar1, mediumCar, premiumCar];

export const mockCombinedCarsNoMedium: CarSearchTypes.QueryCarSearch[] = [
  smallCar2,
  largeCar,
  premiumCar,
];

export const mockCombinedCarsOnlySmall: CarSearchTypes.QueryCarSearch[] = [
  smallCar1,
  smallCar2,
  smallCar3,
];

const commonCarSpecs = [
  {
    Icon: CarGearIcon,
    name: "Transmission",
    value: "Manual",
  },
  {
    Icon: TravellersIcon,
    name: "People",
    value: "Seats {numberOfSeats} people",
  },
  {
    Icon: BagIcon,
    name: "Large bags",
    value: "{numberOfBags} bags",
  },
  {
    Icon: CarGasIcon,
    name: "Fuel policy",
    value: "Full to full",
  },
  {
    Icon: DepositIcon,
    name: "Deposit",
    value: "Required",
  },
  {
    Icon: CarSearchIcon,
    name: "Year",
    value: "2002",
  },
  {
    Icon: CarSearchIcon,
    name: "Doors",
    value: "{numberOfDoors} doors",
  },
  {
    Icon: SnowIcon,
    name: "Air con",
    value: "Included",
  },
];

const commonCarDetailedInfo = {
  provider: "CARNECT",
  Icon: CarIcon,
  linkUrl: "",
  image: {
    id: "0",
    url: "https://guidetoiceland.imgix.net/370148/x/0/on-a-summer-self-drive-tour-you-could-stop-at-mt-kirkjufell-on-the-snaefellsnes-peninsula-and-capture-a-dramatic-photo-of-the-mountain-bathed-in-the-rays-of-the-midnight-sun-3",
    name: "Golden Circle Trails",
  },
  carProps: [],
  averageRating: 4.2,
  reviewsCount: 25,
  price: 123,
  establishment: {
    name: "Cars",
    image: {
      id: "0",
      url: "https://guidetoiceland.imgix.net/370148/x/0/on-a-summer-self-drive-tour-you-could-stop-at-mt-kirkjufell-on-the-snaefellsnes-peninsula-and-capture-a-dramatic-photo-of-the-mountain-bathed-in-the-rays-of-the-midnight-sun-3",
      name: "Golden Circle Trails",
    },
  },
  currency: "USD",
  priceOrderScore: 1,
  recommendedOrderScore: 3,
  filters: [],
  ribbonLabelText: "{discountPercentage}% discount",
  totalSaved: 0,
  selected: undefined,
  vpPrice: undefined,
};

export const mockVPCars: VacationPackageTypes.VPCarSearch[] = [
  {
    id: 2048273,
    vehicleCategory: "1",
    name: "Volkswagen Polo",
    headline: "Volkswagen Polo, or similar",
    subtype: "Small",
    ...commonCarDetailedInfo,
    category: "Small",
    fallBackImg: {
      height: 250,
      id: "1",
      name: "small car fallback",
      url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Small",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: 100000,
    vehicleCategory: "2",
    name: "A medium VW",
    headline: "A medium VW, or similar",
    subtype: "Medium",
    ...commonCarDetailedInfo,
    category: "Medium",
    fallBackImg: {
      height: 250,
      id: "2",
      name: "medium car fallback",
      url: "https://gte-gcms.imgix.net/AGeNgIxyT3iFAom9D2iW",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Medium",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: 100001,
    vehicleCategory: "8",
    name: "A premium VW",
    headline: "A premium VW, or similar",
    subtype: "Premium",
    ...commonCarDetailedInfo,
    category: "Premium",
    fallBackImg: {
      height: 250,
      id: "8",
      name: "jeep/suv fallback",
      url: "https://gte-gcms.imgix.net/W69yfr22S0uVTic0pYzP",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Premium",
      },
      ...commonCarSpecs,
    ],
  },
];

export const mockVPCarsNoMedium: VacationPackageTypes.VPCarSearch[] = [
  {
    id: 9572248,
    vehicleCategory: "1",
    name: "Renault Clio",
    headline: "Renault Clio, or similar",
    subtype: "Small",
    ...commonCarDetailedInfo,
    category: "Small",
    fallBackImg: {
      height: 250,
      id: "1",
      name: "small car fallback",
      url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Small",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: 100002,
    vehicleCategory: "3",
    name: "A large VW",
    headline: "A large VW, or similar",
    subtype: "Large",
    ...commonCarDetailedInfo,
    category: "Large",
    fallBackImg: {
      height: 250,
      id: "3",
      name: "large car fallback",
      url: "https://gte-gcms.imgix.net/iwjtLM1VRgldi4LOlgCT",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Large",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: 100001,
    vehicleCategory: "8",
    name: "A premium VW",
    headline: "A premium VW, or similar",
    subtype: "Premium",
    ...commonCarDetailedInfo,
    category: "Premium",
    fallBackImg: {
      height: 250,
      id: "8",
      name: "jeep/suv fallback",
      url: "https://gte-gcms.imgix.net/W69yfr22S0uVTic0pYzP",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Premium",
      },
      ...commonCarSpecs,
    ],
  },
];

export const mockVPCarsOnlySmall: VacationPackageTypes.VPCarSearch[] = [
  {
    id: smallCar1.idContext,
    vehicleCategory: smallCar1.carInfo.vehicleCategory,
    name: smallCar1.carInfo.name,
    headline: "Volkswagen Polo, or similar",
    subtype: smallCar1.quickFacts.category,
    ...commonCarDetailedInfo,
    category: "Small",
    fallBackImg: {
      height: 250,
      id: "1",
      name: "small car fallback",
      url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Small",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: smallCar2.idContext,
    vehicleCategory: smallCar2.carInfo.vehicleCategory,
    name: smallCar2.carInfo.name,
    headline: "Renault Clio, or similar",
    subtype: smallCar2.quickFacts.category,
    ...commonCarDetailedInfo,
    category: "Small",
    fallBackImg: {
      height: 250,
      id: "1",
      name: "small car fallback",
      url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Small",
      },
      ...commonCarSpecs,
    ],
  },
  {
    id: smallCar3.idContext,
    vehicleCategory: smallCar3.carInfo.vehicleCategory,
    name: smallCar3.carInfo.name,
    headline: "Volkswagen Polo, or similar",
    subtype: smallCar3.quickFacts.category,
    ...commonCarDetailedInfo,
    category: "Small",
    fallBackImg: {
      height: 250,
      id: "1",
      name: "small car fallback",
      url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
      width: 330,
    },
    carSpecs: [
      {
        Icon: CarIcon,
        name: "Category",
        value: "Small",
      },
      ...commonCarSpecs,
    ],
  },
];
