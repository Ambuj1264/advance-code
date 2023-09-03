import React from "react";

import { getChunksDirPath } from "../utils/globalUtils";

const InitLazySizesScripts = () => (
  <>
    <script
      id="lazysizesChunk"
      // note: APP_VERSION cannot be destructured(DefinePlugin / env next)
      src={`${getChunksDirPath()}/chunks/lazysizes.${process.env.APP_VERSION}.js`}
      defer
    />
    <script
      id="polyfillsInit"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // eslint-disable-next-line prefer-template,prettier/prettier
        __html: 'window.lazySizesConfig = window.lazySizesConfig || {};'+
          `document.getElementById('lazysizesChunk').onerror=function(){` +
          `  document.querySelectorAll("img[data-src]").forEach(img => {const dataSrc = img.getAttribute("data-src");if (dataSrc) { img.src = dataSrc}}) ` +
          `}`,
      }}
    />
  </>
);

export default InitLazySizesScripts;
