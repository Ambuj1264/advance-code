import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidCanonicalUrl,
  testRequiredSEOMetaTags,
  testPageIndexed,
  validateHrefLangsForNotIndexedPage,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { fixtureDesktop } from "../utils/testcafe/utils";

const testTourSearchPage = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Tour search page ${url}`, url);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed(false);

  validateHrefLangsForNotIndexedPage();

  testRequiredSEOMetaTags();

  checkProductPriceIsPresent();
};

testTourSearchPage(
  `${baseUrl}/book-trips-holiday?attractionIds=31`,
  "https://guidetoiceland.is/book-trips-holiday"
);

testTourSearchPage(
  `${baseUrl}/book-trips-holiday/nature-tours/northern-lights?activityIds=20&attractionIds=31&orderBy=price&orderDirection=asc`,
  "https://guidetoiceland.is/book-trips-holiday/nature-tours/northern-lights"
);

testTourSearchPage(
  `${baseUrl}/book-trips-holiday/holidays-vacation-packages?durationIds=7&page=1`,
  "https://guidetoiceland.is/book-trips-holiday/holidays-vacation-packages"
);

testTourSearchPage(
  `${baseUrl}/book-trips-holiday/holidays-vacation-packages/best-vacation-packages-in-iceland-this-year?adults=1&page=1&startingLocationId=0&startingLocationName=Iceland%2C%20any%20location`,
  "https://guidetoiceland.is/book-trips-holiday/holidays-vacation-packages/best-vacation-packages-in-iceland-this-year"
);
