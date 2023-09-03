export enum UserRoles {
  admin = "admin",
  affiliate = "affiliate",
  translator = "translator",
}

export enum ButtonSize {
  Tiny = "32px",
  Small = "40px",
  Medium = "50px",
  Large = "60px",
  Huge = "70px",
  Inherit = "inherit",
}

export enum IconSize {
  Tiny = "8px",
  Small = "10px",
  Medium = "14px",
}

export enum Direction {
  Right = "0",
  Down = "90deg",
  Left = "180deg",
  Up = "270deg",
}

export enum ThemeColor {
  Primary,
  Action,
}

export enum ColorScheme {
  primary = "primary",
  secondary = "secondary",
  action = "action",
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

export enum IncrementType {
  Plus,
  Minus,
}

export enum KeyboardKey {
  Escape = "Escape",
  Enter = "Enter",
}

export enum DisplayType {
  Small,
  Medium,
  Large,
  Desktop,
}

export enum TransportPickup {
  Address = "address_pickup",
  List = "pickup_list",
  NotAvailable = "not_available",
  Airport = "package_airport",
  PackageAddress = "package_address",
  PackagePickup = "package_pickup",
}

export enum QueryTourPickup {
  NO_PICKUP = "NO_PICKUP",
  PRICED_PICKUP = "PRICED_PICKUP",
  FREE_PICKUP = "FREE_PICKUP",
}

export enum TourType {
  SelfDrive = "Self-drive tours",
  Package = "Vacation packages",
  Day = "Day tours",
  MultiDay = "Multi-day tours",
  Bundle = "Bundle tours",
  SpecialOffer = "Special offers",
}

type TourTypesKeys = keyof typeof TourType;
export type TourTypes = typeof TourType[TourTypesKeys];

export enum BookingWidgetFormError {
  EMPTY_DATES,
  EMPTY_PICKUP,
  NO_PICKUP_TIME,
  EMPTY_ANSWER,
  MIN_TRAVELERS,
  EMPTY_ROOMS,
  NOT_ENOUGH_ROOMS,
}

export enum TeaserVariant {
  SIDE_CARD = "SideCard",
  SIDE_CARD_WITH_BUTTON = "SideCardWithButton",
  SIDE_CARD_WITH_LINK = "SideCardWithLink",
  VERTICAL_CARD = "VerticalCard",
  IMAGE_WITH_ACTION = "ImageWithAction",
  IMAGE_TITLE_ONLY = "ImageTitleOnly",
  IMAGE_TITLE_DISTANCE = "ImageWithDistance",
  IMAGE_HERO = "ImageHero",
  CATEGORY_BANNER = "CategoryBanner",
}

export enum ContentWidgetType {
  HTML = "html",
  TABLE_OF_CONTENTS = "tableOfContents",
  TEASER = "teaser",
  LIST_OF_TEASERS = "listOfTeasers",
  LIST_OF_TOURS = "listOfTours",
  LIST_OF_HOTELS = "listOfHotels",
  LIST_OF_CARS = "listOfCars",
  LIST_OF_PRODUCTS = "listOfProducts",
  LIST_OF_QUICK_FACTS = "listOfQuickFacts",
}

export enum CategoryBannerType {
  TOUR = "tour_category",
  TOUR_SEARCH = "tour_searchcategory",
  HOTEL = "hotel_category",
  HOTEL_SEARCH = "hotel_searchcategory",
  CAR = "car_category",
  CAR_SEARCH = "car_searchcategory",
}

export enum TeaserListVariant {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export enum ProductCardVariant {
  DEFAULT = "default",
  SMALL = "small",
}

export enum ProductCardType {
  TOUR = "tour",
  ARTICLE = "article",
  CAR = "car",
  BLOG = "blog",
}

export enum CoverVariant {
  DEFAULT = "default",
  HERO = "hero",
}

export enum PageType {
  PAGE = "page",
  ARTICLE = "article",
  ARTICLESEARCH = "articleSearch",
  ARTICLECATEGORY = "articleCategory",
  BLOG = "blog",
  BLOG_LEGACY = "blog-legacy",
  TOUR = "tour",
  ACCOMMODATION = "accommodationProduct",
  ACCOMMODATION_SEARCH = "accommodationSearch",
  ACCOMMODATION_CATEGORY = "accommodationCategory",
  CAR = "car",
  ATTRACTION = "attraction",
  BEST_PLACES = "bestPlaces",
  LANDING_PAGE = "landingPage",
  CATEGORY = "category",
  TOURCATEGORY = "tourCategory",
  TOURSEARCH = "tourSearch",
  TOURSEARCH_LEGACY = "tourSearchLegacy",
  HOTELCATEGORY = "hotelCategory",
  HOTELSEARCHCATEGORY = "hotelSearchCategory",
  HOTEL = "hotel",
  CARSEARCH = "carSearch",
  CARSEARCH_LEGACY = "car-search",
  CARSEARCHCATEGORY = "carSearchCategory",
  CARCATEGORY = "carCategory",
  LOCALCOMMUNITY = "local",
  TRAVELCOMMUNITY = "travel",
  BLOGGERSEARCH = "bloggerSearch",
  LOCALBLOGGERSEARCH = "localBloggerSearch",
  FLIGHT = "flight",
  FLIGHTSEARCH = "flightSearch",
  FRONT_PAGE = "index",
  GTE_FRONT_PAGE = "gteFrontPage",
  GTE_COUNTRY_PAGE = "gteCountryPage",
  GTE_CAR_SEARCH = "gteCarSearch",
  GTE_STAYS_SEARCH = "gteStaysSearch",
  GTE_STAY = "gteStay",
  TRIPPLANNER = "tripPlanner",
  VACATION_PACKAGE = "gteVacationPackage",
  VACATION_PACKAGES_LANDING = "gteVacationPackagesLanding",
  GTE_TOUR_SEARCH = "gteTourSearch",
  GTE_TOUR = "gteTour",
  GTE_POST_BOOKING = "gtePostBooking",
  GTE_USER_SYSTEM = "user",
  GTE_SEARCH_RESULTS = "gteSearchResults",
  TRAVEL_GUIDE_DESTINATION = "gteTravelGuideDestination",
  TRAVEL_GUIDE_LANDING = "gteTravelGuideLanding",
  // Payment types
  CART = "cart",
  VOUCHER = "voucher",
  MOBILE_PAYMENT = "payment",
  PAYMENT_LINK = "payment-link",
  PAYMENT_REDIRECT = "paymentRedirect",
  PAYMENT_RECEIPT = "payment-receipt",
}

export enum MapPointType {
  TOUR = "tour",
  DAY_TOUR = "dayTour",
  PACKAGE_TOUR = "packageTour",
  SELF_DRIVE_TOUR = "selfDriveTour",
  HOTEL = "hotel",
  CAR = "car",
  ATTRACTION = "attraction",
  DESTINATION = "destination",
  RESTAURANT = "restaurant",
  BAR = "bar",
  FALLBACK_POINT = "fallbackPoint",
}

export enum BestPlacesPage {
  ATTRACTIONS = "attraction",
  DESTINATIONS = "destination",
}

export enum MapCardType {
  ATTRACTION = "Attraction",
  TOUR = "Tour",
}

export enum CategorySearchPageType {
  TOUR_CATEGORY = "tour_category",
  TOUR_SEARCH = "tours-search",
  TOUR_INDEX = "tours-index",
  ACCOMMODATION_CATEGORY = "hotel_searchcategory",
  ACCOMMODATION_SEARCH = "hotel-search",
  ACCOMMODATION_INDEX = "hotels-index",
}

export enum LandingPageType {
  TOURS = "tours",
  ACCOMMODATIONS = "accommodations",
  ARTICLES = "articles",
  HOTELS = "hotels",
  CARS = "cars",
  BLOGS = "BLOGS",
  LOCALBLOGGERS = "localBloggers",
  TRAVELBLOGGERS = "travelBloggers",
  ATTRACTIONS = "attractions",
  LOCALSEARCH = "localSearch",
  TRAVELSEARCH = "travelSearch",
}

export enum PageLayout {
  GRID = "grid",
  LIST = "list",
}

export enum TemperatureUnit {
  CELSIUS = "celsius",
  FAHRENHEIT = "fahrenheit",
}

export enum FilterType {
  CHECKBOX = "checkbox",
  BUTTONS = "buttons",
  RANGE = "range",
  RADIO = "radio",
}

export enum SharedFilterQueryParams {
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
  ORDER_BY = "orderBy",
  ORDER_DIRECTION = "orderDirection",
  PAGE = "page",
}

export enum FilterQueryEnum {
  DURATION_IDS = "durationIds",
  ACTIVITY_IDS = "activityIds",
  DESTINATION_ID = "destinationId",
  ATTRACTION_IDS = "attractionIds",
  STARTING_LOCATION_ID = "startingLocationId",
  STARTING_LOCATION_NAME = "startingLocationName",
  ADULTS = "adults",
  TEENAGERS = "teenagers",
  CHILDREN = "children",
  CHILDREN_AGES = "childrenAges",
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
  PRICE = "price",
  REVIEW_SCORE = "reviewScore",
  TIME = "time",
  REQUEST_ID = "requestId",
}

export const MobileWidgetQueryParam = {
  WIDGET_STEP: "widgetStep",
};

export const FilterQueryParam = {
  ...FilterQueryEnum,
  ...SharedFilterQueryParams,
};

enum AccommodationSearchQueryEnum {
  ID = "id",
  ADDRESS = "address",
  TYPE = "type",
  ROOMS = "rooms",
  ADULTS = "adults",
  CHILDREN = "children",
  OCCUPANCIES = "occupancies",
}

export enum StayFilterQueryEnum {
  REVIEW_SCORE = "review_score",
  STAY_CATEGORIES = "categories",
  MEALS_INCLUDED = "meals_included",
  ROOM_PREFERENCES = "room_preferences",
  STAY_AMENITIES = "hotel_amenities",
  STAR_RATINGS = "star_ratings",
  PRICE = "price",
  SEARCH_ID = "searchId",
}

export enum AccommodationFilterQueryEnum {
  STARS = "stars",
  CATEGORIES = "category_ids",
  AMENITIES = "amenity_ids",
  EXTRAS = "extra_option_ids",
}

export const AccommodationFilterQueryParam = {
  ...AccommodationSearchQueryEnum,
  ...AccommodationFilterQueryEnum,
  ...SharedFilterQueryParams,
  ...StayFilterQueryEnum,
};

enum BestPlacesSearchQueryParam {
  ACTIVE_TAB = "activeTab",
  LATITUDE = "lat",
  LONGITUDE = "lng",
  ATTRACTION_IDS = "attractionIds",
  STARTING_LOCATION_TYPES = "startingLocationTypes",
  DESTINATION_ID = "destinationId",
}

export const BestPlacesQueryParam = {
  ...FilterQueryEnum,
  ...SharedFilterQueryParams,
  ...BestPlacesSearchQueryParam,
};

export enum CartQueryParam {
  CART_ID = "cartId", // used for cart page when checkout if failed
  SAVED_CART_ID = "savedCartId", // admins can create cart link and send it to many users
  PAYMENT_PROVIDER = "paymentProvider",
}

export enum PaymentLinkQueryParam {
  PAYMENT_LINK_ID = "paymentLinkId",
}

export enum VoucherQueryParam {
  VOUCHER_ID = "voucherId",
  PDF = "pdf",
}

export enum AccommodationFilterCategoryIconId {
  STARS = "stars",
  CATEGORIES = "categories",
  AMENITIES = "amenities",
  EXTRAS = "extras",
  BUSINESS = "business",
  ENTERTAINMENT = "entertainment",
  FOOD = "food",
  GENERAL = "general",
  INTERNET = "internet",
  OUTDOORS = "outdoors",
  PARKING = "parking",
  PETS = "pets",
  RECEPTION = "reception",
  TRANSPORT = "transport",
  WELLNESS = "wellness",
  APPLIANCES = "appliances",
}

export enum TeaserOverlayBannerIconId {
  TRENDING = "trending",
  NEWEST = "newest",
  POPULAR = "popular",
  RECOMMENDED = "recommended",
}

export enum CarFilterQueryEnum {
  PICKUP_LOCATION_ID = "pickupId",
  DROPOFF_LOCATION_ID = "dropoffId",
  PICKUP_GEO_LOCATION = "pickupGeoLocation",
  DROPOFF_GEO_LOCATION = "dropoffGeoLocation",
  CAR_TYPE = "carType",
  INCLUDED_INSURANCES = "includedInsurances",
  SEATS = "seats",
  SUPPLIER = "supplier",
  SUPPLIER_LOCATION = "supplierLocation",
  CAR_FEATURES = "carFeatures",
  DEPOSIT_AMOUNT = "depositAmount",
  FUEL_POLICY = "fuelPolicy",
  MILAGE = "milage",
  INCLUDED_EXTRAS = "includedExtras",
  DRIVER_AGE = "driverAge",
  DRIVER_COUNTRY = "driverCountryCode",
  PICKUP_LOCATION_NAME = "pickupLocationName",
  DROPOFF_LOCATION_NAME = "dropoffLocationName",
  FUEL_TYPE = "fuelType",
  TO_SUBMIT = "to_submit",
  SIMILAR_TO = "similar_to",
  FROM_SUBMIT = "from_submit",
  EDIT_CAR_OFFER_CART_ID = "editCarOfferCartId",
  CAR_LOCATION_TYPE = "carLocationType",
}

export const CarFilterQueryParam = {
  ...SharedFilterQueryParams,
  ...CarFilterQueryEnum,
};

/* Open Graph Types can be found here:
 * https://ogp.me/#types
 * https://stackoverflow.com/a/54741252/10559239
 * */
export enum OpenGraphType {
  WEBSITE = "website",
  ARTICLE = "article",
  PROFILE = "profile",
  PRODUCT = "product",
}

export enum Marketplace {
  GUIDE_TO_ICELAND = "guidetoiceland_is",
  GUIDE_TO_EUROPE = "gte-travelmarketplaces-com",
  GUIDE_TO_THE_PHILIPPINES = "gttp-travelmarketplaces-com",
  ICELAND_PHOTO_TOURS = "ipt-travelmarketplaces-com",
  NORWAY_TRAVEL_GUIDE = "norwaytravelguide_no",
}

export enum CoreMarketplace {
  GUIDE_TO_ICELAND = "guidetoiceland-is",
  GUIDE_TO_EUROPE = "guidetoeurope-com",
  GUIDE_TO_THE_PHILIPPINES = "guidetothephilippines-ph",
  ICELAND_PHOTO_TOURS = "iceland-photo-tours-com",
  NORWAY_TRAVEL_GUIDE = "norwaytravelguide-no",
}

// TODO: use this enum for all marketplace specific string checks
export enum MarketplaceName {
  GUIDE_TO_ICELAND = "guidetoiceland",
  GUIDE_TO_EUROPE = "guidetoeurope",
  GUIDE_TO_THE_PHILIPPINES = "guidetothephilippines",
  ICELAND_PHOTO_TOURS = "iceland-photo-tours",
  NORWAY_TRAVEL_GUIDE = "norwaytravelguide",
}

export enum CarCategory {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  ESTATE = "estate",
  MINIVAN = "mini van",
  JEEPSUV = "jeep / suv",
  CONVERTIBLE = "convertible",
  PREMIUM = "premium",
  CAMPERVAN = "camper van",
  MINICAMPER = "mini camper",
  VAN = "van",
  UNSPECIFIED = "unspecified",
}

export enum CarPlaceholderCategory {
  SMALL = "Small",
  MEDIUM = "Medium",
  LARGE = "Large",
  ESTATE = "Estate",
  MINIVAN = "MiniVan",
  JEEPSUV = "JeepSUV",
  CONVERTIBLE = "Convertible",
  PREMIUM = "Premium",
  CAMPERVAN = "CamperVan",
  MINICAMPER = "MiniCamper",
  VAN = "Van",
}

export enum CarSearchTimeType {
  PICKUP = "pickup",
  DROPOFF = "dropoff",
}

export enum Layer0PageHeaders {
  page = "x-0-page",
  amp = "x-0-amp",
  slug = "x-0-slug",
  category = "x-0-category",
  id = "x-0-id",
  carId = "x-0-carId",
  provider = "x-0-provider",
  f = "x-0-f",
  t = "x-0-t",
  from = "x-0-from",
  to = "x-0-to",
  "pickup_id" = "x-0-pickup_id",
  "dropoff_id" = "x-0-dropoff_id",
  "cart_item" = "x-0-cart_item",
  driverAge = "x-0-driverAge",
  driverCountryCode = "x-0-driverCountryCode",
  carName = "x-0-carName",
  attractions = "x-0-attractions",
  adults = "x-0-adults",
  occupancies = "x-0-occupancies",
  childrenAges = "x-0-childrenAges",
  children = "x-0-children",
  infants = "x-0-infants",
  bookingToken = "x-0-bookingToken",
  country = "x-0-country",
  redirectResult = "x-0-redirectResult",
  title = "x-0-title",
  payload = "x-0-payload",
  subtype = "x-0-subtype",
  pageType = "x-0-pageType",
  originName = "x-0-originName",
  origin = "x-0-origin",
  originCountry = "x-0-originCountry",
  destinationName = "x-0-destinationName",
  destinationCountry = "x-0-destinationCountry",
  pageVariation = "x-0-pageVariation",
  dropoffLocationName = "x-0-dropoffLocationName",
  pickupLocationName = "x-0-pickupLocationName",
  currentRequestUrl = "x-travelshift-url-front",
  originId = "x-0-originId",
  destinationId = "x-0-destinationId",
  dateFrom = "x-0-dateFrom",
  dateTo = "x-0-dateTo",
  includeFlights = "x-0-includeFlights",
  nextPageId = "x-0-nextPageId",
  prevPageId = "x-0-prevPageId",
  numberOfDays = "x-0-numberOfDays",
  section = "x-0-section",
  secondOfferId = "x-0-secondOfferId",
  tour_category_id = "x-0-tour_category_id",
  pickupId = "x-0-pickupId",
  dropoffId = "x-0-dropoffId",
  orderBy = "x-0-orderBy",
  requestId = "x-0-requestId",
  tripId = "x-0-tripId",
  nav = "x-0-nav",
  dayNumber = "x-0-dayNumber",
  paymentLinkId = "x-0-paymentLinkId",
  search = "x-0-search",
  // TODO: remove when GTI live pricing will be released
  forceLivePricing = "x-0-forceLivePricing",
}

export enum CarProviderId {
  MONOLITH,
  CARNECT,
  CAREN,
  GUIDE,
}

export enum CarProvider {
  MONOLITH = "MONOLITH",
  CARNECT = "CARNECT",
  CAREN = "CAREN",
  GUIDE = "GUIDE",
}

export enum SupportedLanguages {
  English = "en",
  German = "de",
  Danish = "da",
  Spanish = "es",
  French = "fr",
  Icelandic = "is",
  Italian = "it",
  Japanese = "ja",
  Korean = "ko",
  Dutch = "nl",
  Norwegian = "no",
  Polish = "pl",
  Russian = "ru",
  Swedish = "sv",
  Thai = "th",
  Finnish = "fi",
  Chinese = "zh_CN",
  LegacyChinese = "zh",
}

export enum SupportedCurrencies {
  AUSTRALIAN_DOLLAR = "AUD",
  CANADIAN_DOLLAR = "CAD",
  SWISS_FRANC = "CHF",
  CHINESE_YUAN = "CNY",
  DANISH_KRONE = "DKK",
  EURO = "EUR",
  BRITISH_POUND_STERLING = "GBP",
  ICELANDIC_KRONA = "ISK",
  JAPANESE_YEN = "JPY",
  SOUTH_KOREAN_WON = "KRW",
  NORWEGIAN_KRONE = "NOK",
  NEW_ZEALAND_DOLLAR = "NZD",
  POLISH_ZLOTY = "PLN",
  SWEDISH_KRONA = "SEK",
  THAI_BAHT = "THB",
  UNITED_STATES_DOLLAR = "USD",
  // NTG & GTTP
  HONG_KONG_DOLLAR = "HKD",
  SINGAPORE_DOLLAR = "SGD",
  // GTTP only
  UNITED_ARAB_EMIRATES_DIRHAM = "AED",
  PHILIPPINE_PESO = "PHP",
  QATARI_RIAL = "QAR",
  SAUDI_RIYAL = "SAR",
  // NGT & ICP
  RUSSIAN_RUBLE = "RUB",
}

export enum GraphCMSPageType {
  Flights = "Flights",
  Cars = "Cars",
  FrontPage = "FrontPage",
  CountryPage = "CountryPage",
  Stays = "Stays",
  VacationPackages = "VacationPackages",
  VpProductPage = "VacationPackagesProductPage",
  GTIFlights = "GtiFlights",
  GTTPFlights = "GttpFlights",
  StaysProductPage = "StaysProductPage",
  Experiences = "Experiences",
  Destinations = "Trips",
  Attractions = "Attractions",
  Information = "Information",
  Tours = "Tours",
  TourProductPage = "TourProductPage",
  TravelGuides = "TravelGuideDestination",
  TravelGuidesLanding = "TravelGuideLanding",
}

export enum GraphCMSPageVariation {
  toCountry = "ToCountry",
  inCountry = "InCountry",
  inCountryWithType = "InCountryWithType",
  inCountryWithTypeAndTag = "InCountryWithTypeAndTag",
  toContinent = "ToContinent",
  inContinent = "InContinent",
  inContinentWithType = "InContinentWithType",
  inContinentWithTypeAndTag = "InContinentWithTypeAndTag",
  toCity = "ToCity",
  inCity = "InCity",
  inCityWithType = "InCityWithType",
  inCityWithTypeAndTag = "InCityWithTypeAndTag",
  fromCountry = "FromCountry",
  fromContinent = "FromContinent",
  fromCity = "FromCity",
  fromCountryToCountry = "CountryToCountry",
  fromCountryToCountryWithType = "CountryToCountryWithType",
  fromCityToCity = "CityToCity",
  fromCityToCityWithType = "CityToCityWithType",
  guide = "Guide",
  inAirport = "InAirport",
  inAirportWithType = "InAirportWithType",
  staysProductPage = "StaysProductPage",
  VpProductPage = "VpProductPage",
  tourProductPage = "TourProductPage",
  travelGuidesDestination = "travelGuidesDestination",
  none = "none",
}

export enum GraphCMSDisplayType {
  IMAGE = "ImageCard",
  IMAGE_WITH_SVG_ICON = "ImageWithSVGIcon",
  LARGE_IMAGE = "LargeImageCard",
  SIDE_IMAGE = "SideImageCard",
  IMAGE_WITH_ACTION = "ImageCardWithAction",
  PRODUCT_CARD = "ProductCard",
  TG_CARD = "TravelGuideCard",
}

export enum Product {
  TOUR = "tour",
  STAY = "stay",
  FLIGHT = "flight",
  CAR = "car",
  CUSTOM = "custom product",
  VacationPackage = "Vacation Package",
  GTETour = "gteTour",
  GTEStay = "gteStay",
  INVOICE = "payment link invoice",
}

type ProductTypeKeys = keyof typeof Product;
export type ProductTypeValues = typeof Product[ProductTypeKeys];

export enum AutoCompleteType {
  CITY = "city",
  HOTEL = "hotel",
  TRAIN_STATION = "train_station",
  AIRPORT = "airport",
  PLANE_LAND = "plane_land",
  PLANE_TAKEOFF = "plane_takeoff",
  PRODUCT = "PRODUCT",
  ATTRACTION = "ATTRACTION",
}

export enum LocationType {
  CITY = "city",
  AIRPORT = "airport",
  HOTEL = "hotel",
  TRAIN_STATION = "train_station",
}

export enum StaySearchType {
  CITY = "CITY",
  COUNTRY = "COUNTRY",
  STREET = "STREET",
  UNKNOWN = "UNKNOWN",
  PRODUCT = "PRODUCT",
}

export enum Availability {
  AVAILABLE = "Available",
  FREE = "Free",
  NOT_AVAILABLE = "NotAvailable",
  FOR_FEE = "FOR_FEE",
  NOTAVAILABLE = "NOT_AVAILABLE",
  FORFREE = "FREE",
  FOR_A_FEE = "FOR_A_FEE",
  ISAVAILABLE = "AVAILABLE",
}

export enum FlightRanking {
  BEST = "BEST",
  FASTEST = "FASTEST",
  CHEAPEST = "CHEAPEST",
  NORANK = "NORANK",
}

export enum OrderBy {
  DURATION = "duration",
  POPULARITY = "popularity",
  PRICE = "price",
  RATING = "rating",
  TOP_REVIEWS = "top_reviews",
}

export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum CursorPaginationQueryParams {
  NEXT_PAGE_ID = "nextPageId",
  PREV_PAGE_ID = "prevPageId",
}

export enum GraphCMSSubType {
  HOTEL = "Hotel",
  RESORT = "Resort",
  COTTAGE = "Cottage",
  GUESTHOUSE = "Guesthouse",
  APARTMENT = "Apartment",
  HOSTEL = "Hostel",
  BED_AND_BREAKFAST = "BedAndBreakfast",
  CASTLE = "Castle",
  STAYS_TOP_LEVEL = "StaysTopLevel",
  ROADTRIP = "RoadTrip",
  VP_TOP_LEVEL = "VpTopLevel",
}

export enum FlightFunnelType {
  FLIGHT = "FLIGHT",
  CAR = "CAR",
  VACATION_PACKAGE = "VACATION_PACKAGE",
}

export enum TravelStopType {
  ATTRACTION = "attraction",
  DESTINATION = "destination",
}

export enum TravelshiftCustomHeader {
  SKIP_CACHE = "x-travelshift-skip-cache",
  BACKEND_CONTROLLED_CACHE = "x-travelshift-backend-controlled-cache",
  SHORT_CACHE = "x-travelshift-short-cache",
  LONG_CACHE = "x-travelshift-long-cache",
}

export enum MAP_TYPE {
  BAIDU = "baidu",
  BAIDU_FALLBACK_COVER = "baiduFallbackCover",
  GOOGLE = "google",
}

export enum CarSubTypeId {
  SMALL = "1",
  MEDIUM = "2",
  LARGE = "3",
  ESTATE = "4",
  MINIVAN = "5",
  JEEPSUV = "6",
  CONVERTIBLE = "7",
  PREMIUM = "8",
  CAMPERVAN = "9",
  MINICAMPER = "10",
  VAN = "11",
  UNSPECIFIED = "12",
}

export enum StayProductType {
  HOTEL = "HOTEL",
  RESORT = "RESORT",
  COTTAGE = "COTTAGE",
  GUESTHOUSE = "GUESTHOUSE",
  APARTMENT = "APARTMENT",
  HOSTEL = "HOSTEL",
  BED_AND_BREAKFAST = "BED_AND_BREAKFAST",
  CASTLE = "CASTLE",
}

export enum MarketplaceSessionCookie {
  GTE = "guidetoeurope_com_session",
  GTI = "guidetoiceland_is_session",
  IPT = "iceland-photo-tours_com_session",
  GTTP = "guidetothephilippines_ph_session",
}

export enum AccommodationCategoryTypes {
  COTTAGE = 3,
  APARTMENT = 7,
}

export enum AccommodationCategoryNames {
  COTTAGE = "Cottage",
  APARTMENT = "Apartment",
}

export enum GTIVpLivePricingType {
  ALL = "ALL",
  DEFAULT = "DEFAULT",
  NOT_DEFAULT = "NOT_DEFAULT",
}

export enum SelectMenuPlacement {
  BOTTOM = "bottom",
  TOP = "top",
  AUTO = "auto",
}

export enum GTESearchCategories {
  FRONT_PAGE = "Front Page",
  COUNTRY_PAGE = "Country Page",
  VACATIONS = "Vacations",
  FLIGHTS = "Flights",
  STAYS = "Stays",
  CARS = "Cars",
  EXPERIENCES = "Experiences",
  RESTAURANTS = "Restaurants",
  DESTINATIONS = "Destinations",
  ATTRACTIONS = "Attractions",
  INFORMATION = "Information",
  SEARCH = "Search",
}

export enum GraphCMSSectionAdjective {
  CHEAPEST = "Cheapest",
  BEST = "Best",
  TOP_RATED = "TopRated",
}

export enum BroadcastChannelNames {
  MINICART = "minicart-channel",
}
