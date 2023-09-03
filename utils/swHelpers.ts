// this file should not contain any imports, it's included to sw.js!

export type swManifest = {
  revision: string;
  url: string;
}[];

export function cleanPrecacheManifest(manifest: swManifest) {
  return manifest.filter(
    ({ url }) =>
      !url.endsWith("_buildManifest.js") &&
      !url.endsWith("_ssgManifest.js") &&
      !url.endsWith(".html") &&
      !url.includes("pages/errorStatic") &&
      !url.includes("pages/_error") &&
      !url.includes("pages/cmsPreview") &&
      !url.includes("pages/voucher") &&
      !url.includes("pages/payment") &&
      !url.includes("user") &&
      !url.includes("pages/cart") &&
      !url.includes("pages/tripPlanner") &&
      !url.includes("pages/index") &&
      !url.includes("pages/gteFrontPage") &&
      !url.includes("pages/gtePostBooking") &&
      !url.includes("pages/savedCards") &&
      !url.includes("pages/paymentLink") &&
      !url.includes("chunks/sentry") &&
      !url.includes("baidu-maps") &&
      !url.match(/chunks\/\d/)
  );
}

export function prepareGTIManifest(manifest: swManifest) {
  return manifest.filter(({ url }) => !url.includes("pages/gte") && !url.includes("pages/flight"));
}
export function prepareGTEManifest(manifest: swManifest) {
  return manifest.filter(
    ({ url }) =>
      !url.includes("pages/") || url.includes("pages/gte") || url.includes("pages/flight")
  );
}
