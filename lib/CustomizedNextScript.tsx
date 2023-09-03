import React, { ReactElement } from "react";
import { NextScript } from "next/document";
import getConfig from "next/config";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import nextScriptsTimeout from "raw-loader!terser-loader!./nextScriptsTimeout";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import preventPwaInstall from "raw-loader!terser-loader!./preventPwaInstall";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import fixDateParsingIssue from "raw-loader!terser-loader!fix-date";

import InitLazySizesScripts from "./InitLazySizesScripts";

const { NODE_ENV } = getConfig().publicRuntimeConfig;

export default class CustomizedNextScript extends NextScript {
  getScripts(files: any) {
    return super.getScripts(files).map(script => {
      return React.cloneElement(script, {
        key: script.props.src,
        defer: true,
        async: undefined,
      });
    });
  }

  render() {
    this.context = { ...this.context, disableOptimizedLoading: true };

    // in development mode, next hides body contents until all scripts are loaded, this causes ugly white flashes
    if (NODE_ENV !== "production" || this.context.inAmpMode)
      return (
        <>
          {super.render()}
          <InitLazySizesScripts />
        </>
      );

    const renderedNextScripts = super
      .render()
      ?.props.children.reduce((a: Array<{}>, b: Array<{}>) => a.concat(b), []);

    const scripts = renderedNextScripts
      .map((child: ReactElement) => {
        if (child?.props?.id === "__NEXT_DATA__") {
          return {
            props: { ...child.props },
            // eslint-disable-next-line no-underscore-dangle
            content: child.props.dangerouslySetInnerHTML.__html,
          };
        }

        if (child?.type === "script") {
          return {
            props: { ...child.props },
            content: "",
          };
        }

        return null;
      })
      .filter(Boolean);

    const isNotChunked = (props: any) => !props.src || !props.src.includes("chunk");

    const initialLoadScripts = scripts.filter(({ props }: { props: any }) => isNotChunked(props));
    // eslint-disable-next-line functional/immutable-data,no-underscore-dangle
    const chunkedScripts = JSON.stringify(
      scripts.filter(({ props }: { props: any }) => !isNotChunked(props))
    );

    const page = this.context.__NEXT_DATA__.page.replace("/", "");

    const globalTravelshiftNamespace = `window._travelshift = window._travelshift || {}; window._travelshift.page="${page}"`;

    return (
      <>
        {initialLoadScripts.map(({ props }: { props: any }) => (
          <script key={props.src} {...props} src={props.src} />
        ))}
        <InitLazySizesScripts />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `if (isNaN(Date.parse("2020-02-22 10:00"))) {${fixDateParsingIssue}}`,
          }}
        />
        <script
          id="__NEXT_SCRIPT_CUSTOM"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `${globalTravelshiftNamespace}; window.chunkedScripts = ${chunkedScripts};${nextScriptsTimeout};${preventPwaInstall}`,
          }}
        />
      </>
    );
  }
}
