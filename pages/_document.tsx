/* eslint-disable react/no-danger, no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
import React from "react";
import Document, { Html, Main, DocumentContext } from "next/document";
import createEmotionServer from "create-emotion-server";
import createCache from "@emotion/cache";
import SassStyleContext from "isomorphic-style-loader/StyleContext";
import postcss from "postcss";

import postCssConfig from "../../postcss.config";
import { cleanupApolloSSRState } from "../utils/globalUtils";

import CustomizedNextScript from "lib/CustomizedNextScript";
import HeadWithoutScriptsPreload from "lib/HeadWithoutScriptsPreload";

const removeKeys = (keys: string[], object: any) => {
  keys.forEach(key => {
    // eslint-disable-next-line functional/immutable-data, no-param-reassign
    object[key] = undefined;
  });
};

class MyDocument extends Document<{
  html: string;
  emotionStyles: string;
  ids: string[];
}> {
  static async getInitialProps(ctx: DocumentContext) {
    const sassStyleSet = new Set();
    const insertCss = (...styles: any[]) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => sassStyleSet.add(style._getCss()));
    };

    const originalRenderPage = ctx.renderPage;
    const cache = createCache({
      key: "x",
    });
    const { extractCritical } = createEmotionServer(cache);
    // eslint-disable-next-line functional/immutable-data
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          (
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            <SassStyleContext.Provider value={{ insertCss }}>
              <App {...props} ctx={ctx} emotionCache={cache} />
            </SassStyleContext.Provider>
          ),
      });
    const initialProps = await Document.getInitialProps(ctx);
    const { html, ids, css: emotionCriticalCss } = extractCritical(initialProps.html || "");
    const sassCss = [...sassStyleSet].join("").replace(/\n|\s?([{}:;(])\s+/g, "$1");
    const emotionPostCssResult = await postcss(postCssConfig.plugins).process(emotionCriticalCss);

    return {
      ...initialProps,
      html,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion-css={ids.join(" ")}
            dangerouslySetInnerHTML={{
              __html: emotionPostCssResult.css,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: sassCss,
            }}
          />
        </>
      ),
    };
  }

  constructor(props: any) {
    super(props);
    const { __NEXT_DATA__ } = props;

    if (__NEXT_DATA__.props && __NEXT_DATA__.props.pageProps && __NEXT_DATA__.props.apolloState) {
      removeKeys(["queries"], __NEXT_DATA__.props.pageProps);
      // Inject parsed i18n data
      __NEXT_DATA__.props.i18n = props.i18n;
      const { apolloState } = __NEXT_DATA__.props;
      __NEXT_DATA__.props.apolloState = cleanupApolloSSRState(apolloState);
    }
  }

  render() {
    // eslint-disable-next-line no-underscore-dangle
    const { props } = this.props.__NEXT_DATA__;

    this.context = { ...this.context, disableOptimizedLoading: true };

    // Guard for development, we sometimes get an error here during hot reloading
    if (!props) {
      return (
        <Html>
          <body />
        </Html>
      );
    }
    const { locale } = props;
    return (
      <Html lang={locale?.replace("_", "-")}>
        <HeadWithoutScriptsPreload prefix="og: http://ogp.me/ns#" />
        <body>
          <Main />
          <CustomizedNextScript />
          <input id="documentAge" type="hidden" value={Date.now()} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
