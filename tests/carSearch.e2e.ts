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

const tesCarSearchPage = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Car search page ${url}`, url, [], startSearch);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed(false);

  validateHrefLangsForNotIndexedPage();

  testRequiredSEOMetaTags();

  checkProductPriceIsPresent();
};

tesCarSearchPage(`${baseUrl}/iceland-car-rentals`, `https://guidetoiceland.is/iceland-car-rentals`);

tesCarSearchPage(
  `${baseUrl}/iceland-car-rentals/small-and-cheap-cars`,
  `https://guidetoiceland.is/iceland-car-rentals/small-and-cheap-cars`
);

tesCarSearchPage(
  `${baseUrl}/iceland-car-rentals/rent-a-car-in-reykjavik`,
  `https://guidetoiceland.is/iceland-car-rentals/rent-a-car-in-reykjavik`
);
