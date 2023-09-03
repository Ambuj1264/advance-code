import { useContext } from "react";

import MobileFooterContext from "contexts/MobileFooterContext";
import useEffectOnce from "hooks/useEffectOnce";

const useMobileFooterState = (clientInitialState?: boolean) => {
  const {
    isMobileFooterShown: isMobileFooterShownContextValue,
    setContextState: setMobileFooterContextState,
  } = useContext(MobileFooterContext);

  useEffectOnce(function updateInitialStateOnClient() {
    if (typeof clientInitialState !== "undefined") {
      setMobileFooterContextState({ isMobileFooterShown: clientInitialState });
    }
  });

  const isMobileFooterShownFromContext =
    typeof clientInitialState !== "undefined"
      ? clientInitialState
      : isMobileFooterShownContextValue;

  return {
    isMobileFooterShown: isMobileFooterShownFromContext,
    setMobileFooterContextState,
  };
};

export default useMobileFooterState;
