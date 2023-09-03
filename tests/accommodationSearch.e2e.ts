import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidCanonicalUrl,
  testRequiredSEOMetaTags,
  testPageIndexed,
  validateHrefLangsForNotIndexedPage,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { fixtureDesktop } from "../utils/testcafe/utils";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { startSearch } from "../utils/testcafe/searchUtils";

const testAccommodationSearchPage = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Accommodation search ${url}`, url, [], startSearch);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed(false);

  validateHrefLangsForNotIndexedPage();

  testRequiredSEOMetaTags();

  checkProductPriceIsPresent();
};

testAccommodationSearchPage(`${baseUrl}/accommodation`, "https://guidetoiceland.is/accommodation");

testAccommodationSearchPage(
  `${baseUrl}/accommodation/hotels`,
  `https://guidetoiceland.is/accommodation`
);

testAccommodationSearchPage(
  `${baseUrl}/accommodation/reykjavik`,
  `https://guidetoiceland.is/accommodation`
);
