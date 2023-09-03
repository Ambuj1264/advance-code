import { ClientFunction, Selector } from "testcafe";

export const testStatusCode = (pageUrl: string) =>
  test("Should return 200 statuscode", async t => {
    const getRequestResult = ClientFunction(url => {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        // eslint-disable-next-line functional/immutable-data
        xhr.timeout = 20000;

        // eslint-disable-next-line functional/immutable-data
        xhr.onload = () => {
          resolve(xhr.status);
        };

        // eslint-disable-next-line functional/immutable-data
        xhr.ontimeout = () => {
          resolve(408);
        };

        xhr.send(null);
      });
    });

    const status = await getRequestResult(pageUrl);

    await t.expect(status).eql(200);
  });

export const testBasicSEOHeadTags = () =>
  test("Basic SEO validation test", async t => {
    const head = Selector("head");
    const language = Selector("html").getAttribute("lang");
    const clientHints = head
      .child("meta")
      .withAttribute("http-equiv", "Accept-CH")
      .withAttribute("content", "DPR, Viewport-Width, Width");
    const atomFeed = head
      .child("link")
      .withAttribute("title", "Atom Feed")
      .withAttribute("type", "application/atom+xml");
    const metaCharset = Selector("meta").withAttribute("charset");
    const numberOfHrefElementWitInvalidChineseAttribute = await Selector("a").filter(
      node =>
        node.getAttribute("href")?.includes("/zh/") || node.getAttribute("href")?.endsWith("/zh")
    ).count;
    await t

      // HTML language is correct
      .expect(language)
      .eql("en")
      // UTF charset is the first element in head
      .expect(metaCharset.getAttribute("charset"))
      .eql("utf-8")
      // Correct Client hint requests are sent to the client
      .expect(clientHints.exists)
      .ok()
      // Atom feed is in the html and valid
      .expect(atomFeed.exists)
      .ok()
      .expect(numberOfHrefElementWitInvalidChineseAttribute)
      .eql(0);
  });

interface CustomSelector extends Selector {
  getElementIndex(elementSelector): Promise<any>;
}

export const testValidHeadingStructure = () =>
  test("Headings are valid", async t => {
    const h1Heading = Selector("h1");
    const h2Headings = Selector("h2");
    const h3Headings = Selector("h3");

    await t.expect(h3Headings.exists).ok({ timeout: 45000 });

    const h2HeadingsWithH1Children = Selector("h2").sibling().find("h1");
    const h3Siblings = await h3Headings.sibling();
    const h3HeadingsWithH2Children = h3Headings.sibling().find("h2");
    const h3HeadingsWithH1Children = h3Siblings.find("h1");

    const bodySelector = <CustomSelector>Selector("body").addCustomMethods({
      getElementIndex: (node, elementSelector) => {
        const domList = Array.from(node.getElementsByTagName("*"));
        const searchedElement = node.querySelector(elementSelector);

        return domList.indexOf(searchedElement);
      },
    });

    const firstH1Index = await bodySelector.getElementIndex("h1");
    const firstH2Index = await bodySelector.getElementIndex("h2");
    const firstH3Index = await bodySelector.getElementIndex("h3");

    await t
      .expect(h1Heading.count)
      .eql(1)
      .expect(h2Headings.count)
      .gte(1)
      .expect(h2HeadingsWithH1Children.count)
      .eql(0)
      .expect(h3Siblings.length === 0 ? 0 : await h3HeadingsWithH2Children.count)
      .eql(0)
      .expect(h3HeadingsWithH1Children.count)
      .eql(0);

    // check the right order of headers
    if (await h1Heading.exists) {
      await t.expect(firstH1Index).lt(firstH2Index);
    }

    if (await h3Headings.exists) {
      await t.expect(firstH2Index).lt(firstH3Index);
    }
  });

export const testValidCanonicalUrl = (expectedCanonical: string) =>
  test("Canonical url is present and no noindex tag", async t => {
    const canonical = await Selector("head link")
      .withAttribute("rel", "canonical")
      .getAttribute("href");
    const normalizedCanonical = canonical.replace("https://staging.", "https://");

    await t.expect(normalizedCanonical).eql(expectedCanonical);
  });

export const testPageIndexed = (isPageIndexed = true) => {
  test(`Page is${!isPageIndexed ? " not " : " "}indexed by robots`, async t => {
    const noIndexTag = Selector("head meta").withAttribute("content", "noindex");

    await t.expect(noIndexTag.exists).eql(!isPageIndexed);
  });
};

// TODO: back description limit to 168 characters
export const testRequiredSEOMetaTags = ({ descriptionLimit = 200, titleLimit = 60 } = {}) =>
  test("Has correct title, description and open graph tags", async t => {
    const title = await Selector("title").innerText;
    const metaTags = Selector("head").child("meta");
    const description = await metaTags.withAttribute("name", "description").getAttribute("content");
    const ogTitle = await metaTags.withAttribute("property", "og:title").getAttribute("content");
    const ogDescription = await metaTags
      .withAttribute("property", "og:description")
      .getAttribute("content");
    const ogImages = await metaTags.withAttribute("property", "og:image");
    await t
      .expect(title.length)
      .gt(0)
      .expect(title.length)
      .lte(titleLimit)
      .expect(ogTitle.length)
      .gt(0)
      .expect(ogTitle.length)
      .lte(titleLimit)
      .expect(description.length)
      .gt(0)
      .expect(description.length)
      .lte(descriptionLimit)
      .expect(ogDescription.length)
      .gt(0)
      .expect(ogDescription.length)
      .lte(descriptionLimit)
      .expect(ogImages.count)
      .gt(0);
  });

export const validateHreflangs = (expectedCanonical: string) =>
  test("Make sure hreflangs/canonical are valid and do not have zh or zh_CN in them", async t => {
    const head = Selector("head");
    const hreflangs = head.child("link").withAttribute("hreflang");
    const canonical = head.child("link").withAttribute("rel", "canonical");

    await t
      .expect(hreflangs.count)
      .gt(0)
      .expect(hreflangs.withAttribute("href", /\/zh/).exists)
      .notOk()
      .expect(hreflangs.withAttribute("href", /\/zh_CN/).exists)
      .notOk()
      .expect(canonical.withAttribute("href", /\/zh/).exists)
      .notOk()
      .expect(canonical.withAttribute("href", /\/zh_CN/).exists)
      .notOk()
      .expect(
        canonical.withAttribute("href", new RegExp(expectedCanonical.split("https://")[0])).exists
      )
      .ok();
  });

export const validateHrefLangsForNotIndexedPage = () =>
  test("Make sure hreflangs are not present for not indexed page", async t => {
    const head = Selector("head");
    const hreflangs = head.child("link").withAttribute("hreflang");

    await t.expect(hreflangs.count).eql(0);
  });
