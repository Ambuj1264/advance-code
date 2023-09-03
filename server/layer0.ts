import path from "path";

import newrelic from "newrelic";
import express, { NextFunction, Request, Response } from "express";
import * as Sentry from "@sentry/node";
import getNextConfig from "@layer0/next/getNextConfig";

import routes from "../shared/routes";

import CustomNextServerlessServer, { tempPageNameHeader } from "./CustomNextServerlessServer";
import { getEnv } from "./serverUtils";

const createCustomServer = (port: number) => {
  const {
    NODE_ENV,

    CLIENT_API_URI = "guidetoiceland.is",
  } = getEnv();
  const dev = NODE_ENV !== "production";
  const WORKER_MEM_LIMIT = 1100;
  const server = express();
  const webpackConfig = getNextConfig();
  const nextStandaloneHandle = new CustomNextServerlessServer(
    {
      hostname: "localhost",
      port,
      dir: path.resolve(__dirname, ".."),
      dev: false,
      conf: webpackConfig,
      minimalMode: true,
    },
    CLIENT_API_URI
  ).getRequestHandler();

  server.disable("x-powered-by");

  server.use(Sentry.Handlers.requestHandler());

  server.use(routes.getLocaleHandlers());

  // https://github.com/layer0-docs/layer0-connectors/blob/87321df0b375cabc259149f0c3e1fadeb031685b/layer0-next-connector/src/prod.ts#L31-L31
  // eslint-disable-next-line functional/immutable-data
  webpackConfig.experimental.isrFlushToDisk = false;

  server.use(async function nextRouting(req: Request, res: Response, next: NextFunction) {
    const { path: reqPath, hostname } = req;
    if (reqPath || hostname) {
      newrelic.setTransactionName(`${hostname}${reqPath}`);
    }

    await nextStandaloneHandle(req, res);

    next();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.use(Sentry.Handlers.errorHandler(), (_error, _req, res, next) => {
    res.status(500);
    console.log(_error);
    res.end(`internal server error!`);

    next();
  });

  // Trying to avoid OOM on layer0
  // handler to keep an eye on memory usage and kill the workers when limit is met
  if (!dev) {
    server.use((_req, res) => {
      const memoryUsage = process.memoryUsage();
      const memUsageMb = Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100;
      const pageNameHeader = res.getHeader(tempPageNameHeader);

      if (!res.headersSent) {
        res.removeHeader(tempPageNameHeader);
      }

      if (pageNameHeader && memUsageMb > WORKER_MEM_LIMIT) {
        setImmediate(() => {
          // global.listen is set in prod.js
          // @ts-ignore
          global.listen.close((err: Error) => {
            process.exit(err ? 1 : 0);
          });
        });
      }
    });
  }

  return server;
};

export default createCustomServer;
