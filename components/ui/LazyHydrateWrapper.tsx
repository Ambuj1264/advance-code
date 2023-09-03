import React, { ReactElement, ReactNode } from "react";
// eslint-disable-next-line no-restricted-imports
import LazyHydrate from "react-lazy-hydration";

import { useGlobalContext } from "contexts/GlobalContext";

export type LazyHydrateProps = {
  ssrOnly?: boolean;
  whenIdle?: boolean;
  whenVisible?: boolean | IntersectionObserverInit;
  noWrapper?: boolean | keyof JSX.IntrinsicElements;
  didHydrate?: VoidFunction;
  promise?: Promise<any>;
  on?: string | string[];
};

export type LazyHydratePropsFull = LazyHydrateProps & {
  children: ReactElement | ReactElement[] | ReactNode;
};

const LazyHydrateWrapper = (props: LazyHydratePropsFull) => {
  const { children, ...rest } = props;
  const { isClientNavigation } = useGlobalContext();

  return isClientNavigation.current ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  ) : (
    <LazyHydrate {...rest}>{children}</LazyHydrate>
  );
};

export default LazyHydrateWrapper;
