import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testValidCanonicalUrl,
  testRequiredSEOMetaTags,
  validateHreflangs,
  testPageIndexed,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { fixtureDesktop } from "../utils/testcafe/utils";

const testTourCategory = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Tour category: ${url}`, url);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed();

  testRequiredSEOMetaTags();

  validateHreflangs(expectedCanonical);

  checkProductPriceIsPresent();
};

testTourCategory(`${baseUrl}/book-trips-holiday`, "https://guidetoiceland.is/book-trips-holiday");

testTourCategory(
  `${baseUrl}/book-trips-holiday/nature-tours/blue-lagoon`,
  "https://guidetoiceland.is/book-trips-holiday/nature-tours/blue-lagoon"
);

testTourCategory(
  `${baseUrl}/book-trips-holiday/day-tours/south-coast-tours`,
  "https://guidetoiceland.is/book-trips-holiday/day-tours/south-coast-tours"
);

testTourCategory(
  `${baseUrl}/book-trips-holiday/holidays-vacation-packages`,
  "https://guidetoiceland.is/book-trips-holiday/holidays-vacation-packages"
);

// TODO: https://app.asana.com/0/43346297891726/1202714584108026/f
// testTourCategory(
//   `${baseUrl}/book-trips-holiday/holidays-vacation-packages/best-vacation-packages-in-iceland-this-year`,
//   "https://guidetoiceland.is/book-trips-holiday/holidays-vacation-packages/best-vacation-packages-in-iceland-this-year"
// );
