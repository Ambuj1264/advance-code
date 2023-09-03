import React, { useEffect, useState } from "react";
import nanoMemoize from "nano-memoize";

import LazyComponent, { LazyloadOffset } from "./Lazy/LazyComponent";

import { gteImgixUrl } from "utils/imageUtils";
import { isDev } from "utils/globalUtils";

const fetchSvg = nanoMemoize(async (handle: string) =>
  fetch(`${gteImgixUrl}/${handle}`)
    .then(response => response.text())
    .catch(err => {
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch svg image:", err);
      }
      return null;
    })
);

const SvgFromHandle = ({ handle, className }: { handle: string; className?: string }) => {
  const [svgSource, setSvgSource] = useState("");

  useEffect(() => {
    (async () => {
      const iconText = await fetchSvg(handle);
      if (iconText) setSvgSource(iconText);
    })();
  }, [handle]);

  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: svgSource,
      }}
    />
  );
};

export default nanoMemoize(
  (handle: string, lazy = true) =>
    ({ className }: { className?: string }) => {
      if (!handle) return null;

      return lazy ? (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Tiny}
          loadingElement={null}
          scrollableAncestor={null} // auto detect scrollable parent
        >
          <SvgFromHandle className={className} handle={handle} />
        </LazyComponent>
      ) : (
        <SvgFromHandle className={className} handle={handle} />
      );
    }
);
