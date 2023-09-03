import { ITINERARY_MAP_ITEM_TYPE } from "../types/postBookingEnums";
import { PostBookingTypes } from "../types/postBookingTypes";

import {
  constructItineraryNavigationData,
  constructItineraryMapPointsData,
  normalizedCardsData,
  splitForToggle,
  filterReservations,
} from "./postBookingUtils";

const requiredButNotUsedMapPointProps = {
  id: 0,
  title: "not important",
  reviewTotalCount: 0,
  reviewTotalScore: 0,
  isGoogleReview: false,
};

const firstItineraryMapDay: PostBookingTypes.ItineraryMapEntry = {
  date: "2020-04-25",
  dayNumber: 1,
  items: [
    {
      type: ITINERARY_MAP_ITEM_TYPE.ATTRACTION,
      latitude: 10,
      longitude: 20,
      orm_name: "attraction for day 1",
      ...requiredButNotUsedMapPointProps,
    },
  ],
};

const secondItineraryMapDay: PostBookingTypes.ItineraryMapEntry = {
  date: "2020-04-26",
  dayNumber: 2,
  items: [
    {
      type: ITINERARY_MAP_ITEM_TYPE.ATTRACTION,
      latitude: 10,
      longitude: 20,
      orm_name: "attraction for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.CAR,
      latitude: 10,
      longitude: 20,
      orm_name: "car for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.DAY_TOUR,
      latitude: 10,
      longitude: 20,
      orm_name: "day tour for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.DESTINATION,
      latitude: 10,
      longitude: 20,
      orm_name: "destination for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.HOTEL,
      latitude: 10,
      longitude: 20,
      orm_name: "hotel for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.PACKAGE_TOUR,
      latitude: 10,
      longitude: 20,
      orm_name: "package for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.SELF_DRIVE_TOUR,
      latitude: 10,
      longitude: 20,
      orm_name: "drive for day 2",
      ...requiredButNotUsedMapPointProps,
    },
    {
      type: ITINERARY_MAP_ITEM_TYPE.TOUR,
      latitude: 10,
      longitude: 20,
      orm_name: "tour for day 2",
      ...requiredButNotUsedMapPointProps,
    },
  ],
};

const itineraryMapResponseMock = {
  itineraryMap: [firstItineraryMapDay, secondItineraryMapDay],
};

describe("constructItineraryNavigationData", () => {
  it("returns navigation days when data is available", () => {
    expect(
      constructItineraryNavigationData({
        itinerary: {
          days: [
            {
              date: "2020-04-25T00:00:00.000Z",
              dayNumber: 1,
              segments: [],
            },
            {
              date: "2020-04-26T00:00:00.000Z",
              dayNumber: 2,
              segments: [],
            },
          ],
        },
      } as PostBookingTypes.QueryItinerary)
    ).toEqual([
      {
        dateWithoutTimezone: new Date("2020-04-25T00:00:00.000Z"),
        dayNumber: 1,
      },
      {
        dateWithoutTimezone: new Date("2020-04-26T00:00:00.000Z"),
        dayNumber: 2,
      },
    ]);
  });

  it("returns nothing when data is not available", () => {
    expect(constructItineraryNavigationData()).toBeUndefined();
  });
});

describe("constructItineraryMapPointsData", () => {
  it("returns map days for the first day of vacation by default with properly mapped points type", () => {
    expect(constructItineraryMapPointsData(itineraryMapResponseMock, undefined, 10)).toEqual([
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "attraction for day 1",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "attraction",
        context: {
          bookingId: 10,
        },
      },
    ]);
  });

  it("returns map days for the given day of vacation with properly mapped points type", () => {
    expect(constructItineraryMapPointsData(itineraryMapResponseMock, 2, 1)).toEqual([
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "attraction for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "attraction",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "car for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "attraction",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "day tour for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "dayTour",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "destination for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "destination",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "hotel for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "hotel",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "package for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "packageTour",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "drive for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "selfDriveTour",
        context: {
          bookingId: 1,
        },
      },
      {
        id: 0,
        isGoogleReview: false,
        latitude: 10,
        longitude: 20,
        orm_name: "tour for day 2",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "not important",
        type: "tour",
        context: {
          bookingId: 1,
        },
      },
    ]);
  });

  it("returns empty arrayif there is no data for the day", () => {
    expect(constructItineraryMapPointsData(itineraryMapResponseMock, 1000)).toEqual([]);
  });

  it("returns empty arrayif there is no data", () => {
    expect(constructItineraryMapPointsData()).toEqual([]);
  });
});

describe("filterReservations", () => {
  const standaloneReservationCards: PostBookingTypes.ItineraryCard[] = [
    // @ts-ignore
    { bookingId: 777, name: "standalone reservation 777" },
    // @ts-ignore
    { bookingId: 666, name: "standalone reservation 666" },
  ];

  const vpReservatoinForTripId777: PostBookingTypes.QueryUserReservationsVacationPackage = {
    // @ts-ignore
    card: { bookingId: 777, name: "vp reservation 777" },
    reservationCards: [
      // @ts-ignore
      {
        bookingId: 1,
        name: "flight reservatoin",
      },
      // @ts-ignore
      {
        bookingId: 2,
        name: "stay reservatoin",
      },
    ],
  };

  const vpReservatoinForTripId666: PostBookingTypes.QueryUserReservationsVacationPackage = {
    // @ts-ignore
    card: { bookingId: 666, name: "vp reservation 666" },
    reservationCards: [
      // @ts-ignore
      {
        bookingId: 1,
        name: "flight reservatoin",
      },
      // @ts-ignore
      {
        bookingId: 2,
        name: "stay reservatoin",
      },
    ],
  };

  const data: PostBookingTypes.QueryUserReservations = {
    userReservations: {
      reservationCards: standaloneReservationCards,
      vacationPackages: [vpReservatoinForTripId666, vpReservatoinForTripId777],
    },
  };

  describe("when vacation package tiprId is passed", () => {
    it("keeps only vacation package reservations for given tripId", () => {
      expect(filterReservations(data, vpReservatoinForTripId666.card?.bookingId)).toEqual({
        userReservations: {
          reservationCards: [],
          vacationPackages: [vpReservatoinForTripId666],
        },
      });
    });

    it("returns empty array for trips if given tripId is not found", () => {
      expect(filterReservations(data, 9832798237423)).toEqual({
        userReservations: {
          reservationCards: [],
          vacationPackages: [],
        },
      });
    });
  });
  it("returns same data if no tripId is passed", () => {
    expect(filterReservations(data)).toEqual(data);
  });

  it("returns nothing array if nothing passed", () => {
    expect(filterReservations()).toBeUndefined();
  });
});

describe("normalizedCardsData", () => {
  it("constructs normalized reservations structure from VP cards and standalone reservations", () => {
    // ts-ignore is put to ignore some required fields for readability
    const dataStructure: PostBookingTypes.QueryUserReservations = {
      userReservations: {
        reservationCards: [
          // @ts-ignore
          {
            id: "standalone-1",
            isExpired: true,
          },
          // @ts-ignore
          {
            id: "standalone-2",
            isExpired: false,
          },
        ],
        vacationPackages: [
          {
            title: "vp card 1",
            // @ts-ignore
            card: {
              name: "main VP card 1 with partially expired subreservations",
              id: "vp-1",
              isExpired: false,
            },
            reservationCards: [
              // @ts-ignore
              {
                id: "vp-1-reservation-1",
                isExpired: true,
              },
              // @ts-ignore
              {
                id: "vp-1-reservation-2",
                isExpired: false,
              },
            ],
          },
          {
            title: "vp card 2",
            // @ts-ignore
            card: {
              name: "main VP card 2 with expired subreservatoins",
              id: "vp-2",
              isExpired: true,
            },
            reservationCards: [
              // @ts-ignore
              {
                id: "vp-2-reservation-1",
                isExpired: true,
              },
              // @ts-ignore
              {
                id: "vp-2-reservation-2",
                isExpired: true,
              },
            ],
          },
        ],
      },
    };

    expect(normalizedCardsData(dataStructure)).toEqual([
      {
        mainReservationCard: { id: "standalone-1", isExpired: true },
        subReservations: [],
        title: "",
      },
      {
        mainReservationCard: { id: "standalone-2", isExpired: false },
        subReservations: [],
        title: "",
      },
      {
        mainReservationCard: {
          id: "vp-1",
          isExpired: false,
          name: "main VP card 1 with partially expired subreservations",
        },
        subReservations: [
          { id: "vp-1-reservation-1", isExpired: true },
          { id: "vp-1-reservation-2", isExpired: false },
        ],
        title: "vp card 1",
      },
      {
        mainReservationCard: {
          id: "vp-2",
          isExpired: true,
          name: "main VP card 2 with expired subreservatoins",
        },
        subReservations: [
          { id: "vp-2-reservation-1", isExpired: true },
          { id: "vp-2-reservation-2", isExpired: true },
        ],
        title: "vp card 2",
      },
    ]);
  });

  it("returns empty array is data is empty", () => {
    expect(normalizedCardsData()).toEqual([]);

    expect(
      normalizedCardsData({
        userReservations: {
          vacationPackages: [],
        },
      })
    ).toEqual([]);

    expect(
      normalizedCardsData({
        userReservations: {
          reservationCards: [],
        },
      })
    ).toEqual([]);
  });
});

describe("splitForToggle - splits for active and inactive reservations", () => {
  // @ts-ignore
  const activeSubReservationCard: PostBookingTypes.ItineraryCard = {
    name: "active return flight ticket",
    isExpired: false,
  };

  // @ts-ignore
  const inactiveSubReservationCard: PostBookingTypes.ItineraryCard = {
    name: "inactive departure flight ticket",
    isExpired: true,
  };

  const fullyExpiredReservationCard1: PostBookingTypes.NormalizedReservationCard = {
    // @ts-ignore
    mainReservationCard: {
      id: "expired-reservatoin-card-1",
      isExpired: true,
    },
    title: "fully expired reservation card 1",
    subReservations: [inactiveSubReservationCard, inactiveSubReservationCard],
  };

  const fullyNonExpiredReservationCard1: PostBookingTypes.NormalizedReservationCard = {
    // @ts-ignore
    mainReservationCard: {
      id: "active-reservatoin-card-1",
      isExpired: false,
    },
    title: "fully active reservation card 1",
    subReservations: [activeSubReservationCard, activeSubReservationCard],
  };

  const partiallyActiveReservationCard1: PostBookingTypes.NormalizedReservationCard = {
    // @ts-ignore
    mainReservationCard: {
      name: "Partially active reservation card",
      isExpired: false,
    },
    title: "Partially active reservation",
    subReservations: [activeSubReservationCard, inactiveSubReservationCard],
  };

  it("if more then one active/inactive card is found - drops 'subreservations' from the card", () => {
    expect(
      splitForToggle([
        fullyExpiredReservationCard1,
        fullyExpiredReservationCard1,
        fullyNonExpiredReservationCard1,
        fullyNonExpiredReservationCard1,
      ])
    ).toEqual({
      active: [
        { ...fullyNonExpiredReservationCard1, subReservations: [] },
        { ...fullyNonExpiredReservationCard1, subReservations: [] },
      ],
      inactive: [
        { ...fullyExpiredReservationCard1, subReservations: [] },
        { ...fullyExpiredReservationCard1, subReservations: [] },
      ],
    });
  });
  it("if only one active card is found - keeps subreservations for it", () => {
    expect(
      splitForToggle([
        fullyExpiredReservationCard1,
        fullyExpiredReservationCard1,
        fullyNonExpiredReservationCard1,
      ])
    ).toEqual({
      active: [fullyNonExpiredReservationCard1],
      inactive: [
        { ...fullyExpiredReservationCard1, subReservations: [] },
        { ...fullyExpiredReservationCard1, subReservations: [] },
      ],
    });
  });

  it("if only one inactive card is found - keeps subreservations for it", () => {
    expect(
      splitForToggle([
        fullyExpiredReservationCard1,
        fullyNonExpiredReservationCard1,
        fullyNonExpiredReservationCard1,
      ])
    ).toEqual({
      active: [
        { ...fullyNonExpiredReservationCard1, subReservations: [] },
        { ...fullyNonExpiredReservationCard1, subReservations: [] },
      ],
      inactive: [fullyExpiredReservationCard1],
    });
  });

  it("if only one active reservation found and it has some inactive reservations - it pushes them to inactive card", () => {
    expect(splitForToggle([partiallyActiveReservationCard1])).toEqual({
      active: [
        {
          ...partiallyActiveReservationCard1,
          subReservations: [activeSubReservationCard],
        },
      ],
      inactive: [
        {
          mainReservationCard: partiallyActiveReservationCard1.mainReservationCard,
          subReservations: [
            {
              isExpired: true,
              name: "inactive departure flight ticket",
            },
          ],
          title: "Partially active reservation",
        },
      ],
    });
  });

  it("if expired reservatoins and one active with partially expired bookings - those bookings moved to inactive and all bookings from other expired reservations has subReservations removed", () => {
    expect(splitForToggle([partiallyActiveReservationCard1, fullyExpiredReservationCard1])).toEqual(
      {
        active: [
          {
            ...partiallyActiveReservationCard1,
            subReservations: [activeSubReservationCard],
          },
        ],
        inactive: [
          {
            ...fullyExpiredReservationCard1,
            subReservations: [],
          },
          {
            ...partiallyActiveReservationCard1,
            mainReservationCard: partiallyActiveReservationCard1.mainReservationCard,
            subReservations: [inactiveSubReservationCard],
          },
        ],
      }
    );
  });
});
