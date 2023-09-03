import { gteImgixUrl } from "utils/imageUtils";
import CameraIcon from "components/icons/camera-1.svg";

export const mockImages = [
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
];

export const tgQueryRes: TravelGuideTypes.SingleDestinationContent = {
  id: "ckx4ojhs0o35s0b13j80r1ezp",
  title: "Mock Reykjavik",
  breadcrumbs: [
    {
      title: "Europe",
      metadataUri: "/",
    },
  ],
  description:
    "Reykjavik, with an area of 274.5 square kilometers, is the capital and largest city of Iceland. The city is known for its many famous attractions such as the great Hallgrimskirkja Church and the captivating Harpa Concert Hall and Conference Center.\n\nReykjavik was founded in 1786. The city of Reykjavik is now home to around 128,000 people with Dagur B. Eggertson as the head of government. The official language of the city of Reykjavik is Icelandic.\n\nReykjavik observes the UTC±00:00 time zone and sits 8 meters above sea level. \n\nThe average temperature in January in the city of Reykjavik is 31 degrees Fahrenheit (-1 degrees Celsius), while the average temperature in July is 55 degrees Fahrenheit (13 degrees Celsius). \n\nReykjavik is the perfect base for a memorable and unique vacation in Iceland. Travelers visiting the amazing Thingvellir National Park, Blue Lagoon, or The Perlan Museum often choose to stay in the city of Reykjavik.\n\nReykjavik is about 50 miles (80 kilometers) from the Keflavik International Airport. The nearest airport, the Reykjavik Domestic Airport, is about 2 miles (3 kilometers) from the city center.\n \nGet ready to explore and learn more about the city of Reykjavik below!",
  location: {
    latitude: 64.14142739736616,
    longitude: -21.93562119677889,
  },
  type: "City",
  country: "Norway",
  place: {
    id: "ckpmqrceofk3n0b088ia5peo4",
    name: {
      id: "ckqb302qwkbbi0d56snmmefia",
      value: "Reykjavik",
    },
    country: {
      id: "ckpmqrav4fk8r0b16sg4gylxd",
      name: {
        id: "ckp59g6rc578a0a63vvqnvcb6",
        value: "Iceland",
      },
      alpha2Code: "IS",
    },
    countries: [
      {
        id: "ckpmqrav4fk8r0b16sg4gylxd",
        name: {
          id: "ckp59g6rc578a0a63vvqnvcb6",
          value: "Iceland",
        },
        alpha2Code: "IS",
      },
    ],
    flightId: "city:REK",
    carId: "1171,1",
    stayId: "2580605",
    tourId: "905",
  },
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
          value: "{size}",
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
          value: "{elevationAboveSea}",
        },
        icon: {
          id: "ckx0hdq881pnr0d099f1xy6vv",
          handle: "PVz6Do9T6OFfe5BweiLp",
        },
      },
    ],
  },
  valuePropsList: {
    valueProps: [
      {
        id: "cknoektm805330b15d1eppy59",
        title: "24/7 customer support",
        icon: {
          id: "ckng3sluoqwka0b0778eg3yuy",
          handle: "qubNhV0zQXyiQjgpIrhB",
          svgAsString:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">\n<path d="M14.3,13.5c-0.4-0.4-0.9-0.6-1.5-0.6c-0.6,0-1.1,0.2-1.5,0.6L11,13.8C9.3,12.3,7.7,10.7,6.2,9l0.3-0.3\n\tc0.8-0.8,0.8-2.1,0-2.9L4.8,3.9c-0.8-0.8-2.1-0.8-2.9,0l-1,1c-1,1-1.1,2.5-0.4,3.7c2.9,4.3,6.6,8.1,11,11c1.2,0.7,2.7,0.6,3.7-0.4\n\tl1-1c0.8-0.8,0.8-2.1,0-2.9L14.3,13.5z M14.4,4.7c0-2.6,2.1-4.7,4.7-4.7c0.2,0,0.4,0.1,0.6,0.2C19.9,0.4,20,0.6,20,0.8v6.2\n\tc0,0.5-0.4,0.8-0.8,0.8c-0.5,0-0.8-0.4-0.8-0.8V6.4h-3.1c-0.5,0-0.8-0.4-0.8-0.8V4.7z M16.1,4.7h2.2V1.8C17,2.2,16.1,3.3,16.1,4.7z\n\t M9.4,3.6c0.5,0,0.8-0.4,0.8-0.8c0-0.6,0.4-1.1,1-1.1c0.6-0.1,1.1,0.3,1.2,0.9c0.1,0.6,0,0.7-0.8,1.4L8.8,6.5\n\tC8.6,6.7,8.5,7.1,8.6,7.4c0.1,0.3,0.4,0.5,0.8,0.5h4.3c0.5,0,0.8-0.4,0.8-0.8s-0.4-0.8-0.8-0.8h-2.1l1.2-1c0.8-0.7,1.6-1.4,1.3-3\n\tc-0.3-1.4-1.6-2.4-3-2.2C9.6,0.2,8.6,1.4,8.6,2.8C8.6,3.3,8.9,3.6,9.4,3.6z"/>\n</svg>\n',
        },
      },
      {
        id: "cknolojmw08jb0c14ywfd3323",
        title: "European travel experts",
        icon: {
          id: "cknoli3ds08g20b65kvkssxix",
          handle: "TYE13ZScRk2FcF3Erhp3",
          svgAsString:
            '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="8" cy="8" r="8" />\n  <path d="M8.66723 6.92792C8.49495 7.30536 8.33654 7.62493 8.16974 7.99097C8.41486 8.36376 8.84965 8.7945 9.11604 9.15455C9.43084 9.57995 9.58909 10.08 9.67724 10.6442C9.73739 11.3425 9.78007 11.9029 9.82397 12.5433C9.84002 12.7732 9.61204 12.9718 9.41589 12.9974C9.23194 13.0215 8.89711 12.8718 8.86008 12.6507C8.73333 11.8946 8.61592 11.1366 8.47655 10.3834C8.4472 10.2252 8.36517 10.0587 8.26394 9.93997C7.87973 9.48789 7.49031 9.03895 7.07798 8.61805C6.78279 8.31706 6.72531 7.978 6.82613 7.58048C6.86002 7.44632 6.8954 7.30887 6.95384 7.1864C7.21446 6.63988 7.477 6.09397 7.75408 5.55734C7.84119 5.38856 7.90147 5.29652 8.02602 5.15607C8.15057 5.01581 8.33057 4.96907 8.50495 5.05295C8.63715 5.11624 8.71825 5.18335 8.82167 5.25381C8.9705 5.35513 9.11014 5.48761 9.16679 5.67438C9.29271 6.08953 9.37749 6.301 9.57484 6.70538C9.62861 6.86097 9.9102 7.09183 10.0563 7.15613C10.3472 7.28489 10.4838 7.30817 10.771 7.44622C11.0055 7.55896 11.0371 7.80184 10.9677 8.0336C10.8982 8.26537 10.6202 8.29719 10.4756 8.26579C10.0555 8.17453 9.9099 8.11857 9.57484 7.99097C9.45947 7.94704 9.12922 7.67281 9.06146 7.58048C8.8985 7.35803 8.82731 7.17884 8.66723 6.92792Z" fill="white"/>\n  <path d="M6.02045 8.4738C5.95777 8.46765 5.90235 8.46241 5.85777 8.45791C5.89892 8.22602 5.93842 8.00493 5.97958 7.77394C5.89714 7.74411 5.83939 7.72312 5.77835 7.70094C5.6431 7.96266 5.51265 8.21508 5.37493 8.48144C5.30374 8.44247 5.24901 8.41264 5.21143 8.39241C5.35011 8.15092 5.48645 7.91334 5.62883 7.66496C5.56244 7.63094 5.53199 7.614 5.50058 7.59961C5.05656 7.39785 4.94532 7.27029 5.02268 6.63324C5.08043 6.15732 5.30169 5.7496 5.54571 5.35898C5.59152 5.28553 5.64749 5.21882 5.68782 5.14238C5.94995 4.64593 6.37407 4.44597 6.86528 4.36862C6.90849 4.36187 6.95938 4.36442 6.99833 4.38346C7.23124 4.49633 7.46169 4.6155 7.70928 4.74096C6.80204 5.80072 6.27806 7.05279 6.02045 8.4738Z" fill="white"/>\n  <path d="M6.88643 8.99316C7.15611 9.28306 7.41453 9.55527 7.66473 9.83632C7.69491 9.8699 7.70259 9.95639 7.68668 10.0053C7.58886 10.3977 7.5341 10.7378 7.39432 11.1063C7.3518 11.2189 7.19227 11.5234 7.08399 11.6428C6.59764 12.1794 6.28571 12.4021 5.80095 12.8576C5.63031 13.0177 5.28539 12.9505 5.15028 12.786C5.01613 12.6223 4.92488 12.2306 5.08536 12.0587C5.44612 11.6715 5.74937 11.4068 6.11452 11.0246C6.26321 10.8695 6.36138 10.7189 6.4519 10.512C6.66416 10.027 6.7457 9.62827 6.84075 9.17739C6.85228 9.12342 6.86709 9.07081 6.88643 8.99316Z" fill="white"/>\n  <path d="M8.48446 3.97689C8.49083 3.42841 8.90666 2.98956 9.40941 3.00019C9.92408 3.01137 10.3245 3.46673 10.3131 4.02859C10.3015 4.58294 9.8969 5.00566 9.38424 4.99851C8.86186 4.99118 8.47791 4.55507 8.48446 3.97689Z" fill="white"/>\n</svg>\n',
        },
      },
      {
        id: "cknom0xmg08po0c14ai4t6u98",
        title: "Verified quality services",
        icon: {
          id: "cknolt04o08lz0b15s8o28a14",
          handle: "f76Gf1D6QR2MH6zJeM3j",
          svgAsString:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25"><path fill-rule="evenodd" d="M0 12.7a12 12 0 1124 0 12 12 0 01-24 0zm15.43.86l2.79-2.48a.5.5 0 00-.34-.88h-3.3a.5.5 0 01-.47-.3l-1.65-3.84a.5.5 0 00-.92 0L9.9 9.9a.5.5 0 01-.46.3H6.12a.5.5 0 00-.34.88l2.8 2.48a.5.5 0 01.12.57l-1.63 3.75a.5.5 0 00.7.64l3.99-2.25a.5.5 0 01.49 0l3.98 2.25a.5.5 0 00.7-.64l-1.63-3.75a.5.5 0 01.13-.57z" clip-rule="evenodd"/></svg>\n',
        },
      },
      {
        id: "cl43xl3e0gmk50blbfi8cv5tx",
        title: "All the best experiences",
        icon: {
          id: "cknom7q8009cd0b65umx9lb8p",
          handle: "BdUNCK4lTw2B7i0jqjzn",
          svgAsString:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.756 12.174a2.749 2.749 0 00-2.63-3.551h-5.58a1.249 1.249 0 01-1.127-1.788l1.428-2.993a2.425 2.425 0 00-.42-2.308 2.464 2.464 0 00-3.926.132l-4.89 6.928a1.253 1.253 0 01-1.021.529.464.464 0 00-.464.464V20.9a.5.5 0 00.282.45c3.7 1.792 4.929 2.029 7.942 2.029.347 0 2.32-.02 3.041-.02 2.68 0 4.463-1.555 5.456-4.779l1.9-6.369zM3.626 9.123H3.6a1.5 1.5 0 00-1.474-1.25h-1.5a.5.5 0 00-.5.5v14a.5.5 0 00.5.5h1.5a1.5 1.5 0 001.5-1.5z"/></svg>',
        },
      },
    ],
  },
  sections: [
    {
      id: "cl6f6vm2kmpnt0bmbeno7yi51",
      image: undefined,
      title: "Top Services in Reykjavik",
      description:
        "Enjoy a stress-free vacation in Iceland and the city of Reykjavik. Plan every detail of the trip and book flights, hotels, and more, in one place. Find all the best travel services available in Iceland and the city of Reykjavik here. \n\nGet expertly curated and fully-customizable itinerary recommendations to experience Iceland and the city of Reykjavik your way. Also, immediately get answers to questions and concerns about any of the available routes and services offered in the city of Reykjavik and from our local experts. Our customer support is available to you 24/7. \n\nCheck out 8 vacation packages and 78 tours in the city of Reykjavik. Find cheap and popular flights from 28 airlines that fly to Iceland. Also, compare the rates and services of 5 types of places to stay, 22 car rental companies, and more.\n",
      compositeId: "sec1",
      sectionType: "DestinationTravelGuideSection_1",
      subSections: [],
    },
    {
      id: "cl6wh1ql3gvbb0bmf8swb7u3t",
      image: undefined,
      title: "Learn More about Iceland",
      description:
        "There are many reasons to visit the city of Reykjavik, but there are plenty more reasons to come to Iceland.\n\nExploring Iceland, which spans 103 square kilometers, is the adventure of a lifetime. As the home country of many world-famous attractions like the spectacular Blue Lagoon, Jokulsarlon Glacier Lagoon, and the Reynisfjara Black Sand Beach, Iceland is truly a place of natural beauty and scenic sites worth discovering.\n\nClick or tap on the link below to discover more about what Iceland offers.",
      compositeId: "sec2",
      sectionType: "DestinationTravelGuideSection_2",
      subSections: [],
    },
    {
      id: "cl6whh7obe5nh0bmkm4ghhv4s",
      image: undefined,
      title: "What to See in Reykjavik",
      description:
        "Reykjavik has something for everyone. Regardless of age and interest, people can surely have the best time exploring every corner of the city of Reykjavik.\n\nRead on to find out the best places to visit and what to expect in the city of Reykjavik.",
      compositeId: "sec3",
      sectionType: "DestinationTravelGuideSection_3",
      subSections: [
        {
          id: "cl6whh7obe5ni0bmk4o2ubjo0",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_4",
          title: "Top Attractions in Reykjavik",
          description:
            "You’ll have the opportunity to stop by the incredible Hallgrimskirkja Church when visiting the city of Reykjavik. Hallgrimskirkja is one of the top sites to see in the city of Reykjavik and all of Iceland.\n\nThis remarkable attraction is located at Hallgrimstorg 101, 101 Reykjavík, and is open for visitors at 9:00.\n\nGet more information about what people can do and see at this impressive attraction. Also, learn more about other must-see places in the city of Reykjavik such as the incredible Solfar Sun Voyager, Laugavegur Street, Perlan Museum, and more below.",
          compositeId: "sec3.1",
          sectionParentType: "DestinationTravelGuideSection_3",
        },
        {
          id: "cl74wbkq2a9xq0aldg99tagd5",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_5",
          title: "Map of Attractions",
          description:
            "Use this map to check out the locations of the different attractions in the city of Reykjavik.",
          compositeId: "sec3.2",
          sectionParentType: "DestinationTravelGuideSection_3",
        },
      ],
    },
    {
      id: "cl76a6spodj130cl8aekgut2v",
      image: undefined,
      title: "Things to do in Reykjavik",
      description:
        "One of the best reasons to visit the city of Reykjavik is that people can have plenty of things to do, no matter the circumstance.\n\nWhale watching, for example, is a popular activity in Reykjavik. Tours for a fascinating whale-watching experience are available in the city from January to December.\n\nAnother great experience in the city of Reykjavik is the Whales of Iceland Museum. The museum is open from 10:00 to 17:00.\n\nDiscover the most popular experiences in the city of Reykjavik and Iceland below.",
      compositeId: "sec6",
      sectionType: "DestinationTravelGuideSection_6",
      subSections: [
        {
          id: "cl79hfol2yy0k0bl0pagvmjub",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_7",
          title: "Most Popular Experiences in Reykjavik",
          description:
            "Traveling is all about gaining new experiences. You can have that and more in the city of Reykjavik and Iceland, whether you're staying a few days or longer. \n\nFeel free to browse our website to learn more about the most recommended activities and experiences in the city of Reykjavik and all of Iceland. \n",
          compositeId: "sec7",
          sectionParentType: "DestinationTravelGuideSection_6",
        },
        {
          id: "cl7ahifm2bys30cjr8vsqg1y4",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_8",
          title: "Top Tours & Tickets Starting in Reykjavik",
          description:
            "Taking a city sightseeing tour is an absolute must when visiting the city of Reykjavik. Among the 13 types of tours offered in the city of Reykjavik, travelers consider sightseeing tours as a must-have experience. \n\nA great example is the VIP CityWalk Tour. The tour is about 3 hours. Guests taking this tour get the chance to see several top attractions in the city. These include the Parliament Building, The Harpa Concert Hall and Conference Center, Lake Tjornin, etc.\n\nFind out more using the tool below. Search for top-rated tours in the city of Reykjavik and Iceland.",
          compositeId: "sec8",
          sectionParentType: "DestinationTravelGuideSection_6",
        },
        {
          id: "cl7hm6p5kok0l0bnqmhtiio01",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_9",
          title: "Search for Things to do in Reykjavik",
          description:
            "You can choose the adventure that’s right for you from the 61 available tours in the city of Reykjavik. Use the Experiences Search tool below to get personalized recommendations in an instant.\n\nEnter the preferred date or dates of exploring the city and select the number of travelers. Then, click or tap on the Search button to get instant suggestions.",
          compositeId: "sec9",
          sectionParentType: "DestinationTravelGuideSection_6",
        },
      ],
    },
    {
      id: "cl7kc46nyvnei0cnq02qzfknl",
      image: {
        id: "cknq6z71cc6ju0c1437clcktt",
        handle: "rJXZhc75RGKfdgIrfsD2",
        caption: "Hallgrimskirkja church in Reykjavik during sunset",
      },
      title: "Vacation Packages in Reykjavik",
      description:
        "Travelers will find 23 fantastic vacation packages in Iceland to choose from on our website. A lot of these top-selling vacation packages give travelers the unique opportunity to see many of the best places to visit in Iceland, including the city of Reykjavik.\n\nThe following sections serve as a guide to the best, most recommended, and even cheapest vacation packages that start in the city of Reykjavik. Learn about their prices, duration, ratings, and more below.",
      compositeId: "sec10",
      sectionType: "DestinationTravelGuideSection_10",
      subSections: [
        {
          id: "cl7kccl77vlvb0cl39rbe7cdt",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_11",
          title: "Popular Types of Vacations in Reykjavik",
          description:
            "Selecting a vacation package that suits your needs and budget is the key to having the most enjoyable holiday in {DestinationName}, or any other destination. To help you with choosing, here are the most popular vacation packages in {DestinationName} for every traveler:\n\nFor the avid traveler, locals and experienced travelers recommend vacation packages  in {DestinationName} that allow you to see the following incredible sights: . You should also choose one that lets you explore the wonderful. \n\nIf these attractions are in your travel bucket list, a 7-day vacation package is for you[, such as this 7-Day Iceland Road Trip from Reykjavik to Grindavíkurbær, Borgarbyggð, Rangárþing eystra & Mýrdalshreppur].\n\nIf you’re budget-conscious, consider traveling to the city of Reykjavik in november when vacation package prices are usually the cheapest. By doing so, you’ll have the opportunity to visit the beautiful.\n",
          compositeId: "sec11",
          sectionParentType: "DestinationTravelGuideSection_10",
        },
        {
          id: "cl7kccl78vlvc0cl3cvo3wi8q",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_12",
          title: "Top Vacation Packages in Reykjavik",
          description:
            "For an epic vacation, take a fun road trip from the city of Reykjavik to other top places to visit in Iceland. You can choose from the eight highest-rating vacation packages that start in the city of Reykjavik.\n\nOne excellent example of the best vacation packages that start in {DestinationName} is a 10-day trip that takes travelers to fabulous places such as {Best10DayCityCitiesList}. \n\nThis vacation package provides guests with tons of opportunities to visit not only the most popular attractions in {DestinationName} but also many of {Country}’s top destinations and places to visit. Some include the majestic {Best10DayCityAttractionList}.",
          compositeId: "sec12",
          sectionParentType: "DestinationTravelGuideSection_10",
        },
        {
          id: "cl7kcftvxvmbi0cl3221l6xxm",
          image: undefined,
          sectionType: "DestinationTravelGuideSection_13",
          title: "Find Vacation Packages in Reykjavik",
          description:
            "Compare 8 top-rated vacation packages in the city of Reykjavik. Or, check out all the available vacation packages in Iceland.\n\nUse the Vacations Search tool below to search for vacation packages available on specific dates. For bigger savings, also search for available flights.",
          compositeId: "sec13",
          sectionParentType: "DestinationTravelGuideSection_10",
        },
      ],
    },
  ],
  attractions: [
    {
      id: "ckuiezk94ssei0b57hgyh6v4a",
      title: "Perlan - Wonders of Iceland",
      mainImage: undefined,
      location: {
        latitude: 64.129218,
        longitude: -21.918741,
      },
      reviewScore: 0,
      reviewCount: 0,
    },
    {
      id: "ckv0vw5ugkps30b151pqfitgs",
      title: "Lækjartorg",
      mainImage: {
        id: "ckx93k140l6g60b059a64pibp",
        handle: "bRFIFKSJSESqcipGgCoY",
        caption: "Lækjartorg, Reykjavik, Capital Region, Iceland",
      },
      location: {
        latitude: 64.14756260000001,
        longitude: -21.9365012,
      },
      reviewScore: 0,
      reviewCount: 0,
    },
  ],
};

export const constructedRes = {
  id: "ckx4ojhs0o35s0b13j80r1ezp",
  breadCrumbs: [{ name: "Europe", url: "/" }],
  place: {
    id: "ckpmqrceofk3n0b088ia5peo4",
    name: {
      id: "ckqb302qwkbbi0d56snmmefia",
      value: "Reykjavik",
    },
    country: {
      id: "ckpmqrav4fk8r0b16sg4gylxd",
      name: {
        id: "ckp59g6rc578a0a63vvqnvcb6",
        value: "Iceland",
      },
      alpha2Code: "IS",
    },
    countries: [
      {
        id: "ckpmqrav4fk8r0b16sg4gylxd",
        name: {
          id: "ckp59g6rc578a0a63vvqnvcb6",
          value: "Iceland",
        },
        alpha2Code: "IS",
      },
    ],
    flightId: "city:REK",
    carId: "1171,1",
    stayId: "2580605",
    tourId: "905",
  },
  images: [],
  title: "Mock Reykjavik",
  description:
    "Reykjavik, with an area of 274.5 square kilometers, is the capital and largest city of Iceland. The city is known for its many famous attractions such as the great Hallgrimskirkja Church and the captivating Harpa Concert Hall and Conference Center.\n\nReykjavik was founded in 1786. The city of Reykjavik is now home to around 128,000 people with Dagur B. Eggertson as the head of government. The official language of the city of Reykjavik is Icelandic.\n\nReykjavik observes the UTC±00:00 time zone and sits 8 meters above sea level. \n\nThe average temperature in January in the city of Reykjavik is 31 degrees Fahrenheit (-1 degrees Celsius), while the average temperature in July is 55 degrees Fahrenheit (13 degrees Celsius). \n\nReykjavik is the perfect base for a memorable and unique vacation in Iceland. Travelers visiting the amazing Thingvellir National Park, Blue Lagoon, or The Perlan Museum often choose to stay in the city of Reykjavik.\n\nReykjavik is about 50 miles (80 kilometers) from the Keflavik International Airport. The nearest airport, the Reykjavik Domestic Airport, is about 2 miles (3 kilometers) from the city center.\n \nGet ready to explore and learn more about the city of Reykjavik below!",
  mainImage: {
    id: "ckx4nt7sgb1n40b10fu2sumsh",
    handle: "Z0lMEdE7RXSZRMSu1Nd9",
    caption: "this is a caption",
  },
  valueProps: [
    {
      id: "cknoektm805330b15d1eppy59",
      title: "24/7 customer support",
      icon: {
        id: "ckng3sluoqwka0b0778eg3yuy",
        handle: "qubNhV0zQXyiQjgpIrhB",
        svgAsString:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">\n<path d="M14.3,13.5c-0.4-0.4-0.9-0.6-1.5-0.6c-0.6,0-1.1,0.2-1.5,0.6L11,13.8C9.3,12.3,7.7,10.7,6.2,9l0.3-0.3\n\tc0.8-0.8,0.8-2.1,0-2.9L4.8,3.9c-0.8-0.8-2.1-0.8-2.9,0l-1,1c-1,1-1.1,2.5-0.4,3.7c2.9,4.3,6.6,8.1,11,11c1.2,0.7,2.7,0.6,3.7-0.4\n\tl1-1c0.8-0.8,0.8-2.1,0-2.9L14.3,13.5z M14.4,4.7c0-2.6,2.1-4.7,4.7-4.7c0.2,0,0.4,0.1,0.6,0.2C19.9,0.4,20,0.6,20,0.8v6.2\n\tc0,0.5-0.4,0.8-0.8,0.8c-0.5,0-0.8-0.4-0.8-0.8V6.4h-3.1c-0.5,0-0.8-0.4-0.8-0.8V4.7z M16.1,4.7h2.2V1.8C17,2.2,16.1,3.3,16.1,4.7z\n\t M9.4,3.6c0.5,0,0.8-0.4,0.8-0.8c0-0.6,0.4-1.1,1-1.1c0.6-0.1,1.1,0.3,1.2,0.9c0.1,0.6,0,0.7-0.8,1.4L8.8,6.5\n\tC8.6,6.7,8.5,7.1,8.6,7.4c0.1,0.3,0.4,0.5,0.8,0.5h4.3c0.5,0,0.8-0.4,0.8-0.8s-0.4-0.8-0.8-0.8h-2.1l1.2-1c0.8-0.7,1.6-1.4,1.3-3\n\tc-0.3-1.4-1.6-2.4-3-2.2C9.6,0.2,8.6,1.4,8.6,2.8C8.6,3.3,8.9,3.6,9.4,3.6z"/>\n</svg>\n',
      },
    },
    {
      id: "cknolojmw08jb0c14ywfd3323",
      title: "European travel experts",
      icon: {
        id: "cknoli3ds08g20b65kvkssxix",
        handle: "TYE13ZScRk2FcF3Erhp3",
        svgAsString:
          '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="8" cy="8" r="8" />\n  <path d="M8.66723 6.92792C8.49495 7.30536 8.33654 7.62493 8.16974 7.99097C8.41486 8.36376 8.84965 8.7945 9.11604 9.15455C9.43084 9.57995 9.58909 10.08 9.67724 10.6442C9.73739 11.3425 9.78007 11.9029 9.82397 12.5433C9.84002 12.7732 9.61204 12.9718 9.41589 12.9974C9.23194 13.0215 8.89711 12.8718 8.86008 12.6507C8.73333 11.8946 8.61592 11.1366 8.47655 10.3834C8.4472 10.2252 8.36517 10.0587 8.26394 9.93997C7.87973 9.48789 7.49031 9.03895 7.07798 8.61805C6.78279 8.31706 6.72531 7.978 6.82613 7.58048C6.86002 7.44632 6.8954 7.30887 6.95384 7.1864C7.21446 6.63988 7.477 6.09397 7.75408 5.55734C7.84119 5.38856 7.90147 5.29652 8.02602 5.15607C8.15057 5.01581 8.33057 4.96907 8.50495 5.05295C8.63715 5.11624 8.71825 5.18335 8.82167 5.25381C8.9705 5.35513 9.11014 5.48761 9.16679 5.67438C9.29271 6.08953 9.37749 6.301 9.57484 6.70538C9.62861 6.86097 9.9102 7.09183 10.0563 7.15613C10.3472 7.28489 10.4838 7.30817 10.771 7.44622C11.0055 7.55896 11.0371 7.80184 10.9677 8.0336C10.8982 8.26537 10.6202 8.29719 10.4756 8.26579C10.0555 8.17453 9.9099 8.11857 9.57484 7.99097C9.45947 7.94704 9.12922 7.67281 9.06146 7.58048C8.8985 7.35803 8.82731 7.17884 8.66723 6.92792Z" fill="white"/>\n  <path d="M6.02045 8.4738C5.95777 8.46765 5.90235 8.46241 5.85777 8.45791C5.89892 8.22602 5.93842 8.00493 5.97958 7.77394C5.89714 7.74411 5.83939 7.72312 5.77835 7.70094C5.6431 7.96266 5.51265 8.21508 5.37493 8.48144C5.30374 8.44247 5.24901 8.41264 5.21143 8.39241C5.35011 8.15092 5.48645 7.91334 5.62883 7.66496C5.56244 7.63094 5.53199 7.614 5.50058 7.59961C5.05656 7.39785 4.94532 7.27029 5.02268 6.63324C5.08043 6.15732 5.30169 5.7496 5.54571 5.35898C5.59152 5.28553 5.64749 5.21882 5.68782 5.14238C5.94995 4.64593 6.37407 4.44597 6.86528 4.36862C6.90849 4.36187 6.95938 4.36442 6.99833 4.38346C7.23124 4.49633 7.46169 4.6155 7.70928 4.74096C6.80204 5.80072 6.27806 7.05279 6.02045 8.4738Z" fill="white"/>\n  <path d="M6.88643 8.99316C7.15611 9.28306 7.41453 9.55527 7.66473 9.83632C7.69491 9.8699 7.70259 9.95639 7.68668 10.0053C7.58886 10.3977 7.5341 10.7378 7.39432 11.1063C7.3518 11.2189 7.19227 11.5234 7.08399 11.6428C6.59764 12.1794 6.28571 12.4021 5.80095 12.8576C5.63031 13.0177 5.28539 12.9505 5.15028 12.786C5.01613 12.6223 4.92488 12.2306 5.08536 12.0587C5.44612 11.6715 5.74937 11.4068 6.11452 11.0246C6.26321 10.8695 6.36138 10.7189 6.4519 10.512C6.66416 10.027 6.7457 9.62827 6.84075 9.17739C6.85228 9.12342 6.86709 9.07081 6.88643 8.99316Z" fill="white"/>\n  <path d="M8.48446 3.97689C8.49083 3.42841 8.90666 2.98956 9.40941 3.00019C9.92408 3.01137 10.3245 3.46673 10.3131 4.02859C10.3015 4.58294 9.8969 5.00566 9.38424 4.99851C8.86186 4.99118 8.47791 4.55507 8.48446 3.97689Z" fill="white"/>\n</svg>\n',
      },
    },
    {
      id: "cknom0xmg08po0c14ai4t6u98",
      title: "Verified quality services",
      icon: {
        id: "cknolt04o08lz0b15s8o28a14",
        handle: "f76Gf1D6QR2MH6zJeM3j",
        svgAsString:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25"><path fill-rule="evenodd" d="M0 12.7a12 12 0 1124 0 12 12 0 01-24 0zm15.43.86l2.79-2.48a.5.5 0 00-.34-.88h-3.3a.5.5 0 01-.47-.3l-1.65-3.84a.5.5 0 00-.92 0L9.9 9.9a.5.5 0 01-.46.3H6.12a.5.5 0 00-.34.88l2.8 2.48a.5.5 0 01.12.57l-1.63 3.75a.5.5 0 00.7.64l3.99-2.25a.5.5 0 01.49 0l3.98 2.25a.5.5 0 00.7-.64l-1.63-3.75a.5.5 0 01.13-.57z" clip-rule="evenodd"/></svg>\n',
      },
    },
    {
      id: "cl43xl3e0gmk50blbfi8cv5tx",
      title: "All the best experiences",
      icon: {
        id: "cknom7q8009cd0b65umx9lb8p",
        handle: "BdUNCK4lTw2B7i0jqjzn",
        svgAsString:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.756 12.174a2.749 2.749 0 00-2.63-3.551h-5.58a1.249 1.249 0 01-1.127-1.788l1.428-2.993a2.425 2.425 0 00-.42-2.308 2.464 2.464 0 00-3.926.132l-4.89 6.928a1.253 1.253 0 01-1.021.529.464.464 0 00-.464.464V20.9a.5.5 0 00.282.45c3.7 1.792 4.929 2.029 7.942 2.029.347 0 2.32-.02 3.041-.02 2.68 0 4.463-1.555 5.456-4.779l1.9-6.369zM3.626 9.123H3.6a1.5 1.5 0 00-1.474-1.25h-1.5a.5.5 0 00-.5.5v14a.5.5 0 00.5.5h1.5a1.5 1.5 0 001.5-1.5z"/></svg>',
      },
    },
  ],
  sections: [
    {
      id: "cl6f6vm2kmpnt0bmbeno7yi51",
      sectionType: "DestinationTravelGuideSection_1",
      title: "Top Services in Reykjavik",
      description:
        "Enjoy a stress-free vacation in Iceland and the city of Reykjavik. Plan every detail of the trip and book flights, hotels, and more, in one place. Find all the best travel services available in Iceland and the city of Reykjavik here. \n\nGet expertly curated and fully-customizable itinerary recommendations to experience Iceland and the city of Reykjavik your way. Also, immediately get answers to questions and concerns about any of the available routes and services offered in the city of Reykjavik and from our local experts. Our customer support is available to you 24/7. \n\nCheck out 8 vacation packages and 78 tours in the city of Reykjavik. Find cheap and popular flights from 28 airlines that fly to Iceland. Also, compare the rates and services of 5 types of places to stay, 22 car rental companies, and more.\n",
      image: undefined,
      level: 0,
    },
    {
      id: "cl6wh1ql3gvbb0bmf8swb7u3t",
      sectionType: "DestinationTravelGuideSection_2",
      title: "Learn More about Iceland",
      description:
        "There are many reasons to visit the city of Reykjavik, but there are plenty more reasons to come to Iceland.\n\nExploring Iceland, which spans 103 square kilometers, is the adventure of a lifetime. As the home country of many world-famous attractions like the spectacular Blue Lagoon, Jokulsarlon Glacier Lagoon, and the Reynisfjara Black Sand Beach, Iceland is truly a place of natural beauty and scenic sites worth discovering.\n\nClick or tap on the link below to discover more about what Iceland offers.",
      image: undefined,
      level: 0,
    },
    {
      id: "cl6whh7obe5nh0bmkm4ghhv4s",
      sectionType: "DestinationTravelGuideSection_3",
      title: "What to See in Reykjavik",
      description:
        "Reykjavik has something for everyone. Regardless of age and interest, people can surely have the best time exploring every corner of the city of Reykjavik.\n\nRead on to find out the best places to visit and what to expect in the city of Reykjavik.",
      image: undefined,
      level: 0,
    },
    {
      id: "cl6whh7obe5ni0bmk4o2ubjo0",
      sectionType: "DestinationTravelGuideSection_4",
      title: "Top Attractions in Reykjavik",
      description:
        "You’ll have the opportunity to stop by the incredible Hallgrimskirkja Church when visiting the city of Reykjavik. Hallgrimskirkja is one of the top sites to see in the city of Reykjavik and all of Iceland.\n\nThis remarkable attraction is located at Hallgrimstorg 101, 101 Reykjavík, and is open for visitors at 9:00.\n\nGet more information about what people can do and see at this impressive attraction. Also, learn more about other must-see places in the city of Reykjavik such as the incredible Solfar Sun Voyager, Laugavegur Street, Perlan Museum, and more below.",
      image: undefined,
      level: 1,
    },
    {
      id: "cl74wbkq2a9xq0aldg99tagd5",
      sectionType: "DestinationTravelGuideSection_5",
      title: "Map of Attractions",
      description:
        "Use this map to check out the locations of the different attractions in the city of Reykjavik.",
      image: undefined,
      level: 1,
    },
    {
      id: "cl76a6spodj130cl8aekgut2v",
      sectionType: "DestinationTravelGuideSection_6",
      title: "Things to do in Reykjavik",
      description:
        "One of the best reasons to visit the city of Reykjavik is that people can have plenty of things to do, no matter the circumstance.\n\nWhale watching, for example, is a popular activity in Reykjavik. Tours for a fascinating whale-watching experience are available in the city from January to December.\n\nAnother great experience in the city of Reykjavik is the Whales of Iceland Museum. The museum is open from 10:00 to 17:00.\n\nDiscover the most popular experiences in the city of Reykjavik and Iceland below.",
      image: undefined,
      level: 0,
    },
    {
      id: "cl79hfol2yy0k0bl0pagvmjub",
      sectionType: "DestinationTravelGuideSection_7",
      title: "Most Popular Experiences in Reykjavik",
      description:
        "Traveling is all about gaining new experiences. You can have that and more in the city of Reykjavik and Iceland, whether you're staying a few days or longer. \n\nFeel free to browse our website to learn more about the most recommended activities and experiences in the city of Reykjavik and all of Iceland. \n",
      image: undefined,
      level: 1,
    },
    {
      id: "cl7ahifm2bys30cjr8vsqg1y4",
      sectionType: "DestinationTravelGuideSection_8",
      title: "Top Tours & Tickets Starting in Reykjavik",
      description:
        "Taking a city sightseeing tour is an absolute must when visiting the city of Reykjavik. Among the 13 types of tours offered in the city of Reykjavik, travelers consider sightseeing tours as a must-have experience. \n\nA great example is the VIP CityWalk Tour. The tour is about 3 hours. Guests taking this tour get the chance to see several top attractions in the city. These include the Parliament Building, The Harpa Concert Hall and Conference Center, Lake Tjornin, etc.\n\nFind out more using the tool below. Search for top-rated tours in the city of Reykjavik and Iceland.",
      image: undefined,
      level: 1,
    },
    {
      id: "cl7hm6p5kok0l0bnqmhtiio01",
      sectionType: "DestinationTravelGuideSection_9",
      title: "Search for Things to do in Reykjavik",
      description:
        "You can choose the adventure that’s right for you from the 61 available tours in the city of Reykjavik. Use the Experiences Search tool below to get personalized recommendations in an instant.\n\nEnter the preferred date or dates of exploring the city and select the number of travelers. Then, click or tap on the Search button to get instant suggestions.",
      image: undefined,
      level: 1,
    },
    {
      id: "cl7kc46nyvnei0cnq02qzfknl",
      sectionType: "DestinationTravelGuideSection_10",
      title: "Vacation Packages in Reykjavik",
      description:
        "Travelers will find 23 fantastic vacation packages in Iceland to choose from on our website. A lot of these top-selling vacation packages give travelers the unique opportunity to see many of the best places to visit in Iceland, including the city of Reykjavik.\n\nThe following sections serve as a guide to the best, most recommended, and even cheapest vacation packages that start in the city of Reykjavik. Learn about their prices, duration, ratings, and more below.",
      image: undefined,
      level: 0,
    },
    {
      id: "cl7kccl77vlvb0cl39rbe7cdt",
      sectionType: "DestinationTravelGuideSection_11",
      title: "Popular Types of Vacations in Reykjavik",
      description:
        "Selecting a vacation package that suits your needs and budget is the key to having the most enjoyable holiday in {DestinationName}, or any other destination. To help you with choosing, here are the most popular vacation packages in {DestinationName} for every traveler:\n\nFor the avid traveler, locals and experienced travelers recommend vacation packages  in {DestinationName} that allow you to see the following incredible sights: . You should also choose one that lets you explore the wonderful. \n\nIf these attractions are in your travel bucket list, a 7-day vacation package is for you[, such as this 7-Day Iceland Road Trip from Reykjavik to Grindavíkurbær, Borgarbyggð, Rangárþing eystra & Mýrdalshreppur].\n\nIf you’re budget-conscious, consider traveling to the city of Reykjavik in november when vacation package prices are usually the cheapest. By doing so, you’ll have the opportunity to visit the beautiful.\n",
      image: undefined,
      level: 1,
    },
    {
      id: "cl7kccl78vlvc0cl3cvo3wi8q",
      sectionType: "DestinationTravelGuideSection_12",
      title: "Top Vacation Packages in Reykjavik",
      description:
        "For an epic vacation, take a fun road trip from the city of Reykjavik to other top places to visit in Iceland. You can choose from the eight highest-rating vacation packages that start in the city of Reykjavik.\n\nOne excellent example of the best vacation packages that start in {DestinationName} is a 10-day trip that takes travelers to fabulous places such as {Best10DayCityCitiesList}. \n\nThis vacation package provides guests with tons of opportunities to visit not only the most popular attractions in {DestinationName} but also many of {Country}’s top destinations and places to visit. Some include the majestic {Best10DayCityAttractionList}.",
      image: undefined,
      level: 1,
    },
    {
      id: "cl7kcftvxvmbi0cl3221l6xxm",
      sectionType: "DestinationTravelGuideSection_13",
      title: "Find Vacation Packages in Reykjavik",
      description:
        "Compare 8 top-rated vacation packages in the city of Reykjavik. Or, check out all the available vacation packages in Iceland.\n\nUse the Vacations Search tool below to search for vacation packages available on specific dates. For bigger savings, also search for available flights.",
      image: undefined,
      level: 1,
    },
  ],
  attractions: [
    {
      info: {
        id: "ckuiezk94ssei0b57hgyh6v4a",
        Icon: CameraIcon,
        description: undefined,
        title: "Perlan - Wonders of Iceland",
        isClickable: false,
        image: undefined,
        isLargeIcon: true,
      },
      type: "attraction",
      productSpecs: [],
    },
    {
      info: {
        id: "ckv0vw5ugkps30b151pqfitgs",
        Icon: CameraIcon,
        description: undefined,
        title: "Lækjartorg",
        isClickable: true,
        image: {
          id: "ckx93k140l6g60b059a64pibp",
          url: "https://gte-gcms.imgix.net/bRFIFKSJSESqcipGgCoY",
          name: "Lækjartorg, Reykjavik, Capital Region, Iceland",
        },
        isLargeIcon: true,
      },
      type: "attraction",
      productSpecs: [],
    },
  ],
  mapData: {
    latitude: 64.129218,
    longitude: -21.918741,
    location: "Perlan - Wonders of Iceland",
    zoom: 10,
    points: [
      {
        id: 0,
        type: "attraction",
        latitude: 64.129218,
        longitude: -21.918741,
        orm_name: "Perlan - Wonders of Iceland",
        title: "Perlan - Wonders of Iceland",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        image: {
          id: "V7VDnCT5RCGFAwvG2Mmq",
          url: "https://gte-gcms.imgix.net/V7VDnCT5RCGFAwvG2Mmq",
          name: "vacation-packages",
        },
        isGoogleReview: false,
      },
      {
        id: 1,
        type: "attraction",
        latitude: 64.14756260000001,
        longitude: -21.9365012,
        orm_name: "Lækjartorg",
        reviewTotalCount: 0,
        reviewTotalScore: 0,
        title: "Lækjartorg",
        image: {
          id: "ckx93k140l6g60b059a64pibp",
          url: "https://gte-gcms.imgix.net/bRFIFKSJSESqcipGgCoY",
          name: "Lækjartorg, Reykjavik, Capital Region, Iceland",
        },
        isGoogleReview: false,
      },
    ],
    options: {
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    },
    isCountryMap: true,
  },
  destinationSpecs: [],
  tableOfContents: [
    {
      caption: "Introduction to {title}",
      level: 0,
      link: "#tgd-intro-section",
      prefix: "",
      imgUrl: "",
    },
    {
      caption: "Top Services in Reykjavik",
      elementId: "DestinationTravelGuideSection_1",
      level: 0,
      link: "#cl6f6vm2kmpnt0bmbeno7yi51",
      prefix: "0",
      imgUrl: "",
    },
    {
      caption: "Learn More about Iceland",
      elementId: "DestinationTravelGuideSection_2",
      level: 0,
      link: "#cl6wh1ql3gvbb0bmf8swb7u3t",
      prefix: "1",
      imgUrl: "",
    },
    {
      caption: "What to See in Reykjavik",
      elementId: "DestinationTravelGuideSection_3",
      level: 0,
      link: "#cl6whh7obe5nh0bmkm4ghhv4s",
      prefix: "2",
      imgUrl: "",
    },
    {
      caption: "Top Attractions in Reykjavik",
      elementId: "DestinationTravelGuideSection_4",
      level: 1,
      link: "#cl6whh7obe5ni0bmk4o2ubjo0",
      prefix: "3",
      imgUrl: "",
    },
    {
      caption: "Map of Attractions",
      elementId: "DestinationTravelGuideSection_5",
      level: 1,
      link: "#cl74wbkq2a9xq0aldg99tagd5",
      prefix: "4",
      imgUrl: "",
    },
    {
      caption: "Things to do in Reykjavik",
      elementId: "DestinationTravelGuideSection_6",
      level: 0,
      link: "#cl76a6spodj130cl8aekgut2v",
      prefix: "5",
      imgUrl: "",
    },
    {
      caption: "Most Popular Experiences in Reykjavik",
      elementId: "DestinationTravelGuideSection_7",
      level: 1,
      link: "#cl79hfol2yy0k0bl0pagvmjub",
      prefix: "6",
      imgUrl: "",
    },
    {
      caption: "Top Tours & Tickets Starting in Reykjavik",
      elementId: "DestinationTravelGuideSection_8",
      level: 1,
      link: "#cl7ahifm2bys30cjr8vsqg1y4",
      prefix: "7",
      imgUrl: "",
    },
    {
      caption: "Search for Things to do in Reykjavik",
      elementId: "DestinationTravelGuideSection_9",
      level: 1,
      link: "#cl7hm6p5kok0l0bnqmhtiio01",
      prefix: "8",
      imgUrl: "",
    },
    {
      caption: "Vacation Packages in Reykjavik",
      elementId: "DestinationTravelGuideSection_10",
      level: 0,
      link: "#cl7kc46nyvnei0cnq02qzfknl",
      prefix: "9",
      imgUrl: "",
    },
    {
      caption: "Popular Types of Vacations in Reykjavik",
      elementId: "DestinationTravelGuideSection_11",
      level: 1,
      link: "#cl7kccl77vlvb0cl39rbe7cdt",
      prefix: "10",
      imgUrl: "",
    },
    {
      caption: "Top Vacation Packages in Reykjavik",
      elementId: "DestinationTravelGuideSection_12",
      level: 1,
      link: "#cl7kccl78vlvc0cl3cvo3wi8q",
      prefix: "11",
      imgUrl: "",
    },
    {
      caption: "Find Vacation Packages in Reykjavik",
      elementId: "DestinationTravelGuideSection_13",
      level: 1,
      link: "#cl7kcftvxvmbi0cl3221l6xxm",
      prefix: "12",
      imgUrl: "",
    },
  ],
};

export const mockOrigin = {
  id: "ckpwla8ww02rx0b49igha7w0u",
  mainImage: undefined,
  fromName: {
    id: "ckpwl940o01qt0b499pe6wce1",
    value: "from Boston",
  },
  name: {
    id: "ckpwl940o2w5q0b55fbut4ndu",
    value: "Boston",
  },
  inName: undefined,
  toName: {
    id: "ckpwl940o01p00b11gk9fra5c",
    value: "to Boston",
  },
  continentGroup: [],
  continentGroupOrder: [],
  flag: undefined,
  countries: [
    {
      id: "ckpmqw3pcftvv0b08tf3rkkzp",
      flag: {
        id: "ckp5aniy056v10b51jynkkjik",
        handle: "C8WDsw1QKq2j2UOyLzdQ",
      },
      name: {
        id: "ckp5acrlk57bj0b64r4fod0fj",
        value: "the United States",
      },
      inName: {
        id: "ckq9pd3q85vtz0b561bfzda3u",
        value: "in United States",
      },
      toName: {
        id: "ckq9pd2yg5w6c0c52ervzapi0",
        value: "to United States",
      },
      isMainCountry: true,
      mainImage: undefined,
    },
  ],
};

export const mockDestination = {
  id: "ckpmqrceofk3n0b088ia5peo4",
  mainImage: {
    id: "cknq6rvx4c6fj0c14wuuwrti6",
    handle: "IV6C5slsRmKAB0vlJ5zm",
    caption:
      "Reykjavik at dusk. Hallgrimskirkja church dominates the skyline and snowcapped mount Esja the background",
  },
  fromName: {
    id: "ckpmlqx1cecm80b08llbxu623",
    value: "from Reykjavik",
  },
  name: {
    id: "ckqb302qwkbbi0d56snmmefia",
    value: "Reykjavik",
  },
  inName: undefined,
  toName: {
    id: "ckpmlqx1ceckt0b08nb4tvki3",
    value: "to Reykjavik",
  },
  continentGroup: [3, 5],
  continentGroupOrder: [3, 8],
  flag: undefined,
  countries: [
    {
      id: "ckpmqrav4fk8r0b16sg4gylxd",
      flag: {
        id: "ckp5amhwo56sf0b51zwe2rhc0",
        handle: "xHh6JK03TeS2o5HPJBlg",
      },
      name: {
        id: "ckp59g6rc578a0a63vvqnvcb6",
        value: "Iceland",
      },
      inName: {
        id: "ckpmlqw9kec740b10idfacj21",
        value: "in Iceland",
      },
      toName: {
        id: "ckpmlqw9kec7b0b10mhz430kc",
        value: "to Iceland",
      },
      isMainCountry: true,
      mainImage: {
        id: "cknehyqbkjfx40b12v51a8ljz",
        handle: "RMfOtfgTCChJZS0E79Yz",
        caption: "Iceland Godafoss from above",
      },
    },
  ],
};

export const mockFlightTitle = {
  title: "{originCity} {toDestinationCity}",
  smallTitle: undefined,
};

export const mockGeneralTitleInput = {
  subType: {
    id: "cku76iyxc74ta0d0935om6dla",
    subtype: "Cottage",
    name: {
      value: "Cottage",
    },
    pluralName: {
      value: "Cottages",
    },
    parentSubType: undefined,
    typeImage: {
      id: "ckvl04xg05fzg0b56yum0tpkf",
      handle: "HKJkS2KR1WFfFP0pxcd9",
      caption: "Cottage image",
    },
  },
  title: "Cottages in the city of Reykjavik origin",
  origin: undefined,
  destination: mockDestination,
  activeLocale: undefined,
  splitTitle: undefined,
};

export const mockGeneralTitle = { smallTitle: "", title: "Cottages" };

export const mockHotelSectioncard = {
  id: "ckw5e6q5clfeh0a60oqc4fgl2",
  destination: {
    id: "ckpmqrceofk3n0b088ia5peo4",
    mainImage: {
      id: "cknq6rvx4c6fj0c14wuuwrti6",
      handle: "IV6C5slsRmKAB0vlJ5zm",
      caption:
        "Reykjavik at dusk. Hallgrimskirkja church dominates the skyline and snowcapped mount Esja the background",
    },
    fromName: {
      id: "ckpmlqx1cecm80b08llbxu623",
      value: "from Reykjavik",
    },
    name: {
      id: "ckqb302qwkbbi0d56snmmefia",
      value: "Reykjavik",
    },
    inName: undefined,
    toName: {
      id: "ckpmlqx1ceckt0b08nb4tvki3",
      value: "to Reykjavik",
    },
    continentGroup: [3, 5],
    continentGroupOrder: [3, 8],
    flag: undefined,
    countries: [
      {
        id: "ckpmqrav4fk8r0b16sg4gylxd",
        flag: {
          id: "ckp5amhwo56sf0b51zwe2rhc0",
          handle: "xHh6JK03TeS2o5HPJBlg",
        },
        name: {
          id: "ckp59g6rc578a0a63vvqnvcb6",
          value: "Iceland",
        },
        inName: {
          id: "ckpmlqw9kec740b10idfacj21",
          value: "in Iceland",
        },
        toName: {
          id: "ckpmlqw9kec7b0b10mhz430kc",
          value: "to Iceland",
        },
        isMainCountry: true,
        mainImage: {
          id: "cknehyqbkjfx40b12v51a8ljz",
          handle: "RMfOtfgTCChJZS0E79Yz",
          caption: "Iceland Godafoss from above",
        },
      },
    ],
  },
  origin: undefined,
  title: "Hotels & places to stay in the city of Reykjavik",
  image: undefined,
  slug: undefined,
  pageType: "Stays",
  pageVariation: "InCity",
  metadataUri: "/iceland/best-hotels-and-places-to-stay/in-reykjavik",
  subType: {
    id: "ckuy4vcig0te60c67ldfdpyz2",
    subtype: "StaysTopLevel",
    name: {
      value: "hotel",
    },
    pluralName: {
      value: "hotels",
    },
    parentSubType: undefined,
    typeImage: undefined,
  },
};

export const mockConstructedHotelCard = {
  id: "ckw5e6q5clfeh0a60oqc4fgl2",
  originFlag: undefined,
  destinationFlag: {
    alt: "Iceland",
    height: 16,
    id: "ckp5amhwo56sf0b51zwe2rhc0",
    name: "Iceland",
    url: "https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/xHh6JK03TeS2o5HPJBlg",
    width: 24,
  },
  image: {
    id: "ckvl0xoxs6qyq0b61iianjk55",
    name: "stay",
    url: "https://gte-gcms.imgix.net/t2NQlNGASw29a2qIN0Qs",
  },
  placeImage: {
    id: "cknq6rvx4c6fj0c14wuuwrti6",
    name: "Hotels & places to stay in the city of Reykjavik",
    url: "https://gte-gcms.imgix.net/IV6C5slsRmKAB0vlJ5zm",
  },
  staticMap: {
    id: "ckvl0xoxs6qyq0b61iianjk55",
    name: "stay",
    url: "https://gte-gcms.imgix.net/t2NQlNGASw29a2qIN0Qs",
  },
  metadataUri: "/iceland/best-hotels-and-places-to-stay/in-reykjavik",
  pageType: "Stays",
  slug: undefined,
  smallTitle: "",
  subTypeImage: undefined,
  title: "hotels",
};
