import { FlightExtraIconType } from "../../FlightSearchPage/types/flightEnums";

import { NO_CHECKED_BAGGAGE_ID } from "./flightUtils";

import { SupportedCurrencies } from "types/enums";

export const mockQueryBaggage = [
  {
    id: "HandBag-0",
    price: 0,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "personal_item",
        count: 1,
        restrictions: {
          weight: 10,
          height: 25,
          width: 20,
          length: 40,
        },
      },
    ],
  },
  {
    id: "HandBag-1",
    price: 0,
    passengerGroups: ["infant"],
    bags: [
      {
        category: "personal_item",
        count: 1,
        restrictions: {
          weight: 5,
          height: 30,
          width: 20,
          length: 40,
        },
      },
    ],
  },
  {
    id: "HoldBag-0",
    price: 124.24,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "hold_bag",
        count: 1,
        restrictions: {
          weight: 15,
          height: 90,
          width: 66,
          length: 119,
        },
      },
    ],
  },
  {
    id: "HoldBag-1",
    price: 248.49,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "hold_bag",
        count: 2,
        restrictions: {
          weight: 15,
          height: 90,
          width: 66,
          length: 119,
        },
      },
    ],
  },
];

export const mockQueryBaggage2 = [
  {
    id: "HandBag-0",
    price: 0,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "personal_item",
        count: 1,
        restrictions: {
          weight: 10,
          height: 25,
          width: 20,
          length: 40,
        },
      },
    ],
  },
  {
    id: "HoldBag-0",
    price: 0,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "hold_bag",
        count: 1,
        restrictions: {
          weight: 15,
          height: 90,
          width: 66,
          length: 119,
        },
      },
    ],
  },
  {
    id: "HoldBag-1",
    price: 248.49,
    passengerGroups: ["adult", "child"],
    bags: [
      {
        category: "hold_bag",
        count: 2,
        restrictions: {
          weight: 15,
          height: 90,
          width: 66,
          length: 119,
        },
      },
    ],
  },
];

export const mockAdultBaggage = {
  handBags: [
    {
      id: "HandBag-0",
      isIncluded: true,
      isSelected: true,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 0,
      bagCombination: [
        {
          title: "Personal item",
          category: "personal_item",
          count: 1,
          highlights: [
            {
              iconId: "personal_item" as FlightExtraIconType,
              title: "40 × 20 × 25 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "10 kg",
            },
          ],
        },
      ],
    },
  ],
  holdBags: [
    {
      id: NO_CHECKED_BAGGAGE_ID,
      isIncluded: true,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      isSelected: true,
      price: 0,
      bagCombination: [
        {
          title: "No checked baggage",
          category: "hold_bag",
          count: 0,
          highlights: [],
        },
      ],
    },
    {
      id: "HoldBag-0",
      isIncluded: false,
      isSelected: false,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 124.24,
      bagCombination: [
        {
          category: "hold_bag",
          count: 1,
          title: "Checked bag",
          highlights: [
            {
              iconId: "hold_bag" as FlightExtraIconType,
              title: "119 × 66 × 90 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "15 kg",
            },
          ],
        },
      ],
    },
    {
      id: "HoldBag-1",
      isIncluded: false,
      isSelected: false,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 248.49,
      bagCombination: [
        {
          title: "{count}x Checked bag",
          category: "hold_bag",
          count: 2,
          highlights: [
            {
              iconId: "hold_bag" as FlightExtraIconType,
              title: "119 × 66 × 90 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "15 kg",
            },
          ],
        },
      ],
    },
  ],
};

export const mockChildBaggage = {
  handBags: [
    {
      id: "HandBag-0",
      isIncluded: true,
      isSelected: true,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 0,
      bagCombination: [
        {
          title: "Personal item",
          category: "personal_item",
          count: 1,
          highlights: [
            {
              iconId: "personal_item" as FlightExtraIconType,
              title: "40 × 20 × 25 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "10 kg",
            },
          ],
        },
      ],
    },
  ],
  holdBags: [
    {
      id: NO_CHECKED_BAGGAGE_ID,
      isIncluded: true,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      isSelected: true,
      price: 0,
      bagCombination: [
        {
          title: "No checked baggage",
          category: "hold_bag",
          count: 0,
          highlights: [],
        },
      ],
    },
    {
      id: "HoldBag-0",
      isIncluded: false,
      isSelected: false,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 124.24,
      bagCombination: [
        {
          title: "Checked bag",
          category: "hold_bag",
          count: 1,
          highlights: [
            {
              iconId: "hold_bag" as FlightExtraIconType,
              title: "119 × 66 × 90 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "15 kg",
            },
          ],
        },
      ],
    },
    {
      id: "HoldBag-1",
      isIncluded: false,
      isSelected: false,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 248.49,
      bagCombination: [
        {
          title: "{count}x Checked bag",
          category: "hold_bag",
          count: 2,
          highlights: [
            {
              iconId: "hold_bag" as FlightExtraIconType,
              title: "119 × 66 × 90 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "15 kg",
            },
          ],
        },
      ],
    },
  ],
};

export const mockInfantBaggage = {
  handBags: [
    {
      id: "HandBag-1",
      isIncluded: true,
      isSelected: true,
      inputType: "radio" as FlightTypes.FlightExtraInputType,
      price: 0,
      bagCombination: [
        {
          title: "Personal item",
          category: "personal_item",
          count: 1,
          highlights: [
            {
              iconId: "personal_item" as FlightExtraIconType,
              title: "40 × 20 × 30 cm",
            },
            {
              iconId: FlightExtraIconType.BAG_WEIGHT,
              title: "5 kg",
            },
          ],
        },
      ],
    },
  ],
  holdBags: [],
};

export const mockPassenger1 = {
  id: 1,
  name: "Hekla",
  surname: "Amundadottir",
  nationality: "IS",
  gender: "Female" as FlightTypes.GenderType,
  birthday: {
    day: "1",
    month: "1",
    year: "1995",
  },
  passportno: "A1029374",
  passportExpiration: {
    day: "",
    month: "",
    year: "",
  },
  noPassportExpiration: true,
  category: "adult" as FlightTypes.PassengerCategory,
  bags: mockAdultBaggage,
};

export const mockPassenger2 = {
  id: 2,
  name: "Anna",
  surname: "Jonsdottir",
  nationality: "IS",
  gender: "Female" as FlightTypes.GenderType,
  birthday: {
    day: "12",
    month: "2",
    year: "1994",
  },
  passportno: "A36SGJ2352345",
  passportExpiration: {
    day: "1",
    month: "3",
    year: "2024",
  },
  noPassportExpiration: false,
  category: "adult" as FlightTypes.PassengerCategory,
  bags: {
    handBags: [
      {
        id: "HandBag-0",
        isIncluded: true,
        isSelected: true,
        inputType: "radio" as FlightTypes.FlightExtraInputType,
        price: 0,
        bagCombination: [
          {
            title: "Personal item",
            category: "personal_item",
            count: 1,
            highlights: [
              {
                iconId: "personal_item" as FlightExtraIconType,
                title: "40 × 20 × 25 cm",
              },
              {
                iconId: FlightExtraIconType.BAG_WEIGHT,
                title: "10 kg",
              },
            ],
          },
        ],
      },
    ],
    holdBags: [
      {
        id: "HoldBag-0",
        isIncluded: false,
        isSelected: true,
        inputType: "radio" as FlightTypes.FlightExtraInputType,
        price: 124.24,
        bagCombination: [
          {
            title: "Checked bag",
            category: "hold_bag",
            count: 1,
            highlights: [
              {
                iconId: "hold_bag" as FlightExtraIconType,
                title: "119 × 66 × 90 cm",
              },
              {
                iconId: FlightExtraIconType.BAG_WEIGHT,
                title: "15 kg",
              },
            ],
          },
        ],
      },
    ],
  },
};

export const mockPassengerWithoutContactDetails: FlightTypes.PassengerDetails[] = [
  {
    id: 1,
    category: "adult",
    name: "",
    surname: "",
    birthday: {},
    passportno: "",
    passportExpiration: {},
    noPassportExpiration: false,
    bags: {
      handBags: [],
      holdBags: [],
    },
  },
  {
    id: 2,
    category: "adult",
    name: "",
    surname: "",
    birthday: {},
    passportno: "",
    passportExpiration: {},
    noPassportExpiration: false,
    bags: {
      handBags: [
        {
          id: "HandBag-0",
          isIncluded: true,
          inputType: "radio",
          isSelected: false,
          price: 0,
          bagCombination: [
            {
              title: "Personal item",
              count: 1,
              category: "personal_item",
              highlights: [
                {
                  iconId: "personal_item",
                  title: "40 × 20 × 30 cm",
                },
                {
                  iconId: "weight",
                  title: "10 kg",
                },
              ],
            },
          ],
        },
        {
          id: "HandBag-1",
          isIncluded: false,
          inputType: "radio",
          isSelected: true,
          price: 46.35,
          priorityAirlines: ["Wizz Air UK"],
          bagCombination: [
            {
              title: "Cabin bag",
              count: 1,
              category: "cabin_bag",
              highlights: [
                {
                  iconId: "cabin_bag",
                  title: "45 × 20 × 36 cm",
                },
                {
                  iconId: "weight",
                  title: "10 kg",
                },
              ],
            },
          ],
        },
      ],
      holdBags: [
        {
          id: NO_CHECKED_BAGGAGE_ID,
          isIncluded: true,
          inputType: "radio",
          isSelected: true,
          price: 0,
          bagCombination: [
            {
              title: "No checked baggage",
              category: "hold_bag",
              count: 0,
              highlights: [],
            },
          ],
        },
        {
          id: "HoldBag-0",
          isIncluded: false,
          inputType: "radio",
          isSelected: false,
          price: 65.31,
          bagCombination: [
            {
              title: "Checked bag",
              count: 1,
              category: "hold_bag",
              highlights: [
                {
                  iconId: "hold_bag",
                  title: "135 × 50 × 90 cm",
                },
                {
                  iconId: "weight",
                  title: "15 kg",
                },
              ],
            },
          ],
        },
        {
          id: "HoldBag-1",
          isIncluded: false,
          inputType: "radio",
          isSelected: false,
          price: 133.87,
          bagCombination: [
            {
              title: "2x Checked bag",
              count: 2,
              category: "hold_bag",
              highlights: [
                {
                  iconId: "hold_bag",
                  title: "135 × 50 × 90 cm",
                },
                {
                  iconId: "weight",
                  title: "15 kg",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

export const mockFlightCartInputWithoutContactDetails: FlightTypes.MutationAddFlightToCartInput = {
  adults: 2,
  bookingToken: "bookingToken",
  children: 0,
  infants: 0,
  isHold: false,
  numberOfBags: 0,
  numberOfPassengers: 2,
  currency: SupportedCurrencies.EURO,
  passengers: [
    {
      baggage: [],
      category: "adult",
      expiration: null,
      name: "",
      passportNumber: null,
      surname: "",
      title: "ms",
    },
    {
      baggage: ["HandBag-1"],
      category: "adult",
      expiration: null,
      name: "",
      passportNumber: null,
      surname: "",
      title: "ms",
    },
  ],
};

export const mockFlightCartInput: FlightTypes.MutationAddFlightToCartInput = {
  adults: 1,
  bookingToken: "bookingToken",
  children: 1,
  infants: 0,
  isHold: false,
  numberOfBags: 0,
  numberOfPassengers: 2,
  currency: SupportedCurrencies.EURO,
  passengers: [
    {
      baggage: ["HandBag-0"],
      birthday: "1995-01-01",
      category: "adult",
      expiration: null,
      name: "Hekla",
      nationality: "IS",
      passportNumber: null,
      surname: "Amundadottir",
      title: "ms",
    },
    {
      baggage: ["HandBag-0"],
      birthday: "1995-01-01",
      category: "child",
      expiration: null,
      name: "Hekla",
      nationality: "IS",
      passportNumber: null,
      surname: "Amundadottir",
      title: "ms",
    },
  ],
};

export const mockContactDetails = {
  phoneNumber: "+3541234567",
  contactEmail: "test@test.is",
};
