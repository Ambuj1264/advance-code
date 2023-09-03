export const mockItemDetailsOption1 = {
  id: "123",
  selectedValue: "3",
  optionAnswers: [],
};

export const mockItemDetailsOptionWithAnswers1: TourBookingWidgetTypes.EditItemDetailsOption = {
  id: "126",
  selectedValue: "3",
  optionAnswers: [
    {
      answers: [
        {
          externalId: "1337",
          answer: "44",
        },
      ],
    },
    {
      answers: [
        {
          externalId: "1337",
          answer: "43",
        },
      ],
    },
    {
      answers: [
        {
          externalId: "1337",
          answer: "43",
        },
      ],
    },
  ],
};

export const mockCartItem1: TourBookingWidgetTypes.EditItem = {
  itemId: 1,
  productId: 1,
  type: "tour",
  name: "Aurora",
  persons: 3,
  adults: 3,
  teenagers: 0,
  children: 0,
  date: new Date(),
  time: "21:30",
  tourDetails: {
    pickupType: "",
    tourPickup: false,
    placeId: 0,
    placeName: "",
    options: [mockItemDetailsOptionWithAnswers1],
  },
};
