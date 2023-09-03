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

const testAccommodationCategoryPage = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Accommodation category ${url}`, url);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed();

  testRequiredSEOMetaTags();

  validateHreflangs(expectedCanonical);
};

testAccommodationCategoryPage(
  `${baseUrl}/accommodation`,
  `https://guidetoiceland.is/accommodation`
);

testAccommodationCategoryPage(
  `${baseUrl}/accommodation/hotels`,
  `https://guidetoiceland.is/accommodation/hotels`
);

testAccommodationCategoryPage(
  `${baseUrl}/accommodation/reykjavik`,
  `https://guidetoiceland.is/accommodation/reykjavik`
);
