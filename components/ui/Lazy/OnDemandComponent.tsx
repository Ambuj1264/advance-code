import React, {
  Suspense,
  LazyExoticComponent,
  ElementType,
  ComponentType,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import LazyHydrateWrapper, { LazyHydrateProps } from "components/ui/LazyHydrateWrapper";
import useIsNotHidden from "hooks/useIsNotHidden";

const Wrapper = styled.div<{ minHeight: number }>(({ minHeight }) => [
  minHeight &&
    css`
      min-height: ${minHeight}px;
    `,
]);

const OnDemandComponent = <T extends ComponentType>({
  LazyComponent,
  SsrOnlyComponent,
  lazyHydrateProps = { on: "mouseenter" },
  loading = null,
  ...props
}: {
  LazyComponent: LazyExoticComponent<any>;
  SsrOnlyComponent: ElementType;
  lazyHydrateProps?: LazyHydrateProps;
  loading?: ElementType | null;
} & T) => {
  const [isOnScreen, onScreenRef] = useIsNotHidden<HTMLDivElement>();

  // height is used to avoid CLS when client-side component gets rendered.
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div ref={ref}>
      {!isOnScreen && <div ref={onScreenRef} />}
      <LazyHydrateWrapper {...lazyHydrateProps}>
        <Wrapper minHeight={height}>
          {typeof window !== "undefined" ? (
            (() =>
              // 🐞 lazyHydrate always hydrates hidden components
              isOnScreen ? (
                <Suspense fallback={loading}>
                  <LazyComponent {...props} fallback={loading} />
                </Suspense>
              ) : (
                loading
              ))()
          ) : (
            <SsrOnlyComponent {...props} />
          )}
        </Wrapper>
      </LazyHydrateWrapper>
    </div>
  );
};

export default OnDemandComponent;
