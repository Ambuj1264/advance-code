import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import styled from "@emotion/styled";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import ClientLink from "./ClientLink";
import { LazyloadOffset } from "./Lazy/LazyComponent";
import WaypointWrapper from "./Lazy/WaypointWrapper";

import { abortSwPrefetch } from "utils/swUtils";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { decodeHTMLTitle } from "utils/helperUtils";

const isStaleController = (abortController?: AbortController) =>
  abortController === undefined || abortController?.signal.aborted;

const ClientLinkStyled = styled(ClientLink)`
  /* stylelint-disable-next-line selector-max-type */
  span:empty {
    line-height: 0;
  }
`;

const PREFETCH_IS_DISABLED_TMP = true;

const ClientLinkPrefetch = ({
  children,
  clientRoute,
  linkUrl,
  className,
  target,
  title,
  useRegularLink,
  disablePrefetch = true,
  nofollow = false,
  dataTestid,
}: {
  children: ReactNode;
  clientRoute?: SharedTypes.ClientRoute;
  linkUrl: string;
  className?: string;
  target?: string;
  nofollow?: boolean;
  title?: string;
  useRegularLink?: boolean;
  disablePrefetch?: boolean;
  dataTestid?: string;
}) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [controller, setController] = useState<AbortController>();
  const onScreenRef = useRef<HTMLAnchorElement>(null);
  const prevDisablePrefetch = usePreviousState(disablePrefetch);

  const onWaypointEnter = useCallback(() => {
    const offsetLeft = onScreenRef.current?.offsetLeft || 0;
    const isElementPositionedOffscreenX = offsetLeft < 0 || offsetLeft > window.outerWidth;

    if (disablePrefetch || isElementPositionedOffscreenX) return;

    if (isStaleController(controller)) {
      setController(new AbortController());
    }
    setIsVisible(true);
  }, [controller, disablePrefetch, onScreenRef]);

  const onWaypointLeave = useCallback(() => {
    const key = clientRoute?.as;
    if (disablePrefetch || !key) return;

    controller?.abort();
    abortSwPrefetch(key);
    setIsVisible(false);
  }, [clientRoute?.as, disablePrefetch, controller]);

  useEffect(() => {
    if (PREFETCH_IS_DISABLED_TMP) return;
    if (prevDisablePrefetch === true && disablePrefetch === false) {
      onWaypointEnter();
    }
  }, [disablePrefetch, onWaypointEnter, prevDisablePrefetch]);
  return clientRoute ? (
    <ClientLinkStyled
      clientRoute={clientRoute}
      className={className}
      target={target}
      title={decodeHTMLTitle(title)}
      prefetchData={isVisible && !disablePrefetch && !PREFETCH_IS_DISABLED_TMP}
      useRegularLink={useRegularLink}
      abortController={controller}
      ref={onScreenRef}
      nofollow={nofollow}
      data-testid={dataTestid}
    >
      {!PREFETCH_IS_DISABLED_TMP && !disablePrefetch && (
        <WaypointWrapper
          lazyloadOffset={isMobile ? LazyloadOffset.None : LazyloadOffset.Small}
          onEnter={onWaypointEnter}
          onLeave={onWaypointLeave}
        />
      )}
      {children}
    </ClientLinkStyled>
  ) : (
    <NextLink href={linkUrl} prefetch={false} passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={className} target={target} title={decodeHTMLTitle(title)}>
        {children}
      </a>
    </NextLink>
  );
};

export default ClientLinkPrefetch;
