import { NextPageContext } from "next";
import { DocumentContext } from "next/document";
import React from "react";

import { getRedirectSurrogateKeysHeader } from "../utils/routerUtils";

import { RedirectTypes } from "types/RedirectTypes";
import { addLeadingSlashIfNotPresent } from "utils/helperUtils";

type RouterContext = {
  setStatusCode?: (status: number) => void;
  serverSideRedirect?: (url: string, status?: RedirectTypes.RedirectStatus) => void;
};

export const routerContextFactory = (ctx?: NextPageContext | DocumentContext): RouterContext => {
  if (!ctx) {
    return {};
  }

  return {
    setStatusCode: status => {
      if (ctx.res) {
        // eslint-disable-next-line functional/immutable-data
        ctx.res.statusCode = status;
      }
    },
    serverSideRedirect: (url: string, status = 302) => {
      const isAbsoluteURI = /^(http|https):\/\//.test(url);
      const location = isAbsoluteURI ? url : addLeadingSlashIfNotPresent(url);

      if (ctx.res) {
        ctx.res.writeHead(status, {
          Location: location,
          ...getRedirectSurrogateKeysHeader(ctx.asPath, status, ctx.pathname),
        });
        ctx.res.end();
      }
    },
  };
};

export const RouterContext = React.createContext<RouterContext>(routerContextFactory());
