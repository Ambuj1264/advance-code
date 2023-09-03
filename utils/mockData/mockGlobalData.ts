import { randomInt } from "fp-ts/lib/Random";

import { constructProductSpecs } from "components/ui/Information/informationUtils";
import { constructProductProps } from "components/ui/utils/uiUtils";

export const mockName0 = "Golden Circle Trails";

export const mockUrl0 =
  "https://guidetoiceland.imgix.net/370148/x/0/on-a-summer-self-drive-tour-you-could-stop-at-mt-kirkjufell-on-the-snaefellsnes-peninsula-and-capture-a-dramatic-photo-of-the-mountain-bathed-in-the-rays-of-the-midnight-sun-3";
export const mockUrl1 =
  "https://guidetoiceland.imgix.net/189221/x/0/around-every-corner-in-iceland-visitors-will-find-new-and-fantastic-sights-including-that-of-mountain-ranges-and-luscious-valleys-1";
export const mockUrl2 =
  "https://guidetoiceland.imgix.net/189222/x/0/alongside-the-sun-voyager-perlan-dome-and-hallgrimskirkja-harpa-concert-hall-constitutes-one-of-the-city-s-most-recognisable-landmarks-17";
export const mockUrl3 =
  "https://guidetoiceland.imgix.net/189219/x/0/the-waterfall-svartifoss-is-a-rare-example-of-an-icelandic-waterfall-flowing-over-layered-basalt-columns-11";
export const mockUrl4 =
  "https://guidetoiceland.imgix.net/189232/x/0/gullfoss-the-golden-falls-make-up-an-integral-third-of-the-golden-circle-sightseeing-experience-15";
export const mockUrl5 =
  "https://guidetoiceland.imgix.net/189226/x/0/despite-their-small-size-icelandic-horses-are-able-to-withstand-the-harsh-icelandic-elements-better-than-most-other-animals-10";

export const mockQueryImage0 = {
  id: 0,
  url: mockUrl0,
  name: mockName0,
};
export const mockQueryImage1 = {
  id: 1,
  url: mockUrl1,
  name: mockName0,
};
export const mockQueryImage2 = {
  id: 2,
  url: mockUrl2,
  name: mockName0,
};
export const mockQueryImage3 = {
  id: 3,
  url: mockUrl3,
  name: mockName0,
};
export const mockQueryImage4 = {
  id: 4,
  url: mockUrl4,
  name: mockName0,
};
export const mockQueryImage5 = {
  id: 5,
  url: mockUrl5,
  name: mockName0,
};

export const mockQueryImages0 = [
  mockQueryImage0,
  mockQueryImage1,
  mockQueryImage2,
  mockQueryImage3,
  mockQueryImage4,
  mockQueryImage5,
];

export const mockImage0 = {
  id: "0",
  url: mockUrl0,
  name: mockName0,
};
export const mockImage1 = {
  id: "1",
  url: mockUrl1,
  name: mockName0,
};
export const mockImage2 = {
  id: "2",
  url: mockUrl2,
  name: mockName0,
};
export const mockImage3 = {
  id: "3",
  url: mockUrl3,
  name: mockName0,
};
export const mockImage4 = {
  id: "4",
  url: mockUrl4,
  name: mockName0,
};
export const mockImage5 = {
  id: "5",
  url: mockUrl5,
  name: mockName0,
};

export const mockImages0 = [mockImage0, mockImage1, mockImage2, mockImage3, mockImage4, mockImage5];

export const mockParagraphText0 =
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.";

export const mockParagraphText1 =
  "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export const mockParagraphText2 =
  "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export const mockDescription =
  "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

export const mockTheme: Theme = {
  colors: {
    primary: "#336699",
    action: "#33ab63",
  },
};

export const mockQueryProductSpecs0 = [
  {
    iconId: "0",
    name: "Duration",
    value: "5 days",
  },
  {
    iconId: "1",
    name: "Difficulty",
    value: "Medium",
  },
  {
    iconId: "2",
    name: "Language",
    value: "English",
  },
  {
    iconId: "3",
    name: "Free pickup",
    value: "Keflavík Airport, Reykjavík",
  },
];

export const mockProductSpecs0 = constructProductSpecs(mockQueryProductSpecs0);

export const mockCarName0 = "Suzuki Vitara 2016";

export const mockCarUrl0 = "https://guidetoiceland.imgix.net/484291/x/0/1.jpg";
export const mockCarUrl1 = "https://guidetoiceland.imgix.net/484292/x/0/2.jpg";
export const mockCarUrl2 = "https://guidetoiceland.imgix.net/484294/x/0/4.jpg";

export const mockCarQueryImage0 = {
  id: 0,
  url: mockCarUrl0,
  name: mockCarName0,
};

export const mockCarQueryImage1 = {
  id: 1,
  url: mockCarUrl1,
  name: mockCarName0,
};

export const mockCarQueryImage2 = {
  id: 2,
  url: mockCarUrl2,
  name: mockCarName0,
};

export const mockCarImage0 = {
  id: "0",
  url: mockCarUrl0,
  name: mockCarName0,
};
export const mockCarImage1 = {
  id: "1",
  url: mockCarUrl1,
  name: mockCarName0,
};
export const mockCarImage2 = {
  id: "2",
  url: mockCarUrl2,
  name: mockCarName0,
};

export const mockCarQueryImages0 = [mockCarQueryImage1, mockCarQueryImage2];

export const mockQueryProductProps0: SharedTypes.QueryProductProp[] = [
  {
    iconId: "travelPlan",
    title: "Perfect travel plan",
  },
  {
    iconId: "fullyCustomizable",
    title: "Fully customizable",
  },
  {
    iconId: "customerSupport",
    title: "24/7 customer support",
  },
];

export const mockProductProps0: SharedTypes.ProductProp[] =
  constructProductProps(mockQueryProductProps0);

export const mockMapDestinationPoint = {
  id: 400,
  type: "destination",
  latitude: 64.130935668945,
  longitude: -21.932876586914,
  title: "Reykjavík Airport",
  url: "https://guidetoiceland.is/travel-iceland/drive/reykjavik-airport",
  description:
    "Reykjavík Airport refers to the predominantly domestic airport within Iceland’s capital, often shortened to RVK or BIRK.  Browse a wide range of Reykjavik tours.  While Keflavík International Airport deals with flights abroad, planes from Reykjavík Domestic Airport only fly to select towns around",
  reviewTotalScore: 0,
  reviewTotalCount: 0,
  isGoogleReview: false,
  image: {
    id: "413011",
    alt: "An aerial view of central Reykjavík.",
    name: "An aerial view of central Reykjavík.",
    url: "https://guidetoiceland.imgix.net/413011/x/0/reykjavik-airport-jpeg.jpg",
    __typename: "Image",
  },
  __typename: "MapPoints",
};

export const mockMapAttractionPoint = {
  id: 266,
  type: "attraction",
  latitude: 64.143035888672,
  longitude: -21.912256240845,
  title: "Laugavegur (Main Street)",
  url: "https://guidetoiceland.is/travel-iceland/drive/laugavegur-street",
  description:
    "Wikimedia, Creative Commons, Photo Credit: Marek Ślusarczyk  Laugavegur is the main shopping street in Reykjavík, renowned for its boutiques, restaurants, and bars.  It can be explored with a local guide on certain culture tours, and many self-drive tours and guided vacation packages, such as this 1",
  reviewTotalScore: 4.5,
  reviewTotalCount: 47,
  isGoogleReview: true,
  image: {
    id: "429371",
    alt: "Laugavegur is the main shopping street in Reykjavik.",
    name: "Laugavegur is the main shopping street in Reykjavik.",
    url: "https://guidetoiceland.imgix.net/429371/x/0/800px-laugavegur-reykjavik.jpg",
    __typename: "Image",
  },
  __typename: "MapPoints",
};

export const mockMapTourPoint = {
  id: 1328,
  type: "tour",
  latitude: 64.146598815918,
  longitude: -21.942600250244,
  title: "Snaefellsnes National Park | Small Group Day Tour with very long name",
  url: "https://guidetoiceland.is/book-holiday-trips/the-mysterious-snaefellsnes-national-park",
  description:
    "Join this captivating tour to the beautiful Snæfellsnes peninsula. Sometimes called ‘Iceland in Miniature’ due to its vast diversity of landscapes, this is the perfect trip for those seeking to capture the true spirit and beauty of this incredible island. This is a small-group minibus tour for a...",
  reviewTotalScore: 4.8,
  reviewTotalCount: 385,
  isGoogleReview: true,
  image: {
    id: "264320",
    alt: "",
    name: "Expect to see seals lounging on the shores of Ytri-Tunga on the Snæfellsnes Peninsula.",
    url: "https://guidetoiceland.imgix.net/264320/x/0/expect-to-see-seals-lounging-on-the-shores-of-ytri-tunga-on-the-snaefellsnes-peninsula",
    __typename: "Image",
  },
  __typename: "MapPoints",
};

export const mockMapHotelPoint = {
  id: 1225,
  type: "hotel",
  latitude: 64.142608642578,
  longitude: -21.913709640503,
  title: "Midgardur by Center Hotels",
  url: "https://guidetoiceland.is/accommodation/iceland-hotels-reykjavik/center-hotel-midgardur-2",
  description:
    "The lovely hotel is ideally located in the heart of the city in short walking distance from the main attractions in Reykjavik. The location makes the hotel the ideal choice for visitors who are searching for a relaxing atmosphere and at the same time an excellent location to explore the city center....",
  reviewTotalScore: 0,
  reviewTotalCount: 0,
  isGoogleReview: false,
  image: {
    id: "676978",
    alt: null,
    name: "167081803.jpg",
    url: "https://guidetoiceland.imgix.net/676978/x/0/167081803-jpg",
    __typename: "Image",
  },
  __typename: "MapPoints",
};

export const mockMapCarPoint = {
  id: 5441,
  type: "car",
  latitude: 64.143928527832,
  longitude: -21.915977478027,
  title: "City Car Rental",
  url: "https://guidetoiceland.is/car-rentals/city-car-rental/5441",
  description:
    "Established in 2007. This privately owned car rental offers wide range of quality cars at great prices. We operate two offices and provide pick up and drop off to locations in Reykjavik and Keflavik.",
  reviewTotalScore: 3.8783,
  reviewTotalCount: 378,
  isGoogleReview: true,
  image: {
    id: "484216",
    name: "Colored.png",
    url: "https://guidetoiceland.imgix.net/484216/x/0/colored-png",
    __typename: "Image",
  },
  __typename: "MapPoints",
};

export const mockMapPoints: SharedTypes.MapPoint[] = [
  mockMapTourPoint,
  mockMapCarPoint,
  mockMapHotelPoint,
  mockMapDestinationPoint,
  mockMapAttractionPoint,
];

export const getMockNameRandom = () => {
  const randomIndex = randomInt(0, 5)();
  return [
    mockName0,
    `${mockName0} ${mockName0}`,
    `${mockName0} ${mockName0}`,
    mockCarName0,
    `${mockCarName0} ${mockCarName0}`,
    mockMapTourPoint.title,
  ][randomIndex];
};
