import React, { useState } from "react";

import TripsTab from "./Trips/TripsTab";
import CarsTab from "./Cars/CarsTab";
import FlightsTab from "./Flights/FlightsTab";
import VacationsTab from "./VacationPackages/VacationsTab";
import {
  isFlightSearch,
  isCarSearchOrCategory,
  isStaysSearch,
  isVacationSearch,
  isTourSearch,
} from "./utils/frontUtils";
import StaysTab from "./Stays/StaysTab";

import useEffectOnce from "hooks/useEffectOnce";
import { useOnSearchClick } from "components/ui/FrontSearchWidget/frontHooks";
import FrontTabs from "components/ui/FrontSearchWidget/FrontTabs";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { PageType } from "types/enums";
import SearchWidgetErrorBoundary from "components/ui/SearchWidget/SearchWidgetErrorBoundary";

const FrontSearchWidgetContainer = ({
  activeServices,
  hideTabs,
  runTabChangeOnMount,
  shouldInitializeInputs,
  isCategoryPage,
  useDesktopStyle = true,
  className,
}: {
  activeServices: SharedTypes.PageItemType[];
  hideTabs?: boolean;
  runTabChangeOnMount?: boolean;
  shouldInitializeInputs?: boolean;
  isCategoryPage?: boolean;
  useDesktopStyle?: boolean;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const onSearchClick = useOnSearchClick(activeServices, isCategoryPage);
  const activeServiceTypes = activeServices.map(service => service.pageType);
  const [isMobileOrSSR, setIsMobileOrSSR] = useState(false);

  useEffectOnce(() => setIsMobileOrSSR(isMobile));
  return (
    <SearchWidgetErrorBoundary>
      <FrontTabs
        activeServices={activeServiceTypes}
        hideTabs={hideTabs}
        runTabChangeOnMount={runTabChangeOnMount}
        className={className}
        data-testid="front-tabs"
      >
        {activeServiceTypes.some(pageType => isTourSearch(pageType as PageType)) && (
          <TripsTab
            isMobile={isMobileOrSSR}
            onSearchClick={onSearchClick}
            useDesktopStyle={useDesktopStyle}
          />
        )}
        {activeServiceTypes.some(pageType => isStaysSearch(pageType as PageType)) && (
          <StaysTab
            isMobile={isMobileOrSSR}
            onSearchClick={onSearchClick}
            useDesktopStyle={useDesktopStyle}
          />
        )}
        {activeServiceTypes.some(pageType => isCarSearchOrCategory(pageType as PageType)) && (
          <CarsTab
            isMobile={isMobileOrSSR}
            onSearchClick={onSearchClick}
            shouldInitializeInputs={shouldInitializeInputs}
            useDesktopStyle={useDesktopStyle}
          />
        )}
        {activeServiceTypes.some(pageType => isFlightSearch(pageType as PageType)) && (
          <FlightsTab
            isMobile={isMobileOrSSR}
            onSearchClick={onSearchClick}
            useDesktopStyle={useDesktopStyle}
          />
        )}
        {activeServiceTypes.some(pageType => isVacationSearch(pageType as PageType)) && (
          <VacationsTab
            isMobile={isMobileOrSSR}
            onSearchClick={onSearchClick}
            useDesktopStyle={useDesktopStyle}
          />
        )}
      </FrontTabs>
    </SearchWidgetErrorBoundary>
  );
};

export default FrontSearchWidgetContainer;
