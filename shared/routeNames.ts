/**
 * be aware:
 * when you add a new route to the router,
 * sometimes you might skip the "page" parameter.
 * In this case, the "page" paramer will default to the route name.
 * That's why some of the route names here are referencing to the nextjs page names
 */
export enum ROUTE_NAMES {
  INDEX = "index",
  CART = "cart",
  MOBILE_PAYMENT = "payment",
  VOUCHER = "voucher",
  PAYMENT_REDIRECT = "paymentRedirect",
  PREVIEW = "preview",
  GTE_FRONT_PAGE = "gteFrontPage",
  PAYMENT_LINK = "paymentLink",
  PAYMENT_LINK_PAYMENT = "paymentLinkPayment",
  PAYMENT_RECEIPT = "paymentReceipt",

  // flight routes
  FLIGHT = "flight",
  FLIGHTPAGE_WITH_SLUG = "flightPageWithSlug",
  FLIGHTPAGE_COUNTRY = "flightPageCountry",
  FLIGHTPAGE_COUNTRY_WITH_SLUG = "flightPageCountryWithSlug",
  FLIGHTSEARCH = "flightSearch",
  GTE_FLIGHTSEARCH_WITH_SLUG = "gteFlightSearchWithSlug",
  FLIGHTSEARCH_COUNTRY = "flightSearchCountry",
  FLIGHTSEARCH_COUNTRY_WITH_SLUG = "flightSearchCountryWithSlug",

  // tour routes
  TOURSEARCH_LEGACY = "tourSearchLegacy",
  TOURCATEGORY_LEGACY = "tourCategoryLegacy",
  TOURCATEGORY = "tourCategory",
  TOUR_LEGACY = "tour-legacy",
  TOUR = "tour",
  GTE_TOURSEARCH = "gteTourSearch",
  GTE_TOURSEARCH_WITH_SLUG = "gteTourSearchWithSlug",
  GTE_TOURSEARCH_COUNTRY = "gteTourSearchCountry",
  GTE_TOURSEARCH_COUNTRY_WITH_SLUG = "gteTourSearchCountryWithSlug",
  GTE_TOUR = "gteTour",

  // accomodation routes
  ACCOMMODATION = "accommodationProduct",
  ACCOMMODATION_SEARCH = "accommodationSearch",
  ACCOMMODATION_CATEGORY = "accommodationCategory",
  GTE_STAYSSEARCH = "gteStaysSearch",
  GTE_STAYSSEARCH_WITH_SLUG = "gteStaysSearchWithSlug",
  GTE_STAYSSEARCH_COUNTRY = "gteStaysSearchCountry",
  GTE_STAYSSEARCH_COUNTRY_WITH_SLUG = "gteStaysSearchCountryWithSlug",
  GTE_STAY = "gteStay",

  // car routes
  CAR = "car",
  GTI_LEGACY_CAR = "gtiLegacyCar",
  GTE_CAR_PRODUCT = "gteCarProduct",
  GTE_CAR_PRODUCT_WITH_SLUG = "gteCarProductWithSlug",
  GTE_CAR_PRODUCT_COUNTRY = "gteCarProductCountry",
  GTE_CAR_PRODUCT_COUNTRY_WITH_SLUG = "gteCarProductCountryWithSlug",
  CARSEARCH = "carSearch",
  CAR_CATEGORY = "carCategory",
  GTE_CARSEARCH = "gteCarSearch",
  GTE_CARSEARCH_WITH_SLUG = "gteCarSearchWithSlug",
  GTE_CARSEARCH_COUNTRY = "gteCarSearchCountry",
  GTE_CARSEARCH_COUNTRY_WITH_SLUG = "gteCarSearchCountryWithSlug",

  // blog
  BLOG = "blog",
  TRAVELCOMMUNITY = "travel",
  LOCALCOMMUNITY = "local",
  BLOGGERSEARCH = "bloggerSearch",
  BLOG_IPT = "blogIPT",
  LOCALCOMMUNITY_IPT = "localIPT",
  BLOGGERSEARCH_IPT = "bloggerSearchIPT",

  // attraction
  ATTRACTION = "attraction",
  BEST_PLACES = "bestPlaces",

  // article
  ARTICLECATEGORY_LEGACY = "article-category-legacy",
  ARTICLECATEGORY = "articleCategory",
  ARTICLESEARCH = "articleSearch",
  ARTICLE_LEGACY_NOT_TRANSLATED = "article-legacy-not-translated",
  ARTICLE = "article",

  // country routes
  GTE_COUNTRY_PAGE = "gteCountryPage",

  // trip planner
  TRIPPLANNER = "tripPlanner",

  // GTE vacation package
  GTE_VACATION_PACKAGE = "gteVacationPackage",
  GTE_VACATION_PACKAGES_LANDING_COUNTRY_WITH_SLUG = "gteVacationPackagesLandingCountryWithSlug",
  GTE_VACATION_PACKAGES_LANDING_COUNTRY = "gteVacationPackagesLandingCountry",
  GTE_VACATION_PACKAGES_LANDING_WITH_SLUG = "gteVacationPackagesLandingWithSlug",
  GTE_VACATION_PACKAGES_LANDING = "gteVacationPackagesLanding",
  GTE_VACATION_PACKAGE_PREVIEW = "gteVacationPackagePreview",

  // GTE post booking/user system
  GTE_USER_SYSTEM = "user",
  SAVED_CARDS = "savedCards",
  GTE_POST_BOOKING = "gtePostBooking",
  GTE_USER_SYSTEM_PAYMENT = "userPayment",

  // GTE travel guides
  TRAVEL_GUIDE_DESTINATION = "gteTravelGuideDestination",
  TRAVEL_GUIDE_LANDING = "gteTravelGuideLanding",
  TRAVEL_GUIDE_LANDING_COUNTRY = "gteTravelGuideLandingCountry",

  // GTE search results
  GTE_SEARCH_RESULTS = "gteSearchResults",
}
