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

const url = `${baseUrl}/book-trips-holiday`;

fixtureDesktop("Tour search landing page", url);

const expectedCanonical = "https://guidetoiceland.is/book-trips-holiday";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);

checkProductPriceIsPresent();
