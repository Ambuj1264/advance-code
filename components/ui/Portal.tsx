/* eslint-disable functional/immutable-data */
import React, { useRef, useEffect, memo, useState } from "react";
import { createPortal } from "react-dom";

import useOnMount from "hooks/useOnDidMount";

type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
  beforeElementId?: string;
  automaticRemovalOnUnmount?: boolean;
};

const Portal = ({
  id,
  children,
  className,
  beforeElementId,
  automaticRemovalOnUnmount = true,
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const el = useRef<HTMLElement>();
  const beforeElement = useRef<HTMLElement>();

  // lookup for the DOM elements only after we mounted the component.
  // this is useful when we render a portal within a single render cycle like this:
  //   <div id="injectHere">
  //     <Portal id="injectHere" />
  // We expect a <Portal /> to be rendered exactly inside <div id="injectHere">
  useOnMount(() => {
    el.current = document.getElementById(id) || document.createElement("div");
    const beforeElementNode = beforeElementId ? document.getElementById(beforeElementId) : null;
    if (beforeElementNode) {
      beforeElement.current = beforeElementNode;
    }
    setMounted(true);
  }, [beforeElementId, id]);

  useEffect(() => {
    if (className && el.current) {
      el.current.className = className;
    }
  }, [className]);

  // prepend initial portal injection in DOM
  useEffect(() => {
    const { current } = el;
    if (current != null && !current.parentElement) {
      current.id = id;
      if (beforeElement.current) {
        document.body.insertBefore(current, beforeElement.current);
      } else {
        document.body.appendChild(current);
      }
    }
    return () => {
      if (!current) return;
      if (current.parentElement && automaticRemovalOnUnmount) {
        current.parentElement.removeChild(current);
      }
    };
  }, [id, beforeElement, automaticRemovalOnUnmount]);

  return mounted && el.current ? createPortal(children, el.current) : null;
};

export default memo(Portal);
