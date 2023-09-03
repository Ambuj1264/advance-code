import { Selector } from "testcafe";
import { range } from "fp-ts/lib/Array";

import {
  testBasicSEOHeadTags,
  testRequiredSEOMetaTags,
  testStatusCode,
  testValidHeadingStructure,
} from "../utils/testcafe/seoHelpers";
import { baseUrl } from "../utils/testcafe/testcafeConstants";
import { checkProductPriceIsPresent } from "../utils/testcafe/productHelpers";
import { fixtureDesktop } from "../utils/testcafe/utils";

const blogBasicValidation = () => {
  const url = `${baseUrl}/connect-with-locals/tomasfkristjansson/aurora-explotion`;

  fixtureDesktop("Blog Page", url);

  testStatusCode(url);

  testBasicSEOHeadTags();

  testValidHeadingStructure();

  testRequiredSEOMetaTags();

  checkProductPriceIsPresent();
};

blogBasicValidation();

const blogFunnelValidation = () => {
  fixtureDesktop("Blog funnel", `${baseUrl}/connect-with-locals`);

  test("Typing into the search widget, navigation to the search result and selecting the the first blog and validating the that the header is correct", async t => {
    const blogSearchInput = Selector("input").withAttribute(
      "placeholder",
      "Search destinations, attractions or any keywords..."
    );
    await t.typeText(blogSearchInput, "puffin").click(Selector("button").withText("Search"));

    await t
      .expect(Selector("h2", { visibilityCheck: true }).withText("blogs match your search").exists)
      .ok({ timeout: 20000 });

    const firstBlogHeader = Selector("h3").with({ visibilityCheck: true }).nth(0);
    const firstBlogHeaderText = await firstBlogHeader.innerText;
    const blogPageHeader = Selector("h1").with({ visibilityCheck: true });

    await t
      .click(firstBlogHeader)
      .expect(blogPageHeader.exists)
      .ok({ timeout: 20000 })
      .expect(blogPageHeader.innerText)
      .eql(firstBlogHeaderText);
  });

  test("Finding the first blog on the search page and validating that navigation works", async t => {
    const firstBlogHeader = Selector("h3").nth(0);
    const blogHeaderText = await firstBlogHeader.innerText;

    await t
      .click(firstBlogHeader)
      .expect(Selector("h1").innerText)
      .eql(blogHeaderText, { timeout: 10000 });
  });

  test("Clicking see more bloggers button shows more bloggers", async t => {
    const boggerCartSelector = Selector("a").withAttribute("data-testid", "bloggerCard");
    const seeMoreButtonSelector = Selector("#seeMoreBloggers");

    const numberOfBloggersBeforeClick = await boggerCartSelector.with({
      visibilityCheck: true,
    })().count;

    await t.click(seeMoreButtonSelector, { speed: 0.3 });

    const seeMoreButton = seeMoreButtonSelector.withAttribute("disabled");

    await t.wait(1500);
    await t.expect(seeMoreButton.exists).notOk("", { timeout: 20000 });

    const numberOfBloggersAfterClick = await boggerCartSelector.with({
      visibilityCheck: true,
    })().count;

    await t.expect(numberOfBloggersAfterClick).gt(numberOfBloggersBeforeClick);
  });

  test("Clicking blogger dropdown and make sure it updates list with correct locale", async t => {
    await t
      .click(Selector("#topBloggerLanguageDropdown"))
      .wait(1000)
      .click(Selector("#reviewsLocaleOptionzh_CN"))
      .expect(
        Selector("a")
          .withAttribute("data-type", "bloggerCard")
          .filter(node => !node.getAttribute("data-lang").includes("zh_CN")).count
      )
      .eql(0);
  });

  test("Clicking popular tips pagination and making sure we load different blogs", async t => {
    const currentVisiblePopularTips = Selector("h2")
      .withText("Popular tips")
      .sibling("div")
      .find("a");
    const currentTitlesCount = (await currentVisiblePopularTips.count) - 1;

    const promisesWithTitles = range(0, currentTitlesCount).map(index =>
      currentVisiblePopularTips.nth(index).getAttribute("title")
    );

    const initialTripsTitle = await Promise.all(promisesWithTitles);

    await t.click(Selector("button").withText("2")).wait(2000);

    const updatedPopularTips = Selector("h2").withText("Popular tips").sibling("div").find("a");

    const popularTripsCount = (await currentVisiblePopularTips.count) - 1;

    const promisesWithUpdTitles = range(0, popularTripsCount).map(index =>
      updatedPopularTips.nth(index).getAttribute("title")
    );

    const updTitles = await Promise.all(promisesWithUpdTitles);

    const promisesThatTitlesAreDifferent = updTitles.map(async (popularTripTitle, index) => {
      await t.expect(initialTripsTitle[index]).notEql(popularTripTitle);
    });

    await Promise.all(promisesThatTitlesAreDifferent);
  });
};

blogFunnelValidation();
