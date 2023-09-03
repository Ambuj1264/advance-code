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

const testCarCategory = (url: string, expectedCanonical: string) => {
  fixtureDesktop(`Car Category ${url}`, url);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed();

  testRequiredSEOMetaTags();

  validateHreflangs(expectedCanonical);
};

testCarCategory(`${baseUrl}/iceland-car-rentals`, "https://guidetoiceland.is/iceland-car-rentals");

testCarCategory(
  `${baseUrl}/iceland-car-rentals/small-and-cheap-cars`,
  "https://guidetoiceland.is/iceland-car-rentals/small-and-cheap-cars"
);

testCarCategory(
  `${baseUrl}/iceland-car-rentals/rent-a-car-in-reykjavik`,
  "https://guidetoiceland.is/iceland-car-rentals/rent-a-car-in-reykjavik"
);
