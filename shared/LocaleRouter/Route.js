/* eslint-disable functional/immutable-data */
import pathToRegexp from "path-to-regexp";

const toQuerystring = obj =>
  Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => {
      let value = obj[key];

      if (Array.isArray(value)) {
        value = value.join("/");
      }
      return [encodeURIComponent(key), encodeURIComponent(value)].join("=");
    })
    .join("&");

export default class Route {
  constructor({ name, pattern, page = name, marketplace, isProtected }) {
    if (!name && !page) {
      throw new Error(`Missing page to render for route "${pattern}"`);
    }

    this.name = name;
    if (name === "index" || pattern === "/") {
      this.pattern = "/{locale}";
    } else if (pattern) {
      this.pattern = `/{locale}${pattern}`;
    } else {
      this.pattern = `/{locale}/${name}`;
    }
    this.page = page.replace(/(^|\/)index$/, "").replace(/^\/?/, "/");
    this.marketplace = marketplace;
    this.regex = pathToRegexp(this.pattern, (this.keys = []));
    this.translatedRegexes = [];
    this.keyNames = this.keys.map(key => key.name);
    this.toPath = pathToRegexp.compile(this.pattern);
    this.translations = {};
    this.isProtected = isProtected;
  }

  setTranslations(translations, defaultLocale) {
    this.translations = translations;
    this.defaultLocale = defaultLocale;
    this.locales = Object.keys(translations);
    this.translatedRegexes = this.locales.map(locale => {
      const pattern = this.translateUrl(this.pattern, locale);
      return pathToRegexp(pattern);
    });
  }

  translateUrl(url, locale) {
    const messages = this.translations[locale] || {};

    // Look up each translated part in the translation dictionary.
    return url
      .replace(/\{([^}]+)\}/g, (_, part) => {
        const value = messages[`url:${part}`];
        if (part === "locale") {
          return locale;
        }
        return value;
      })
      .replace(/^\/en/, ""); // Remove the prefix for primary locale
  }

  match(path) {
    // eslint-disable-next-line no-cond-assign, no-plusplus
    for (let regex, i = 0; (regex = this.translatedRegexes[i]); i++) {
      const values = regex.exec(path);
      if (values) {
        return this.valuesToParams(values.slice(1), this.locales[i]);
      }
    }
    return null;
  }

  valuesToParams(values, locale) {
    const parameters = {
      i18n: {
        locale,
        translations: this.translations[locale],
      },
    };

    return values.reduce((params, val, i) => {
      if (val === undefined) {
        return params;
      }
      return Object.assign(params, {
        [this.keys[i].name]: decodeURIComponent(val),
      });
    }, parameters);
  }

  getHref(params = {}) {
    return `${this.page}?${toQuerystring(params)}`;
  }

  getAs(params = {}, locale = this.defaultLocale) {
    let as = this.toPath(params) || "/";

    const keys = Object.keys(params);
    const qsKeys = keys.filter(key => key !== "locale" && this.keyNames.indexOf(key) === -1);
    as = this.translateUrl(as, locale);

    if (!qsKeys.length) {
      return as;
    }

    const qsParams = qsKeys.reduce(
      (qs, key) =>
        Object.assign(qs, {
          [key]: params[key],
        }),
      {}
    );

    return `${as}?${toQuerystring(qsParams)}`;
  }

  getUrls(params, locale) {
    const as = this.getAs(params, locale);
    const href = this.getHref(params);
    return { as, href };
  }
}
