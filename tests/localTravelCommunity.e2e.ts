import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testValidCanonicalUrl,
  testRequiredSEOMetaTags,
  validateHreflangs,
  testPageIndexed,
} from "../utils/testcafe/seoHelpers";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/connect-with-locals`;

fixtureDesktop("Local travel community", url);

const expectedCanonical = "https://guidetoiceland.is/connect-with-locals";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags({
  titleLimit: 70,
});

validateHreflangs(expectedCanonical);

checkProductPriceIsPresent();
