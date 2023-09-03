import { ClientFunction, Selector, RequestMock } from "testcafe";

const mockedResponse = Buffer.from([]);
export const helloBarRequestMock = RequestMock()
  .onRequestTo(/https:\/\/my.hellobar.com\/modules.js/)
  .respond(mockedResponse, 200, {
    "content-length": mockedResponse.length.toString(),
    "content-type": "text/javascript",
  });
export const cookieBotRequestMock = RequestMock()
  .onRequestTo(/https:\/\/consent.cookiebot.com\/uc.js/)
  .respond(mockedResponse, 200, {
    "content-length": mockedResponse.length.toString(),
    "content-type": "text/javascript",
  });

export const getLocation = ClientFunction(() => document.location.href);

export const scrollDown300px = ClientFunction(() =>
  window.scrollTo({ top: 300, behavior: "smooth" })
);

export const desktopTestSetup = async t => {
  await t.resizeWindow(1280, 720);
};

export const scrollToBottom = ClientFunction(() => {
  const footerOffsetTop = document.getElementById("main-footer")?.offsetTop;

  window.scrollTo({ top: footerOffsetTop, behavior: "smooth" });
});

const appReadySelector = Selector("style").withAttribute("data-emotion").with({
  visibilityCheck: true,
  timeout: 5000,
});

export const fixtureDesktop = (
  name: string,
  url?: string,
  requestHooks?: object[],
  beforeEach?: (t: TestController) => Promise<void>
) =>
  fixture(name)
    .page(url || "about:blank")
    .requestHooks([helloBarRequestMock, cookieBotRequestMock, ...(requestHooks || [])])
    .beforeEach(async t => {
      await desktopTestSetup(t);
      await beforeEach?.(t);
    });

export const fixtureMobile = (name: string, url: string) =>
  fixture(name)
    .page(`about:blank`)
    .requestHooks([helloBarRequestMock, cookieBotRequestMock])
    .beforeEach(async t => {
      await t.resizeWindowToFitDevice("iphone8plus", {
        portraitOrientation: true,
      });

      await t.navigateTo(url);
      await t.expect(appReadySelector.exists).ok("", { timeout: 5000 });
      await ClientFunction(() => window.scrollTo({ top: 50, behavior: "smooth" }))();
    });

export const disabledInputFix = () =>
  ClientFunction(selector => {
    document.querySelector(selector).removeAttribute("disabled");
    // eslint-disable-next-line functional/immutable-data
    document.querySelector(selector).style.display = "block";
  });

export const makeSureGetIsSafe = (selector: Selector, t: TestController) =>
  t.expect(selector.exists).ok({ timeout: 45000 });

export const checkConsoleWarningsForMissingRequestHookFields = async t => {
  const { warn } = await t.getBrowserConsoleMessages();
  const warningsForMissingMockGraphQlFields = warn.filter((message: string) =>
    /^Missing field/.test(message)
  );

  if (warningsForMissingMockGraphQlFields.length) {
    console.warn(
      "\x1b[36m%s\x1b[0m",
      "\t👉 your request hook mock files have to be updated due to missing data:"
    );
    console.log(warningsForMissingMockGraphQlFields);
  }
};
