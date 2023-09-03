import {
  getSelectedExtra,
  constructInitialSelectedExtras,
  getSelectedCheckboxInsuranceValue,
  constructInitialSelectedInsurances,
  getOptionType,
  OptionTypes,
  sortOptions,
  getSelectedExtraValue,
  constructOption,
  constructOptions,
  getSelectedExtraQuestionAnswers,
  getSelectedExtrasWithEmptyAnswers,
} from "../optionsUtils";

const fakeTranslate = (value: string) => value;

const selectedExtras: CarBookingWidgetTypes.SelectedExtra[] = [
  {
    id: "1",
    count: 0,
    questionAnswers: [],
  },
  {
    id: "2",
    count: 0,
    questionAnswers: [],
  },
  {
    id: "3",
    count: 0,
    questionAnswers: [],
  },
];

const includedOption = {
  id: "1",
  name: "option",
  price: 0,
  included: true,
  multiple: false,
  code: "1",
  max: 1,
  pricePerDay: false,
  description: "",
  payOnLocation: false,
  questions: [],
};

const checkboxOption = {
  id: "3",
  name: "option",
  price: 0,
  included: false,
  multiple: false,
  code: "3",
  max: 1,
  pricePerDay: false,
  description: "",
  payOnLocation: false,
  questions: [],
};

const multipleOption = {
  id: "2",
  name: "option",
  price: 0,
  included: false,
  multiple: true,
  code: "2",
  max: 0,
  pricePerDay: false,
  description: "",
  payOnLocation: false,
  questions: [],
};

describe("getSelectedExtra", () => {
  test("should find extra in array", () => {
    expect(getSelectedExtra(selectedExtras, "1")).toEqual({
      id: "1",
      count: 0,
      questionAnswers: [],
    });
  });
  test("should return undefined when extra doesn't exist", () => {
    expect(getSelectedExtra(selectedExtras, "0")).toEqual(undefined);
  });
});

describe("getSelectedExtraValue", () => {
  const selectedExtrasMultiple: CarBookingWidgetTypes.SelectedExtra[] = [
    {
      id: "1",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "2",
      count: 2,
      questionAnswers: [],
    },
  ];
  test("should return extra value", () => {
    expect(getSelectedExtraValue(selectedExtrasMultiple, "1")).toEqual(0);
  });
  test("should return extra value", () => {
    expect(getSelectedExtraValue(selectedExtrasMultiple, "2")).toEqual(2);
  });
  test("should return extra value", () => {
    expect(getSelectedExtraValue(selectedExtrasMultiple, "0")).toEqual(0);
  });
});

describe("getSelectedExtraQuestionAnswers", () => {
  const selectedExtrasMultiple: CarBookingWidgetTypes.SelectedExtra[] = [
    {
      id: "1",
      count: 0,
      questionAnswers: [],
    },
    {
      id: "2",
      count: 2,
      questionAnswers: [
        {
          key: "driver_age",
          answer: "45",
          identifier: "1",
        },
        {
          key: "first_name",
          answer: "Anna",
          identifier: "1",
        },
        {
          key: "last_name",
          answer: "Jónsdóttir",
          identifier: "1",
        },
      ],
    },
  ];
  test("should return empty array because extra has no questions", () => {
    expect(getSelectedExtraQuestionAnswers(selectedExtrasMultiple, "1")).toEqual([]);
  });
  test("should return extra questionAnswers", () => {
    expect(getSelectedExtraQuestionAnswers(selectedExtrasMultiple, "2")).toEqual([
      {
        key: "driver_age",
        answer: "45",
        identifier: "1",
      },
      {
        key: "first_name",
        answer: "Anna",
        identifier: "1",
      },
      {
        key: "last_name",
        answer: "Jónsdóttir",
        identifier: "1",
      },
    ]);
  });
  test("should return empty array because there are no extras", () => {
    expect(getSelectedExtraQuestionAnswers([], "0")).toEqual([]);
  });
});

describe("constructInitialSelectedExtras", () => {
  const extras: OptionsTypes.Option[] = [
    {
      id: "1",
      name: "mock extra 1",
      price: 0,
      included: false,
      multiple: false,
      code: "t1",
      max: 1,
      pricePerDay: false,
      description: "",
      payOnLocation: false,
      questions: [],
    },
    {
      id: "2",
      name: "mock extra 2",
      price: 0,
      included: false,
      multiple: false,
      code: "t2",
      max: 0,
      pricePerDay: false,
      description: "",
      payOnLocation: false,
      questions: [],
    },
    {
      id: "3",
      name: "mock extra 3",
      price: 0,
      included: false,
      multiple: true,
      code: "t3",
      max: 2,
      pricePerDay: true,
      description: "",
      payOnLocation: false,
      questions: [],
    },
  ];
  test("should construct selected extras", () => {
    expect(constructInitialSelectedExtras(extras)).toEqual(selectedExtras);
  });
});

describe("constructInitialSelectedExtras", () => {
  const selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[] = [
    {
      id: "1",
      selected: false,
      code: "t1",
    },
    {
      id: "2",
      selected: true,
      code: "t2",
    },
  ];
  test("should find insurance and return false", () => {
    expect(getSelectedCheckboxInsuranceValue(selectedInsurances, "1")).toEqual(false);
  });
  test("should find insurance and return true", () => {
    expect(getSelectedCheckboxInsuranceValue(selectedInsurances, "2")).toEqual(true);
  });
  test("should return false when insurance doesn't exist", () => {
    expect(getSelectedCheckboxInsuranceValue(selectedInsurances, "0")).toEqual(false);
  });
});

describe("constructInitialSelectedInsurances", () => {
  const insurances: OptionsTypes.Option[] = [
    {
      id: "1",
      name: "mock insurance 1",
      price: 0,
      included: false,
      multiple: false,
      code: "t1",
      max: 1,
      pricePerDay: false,
      description: "",
      payOnLocation: false,
      questions: [],
    },
    {
      id: "2",
      name: "mock insurance 2",
      price: 0,
      included: false,
      multiple: false,
      code: "t2",
      max: 1,
      pricePerDay: false,
      description: "",
      payOnLocation: false,
      questions: [],
    },
    {
      id: "3",
      name: "mock insurance 3",
      price: 0,
      included: false,
      multiple: false,
      code: "t3",
      max: 1,
      pricePerDay: true,
      description: "",
      payOnLocation: false,
      questions: [],
    },
  ];

  const selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[] = [
    {
      id: "1",
      selected: false,
      code: "t1",
    },
    {
      id: "2",
      selected: false,
      code: "t2",
    },
    {
      id: "3",
      selected: false,
      code: "t3",
    },
  ];
  test("should construct selected insurance", () => {
    expect(constructInitialSelectedInsurances(insurances)).toEqual(selectedInsurances);
  });
});

describe("getOptionType", () => {
  test("should get included option type", () => {
    expect(getOptionType(includedOption)).toEqual(OptionTypes.Included);
  });
  test("should return multiple option type", () => {
    expect(getOptionType(checkboxOption)).toEqual(OptionTypes.Checkbox);
  });
  test("should return multiple option type", () => {
    expect(getOptionType(multipleOption)).toEqual(OptionTypes.Multiple);
  });
});

describe("sortOptions", () => {
  test("should return included option, and empty multiple and checkbox arrays", () => {
    expect(sortOptions([includedOption])).toEqual([[includedOption], [], []]);
  });
  test("should return included and checkbox, and empty multiple arrays", () => {
    expect(sortOptions([includedOption, checkboxOption])).toEqual([
      [includedOption],
      [checkboxOption],
      [],
    ]);
  });
  test("should return included, checkbox, and multiple arrays", () => {
    expect(sortOptions([includedOption, checkboxOption, multipleOption])).toEqual([
      [includedOption],
      [checkboxOption],
      [multipleOption],
    ]);
  });
});

describe("constructExtra", () => {
  test("should return correctly constructed extra", () => {
    const queryExtra = {
      id: "366",
      type: "INSURANCE" as CarTypes.QueryExtraType,
      name: "Super collision damage waiver",
      description:
        "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
      required: false,
      quantity: 0,
      amount: 150,
      code: "SCW",
      payableNow: true,
      periodType: "PER_DAY" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
    };
    const extra = {
      id: "366",
      name: "Super collision damage waiver",
      included: false,
      multiple: true,
      price: 150,
      code: "SCW",
      pricePerDay: true,
      max: 0,
      payOnLocation: false,
      description:
        "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
      questions: [],
    };
    expect(constructOption(queryExtra, fakeTranslate as TFunction, false)).toEqual(extra);
  });
  test("should return correctly constructed extra", () => {
    const queryExtra = {
      id: "366",
      type: "EXTRA" as CarTypes.QueryExtraType,
      name: "Super collision damage waiver",
      description:
        "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
      required: true,
      quantity: 1,
      amount: 0,
      code: "SCW",
      payableNow: true,
      periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
      translationKeys: {
        keys: [],
      },
    };
    const extra = {
      id: "366",
      name: "Super collision damage waiver",
      included: true,
      multiple: false,
      price: 0,
      code: "SCW",
      pricePerDay: false,
      max: 1,
      payOnLocation: false,
      description:
        "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
      questions: [],
    };
    expect(constructOption(queryExtra, fakeTranslate as TFunction, false)).toEqual(extra);
  });
});

describe("constructOptions", () => {
  test("should return correctly constructed extras", () => {
    const queryExtras = [
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
        payableNow: true,
        periodType: "PER_DAY" as CarTypes.QueryExtraPeriodType,
        translationKeys: {
          keys: [],
        },
      },
      {
        id: "366",
        type: "EXTRA" as CarTypes.QueryExtraType,
        name: "Super collision damage waiver",
        description:
          "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
        required: true,
        quantity: 1,
        amount: 0,
        code: "SCW",
        payableNow: true,
        periodType: "PER_RENTAL" as CarTypes.QueryExtraPeriodType,
        translationKeys: {
          keys: [],
        },
      },
    ];
    const queryIncluded = [
      {
        includedId: "ABC",
        type: "INSURANCE" as CarTypes.QueryExtraType,
        name: "Any insurances",
        description: "Insure everything!",
        code: "ABC",
        coverageAmount: 0,
        coverageCurrency: "ISK",
        translationKeys: {
          keys: [],
        },
      },
      {
        includedId: "3",
        type: "EXTRA" as CarTypes.QueryExtraType,
        name: "GPS",
        description: "Never get lost",
        code: "",
        coverageAmount: 0,
        coverageCurrency: "ISK",
        translationKeys: {
          keys: [],
        },
      },
      {
        includedId: "2",
        type: "EXTRA" as CarTypes.QueryExtraType,
        name: "Extra driver",
        description: "Take a nap while the extra driver drives",
        code: "",
        coverageAmount: 0,
        coverageCurrency: "ISK",
        translationKeys: {
          keys: [],
        },
      },
    ];
    const extras = {
      insurances: [
        {
          id: "ABC",
          name: "Any insurances",
          description: "Insure everything!",
          code: "ABC",
          included: true,
          max: 1,
          multiple: false,
          price: 0,
          pricePerDay: true,
          payOnLocation: false,
          questions: [],
        },
        {
          id: "366",
          name: "Super collision damage waiver",
          included: false,
          multiple: true,
          price: 150,
          code: "SCW",
          pricePerDay: true,
          max: 0,
          payOnLocation: false,
          description:
            "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
          questions: [],
        },
      ],
      extras: [
        {
          id: "3",
          name: "GPS",
          description: "Never get lost",
          code: "",
          included: true,
          max: 1,
          multiple: false,
          price: 0,
          pricePerDay: true,
          payOnLocation: false,
          questions: [],
        },
        {
          id: "2",
          name: "Extra driver",
          description: "Take a nap while the extra driver drives",
          code: "",
          included: true,
          max: 1,
          multiple: false,
          price: 0,
          pricePerDay: true,
          payOnLocation: false,
          questions: [],
        },
        {
          id: "366",
          name: "Super collision damage waiver",
          included: true,
          multiple: false,
          price: 0,
          code: "SCW",
          pricePerDay: false,
          max: 1,
          payOnLocation: false,
          description:
            "Lowers the excess/self risk of the standard collision damages waiver (CDW) from ISK600,000 down to ISK150,000.",
          questions: [],
        },
      ],
    };
    expect(constructOptions(queryExtras, queryIncluded, fakeTranslate as TFunction, false)).toEqual(
      extras
    );
  });
});

describe("getSelectedExtrasWithEmptyAnswers", () => {
  const mockSelectedExtrasWithAnswers = [
    ...selectedExtras,
    {
      id: "1",
      count: 1,
      questionAnswers: [
        {
          key: "extra_222_firstname",
          answer: "Person",
          identifier: "1",
        },
        {
          key: "extra_222_lastname",
          answer: "McPersonface",
          identifier: "1",
        },
        {
          key: "extra_222_age",
          answer: "45",
          identifier: "1",
        },
      ],
    },
  ];

  const mockExtraWithoutTextAnswers = {
    id: "1",
    count: 1,
    questionAnswers: [
      {
        key: "extra_222_firstname",
        answer: "",
        identifier: "1",
      },
      {
        key: "extra_222_lastname",
        answer: "",
        identifier: "1",
      },
      {
        key: "extra_222_age",
        answer: "45",
        identifier: "1",
      },
    ],
  };

  const mockExtraWithPartialTextAnswers = {
    id: "1",
    count: 1,
    questionAnswers: [
      {
        key: "extra_123",
        answer: "This is an extra",
        identifier: "1",
      },
      {
        key: "extra_345",
        answer: "",
        identifier: "1",
      },
    ],
  };

  const mockSelectedExtrasWithoutAllAnswers = [...selectedExtras, mockExtraWithoutTextAnswers];

  const mockSelectedExtrasWithPartialAnswers = [
    ...selectedExtras,
    mockExtraWithPartialTextAnswers,
    mockExtraWithoutTextAnswers,
  ];

  test("should return an empty array when all selectedExtras with questions have an answer", () => {
    expect(getSelectedExtrasWithEmptyAnswers(mockSelectedExtrasWithAnswers)).toEqual([]);
  });

  test("should return all occurrences of selectedExtras with all text questions without answers", () => {
    expect(getSelectedExtrasWithEmptyAnswers(mockSelectedExtrasWithoutAllAnswers)).toEqual([
      mockExtraWithoutTextAnswers,
    ]);
  });

  test("should return all occurrences of selectedExtras with partially answered questions", () => {
    expect(getSelectedExtrasWithEmptyAnswers(mockSelectedExtrasWithPartialAnswers)).toEqual([
      mockExtraWithPartialTextAnswers,
      mockExtraWithoutTextAnswers,
    ]);
  });
});
