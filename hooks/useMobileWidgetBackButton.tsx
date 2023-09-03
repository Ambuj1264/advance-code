import { MutableRefObject, useEffect } from "react";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import { useGlobalContext } from "contexts/GlobalContext";

const useMobileWidgetBackButton = ({
  currentStep,
  onModalClose,
  onPreviousClick,
}: {
  currentStep: number;
  onModalClose: () => void;
  onPreviousClick?: () => void;
}) => {
  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();
  const prevIsMobileSearchWidgetBtnClicked = usePreviousState<
    MutableRefObject<boolean | undefined>
  >(isMobileSearchWidgetBtnClicked);

  useEffect(() => {
    window.history.pushState({ mobileWidgetSteps: true }, document.title, window.location.href);
  }, []);

  useEffect(() => {
    const handleBackButton = (event: any) => {
      if (!event.state.mobileWidgetSteps) {
        const isFirstStep = currentStep === 0;

        window.history.forward();

        if (isFirstStep) {
          onModalClose();
        } else {
          onPreviousClick?.();
        }
      }
    };

    window.addEventListener("popstate", handleBackButton);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    const prevValueIsMobileSearchWidgetBtnClicked = prevIsMobileSearchWidgetBtnClicked?.current;
    return () => {
      // To avoid bad routing when we have redirect in an application after search button click from search widget.
      if (!prevValueIsMobileSearchWidgetBtnClicked && !isMobileSearchWidgetBtnClicked?.current) {
        setTimeout(() => window.history.back(), 0);
      }
      isMobileSearchWidgetBtnClicked.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileSearchWidgetBtnClicked?.current]);
};

export default useMobileWidgetBackButton;
