import { join } from "path";
import { existsSync } from "fs";
import { createServer } from "http";

import routes from "../shared/routes";

import server from "./layer0";

// eslint-disable-next-line no-eval
const next = require("next");

const dev = process.env.NODE_ENV !== "production";

if (!dev && !existsSync(join(process.cwd(), ".next"))) {
  // eslint-disable-next-line no-console
  console.warn(
    `\nNext.js production build not found. Please run "layer0 build"
     \nbefore running "layer0 run --production".\n`
  );
  process.exit();
}

async function run() {
  // compile the next.js app for development
  const app = next({ dev });
  await app.prepare();

  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  global.LAYER0_NEXT_APP = app;

  // eslint-disable-next-line no-console
  console.log("> Starting Next.js...");

  createServer(
    // @ts-ignore
    server(process.env.PORT).use(routes.getRouteHandler(app)).use(routes.getNextHandler(app))
  ).listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on ${process.env.PORT}`);
  });
}

run();
