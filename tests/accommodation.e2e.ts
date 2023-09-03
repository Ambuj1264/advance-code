import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testRequiredSEOMetaTags,
  validateHreflangs,
  testValidCanonicalUrl,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/accommodation/iceland-hotels-reykjavik/fosshotel-reykjavik-4`;

fixtureDesktop("Accommodation product page", url);

const expectedCanonical =
  "https://guidetoiceland.is/accommodation/iceland-hotels-reykjavik/fosshotel-reykjavik-4";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testRequiredSEOMetaTags();

validateHreflangs(expectedCanonical);
