import React from "react";

import FrontTripsMobileSteps from "./Trips/FrontTripsMobileSteps";
import FrontStaysMobileSteps from "./Stays/FrontStaysMobileSteps";
import FrontCarsMobileSteps from "./Cars/FrontCarsMobileSteps";
import FrontFlightsMobileSteps from "./Flights/FrontFlightsMobileSteps";
import FrontVacationsMobileSteps from "./VacationPackages/FrontVacationsMobileSteps";
import {
  isFlightSearch,
  isCarSearchOrCategory,
  isStaysSearch,
  isVacationSearch,
  isTourSearch,
} from "./utils/frontUtils";

import { useOnSearchClick, useToggleIsOpen } from "components/ui/FrontSearchWidget/frontHooks";
import { useFrontSearchContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { PageType } from "types/enums";

const FrontMobileStepsContainer = ({
  activeServices,
  isCategoryPage,
}: {
  activeServices: SharedTypes.PageItemType[];
  isCategoryPage?: boolean;
}) => {
  const isTablet = useIsTablet();
  const { activeSearchTab, isSearchModalOpen } = useFrontSearchContext();
  const toggleIsOpen = useToggleIsOpen();
  const onSearchClick = useOnSearchClick(activeServices, isCategoryPage);
  const activeServiceTypes = activeServices.map(service => service.pageType);
  if (isTablet || !isSearchModalOpen) return null;
  return (
    <>
      {SearchTabsEnum.Trips === activeSearchTab &&
        activeServiceTypes.some(pageType => isTourSearch(pageType as PageType)) && (
          <FrontTripsMobileSteps onModalClose={toggleIsOpen} onSearchClick={onSearchClick} />
        )}
      {SearchTabsEnum.Stays === activeSearchTab &&
        activeServiceTypes.some(pageType => isStaysSearch(pageType as PageType)) && (
          <FrontStaysMobileSteps onModalClose={toggleIsOpen} onSearchClick={onSearchClick} />
        )}
      {SearchTabsEnum.Cars === activeSearchTab &&
        activeServiceTypes.some(pageType => isCarSearchOrCategory(pageType as PageType)) && (
          <FrontCarsMobileSteps onModalClose={toggleIsOpen} onSearchClick={onSearchClick} />
        )}
      {SearchTabsEnum.Flights === activeSearchTab &&
        activeServiceTypes.some(pageType => isFlightSearch(pageType as PageType)) && (
          <FrontFlightsMobileSteps onModalClose={toggleIsOpen} onSearchClick={onSearchClick} />
        )}
      {SearchTabsEnum.VacationPackages === activeSearchTab &&
        activeServiceTypes.some(pageType => isVacationSearch(pageType as PageType)) && (
          <FrontVacationsMobileSteps onModalClose={toggleIsOpen} onSearchClick={onSearchClick} />
        )}
    </>
  );
};

export default FrontMobileStepsContainer;
