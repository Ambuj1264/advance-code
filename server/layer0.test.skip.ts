/**
 * @jest-environment node
 */
import { Server } from "http";
import path from "path";

import { Request, Response } from "express";
import fetch from "node-fetch";

import server from "./layer0";

jest.mock("./utils", () => ({
  __esModule: true, // this property makes it work
  getEnv: () => ({
    NODE_ENV: "production",
    CLIENT_API_URI: "guidetoiceland.is",
    CLIENT_API_PROTOCOL: "https",
  }),
}));

let s: Server;
let resolveSpy: jest.SpyInstance;
// eslint-disable-next-line functional/immutable-data,no-eval,no-underscore-dangle
const globRequire = global.__non_webpack_require__;
const stubEval = jest.fn();

beforeEach(done => {
  /* start of global overrides */
  resolveSpy = jest.spyOn(path, "resolve").mockReturnValue("/fakepath");
  resolveSpy = jest.spyOn(path, "join").mockReturnValue("/fakepath");
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.listen = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {},
  };
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data,no-eval,no-underscore-dangle
  global.__non_webpack_require__ = arg => stubEval()(arg);
  /* end of global overrides */

  const port = 3001;

  try {
    s = server(port).listen(port, () => {
      console.log("test layer0 server");
      done();
    });
  } catch (e) {
    // TODO: fix this test
    // next.js cannot be launched without build, not sure how to overcome this yet
    console.log(e);
  }
});

afterEach(done => {
  /* start of restoring global overrides */
  resolveSpy.mockRestore();
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.listen = {
    close: undefined,
  };

  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data,no-eval,no-underscore-dangle
  global.__non_webpack_require__ = globRequire;

  /* end of restoring global overrides */

  s.close(() => {
    // eslint-disable-next-line no-console
    console.log("Shutting down the server...");
    done();
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

const mockSuccessPageRender = (serverlessNextPage: string) => ({
  render: (_req: Request, res: Response) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise(resolve => setTimeout(resolve, 250)).then(() => {
      res.end(`server expected to render ${serverlessNextPage.replace("//", "/")})`);
    }),
});

describe("layer0 server setup", () => {
  it("matches path for the GTE homepage", async () => {
    stubEval.mockReturnValue(mockSuccessPageRender);
    const fetchResult = await fetch("http://localhost:3001/", {
      headers: {
        "x-travelshift-url-front": "https://guidetoeurope.com",
      },
    });

    expect(await fetchResult.text()).toContain(".next/serverless/pages/gteFrontPage");
  });

  it("matches path for the GTI homepage", async () => {
    stubEval.mockReturnValue(mockSuccessPageRender);
    const fetchResult = await fetch("http://localhost:3001/", {
      headers: {
        "x-travelshift-url-front": "https://guidetoiceland.is",
      },
    });
    expect(await fetchResult.text()).toContain(".next/serverless/pages/");
  });
  it("matches the cart page route", async () => {
    stubEval.mockReturnValue(mockSuccessPageRender);
    const fetchResult = await fetch("http://localhost:3001/cart", {
      headers: {
        "x-travelshift-url-front": "https://guidetoeurope.com",
      },
    });
    expect(await fetchResult.text()).toContain(".next/serverless/pages/cart");
  });

  it("returns _error page for unknown route", async () => {
    stubEval.mockReturnValue(mockSuccessPageRender);
    const fetchResult = await fetch("http://localhost:3001/flubbidubi", {
      headers: {
        "x-travelshift-url-front": "https://guidetoeurope.com",
      },
    });
    expect(await fetchResult.text()).toContain(".next/serverless/pages/_error");
  });

  it("returns custom 500 page server-side code errors", async () => {
    stubEval.mockReturnValue(() => ({
      render: () => {
        throw new Error("error");
      },
    }));
    const fetchResult = await fetch("http://localhost:3001/", {
      headers: {
        "x-travelshift-url-front": "https://guidetoeurope.com",
      },
    });
    expect(await fetchResult.status).toBe(500);
    expect(await fetchResult.text()).toBe("internal server error, {}");
  });

  it("sets the headers for the found route page", async () => {
    stubEval.mockReturnValue(mockSuccessPageRender);
    const fetchResult = await fetch("http://localhost:3001/", {
      headers: {
        "x-travelshift-url-front": "https://guidetoeurope.com",
      },
    });
    expect(await fetchResult.headers.get("x-layer0-locale")).toBe("en");
    expect(await fetchResult.headers.get("X-Frame-Options")).toBe("sameorigin");
    expect(await fetchResult.headers.get("Content-Security-Policy")).toBe("frame-ancestors 'self'");
  });
});
