import { Selector } from "testcafe";

import {
  testStatusCode,
  testBasicSEOHeadTags,
  testValidHeadingStructure,
  testValidCanonicalUrl,
  testRequiredSEOMetaTags,
  testPageIndexed,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/book-trips-holiday/nature-tours/blue-lagoon?page=2`;

fixtureDesktop("Tour category paginated", url);

const expectedCanonical =
  "https://guidetoiceland.is/book-trips-holiday/nature-tours/blue-lagoon?page=2";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags({ titleLimit: 70 });

checkProductPriceIsPresent();

test("Make sure hreflangs are empty", async t => {
  const head = Selector("head");
  const hreflangs = await head.child("link").withAttribute("hreflang");
  await t.expect(hreflangs.count).eql(0);
});
