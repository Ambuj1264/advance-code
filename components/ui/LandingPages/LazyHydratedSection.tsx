import React from "react";

import LazyHydrateWrapper from "../LazyHydrateWrapper";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import useEffectOnce from "hooks/useEffectOnce";

const OnLazyHydrateMount = ({ callback }: { callback?: () => void }) => {
  useEffectOnce(() => callback?.());

  return null;
};

export const LazyHydratedSection = ({
  ssrRender,
  children,
  callback,
}: {
  ssrRender: boolean;
  children: React.ReactElement | React.ReactElement[];
  callback?: () => void;
}) => {
  const isMobile = useIsMobile();
  return ssrRender ? (
    <>
      <OnLazyHydrateMount callback={callback} />
      {children}
    </>
  ) : (
    <LazyHydrateWrapper
      noWrapper
      whenVisible={{
        rootMargin: isMobile ? "150px" : "350px",
      }}
    >
      <OnLazyHydrateMount callback={callback} />
      {children}
    </LazyHydrateWrapper>
  );
};
