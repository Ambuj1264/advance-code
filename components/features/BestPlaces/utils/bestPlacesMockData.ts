import { mockImage1 } from "utils/mockData/mockGlobalData";

export const mockBestDestinationsMetaData: SharedTypes.QuerySearchMetadata = {
  title: "Best destinations in Iceland",
  subtitle: "Find the best cities, activities and travel destinations",
};

export const mockCoverImages = [
  {
    id: "404595",
    url: "https://guidetoiceland.imgix.net/404595/x/0/iceland-s-golden-circle-ultimate-guide-and-top-9-detours-21-jpg",
    name: "Gullfoss was almost lost to a hydro-electric dam, but for the work of one farmhand.",
  },
  {
    id: "331988",
    url: "https://guidetoiceland.imgix.net/331988/x/0/gullfoss",
    name: "Gullfoss",
  },
];

export const mockMapData = {
  zoom: 6,
  isCountryMap: true,
  options: {
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  points: [],
};

export const mockQueryBestPlacesPageHeader = {
  metadata: mockBestDestinationsMetaData,
  header: {
    image: {
      ...mockImage1,
      id: Number(mockImage1.id),
    },
  },
};

export const mockCover = {
  name: mockBestDestinationsMetaData.title,
  description: mockBestDestinationsMetaData.subtitle,
  image: mockImage1,
};

export const mockQueryBestPlace0: BestPlacesTypes.QueryBestPlace = {
  id: 33,
  name: "Jökulsárlón",
  excerptDescription:
    "Jökulsárlón is Iceland’s most famous glacier lagoon. Conveniently located in the southeast by Route 1, about halfway between the Skaftafell Nature Reserve and Höfn, it ",
  location: "Jökulsárlón, Iceland",
  latitude: 64.046028137207,
  longitude: -16.177135467529,
  image: {
    id: 358809,
    name: "Jökulsárlón is one of Iceland's most popular and unique attractions",
    url: "https://guidetoiceland.imgix.net/358809/x/0/jokulsarlon-is-one-of-iceland-s-most-popular-and-unique-attractions?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&s=af74cd3352bbfaa5790c2f589324ce59&w=&h=&crop=faces&fit=crop",
  },
  url: "/travel-iceland/drive/jokulsarlon",
  reviewTotalScore: "4.8",
  reviewTotalCount: 7552,
};

export const mockBestPlace0: SharedTypes.PlaceProduct = {
  id: 33,
  image: {
    id: "358809",
    name: "Jökulsárlón is one of Iceland's most popular and unique attractions",
    url: "https://guidetoiceland.imgix.net/358809/x/0/jokulsarlon-is-one-of-iceland-s-most-popular-and-unique-attractions",
  },
  headline: "Jökulsárlón",
  address: "Jökulsárlón, Iceland",
  description:
    "Jökulsárlón is Iceland’s most famous glacier lagoon. Conveniently located in the southeast by Route 1, about halfway between the Skaftafell Nature Reserve and Höfn, it ",
  linkUrl: "/travel-iceland/drive/jokulsarlon",
  averageRating: 4.8,
  reviewsCount: 7552,
  nofollow: true,
};

export const mockRawBestPlacesFilter0: BestPlacesTypes.RawFilter = {
  id: 31,
  name: "Reykjavík",
};

export const mockBestPlacesFilter0: SearchPageTypes.Filter = {
  id: "31",
  name: "Reykjavík",
};

export const mockQueryBestPlacesFilters0 = {
  attractions: [mockRawBestPlacesFilter0],
  attractionTypes: [mockRawBestPlacesFilter0],
};

export const mockBestPlacesFilters0 = {
  destinations: [mockBestPlacesFilter0],
  attractions: [mockBestPlacesFilter0],
};
