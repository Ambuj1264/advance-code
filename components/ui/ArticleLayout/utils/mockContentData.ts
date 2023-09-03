export const mockQueryTourSpec: SharedTypes.QueryProductSpec = {
  iconId: "tourStarts",
  name: "Tour starts",
  value: "Reykjavík",
};

export const mockQueryTourProc: SharedTypes.QueryProductProp = {
  iconId: "freeCancellation",
  title: "Free cancellation",
};

export const mockQueryTour = {
  id: 25,
  name: "Thrihnukagigur Volcano Tour | Go Inside a Magma Chamber",
  linkUrl: "http://andrey.traveldev.org/book-holiday-trips/inside-the-volcano",
  slug: "inside-the-volcano",
  specs: [
    {
      iconId: "tourStarts",
      name: "Tour starts",
      value: "Reykjavík",
    },
    {
      iconId: "duration",
      name: "Duration",
      value: "6 hours",
    },
    {
      iconId: "difficultyModerate",
      name: "Difficulty",
      value: "Moderate",
    },
    {
      iconId: "guidedLanguage",
      name: "Languages",
      value: "English",
    },
    {
      iconId: "availability",
      name: "Available",
      value: "Jul. - Oct.",
    },
    {
      iconId: "minAge",
      name: "Minimum age:",
      value: "12 years old",
    },
  ],
  props: [
    {
      iconId: "freeCancellation",
      title: "Free cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "freePickup",
      title: "Free pickup",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
  ],
  image: {
    id: "267969",
    url: "https://guidetoiceland.imgix.net/267969/x/0/how-often-do-you-normally-get-to-venture-inside-of-a-glacier?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.2.0&s=dad1f122addee69c38ed03339275c732&w=&h=&crop=faces&fit=crop",
    name: "How often do you normally get to venture inside of a glacier?",
    alt: "",
  },
};

const mockQueryCar = {
  id: 737,
  name: "Dacia  Dokker 2015",
  orSimilar: false,
  linkUrl: "http://andrey.traveldev.org/car-rental/mini-campers-and-vans/go-smart-camper-2-pax/737",
  slug: "go-smart-camper-2-pax",
  price: 6975,
  image: {
    id: "398022",
    name: "DSC01952_2016.jpg",
    url: "https://guidetoiceland.imgix.net/398022/x/0/dsc01952-2016-jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.2.0&s=03cd2dc2b891c36267d44b211e2d4926",
    alt: null,
  },
  category: "Camper van",
  passengerQuantity: 2,
  bagQuantity: 2,
  automaticTransmission: false,
  fuelPolicy: "gasoline",
  model: "Dokker",
  depositRequired: true,
  doors: 4,
  highlandCapabilities: false,
  airConIncluded: false,
  minAge: 20,
  year: 2015,
  kmUnlimited: true,
  kmIncluded: "0",
  establishment: {
    id: 1118,
    reviewCount: 5,
    reviewTotalScore: "5.0",
    name: "Go Campers",
    image: {
      id: "165211",
      name: "Go_campers_logo.jpg",
      url: "https://guidetoiceland.imgix.net/165211/x/0/go-campers-logo-jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.2.0&s=57f04b55e80f1b757489775a64a1d42c",
      alt: null,
    },
  },
};

export const mockQueryHotel = {
  id: 1609,
  name: "-Gistiheimilið Gula Villan-",
  linkUrl: "/accommodation/iceland-guesthouses-akureyri/gistiheimilid-gula-villan",
  slug: "gistiheimilid-gula-villan",
  averageRating: 0,
  review_score_formatted: "0.0",
  reviewsCount: 0,
  stars: 0,
  price: 8580,
  image: {
    id: "446334",
    url: "https://guidetoiceland.imgix.net/446334/x/0/gulavillan.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.2.0&s=8e00baaf02b2e2dc634f200c83080eb8",
    name: "gulavillan.jpg",
    alt: null,
  },
  specs: [
    {
      iconId: "hotelCategory",
      name: "Category",
      value: "Guesthouses",
    },
    {
      iconId: "hotelLocation",
      name: "Location",
      value: "Brekkugata 8",
    },
    {
      iconId: "hotelWifi",
      name: "Free WIFI",
      value: "Rated excellent",
    },
    {
      iconId: "hotelCheckInOut",
      name: "Check-in & out",
      value: "16:00; 11:00",
    },
  ],
  props: [
    {
      iconId: "cancellation",
      title: "Free cancellation",
    },
    {
      iconId: "customerSupport",
      title: "24/7 customer support",
    },
    {
      iconId: "bestPrice",
      title: "Best price guarantee",
    },
    {
      iconId: "instantConfirmation",
      title: "Instant confirmation",
    },
  ],
};

export const mockQueryData = {
  listOfToursWidget: {
    type: "listOfTours",
    data: {
      variant: "horizontal",
      title: "Popular tours nearby Reykjavík",
      titleLink: "http://andrey.traveldev.org/book-trips-holiday/nature-tours/caves",
      icon: "",
      listOfTours: [mockQueryTour, mockQueryTour, mockQueryTour],
    },
  },
  listOfCarsWidget: {
    type: "listOfCars",
    data: {
      variant: "horizontal",
      title: "Popular cars nearby Reykjavík",
      titleLink: "http://andrey.traveldev.org/iceland-car-rentals/rent-a-car-in-keflavik",
      icon: "",
      listOfCars: [mockQueryCar, mockQueryCar, mockQueryCar],
    },
  },
  listOfHotelsWidget: {
    type: "listOfHotels",
    data: {
      variant: "horizontal",
      title: "Popular hotels nearby Reykjavík",
      titleLink: "http://andrey.traveldev.org/accommodation/reykjavik",
      icon: "",
      listOfHotels: [mockQueryHotel, mockQueryHotel, mockQueryHotel],
    },
  },
};
