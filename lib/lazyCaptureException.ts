type LibSentryType = {
  captureException: (err: Error | ErrorEvent, ctx?: any) => void;
};

// eslint-disable-next-line import/no-mutable-exports
export let SENTRY_INIT = false;

export const initSentry = () =>
  SENTRY_INIT
    ? Promise.resolve()
    : import(/* webpackChunkName: "sentry" */ "lib/initSentry-web").then(() => {
        SENTRY_INIT = true;
      });

const lazyCaptureException = async (err: Error | ErrorEvent, ctx?: any) => {
  await initSentry();
  const { captureException } = (await import(
    /* webpackChunkName: "sentry" */ "lib/sentry"
  )) as LibSentryType;

  return captureException(err, ctx);
};

export default lazyCaptureException;
