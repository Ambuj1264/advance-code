import { useEffect, RefObject, useState, useCallback, useRef } from "react";

const useOnDragScroll = ({ ref }: { ref: RefObject<HTMLDivElement> }) => {
  const startX = useRef<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const onMouseDown = useCallback((e: MouseEvent) => {
    setIsMouseDown(true);
    if (!ref.current) return;
    startX.current = e.pageX - ref.current.offsetLeft;
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (!ref.current) return;
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX.current) * 3;
      if (isMouseDown) {
        // eslint-disable-next-line no-param-reassign
        ref.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isMouseDown, scrollLeft, startX]
  );

  useEffect(() => {
    ref?.current?.addEventListener("mouseup", onMouseUp);
    ref?.current?.addEventListener("mousedown", onMouseDown);
    ref?.current?.addEventListener("mousemove", onMouseMove);
    ref?.current?.addEventListener("mouseleave", onMouseUp);
    return () => {
      ref?.current?.removeEventListener("mouseup", onMouseUp);
      ref?.current?.removeEventListener("mousedown", onMouseDown);
      ref?.current?.removeEventListener("mousemove", onMouseMove);
      ref?.current?.removeEventListener("mouseleave", onMouseUp);
    };
  }, [onMouseDown, onMouseMove]);
};

export default useOnDragScroll;
