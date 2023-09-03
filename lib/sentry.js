import * as Sentry from "@sentry/node"; // Aliased in next.config

export function captureException(err, ctx) {
  Sentry.configureScope(scope => {
    if (err.message) {
      // De-duplication currently doesn't work correctly for SSR / browser errors
      // so we force deduplication by error message if it is present
      scope.setFingerprint([err.message]);
    }

    if (err.statusCode) {
      scope.setExtra("statusCode", err.statusCode);
    }

    if (ctx) {
      const { req, res, errorInfo, tags, query, pathname, componentName, operationName, forceSSR } =
        ctx;
      if (componentName) {
        scope.setTag("componentName", componentName);
      }
      if (operationName) {
        scope.setTag("operationName", operationName);
      }
      if (res && res.statusCode) {
        scope.setExtra("statusCode", res.statusCode);
      }

      if (typeof window !== "undefined") {
        scope.setTag("ssr", Boolean(forceSSR));
        scope.setExtra("query", query);
        scope.setExtra("pathname", pathname);
      } else {
        scope.setTag("ssr", true);
        if (req) {
          scope.setExtra("url", req.url);
          scope.setExtra("method", req.method);
          scope.setExtra("headers", req.headers);
          scope.setExtra("params", req.params);
          scope.setExtra("query", req.query);
        }
      }

      if (errorInfo) {
        Object.keys(errorInfo).forEach(key => scope.setExtra(key, errorInfo[key]));
      }

      if (tags) {
        Object.keys(tags).forEach(key => scope.setTag(key, tags[key]));
      }
    }
  });

  return Sentry.captureException(err);
}
