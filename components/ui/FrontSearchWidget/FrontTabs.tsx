import React, { ReactNode, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { SearchTabsEnum, SearchTabDataTestIds } from "./utils/FrontEnums";
import { useFrontSearchContext } from "./FrontSearchStateContext";
import {
  isFlightSearch,
  isCarSearchOrCategory,
  isStaysSearch,
  isVacationSearch,
  isTourSearch,
} from "./utils/frontUtils";

import { gutters, zIndex } from "styles/variables";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import TravelerIcon from "components/icons/traveler.svg";
import HotelIcon from "components/icons/house-heart.svg";
import CarIcon from "components/icons/car.svg";
import FlightIcon from "components/icons/plane-1.svg";
import VacationIcon from "components/icons/vacation-widget-icon.svg";
import RoundedTabs from "components/ui/Tabs/RoundedTabs";
import { Namespaces } from "shared/namespaces";
import { PageType, Marketplace } from "types/enums";
import useEffectOnce from "hooks/useEffectOnce";
import { getActiveTabFromLocalStorage, setActiveTabInLocalStorage } from "utils/localStorageUtils";
import { useSettings } from "contexts/SettingsContext";

export const RoundedTabsStyled = styled(RoundedTabs)`
  z-index: ${zIndex.z1};
  width: 100%;
  max-width: 548px;
  padding: ${gutters.small}px;

  ${mqMin.large} {
    max-width: 1156px;
    padding-top: ${gutters.large - gutters.small / 2}px;
  }

  ${mqMin.desktop} {
    padding: 0 ${gutters.large}px;
  }
`;

const FrontTabs = ({
  children,
  activeServices,
  hideTabs = false,
  runTabChangeOnMount,
  className,
}: {
  children: ReactNode;
  activeServices: string[];
  hideTabs?: boolean;
  runTabChangeOnMount?: boolean;
  className?: string;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { t } = useTranslation(Namespaces.countryNs);
  const tabs = useMemo(
    () =>
      [
        ...(activeServices.some(pageType => isVacationSearch(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.VacationPackages,
                text: t("Vacations"),
                Icon: VacationIcon,
                dataTestid: SearchTabDataTestIds.VacationPackages,
              },
            ]
          : []),
        ...(!isGTE && activeServices.some(pageType => isTourSearch(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.Trips,
                text: t("Trips"),
                Icon: TravelerIcon,
                dataTestid: SearchTabDataTestIds.Trips,
              },
            ]
          : []),
        ...(activeServices.some(pageType => isFlightSearch(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.Flights,
                text: t("Flights"),
                Icon: FlightIcon,
                dataTestid: SearchTabDataTestIds.Flights,
              },
            ]
          : []),
        ...(activeServices.some(pageType => isStaysSearch(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.Stays,
                text: t("Stays"),
                Icon: HotelIcon,
                dataTestid: SearchTabDataTestIds.Stays,
              },
            ]
          : []),
        ...(activeServices.some(pageType => isCarSearchOrCategory(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.Cars,
                text: t("Cars"),
                Icon: CarIcon,
                dataTestid: SearchTabDataTestIds.Cars,
              },
            ]
          : []),
        ...(isGTE && activeServices.some(pageType => isTourSearch(pageType as PageType))
          ? [
              {
                id: SearchTabsEnum.Trips,
                text: t("Experiences"),
                Icon: TravelerIcon,
                dataTestid: SearchTabDataTestIds.Trips,
              },
            ]
          : []),
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const { setContextState, activeSearchTab } = useFrontSearchContext();

  useEffectOnce(() => {
    if (runTabChangeOnMount) {
      const activeTabIndex = parseInt(getActiveTabFromLocalStorage() as string, 10);
      setContextState({
        activeSearchTab:
          activeTabIndex >= 0 && activeServices.length < activeTabIndex ? activeTabIndex : 0,
      });
    }
  });

  const onTabChange = useCallback(
    ({ current }: { current: SearchTabsEnum }) => {
      setContextState({ activeSearchTab: current });
      setActiveTabInLocalStorage(current.toString());
    },
    [setContextState]
  );

  return (
    <RoundedTabsStyled
      hideTabs={hideTabs}
      items={tabs}
      onTabChange={onTabChange}
      selectedTab={activeSearchTab as number}
      runTabChangeOnMount={runTabChangeOnMount}
      className={className}
    >
      {children}
    </RoundedTabsStyled>
  );
};

export default FrontTabs;
