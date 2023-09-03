// eslint-disable-next-line
import _newrelic from "newrelic";

import "isomorphic-unfetch";

import type { NextConfig } from "next";
import { createLightship, type Lightship } from "lightship";

import { getEnvWithDefaults } from "./serverUtils";
import CustomNextServerlessServer from "./CustomNextServerlessServerStandalone";
import getFastifyServer from "./getFastifyServer";

// NOTE: this file is bundled to .next/standalone/server.js
// therefore dirname at runtime will be `standalone` dir.
const nextConfig = __non_webpack_require__("./next.config");
const { CLIENT_API_URI, PORT } = getEnvWithDefaults();
const dev = false;

(async function main() {
  const lightship: Lightship = await createLightship({
    // This value should match `readinessProbe.periodSeconds`
    shutdownDelay: 10000,
  });

  const nextStandaloneHandler = new CustomNextServerlessServer(
    {
      hostname: "localhost",
      port: PORT,
      dir: __dirname,
      dev,
      conf: {
        ...nextConfig,
        distDir: ".next",
        amp: {},
        publicRuntimeConfig: getEnvWithDefaults(),
        serverRuntimeConfig: getEnvWithDefaults(),
      } as NextConfig,
    },
    CLIENT_API_URI
  ).getRequestHandler();

  const { server } = getFastifyServer(dev, nextStandaloneHandler, nextStandaloneHandler);

  lightship.registerShutdownHandler(() => {
    server.close();
  });

  // TODO static error pages?
  // fastify.setErrorHandler(function (error, request, reply) {
  //   if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
  //     // Log error
  //     this.log.error(error)
  //     // Send error response
  //     reply.status(500).send({ ok: false })
  //   } else {
  //     // fastify will use parent error handler to handle this
  //     reply.send(error)
  //   }
  // })
  // endregion handle routes

  const readyCb = (err: Error | null) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error("startup error", err);
      server.log.error(err);
      lightship.shutdown();
      process.exit(1);
    } else {
      lightship.signalReady();
    }
  };

  server.listen({ port: PORT, host: "0.0.0.0" }, readyCb);

  await lightship.whenFirstReady();
})();
