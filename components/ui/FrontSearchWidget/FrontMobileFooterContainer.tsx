import React, { useCallback } from "react";

import FrontMobileSingleServiceFooter from "./FrontMobileSingleServiceFooter";
import { getActiveService } from "./utils/frontUtils";

import {
  useOnCarsClick,
  useOnStaysClick,
  useOnTripsClick,
  useOnFlightsClick,
  useOnVacationsClick,
} from "components/ui/FrontSearchWidget/frontHooks";
import useMobileFooterState from "hooks/useMobileFooterState";

const FrontMobileFooterContainer = ({
  activeServices,
  forceShow = false,
}: {
  activeServices: SharedTypes.PageItemType[];
  forceShow?: boolean;
}) => {
  const onTripsClick = useOnTripsClick();
  const onStaysClick = useOnStaysClick();
  const onCarsClick = useOnCarsClick();
  const onFlightsClick = useOnFlightsClick();
  const onVacationsClick = useOnVacationsClick();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const activeServiceTypes = activeServices.map(service => service.pageType);

  const { isMobileFooterShown } = useMobileFooterState();

  if (!forceShow && !isMobileFooterShown) {
    return null;
  }

  if (activeServiceTypes.length === 1) {
    const { onClick } = getActiveService({
      activeServiceType: activeServiceTypes[0],
      onTripsClick,
      onStaysClick,
      onCarsClick,
      onFlightsClick,
      onVacationsClick,
    });
    return <FrontMobileSingleServiceFooter onClick={onClick} />;
  }

  return <FrontMobileSingleServiceFooter onClick={scrollToTop} />;
};

export default FrontMobileFooterContainer;
