// eslint-disable-next-line
import _newrelic from "newrelic";
import https from "https";
import http from "http";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "isomorphic-unfetch";
import nextApp from "next";

import routes from "../shared/routes";

import { getEnvWithDefaults, isDev as getIsDev } from "./serverUtils";
import getFastifyServer, { CustomHandlerType } from "./getFastifyServer";
import { getDevHttpsOptions } from "./getDevHttpsOptions";

const { PORT, NEXTJS_DIR } = getEnvWithDefaults();
const isDev = getIsDev();

if (isDev && process.env.LOCAL_PROXY_AGENT === "true") {
  // eslint-disable-next-line global-require
  require("global-agent/bootstrap");
}

const app = nextApp({ dev: isDev, dir: NEXTJS_DIR });
const nextHandler = routes.getNextHandler(app) as CustomHandlerType;
const routeHandler: CustomHandlerType = (req, res) => {
  // TODO: fix type
  // @ts-ignore
  return routes.getRouteHandler(app, true)[0](req, res, () => {});
};
app.prepare().then(() => {
  const { devServer, server, isDevHttps } = getFastifyServer(isDev, nextHandler, routeHandler);

  const readyCb = (err: Error | null) => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http${isDevHttps ? "s" : ""}://localhost:${PORT}`);
    if (err) {
      // eslint-disable-next-line no-console
      console.error("startup error", err);
      server.log.error(err);
      process.exit(1);
    }
  };

  // eslint-disable-next-line no-console
  server.ready(() => {
    const localServer = isDevHttps
      ? https.createServer(getDevHttpsOptions(), devServer)
      : http.createServer(devServer);

    localServer.listen({ port: PORT }, () => readyCb(null));
  });
});
