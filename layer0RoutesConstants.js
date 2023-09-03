const { getBackendName } = require("./utils/layer0RoutesAdditionalUtils");

const GTIHost = "guidetoiceland.is";
const GTIStagingHost = "staging.guidetoiceland.is";
const GTEHost = "guidetoeurope.com";
const GTEStagingHost = "staging.guidetoeurope.com";
const GTTPHost = "guidetothephilippines.ph";
const IPTHost = "iceland-photo-tours.com";
const NTGHost = "norwaytravelguide.no";

const legacyGTIProxyName = getBackendName(GTIHost);
const legacyGTIStagingProxyName = getBackendName(GTIStagingHost);
const legacyGTEProxyName = getBackendName(GTEHost);
const legacyGTEStagingProxyName = getBackendName(GTEStagingHost);
const legacyGTTPProxyName = getBackendName(GTTPHost);
const legacyIPTProxyName = getBackendName(IPTHost);
const legacyNTGProxyName = getBackendName(NTGHost);

const routeFilename = `${process.env.ROUTER_FILENAME || "layer0GTIRoutes"}.ts`;

const HostToOriginMap = {
  "guidetoiceland.is": "origin.guidetoiceland.is",
  "www.guidetoiceland.is": "origin.guidetoiceland.is",
  "cn.guidetoiceland.is": "origin.guidetoiceland.is",
  "guidetoeurope.com": "origin.guidetoeurope.com",
  "www.guidetoeurope.com": "origin.guidetoeurope.com",
  "guidetothephilippines.ph": "origin.guidetothephilippines.ph",
  "iceland-photo-tours.com": "origin.iceland-photo-tours.com",
  "norwaytravelguide.no": "origin.norwaytravelguide.no",
  "staging.guidetoiceland.is": "origin.staging.guidetoiceland.is",
  "staging.guidetoeurope.com": "origin.staging.guidetoeurope.com",
};

const localePathsToSkip = ["/:lang/:category/:slug", "/:category/:slug"];

const cachedMonolithPages = [
  "/:lang?/gallery",
  "/:lang?/gallery/:slug",
  "/:lang?/pages/:slug",
  "/:lang?/connect-with-locals/:slug",
  "/:lang?/connect-with-travel-bloggers/:slug",
  "/:lang?/car-rentals",
  "/:lang?/car-rentals/:slug",
  "/:lang?/car-rentals/iceland-car-rentals/:slug",
  "/:lang?/tour-operator-tours-holidays",
  "/:lang?/tour-operator-tours-holidays/:slug",
  "/:lang?/search",
  "/da/tag-kontakt-til-lokale/:slug",
  "/de/island-blog/:slug",
  "/es/blogs-islandia/:slug",
  "/fr/contactez-des-blogueurs-en-islande/:slug",
  "/it/vivere-in-islanda/:slug",
  "/nl/contact-leggen-met-locals/:slug",
  "/no/kontakt-med-lokalkjente/:slug",
  "/pl/poznaj-mieszkancow/:slug",
  "/ru/sovety-mestnyh-zhitelej/:slug",
  "/sv/kontakt-med-ortsbor/:slug",
  "/da/tag-kontakt-til-rejsebloggere/:slug",
  "/de/reise-blogger/:slug",
  "/es/bloggers-viaje/:slug",
  "/fr/contactez-des-voyageurs-en-islande/:slug",
  "/nl/contact-leggen-met-reisbloggers/:slug",
  "/no/kontakt-med-reisebloggere/:slug",
  "/pl/blogerzy-podrozniczy/:slug",
  "/ru/svjazatsja-s-trevel-bloggerami/:slug",
  "/sv/kontakt-med-resebloggare/:slug",
];

module.exports = {
  GTIHost,
  GTEHost,
  GTTPHost,
  IPTHost,
  NTGHost,
  legacyGTIProxyName,
  legacyGTIStagingProxyName,
  legacyGTEProxyName,
  legacyGTEStagingProxyName,
  legacyGTTPProxyName,
  legacyIPTProxyName,
  legacyNTGProxyName,
  HostToOriginMap,
  localePathsToSkip,
  cachedMonolithPages,
  routeFilename,
};
