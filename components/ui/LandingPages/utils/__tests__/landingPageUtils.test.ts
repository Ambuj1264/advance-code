import {
  constructLandingPageImageSectionCards,
  constructLandingPageSideImageSectionCards,
  getNrOfSideImageSectionCardsOnPage,
  constructLandingPageFAQs,
  splitUpTitle,
  getLandingPageBreadcrumbs,
  getCountryName,
  getPlaceNames,
  replaceDriverCountry,
  getPlaceName,
} from "../landingPageUtils";

import { GraphCMSPageVariation, GraphCMSPageType, SupportedLanguages } from "types/enums";
import { gteImgixUrl } from "utils/imageUtils";

describe("constructLandingPageImageSectionCards", () => {
  const sharedFields = {
    id: "id",
    destinationNumberOfPlaces: 4,
    pageType: GraphCMSPageType.Flights,
  };
  const img = {
    id: "kJ1KQEZGRR2wCJBX2M88",
    caption: "",
    handle: "kJ1KQEZGRR2wCJBX2M88",
  };
  const resImg = {
    id: "kJ1KQEZGRR2wCJBX2M88",
    url: `${gteImgixUrl}/kJ1KQEZGRR2wCJBX2M88`,
    name: "Flights to Akureyri",
  };
  const flag = {
    id: "1",
    handle: "kJ1KQEZGRR2wCJBX2M88",
    caption: "flag",
  };
  const destination1 = {
    ...sharedFields,
    linkUrl: "/iceland/best-flights/to-reykjavik",
    slug: "to-reykjavik",
    title: "Flights to Reykjavík",
    pageVariation: GraphCMSPageVariation.toCity,
    continentGroupOrder: [],
    destination: {
      continentGroup: [],
      mainImage: img,
      name: {
        value: "Reykjavík",
      },
      continentGroupOrder: [],
      countries: [
        {
          flag,
          name: {
            value: "Iceland",
          },
        },
      ],
    },
  };
  const destination2 = {
    linkUrl: "/iceland/best-flights/to-akureyri",
    slug: "to-akureyri",
    title: "Flights to Akureyri",
    pageVariation: GraphCMSPageVariation.toCity,
    continentGroupOrder: [],
    destination: {
      continentGroup: [],
      mainImage: img,
      name: {
        value: "Akureyri",
      },
      continentGroupOrder: [],
      countries: [
        {
          flag,
          name: {
            value: "Iceland",
          },
        },
      ],
    },
    ...sharedFields,
  };
  const destination3 = {
    linkUrl: "/iceland/best-flights/to-husavik",
    slug: "to-husavik",
    title: "Flights to Húsavík",
    pageVariation: GraphCMSPageVariation.toCity,
    continentGroupOrder: [],
    destination: {
      continentGroup: [],
      mainImage: img,
      name: {
        value: "Húsavík",
      },
      continentGroupOrder: [],
      countries: [
        {
          flag,
          name: {
            value: "Iceland",
          },
        },
      ],
    },
    ...sharedFields,
  };
  const result = [
    {
      title: "Flights to Reykjavík",
      country: "Iceland",
      slug: "to-reykjavik",
      image: {
        ...resImg,
        name: "Flights to Reykjavík",
      },
      destinationFlag: {
        id: "1",
        name: "Iceland",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Iceland",
        height: 16,
        width: 24,
      },
      linkUrl: "/iceland/best-flights/to-reykjavik",
      pageType: GraphCMSPageType.Flights,
      origin: undefined,
      originFlag: undefined,
      subtype: undefined,
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      prefetchParams: {
        destinationCountry: "Iceland",
        destinationName: "Reykjavík",
        originCountry: undefined,
        originName: undefined,
        pageVariation: GraphCMSPageVariation.toCity,
        subtype: undefined,
        metadataUri: "/iceland/best-flights/to-reykjavik",
        tagId: undefined,
      },
      destination: {
        continentGroup: [],
        mainImage: img,
        name: {
          value: "Reykjavík",
        },
        continentGroupOrder: [],
        countries: [
          {
            flag,
            name: {
              value: "Iceland",
            },
          },
        ],
      },
    },
    {
      title: "Flights to Akureyri",
      country: "Iceland",
      slug: "to-akureyri",
      image: {
        ...resImg,
        name: "Flights to Akureyri",
      },
      destinationFlag: {
        id: "1",
        name: "Iceland",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Iceland",
        height: 16,
        width: 24,
      },
      linkUrl: "/iceland/best-flights/to-akureyri",
      pageType: GraphCMSPageType.Flights,
      origin: undefined,
      originFlag: undefined,
      subtype: undefined,
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      prefetchParams: {
        destinationCountry: "Iceland",
        destinationName: "Akureyri",
        originCountry: undefined,
        originName: undefined,
        pageVariation: GraphCMSPageVariation.toCity,
        subtype: undefined,
        metadataUri: "/iceland/best-flights/to-akureyri",
        tagId: undefined,
      },
      destination: {
        continentGroup: [],
        mainImage: img,
        name: {
          value: "Akureyri",
        },
        continentGroupOrder: [],
        countries: [
          {
            flag,
            name: {
              value: "Iceland",
            },
          },
        ],
      },
    },
    {
      title: "Flights to Húsavík",
      country: "Iceland",
      slug: "to-husavik",
      image: {
        ...resImg,
        name: "Flights to Húsavík",
      },
      destinationFlag: {
        id: "1",
        name: "Iceland",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Iceland",
        height: 16,
        width: 24,
      },
      linkUrl: "/iceland/best-flights/to-husavik",
      pageType: GraphCMSPageType.Flights,
      origin: undefined,
      originFlag: undefined,
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      prefetchParams: {
        destinationCountry: "Iceland",
        destinationName: "Húsavík",
        metadataUri: "/iceland/best-flights/to-husavik",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCity",
        subtype: undefined,
        tagId: undefined,
      },
      subtype: undefined,
      destination: {
        continentGroup: [],
        mainImage: img,
        name: {
          value: "Húsavík",
        },
        continentGroupOrder: [],
        countries: [
          {
            flag,
            name: {
              value: "Iceland",
            },
          },
        ],
      },
    },
  ];
  test("should return correctly constructed image cards", () => {
    expect(
      constructLandingPageImageSectionCards([destination1, destination2, destination3])
    ).toEqual(result);
  });
});

describe("constructLandingPageSideImageSectionCards", () => {
  const img = {
    id: "kJ1KQEZGRR2wCJBX2M88",
    caption: "",
    handle: "kJ1KQEZGRR2wCJBX2M88",
  };
  const resImg = {
    id: "kJ1KQEZGRR2wCJBX2M88",
    url: `${gteImgixUrl}/kJ1KQEZGRR2wCJBX2M88`,

    name: "",
  };
  const flag = {
    id: "1",
    handle: "kJ1KQEZGRR2wCJBX2M88",
  };
  const destination1 = {
    id: "1",
    linkUrl: "denmark/best-flights",
    slug: null,
    title: "Flights to Denmark",
    pageVariation: GraphCMSPageVariation.toCountry,
    destinationNumberOfPlaces: 4,
    continentGroupOrder: [4],
    pageType: GraphCMSPageType.Flights,
    metadataUri: "",
    destination: {
      continentGroup: [3],
      mainImage: img,
      name: {
        value: "Denmark",
      },
      continentGroupOrder: [4],
      flag,
    },
  };
  const destination2 = {
    id: "1",
    linkUrl: "norway/best-flights",
    pageVariation: GraphCMSPageVariation.toCountry,
    slug: null,
    title: "Flights to Norway",
    destinationNumberOfPlaces: 18,
    continentGroupOrder: [8],
    pageType: GraphCMSPageType.Flights,
    metadataUri: "",
    destination: {
      continentGroup: [3],
      mainImage: img,
      name: {
        value: "Norway",
      },
      continentGroupOrder: [8],
      flag,
    },
  };
  const destination3 = {
    id: "1",
    linkUrl: "spain/best-flights",
    pageVariation: GraphCMSPageVariation.toCountry,
    slug: null,
    title: "Flights to Spain",
    image: img,
    destinationNumberOfPlaces: 24,
    continentGroupOrder: [2],
    pageType: GraphCMSPageType.Flights,
    metadataUri: "",
    destination: {
      continentGroup: [1],
      mainImage: img,
      name: {
        value: "Spain",
      },
      continentGroupOrder: [2],
      flag,
    },
  };
  const destination4 = {
    id: "1",
    linkUrl: "latvia/best-flights",
    pageVariation: GraphCMSPageVariation.toCountry,
    slug: null,
    title: "Flights to Latvia",
    image: img,
    destinationNumberOfPlaces: 18,
    continentGroupOrder: [7],
    pageType: GraphCMSPageType.Flights,
    metadataUri: "",
    destination: {
      continentGroup: [2],
      mainImage: img,
      name: {
        value: "Latvia",
      },
      continentGroupOrder: [7],
      flag,
    },
  };
  const destination5 = {
    id: "1",
    linkUrl: "portugal/best-flights",
    pageVariation: GraphCMSPageVariation.toCountry,
    slug: null,
    title: "Flights to Portugal",
    image: img,
    destinationNumberOfPlaces: 24,
    continentGroupOrder: [4],
    pageType: GraphCMSPageType.Flights,
    metadataUri: "",
    destination: {
      continentGroup: [1],
      mainImage: img,
      name: {
        value: "Portugal",
      },
      continentGroupOrder: [4],
      flag,
    },
  };
  const result = [
    {
      title: "Flights to Denmark",
      subtitle: "4 available airports",
      subtype: undefined,
      country: "Denmark",
      slug: undefined,
      image: {
        ...resImg,
        name: "Flights to Denmark",
      },
      linkUrl: "denmark/best-flights",
      destinationFlag: {
        id: "1",
        name: "Denmark",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Denmark",
        height: 16,
        width: 24,
      },
      pageType: GraphCMSPageType.Flights,
      destination: {
        continentGroup: [3],
        continentGroupOrder: [4],
        flag,
        mainImage: {
          id: "kJ1KQEZGRR2wCJBX2M88",
          caption: "",
          handle: "kJ1KQEZGRR2wCJBX2M88",
        },
        name: {
          value: "Denmark",
        },
      },
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      origin: undefined,
      prefetchParams: {
        destinationCountry: undefined,
        destinationName: "Denmark",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCountry",
        subtype: undefined,
        metadataUri: "denmark/best-flights",
        tagId: undefined,
      },
    },
    {
      title: "Flights to Norway",
      subtitle: "18 available airports",
      subtype: undefined,
      country: "Norway",
      slug: undefined,
      image: {
        ...resImg,
        name: "Flights to Norway",
      },
      linkUrl: "norway/best-flights",
      destinationFlag: {
        id: "1",
        name: "Norway",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Norway",
        height: 16,
        width: 24,
      },
      pageType: GraphCMSPageType.Flights,
      destination: {
        continentGroup: [3],
        continentGroupOrder: [8],
        flag,
        mainImage: {
          id: "kJ1KQEZGRR2wCJBX2M88",
          caption: "",
          handle: "kJ1KQEZGRR2wCJBX2M88",
        },
        name: {
          value: "Norway",
        },
      },
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      origin: undefined,
      prefetchParams: {
        destinationCountry: undefined,
        destinationName: "Norway",
        metadataUri: "norway/best-flights",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCountry",
        subtype: undefined,
        tagId: undefined,
      },
    },
    {
      title: "Flights to Spain",
      subtitle: "24 available airports",
      subtype: undefined,
      country: "Spain",
      slug: undefined,
      image: {
        ...resImg,
        name: "Flights to Spain",
      },
      linkUrl: "spain/best-flights",
      destinationFlag: {
        id: "1",
        name: "Spain",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Spain",
        height: 16,
        width: 24,
      },
      pageType: GraphCMSPageType.Flights,
      destination: {
        continentGroup: [1],
        continentGroupOrder: [2],
        flag,
        mainImage: {
          id: "kJ1KQEZGRR2wCJBX2M88",
          caption: "",
          handle: "kJ1KQEZGRR2wCJBX2M88",
        },
        name: {
          value: "Spain",
        },
      },
      origin: undefined,
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      prefetchParams: {
        destinationCountry: undefined,
        destinationName: "Spain",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCountry",
        subtype: undefined,
        metadataUri: "spain/best-flights",
        tagId: undefined,
      },
    },
    {
      title: "Flights to Latvia",
      subtitle: "18 available airports",
      subtype: undefined,
      country: "Latvia",
      slug: undefined,
      image: {
        ...resImg,
        name: "Flights to Latvia",
      },
      linkUrl: "latvia/best-flights",
      destinationFlag: {
        id: "1",
        name: "Latvia",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Latvia",
        height: 16,
        width: 24,
      },
      pageType: GraphCMSPageType.Flights,
      destination: {
        continentGroup: [2],
        continentGroupOrder: [7],
        flag,
        mainImage: {
          id: "kJ1KQEZGRR2wCJBX2M88",
          caption: "",
          handle: "kJ1KQEZGRR2wCJBX2M88",
        },
        name: {
          value: "Latvia",
        },
      },
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      origin: undefined,
      prefetchParams: {
        destinationCountry: undefined,
        destinationName: "Latvia",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCountry",
        subtype: undefined,
        metadataUri: "latvia/best-flights",
        tagId: undefined,
      },
    },
    {
      title: "Flights to Portugal",
      subtitle: "24 available airports",
      subtype: undefined,
      country: "Portugal",
      slug: undefined,
      image: {
        ...resImg,
        name: "Flights to Portugal",
      },
      linkUrl: "portugal/best-flights",
      destinationFlag: {
        id: "1",
        name: "Portugal",
        url: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/kJ1KQEZGRR2wCJBX2M88`,
        alt: "Portugal",
        height: 16,
        width: 24,
      },
      pageType: GraphCMSPageType.Flights,
      destination: {
        continentGroup: [1],
        continentGroupOrder: [4],
        flag,
        mainImage: {
          id: "kJ1KQEZGRR2wCJBX2M88",
          caption: "",
          handle: "kJ1KQEZGRR2wCJBX2M88",
        },
        name: {
          value: "Portugal",
        },
      },
      origin: undefined,
      parentType: undefined,
      pluralParentType: undefined,
      pluralType: undefined,
      prefetchParams: {
        destinationCountry: undefined,
        destinationName: "Portugal",
        originCountry: undefined,
        originName: undefined,
        pageVariation: "ToCountry",
        subtype: undefined,
        metadataUri: "portugal/best-flights",
        tagId: undefined,
      },
    },
  ];
  test("should return correctly constructed side image cards", () => {
    expect(
      constructLandingPageSideImageSectionCards([
        destination1,
        destination2,
        destination3,
        destination4,
        destination5,
      ])
    ).toEqual(result);
  });
});

describe("constructLandingPageSideImageSectionCards", () => {
  test("should return correct nr of cards on page", () => {
    expect(getNrOfSideImageSectionCardsOnPage()).toEqual(12);
  });
});

describe("constructLandingPageFAQs", () => {
  const faq0 = { id: 1, question: "Is it you?", answer: "Yes" };
  const emptyAnswer = { id: 2, question: "Some random question", answer: "" };
  const emptyQuesiton = { id: 3, question: "", answer: "No" };
  test("should return remove empty questions and answers from faqs", () => {
    expect(constructLandingPageFAQs([faq0, emptyAnswer, emptyQuesiton])).toEqual([faq0]);
  });
});

describe("splitUpTitle", () => {
  test("should return remove empty questions and answers from faqs", () => {
    expect(splitUpTitle("Flights to Iceland", undefined, "Iceland")).toEqual({
      smallTitle: "Flights to ",
      title: "Iceland",
    });
  });
  test("should return remove empty questions and answers from faqs", () => {
    expect(splitUpTitle("Flights from Iceland", "Iceland", undefined)).toEqual({
      smallTitle: "Flights from ",
      title: "Iceland",
    });
  });
  test("should return remove empty questions and answers from faqs", () => {
    expect(splitUpTitle("Flights from Iceland to Germany", "Iceland", undefined)).toEqual({
      smallTitle: "Flights from ",
      title: "Iceland to Germany",
    });
  });
});

describe("getLandingPageBreadcrumbs", () => {
  const gteUrl = "https://guidetoeurope.com";
  const gtiUrl = "https://guidetoiceland.is";
  const b1 = {
    name: "Flights to Europe",
    url: "/best-flights",
  };
  const b2 = {
    name: "Flights to Spain",
    url: "/spain/best-flights",
  };
  const b3 = {
    name: "Flights to Madrid",
    url: "/spain/best-flights/to-madrid",
  };
  const gteB1 = {
    name: "Flights to Europe",
    url: "https://guidetoeurope.com/best-flights",
  };
  const gtiB1 = {
    name: "Flights to Europe",
    url: "https://guidetoiceland.is/best-flights",
  };
  const gteB2 = {
    name: "Flights to Spain",
    url: "https://guidetoeurope.com/spain/best-flights",
  };
  const gteB3 = {
    name: "Flights to Madrid",
    url: "https://guidetoeurope.com/spain/best-flights/to-madrid",
  };
  const gtiB2 = {
    name: "Flights to Spain",
    url: "https://guidetoiceland.is/spain/best-flights",
  };
  const gtiB3 = {
    name: "Flights to Madrid",
    url: "https://guidetoiceland.is/spain/best-flights/to-madrid",
  };
  const lastCrumbName = "Search results";
  const lastCrumb = {
    url: "",
    name: lastCrumbName,
  };
  test("should return remove empty questions and answers from faqs", () => {
    expect(getLandingPageBreadcrumbs(gteUrl, [b1])).toEqual([gteB1]);
  });
  test("should return remove empty questions and answers from faqs", () => {
    expect(getLandingPageBreadcrumbs(gteUrl, [b1, b2, b3])).toEqual([gteB1, gteB2, gteB3]);
  });
  test("should return remove empty questions and answers from faqs", () => {
    expect(getLandingPageBreadcrumbs(gtiUrl, [b1, b2, b3])).toEqual([gtiB1, gtiB2, gtiB3]);
  });
  test("should return remove empty questions and answers from faqs", () => {
    expect(getLandingPageBreadcrumbs(gteUrl, [b1, b2, b3], lastCrumbName)).toEqual([
      gteB1,
      gteB2,
      gteB3,
      lastCrumb,
    ]);
  });
});

describe("getCountryName", () => {
  const iceland = {
    name: {
      value: "Iceland",
    },
  };
  const reykjavik = {
    name: {
      value: "Reykjavík",
    },
    countries: [iceland],
  };
  const denmark = {
    name: {
      value: "Denmark",
    },
  };
  const copen = {
    name: {
      value: "Copenhagen",
    },
    countries: [denmark],
  };
  test("should return undefined because there is no destination or origin", () => {
    expect(getCountryName()).toEqual(undefined);
  });
  test("should return Denmark because its destination country name", () => {
    expect(getCountryName(copen, reykjavik)).toEqual("Denmark");
  });
  test("should return Iceland because there is no destination, and the it should return origin country name", () => {
    expect(getCountryName(undefined, reykjavik)).toEqual("Iceland");
  });
  test("hould return Denmark because its destination country name", () => {
    expect(getCountryName(denmark, reykjavik)).toEqual("Denmark");
  });
  test("should return Iceland because there is no destination, and the it should return origin country name", () => {
    expect(getCountryName(undefined, iceland)).toEqual("Iceland");
  });
});

describe("getPlaceNames", () => {
  const denmark = {
    name: {
      value: "Denmark",
    },
    toName: {
      value: "to Denmark",
    },
    fromName: {
      value: "from Denmark",
    },
    inName: {
      value: "in Denmark",
    },
  };
  const copen = {
    name: {
      value: "Copenhagen",
    },
    toName: {
      value: "to Copenhagen",
    },
    fromName: {
      value: "from Copenhagen",
    },
    inName: {
      value: "in Copenhagen",
    },
    countries: [denmark],
  };
  test("should return all place names as undefined", () => {
    expect(getPlaceNames()).toEqual({
      toCity: undefined,
      toCountry: undefined,
      inCity: undefined,
      inCountry: undefined,
      fromCity: undefined,
      fromCountry: undefined,
    });
  });
  test("should return all place names filled", () => {
    expect(getPlaceNames(copen)).toEqual({
      toCity: "to Copenhagen",
      toCountry: "to Denmark",
      inCity: "in Copenhagen",
      inCountry: "in Denmark",
      fromCity: "from Copenhagen",
      fromCountry: "from Denmark",
      city: "Copenhagen",
      country: "Denmark",
      destinationAirport: "Copenhagen",
    });
  });
  test("should return only country names filled", () => {
    expect(getPlaceNames(denmark)).toEqual({
      toCity: undefined,
      toCountry: "to Denmark",
      inCity: undefined,
      inCountry: "in Denmark",
      fromCity: undefined,
      fromCountry: "from Denmark",
      city: undefined,
      country: "Denmark",
      destinationAirport: undefined,
    });
  });
});

describe("replaceDriverCountry", () => {
  test("should replace driverCountry in link", () => {
    expect(
      replaceDriverCountry(
        "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverCountryCode=DE&driverAge=45&supplier=okRentACar'>The cheapest car</a>",
        "EN"
      )
    ).toEqual(
      "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverCountryCode=EN&driverAge=45&supplier=okRentACar'>The cheapest car</a>"
    );
    expect(
      replaceDriverCountry(
        "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverAge=45&supplier=okRentACar&driverCountryCode=DE'>The cheapest car</a>",
        "EN"
      )
    ).toEqual(
      "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverAge=45&supplier=okRentACar&driverCountryCode=EN'>The cheapest car</a>"
    );
    expect(
      replaceDriverCountry(
        "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?driverCountryCode=DE&dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverAge=45&supplier=okRentACar'>The cheapest car</a>",
        "EN"
      )
    ).toEqual(
      "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?driverCountryCode=EN&dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1&dropoffId=34,1&driverAge=45&supplier=okRentACar'>The cheapest car</a>"
    );
  });

  test("should return the same string if there is no driverCountry ", () => {
    expect(replaceDriverCountry("", "IS")).toEqual("");
    expect(
      replaceDriverCountry(
        "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1'>The cheapest car</a>",
        "EN"
      )
    ).toEqual(
      "<a rel='nofollow' target='_blank' href='/italy/best-car-rental?dateFrom=2021-11-09%2010:00&dateTo=2021-11-16%2010:00&pickupId=34,1'>The cheapest car</a>"
    );
  });
});

describe("getPlaceName", () => {
  test("should return country name in polish", () => {
    const plPlace = {
      name: {
        value: "Wielka Brytania",
      },
    };
    expect(
      getPlaceName("Przewodnik po Wielkiej Brytanii", SupportedLanguages.Polish, plPlace)
    ).toEqual("Wielkiej Brytanii");
    const enPlace = {
      name: {
        value: "the United Kingdom",
      },
    };
    expect(
      getPlaceName("Guide to the United Kingdom", SupportedLanguages.English, enPlace)
    ).toEqual("the United Kingdom");
  });
});
