export const mockMultiSelectionExperience1 = {
  id: "124",
  name: "Car",
  answers: [
    {
      id: "Id1",
      name: "Fiat Panda",
      prices: [0],
      included: false,
      isDefault: false,
      vpPrice: {
        selectedOptionDiff: 0,
      },
    },
    {
      id: "Id2",
      name: "Toyota Yaris",
      prices: [150, 2500],
      included: false,
      isDefault: false,
      vpPrice: {
        selectedOptionDiff: 0,
      },
    },
  ],
  calculatePricePerPerson: true,
};

export const mockMultiSelectionExperience2: ExperiencesTypes.Experience = {
  id: "125",
  name: "Hotels",
  answers: [
    {
      id: "Id1",
      name: "Hotel Aurora",
      prices: [0],
      included: false,
      isDefault: false,
      vpPrice: {
        selectedOptionDiff: 0,
      },
    },
    {
      id: "Id2",
      name: "Hotel Eik",
      prices: [150, 2500],
      included: false,
      isDefault: false,
      vpPrice: {
        selectedOptionDiff: 0,
      },
    },
  ],
  calculatePricePerPerson: false,
};

export const mockTravelerExperience1 = {
  id: "126",
  name: "Add dinners",
  calculatePricePerPerson: true,
  price: 1000,
  hasExternalLimit: false,
  questions: [
    {
      selector: true,
      required: true,
      id: 83285,
      externalId: 1337,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
    {
      selector: true,
      required: true,
      id: 83285,
      externalId: 1337,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
  ],
  required: false,
};

export const mockTravelerExperience2 = {
  id: "126",
  name: "Add dinners",
  calculatePricePerPerson: true,
  price: 1000,
  questions: [],
  required: true,
  hasExternalLimit: true,
};

export const mockTravelerExperience3 = {
  id: "126",
  name: "Cabin bag ?",
  answers: "[]",
  required: true,
  price: 0,
  hasExternalLimit: true,
  questions: [
    {
      id: 126,
      question: "cabin bag weight",
      answers: [],
      selector: false,
      required: true,
      externalId: null,
    },
  ],
  calculatePricePerPerson: true,
};

export const mockToggleExperience1 = {
  ...mockTravelerExperience1,
  calculatePricePerPerson: false,
};

export const mockTravelerExperienceWithQuestion1 = {
  ...mockTravelerExperience1,
  questions: [
    {
      selector: true,
      required: true,
      id: 83285,
      externalId: 1337,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
  ],
};

export const mockToggleExperienceWithPricePerPerson = {
  ...mockTravelerExperienceWithQuestion1,
  calculatePricePerPerson: true,
};

export const mockToggleExperienceWithoutPricePerPerson = {
  ...mockTravelerExperienceWithQuestion1,
  calculatePricePerPerson: false,
};

export const mockTravelerExperienceWithQuestion2 = {
  ...mockTravelerExperience1,
  questions: [
    {
      selector: true,
      required: true,
      id: 83285,
      externalId: 1337,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
    {
      selector: true,
      required: true,
      id: 83286,
      externalId: 1337,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
  ],
};

export const mockInformationExperience1 = {
  ...mockTravelerExperience1,
  price: 0,
  questions: [
    {
      selector: true,
      required: true,
      id: 83285,
      externalId: 1,
      question: "Size in EU",
      answers: [
        {
          label: "43",
          value: "43",
        },
        {
          label: "44",
          value: "44",
        },
      ],
    },
    {
      selector: true,
      required: true,
      id: 83286,
      externalId: 2,
      question: "Riding style",
      answers: [],
    },
  ],
};

export const mockSelectedExperience1: TourBookingWidgetTypes.SelectedGroupExperience = {
  experienceId: "124",
  answerId: "Id1",
  prices: [1337],
  vpPrice: {
    selectedOptionDiff: 100,
  },
  calculatePricePerPerson: true,
};

export const mockSelectedExperience2: TourBookingWidgetTypes.SelectedTravelerExperience = {
  experienceId: "124",
  count: 6,
  price: 1337,
  calculatePricePerPerson: true,
};

export const mockMultiSelectionExperiences: ExperiencesTypes.MultiSelectionExperience[] = [
  {
    id: "76996",
    name: "Accommodation in Reykjavik",
    calculatePricePerPerson: false,
    answers: [
      {
        id: "85242c7d2513259de6",
        name: "Super Budget (bunk beds, shared bath)",
        prices: [7863],
        vpPrice: {
          selectedOptionDiff: 7863,
        },
        included: true,
        isDefault: true,
      },
      {
        id: "c5fbf3fd0c59846ae8",
        name: "Budget (private room, shared bath)",
        prices: [26750],
        vpPrice: {
          selectedOptionDiff: 26750,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "43daf34466fd3f6687",
        name: "Comfort (private room, private bath)",
        prices: [33000],
        vpPrice: {
          selectedOptionDiff: 33000,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "2940d6db08a5df1f39",
        name: "Quality (handpicked hotels)",
        prices: [61875],
        vpPrice: {
          selectedOptionDiff: 61875,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
  {
    id: "78096",
    name: "Blue Lagoon",
    calculatePricePerPerson: false,
    answers: [
      {
        id: "4e430af08ec8b775a4",
        name: "Skip the Blue Lagoon",
        prices: [4999.130434782609],
        vpPrice: {
          selectedOptionDiff: 4999.130434782609,
        },
        included: false,
        isDefault: true,
      },
      {
        id: "1ae8a25d8081723bcd",
        name: "Comfort Entrance + Transfer",
        prices: [22146.272727272728],
        vpPrice: {
          selectedOptionDiff: 22146.272727272728,
        },
        included: false,
        isDefault: false,
      },
      {
        id: "621d417a85fc7ca512",
        name: "Premium Entrance + Transfer",
        prices: [25555.545454545456],
        vpPrice: {
          selectedOptionDiff: 25555.545454545456,
        },
        included: false,
        isDefault: false,
      },
    ],
  },
];
