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

const url = `${baseUrl}/travel-iceland/drive`;

fixtureDesktop("Best places page", url);

const expectedCanonical = "https://guidetoiceland.is/travel-iceland/drive";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);
