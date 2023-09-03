import React, { ReactNode, useRef } from "react";
import Router from "next/router";

import useOnClick from "hooks/useOnClick";
import { getProductSlugFromHref } from "utils/routerUtils";
import { PageType } from "types/enums";

const getLinkTag = (el: HTMLElement): HTMLAnchorElement | undefined => {
  if (el instanceof HTMLAnchorElement) {
    return el;
  }

  if (el.parentElement) {
    return getLinkTag(el.parentElement);
  }

  return undefined;
};

const StaticLinkHandler = ({ pageType, children }: { pageType: PageType; children: ReactNode }) => {
  const wrapperRef = useRef(null);
  // eslint-disable-next-line consistent-return
  const onClick = (event: MouseEvent | TouchEvent) => {
    const linkTag = getLinkTag(event.target as HTMLElement);

    if (event.metaKey || !linkTag || linkTag?.getAttribute("data-ssr")) return false;

    event.preventDefault();
    Router.push(
      {
        pathname: `/${pageType}`,
        query: {
          slug: getProductSlugFromHref(linkTag.pathname),
        },
      },
      linkTag.pathname
    ).then(() => window.scrollTo(0, 0));
  };

  useOnClick(wrapperRef, onClick);

  return <div ref={wrapperRef}>{children}</div>;
};

export default StaticLinkHandler;
