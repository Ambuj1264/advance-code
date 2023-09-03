/* eslint-disable no-restricted-syntax,no-restricted-globals,consistent-return,no-underscore-dangle,no-console,@typescript-eslint/no-use-before-define,func-names */
// Service worker file is adapted from React-storefront SW:
// https://github.com/react-storefront-community/react-storefront/blob/master/service-worker/service-worker.js
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { CacheOnly, NetworkOnly, NetworkFirst } from "workbox-strategies";
import { skipWaiting, clientsClaim } from "workbox-core";
import { addRoute, PrecacheController, getCacheKeyForURL } from "workbox-precaching";

import { cleanPrecacheManifest, prepareGTEManifest, prepareGTIManifest } from "utils/swHelpers";

const precacheController = new PrecacheController();
const IS_AMP_REGEX = /([?&]amp=1|amp=true)(&.*)?$/;
const IS_API_REGEX = /\/(client-api|api\/)/;
const appShellPath = "/appShell";
const PREFETCH_CACHE_MISS = 412;
const INSTALL_PRECACHE_DELAY = 4 * 1000; // delay before sw precaching process kicks in
let runtimeCacheOptions = {};
const abortControllers = new Set();
const toResume = new Set();
const prefetchControllers = new Map();
const abortedPrefetchRequestPaths = {};

/**
 * Configures parameters for cached routes.
 * @param {Object} options
 * @param {Object} options.maxEntries The max number of entries to store in the cache
 * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
 */
function configureRuntimeCaching({ maxEntries = 200, maxAgeSeconds = 60 * 60 * 24 } = {}) {
  console.log(
    `[service worker] configureRuntimeCaching, maxEntries: ${maxEntries}, maxAgeSeconds: ${maxAgeSeconds}`
  );

  runtimeCacheOptions = {
    plugins: [
      new ExpirationPlugin({
        maxEntries,
        maxAgeSeconds,
      }),
    ],
  };
}

configureRuntimeCaching();

// adds layer0_prefetch=1 query param to the URL and removes temporary layer0_prefetch graphql variable
function appendPrefetchQueryParam(req, queryParam = "layer0_prefetch") {
  const {
    cache,
    credentials,
    headers,
    integrity,
    method,
    mode,
    redirect,
    referrer,
    referrerPolicy,
    url,
    body,
  } = req;

  // remove temp layer0_prefetch key from `variables` query param which is sent by the client
  const cleanUrl = url.replace(`%2C%22${queryParam}%22%3A1`, "");
  // add layer0_prefetch query param to the url
  const urlWithPrefetchQuery = cleanUrl.includes("?")
    ? `${cleanUrl}&${queryParam}=1`
    : `${cleanUrl}?${queryParam}=1`;

  return new Request(urlWithPrefetchQuery, {
    cache,
    credentials,
    headers,
    integrity,
    method,
    mode,
    redirect,
    referrer,
    referrerPolicy,
    body,
  });
}

/**
 * Fetches and caches all links with data-rsf-prefetch="prefetch"
 * @param {Object} response
 */
function precacheLinks(response) {
  return response.text().then(html => {
    const matches = html.match(/href="([^"]+)"\sdata-rsf-prefetch/g);
    if (matches) {
      return Promise.all(
        matches.map(match => match.match(/href="([^"]+)"/)[1]).map(path => cachePath({ path }))
      );
    }
    return Promise.resolve();
  });
}

/**
 * Fetches and caches the specified path.
 * @param {Object} options Cache path options
 * @param {String} options.path A URL path
 * @param {String} options.apiVersion The version of the api that the client is running
 * @param {Boolean} cacheLinks Set to true to fetch and cache all links in the HTML returned
 */
// eslint-disable-next-line default-param-last
function cachePath({ path, apiVersion, locale } = {}, cacheLinks) {
  const cacheName = getAPICacheName(apiVersion, locale);

  return caches.open(cacheName).then(cache => {
    cache.match(path).then(match => {
      if (!match) {
        console.log("[service worker]", "prefetching", path);

        // Create an abort controller so we can abort the prefetch if a more important
        // request is sent.
        const abort = new AbortController();

        // Save prefetching arguments if we need to resume a cancelled request
        // eslint-disable-next-line functional/immutable-data
        abort.args = [{ path: [path], apiVersion }, cacheLinks];
        abortControllers.add(abort);

        // We connect the fetch with the abort controller here with the signal
        fetch(path, {
          credentials: "include",
          signal: abort.signal,
        })
          .then(response => {
            return (cacheLinks ? precacheLinks(response.clone()) : Promise.resolve()).then(() => {
              if (response.status === 200) {
                response.text().then(data => {
                  addToCache(cache, path, data, response.headers.get("content-type"));
                  console.log(`[service worker] ${path} was prefetched and added to ${cacheName}`);
                });
              } else if (response.status === PREFETCH_CACHE_MISS) {
                console.log(`[service worker] ${path} was throttled.`);
              } else {
                console.log(
                  `[service worker] ${path} was not prefetched, returned status ${response.status}.`
                );
              }
            });
          })
          .then(() => abortControllers.delete(abort))
          .catch(() => {
            console.log("[service worker] aborted prefetch for", path);
          });
      }
    });
  });
}

/**
 * Abort and queue all in progress prefetch requests for later. You can call this method to ensure
 * that prefetch requests do not block more important requests, like page navigation.
 */
function abortPrefetches() {
  const controllers = new Set([...abortControllers, ...prefetchControllers.values()]);

  for (const controller of controllers) {
    const { path, apiVersion, locale } = controller.args;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Array.isArray(path) &&
      path.forEach(p => {
        if (!p) return;

        // Count the number of times this precache request has failed
        // If it has failed three times or more we count the link as dead and abort it
        const prefetchRequestCount = abortedPrefetchRequestPaths[p];
        const prefetchRequestNextCount = prefetchRequestCount + 1;
        // eslint-disable-next-line functional/immutable-data
        abortedPrefetchRequestPaths[p] = prefetchRequestCount ? prefetchRequestNextCount : 1;
        if (prefetchRequestNextCount <= 3) {
          toResume.add({ path: p, apiVersion, locale });
        }
      });

    controller.abort();
  }
  abortControllers.clear();
  prefetchControllers.clear();
}

function abortPrefetch(key) {
  if (!prefetchControllers.has(key)) return;
  console.log(`[service worker] aborting prefetch ${key}`);

  const controller = prefetchControllers.get(key);
  controller.abort();
  prefetchControllers.delete(key);
}

/**
 * Resume queued prefetch requests which were cancelled to allow for more important requests
 */
function resumePrefetches() {
  console.log("[service worker] resuming prefetches");
  for (const args of toResume) {
    cachePath(args);
  }
  toResume.clear();
}

/**
 * Adds a result to the cache
 * @param {Cache} cache
 * @param {String} path The URL path
 * @param {String} data The response body
 * @param {String} contentType The MIME type
 */
function addToCache(cache, path, data, contentType) {
  const blob = new Blob([data], { type: contentType });

  const res = new Response(blob, {
    status: 200,
    headers: {
      "Content-Length": blob.size,
      date: new Date().toString(),
    },
  });

  return cache.put(path, res);
}

/**
 * Adds the specified data to the cache
 * @param? {Response} response object
 * @param {Object} options Cache state options
 * @param {String} options.path A URL path
 * @param {Object|String} options.cacheData The data to cache. Objects will be converted to JSON.
 * @param {String} options.apiVersion The version of the api that the client is running.
 */
function cacheState({ response, path, cacheData, apiVersion, locale } = {}) {
  if (response && response.status === PREFETCH_CACHE_MISS) {
    console.log(`[service worker] ${path} was throttled.`);
    return response;
  }

  if (response && response.status !== 200) {
    console.log(`[service worker] ${path} was not prefetched, returned status ${response.status}.`);
    return response;
  }

  const cacheName = getAPICacheName(apiVersion, locale);

  return caches.open(cacheName).then(cache => {
    let type = "text/html";

    if (typeof cacheData === "object") {
      type = "application/json";
      // eslint-disable-next-line no-param-reassign
      cacheData = JSON.stringify(cacheData, null, 2);
    }

    addToCache(cache, path, cacheData, type);
    console.log("[service worker]", `caching ${path}`);
  });
}

// provide the message interface that allows the PWA to prefetch
// and cache resources.
self.addEventListener("message", event => {
  if (event.data && event.data.action) {
    const { action } = event.data;

    if (action === "cache-path") {
      cachePath(event.data, event.data.cacheLinks);
    } else if (action === "cache-state") {
      cacheState(event.data);
    } else if (action === "configure-runtime-caching") {
      configureRuntimeCaching(event.data.options);
    } else if (action === "abort-prefetches") {
      abortPrefetches();
    } else if (action === "resume-prefetches") {
      resumePrefetches();
    } else if (action === "abort-prefetch") {
      abortPrefetch(event.data.key);
    } else if (action === "clear-old-cache") {
      clearApiCaches(event.data.apiVersion, event.data.locale);
    }
  }
});

const isApiRequest = path => !!path.match(IS_API_REGEX);

/**
 * Gets the name of the versioned runtime cache
 * @param {String} apiVersion The api version
 * @return {String} A cache name
 */
function getAPICacheName(apiVersion, locale) {
  return `runtime-${apiVersion}-${locale || ""}`;
}

/**
 * Clears old api caches
 * @param {String} apiVersion The api version
 * @param {String} locale Current active locale in the app
 */
function clearApiCaches(apiVersion, locale) {
  const currentCacheKey = getAPICacheName(apiVersion, locale);
  caches.keys().then(keys => {
    for (const key of keys) {
      if (key !== currentCacheKey) caches.delete(key);
    }
  });
}

// filter out chunks that we don't want to prefetch for all marketplaces
const manifestItems = cleanPrecacheManifest(self.__WB_MANIFEST || []);
const precacheManifestConfig = {
  "guidetoiceland.is": prepareGTIManifest(manifestItems),
  "guidetoeurope.com": prepareGTEManifest(manifestItems),
  "guidetothephilippines.ph": prepareGTIManifest(manifestItems),
  "iceland-photo-tours.com": prepareGTIManifest(manifestItems),
};

precacheController.addToCacheList(precacheManifestConfig[self.location.hostname] || manifestItems);

self.addEventListener("install", event => {
  // Deletes all runtime caches except the one for the current api version
  // We do this since we create a new versioned cache name every time we release
  // a new version of the app.  So if we didn't delete the old ones, we would just keep
  // using up local storage
  caches.keys().then(keys => {
    for (const key of keys) {
      if (!key.startsWith("workbox-precache")) caches.delete(key);
    }
  });
  // Cache non-amp version of pages when users land on AMP page
  // eslint-disable-next-line no-undef
  clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(allClients => {
      allClients
        .filter(path => path.url.match(IS_AMP_REGEX))
        .map(path => {
          const url = new URL(path.url);
          // remove "amp=1" from anywhere in url.search:
          const fixedSearch = (url.search || "").replace(IS_AMP_REGEX, "$2").replace(/^&/, "?");
          return url.pathname + fixedSearch;
        })
        .forEach(path => cachePath({ path }, true));
    });

  const delayedPrecache = new Promise(resolve => {
    setTimeout(() => {
      precacheController.install();
      resolve();
    }, INSTALL_PRECACHE_DELAY);
  });

  event.waitUntil(delayedPrecache);
});

self.addEventListener("activate", event => {
  event.waitUntil(precacheController.activate());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    (async function () {
      const { request } = event;
      const requestUrl = request.url;
      const apiVersion = request.headers.get("x-rsf-api-version");
      const locale = request.headers.get("x-travelshift-language");

      const shouldSkipCache =
        request.headers.get("x-travelshift-skip-cache") &&
        !request.headers.has("x-sw-cache-control");

      const shouldCachePath = isApiRequest(requestUrl) && apiVersion && locale && !shouldSkipCache;
      const referrer = request.headers.get("referrer");
      const isPrefetchRequest =
        requestUrl.includes("layer0_prefetch") || Boolean(request.headers.get("x-layer0-prefetch"));

      let actualRequest = request;
      if (shouldCachePath && !isPrefetchRequest) {
        actualRequest = new Request(request, {
          ...(referrer ? { referrer } : {}),
        });
      }
      if (isPrefetchRequest) {
        actualRequest = appendPrefetchQueryParam(request);
      }

      const abortController = addPrefetchController(
        request.headers.get("x-prefetch-key"),
        actualRequest.url,
        apiVersion
      );

      if (!isPrefetchRequest || (isPrefetchRequest && prefetchControllers.size === 0)) {
        abortPrefetches();
      }

      try {
        const cachedResponse = await tryGetFromCache(request, apiVersion, locale);
        if (cachedResponse) {
          return cachedResponse;
        }

        return await fetch(
          actualRequest,
          abortController
            ? {
                signal: abortController.signal,
              }
            : undefined
        )
          .then(response => {
            // On error responces the clientapi sets a max-ago=0
            const isErrorResponse =
              response.headers.get("Cache-Control") &&
              response.headers.get("Cache-Control").trim() === "max-age=0";
            if (shouldCachePath && !isErrorResponse) {
              addResponseToCache(response, requestUrl, apiVersion, locale);
            }
            return response;
          })
          .catch(() => {});
      } finally {
        if (toResume.size) {
          resumePrefetches();
        }
      }
    })()
  );
});

async function tryGetFromCache(request, apiVersion, locale) {
  if (!apiVersion || !locale) return;

  const requestUrl = request.url;
  const cacheControl = Number(request.headers.get("x-sw-cache-control")) || 0;
  const cacheName = getAPICacheName(apiVersion, locale);
  const cacheResponse = await caches.open(cacheName).then(cache => cache.match(request));

  if (cacheResponse) {
    if (!cacheControl) return cacheResponse;

    const timeOfResponse = new Date(cacheResponse.headers.get("date")).getTime();
    // Checks if the response is outdated, if it is we need to remove it from the cache and update the data
    const isValidCachedResponse = (Date.now() - timeOfResponse) / 1000 < cacheControl;
    if (isValidCachedResponse) return cacheResponse;
    await caches.open(cacheName).then(cache => cache.delete(request));
  }

  const preCacheResponse = await caches
    .open(cacheName)
    .then(cache => cache.match(getCacheKeyForURL(requestUrl) || {}));

  if (preCacheResponse) {
    return preCacheResponse;
  }
}

function addPrefetchController(prefetchKey, requestUrl, apiVersion) {
  if (!prefetchKey) return;
  let abortController;

  if (prefetchControllers.has(prefetchKey)) {
    abortController = prefetchControllers.get(prefetchKey);
    if (!abortController.args.path.includes(requestUrl)) {
      // eslint-disable-next-line functional/immutable-data
      abortController.args.path.push(requestUrl);
    }
  } else {
    abortController = new AbortController();
    // eslint-disable-next-line functional/immutable-data
    abortController.args = {
      path: [requestUrl],
      apiVersion,
    };
    prefetchControllers.set(prefetchKey, abortController);
  }

  return abortController;
}

function addResponseToCache(response, requestUrl, apiVersion, locale) {
  return response
    .clone()
    .text()
    .then(text =>
      cacheState({
        response,
        path: requestUrl,
        apiVersion,
        cacheData: text,
        locale,
      })
    )
    .catch(e => console.log(`[service worker: error caching ${requestUrl}]`, e));
}

/**
 * Returns true if the URL uses https
 * @param {Object} context
 * @return {Boolean}
 */
function isSecure(context) {
  return context.url.protocol === "https:" || context.url.hostname === "localhost";
}

/**
 * Returns true if the URL is for a static asset like a js chunk
 * @param {Object} context
 * @return {Boolean}
 */
function isStaticAsset(context) {
  return context.url.pathname.startsWith("/_next/static/") || context.url.pathname === "/sw.js";
}

/**
 * Returns true if the URL is for an amp page
 * @param {URL} url
 * @return {Boolean}
 */
function isAmp(url) {
  return !!(url.search || "").match(IS_AMP_REGEX);
}

/**
 * Returns true of the request is for a video file
 * @param {Object} context
 * @return {Boolean}
 */
function isVideo(context) {
  return !!context.url.pathname.match(/\.mp4(\?.*)?$/);
}

const matchRuntimePath = context => {
  return (
    isSecure(context) /* non secure requests will fail */ &&
    !isStaticAsset(context) /* let precache routes handle those */ &&
    !isVideo(context)
  ); /* Safari has a known issue with service workers and videos: https://adactio.com/journal/14452 */
};

function offlineResponse(apiVersion, context) {
  if (isApiRequest(context.url.pathname)) {
    const offlineData = { page: "Offline" };
    const blob = new Blob([JSON.stringify(offlineData, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Length": blob.size,
      },
    });
  }
  // If not API request, find and send app shell
  const cacheName = getAPICacheName(apiVersion);
  const req = new Request(appShellPath);
  return caches.open(cacheName).then(cache => cache.match(req));
}

registerRoute(matchRuntimePath, async context => {
  try {
    const { url, event } = context;
    const { headers } = event.request;
    const apiVersion = headers.get("x-rsf-api-version");
    const locale = headers.get("x-travelshift-language");
    const cacheName = getAPICacheName(apiVersion, locale);
    const cacheOptions = { ...runtimeCacheOptions, cacheName };

    if (isAmp(url)) {
      cachePath({ path: url.pathname + url.search, apiVersion }, true);
    }

    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
      return;
    }

    if (!apiVersion) {
      return new NetworkOnly().handle(context);
    }
    // Check the cache for all routes. If the result is not found, get it from the network.
    return new CacheOnly(cacheOptions)
      .handle(context)
      .catch(() =>
        new NetworkOnly().handle(context).then(apiRes => {
          // 1. withReactStorefront should create a api_version value, which can just be the timestamp of the build
          // 2. it provide that to client and server build as a webpack define
          // 3. we should monkey-patch xhr to send x-rsf-api-version as a request header on all requests

          const resContentLength = Number(apiRes.headers.get("content-length") || 0);
          const resCacheControl = apiRes.headers.get("cache-control");
          // keeping check for 0 just in case, for servers that might not return length header at all
          const resHasData = resContentLength >= 300 || resContentLength === 0;
          const isPrivateRes =
            resCacheControl.includes("private") || resCacheControl.includes("max-age=0");

          if (apiRes.headers.has("x-sw-cache-control") && resHasData && !isPrivateRes) {
            const path = url.pathname;

            caches.open(cacheName).then(cache => {
              cache.put(path, apiRes);
              console.log("[service worker]", `caching ${path}`);
            });
          }

          return apiRes.clone();
        })
      )
      .catch(() => offlineResponse(apiVersion, context));
  } catch (e) {
    // if anything goes wrong, fallback to network
    // this is critical - if there is a bug in the service worker code, the whole site can stop working
    console.warn("[service worker]", "caught error in service worker", e);
    return new NetworkOnly().handle(context);
  }
});

skipWaiting();
clientsClaim();
addRoute();

registerRoute(
  /^https?.*/,
  new NetworkFirst({
    cacheName: "offlineCache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);
