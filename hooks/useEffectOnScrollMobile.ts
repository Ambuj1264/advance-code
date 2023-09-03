import { useMediaQuery } from "react-responsive";

import { breakpointsMax } from "styles/variables";
import useEffectOnce from "hooks/useEffectOnce";

const useEffectOnScrollMobile = (callbackFn: () => void, mobileOnly = true, scrollY = 0) => {
  const isDesktop = useMediaQuery({ minWidth: breakpointsMax.large });

  const shouldCallCallback = () => {
    const { top } = document.body.getBoundingClientRect();

    if (mobileOnly) {
      return isDesktop || top < -scrollY;
    }
    return top < -scrollY;
  };

  const mobileScrollListener = () => {
    if (shouldCallCallback()) {
      callbackFn();
      // Remove listener right after Scroll start
      window.removeEventListener("scroll", mobileScrollListener);
    }
  };

  useEffectOnce(() => {
    if (shouldCallCallback()) {
      callbackFn();
      return;
    }

    window.addEventListener("scroll", mobileScrollListener);
    // eslint-disable-next-line consistent-return
    return () => {
      // Remove listener on component destroy
      // if user proceed to another page without scrolling
      window.removeEventListener("scroll", mobileScrollListener);
    };
  });
};

export const useEffectOnScroll = (callbackFn: () => void, scrollY: number) =>
  useEffectOnScrollMobile(callbackFn, false, scrollY);

export default useEffectOnScrollMobile;
