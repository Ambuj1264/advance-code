import { useCallback, useContext } from "react";

import useEffectOnce from "./useEffectOnce";

import MobileFooterContext, { MobileFooterContextState } from "contexts/MobileFooterContext";
import { Direction } from "types/enums";

const useRepositionContactUsButton = ({
  bottomPosition: contactUsBottomPosition,
  buttonPosition: contactUsButtonPosition,
  isMobileFooterShown,
}: {
  bottomPosition?: number;
  buttonPosition?: Direction;
  isMobileFooterShown?: boolean;
  message?: string;
}) => {
  const { isContactUsHidden, setAllContextState } = useContext(MobileFooterContext);

  const updateInitialStateOnClient = useCallback(
    (bottomPosition?: number, buttonPosition?: Direction) => {
      setAllContextState(prevState => {
        return {
          ...prevState,
          isMobileFooterShown,
          contactUsBottomPosition: bottomPosition,
          ...(buttonPosition ? { contactUsButtonPosition: buttonPosition } : null),
        } as MobileFooterContextState;
      });
    },
    [isMobileFooterShown, setAllContextState]
  );

  useEffectOnce(() => {
    if (!isContactUsHidden) {
      updateInitialStateOnClient(contactUsBottomPosition, contactUsButtonPosition);
    }
  });
};

export default useRepositionContactUsButton;
