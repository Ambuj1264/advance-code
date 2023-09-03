import dateFnsParse from "date-fns/parse";
import { range } from "fp-ts/lib/Array";

import {
  constructCarRentalCartInput,
  constructGTECarRentalCartInput,
  constructOffer,
  constructSimilarCars,
  getCarProductUrl,
  getCarSearchUrl,
  mergeOverlappingTimes,
} from "../carUtils";
import {
  mockCarAddCarToCarInput,
  mockCarRentalAddToCartData,
  mockCarRentalAddToCartDataExtra,
  mockCarRentalQueryOpeningHours01,
  mockCarRentalQueryOpeningHours02,
  mockCarRentalQueryOpeningHours03,
  mockCarRentalQueryOpeningHours04,
  mockCarRentalQueryOpeningHours05,
  mockCarRentalQueryOpeningHoursMerged01,
  mockCarRentalQueryOpeningHoursMerged03,
  mockCarRentalQueryOpeningHoursMerged04,
  mockCarRentalQueryOpeningHoursMerged05,
  mockGTECarRentalAddToCartData1,
  mockGTECarRentalAddToCartData2,
  mockGTECarRentalInput1,
  mockGTECarRentalInput2,
} from "../mockCarData";

import CheckShieldIcon from "components/icons/check-shield-alternate.svg";
import CarSearchIcon from "components/icons/car-actions-search-1.svg";
import CarGPSIcon from "components/icons/car-gps.svg";
import ExtraDriverIcon from "components/icons/extra-driver.svg";
import { isoFormat } from "utils/dateUtils";
import { mockImage0, mockName0, mockQueryImage0, mockUrl0 } from "utils/mockData/mockGlobalData";
import { CarProvider, Marketplace, SupportedLanguages } from "types/enums";
import CarIcon from "components/icons/car.svg";
import CarGearIcon from "components/icons/car-dashboard-gear.svg";
import BagIcon from "components/icons/bag-handle.svg";
import TravellersIcon from "components/icons/travellers.svg";
import { NotImportantIconMock } from "utils/testUtils";

const fakeTranslate = (value: string) => value;

describe("constructOffer", () => {
  const extras = [
    {
      id: "1",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "GPS",
      description: "Garmin unit with the latest update. Many of different language options.",
      required: false,
      quantity: 0,
      amount: 150,
      code: "",
      periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
    {
      id: "2",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "Map",
      description:
        "Includes highland and off-road and a lot of details of services around the island.",
      required: true,
      quantity: 1,
      amount: 150,
      code: "",
      periodType: "PER_DAY" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
    {
      id: "5",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "Extra driver",
      description: "Good for those long trips.",
      required: false,
      quantity: 2,
      amount: 150,
      code: "",
      periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
    {
      id: "319",
      type: "INSURANCE" as CarTypes.QueryExtraType,
      name: "Collision damage waiver",
      description:
        "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
      required: true,
      quantity: 1,
      amount: 150,
      code: "CDW",
      periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
    {
      id: "366",
      type: "INSURANCE" as CarTypes.QueryExtraType,
      name: "Super collision damage waiver",
      description:
        "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
      required: false,
      quantity: 0,
      amount: 150,
      code: "SCW",
      periodType: "PER_DAY" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
    {
      id: "367",
      type: "INSURANCE" as CarTypes.QueryExtraType,
      name: "Gravel protection",
      description:
        "The Gravel protection covers the windscreen, headlights and the body of the car from damages resulting from gravel hurled at the vehicle.",
      required: false,
      quantity: 0,
      amount: 150,
      code: "GP",
      periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
      payableNow: true,
      questions: [],
    },
  ];
  const included = [
    {
      includedId: "ABC",
      type: "INSURANCE" as CarTypes.QueryExtraType,
      name: "Any insurances",
      coverageAmount: 0,
      coverageCurrency: "ISK",
      description: "Insure everything!",
      code: "ABC",
      translationKeys: {
        keys: [],
      },
    },
    {
      includedId: "3",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "GPS",
      coverageAmount: 0,
      coverageCurrency: "ISK",
      description: "Never get lost",
      code: "",
      translationKeys: {
        keys: [],
      },
    },
    {
      includedId: "2",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "Extra driver",
      coverageAmount: 0,
      coverageCurrency: "ISK",
      description: "Take a nap while the extra driver drives",
      code: "",
      translationKeys: {
        keys: [],
      },
    },
  ];
  const locationDetails = {
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

  const queryOffer: CarTypes.QueryCarOfferData = {
    cartLink: "/cart",
    searchPageUrl: "search/url",
    searchPageUrlGTI: "iceland-car-rentals",
    carOffer: {
      title: "RENT THIS CAR!",
      pickupTime: "2023-03-15T03:00:00.000Z",
      returnTime: "2023-03-18T10:00:00.000Z",
      locationDetails: {
        pickup: {
          ...locationDetails,
          isAirportPickup: true,
          isHotelPickup: false,
        },
        dropoff: {
          ...locationDetails,
          isAirportDropoff: true,
          isHotelDropoff: false,
        },
      },
      pickupId: 0,
      dropoffId: 0,
      offer: {
        idContext: "123",
        provider: "CAREN",
        included,
        extras,
        rentalRate: {
          vehicleCharges: {
            discount: {
              percent: "0",
            },
            deposit: {
              description: undefined,
              translationKeys: {
                keys: [],
              },
            },
          },
        },
        carInfo: {
          name: "Car",
          images: [mockQueryImage0],
          orSimilar: true,
        },
        establishment: {
          vendorId: "123",
          id: "1",
          reviewCount: 25,
          reviewTotalScore: "4.2",
          image: mockQueryImage0,
          name: "Cars",
        },
        quickFacts: {
          category: "",
          passengerQuantity: 2,
          bagQuantity: 1,
          manualTransmission: true,
          fuelPolicy: null,
          milage: {
            unlimited: true,
            distance: "",
          },
          model: 1920,
          depositRequired: true,
          doors: 3,
          highlandCapabilities: true,
          airConIncluded: false,
          minAge: 20,
          year: 1920,
        },
      },
    },
  };

  const offer = {
    cartLink: "/cart",
    searchPageUrl: "iceland-car-rentals",
    carOffer: {
      title: "RENT THIS CAR!",
      pickupId: 0,
      pickupLocation: "Keflavík airport",
      pickupName: "Keflavík airport",
      dropoffId: 0,
      dropoffLocation: "Keflavík airport",
      dropoffName: "Keflavík airport",
      isAirportDropoff: true,
      isAirportPickup: true,
      isHotelPickup: false,
      isHotelDropoff: false,
      includedItems: [
        {
          id: "0",
          Icon: CarSearchIcon,
          isClickable: true,
          title: "Any insurances",
          description: "Insure everything!",
          details: undefined,
        },
        {
          id: "1",
          Icon: CarGPSIcon,
          isClickable: true,
          title: "GPS",
          description: "Never get lost",
          details: undefined,
        },
        {
          id: "2",
          Icon: CarSearchIcon,
          isClickable: true,
          title: "Extra driver",
          description: "Take a nap while the extra driver drives",
          details: undefined,
        },
      ],
      availableExtrasItems: [
        {
          id: "1",
          isClickable: true,
          title: "GPS",
          Icon: CarGPSIcon,
          description: "Garmin unit with the latest update. Many of different language options.",
        },
        {
          id: "2",
          isClickable: true,
          Icon: CarSearchIcon,
          title: "Map",
          description:
            "Includes highland and off-road and a lot of details of services around the island.",
        },
        {
          id: "5",
          isClickable: true,
          Icon: ExtraDriverIcon,
          title: "Extra driver",
          description: "Good for those long trips.",
        },
      ],
      availableInsurancesItems: [
        {
          id: "319",
          isClickable: true,
          Icon: CheckShieldIcon,
          title: "Collision damage waiver",
          description:
            "CDW – Collision Damage Waiver includes third party liability and personal injury insurance. The lessee/hirer is fully responsible for any and all damage to the car with the excess/own risk of 350.000 ISK.  Premium cars self risk at 600.000 ISK. The lessee/hirer is always responsible for the following damages, which are not covered by insurance: e.g. negligence, driving while intoxicated, damage to tires, headlights, windscreen and the underside of the car, damage caused by loose rocks which get thrown at the car on gravel roads, damage to the engine & transmission vehicle.",
        },
        {
          id: "366",
          isClickable: true,
          Icon: CheckShieldIcon,
          title: "Super collision damage waiver",
          description:
            "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
        },
        {
          id: "367",
          isClickable: true,
          title: "Gravel protection",
          Icon: CheckShieldIcon,
          description:
            "The Gravel protection covers the windscreen, headlights and the body of the car from damages resulting from gravel hurled at the vehicle.",
        },
      ],
      extras,
      included,
      availableLocations: undefined,
      deposit: "",
    },
  };

  const queryOfferWithAirportPickupDropoffAnytime: CarTypes.QueryCarOfferData = {
    ...queryOffer,
    carOffer: {
      ...queryOffer.carOffer,
      locationDetails: {
        pickup: {
          ...queryOffer.carOffer.locationDetails.pickup,
          isAirportPickup: true,
          openingHours: range(0, 6).map(() => ({
            isOpen: true,
            openFrom: "00:00",
            openTo: "00:00",
            dayOfWeek: 0,
          })),
        },
        dropoff: {
          ...queryOffer.carOffer.locationDetails.dropoff,
          isAirportDropoff: true,
          openingHours: range(0, 6).map(() => ({
            isOpen: true,
            openFrom: "00:00",
            openTo: "00:00",
            dayOfWeek: 0,
          })),
        },
      },
    },
  };

  const offerWithAirportPickupDropoffAnytime: {
    cartLink: string;
    searchPageUrl: string;
    carOffer: CarTypes.CarOffer;
  } = {
    ...offer,
    carOffer: {
      ...offer.carOffer,
      includedItems: [
        ...offer.carOffer.includedItems,
        {
          id: "airport-pickup-dropoff",
          isClickable: false,
          title: "Airport pick-up & drop-off",
          Icon: NotImportantIconMock,
          description: "You can receive and return this car to the airport at any time.",
          details: undefined,
        },
      ],
    },
  };

  const convertCurrency = (value: number) => value;
  test("should construct offer correctly", () => {
    expect(
      constructOffer(
        fakeTranslate as TFunction,
        fakeTranslate as TFunction,
        convertCurrency,
        "USD",
        "iceland-car-rentals",
        queryOffer
      )
    ).toEqual(offer);
  });

  test("should construct offer with enabling airport pickup and dropoff in included items if provider is open 24h all week", () => {
    expect(
      constructOffer(
        fakeTranslate as TFunction,
        fakeTranslate as TFunction,
        convertCurrency,
        "USD",
        "iceland-car-rentals",
        queryOfferWithAirportPickupDropoffAnytime
      )
    ).toEqual(offerWithAirportPickupDropoffAnytime);
  });

  test("should construct default offer if offer is undefined", () => {
    expect(
      constructOffer(
        fakeTranslate as TFunction,
        fakeTranslate as TFunction,
        convertCurrency,
        "USD",
        "iceland-car-rentals",
        undefined
      )
    ).toEqual({
      cartLink: "",
      searchPageUrl: "",
      carOffer: {
        pickupLocation: "",
        pickupId: 0,
        dropoffId: 0,
        dropoffLocation: "",
        includedItems: [],
        availableExtrasItems: [],
        availableInsurancesItems: [],
        extras: [],
        included: [],
        isAirportDropoff: false,
        isAirportPickup: false,
        isHotelPickup: false,
        isHotelDropoff: false,
      },
    });
  });
});

describe("constructOffer", () => {
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
    category: "Small",
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
    minAge: 23,
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
    quickFacts: commonQuickfacts,
  };

  const car1 = {
    ...commonCar,
    idContext: 2358371,
    carInfo: {
      vehicleCategory: "1",
      ...commonCarInfo,
      name: "Fiat 500",
    },
    rentalRate: {
      vehicleCharges: {
        ...commonVehicleCharges,
        basePrice: {
          amount: 89,
        },
      },
    },
  };
  const car2 = {
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
    quickFacts: commonQuickfacts,
  };
  const car3 = {
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
    quickFacts: commonQuickfacts,
  };
  const cars: CarSearchTypes.QueryCarSearch[] = [car1, car2, car3];
  const selectedInfo = {
    selectedDates: {
      from: dateFnsParse("2020-11-14T08:00:00.000Z", isoFormat, new Date()),
      to: dateFnsParse("2020-11-19T08:00:00.000Z", isoFormat, new Date()),
    },
    pickupId: "701,2",
    dropoffId: "701,2",
    pickupLocationName: "Keflavik",
    dropoffLocationName: "Keflavik",
  };

  const similarCars = [
    {
      id: "2358371",
      fallBackImg: {
        height: 250,
        id: "1",
        name: "small car fallback",
        url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
        width: 330,
      },
      name: "Fiat 500, or similar",
      lowestPrice: 89,
      image: mockImage0,
      ribbonText: "{discountPercentage}% discount",
      clientRoute: {
        query: {
          from: "2020-11-14 08:00",
          to: "2020-11-19 08:00",
          carId: "2358371",
          pickup_id: "701,2",
          dropoff_id: "701,2",
          provider: "1",
          title: "Fiat 500, or similar",
        },
        route: "/car",
        as: `/car-rental/search-results/book/Fiat%20500/2358371?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
      },
      productProps: [],
      productSpecs: [
        {
          name: "Category",
          value: "Small",
          Icon: CarIcon,
        },
        {
          name: "Transmission",
          value: "Manual",
          Icon: CarGearIcon,
        },
        {
          name: "People",
          value: "Seats {numberOfSeats} people",
          Icon: TravellersIcon,
        },
        {
          name: "Large bags",
          value: "{numberOfBags} bags",
          Icon: BagIcon,
        },
      ],
      linkUrl: `/car-rental/search-results/book/Fiat%20500/2358371?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
    },
    {
      id: "9572248",
      fallBackImg: {
        height: 250,
        id: "1",
        name: "small car fallback",
        url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
        width: 330,
      },
      name: "Renault Clio, or similar",
      lowestPrice: 91,
      image: mockImage0,
      ribbonText: "{discountPercentage}% discount",
      clientRoute: {
        query: {
          from: "2020-11-14 08:00",
          to: "2020-11-19 08:00",
          carId: "9572248",
          pickup_id: "701,2",
          dropoff_id: "701,2",
          provider: "1",
          title: "Renault Clio, or similar",
        },
        route: "/car",
        as: `/car-rental/search-results/book/Renault%20Clio/9572248?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
      },
      productProps: [],
      productSpecs: [
        {
          name: "Category",
          value: "Small",
          Icon: CarIcon,
        },
        {
          name: "Transmission",
          value: "Manual",
          Icon: CarGearIcon,
        },
        {
          name: "People",
          value: "Seats {numberOfSeats} people",
          Icon: TravellersIcon,
        },
        {
          name: "Large bags",
          value: "{numberOfBags} bags",
          Icon: BagIcon,
        },
      ],
      linkUrl: `/car-rental/search-results/book/Renault%20Clio/9572248?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
    },
    {
      id: "2048273",
      fallBackImg: {
        height: 250,
        id: "1",
        name: "small car fallback",
        url: "https://gte-gcms.imgix.net/kd6qIZKBQvatNgxSZXJf",
        width: 330,
      },
      name: "Volkswagen Polo, or similar",
      lowestPrice: 93,
      image: mockImage0,
      ribbonText: "{discountPercentage}% discount",
      clientRoute: {
        query: {
          from: "2020-11-14 08:00",
          to: "2020-11-19 08:00",
          carId: "2048273",
          pickup_id: "701,2",
          dropoff_id: "701,2",
          provider: "1",
          title: "Volkswagen Polo, or similar",
        },
        route: "/car",
        as: `/car-rental/search-results/book/Volkswagen%20Polo/2048273?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
      },
      productProps: [],
      productSpecs: [
        {
          name: "Category",
          value: "Small",
          Icon: CarIcon,
        },
        {
          name: "Transmission",
          value: "Manual",
          Icon: CarGearIcon,
        },
        {
          name: "People",
          value: "Seats {numberOfSeats} people",
          Icon: TravellersIcon,
        },
        {
          name: "Large bags",
          value: "{numberOfBags} bags",
          Icon: BagIcon,
        },
      ],
      linkUrl: `/car-rental/search-results/book/Volkswagen%20Polo/2048273?from=2020-11-14 08:00&to=2020-11-19 08:00&pickup_id=701,2&dropoff_id=701,2&provider=1&driverAge=45&category=Small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik`,
    },
  ];
  const dummyConvert = (value: number) => value;
  test("should construct deafult offer if offer is undefined", () => {
    expect(
      constructSimilarCars(
        selectedInfo,
        fakeTranslate as TFunction,
        Marketplace.GUIDE_TO_ICELAND,
        "/car-rental/search-results/book",
        dummyConvert,
        "ISK",
        SupportedLanguages.Chinese,
        cars
      )
    ).toEqual(similarCars);
  });
});

describe("getCarProductUrl", () => {
  test("should return car product url for GTE", () => {
    expect(getCarProductUrl(Marketplace.GUIDE_TO_EUROPE, SupportedLanguages.English, "")).toEqual(
      "/best-car-rental/details"
    );
  });
  test("should return car product url for GTI", () => {
    expect(
      getCarProductUrl(Marketplace.GUIDE_TO_ICELAND, SupportedLanguages.English, "car-rental")
    ).toEqual("/car-rental/search-results/book");
  });
});

describe("getCarSearchUrl", () => {
  test("should return car search url for GTE", () => {
    expect(getCarSearchUrl(Marketplace.GUIDE_TO_EUROPE, SupportedLanguages.English, "")).toEqual(
      "/best-car-rental"
    );
  });
  test("should return car search url for GTI", () => {
    expect(
      getCarSearchUrl(
        Marketplace.GUIDE_TO_ICELAND,
        SupportedLanguages.English,
        "iceland-car-rentals"
      )
    ).toEqual("/iceland-car-rentals");
  });
});

describe("mergeOverlappingTimes", () => {
  test("should return normalized overlapping times", () => {
    expect(mergeOverlappingTimes(mockCarRentalQueryOpeningHours01)).toEqual(
      mockCarRentalQueryOpeningHoursMerged01
    );
  });
  test("should return the same times if no overlapping is present", () => {
    expect(mergeOverlappingTimes(mockCarRentalQueryOpeningHours02)).toEqual(
      mockCarRentalQueryOpeningHours02
    );
  });
  test("should return the earliest opening time and only one closing time if curr.openTo equals prev.openTo", () => {
    expect(mergeOverlappingTimes(mockCarRentalQueryOpeningHours03)).toEqual(
      mockCarRentalQueryOpeningHoursMerged03
    );
  });
  test("should return the earliest opening time and the latest closing time if curr.openFrom equals prev.openTo", () => {
    expect(mergeOverlappingTimes(mockCarRentalQueryOpeningHours04)).toEqual(
      mockCarRentalQueryOpeningHoursMerged04
    );
  });
  test("should return the earliest opening time and the latest closing time if curr.openFrom equals prev.openTo and curr.openTo equals prev.openTo", () => {
    expect(mergeOverlappingTimes(mockCarRentalQueryOpeningHours05)).toEqual(
      mockCarRentalQueryOpeningHoursMerged05
    );
  });
});

describe("constructCarRentalCartInput", () => {
  test("should construct add to cart car input", () => {
    expect(constructCarRentalCartInput(mockCarRentalAddToCartData)).toEqual(
      mockCarAddCarToCarInput
    );
    expect(
      constructCarRentalCartInput({
        ...mockCarRentalAddToCartData,
        provider: CarProvider.CARNECT,
        id: "111",
      })
    ).toEqual({
      ...mockCarAddCarToCarInput,
      id: null,
      carnectOfferId: "111",
    });
  });

  test("should construct add to cart car input with included INSURANCES by default", () => {
    expect(
      constructCarRentalCartInput({
        ...mockCarRentalAddToCartData,
        insurances: [
          {
            ...mockCarRentalAddToCartData.insurances[0],
            included: true,
          },
        ],
      })
    ).toEqual({
      ...mockCarAddCarToCarInput,
      insurances: [
        mockCarRentalAddToCartData.insurances[0].id,
        ...mockCarAddCarToCarInput.insurances,
      ],
    });
  });

  test("should construct add to cart car input with included EXTRAS by default", () => {
    expect(
      constructCarRentalCartInput({
        ...mockCarRentalAddToCartData,
        extras: [mockCarRentalAddToCartDataExtra],
      })
    ).toEqual({
      ...mockCarAddCarToCarInput,
      extras: [
        {
          id: Number(mockCarRentalAddToCartDataExtra.id),
          selected_value: mockCarRentalAddToCartDataExtra.max.toString(),
          questionAnswers: [],
        },
        ...mockCarAddCarToCarInput.extras,
      ],
    });
  });
});

describe("constructGTECarRentalCartInput", () => {
  test("should construct GTE car rental input and set default params", () => {
    expect(
      constructGTECarRentalCartInput({
        ...mockGTECarRentalAddToCartData1,
        driverAge: undefined,
        driverCountryCode: undefined,
      })
    ).toEqual({
      ...mockGTECarRentalInput1,
    });
  });

  test("should construct GTE car rental input", () => {
    expect(constructGTECarRentalCartInput(mockGTECarRentalAddToCartData1)).toEqual(
      mockGTECarRentalInput1
    );
  });

  test("should construct GTE car rental input with extras", () => {
    expect(constructGTECarRentalCartInput(mockGTECarRentalAddToCartData2)).toEqual(
      mockGTECarRentalInput2
    );
  });
});
