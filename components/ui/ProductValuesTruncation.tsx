import React, { useEffect } from "react";

import { getTruncatedValues } from "./utils/uiUtils";

import { getResizeObserver } from "utils/helperUtils";

const ProductValuesTruncation = ({
  values,
  wrapperRef,
  valueRefs,
  children,
  setTruncatedValues,
}: {
  values: SharedTypes.ProductProp[] | SharedTypes.ProductSpec[];
  wrapperRef: React.MutableRefObject<null>;
  valueRefs: React.MutableRefObject<React.RefObject<HTMLDivElement>[]>;
  children: JSX.Element;
  setTruncatedValues: React.Dispatch<React.SetStateAction<(string | boolean)[]>>;
}) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const updateState = () => setTruncatedValues(getTruncatedValues(valueRefs.current));
    if (typeof ResizeObserver !== "undefined" && wrapperRef.current) {
      const [resizeObserver, rafReference] = getResizeObserver(() => {
        updateState();
      });
      const currentRef = wrapperRef.current!;
      resizeObserver.observe(currentRef);
      return () => {
        window.cancelAnimationFrame(rafReference.rafId!);
        resizeObserver.unobserve(currentRef);
      };
    }
  }, [setTruncatedValues, valueRefs, values, wrapperRef]);
  return children;
};

export default ProductValuesTruncation;
