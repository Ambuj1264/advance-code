import { useMediaQuery } from "react-responsive";

import { breakpointsMax, breakpointsMin } from "styles/variables";

export const useIsSmallDevice = () =>
  useMediaQuery({
    maxWidth: breakpointsMin.medium,
  });

export const useIsMobile = () => useMediaQuery({ maxWidth: breakpointsMax.large });

export const useIsTabletStrict = () =>
  useMediaQuery({
    minWidth: breakpointsMin.large,
    maxWidth: breakpointsMax.desktop,
  });

export const useIsTablet = () =>
  useMediaQuery({
    minWidth: breakpointsMin.large,
  });

export const useIsDesktop = () =>
  useMediaQuery({
    minWidth: breakpointsMin.desktop,
  });

export const useIsNotDesktop = () =>
  useMediaQuery({
    maxWidth: breakpointsMin.desktop,
  });

export const useIsPrint = () =>
  useMediaQuery({
    query: "print",
  });
