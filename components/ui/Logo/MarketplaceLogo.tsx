import React from "react";
// eslint-disable-next-line no-restricted-imports
import LazyHydrate from "react-lazy-hydration";

import Logo from "./Logo?ssrOnly";

import { useSettings } from "contexts/SettingsContext";

const MarketplaceLogo = ({ className }: { className?: string }) => {
  const { marketplace } = useSettings();
  const ClientLogo = typeof window !== "undefined" ? document.getElementById("logo") : null;
  return typeof window !== "undefined" && ClientLogo ? (
    <div
      style={{ display: "contents" }}
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: ClientLogo.outerHTML,
      }}
    />
  ) : (
    <LazyHydrate ssrOnly>
      <Logo marketplace={marketplace} className={className} />
    </LazyHydrate>
  );
};

export default MarketplaceLogo;
