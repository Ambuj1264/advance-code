import {
  constructExperienceAnswers,
  constructExperience,
  constructInitialSelectedExperiences,
  filterAnswerByOptions,
  filterDisabledTourOptionsFromExtras,
  getExtraByTourOptionId,
  getOptionByAnswerId,
  getOptionPrices,
  getExperiencePrice,
  getGroupExperiencePrices,
  constructPrefilledSelectedExperiences,
  getExperienceItemOption,
  sortExperiences,
  shouldShowExtrasHeader,
  getExperienceType,
  ExperienceType,
  constructTourOptions,
  constructGTIVpOptions,
  getExtraBasePrice,
  getItemExperiencePrice,
  getItemPricePerPerson,
  getDefaultAnswer,
  isSelectedAnswerIncluded,
  getNonOptionalFallbackAnswer,
  getExperiencePriceInformation,
  preSelectedTravelExperienceValue,
  checkIsSelectedNonDefaultExperience,
  DEFAULT_EXTERNAL_LIMIT,
} from "../experiencesUtils";
import {
  mockMultiSelectionExperience1,
  mockMultiSelectionExperience2,
  mockTravelerExperience1,
  mockTravelerExperienceWithQuestion1,
  mockTravelerExperienceWithQuestion2,
  mockToggleExperience1,
  mockInformationExperience1,
  mockMultiSelectionExperiences,
} from "../mockData/mockExperienceData";

import { SupportedCurrencies } from "types/enums";

describe("constructExperienceAnswers", () => {
  const options: TourBookingWidgetTypes.Option[] = [
    {
      id: "Id1",
      prices: [{ price: 50, disabled: false }],
      disabled: false,
      included: false,
    },
    {
      id: "Id2",
      prices: [{ price: 150, disabled: false }],
      disabled: false,
      included: false,
    },
    {
      id: "Id3",
      prices: [{ price: 450, disabled: false }],
      disabled: false,
      included: true,
    },
  ];
  const tourOptionAnswers: ExperiencesTypes.TourOptionAnswers = [
    {
      id: "Id1",
      default: "1",
      name: "Yes",
    },
    {
      id: "Id2",
      default: "0",
      name: "No",
    },
    {
      id: "Id3",
      default: "0",
      name: "No",
    },
  ];

  test("should return correctly constructed array of experience answers", () => {
    const experienceAnswers: ExperiencesTypes.ExperienceAnswers = [
      {
        id: "Id1",
        name: "Yes",
        prices: [50],
        included: false,
        isDefault: true,
        vpPrice: {
          selectedOptionDiff: 0,
          discountValue: 0,
        },
      },
      {
        id: "Id2",
        name: "No",
        prices: [150],
        included: false,
        isDefault: false,
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
      },
      {
        id: "Id3",
        name: "No",
        prices: [450],
        included: true,
        isDefault: false,
        vpPrice: {
          selectedOptionDiff: 0,
          discountValue: 0,
        },
      },
    ];

    expect(
      constructExperienceAnswers({
        answers: tourOptionAnswers,
        options,
        currentExperienceId: "",
        selectedExperiences: [],
      })
    ).toEqual(experienceAnswers);
  });

  test("should return correctly constructed array of experience answers with correct vpPrice", () => {
    const experienceAnswers: ExperiencesTypes.ExperienceAnswers = [
      {
        id: "Id1",
        name: "Yes",
        prices: [50],
        included: false,
        isDefault: true,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: -400,
        },
      },
      {
        id: "Id2",
        name: "No",
        prices: [150],
        included: false,
        isDefault: false,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: -300,
        },
      },
      {
        id: "Id3",
        name: "No",
        prices: [450],
        included: true,
        isDefault: false,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: 0,
        },
      },
    ];

    expect(
      constructExperienceAnswers({
        answers: tourOptionAnswers,
        options,
        currentExperienceId: "Id3",
        selectedExperiences: [
          {
            experienceId: "Id3",
            answerId: "Id3",
            prices: [450],
            vpPrice: {
              discountValue: 0,
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
        ],
      })
    ).toEqual(experienceAnswers);

    const experienceAnswers1: ExperiencesTypes.ExperienceAnswers = [
      {
        id: "Id1",
        name: "Yes",
        prices: [50],
        included: false,
        isDefault: true,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: -100,
        },
      },
      {
        id: "Id2",
        name: "No",
        prices: [150],
        included: false,
        isDefault: false,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: 0,
        },
      },
      {
        id: "Id3",
        name: "No",
        prices: [450],
        included: true,
        isDefault: false,
        vpPrice: {
          discountValue: 0,
          selectedOptionDiff: 300,
        },
      },
    ];

    expect(
      constructExperienceAnswers({
        answers: tourOptionAnswers,
        options,
        currentExperienceId: "Id2",
        selectedExperiences: [
          {
            experienceId: "Id2",
            answerId: "Id2",
            prices: [150],
            vpPrice: {
              discountValue: 0,
              selectedOptionDiff: -300,
            },
            calculatePricePerPerson: false,
          },
        ],
      })
    ).toEqual(experienceAnswers1);
  });

  test("should return correctly constructed array of experience answers with correct vpPrice with discount", () => {
    expect(
      constructExperienceAnswers({
        answers: [
          {
            id: "06a6ae154f491b4da2",
            name: "Morning departure no hiking boots rental",
            default: "1",
          },
          {
            id: "5d2f1c7b47910a9c3f",
            name: "Morning departure with hiking boots rental",
            default: "0",
          },
          {
            id: "4bfa5c8b5b0e78378c",
            name: "Afternoon departure no hiking boots rental",
            default: "0",
          },
          {
            id: "81ff7782b9df06d248",
            name: "Afternoon departure with hiking boots rental",
            default: "0",
          },
        ],
        options: [
          {
            id: "06a6ae154f491b4da2",
            disabled: false,
            included: true,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
          {
            id: "5d2f1c7b47910a9c3f",
            disabled: false,
            included: false,
            prices: [
              {
                price: 200000,
                disabled: false,
                discountValue: 1600,
              },
            ],
          },
          {
            id: "4bfa5c8b5b0e78378c",
            disabled: false,
            included: false,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
          {
            id: "81ff7782b9df06d248",
            disabled: false,
            included: false,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
        ],
        currentExperienceId: "82804",
        selectedExperiences: [
          {
            experienceId: "82802",
            answerId: "c629a1b3439efec443",
            prices: [41666.36338329764],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82803",
            answerId: "d05505bd0074df2501",
            prices: [16164.16875],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82804",
            answerId: "06a6ae154f491b4da2",
            prices: [11169.9],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
        ],
      })
    ).toEqual([
      {
        id: "06a6ae154f491b4da2",
        included: true,
        isDefault: true,
        name: "Morning departure no hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: 0,
        },
      },
      {
        id: "5d2f1c7b47910a9c3f",
        included: false,
        isDefault: false,
        name: "Morning departure with hiking boots rental",
        prices: [200000],
        vpPrice: {
          discountValue: 1600,
          selectedOptionDiff: 188830.1,
        },
      },
      {
        id: "4bfa5c8b5b0e78378c",
        included: false,
        isDefault: false,
        name: "Afternoon departure no hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: 0,
        },
      },
      {
        id: "81ff7782b9df06d248",
        included: false,
        isDefault: false,
        name: "Afternoon departure with hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: 0,
        },
      },
    ]);

    expect(
      constructExperienceAnswers({
        answers: [
          {
            id: "06a6ae154f491b4da2",
            name: "Morning departure no hiking boots rental",
            default: "1",
          },
          {
            id: "5d2f1c7b47910a9c3f",
            name: "Morning departure with hiking boots rental",
            default: "0",
          },
          {
            id: "4bfa5c8b5b0e78378c",
            name: "Afternoon departure no hiking boots rental",
            default: "0",
          },
          {
            id: "81ff7782b9df06d248",
            name: "Afternoon departure with hiking boots rental",
            default: "0",
          },
        ],
        options: [
          {
            id: "06a6ae154f491b4da2",
            disabled: false,
            included: true,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
          {
            id: "5d2f1c7b47910a9c3f",
            disabled: false,
            included: false,
            prices: [
              {
                price: 200000,
                disabled: false,
                discountValue: 1600,
              },
            ],
          },
          {
            id: "4bfa5c8b5b0e78378c",
            disabled: false,
            included: false,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
          {
            id: "81ff7782b9df06d248",
            disabled: false,
            included: false,
            prices: [
              {
                price: 11169.9,
                disabled: false,
                discountValue: 1241.1000000000004,
              },
            ],
          },
        ],
        currentExperienceId: "82803",
        selectedExperiences: [
          {
            experienceId: "82802",
            answerId: "c629a1b3439efec443",
            prices: [41666.36338329764],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82803",
            answerId: "d05505bd0074df2501",
            prices: [16164.16875],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
          {
            experienceId: "82804",
            answerId: "06a6ae154f491b4da2",
            prices: [11169.9],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
        ],
      })
    ).toEqual([
      {
        id: "06a6ae154f491b4da2",
        included: true,
        isDefault: true,
        name: "Morning departure no hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: -4994.268750000001,
        },
      },
      {
        id: "5d2f1c7b47910a9c3f",
        included: false,
        isDefault: false,
        name: "Morning departure with hiking boots rental",
        prices: [200000],
        vpPrice: {
          discountValue: 1600,
          selectedOptionDiff: 183835.83125,
        },
      },
      {
        id: "4bfa5c8b5b0e78378c",
        included: false,
        isDefault: false,
        name: "Afternoon departure no hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: -4994.268750000001,
        },
      },
      {
        id: "81ff7782b9df06d248",
        included: false,
        isDefault: false,
        name: "Afternoon departure with hiking boots rental",
        prices: [11169.9],
        vpPrice: {
          discountValue: 1241.1000000000004,
          selectedOptionDiff: -4994.268750000001,
        },
      },
    ]);
  });
});

describe("constructTourOptions", () => {
  test("should return correctly constructed tour options", () => {
    const queryTourOptions: ExperiencesTypes.QueryTourOption[] = [
      {
        id: 124,
        name: "Car",
        answers:
          '[{"id":"7254e723a3f994d2a2","default":"1","name":"Morning departure","included_option":"0","prices":[{"price_winter":"","price_winter_disabled":"0"}]},{"id":"0cd07ca8f78fdd604a","default":"0","name":"Afternoon departure","prices":[{"price_winter":"2000","price_winter_disabled":"0"}]}]',
        calculatePricePerPerson: true,
        questions: [],
        required: true,
      },
      {
        id: 125,
        name: "Accommodation",
        answers:
          '[{"id":"72e9148aa375adc551","default":"1","name":"Morning departure","included_option":"0","prices":[{"price_winter":"0","price_winter_disabled":"0"}]},{"id":"63591d7b5ce998a808","default":"0","name":"Afternoon departure","included_option":"0","prices":[{"price_winter":"0","price_winter_disabled":"0"}]}]',
        calculatePricePerPerson: true,
        questions: [],
        required: true,
      },
      {
        id: 126,
        name: "Blue Lagoon",
        answers: "",
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
    ];

    const tourOptions: ExperiencesTypes.TourOption[] = [
      {
        id: "124",
        name: "Car",
        answers: [
          {
            id: "7254e723a3f994d2a2",
            default: "1",
            name: "Morning departure",
          },
          {
            id: "0cd07ca8f78fdd604a",
            default: "0",
            name: "Afternoon departure",
          },
        ],
        calculatePricePerPerson: true,
        questions: [],
        required: true,
      },
      {
        id: "125",
        name: "Accommodation",
        answers: [
          {
            id: "72e9148aa375adc551",
            default: "1",
            name: "Morning departure",
          },
          {
            id: "63591d7b5ce998a808",
            default: "0",
            name: "Afternoon departure",
          },
        ],
        calculatePricePerPerson: true,
        questions: [],
        required: true,
      },
      {
        id: "126",
        name: "Blue Lagoon",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
    ];

    expect(constructTourOptions(queryTourOptions)).toEqual(tourOptions);
  });
});

describe("constructGTIVpOptions", () => {
  const vpOptions: TourBookingWidgetTypes.QueryVpOptions[] = [
    {
      id: 76870,
      name: "Accommodation",
      price: {
        value: 27600,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: true,
      items: [
        {
          id: "3d2e97301413d81220",
          name: "Comfort (private bath)",
          isDefault: true,
          price: {
            value: 27600,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "4aae67818440f37671",
          name: "Quality (handpicked hotels)",
          isDefault: false,
          price: {
            value: 42720,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
      ],
    },
    {
      id: 76871,
      name: "Car",
      price: {
        value: 25080,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: true,
      items: [
        {
          id: "23371e50ec8e854382",
          name: "Super Budget 2WD Manual",
          isDefault: true,
          price: {
            value: 25080,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "836182a58f3ab6a7ca",
          name: "Super Budget 2WD Automatic",
          isDefault: false,
          price: {
            value: 32760,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "567a666fd27587b4ae",
          name: "Budget 2WD Manual",
          isDefault: false,
          price: {
            value: 29880,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "911d01e94b21b7d6ec",
          name: "Budget 2WD Automatic",
          isDefault: false,
          price: {
            value: 31776,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "ae3b14ce1298cb2129",
          name: "Budget 4X4 Manual",
          isDefault: false,
          price: {
            value: 39000,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "e139504411fa9d47ae",
          name: "Comfort 4WD Manual",
          isDefault: false,
          price: {
            value: 45240,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "1ecabe2bb0c07a344c",
          name: "Comfort 4WD Automatic",
          isDefault: false,
          price: {
            value: 47736,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "235f1ad86f39252e6d",
          name: "Luxury 4WD Automatic",
          isDefault: false,
          price: {
            value: 86040,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "09a20302a9760e53a7",
          name: "4WD Van Manual",
          isDefault: false,
          price: {
            value: 85440,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
      ],
    },
    {
      id: 76869,
      name: "Blue Lagoon (minimum age 2)",
      price: {
        value: 0,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: true,
      items: [
        {
          id: "0f086bbf325508800b",
          name: "Skip the Blue Lagoon",
          isDefault: true,
          price: {
            value: 0,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "0b44f43b6bcf3001f8",
          name: "Comfort Entrance",
          isDefault: false,
          price: {
            value: 10788,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
        {
          id: "49b7bdb78cfb8a1007",
          name: "Premium Entrance",
          isDefault: false,
          price: {
            value: 13788,
            currency: "ISK",
            discount: 0,
          },
          isIncluded: false,
        },
      ],
    },
    {
      id: 87314,
      name: "Extra luggage (per piece) on the south coast tour",
      price: {
        value: 1150,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: true,
      items: [],
    },
  ];
  const resultVpOptions = [
    {
      answers: [
        {
          default: "1",
          id: "3d2e97301413d81220",
          name: "Comfort (private bath)",
        },
        {
          default: "0",
          id: "4aae67818440f37671",
          name: "Quality (handpicked hotels)",
        },
      ],
      calculatePricePerPerson: false,
      id: "76870",
      name: "Accommodation",
      questions: [],
      required: true,
    },
    {
      answers: [
        {
          default: "1",
          id: "23371e50ec8e854382",
          name: "Super Budget 2WD Manual",
        },
        {
          default: "0",
          id: "836182a58f3ab6a7ca",
          name: "Super Budget 2WD Automatic",
        },
        {
          default: "0",
          id: "567a666fd27587b4ae",
          name: "Budget 2WD Manual",
        },
        {
          default: "0",
          id: "911d01e94b21b7d6ec",
          name: "Budget 2WD Automatic",
        },
        {
          default: "0",
          id: "ae3b14ce1298cb2129",
          name: "Budget 4X4 Manual",
        },
        {
          default: "0",
          id: "e139504411fa9d47ae",
          name: "Comfort 4WD Manual",
        },
        {
          default: "0",
          id: "1ecabe2bb0c07a344c",
          name: "Comfort 4WD Automatic",
        },
        {
          default: "0",
          id: "235f1ad86f39252e6d",
          name: "Luxury 4WD Automatic",
        },
        {
          default: "0",
          id: "09a20302a9760e53a7",
          name: "4WD Van Manual",
        },
      ],
      calculatePricePerPerson: false,
      id: "76871",
      name: "Car",
      questions: [],
      required: true,
    },
    {
      answers: [
        {
          default: "1",
          id: "0f086bbf325508800b",
          name: "Skip the Blue Lagoon",
        },
        {
          default: "0",
          id: "0b44f43b6bcf3001f8",
          name: "Comfort Entrance",
        },
        {
          default: "0",
          id: "49b7bdb78cfb8a1007",
          name: "Premium Entrance",
        },
      ],
      calculatePricePerPerson: false,
      id: "76869",
      name: "Blue Lagoon (minimum age 2)",
      questions: [],
      required: true,
    },
    {
      answers: [],
      calculatePricePerPerson: true,
      id: "87314",
      name: "Extra luggage (per piece) on the south coast tour",
      questions: [],
      required: true,
    },
  ];
  test("should return correctly constructed vacation package options", () => {
    expect(constructGTIVpOptions(vpOptions)).toEqual(resultVpOptions);
  });
  test("should return correctly constructed vacation package options with answer", () => {
    expect(
      constructGTIVpOptions([
        ...vpOptions,
        {
          id: 87317,
          name: "Extra luggage (per piece) on the south coast tour",
          price: {
            value: 1150,
            currency: "ISK",
            discount: 0,
          },
          isRequired: true,
          perPerson: true,
          items: [],
          question: "Test answer",
        },
      ])
    ).toEqual([
      ...resultVpOptions,
      {
        answers: [],
        calculatePricePerPerson: true,
        id: "87317",
        name: "Extra luggage (per piece) on the south coast tour",
        questions: [
          {
            answers: [],
            externalId: null,
            id: 87317,
            name: "Test answer",
            question: "Test answer",
            required: false,
            selector: false,
          },
        ],
        required: true,
      },
    ]);
  });
  test("should return empty vp options", () => {
    expect(constructGTIVpOptions(undefined)).toEqual([]);
    expect(constructGTIVpOptions([])).toEqual([]);
  });
});

describe("constructExperience", () => {
  test('handles `answers: ""`', () => {
    const tourOption = {
      id: "124",
      name: "Car",
      answers: [],
      calculatePricePerPerson: true,
      questions: [],
      required: false,
    };

    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 100,
        options: [],
      },
    ];

    expect(constructExperience(tourOption, extras, [])).toEqual({
      id: "124",
      name: "Car",
      price: 100,
      discountValue: 0,
      calculatePricePerPerson: true,
      questions: [],
      answers: [],
      required: false,
      externalMaxLimit: undefined,
      hasExternalLimit: false,
    });
  });
  test("should return correctly constructed experience ", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        options: [],
        price: 150,
      },
      {
        id: "125",
        disabled: false,
        options: [],
        price: 100,
      },
    ];
    const tourOption: ExperiencesTypes.TourOption = {
      id: "124",
      name: "Car",
      answers: [],
      calculatePricePerPerson: false,
      questions: [],
      required: false,
    };

    const experience: ExperiencesTypes.Experience = {
      id: "124",
      name: "Car",
      answers: [],
      discountValue: 0,
      calculatePricePerPerson: false,
      questions: [],
      price: 150,
      required: false,
      externalMaxLimit: undefined,
      hasExternalLimit: false,
    };

    expect(constructExperience(tourOption, extras, [])).toEqual(experience);
  });

  describe("extra properties for Bokun tours setup", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [];

    const defaultNonRequiredTourOption: ExperiencesTypes.TourOption = {
      id: "124",
      name: "Car",
      answers: [],
      calculatePricePerPerson: false,
      externalLimitByPax: undefined,
      questions: [],
      required: false,
    };

    const defaultExperience: ExperiencesTypes.Experience = {
      id: "124",
      name: "Car",
      answers: [],
      discountValue: 0,
      calculatePricePerPerson: false,
      questions: [],
      price: 0,
      required: false,
      externalMaxLimit: undefined,
      hasExternalLimit: false,
    };

    test("sets hasExternalLimit when external limit by passengers is undefined", () => {
      const tourOption: ExperiencesTypes.TourOption = {
        ...defaultNonRequiredTourOption,
        externalLimitByPax: undefined,
      };

      expect(constructExperience(tourOption, extras, [])).toEqual({
        ...defaultExperience,
        hasExternalLimit: false,
      });
    });

    test("sets hasExternalLimit when external limit by passengers is false", () => {
      const tourOption: ExperiencesTypes.TourOption = {
        ...defaultNonRequiredTourOption,
        externalLimitByPax: false,
      };

      expect(constructExperience(tourOption, extras, [])).toEqual({
        ...defaultExperience,
        hasExternalLimit: true,
        externalMaxLimit: DEFAULT_EXTERNAL_LIMIT,
      });
    });

    test("sets hasExternalLimit when external limit by passengers is false and externalMaxLimit is available", () => {
      const tourOption: ExperiencesTypes.TourOption = {
        ...defaultNonRequiredTourOption,
        externalLimitByPax: false,
        externalMaxLimit: 10,
      };

      expect(constructExperience(tourOption, extras, [])).toEqual({
        ...defaultExperience,
        hasExternalLimit: true,
        externalMaxLimit: 10,
      });
    });

    test("sets hasExternalLimit and externalMaxLimit when external limit by passengers is true", () => {
      const tourOption: ExperiencesTypes.TourOption = {
        ...defaultNonRequiredTourOption,
        externalLimitByPax: true,
      };

      expect(constructExperience(tourOption, extras, [])).toEqual({
        ...defaultExperience,
        hasExternalLimit: true,
        externalMaxLimit: undefined,
      });
    });

    test("sets hasExternalLimit and ignores incoming externalMaxLimit when external limit by passengers is true", () => {
      const tourOption: ExperiencesTypes.TourOption = {
        ...defaultNonRequiredTourOption,
        externalLimitByPax: true,
        externalMaxLimit: 30,
      };

      expect(constructExperience(tourOption, extras, [])).toEqual({
        ...defaultExperience,
        hasExternalLimit: true,
        externalMaxLimit: undefined,
      });
    });
  });
});

describe("constructInitialSelectedExperiences", () => {
  const numberOfTravelers = {
    adults: 1,
    teenagers: 2,
    children: 3,
  };
  test('handles `answers: "[]"`', () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 123,
        options: [],
      },
    ];
    const tourOptions: ExperiencesTypes.TourOption[] = [
      {
        id: "124",
        name: "Car",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
    ];

    expect(constructInitialSelectedExperiences(tourOptions, extras, numberOfTravelers)).toEqual([
      {
        experienceId: "124",
        count: 0,
        price: 123,
        discountValue: 0,
        calculatePricePerPerson: true,
      },
    ]);
  });
  test('handles `answers: "[]"` with required tour option', () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 123,
        options: [],
      },
    ];
    const tourOptions: ExperiencesTypes.TourOption[] = [
      {
        id: "124",
        name: "Car",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: true,
      },
    ];

    expect(constructInitialSelectedExperiences(tourOptions, extras, numberOfTravelers)).toEqual([
      {
        experienceId: "124",
        count: 6,
        price: 123,
        discountValue: 0,
        calculatePricePerPerson: true,
      },
    ]);
  });
  test("should return correctly constructed initial selected experiences ", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 100,
        options: [
          {
            id: "1",
            prices: [{ price: 1337, disabled: false }],
            disabled: false,
            included: false,
          },
        ],
      },
      {
        id: "125",
        disabled: false,
        price: 100,
        options: [
          {
            id: "3",
            prices: [{ price: 150, disabled: false }],
            disabled: false,
            included: false,
          },
        ],
      },
    ];
    const tourOptions: ExperiencesTypes.TourOptions = [
      {
        id: "124",
        name: "Car",
        answers: [
          {
            id: "1",
            default: "1",
            name: "ble",
          },
          {
            id: "2",
            default: "0",
            name: "Ble",
          },
        ],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
      {
        id: "125",
        name: "Question",
        answers: [
          {
            id: "3",
            default: "1",
            name: "No",
          },
          {
            id: "4",
            default: "0",
            name: "Yes",
          },
        ],
        calculatePricePerPerson: false,
        questions: [],
        required: false,
      },
    ];
    const selectedExperiences: TourBookingWidgetTypes.SelectedExperiences = [
      {
        experienceId: "124",
        answerId: "1",
        prices: [1337],
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
        calculatePricePerPerson: true,
      },
      {
        experienceId: "125",
        answerId: "3",
        prices: [150],
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
        calculatePricePerPerson: false,
      },
    ];
    expect(constructInitialSelectedExperiences(tourOptions, extras, numberOfTravelers)).toEqual(
      selectedExperiences
    );
  });
});

describe("getExtraBasePrice", () => {
  const extras: TourBookingWidgetTypes.Extra[] = [
    {
      id: "125",
      disabled: false,
      price: 130,
      options: [],
    },
    {
      id: "126",
      disabled: false,
      price: 140,
      options: [],
    },
    {
      id: "128",
      disabled: false,
      price: 123,
      options: [],
    },
  ];
  test("should return the correct base price of the extra that has the id", () => {
    expect(getExtraBasePrice("126", extras)).toEqual(140);
  });
  test("should return 0 since there is no extra with this id", () => {
    expect(getExtraBasePrice("150", extras)).toEqual(0);
  });
});

describe("getItemExperiencePrice", () => {
  const extras: TourBookingWidgetTypes.Extra[] = [
    {
      id: "124",
      disabled: false,
      price: 123,
      options: [
        {
          id: "b53slgn4235",
          prices: [
            {
              price: 1337,
              disabled: false,
            },
          ],
          disabled: false,
          included: false,
        },
      ],
    },
    {
      id: "125",
      disabled: false,
      price: 130,
      options: [],
    },
    {
      id: "126",
      disabled: false,
      price: 140,
      options: [],
    },
    {
      id: "131",
      disabled: false,
      price: 150,
      options: [
        {
          id: "3475dfg04rgv",
          prices: [
            {
              price: 1127,
              disabled: false,
            },
          ],
          disabled: false,
          included: false,
        },
      ],
    },
  ];
  test("should [0] because there are no options for the extra with this id", () => {
    expect(
      getItemExperiencePrice(extras, {
        id: "126",
        selectedValue: "b53slgn4235",
        optionAnswers: [],
      })
    ).toEqual([0]);
  });
  test("should return [0] because there is no extra with this id", () => {
    expect(
      getItemExperiencePrice(extras, {
        id: "150",
        selectedValue: "b53slgn4235",
        optionAnswers: [],
      })
    ).toEqual([0]);
  });
  test("should return the correct price for the extra option with this selected value", () => {
    expect(
      getItemExperiencePrice(extras, {
        id: "131",
        selectedValue: "3475dfg04rgv",
        optionAnswers: [],
      })
    ).toEqual([1127]);
  });
  test("should return [0] because the extra has no option with the selected value ", () => {
    expect(
      getItemExperiencePrice(extras, {
        id: "131",
        selectedValue: "123fsedojgf",
        optionAnswers: [],
      })
    ).toEqual([0]);
  });
});

describe("getItemPricePerPerson", () => {
  const tourOptions: ExperiencesTypes.TourOptions = [
    {
      id: "124",
      name: "Car",
      answers: [
        {
          id: "1",
          default: "1",
          name: "ble",
        },
        {
          id: "2",
          default: "0",
          name: "Ble",
        },
      ],
      calculatePricePerPerson: true,
      questions: [],
      required: false,
    },
    {
      id: "125",
      name: "Meals",
      answers: [],
      calculatePricePerPerson: false,
      questions: [],
      required: false,
    },
    {
      id: "128",
      name: "",
      answers: [],
      calculatePricePerPerson: false,
      questions: [],
      required: false,
    },
  ];
  test("should return true because there is no tourOption with this id", () => {
    expect(getItemPricePerPerson(tourOptions, "126")).toEqual(true);
  });
  test("should return the correct calculatePricePerPerson value of the tourOption with this id", () => {
    expect(getItemPricePerPerson(tourOptions, "125")).toEqual(false);
  });
  test("should return the correct calculatePricePerPerson value of the tourOption with this id", () => {
    expect(getItemPricePerPerson(tourOptions, "124")).toEqual(true);
  });
});

describe("constructPrefilledSelectedExperiences", () => {
  const extras: TourBookingWidgetTypes.Extra[] = [
    {
      id: "124",
      disabled: false,
      price: 123,
      options: [
        {
          id: "b53slgn4235",
          prices: [
            {
              price: 1337,
              disabled: false,
            },
          ],
          disabled: false,
          included: false,
        },
      ],
    },
    {
      id: "125",
      disabled: false,
      price: 130,
      options: [],
    },
    {
      id: "126",
      disabled: false,
      price: 140,
      options: [],
    },
    {
      id: "128",
      disabled: false,
      price: 123,
      options: [],
    },
  ];
  const tourOptions: ExperiencesTypes.TourOptions = [
    {
      id: "124",
      name: "Car",
      answers: [
        {
          id: "1",
          default: "1",
          name: "ble",
        },
        {
          id: "2",
          default: "0",
          name: "Ble",
        },
      ],
      calculatePricePerPerson: true,
      questions: [],
      required: false,
    },
    {
      id: "125",
      name: "Meals",
      answers: [],
      calculatePricePerPerson: false,
      questions: [],
      required: false,
    },
    {
      id: "128",
      name: "",
      answers: [],
      calculatePricePerPerson: false,
      questions: [],
      required: false,
    },
  ];
  const editItemOptions = [
    {
      id: "124",
      selectedValue: "b53slgn4235",
      optionAnswers: [],
    },
    {
      id: "125",
      selectedValue: "2",
      optionAnswers: [],
    },
    {
      id: "126",
      selectedValue: "4",
      optionAnswers: [],
    },
    {
      id: "127",
      selectedValue: "3",
      optionAnswers: [],
    },
    {
      id: "128",
      selectedValue: "fkwarg9sgsd",
      optionAnswers: [],
    },
    {
      id: "129",
      selectedValue: "vwe5sdyrgfgj5",
      optionAnswers: [],
    },
  ];

  const editItem: TourBookingWidgetTypes.EditItem = {
    itemId: 17,
    productId: 235723,
    type: "",
    name: "",
    persons: 5,
    adults: 0,
    teenagers: 0,
    children: 0,
    date: new Date(),
    time: "",
    tourDetails: {
      pickupType: "",
      tourPickup: false,
      placeId: 0,
      placeName: "",
      options: editItemOptions,
    },
  };
  test("return selected experiences that were in the cart, this case is handling all cases", () => {
    expect(constructPrefilledSelectedExperiences(extras, tourOptions, editItem)).toEqual([
      {
        calculatePricePerPerson: true,
        experienceId: "124",
        answerId: "b53slgn4235",
        prices: [1337],
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
      },
      {
        experienceId: "125",
        count: 2,
        price: 130,
        discountValue: 0,
        calculatePricePerPerson: false,
      },
      {
        experienceId: "126",
        count: 4,
        price: 140,
        discountValue: 0,
        calculatePricePerPerson: true,
      },
      {
        experienceId: "127",
        count: 3,
        price: 0,
        discountValue: 0,
        calculatePricePerPerson: true,
      },
      {
        experienceId: "128",
        answerId: "fkwarg9sgsd",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
        calculatePricePerPerson: false,
      },
      {
        experienceId: "129",
        answerId: "vwe5sdyrgfgj5",
        prices: [0],
        vpPrice: {
          selectedOptionDiff: 0,

          discountValue: 0,
        },
        calculatePricePerPerson: true,
      },
    ]);
  });
});

describe("getExperienceItemOption", () => {
  const experienceId1 = "123";
  const experienceId2 = "125";
  const editItemOptions = [
    {
      id: "124",
      selectedValue: "b53slgn4235",
      optionAnswers: [],
    },
    {
      id: "125",
      selectedValue: "2",
      optionAnswers: [],
    },
    {
      id: "126",
      selectedValue: "4",
      optionAnswers: [],
    },
    {
      id: "127",
      selectedValue: "3",
      optionAnswers: [],
    },
    {
      id: "128",
      selectedValue: "fkwarg9sgsd",
      optionAnswers: [],
    },
    {
      id: "129",
      selectedValue: "vwe5sdyrgfgj5",
      optionAnswers: [],
    },
  ];

  const editItem: TourBookingWidgetTypes.EditItem = {
    itemId: 17,
    productId: 235723,
    type: "",
    name: "",
    persons: 0,
    adults: 0,
    teenagers: 0,
    children: 0,
    date: new Date(),
    time: "",
    tourDetails: {
      pickupType: "",
      tourPickup: false,
      placeId: 0,
      placeName: "",
      options: editItemOptions,
    },
  };
  test("should return undefined because there is no cartItemOptions with the experienceId", () => {
    expect(getExperienceItemOption(experienceId1, editItem)).toEqual(undefined);
  });
  test("should return the correct cartItemOption", () => {
    expect(getExperienceItemOption(experienceId2, editItem)).toEqual({
      id: "125",
      selectedValue: "2",
      optionAnswers: [],
    });
  });
});

describe("filterAnswerByOptions", () => {
  test("should return true if answer is in the options array and the option is not disabled", () => {
    const tourOptionAnswer: ExperiencesTypes.TourOptionAnswer = {
      id: "Id1",
      default: "1",
      name: "Yes",
    };
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "Id1",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id2",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id3",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    expect(filterAnswerByOptions(tourOptionAnswer, options)).toEqual(true);
  });
  test("should return false if answer is in the options array but the option is  disabled", () => {
    const tourOptionAnswer: ExperiencesTypes.TourOptionAnswer = {
      id: "Id1",
      default: "1",
      name: "Yes",
    };
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "Id1",
        prices: [{ price: 0, disabled: true }],
        disabled: true,
        included: false,
      },
      {
        id: "Id2",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id3",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    expect(filterAnswerByOptions(tourOptionAnswer, options)).toEqual(false);
  });
  test("should return false if answer is not in the options array", () => {
    const tourOptionAnswer: ExperiencesTypes.TourOptionAnswer = {
      id: "Id8",
      default: "1",
      name: "Yes",
    };
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "Id1",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id2",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id3",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    expect(filterAnswerByOptions(tourOptionAnswer, options)).toEqual(false);
  });
});

describe("filterDisabledTourOptionsFromExtras", () => {
  test('handles `answers: ""`', () => {
    const tourOptions = [
      {
        id: "124",
        name: "Car",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
    ];

    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 100,
        options: [],
      },
    ];

    expect(filterDisabledTourOptionsFromExtras(tourOptions, extras)).toEqual([
      {
        id: "124",
        name: "Car",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
    ]);
  });
  test("should filter out tour options and answers if corresponding extra and option is disabled", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: true,
        price: 100,
        options: [],
      },
      {
        id: "125",
        disabled: false,
        price: 100,
        options: [
          {
            id: "1",
            prices: [{ price: 150, disabled: true }],
            disabled: true,
            included: false,
          },
          {
            id: "2",
            prices: [{ price: 5000, disabled: false }],
            disabled: false,
            included: false,
          },
          {
            id: "3",
            prices: [{ price: 5000, disabled: true }],
            disabled: true,
            included: false,
          },
        ],
      },
    ];
    const tourOptions: ExperiencesTypes.TourOptions = [
      {
        id: "124",
        name: "Car",
        answers: [],
        calculatePricePerPerson: true,
        questions: [],
        required: false,
      },
      {
        id: "125",
        name: "Question",
        answers: [
          {
            id: "1",
            default: "1",
            name: "No",
          },
          {
            id: "2",
            default: "0",
            name: "Yes",
          },
          {
            id: "3",
            default: "0",
            name: "Yes",
          },
        ],
        calculatePricePerPerson: false,
        questions: [],
        required: false,
      },
    ];
    const filteredTourOptions: ExperiencesTypes.TourOptions = [
      {
        id: "125",
        name: "Question",
        answers: [
          {
            id: "2",
            default: "0",
            name: "Yes",
          },
        ],
        calculatePricePerPerson: false,
        questions: [],
        required: false,
      },
    ];

    expect(filterDisabledTourOptionsFromExtras(tourOptions, extras)).toEqual(filteredTourOptions);
  });
});

describe("getExtraByTourOptionId", () => {
  test("should return the correct extra", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 100,
        options: [],
      },
      {
        id: "125",
        disabled: false,
        price: 100,
        options: [],
      },
    ];

    expect(getExtraByTourOptionId(extras, extras[0].id)).toEqual(extras[0]);
  });
  test("should return the default extra if id does not match", () => {
    const extras: TourBookingWidgetTypes.Extra[] = [
      {
        id: "124",
        disabled: false,
        price: 100,
        options: [],
      },
      {
        id: "125",
        disabled: false,
        price: 100,
        options: [],
      },
    ];

    const defaultExtra: TourBookingWidgetTypes.Extra = {
      id: "0",
      disabled: true,
      price: 0,
      options: [],
    };

    expect(getExtraByTourOptionId(extras, "0")).toEqual(defaultExtra);
  });
});

describe("getOptionByAnswerId", () => {
  test("should return correct option", () => {
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "Id1",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id2",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id3",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    expect(getOptionByAnswerId(options, options[0].id)).toEqual(options[0]);
  });
  test("should return default option if id does not match", () => {
    const options: TourBookingWidgetTypes.Option[] = [
      {
        id: "Id1",
        prices: [{ price: 0, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id2",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: false,
      },
      {
        id: "Id3",
        prices: [{ price: 150, disabled: false }],
        disabled: false,
        included: true,
      },
    ];
    const defaultOption: TourBookingWidgetTypes.Option = {
      id: "",
      disabled: false,
      prices: [{ price: 0, disabled: false }],
      included: false,
    };
    expect(getOptionByAnswerId(options, "")).toEqual(defaultOption);
  });
});

describe("getOptionPrices", () => {
  const options: TourBookingWidgetTypes.Option[] = [
    {
      id: "Id1",
      prices: [{ price: 0, disabled: false }],
      disabled: false,
      included: false,
    },
    {
      id: "Id2",
      prices: [
        { price: 150, disabled: false },
        { price: 0, disabled: false },
        { price: 2500, disabled: false },
      ],
      disabled: false,
      included: false,
    },
    {
      id: "Id3",
      prices: [{ price: 0, disabled: false }],
      disabled: false,
      included: true,
    },
  ];
  const extras: TourBookingWidgetTypes.Extra[] = [
    {
      id: "124",
      disabled: false,
      options: [],
      price: 100,
    },
    {
      id: "125",
      disabled: false,
      options,
      price: 100,
    },
  ];
  test("should return array of prices", () => {
    expect(getOptionPrices(extras, "125", "Id2")).toEqual([150, 0, 2500]);
  });
  test("should return array of 0 if option doesn't match answer id", () => {
    expect(getOptionPrices(extras, "125", "Id4")).toEqual([0]);
  });
  test("should return array of 0 if option doesn't match experience id", () => {
    expect(getOptionPrices(extras, "123", "Id2")).toEqual([0]);
  });
});

describe("getGroupExperiencePrices", () => {
  const experiences: ExperiencesTypes.MultiSelectionExperience[] = [
    {
      id: "124",
      name: "Car",
      answers: [
        {
          id: "Id1",
          name: "Yes",
          prices: [0],
          vpPrice: {
            selectedOptionDiff: 0,
          },
          included: false,
          isDefault: false,
        },
        {
          id: "Id2",
          name: "No",
          prices: [150, 2500],
          vpPrice: {
            selectedOptionDiff: 0,
          },
          included: false,
          isDefault: false,
        },
      ],
      calculatePricePerPerson: false,
    },
  ];

  test("should return array prices", () => {
    expect(getGroupExperiencePrices(experiences, "124", "Id2")).toEqual([150, 2500]);
  });
  test("should return array of 0 if option doesn't match experience id", () => {
    expect(getGroupExperiencePrices(experiences, "127", "Id2")).toEqual([0]);
  });
  test("should return array of 0 if option doesn't match answer id", () => {
    expect(getGroupExperiencePrices(experiences, "124", "Id5")).toEqual([0]);
  });
});

describe("getExperiencePrice", () => {
  const prices = [150, 2500];
  test("should return first price in the array", () => {
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 1,
      teenagers: 0,
      children: 0,
    };
    expect(getExperiencePrice(prices, numberOfTravelers)).toEqual(150);
  });
  test("should return last price in the array", () => {
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 1,
      teenagers: 0,
      children: 1,
    };
    expect(getExperiencePrice(prices, numberOfTravelers)).toEqual(2500);
  });
  test("should return last price in the array when number of travelers is higher than number of prices", () => {
    const numberOfTravelers: SharedTypes.NumberOfTravelers = {
      adults: 1,
      teenagers: 1,
      children: 1,
    };
    expect(getExperiencePrice(prices, numberOfTravelers)).toEqual(2500);
  });
});

describe("sortExperiences", () => {
  const experiences: ExperiencesTypes.Experiences = [
    mockInformationExperience1,
    mockToggleExperience1,
    mockTravelerExperience1,
    mockMultiSelectionExperience2,
    mockMultiSelectionExperience1,
    mockTravelerExperienceWithQuestion1,
    mockTravelerExperienceWithQuestion2,
  ];
  test("should return 3 empty arrays", () => {
    expect(sortExperiences([])).toEqual([[], [], [], []]);
  });
  test("should return 3 array with correctly sorted experiences depending on their attributes", () => {
    expect(sortExperiences(experiences)).toEqual([
      [mockMultiSelectionExperience2, mockMultiSelectionExperience1],
      [
        mockTravelerExperience1,
        mockTravelerExperienceWithQuestion1,
        mockTravelerExperienceWithQuestion2,
      ],
      [mockToggleExperience1],
      [mockInformationExperience1],
    ]);
  });
});

describe("shouldShowExtrasHeader", () => {
  test("should return false because there are no experiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: false,
        containsTravelersExperience: false,
        containsToggleExperiences: false,
      })
    ).toEqual(false);
  });
  test("should return false because there are no multiSelectonExperiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: false,
        containsTravelersExperience: true,
        containsToggleExperiences: true,
      })
    ).toEqual(false);
  });
  test("should return false because there are no travelers- or toggleExperiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: true,
        containsTravelersExperience: false,
        containsToggleExperiences: false,
      })
    ).toEqual(false);
  });
  test("should return true because there are both multi- and travelerExperiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: true,
        containsTravelersExperience: true,
        containsToggleExperiences: false,
      })
    ).toEqual(true);
  });
  test("should return true because there are both multi- and toggleExperiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: true,
        containsTravelersExperience: true,
        containsToggleExperiences: true,
      })
    ).toEqual(true);
  });
  test("should return true because there are all types of experiences", () => {
    expect(
      shouldShowExtrasHeader({
        containsMultiSelectionExperience: true,
        containsTravelersExperience: true,
        containsToggleExperiences: true,
      })
    ).toEqual(true);
  });
});

describe("getExperienceType", () => {
  test("should return the correct experiment type", () => {
    expect(getExperienceType(mockTravelerExperienceWithQuestion1)).toEqual(
      ExperienceType.Travelers
    );
    expect(getExperienceType(mockInformationExperience1)).toEqual(ExperienceType.Information);
    expect(getExperienceType(mockMultiSelectionExperience2)).toEqual(ExperienceType.Dropdown);
    expect(getExperienceType(mockToggleExperience1)).toEqual(ExperienceType.Toggle);
  });
});

describe("getDefaultAnswer", () => {
  const question1: ExperiencesTypes.TourOptionQuestion = {
    answers: [],
    externalId: 456,
    id: 1,
    question: "Are you a test?",
    required: false,
    selector: false,
  };
  const question2: ExperiencesTypes.TourOptionQuestion = {
    answers: [],
    externalId: 999,
    id: 1,
    question: "Are you another test?",
    required: false,
    selector: false,
  };
  const question3: ExperiencesTypes.TourOptionQuestion = {
    answers: [{ value: "Default answer", label: "Default answer" }],
    externalId: 999,
    id: 1,
    question: "Another one?",
    required: false,
    selector: false,
  };
  const editItemOptions = [
    {
      id: "124",
      selectedValue: "b53slgn4235",
      optionAnswers: [],
    },
    {
      id: "123",
      selectedValue: "2",
      optionAnswers: [
        {
          answers: [
            { answer: "Yes, I am a test", externalId: "456" },
            { answer: "Me 2!", externalId: "789" },
          ],
        },
      ],
    },
    {
      id: "126",
      selectedValue: "4",
      optionAnswers: [
        {
          answers: [{ answer: "I am a horse", externalId: "999" }],
        },
      ],
    },
    {
      id: "127",
      selectedValue: "3",
      optionAnswers: [],
    },
    {
      id: "128",
      selectedValue: "fkwarg9sgsd",
      optionAnswers: [],
    },
    {
      id: "129",
      selectedValue: "vwe5sdyrgfgj5",
      optionAnswers: [],
    },
  ];
  const editItem: TourBookingWidgetTypes.EditItem = {
    itemId: 17,
    productId: 235723,
    type: "",
    name: "",
    persons: 5,
    adults: 0,
    teenagers: 0,
    children: 0,
    date: new Date(),
    time: "",
    tourDetails: {
      pickupType: "",
      tourPickup: false,
      placeId: 0,
      placeName: "",
      options: editItemOptions,
    },
  };
  test("Should return an empty string since experience is not found", () => {
    expect(getDefaultAnswer(question1, 0, "rugl", false, editItem)).toEqual("");
  });
  test("Should return an empty string since the question for that experience is not found", () => {
    expect(getDefaultAnswer(question2, 0, "123", false, editItem)).toEqual("");
  });
  test("Should return the first answer for the option despite the ids not matching", () => {
    expect(getDefaultAnswer(question2, 0, "126", false, editItem)).toEqual("I am a horse");
  });
  test("Should return the first answer when the answer has not been set", () => {
    expect(getDefaultAnswer(question3, 0, "", false, editItem)).toEqual("Default answer");
  });
  test("Should return the correct answer for the given question", () => {
    expect(getDefaultAnswer(question1, 0, "123", false, editItem)).toEqual("Yes, I am a test");
  });
  test("Should return the default answer when the optionAnswers is empty", () => {
    expect(getDefaultAnswer(question3, 0, "127", false, editItem)).toEqual("Default answer");
  });
});

describe("isSelectedAnswerIncluded", () => {
  const experienceAnswers: ExperiencesTypes.ExperienceAnswers = [
    {
      id: "Id1",
      name: "Yes",
      prices: [0],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      included: false,
      isDefault: false,
    },
    {
      id: "Id2",
      name: "No",
      prices: [150],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      included: false,
      isDefault: false,
    },
    {
      id: "Id3",
      name: "No",
      prices: [0],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      included: true,
      isDefault: true,
    },
  ];
  test("should be true if the selected experience is included", () => {
    expect(isSelectedAnswerIncluded(experienceAnswers, "Id3")).toEqual({
      isIncluded: true,
      isDefault: true,
    });
  });
  test("should be galse if the selected experience is not included", () => {
    expect(isSelectedAnswerIncluded(experienceAnswers, "Id1")).toEqual({
      isIncluded: false,
      isDefault: false,
    });
  });
  test("should be false if the selected experience is not found in the array", () => {
    expect(isSelectedAnswerIncluded(experienceAnswers, "Id4")).toEqual({
      isIncluded: false,
      isDefault: false,
    });
  });
});

describe("getFallbackAnswer", () => {
  const possibleAnswers1 = [
    {
      label: "rugl",
      value: "rugl",
    },
  ];

  const possibleAnswers2 = [
    {
      label: "rugl",
      value: "rugl",
    },
    {
      label: "rugl2",
      value: "rugl2",
    },
  ];
  test("Should return empty string since value is not optional", () => {
    expect(getNonOptionalFallbackAnswer(possibleAnswers1, false)).toEqual("");
  });
  test("Should return empty string since possible answers are empty ", () => {
    expect(getNonOptionalFallbackAnswer([], true)).toEqual("");
  });
  test("Should return the first possible answer", () => {
    expect(getNonOptionalFallbackAnswer(possibleAnswers2, true)).toEqual("rugl");
  });
});

const fakeTranslate = (value: string) => value;

describe("getExperiencePriceInformation", () => {
  describe("should return correctly constructed price information for tour", () => {
    test("included option", () => {
      expect(
        getExperiencePriceInformation({
          prices: [0],
          vpSelectedOptionDiff: 0,
          isLivePricing: false,
          isIncluded: true,
          numberOfTravelers: {
            adults: 1,
            teenagers: 0,
            children: 0,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("Included");
    });
    test("option with price", () => {
      expect(
        getExperiencePriceInformation({
          prices: [100, 200, 300],
          vpSelectedOptionDiff: 0,
          isLivePricing: false,
          isIncluded: false,
          numberOfTravelers: {
            adults: 1,
            teenagers: 0,
            children: 0,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("+100 USD");
      expect(
        getExperiencePriceInformation({
          prices: [100, 111, 222],
          vpSelectedOptionDiff: 0,
          isLivePricing: false,
          isIncluded: false,
          numberOfTravelers: {
            adults: 1,
            teenagers: 1,
            children: 1,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("+222 USD");
    });
  });
  describe("should return correctly constructed price information for vacation package", () => {
    test("isIncluded option", () => {
      expect(
        getExperiencePriceInformation({
          prices: [0],
          vpSelectedOptionDiff: 0,
          isLivePricing: true,
          isIncluded: true,
          numberOfTravelers: {
            adults: 1,
            teenagers: 0,
            children: 0,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("Included");
    });
    test("option with price", () => {
      expect(
        getExperiencePriceInformation({
          prices: [100],
          vpSelectedOptionDiff: 100,
          isLivePricing: true,
          isIncluded: false,
          numberOfTravelers: {
            adults: 1,
            teenagers: 0,
            children: 0,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("+100 USD");
      expect(
        getExperiencePriceInformation({
          prices: [100],
          vpSelectedOptionDiff: -200,
          isLivePricing: true,
          isIncluded: false,
          numberOfTravelers: {
            adults: 1,
            teenagers: 1,
            children: 1,
          },
          currency: SupportedCurrencies.UNITED_STATES_DOLLAR,
          convertCurrency: value => value,
          tFunction: fakeTranslate as TFunction,
        })
      ).toEqual("-200 USD");
    });
  });
});

describe("preSelectedTravelExperienceValue", () => {
  const possibleAnswers1 = {
    answerId: "12345-2",
    calculatePricePerPerson: true,
    experienceId: "12345",
    prices: [0],
  };
  const possibleAnswers2 = {
    answerId: "12345",
    calculatePricePerPerson: true,
    experienceId: "12345",
    prices: [0],
  };
  const possibleAnswers3 = {
    answerId: "12345-",
    calculatePricePerPerson: true,
    experienceId: "12345",
    prices: [0],
  };
  const possibleAnswers4 = {
    answerId: "12345",
    calculatePricePerPerson: true,
    experienceId: "12345-",
    prices: [0],
  };
  const possibleAnswers5 = {
    answerId: "1345-2",
    calculatePricePerPerson: true,
    experienceId: "12345",
    prices: [0],
  };
  test("Should return the number that are appended after the - in answerId ", () => {
    expect(preSelectedTravelExperienceValue(possibleAnswers1)).toEqual(2);
  });
  test("Should return the number that are appended after the - in answerId, if no number is there return 0", () => {
    expect(preSelectedTravelExperienceValue(possibleAnswers2)).toEqual(0);
  });
  test("Should return the number that are appended after the - in answerId, if no number is there return 0", () => {
    expect(preSelectedTravelExperienceValue(possibleAnswers3)).toEqual(0);
  });
  test("Should return the number that are appended after the - in answerId, if no number is there return 0", () => {
    expect(preSelectedTravelExperienceValue(possibleAnswers4)).toEqual(0);
  });
  test("Should return 0 if the answerId does no include the experienceId", () => {
    expect(preSelectedTravelExperienceValue(possibleAnswers5)).toEqual(0);
  });
});

describe("checkIsSelectedNonDefaultExperience", () => {
  const selectedExperiences = [
    {
      experienceId: "76996",
      answerId: "85242c7d2513259de6",
      prices: [7863],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: false,
    },
    {
      experienceId: "78096",
      answerId: "4e430af08ec8b775a4",
      prices: [4999.130434782609],
      vpPrice: {
        selectedOptionDiff: 0,
      },
      calculatePricePerPerson: false,
    },
    {
      experienceId: "87411",
      count: 0,
      price: 12375,
      calculatePricePerPerson: false,
    },
  ];

  test("should return false if only default experiences are selected", () => {
    expect(
      checkIsSelectedNonDefaultExperience({
        selectedExperiences,
        multiSelectionExperiences: mockMultiSelectionExperiences,
      })
    ).toBeFalsy();
  });
  test("should return true if non-default experience are selected", () => {
    expect(
      checkIsSelectedNonDefaultExperience({
        selectedExperiences: [
          selectedExperiences[0],
          {
            experienceId: "78096",
            answerId: "1ae8a25d8081723bcd",
            prices: [12345],
            vpPrice: {
              selectedOptionDiff: 0,
            },
            calculatePricePerPerson: false,
          },
        ],
        multiSelectionExperiences: mockMultiSelectionExperiences,
      })
    ).toBeTruthy();
  });
});
