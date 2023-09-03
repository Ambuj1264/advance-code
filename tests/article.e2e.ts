import { Selector } from "testcafe";

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

const articleSEOValidation = () => {
  const url = `${baseUrl}/nature-info/what-to-do-in-iceland`;

  fixtureDesktop("Article page seo test", url);

  const expectedCanonical = "https://guidetoiceland.is/nature-info/what-to-do-in-iceland";

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testValidCanonicalUrl(expectedCanonical);

  testPageIndexed();

  testRequiredSEOMetaTags();

  validateHreflangs(expectedCanonical);

  checkProductPriceIsPresent();
};

const articleFunnelValidation = async () => {
  fixtureDesktop("Article page integration test", `${baseUrl}/about-iceland`);

  test("Navigating from article search to an article page and making sure features are loading properly", async t => {
    const firstArticleHeader = await Selector("h2").nth(1).sibling().find("h3").nth(0);
    const firstArticleHeaderText = await firstArticleHeader.innerText;
    await t.expect(firstArticleHeaderText.length).gt(0);

    await t
      .click(firstArticleHeader)
      .expect(Selector("h1").innerText)
      .eql(firstArticleHeaderText, { timeout: 5000 });

    await t.expect(Selector("picture").exists).ok("", { timeout: 15000 });

    const imageThumbnailList = Selector("#imageThumbnailList > li > div > button > img").with({
      visibilityCheck: true,
    });
    // Renders the small image previews
    await t.expect(imageThumbnailList.count).gt(0);
    // Clicks image thumbnails and open modal
    await t.click(imageThumbnailList.nth(0)).expect(Selector("#imageGalleryNewModal").exists).ok();

    // Click the close button of the image gallery and make sure it closes iit
    await t
      .click(Selector("#closeImageGalleryButton"))
      .expect(Selector("#imageGalleryNewModal").exists)
      .notOk();

    // Headings should have anchor tags in table of contentes
    const firstH2 = await Selector("h2 > span").getAttribute("id");

    await t.expect(Selector(`#${firstH2}`).exists).ok();
  });
};

articleSEOValidation();

articleFunnelValidation();
