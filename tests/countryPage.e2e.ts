import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testRequiredSEOMetaTags,
  validateHreflangs,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { fixtureDesktop } from "../utils/testcafe/utils";

fixtureDesktop("Front page", baseUrl);

const expectedCanonical = "https://guidetoiceland.is";

testStatusCode(baseUrl);

testBasicSEOHeadTags();

testValidHeadingStructure();

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);

checkProductPriceIsPresent();
