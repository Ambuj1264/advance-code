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
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/book-holiday-trips/aurora-holiday-in-iceland-7-days`;

fixtureDesktop("Tour product page", url);

const expectedCanonical =
  "https://guidetoiceland.is/book-holiday-trips/aurora-holiday-in-iceland-7-days";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);
