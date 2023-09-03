export const livePricingOptionsDataset: Record<
  "default" | "cached",
  Record<"accommodation" | "blueLagoon" | "horseRidingTour", TourBookingWidgetTypes.QueryVpOptions>
> = {
  cached: {
    accommodation: {
      id: 76996,
      name: "Accommodation in Reykjavik",
      price: undefined,
      isRequired: true,
      perPerson: false,
      items: [
        {
          id: "85242c7d2513259de6",
          name: "Super Budget (bunk beds, shared bath)",
          isDefault: true,
          isIncluded: true,
          price: undefined,
        },
        {
          id: "c5fbf3fd0c59846ae8",
          name: "Budget (private room, shared bath)",
          isDefault: false,
          isIncluded: false,
          price: undefined,
        },
        {
          id: "43daf34466fd3f6687",
          name: "Comfort (private room, private bath)",
          isDefault: false,
          isIncluded: false,
          price: undefined,
        },
      ],
    },
    blueLagoon: {
      id: 78096,
      name: "Blue Lagoon",
      price: undefined,
      isRequired: true,
      perPerson: false,
      items: [
        {
          id: "4e430af08ec8b775a4",
          name: "Skip the Blue Lagoon",
          isDefault: true,
          isIncluded: false,
          price: undefined,
        },
        {
          id: "1ae8a25d8081723bcd",
          name: "Comfort Entrance + Transfer",
          isDefault: false,
          isIncluded: false,
          price: undefined,
        },
        {
          id: "621d417a85fc7ca512",
          name: "Premium Entrance + Transfer",
          isDefault: false,
          isIncluded: false,
          price: undefined,
        },
      ],
    },
    horseRidingTour: {
      id: 87411,
      name: "Horse riding tour",
      price: undefined,
      isRequired: false,
      perPerson: false,
      items: [],
    },
  },
  default: {
    accommodation: {
      id: 76996,
      name: "Accommodation in Reykjavik",
      price: {
        value: 7863,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: false,
      items: [
        {
          id: "85242c7d2513259de6",
          name: "Super Budget (bunk beds, shared bath)",
          isDefault: true,
          isIncluded: true,
          price: {
            value: 7863,
            currency: "ISK",
            discount: 0,
          },
        },
      ],
    },
    blueLagoon: {
      id: 78096,
      name: "Blue Lagoon",
      price: {
        value: 4999.130434782609,
        currency: "ISK",
        discount: 0,
      },
      isRequired: true,
      perPerson: false,
      items: [
        {
          id: "4e430af08ec8b775a4",
          name: "Skip the Blue Lagoon",
          isDefault: true,
          isIncluded: false,
          price: {
            value: 4999.130434782609,
            currency: "ISK",
            discount: 0,
          },
        },
      ],
    },
    horseRidingTour: {
      id: 87411,
      name: "Horse riding tour",
      price: {
        value: 0,
        currency: "ISK",
        discount: 0,
      },
      isRequired: false,
      perPerson: false,
      items: [],
    },
  },
};

export const mockLivePricingCachedData = {
  monolithVacationPackage: {
    uuid: "mockUuid",
    id: 1694,
    price: {
      value: 415160.3260869565,
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
    },
    options: [
      livePricingOptionsDataset.cached.accommodation,
      livePricingOptionsDataset.cached.blueLagoon,
      livePricingOptionsDataset.cached.horseRidingTour,
    ],
    error: null,
  },
};
export const mockLivePriceDefaultOptionsData = {
  monolithVacationPackage: {
    uuid: "1e0382e2-b18f-40de-93e1-8b9ee316db59",
    id: 1694,
    price: {
      value: 347760.2608695652,
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
    },
    options: [
      livePricingOptionsDataset.default.accommodation,
      livePricingOptionsDataset.default.blueLagoon,
      livePricingOptionsDataset.default.horseRidingTour,
    ],
    error: null,
  },
};
export const mockLivePriceNonDefaultOptionsData = {
  monolithVacationPackage: {
    uuid: "b5c076b4-3c13-4c03-9cd2-0aae61e162bf",
    id: 1694,
    price: {
      value: 0,
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
    },
    options: [
      {
        id: 76996,
        name: "Accommodation in Reykjavik",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "c5fbf3fd0c59846ae8",
            name: "Budget (private room, shared bath)",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 24936.3,
              currency: "ISK",
              discount: 0,
            },
          },
          {
            id: "43daf34466fd3f6687",
            name: "Comfort (private room, private bath)",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 30125,
              currency: "ISK",
              discount: 0,
            },
          },
        ],
      },
      {
        id: 78096,
        name: "Blue Lagoon",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
        },
        isRequired: true,
        perPerson: false,

        items: [
          {
            id: "1ae8a25d8081723bcd",
            name: "Comfort Entrance + Transfer",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 22146.272727272728,
              currency: "ISK",
              discount: 0,
            },
          },
          {
            id: "621d417a85fc7ca512",
            name: "Premium Entrance + Transfer",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 25555.545454545456,
              currency: "ISK",
              discount: 0,
            },
          },
        ],
      },
    ],
    error: null,
  },
};

export const mockLivePriceDefaultOptionsData1 = {
  monolithVacationPackage: {
    uuid: "9d4f0c26-aaba-4b1b-aab2-cbb87293c346",
    id: 1997,
    price: {
      value: 291691.2608695652,
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
    },
    options: [
      {
        id: 77315,
        name: "Accommodation in Reykjavík",
        price: {
          value: 11794,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "bbf3252b2d01538d61",
            name: "Super Budget (bunk beds, shared bath)",
            isDefault: true,
            isIncluded: true,
            price: {
              value: 11794,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
        ],
      },
      {
        id: 78095,
        name: "Blue Lagoon",
        price: {
          value: 4999.130434782609,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "bb16f370de2563c936",
            name: "Skip the Blue Lagoon",
            isDefault: true,
            isIncluded: false,
            price: {
              value: 4999.130434782609,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
        ],
      },
      {
        id: 87417,
        name: "Horse riding tour",
        price: {
          value: 12375,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 87418,
        name: "Katla ice cave tour",
        price: {
          value: 23000,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 87419,
        name: "Jokulsarlon boat tour",
        price: {
          value: 7375,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 87420,
        name: "Vök bath by the lake",
        price: {
          value: 6875,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 87421,
        name: "Hiking boots rental on the circle tour",
        price: {
          value: 3750,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 87422,
        name: "Luggage storage on the circle tour",
        price: {
          value: 1250,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: false,
        perPerson: true,
        items: [],
      },
      {
        id: 83375,
        name: "Activity on day 8",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "a2c6ff9304e4a6a560",
            name: "Free Day in Reykjavik",
            isDefault: true,
            isIncluded: false,
            price: {
              value: 0,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
        ],
      },
    ],
    error: null,
  },
};

export const mockLivePriceMergedLivePriceData = {
  monolithVacationPackage: {
    error: null,
    id: 1997,
    options: [
      {
        id: 77315,
        isRequired: true,
        items: [
          {
            id: "bbf3252b2d01538d61",
            isDefault: true,
            isIncluded: true,
            name: "Super Budget (bunk beds, shared bath)",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 11794,
            },
          },
          {
            id: "9c5f16b271a4684a8a",
            isDefault: false,
            isIncluded: false,
            name: "Budget (private room, shared bath)",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 36750,
            },
          },
          {
            id: "976b1b5e9aca04fdb1",
            isDefault: false,
            isIncluded: false,
            name: "Comfort (private room, private bath)",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 43125,
            },
          },
          {
            id: "1c57919962d8c3b902",
            isDefault: false,
            isIncluded: false,
            name: "Quality (handpicked hotels)",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 66750,
            },
          },
        ],
        name: "Accommodation in Reykjavík",
        perPerson: false,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 11794,
        },
      },
      {
        id: 78095,
        isRequired: true,
        items: [
          {
            id: "bb16f370de2563c936",
            isDefault: true,
            isIncluded: false,
            name: "Skip the Blue Lagoon",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 4999.130434782609,
            },
          },
          {
            id: "439167c17730605e51",
            isDefault: false,
            isIncluded: false,
            name: "Comfort entrance + return transfer",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 22146.272727272728,
            },
          },
          {
            id: "7c70692ea33baaadae",
            isDefault: false,
            isIncluded: false,
            name: "Premium entrance + return transfer",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 25555.545454545456,
            },
          },
        ],
        name: "Blue Lagoon",
        perPerson: false,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 4999.130434782609,
        },
      },
      {
        id: 87417,
        isRequired: false,
        items: [],
        name: "Horse riding tour",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 12375,
        },
      },
      {
        id: 87418,
        isRequired: false,
        items: [],
        name: "Katla ice cave tour",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 23000,
        },
      },
      {
        id: 87419,
        isRequired: false,
        items: [],
        name: "Jokulsarlon boat tour",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 7375,
        },
      },
      {
        id: 87420,
        isRequired: false,
        items: [],
        name: "Vök bath by the lake",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 6875,
        },
      },
      {
        id: 87421,
        isRequired: false,
        items: [],
        name: "Hiking boots rental on the circle tour",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 3750,
        },
      },
      {
        id: 87422,
        isRequired: false,
        items: [],
        name: "Luggage storage on the circle tour",
        perPerson: true,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 1250,
        },
      },
      {
        id: 83375,
        isRequired: true,
        items: [
          {
            id: "a2c6ff9304e4a6a560",
            isDefault: true,
            isIncluded: false,
            name: "Free Day in Reykjavik",
            price: {
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
              value: 0,
            },
          },
        ],
        name: "Activity on day 8",
        perPerson: false,
        price: {
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
          value: 0,
        },
      },
    ],
    price: {
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
      value: 291691.2608695652,
    },
    uuid: "423df89f-87c4-45d4-9385-f649643e0864",
  },
};

export const mockLivePriceNonDefaultOptionsData1 = {
  monolithVacationPackage: {
    uuid: "423df89f-87c4-45d4-9385-f649643e0864",
    id: 1997,
    price: {
      value: 0,
      currency: "ISK",
      discount: 0,
      discountPercentage: 0,
    },
    options: [
      {
        id: 77315,
        name: "Accommodation in Reykjavík",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "9c5f16b271a4684a8a",
            name: "Budget (private room, shared bath)",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 36750,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
          {
            id: "976b1b5e9aca04fdb1",
            name: "Comfort (private room, private bath)",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 43125,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
          {
            id: "1c57919962d8c3b902",
            name: "Quality (handpicked hotels)",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 66750,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
        ],
      },
      {
        id: 78095,
        name: "Blue Lagoon",
        price: {
          value: 0,
          currency: "ISK",
          discount: 0,
          discountPercentage: 0,
        },
        isRequired: true,
        perPerson: false,
        items: [
          {
            id: "439167c17730605e51",
            name: "Comfort entrance + return transfer",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 22146.272727272728,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
          {
            id: "7c70692ea33baaadae",
            name: "Premium entrance + return transfer",
            isDefault: false,
            isIncluded: false,
            price: {
              value: 25555.545454545456,
              currency: "ISK",
              discount: 0,
              discountPercentage: 0,
            },
          },
        ],
      },
    ],
    error: null,
  },
};

export const mockSelectedExperiencesWithDiscount = [
  {
    experienceId: "82712",
    answerId: "0cd07ca8f78fdd604a",
    prices: [24282],
    vpPrice: {
      selectedOptionDiff: 0,
      discountValue: 1349,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "82713",
    answerId: "72e9148aa375adc551",
    prices: [27900],
    vpPrice: {
      selectedOptionDiff: 0,
      discountValue: 0,
    },
    calculatePricePerPerson: false,
  },
  {
    experienceId: "82714",
    answerId: "328eb08f33a59c9639",
    prices: [28903.011001843883],
    vpPrice: {
      selectedOptionDiff: 0,
      discountValue: 0,
    },
    calculatePricePerPerson: false,
  },
];
export const mockExtrasWithDiscount = [
  {
    id: "82712",
    disabled: false,
    price: 26980,
    options: [
      {
        id: "7254e723a3f994d2a2",
        disabled: false,
        included: false,
        prices: [
          {
            price: 24282,
            disabled: false,
            discountValue: 2698,
          },
        ],
      },
      {
        id: "0cd07ca8f78fdd604a",
        disabled: false,
        included: false,
        prices: [
          {
            price: 24282,
            disabled: false,
            discountValue: 2698,
          },
        ],
      },
    ],
  },
  {
    id: "82713",
    disabled: false,
    price: 31000,
    options: [
      {
        id: "72e9148aa375adc551",
        disabled: false,
        included: false,
        prices: [
          {
            price: 27900,
            disabled: false,
            discountValue: 3100,
          },
        ],
      },
      {
        id: "63591d7b5ce998a808",
        disabled: false,
        included: false,
        prices: [
          {
            price: 27900,
            disabled: false,
            discountValue: 3100,
          },
        ],
      },
    ],
  },
  {
    id: "82714",
    disabled: false,
    price: 32114.456668715426,
    options: [
      {
        id: "328eb08f33a59c9639",
        disabled: false,
        included: false,
        prices: [
          {
            price: 28903.011001843883,
            disabled: false,
            discountValue: 3211.445666871543,
          },
        ],
      },
      {
        id: "e793e3833bf62edf73",
        disabled: false,
        included: false,
        prices: [
          {
            price: 28903.011001843883,
            disabled: false,
            discountValue: 3211.445666871543,
          },
        ],
      },
    ],
  },
];
export const mockExperiencesWithDiscount = [
  [
    {
      id: "82712",
      name: "Solheimajokull timing",
      price: 26980,
      questions: [],
      calculatePricePerPerson: false,
      required: true,
      answers: [
        {
          id: "7254e723a3f994d2a2",
          name: "Morning departure",
          prices: [24282],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 2698,
          },
          included: false,
          isDefault: true,
        },
        {
          id: "0cd07ca8f78fdd604a",
          name: "Afternoon departure",
          prices: [24282],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 2698,
          },
          included: false,
          isDefault: false,
        },
      ],
    },
    {
      id: "82713",
      name: "Skaftafell timing",
      price: 31000,
      questions: [],
      calculatePricePerPerson: false,
      required: true,
      answers: [
        {
          id: "72e9148aa375adc551",
          name: "Morning departure",
          prices: [27900],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 3100,
          },
          included: false,
          isDefault: true,
        },
        {
          id: "63591d7b5ce998a808",
          name: "Afternoon departure",
          prices: [27900],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 3100,
          },
          included: false,
          isDefault: false,
        },
      ],
    },
    {
      id: "82714",
      name: "Ice cave timing",
      price: 32114.456668715426,
      questions: [],
      calculatePricePerPerson: false,
      required: true,
      answers: [
        {
          id: "328eb08f33a59c9639",
          name: "Morning departure",
          prices: [28903.011001843883],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 3211.445666871543,
          },
          included: false,
          isDefault: true,
        },
        {
          id: "e793e3833bf62edf73",
          name: "Afternoon departure",
          prices: [28903.011001843883],
          vpPrice: {
            selectedOptionDiff: 0,
            discountValue: 3211.445666871543,
          },
          included: false,
          isDefault: false,
        },
      ],
    },
  ],
  [],
  [],
  [],
];
