import { pipe } from "fp-ts/lib/pipeable";
import { map, getOrElse, fromNullable } from "fp-ts/lib/Option";
import memoizeOne from "memoize-one";

import { SupportedLanguages, Marketplace, ThemeColor, CoreMarketplace } from "../types/enums";

import { capitalize } from "utils/globalUtils";
import translations from "shared/translations";
import { i18next } from "i18n";

export const removeAt = (index: number, array: ReadonlyArray<any>): ReadonlyArray<any> =>
  array.filter((_, i) => i !== index);

export const getColor = (color: Color, theme: Theme): string => {
  if (color === ThemeColor.Action) return theme.colors.action;
  if (color === ThemeColor.Primary) return theme.colors.primary;
  return color;
};

export const getIdFromName = (name: string | null): string => {
  if (!name) return "";

  return name
    .split(" ")
    .filter(value => value !== "")
    .map((value, index) => {
      return index === 0
        ? value.toLowerCase()
        : value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
    })
    .join("");
};

export const isBrowser = typeof window !== `undefined`;

export const getQueryParams = () =>
  isBrowser && window.location.search
    ? pipe(
        window.location.search
          .substring(1)
          .split("&")
          .map(urlParam => urlParam.split("="))
      )
    : [];

export const addLeadingSlashIfNotPresent = (uri: string) =>
  uri.indexOf("/") === 0 ? uri : `/${uri}`;

export const getNumberOfDays = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  return days === 0 ? 1 : days;
};

export const getTravelerText = (
  { adults, teenagers, children }: SharedTypes.NumberOfTravelers,
  t: TFunction
) => {
  if (teenagers === 0 && children === 0) {
    return t("{numberOfAdults} adults", {
      numberOfAdults: adults,
    });
  }
  if (teenagers > 0 && children === 0) {
    return t("{numberOfAdults} adults and {numberOfTeenagers} teenagers", {
      numberOfAdults: adults,
      numberOfTeenagers: teenagers,
    });
  }
  if (teenagers === 0 && children > 0) {
    return t("{numberOfAdults} adults and {numberOfChildren} children", {
      numberOfAdults: adults,
      numberOfChildren: children,
    });
  }
  return t(
    "{numberOfAdults} adults, {numberOfTeenagers} teenagers and {numberOfChildren} children",
    {
      numberOfAdults: adults,
      numberOfTeenagers: teenagers,
      numberOfChildren: children,
    }
  );
};

export const getAgeBandsText = (travelers: GTETourBookingWidgetTypes.AgeBand[], t: TFunction) =>
  t(
    travelers
      .map((currentTraveler, index) => {
        if (index === 0) {
          return `${currentTraveler.numberOfTravelers} ${capitalize(
            currentTraveler.ageBand.toLowerCase()
          )}`;
        }
        if (index === travelers.length - 1) {
          return ` & ${currentTraveler.numberOfTravelers} ${capitalize(
            currentTraveler.ageBand.toLowerCase()
          )}`;
        }
        return `, ${currentTraveler.numberOfTravelers} ${capitalize(
          currentTraveler.ageBand.toLowerCase()
        )}`;
      })
      .join("")
  );

export const getTravelerPriceText = (
  { adults, teenagers, children }: SharedTypes.NumberOfTravelers,
  t: TFunction
) => {
  if (teenagers === 0 && children === 0) {
    return t("Price for {numberOfAdults} adults", {
      numberOfAdults: adults,
    });
  }
  if (teenagers > 0 && children === 0) {
    return t("Price for {numberOfAdults} adults and {numberOfTeenagers} teenagers", {
      numberOfAdults: adults,
      numberOfTeenagers: teenagers,
    });
  }
  if (teenagers === 0 && children > 0) {
    return t("Price for {numberOfAdults} adults and {numberOfChildren} children", {
      numberOfAdults: adults,
      numberOfChildren: children,
    });
  }
  return t(
    "Price for {numberOfAdults} adults, {numberOfTeenagers} teenagers and {numberOfChildren} children",
    {
      numberOfAdults: adults,
      numberOfTeenagers: teenagers,
      numberOfChildren: children,
    }
  );
};

export const getCalculatePrice = (priceData?: QueryCalulatePriceData) =>
  pipe(
    fromNullable(priceData),
    map(({ prices }) => ({
      totalPrice: parseFloat(prices.totalPrice.replace(/,/g, "")),
      fullPrice: parseFloat(prices.fullPrice.replace(/,/g, "")),
      discountPrice: parseFloat(prices.discountPrice.replace(/,/g, "")),
    })),
    getOrElse(() => ({ totalPrice: 0, fullPrice: 0, discountPrice: 0 }))
  );

export const closestInteger = (number: number, divider: number) => {
  const c1 = number - (number % divider);
  const c2 = number + divider - (number % divider);

  if (number - c1 > c2 - number) {
    return c2;
  }
  return c1;
};

export const getTotalPages = (pages: number, itemsPerPage: number) =>
  Math.ceil(pages / itemsPerPage);

export const getNoLineBreakDescription = (description: string) => {
  return description.replace(/(\r\n|\n|\r)/gm, "");
};

export const getTruncationCutWithoutAnchor = ({
  content,
  truncationLength,
}: {
  content: string;
  truncationLength: number;
}) => {
  const firstTruncationVisible = content.substr(0, truncationLength);
  const firstTruncationRest = content.substr(truncationLength);
  const numberOpeningTagsInFirstCut = (firstTruncationVisible.match(/<a/g) || []).length;
  const numberOfClosingTagsInFirstCut = (firstTruncationVisible.match(/<\/a>/g) || []).length;
  const firstLinkEndsRest = firstTruncationRest.indexOf("</a>");
  const cutIndex =
    numberOpeningTagsInFirstCut === numberOfClosingTagsInFirstCut
      ? truncationLength
      : firstLinkEndsRest + 4 + truncationLength;

  const visibleDescription = content.substr(0, cutIndex);
  const restDescription = content.substr(cutIndex);
  return { visibleDescription, restDescription };
};

// Borrowed from https://gist.github.com/jed/982883#gistcomment-3123179
export const getUUID = (a = ""): string =>
  a
    ? /* eslint-disable no-bitwise */
      ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, getUUID);

export const partition = <T>(
  array: Array<T>,
  predicate: (elemt: T) => boolean
): [Array<T>, Array<T>] =>
  array.reduce(
    ([pass, fail], elem) => {
      return predicate(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[] as Array<T>, [] as Array<T>]
  );

export const removeDuplicates = (array: Array<GenericObject>, uniqueKeyIdentifier: string) =>
  array.filter(
    (currentValue: GenericObject, index: number, resultArray: Array<GenericObject>) =>
      resultArray.findIndex(
        (testValue: GenericObject) =>
          testValue[uniqueKeyIdentifier] === currentValue[uniqueKeyIdentifier]
      ) === index
  );

export const getLanguagePrefix = (activeLocale: SupportedLanguages, marketplace: Marketplace) =>
  activeLocale === SupportedLanguages.English ||
  (activeLocale === SupportedLanguages.Chinese && marketplace === Marketplace.GUIDE_TO_ICELAND)
    ? ""
    : `${activeLocale}/`;

export const getClientSideUrl = (
  pageType: string,
  activeLocale: SupportedLanguages,
  marketplace: Marketplace
) => {
  const languagePrefix = getLanguagePrefix(activeLocale, marketplace);
  const localeTranslations = translations[activeLocale];
  const routeUri = localeTranslations[`url:${pageType}`];
  return languagePrefix + routeUri;
};

export const getDuration = (durationInSeconds: number) => {
  const hours = Math.trunc(durationInSeconds / 3600);
  const remainingSeconds = durationInSeconds % 3600;
  const minutes = Math.trunc(remainingSeconds / 60);
  return [hours, minutes];
};

export const getHourDaysMinutesDuration = ({
  durationInSeconds,
}: {
  durationInSeconds: number;
}) => {
  const days = Math.trunc(durationInSeconds / (3600 * 24));
  const remainingSeconds = durationInSeconds % (3600 * 24);
  const [hours, minutes] = getDuration(remainingSeconds);
  return { days, hours, minutes };
};

export const getWithDefault = <T>({
  maybeValue,
  defaultValue,
}: {
  maybeValue?: T;
  defaultValue: T;
}) => maybeValue ?? defaultValue;

export const isInPreviewMode = (ssrCookie?: string) =>
  (typeof document !== "undefined" ? document.cookie : ssrCookie)?.includes("preview=1") ?? false;

export const getMissingNamespaces = (namespaces: string[], activeLocale: SupportedLanguages) =>
  typeof window === "undefined"
    ? namespaces
    : namespaces.filter(namespace => !i18next.hasResourceBundle(activeLocale, namespace));

export const getSplitNamespaces = (namespaces: string[]) => {
  const shouldSplitInThreeParts = namespaces.length > 2;
  if (shouldSplitInThreeParts) {
    const splitNamespacesAt = Math.ceil(namespaces.length / 3);
    const firstNamespaces = namespaces.slice(0, splitNamespacesAt);
    const secondSplitAt = splitNamespacesAt + splitNamespacesAt;
    const secondNamespaces = namespaces.slice(splitNamespacesAt, secondSplitAt);
    const lastNamespaces = namespaces.slice(secondSplitAt);
    return { firstNamespaces, secondNamespaces, lastNamespaces };
  }
  const hasTwoNamespaces = namespaces.length > 1;
  const splitNamespacesAt = Math.ceil(namespaces.length / 2);
  const firstNamespaces = hasTwoNamespaces ? namespaces.slice(0, splitNamespacesAt) : namespaces;
  const lastNamespaces = hasTwoNamespaces ? namespaces.slice(splitNamespacesAt) : [];
  return { firstNamespaces, secondNamespaces: [], lastNamespaces };
};

export const getResizeObserver = (callback: () => void): [ResizeObserver, { rafId?: number }] => {
  const mutableRequestAnimationFrameRef: { rafId?: number } = {
    rafId: undefined,
  };

  const resizeObserver = new ResizeObserver(entries => {
    // We wrap it in requestAnimationFrame to avoid resize observer loop error
    const rafId = window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) return;
      callback();
    });
    if (mutableRequestAnimationFrameRef) {
      // eslint-disable-next-line functional/immutable-data
      mutableRequestAnimationFrameRef.rafId = rafId;
    }
  });

  return [resizeObserver, mutableRequestAnimationFrameRef];
};

export const isTouchDevice = () => isBrowser && window.matchMedia("(pointer: coarse)").matches;

export const normalizeGraphCMSLocale = (activeLocale: string) =>
  activeLocale === SupportedLanguages.Chinese ? SupportedLanguages.LegacyChinese : activeLocale;

const commonEntities = {
  lt: "<",
  gt: ">",
  sol: "/",
  quot: '"',
  apos: "'",
  amp: "&",
  copy: "©",
  reg: "®",
  deg: "°",
  laquo: "«",
  raquo: "»",
  nbsp: " ",
  trade: `™`,
  hellip: `…`,
  mdash: `—`,
  bull: `•`,
  ldquo: `“`,
  rdquo: `”`,
  lsquo: `‘`,
  rsquo: `’`,
  larr: `←`,
  rarr: `→`,
  darr: `↓`,
  uarr: `↑`,
};

export const decodeHtmlEntity = (str: string) => {
  return str
    .replace(/&#(\d+);/g, (_match: string, dec: number) => {
      return String.fromCharCode(dec);
    })
    .replace(
      new RegExp(`&(${Object.keys(commonEntities).join("|")});`, "g"),
      (_match: string, entity: keyof typeof commonEntities) => {
        return commonEntities[entity];
      }
    );
};

export const decodeHTMLTitle = (title: string | undefined) => {
  // eslint-disable-next-line prefer-regex-literals
  const specialCharRegex = new RegExp(/[#&;]/);
  if (title && specialCharRegex.test(title)) return decodeHtmlEntity(title);
  return title;
};

export const getHttpsUrl = (url?: string) => url?.replace(/^http:\/\//i, "https://");

export const getNumberOfTravellers = ({
  adults,
  children,
  infants,
}: {
  children?: number;
  infants?: number;
  adults?: number;
}): number => {
  return (adults ?? 0) + (children ?? 0) + (infants ?? 0);
};

export const removeTrailingCommas = (text: string) => {
  return text.replace(/,\s*$/, "");
};

export const getCoreMarketPlace = (marketplace: Marketplace): CoreMarketplace => {
  switch (marketplace) {
    case Marketplace.GUIDE_TO_EUROPE:
      return CoreMarketplace.GUIDE_TO_EUROPE;
    case Marketplace.GUIDE_TO_ICELAND:
      return CoreMarketplace.GUIDE_TO_ICELAND;
    case Marketplace.GUIDE_TO_THE_PHILIPPINES:
      return CoreMarketplace.GUIDE_TO_THE_PHILIPPINES;
    case Marketplace.ICELAND_PHOTO_TOURS:
      return CoreMarketplace.ICELAND_PHOTO_TOURS;
    case Marketplace.NORWAY_TRAVEL_GUIDE:
      return CoreMarketplace.NORWAY_TRAVEL_GUIDE;

    default:
      return CoreMarketplace.GUIDE_TO_ICELAND;
  }
};

export const formatNumericValueToHumanReadable = (value: string | number): string | number => {
  return String(value).match(/^\d{5,}$/) ? Number(value).toLocaleString() : value;
};

export const memoizeOneObj: typeof memoizeOne = fn =>
  memoizeOne(fn, ([newObj], [lastObj]) => {
    if (typeof newObj !== "object" || typeof lastObj !== "object") return newObj === lastObj;

    if (Object.keys(newObj).length !== Object.keys(lastObj).length) return false;

    let equal = true;
    Object.keys(newObj).forEach(key => {
      if (newObj[key] !== lastObj[key]) {
        equal = false;
      }
    });

    return equal;
  });

export const decodeJwtResponse = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(c => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isAlphabetic = (str: string) =>
  typeof str === "string" ? /^[a-zA-Z]+$/.test(str) : false;

export const checkShouldFormatPrice = (isCarnect: boolean, currencyCode: string) => {
  const shouldFormat = !isCarnect || currencyCode === "ISK";
  return shouldFormat;
};

export const isNullOrUndefined = (obj?: unknown) => obj == null;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const emptyFunction = () => {};

/**
 * removeHTMLCharactersFromText only works in CSR
 */
export const removeHTMLCharactersFromText = (str?: string) => {
  if (str && isBrowser) {
    const div = document.createElement("div");
    // eslint-disable-next-line functional/immutable-data
    div.innerHTML = str;
    const text = div.textContent || div.innerText || str;
    return text;
  }
  return str;
};
