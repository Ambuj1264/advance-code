import { BagType } from "components/features/FlightSearchPage/types/flightEnums";
import { gteImgixUrl } from "utils/imageUtils";

export const mockQueryVacationPackageDays = [
  {
    id: "1",
    title: "Reykjavik - Arrival Day",
    description: "This is Day 1's description",
    staysDestinationId: 12345,
    attractionLandingPages: [
      {
        id: "2",
        title: "Hallgrímskirkja",
        mainImage: {
          id: "23",
          caption: "hallgrimskirkja",
          handle: "adjgl235zs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Hallgrímskirkja's description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        title: "Nordland",
        uniqueId: 12345,
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Nordland's image caption",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Reykjavik",
    staysDestinationId: 12345,
    description: "This is Day 2's description",
    attractionLandingPages: [
      {
        id: "3",
        title: "Gullfoss",
        mainImage: {
          id: "24",
          caption: "gullfoss",
          handle: "gkp235jog",
        },
        location: {
          latitude: 64.922773,
          longitude: -18.257235,
        },
        reviewScore: 4.5,
        reviewCount: 234,
        description: "This is Gullfoss' description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        uniqueId: 12345,
        title: "Nordland",
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Nordland's image caption",
        },
      },
    ],
  },
];

export const mockQueryVacationPackageDays2 = [
  {
    id: "1",
    title: "Reykjavik - Arrival Day",
    description: "This is Day 1's description",
    staysDestinationId: 12345,
    attractionLandingPages: [
      {
        id: "2",
        title: "Hallgrímskirkja",
        mainImage: {
          id: "23",
          caption: "hallgrimskirkja",
          handle: "adjgl235zs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Hallgrímskirkja's description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        title: "Reykjavik",
        uniqueId: 12345,
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Reykjavik's image caption",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Reykjavik",
    staysDestinationId: 12345,
    description: "This is Day 2's description",
    attractionLandingPages: [
      {
        id: "3",
        title: "Gullfoss",
        mainImage: {
          id: "24",
          caption: "gullfoss",
          handle: "gkp235jog",
        },
        location: {
          latitude: 64.922773,
          longitude: -18.257235,
        },
        reviewScore: 4.5,
        reviewCount: 234,
        description: "This is Gullfoss' description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        uniqueId: 12345,
        title: "Reykjavik",
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Reykjavik's image caption",
        },
      },
    ],
  },
  {
    id: "3",
    title: "Selfoss",
    description: "This is Day 3's description",
    staysDestinationId: 34567,
    attractionLandingPages: [
      {
        id: "2",
        title: "Seljalandsfoss",
        mainImage: {
          id: "23",
          caption: "seljalandsfoss",
          handle: "adjgl23sfbzs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Seljalandsfoss's description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        title: "Selfoss",
        uniqueId: 34567,
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Selfoss's image caption",
        },
      },
    ],
  },
  {
    id: "4",
    title: "Selfoss",
    description: "This is Day 4's description",
    staysDestinationId: 34567,
    attractionLandingPages: [
      {
        id: "2",
        title: "Kerið",
        mainImage: {
          id: "23",
          caption: "kerið",
          handle: "adjgl23sfbzs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Kerið's description.",
      },
    ],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        title: "Selfoss",
        uniqueId: 34567,
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Selfoss's image caption",
        },
      },
    ],
  },
  {
    id: "5",
    title: "Reykjavik - Departure Day",
    description: "This is Day 5's description",
    staysDestinationId: 12345,
    attractionLandingPages: [],
    destinationLandingPages: [
      {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        title: "Reykjavik",
        uniqueId: 12345,
        mainImage: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          handle: "Z0lMEdE7RXSZRMSu1Nd9",
          caption: "This is Reykjavik's image caption",
        },
      },
    ],
  },
];

export const mockVPQueryResult = {
  tripId: "ISL-2DAYS-KEF-KEF",
  id: "19325791853",
  title: "Northern Lights Super Jeep Tour with a Photographer Guide & Transfer from Reykjavik",
  fromPrice: 20000,
  images: [],
  metadataUri:
    "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
  canonicalUrl:
    "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
  hreflangs: [
    {
      locale: "en",
      uri: "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
    },
    {
      locale: "pl",
      uri: "/pl/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
    },
  ],
  description:
    "Northern Lights Super Jeep Tour with a Photographer Guide & Transfer from Reykjavik. Bacon ipsum dolor amet biltong frankfurter tenderloin andouille shankle. Ball tip sirloin hamburger, turkey pig pork doner leberkas jowl pastrami boudin bresaola cow. Ham meatloaf jowl shoulder pork belly. T-bone sirloin jerky hamburger, landjaeger picanha strip steak pork turkey venison tail shank. Boudin picanha cow, ground round tenderloin tongue landjaeger ball tip. Chislic andouille buffalo, tenderloin burgdoggen rump bresaola venison sausage.",
  dayData: [
    {
      days: 2,
      nights: 1,
    },
  ],
  quickfactsList: {
    quickfacts: [
      {
        id: "StartsIn",
        quickfactId: "StartsIn",
        title: "Starts",
        name: { value: "Starts" },
        icon: {
          handle: "handle",
        },
      },
      {
        id: "EndsIn",
        quickfactId: "EndsIn",
        title: "Ends",
        name: { value: "Ends" },
        icon: {
          handle: "handle",
        },
      },
    ],
  },
  valuePropsList: {
    valueProps: [
      {
        title: "24/7 customer support",
        icon: {
          handle: "handle",
          svgAsString: "",
        },
      },
    ],
  },
  includedList: {
    includedItems: [
      {
        id: "",
        title: " ",
        icon: {
          handle: "handle",
        },
      },
    ],
  },
  destinations: [
    {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      title: "Nordland",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Nordland's image caption",
      },
    },
    {
      id: "Z0lMEdE7RXSZRMSu1Nd9",
      title: "Reykjavik",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Reykjavik's image caption",
      },
    },
  ],
  visitedPlaces: [
    {
      mainImage: undefined,
      images: [],
    },
    {
      mainImage: {
        id: "cleontzpp6z4f0bnmmq1bvj65",
        handle: "qhxBvvcaSDWB5Y4aL3m3",
        caption: "Photo of The Alcazar in Toledo in Spain by Javier Alamo",
        __typename: "GraphCMSAsset",
      },
      images: [],
    },
  ],
  vacationPackageAttractions: [
    {
      id: "2",
      title: "Hallgrímskirkja",
      mainImage: {
        id: "23",
        caption: "hallgrimskirkja",
        handle: "adjgl235zs",
      },
      location: {
        latitude: 64.922772,
        longitude: -18.257224,
      },
      reviewScore: 4,
      reviewCount: 123,
      description: "This is Hallgrímskirkja's description.",
    },
    {
      id: "3",
      title: "Gullfoss",
      mainImage: {
        id: "24",
        caption: "gullfoss",
        handle: "gkp235jog",
      },
      location: {
        latitude: 64.922773,
        longitude: -18.257235,
      },
      reviewScore: 4.5,
      reviewCount: 234,
      description: "This is Gullfoss' description.",
    },
  ],
  location: {
    latitude: 64.922772,
    longitude: -18.257224,
  },
  reviewCount: 250,
  reviewScore: 4.5,
  startPlace: {
    carId: "701,2",
    flightId: "airport:KEF",
    id: "ckshqcqugctxl0c68ffy69qfl",
    name: undefined,
    stayId: undefined,
  },
  endPlace: {
    carId: "701,2",
    flightId: "airport:KEF",
    id: "ckshqcqugctxl0c68ffy69qfl",
    name: undefined,
    stayId: undefined,
  },
  endsIn: "Keflavik",
  startsIn: "Keflavik",
  days: "2",
  vacationPackageDays: mockQueryVacationPackageDays,
};

export const mockVPDestinationsInfo = [
  {
    id: 12345,
    title: "Nordland",
    destination: {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      uniqueId: 12345,
      title: "Nordland",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Nordland's image caption",
      },
    },
    attractionLandingPages: [
      {
        id: "2",
        title: "Hallgrímskirkja",
        mainImage: {
          id: "23",
          caption: "hallgrimskirkja",
          handle: "adjgl235zs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Hallgrímskirkja's description.",
      },
      {
        id: "3",
        title: "Gullfoss",
        mainImage: {
          id: "24",
          caption: "gullfoss",
          handle: "gkp235jog",
        },
        location: {
          latitude: 64.922773,
          longitude: -18.257235,
        },
        reviewScore: 4.5,
        reviewCount: 234,
        description: "This is Gullfoss' description.",
      },
    ],
    numberOfNights: 2,
  },
];

export const mockVPDestinationsInfo2 = [
  {
    id: 12345,
    title: "Reykjavik",
    destination: {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      uniqueId: 12345,
      title: "Reykjavik",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Reykjavik's image caption",
      },
    },
    attractionLandingPages: [
      {
        id: "2",
        title: "Hallgrímskirkja",
        mainImage: {
          id: "23",
          caption: "hallgrimskirkja",
          handle: "adjgl235zs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Hallgrímskirkja's description.",
      },
      {
        id: "3",
        title: "Gullfoss",
        mainImage: {
          id: "24",
          caption: "gullfoss",
          handle: "gkp235jog",
        },
        location: {
          latitude: 64.922773,
          longitude: -18.257235,
        },
        reviewScore: 4.5,
        reviewCount: 234,
        description: "This is Gullfoss' description.",
      },
    ],
    numberOfNights: 2,
  },
  {
    id: 34567,
    title: "Selfoss",
    destination: {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      title: "Selfoss",
      uniqueId: 34567,
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Selfoss's image caption",
      },
    },
    attractionLandingPages: [
      {
        id: "2",
        title: "Seljalandsfoss",
        mainImage: {
          id: "23",
          caption: "seljalandsfoss",
          handle: "adjgl23sfbzs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Seljalandsfoss's description.",
      },
      {
        id: "2",
        title: "Kerið",
        mainImage: {
          id: "23",
          caption: "kerið",
          handle: "adjgl23sfbzs",
        },
        location: {
          latitude: 64.922772,
          longitude: -18.257224,
        },
        reviewScore: 4,
        reviewCount: 123,
        description: "This is Kerið's description.",
      },
    ],
    numberOfNights: 2,
  },
  {
    id: 12345,
    title: "Reykjavik",
    destination: {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      uniqueId: 12345,
      title: "Reykjavik",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "This is Reykjavik's image caption",
      },
    },
    attractionLandingPages: [],
    numberOfNights: 1,
  },
];

export const mockVPProduct = {
  title: "Northern Lights Super Jeep Tour with a Photographer Guide & Transfer from Reykjavik",
  fromPrice: 20000,
  tripId: "ISL-2DAYS-KEF-KEF",
  id: "19325791853",
  vacationPackageDestinations: [
    {
      info: {
        id: "ckx4ojhs0o35s0b13j80r1ezp",
        isClickable: true,
        isLargeIcon: true,
        title: "Nordland",
        image: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
          name: "This is Nordland's image caption",
        },
      },
      type: "destination",
      productSpecs: [],
    },
    {
      info: {
        id: "Z0lMEdE7RXSZRMSu1Nd9",
        isClickable: true,
        isLargeIcon: true,
        title: "Reykjavik",
        image: {
          id: "ckx4nt7sgb1n40b10fu2sumsh",
          url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
          name: "This is Reykjavik's image caption",
        },
      },
      productSpecs: [],
      type: "destination",
    },
  ],
  vacationPackageAttractions: [
    {
      info: {
        id: "2",
        title: "Hallgrímskirkja",
        description: "This is Hallgrímskirkja's description.",
        isClickable: true,
        isLargeIcon: true,
        image: {
          id: "23",
          url: `${gteImgixUrl}/adjgl235zs`,
          name: "hallgrimskirkja",
        },
      },
      productSpecs: [],
      type: "attraction",
    },
    {
      info: {
        id: "3",
        title: "Gullfoss",
        description: "This is Gullfoss' description.",
        isClickable: true,
        isLargeIcon: true,
        image: {
          id: "24",
          url: `${gteImgixUrl}/gkp235jog`,
          name: "gullfoss",
        },
      },
      type: "attraction",
      productSpecs: [],
    },
  ],
  vacationPackageDays: [
    {
      id: "1",
      region: "Reykjavik - Arrival Day",
      description: "This is Day 1's description",
      destinations: [
        {
          info: {
            id: "ckx4ojhs0o35s0b13j80r1ezp",
            isClickable: true,
            isLargeIcon: true,
            title: "Nordland",
            image: {
              id: "ckx4nt7sgb1n40b10fu2sumsh",
              url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
              name: "This is Nordland's image caption",
            },
          },
          type: "destination",
          productSpecs: [],
        },
      ],
      attractions: [
        {
          info: {
            id: "2",
            title: "Hallgrímskirkja",
            description: "This is Hallgrímskirkja's description.",
            isClickable: true,
            isLargeIcon: true,
            image: {
              id: "23",
              name: "hallgrimskirkja",
              url: `${gteImgixUrl}/adjgl235zs`,
            },
          },
          productSpecs: [],
          type: "attraction",
        },
      ],
      attractionsMapData: {
        isCountryMap: true,
        latitude: 64.922772,
        location: "Hallgrímskirkja",
        longitude: -18.257224,
        options: {
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        },
        points: [
          {
            id: 0,
            image: {
              id: "23",
              name: "hallgrimskirkja",
              url: "https://gte-gcms.imgix.net/adjgl235zs",
            },
            isGoogleReview: false,
            latitude: 64.922772,
            longitude: -18.257224,
            orm_name: "Hallgrímskirkja",
            reviewTotalCount: 123,
            reviewTotalScore: 4,
            title: "Hallgrímskirkja",
            type: "attraction",
          },
        ],
        zoom: 10,
      },
    },
    {
      id: "2",
      region: "Reykjavik",
      description: "This is Day 2's description",
      destinations: [
        {
          info: {
            id: "ckx4ojhs0o35s0b13j80r1ezp",
            isClickable: true,
            isLargeIcon: true,
            title: "Nordland",
            image: {
              id: "ckx4nt7sgb1n40b10fu2sumsh",
              url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
              name: "This is Nordland's image caption",
            },
          },
          type: "destination",
          productSpecs: [],
        },
      ],
      attractions: [
        {
          info: {
            id: "3",
            title: "Gullfoss",
            description: "This is Gullfoss' description.",
            isClickable: true,
            isLargeIcon: true,
            image: {
              id: "24",
              url: `${gteImgixUrl}/gkp235jog`,
              name: "gullfoss",
            },
          },
          type: "attraction",
          productSpecs: [],
        },
      ],
      attractionsMapData: {
        isCountryMap: true,
        latitude: 64.922773,
        location: "Gullfoss",
        longitude: -18.257235,
        options: {
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        },
        points: [
          {
            id: 0,
            image: {
              id: "24",
              name: "gullfoss",
              url: "https://gte-gcms.imgix.net/gkp235jog",
            },
            isGoogleReview: false,
            latitude: 64.922773,
            longitude: -18.257235,
            orm_name: "Gullfoss",
            reviewTotalCount: 234,
            reviewTotalScore: 4.5,
            title: "Gullfoss",
            type: "attraction",
          },
        ],
        zoom: 10,
      },
    },
  ],
  images: [
    {
      id: "cleontzpp6z4f0bnmmq1bvj65",
      name: "Photo of The Alcazar in Toledo in Spain by Javier Alamo",
      url: "https://gte-gcms.imgix.net/qhxBvvcaSDWB5Y4aL3m3",
    },
    {
      id: "23",
      name: "hallgrimskirkja",
      url: `${gteImgixUrl}/adjgl235zs`,
    },
    {
      id: "24",
      name: "gullfoss",
      url: `${gteImgixUrl}/gkp235jog`,
    },
    {
      id: "ckx4nt7sgb1n40b10fu2sumsh",
      name: "This is Nordland's image caption",
      url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
    },
    {
      id: "ckx4nt7sgb1n40b10fu2sumsh",
      name: "This is Reykjavik's image caption",
      url: `${gteImgixUrl}/Z0lMEdE7RXSZRMSu1Nd9`,
    },
  ],
  description:
    "Northern Lights Super Jeep Tour with a Photographer Guide & Transfer from Reykjavik. Bacon ipsum dolor amet biltong frankfurter tenderloin andouille shankle. Ball tip sirloin hamburger, turkey pig pork doner leberkas jowl pastrami boudin bresaola cow. Ham meatloaf jowl shoulder pork belly. T-bone sirloin jerky hamburger, landjaeger picanha strip steak pork turkey venison tail shank. Boudin picanha cow, ground round tenderloin tongue landjaeger ball tip. Chislic andouille buffalo, tenderloin burgdoggen rump bresaola venison sausage.",
  metadataUri:
    "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
  canonicalUrl:
    "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
  hreflangs: [
    {
      locale: "en",
      uri: "/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
    },
    {
      locale: "pl",
      uri: "/pl/iceland/best-vacation-packages/details/2-day-road-trip-in-iceland-with-days-in-reykjavik",
    },
  ],
  startPlace: {
    carId: "701,2",
    flightId: "airport:KEF",
    id: "ckshqcqugctxl0c68ffy69qfl",
  },
  endPlace: {
    carId: "701,2",
    flightId: "airport:KEF",
    id: "ckshqcqugctxl0c68ffy69qfl",
  },
  startsIn: "Keflavik",
  endsIn: "Keflavik",
  days: 2,
  nights: 1,
  includedList: [
    {
      id: "",
      title: " ",
      icon: {
        handle: "handle",
      },
    },
  ],
  vpDestinationsInfo: mockVPDestinationsInfo,
  mapData: {
    isCountryMap: true,
    latitude: 64.922772,
    location: "Hallgrímskirkja",
    longitude: -18.257224,
    options: {
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    },
    usePolyLine: false,
    points: [
      {
        id: 0,
        image: {
          id: "23",
          name: "hallgrimskirkja",
          url: `${gteImgixUrl}/adjgl235zs`,
        },
        isGoogleReview: false,
        latitude: 64.922772,
        longitude: -18.257224,
        orm_name: "Hallgrímskirkja",
        reviewTotalCount: 123,
        reviewTotalScore: 4,
        title: "Hallgrímskirkja",
        type: "attraction",
      },
      {
        id: 1,
        image: {
          id: "24",
          name: "gullfoss",
          url: `${gteImgixUrl}/gkp235jog`,
        },
        isGoogleReview: false,
        latitude: 64.922773,
        longitude: -18.257235,
        orm_name: "Gullfoss",
        reviewTotalCount: 234,
        reviewTotalScore: 4.5,
        title: "Gullfoss",
        type: "attraction",
      },
    ],
    zoom: 10,
  },
  productProps: [
    {
      title: "24/7 customer support",
      icon: {
        handle: "handle",
        svgAsString: "",
      },
    },
  ],
  productSpecs: [
    {
      id: "StartsIn",
      quickfactId: "StartsIn",
      title: "Starts",
      name: { value: "Starts" },
      icon: {
        handle: "handle",
      },
    },
    {
      id: "EndsIn",
      quickfactId: "EndsIn",
      title: "Ends",
      name: { value: "Ends" },
      icon: {
        handle: "handle",
      },
    },
  ],
  reviewScore: 4.5,
  reviewCount: 250,
};

export const mockDestinations = {
  destinations: [
    {
      id: "ckx4ojhs0o35s0b13j80r1ezp",
      title: "Nordland",
      description: "this is a description",
      type: "City",
      region: "Northern Norway",
      timezone: "GMT",
      size: "38154.6",
      population: 213,
      language: "Norwegian",
      lifeExpectancy: "73",
      yearlyVisitors: 123,
      website: "www.example.com",
      elevationAboveSea: "40",
      mainImage: {
        id: "ckx4nt7sgb1n40b10fu2sumsh",
        handle: "Z0lMEdE7RXSZRMSu1Nd9",
        caption: "this is a caption",
      },
      quickfactsList: {
        quickfacts: [
          {
            id: "ckx0f4ytku8ls0d55k121a2ug",
            title: "Type",
            name: {
              id: "ckx0f4sncu85h0d55fwlvflnq",
              value: "{type}",
            },
            icon: {
              id: "ckx0f3sdsu1ja0c54dgrolpc3",
              handle: "1BCuIfluScK5mJFEzjqo",
            },
          },
          {
            id: "ckx0fivlcv1ng0a1375nc1tji",
            title: "Country",
            name: {
              id: "ckx0firqg3cvo0b60eutwi92f",
              value: "{country}",
            },
            icon: {
              id: "ckx0fi8g0vlgw0c54zsr5t6fc",
              handle: "JIYOqD6QpOj9XarSzyMM",
            },
          },
          {
            id: "ckx0f6pbktqm30a13lgprd9r0",
            title: "Region",
            name: {
              id: "ckx0f6j5cucmm0c543lox9i9s",
              value: "{region}",
            },
            icon: {
              id: "ckx0f60moucio0d09eyanqgo9",
              handle: "Z4EIN8pT22WfguCsyhhI",
            },
          },
          {
            id: "ckx0fluugvf2r0a13734cy0dk",
            title: "Timezone",
            name: {
              id: "ckx0flqzk3q270b605mqiqe02",
              value: "{timezone}",
            },
            icon: {
              id: "ckx0fla0g3nx80b60vd1roorr",
              handle: "WqA5LP8nRoaVyzFXcfIG",
            },
          },
          {
            id: "ckx0ff4k8v7vm0c54o1wsgrb0",
            title: "Size",
            name: {
              id: "ckx0ff1h4va7f0d096g9c1ut3",
              value: "{size} km2",
            },
            icon: {
              id: "ckx0f8byotv1l0a139n41eejd",
              handle: "choMwcOJSsqtK2DIp2LL",
            },
          },
          {
            id: "ckx0fn5ww3wtf0b60avwcm2jw",
            title: "Population",
            name: {
              id: "ckx0fn2ts3wex0b60mkg6lhu4",
              value: "{population}",
            },
            icon: {
              id: "ckx0fmppkvj020a13hjdvgppy",
              handle: "8w4vyc8sTESCiO1sNG2B",
            },
          },
          {
            id: "ckx0fhc1cuuhg0a13ftqeqxpc",
            title: "Language",
            name: {
              id: "ckx0fh5v4vgqk0c543ir05ke7",
              value: "{language}",
            },
            icon: {
              id: "ckx0fgfmo32ic0b605p9rztzv",
              handle: "Tsu66tW8Tiq12ps6VxEq",
            },
          },
          {
            id: "ckx0fors844bf0b60vp40hx94",
            title: "Life Expectancy",
            name: {
              id: "ckx0foop4wev50c54jqvuc9iw",
              value: "{lifeExpectancy} Years",
            },
            icon: {
              id: "ckx0fnwx4vp1u0a13ftmmhp93",
              handle: "ZlHQG34pTue2N7p25ueY",
            },
          },
          {
            id: "ckx0fwwzswts60a13j3ts6dv0",
            title: "Yearly Visitors",
            name: {
              id: "ckx0fwtwowtas0a13zyundv65",
              value: "{yearlyVisitors}",
            },
            icon: {
              id: "ckx0hfbbs18q20a134uvpesln",
              handle: "i0t6jynIQWak5KYE0sRu",
            },
          },
          {
            id: "ckx0fxhtswwi10a13u90fn16s",
            title: "Website",
            name: {
              id: "ckx0fxfigww2m0a13s54zldeu",
              value: "{website}",
            },
            icon: {
              id: "ckx0hebu01ptg0c54gwsg8iv6",
              handle: "WeYdbuKrQhSI9DcCsLGy",
            },
          },
          {
            id: "ckx0fyvzcx2cr0a13xrilnfo3",
            title: "Elevation above sea",
            name: {
              id: "ckx0fyhbkx0kc0a1347k9h6nf",
              value: "{elevationAboveSea} Meters",
            },
            icon: {
              id: "ckx0hdq881pnr0d099f1xy6vv",
              handle: "PVz6Do9T6OFfe5BweiLp",
            },
          },
        ],
      },
    },
  ],
};

export const mockPassengers = [
  {
    id: 1,
    category: "adult" as FlightTypes.PassengerCategory,
    name: "john",
    surname: "johnsson",
    nationality: "AS",
    gender: undefined,
    birthday: {
      day: "5",
      month: "4",
      year: "1995",
    },
    passportno: "a1234j3",
    passportExpiration: {
      day: undefined,
      month: undefined,
      year: undefined,
    },
    noPassportExpiration: false,
    bags: {
      handBags: [
        {
          id: "HandBag-0",
          isIncluded: true,
          inputType: "radio" as FlightTypes.FlightExtraInputType,
          isSelected: false,
          price: 0,
          priorityAirlines: undefined,
          bagCombination: [
            {
              title: "Personal item",
              count: 1,
              category: "personal_item",
              highlights: [
                {
                  iconId: "personal_item",
                  title: "33 × 20 × 25 cm",
                },
                {
                  iconId: "weight",
                  title: "5 kg",
                },
              ],
            },
          ],
        },
        {
          id: "HandBag-1",
          isIncluded: false,
          inputType: "radio" as FlightTypes.FlightExtraInputType,
          isSelected: true,
          price: 98.26,
          priorityAirlines: ["Aer Lingus", "Ryanair"],
          bagCombination: [
            {
              title: "Personal item",
              count: 1,
              category: "personal_item",
              highlights: [
                {
                  iconId: "personal_item",
                  title: "33 × 20 × 25 cm",
                },
                {
                  iconId: "weight",
                  title: "5 kg",
                },
              ],
            },
            {
              title: "Cabin bag",
              count: 1,
              category: "cabin_bag",
              highlights: [
                {
                  iconId: "cabin_bag",
                  title: "55 × 20 × 40 cm",
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
          id: "NoCheckedBaggage",
          isIncluded: true,
          inputType: "radio" as FlightTypes.FlightExtraInputType,
          isSelected: false,
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
          inputType: "radio" as FlightTypes.FlightExtraInputType,
          isSelected: true,
          price: 128.66,
          priorityAirlines: undefined,
          bagCombination: [
            {
              title: "Checked bag",
              count: 1,
              category: "hold_bag",
              highlights: [
                {
                  iconId: "hold_bag",
                  title: "78 × 28 × 52 cm",
                },
                {
                  iconId: "weight",
                  title: "20 kg",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

export const mockSelectedBaggage = {
  includedCombination: [] as string[],
  paidCombination: [
    { category: BagType.PERSONAL_ITEM, count: 1 },
    { category: BagType.CABINBAG, count: 1 },
    { category: BagType.CARRYON, count: 1 },
  ],
};

export const mockCountedDuplicates = {
  personal_item: 1,
  cabin_bag: 1,
  hold_bag: 1,
};

export const mockSingleBag = {
  id: "HoldBag-0",
  isIncluded: false,
  inputType: "radio" as FlightTypes.FlightExtraInputType,
  isSelected: true,
  price: 128.66,
  bagCombination: [
    {
      title: "Checked bag",
      count: 1,
      category: "hold_bag",
      highlights: [
        {
          iconId: "hold_bag",
          title: "78 × 28 × 52 cm",
        },
        {
          iconId: "weight",
          title: "20 kg",
        },
      ],
    },
  ],
};

export const mock2xCheckedBag = {
  id: "HoldBag-1",
  isIncluded: false,
  inputType: "radio" as FlightTypes.FlightExtraInputType,
  isSelected: true,
  price: 455,
  priorityAirlines: undefined,
  bagCombination: [
    {
      title: "2x Checked bag",
      count: 2,
      category: "hold_bag",
      highlights: [
        {
          iconId: "hold_bag",
          title: "78 × 28 × 52 cm",
        },
        {
          iconId: "weight",
          title: "23 kg",
        },
      ],
    },
  ],
};

export const mock2xCheckedCombo = [{ count: 2, category: "hold_bag" }];

export const mockCombinationResult = [{ count: 1, category: "hold_bag" }];
