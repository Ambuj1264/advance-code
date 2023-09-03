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

const url = `${baseUrl}/connect-with-travel-bloggers`;

fixtureDesktop("Travel community", url);

const expectedCanonical = "https://guidetoiceland.is/connect-with-travel-bloggers";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);

checkProductPriceIsPresent();
