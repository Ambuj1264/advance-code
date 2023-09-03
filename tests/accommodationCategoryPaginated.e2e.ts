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
import { fixtureDesktop } from "../utils/testcafe/utils";

const url = `${baseUrl}/accommodation/hotels?page=2`;

fixtureDesktop("Accommodation category paginated", url);

const expectedCanonical = "https://guidetoiceland.is/accommodation/hotels?page=2";

testStatusCode(url);

testBasicSEOHeadTags();

testValidHeadingStructure();

testValidCanonicalUrl(expectedCanonical);

testPageIndexed();

testRequiredSEOMetaTags();

test("Make sure hreflangs are empty", async t => {
  const head = Selector("head");
  const hreflangs = await head.child("link").withAttribute("hreflang");
  await t.expect(hreflangs.count).eql(0);
});
