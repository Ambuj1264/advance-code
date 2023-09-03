declare module "find-my-way/lib/strategies/accept-host" {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { ConstraintStrategy } from "find-my-way";
  // eslint-disable-next-line import/no-extraneous-dependencies
  import hostStrategy from "find-my-way/lib/strategies/accept-host";

  export = hostStrategy as ConstraintStrategy;
}

declare module "fastify/lib/symbols" {
  import symbols from "fastify/lib/symbols";

  export = symbols;
}
