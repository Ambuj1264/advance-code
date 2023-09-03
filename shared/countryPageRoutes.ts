// www.figma.com/file/kb3NZ8Yeq9UmJPIy5WBR6A/6.2-Desktop-Attractions?node-id=109%3A1937

import { MarketplaceName } from "../types/enums";
import { getTranslatedRoutesFormatted } from "../utils/routerUtils";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const countries = [
  "latvia",
  "serbia",
  "switzerland",
  "svalbard-jan-mayen",
  "monaco",
  "estonia",
  "bulgaria",
  "germany",
  "france",
  "hungary",
  "faroe-islands",
  "albania",
  "malta",
  "luxembourg",
  "moldova",
  "turkey",
  "iceland",
  "norway",
  "ukraine",
  "croatia",
  "poland",
  "isle-of-man",
  "czechia",
  "cyprus",
  "austria",
  "bosnia-herzegovina",
  "greece",
  "the-united-kingdom",
  "italy",
  "denmark",
  "romania",
  "montenegro",
  "belarus",
  "kosovo",
  "ireland",
  "spain",
  "belgium",
  "guernsey",
  "portugal",
  "aland-islands",
  "slovenia",
  "finland",
  "jersey",
  "russia",
  "sweden",
  "greenland",
  "the-netherlands",
  "slovakia",
  "andorra",
  "republic-of-north-macedonia",
  "lithuania",
  "armenia",
  "georgia",
  "gibraltar",
  "san-marino",
  "liechtenstein",
  "wales",
  "scotland",
  "england",
  "northern-ireland",
];

const addCountryPageRoutes = (router: RouterClass) =>
  router.add({
    name: ROUTE_NAMES.GTE_COUNTRY_PAGE,
    pattern: `/(${getTranslatedRoutesFormatted(countries)})`,
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
  });

export default addCountryPageRoutes;
