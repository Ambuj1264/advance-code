import { mockUrl0 } from "utils/mockData/mockGlobalData";

export const mockCategory0: SearchPageTypes.Category = {
  id: 129,
  name: "Nature tours",
  tours: 776,
  image: {
    id: "Empty alt",
    url: mockUrl0,
    name: "Empty alt",
  },
  url: "/fake-url-1",
  subCategories: [
    {
      id: 777,
      name: "Blue lagoon tours",
      tours: 123,
      subCategories: [],
      url: "/fake-url-2",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 778,
      name: "Ice cave tours",
      tours: 119,
      subCategories: [],
      url: "/fake-url-3",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 779,
      name: "Private tours",
      tours: 93,
      subCategories: [],
      url: "/fake-url-4",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77712,
      name: "River tours",
      tours: 68,
      subCategories: [],
      url: "/fake-url-5",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77714,
      name: "Volcano tours",
      tours: 31,
      subCategories: [],
      url: "/fake-url-6",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77715,
      name: "Waterfall tours",
      tours: 205,
      subCategories: [],
      url: "/fake-url-7",
      image: {
        id: "Empty alt",
        url: "",
        name: "Empty alt",
      },
    },
  ],
};

export const mockQueryCategory0: SearchPageTypes.QueryCategory = {
  id: 129,
  name: "Nature tours",
  tours: 776,
  image: {
    id: 0,
    url: mockUrl0,
    name: "Empty alt",
  },
  url: "/fake-url-1",
  subCategories: [
    {
      id: 777,
      name: "Blue lagoon tours",
      tours: 123,
      subCategories: [],
      url: "/fake-url-2",
      image: {
        id: 1,
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 778,
      name: "Ice cave tours",
      tours: 119,
      subCategories: [],
      url: "/fake-url-3",
      image: {
        id: 2,
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 779,
      name: "Private tours",
      tours: 93,
      subCategories: [],
      url: "/fake-url-4",
      image: {
        id: 3,
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77712,
      name: "River tours",
      tours: 68,
      subCategories: [],
      url: "/fake-url-5",
      image: {
        id: 4,
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77714,
      name: "Volcano tours",
      tours: 31,
      subCategories: [],
      url: "/fake-url-6",
      image: {
        id: 5,
        url: "",
        name: "Empty alt",
      },
    },
    {
      id: 77715,
      name: "Waterfall tours",
      tours: 205,
      subCategories: [],
      url: "/fake-url-7",
      image: {
        id: 6,
        url: "",
        name: "Empty alt",
      },
    },
  ],
};

export const mockDurationFilter0: SearchPageTypes.Filter[] = [
  {
    id: "1",
    name: "Day tour",
  },
  {
    id: "2",
    name: "2 days",
  },
  {
    id: "3",
    name: "3 days",
  },
];

export const mockActivitiesFilter0 = [
  {
    id: "368",
    name: "Skiing",
  },
  {
    id: "370",
    name: "Self drive",
  },
  {
    id: "371",
    name: "Airplane",
  },
];

export const mockAttractionsFilter0 = [
  {
    id: "32",
    name: "Akureyri",
  },
  {
    id: "22",
    name: "Blue Lagoon",
  },
  {
    id: "54",
    name: "Dettifoss",
  },
];

export const mockFilters0 = {
  durations: mockDurationFilter0,
  activities: mockActivitiesFilter0,
  attractions: mockAttractionsFilter0,
};

export const mockQueryTourAutoCompleteLocations: SharedTypes.QueryTourSearchStartingLocations = {
  tourStartingLocations: [
    { id: 31, name: "Reykjavik" },
    { id: 400, name: "Reykjavik Airport" },
    { id: 107, name: "Reykjanes" },
    { id: 487, name: "Reykjavik Harbour" },
    { id: 707, name: "Capital Region" },
  ],
};

export const mockTourAutoCompleteLocations = [
  { id: "31", name: "Reykjavik" },
  { id: "400", name: "Reykjavik Airport" },
  { id: "107", name: "Reykjanes" },
  { id: "487", name: "Reykjavik Harbour" },
  { id: "707", name: "Capital Region" },
];
