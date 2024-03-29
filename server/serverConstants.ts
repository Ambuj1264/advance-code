import type { FastifyReplyFromOptions } from "@fastify/reply-from";

export const langParam = ":lang(^zh_CN|^\\w{2})";

// 3 min timeout for proxy requests
export const FASTIFY_PROXY_TIMEOUT = 3 * 60 * 1000;

export const replyFromProxyOptions: FastifyReplyFromOptions = {
  undici: {
    bodyTimeout: FASTIFY_PROXY_TIMEOUT,
    headersTimeout: FASTIFY_PROXY_TIMEOUT,
  },
};

export const legacyCommonProxyRoutes = [
  `/${langParam}/pages/:slug`,
  "/pages/:slug",
  `/${langParam}/connect-with-locals/:slug(^(?!search).+)`,
  "/connect-with-locals/:slug(^(?!search).+)",
  `/${langParam}/connect-with-travel-bloggers/:slug(^(?!search).+)`,
  "/connect-with-travel-bloggers/:slug(^(?!search).+)",
  `/${langParam}/search`,
  "/search",
  "/login",
  "/logout",
  "/login/*",
  "/logout/*",
  "/review",
  "/voucher/:id/:slug",
  `/${langParam}/login`,
  `/${langParam}/logout`,
  `/${langParam}/login/*`,
  `/${langParam}/logout/*`,
  "/sitemap*",
];
export const legacyGTIMonolithProxyRoutes = [
  ...legacyCommonProxyRoutes,
  "/autocomplete/*",

  `/${langParam}/gallery`,
  "/gallery",
  `/${langParam}/gallery/:slug`,
  "/gallery/:slug",
  "/da/billeder-af-island",
  "/da/billeder-af-island/:slug",
  "/de/island-bilder",
  "/de/island-bilder/:slug",
  "/es/fotos-de-islandia",
  "/es/fotos-de-islandia/:slug",
  "/fr/photos-islande",
  "/fr/photos-islande/:slug",
  "/it/foto-islanda",
  "/it/foto-islanda/:slug",
  "/nl/fotos-van-ijsland",
  "/nl/fotos-van-ijsland/:slug",
  "/no/bilder-av-island",
  "/no/bilder-av-island/:slug",
  "/pl/zdjecia-z-islandii",
  "/pl/zdjecia-z-islandii/:slug",
  "/ru/fotografii-islandii",
  "/ru/fotografii-islandii/:slug",
  "/sv/bilder-pa-island",
  "/sv/bilder-pa-island/:slug",

  `/${langParam}/car-rentals`,
  "/car-rentals",
  `/${langParam}/car-rentals/*`,
  "/car-rentals/*",

  "/traveler-profiles/:slug",
  `/${langParam}/traveler-profiles/:slug`,
  "/da/rejsende-profiler/:slug",
  "/de/benutzerprofile/:slug",
  "/es/perfiles-viajeros/:slug",
  "/fr/profils-voyageurs/:slug",
  "/it/profilo-utenti/:slug",
  "/nl/reizigers-profielen/:slug",
  "/no/reisende-profiler/:slug",
  "/pl/poznaj-podroznikow-na-islandii/:slug",
  "/ru/profili-puteshestvennikov/:slug",
  "/sv/resenarsprofiler/:slug",

  `/${langParam}/tour-operator-tours-holidays`,
  "/tour-operator-tours-holidays",
  `/${langParam}/tour-operator-tours-holidays/*`,
  "/tour-operator-tours-holidays/*",
  "/da/tag-kontakt-til-lokale/:slug(^(?!search).+)",
  "/de/island-blog/:slug(^(?!search).+)",
  "/es/blogs-islandia/:slug(^(?!search).+)",
  "/fr/contactez-des-blogueurs-en-islande/:slug(^(?!search).+)",
  "/it/vivere-in-islanda/:slug(^(?!search).+)",
  "/nl/contact-leggen-met-locals/:slug(^(?!search).+)",
  "/no/kontakt-med-lokalkjente/:slug(^(?!search).+)",
  "/pl/poznaj-mieszkancow/:slug(^(?!search).+)",
  "/ru/sovety-mestnyh-zhitelej/:slug(^(?!search).+)",
  "/sv/kontakt-med-ortsbor/:slug(^(?!search).+)",
  "/da/tag-kontakt-til-rejsebloggere/:slug(^(?!search).+)",
  "/de/reise-blogger/:slug(^(?!search).+)",
  "/es/bloggers-viaje/:slug(^(?!search).+)",
  "/fr/contactez-des-voyageurs-en-islande/:slug(^(?!search).+)",
  "/nl/contact-leggen-met-reisbloggers/:slug(^(?!search).+)",
  "/no/kontakt-med-reisebloggere/:slug(^(?!search).+)",
  "/pl/blogerzy-podrozniczy/:slug(^(?!search).+)",
  "/ru/svjazatsja-s-trevel-bloggerami/:slug(^(?!search).+)",
  "/sv/kontakt-med-resebloggare/:slug(^(?!search).+)",

  "/iceland-travel-agent",
  "/da/island-rejsebureau",
  "/de/vertriebspartner",
  "/es/agencias-de-viajes-islandia",
  "/fr/agent-de-voyages-islande",
  "/it/iceland-travel-agent",
  "/ja/iceland-travel-agent",
  "/ko/iceland-travel-agent",
  "/nl/ijsland-reisagent",
  "/no/island-reisebyra",
  "/pl/agent-turystyczny",
  "/ru/turagent-po-islandii",
  "/sv/island-resebyra",
  "/th/iceland-travel-agent",

  "/partners",
  `/${langParam}/partners`,
  "/partners/*",
  `/${langParam}/partners/*`,
  "/markadstorg-ferdathjonustunnar",
];
export const legacyIPTMonolithProxyRoutes = [
  ...legacyCommonProxyRoutes,
  "/contact-us",
  "/de/kontakt",
  "/talk-to-locals",
  "/traveler-profiles",
  "/traveler-profiles/:slug",

  "/nature-photos-of-iceland/:slug?",
  "/de/fotos-von-island/:slug?",
  "/es/fotografias-naturaleza-islandia/:slug?",
  "/fr/photos-islande/:slug?",
  "/it/foto-dell-islanda/:slug?",
  "/ja/nature-photos-of-iceland/:slug?",
  "/ko/nature-photos-of-iceland/:slug?",
  "/ru/fotografii-islandii/:slug?",
  "/th/nature-photos-of-iceland/:slug?",
  "/zh_CN/nature-photos-of-iceland/:slug?",

  "/photo-guides/:slug",
  "/da/fotovejledninger/:slug",
  "/de/foto-guides/:slug",
  "/es/guias-fotografia/:slug",
  "/fi/valokuvaoppaat/:slug",
  "/fr/guides-photographes/:slug",
  "/it/contatta-i-travel-blogger/:slug",
  "/ja/photo-guides/:slug",
  "/ko/photo-guides/:slug",
  "/nl/fotogidsen/:slug",
  "/no/pfotoguider/:slug",
  "/ru/foto-gidy/:slug",
  "/sv/fotoguider/:slug",
  "/th/photo-guides/:slug",
  "/zh_CN/photo-guides/:slug",
];

export const legacyGTTPMonolithProxyRoutes = [
  ...legacyCommonProxyRoutes,
  "/gallery",
  "/gallery/:slug",
  `/establishments`,
  `/establishments/*`,
  "/family-trips",
  "/partners/*",
];

export const legacyNTGMonolithProxyRoutes = [
  ...legacyCommonProxyRoutes,
  "/traveler-profiles",
  "/traveler-profiles/:slug",
  "/accommodation",
  "/accommodation/*",
  "/partners",
  "/partners/*",
  "/api/Hotels_Locations",
  "/process/hotels/*",
];
