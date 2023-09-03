import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  findActiveService,
  getActiveServices,
  getSearchWidgetActiveTab,
  getSearchWidgetContext,
  getServicesObjects,
  getServicesWhereCondition,
  iconsByPageType,
} from "../utils/travelGuideUtils";
import useTGSectionQuery from "../hooks/useTGSectionQuery";

import { GraphCMSPageType } from "types/enums";
import FrontSearchWidgetContainer from "components/ui/FrontSearchWidget/FrontSearchWidgetContainer";
import { mqMin } from "styles/base";
import { TabContent } from "components/ui/SearchWidget/SearchWidgetShared";
import { borderRadiusSmall, fontWeightBold, gutters, whiteColor } from "styles/variables";
import { ContentWrapper, LabelTextDesktop, TabLabel } from "components/ui/Tabs/RoundedTabs";
import Experiences from "components/icons/person-with-white.svg";
import { ToggleWrapper } from "components/ui/FrontSearchWidget/Trips/TripsDatePicker";
import FrontSearchStateContextProviderContainer from "components/ui/FrontSearchWidget/FrontSearchStateContextProviderContainer";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { VacationToggleContent } from "components/ui/FrontSearchWidget/VacationPackages/VacationsTabContent";
import { FlightBottomContent } from "components/ui/FlightSearchWidget/FlightSearchWidgetTabContent";
import FrontMobileStepsContainer from "components/ui/FrontSearchWidget/FrontMobileStepsContainer";
import useActiveLocale from "hooks/useActiveLocale";
import { SearchWidgetDatePickerWithTime } from "components/ui/FrontSearchWidget/FrontTabsShared";
import {
  DriverWrapper,
  StyledDriverCountry,
} from "components/ui/CarSearchWidget/DriverInformation/CountryDriverInformation";

const StyledFrontSearchWidgetContainer = styled(FrontSearchWidgetContainer)`
  max-width: unset;
  padding: 0;
  ${mqMin.large} {
    max-width: 1156px;
    padding: 0;
  }

  ${mqMin.desktop} {
    padding: 0;
  }
  ${ContentWrapper} {
    padding-top: 0;
    ${mqMin.large} {
      padding: 0 ${gutters.large / 2}px ${gutters.large / 2}px ${gutters.large / 2}px;
    }
  }
  ${TabContent} {
    height: auto;
  }
  ${ToggleWrapper} {
    ${mqMin.large} {
      margin-top: ${gutters.small}px;
    }
  }
  ${VacationToggleContent} {
    ${mqMin.large} {
      position: static;
    }
  }
  ${FlightBottomContent} {
    position: static;
  }
  ${SearchWidgetDatePickerWithTime} {
    ${mqMin.large} {
      width: auto;
    }
  }
  ${StyledDriverCountry} {
    ${mqMin.large} {
      max-width: unset;
    }
  }
  ${DriverWrapper} {
    margin-top: ${gutters.small / 4}px;
  }
`;

const TitleWrapper = styled.div<{}>(
  ({ theme }) => css`
    border-radius: ${borderRadiusSmall};
    padding-top: ${gutters.small / 2}px;
    background-color: ${theme.colors.primary};
  `
);

const StyledTabLabel = styled(TabLabel)<{}>(
  ({ theme }) => css`
    display: inline;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
  `
);

const StyledLabelTextDesktop = styled(LabelTextDesktop)`
  display: inline;
  margin-left: ${gutters.small / 2}px;
  font-size: 18px;
  font-weight: ${fontWeightBold};
  line-height: 24px;
`;

const TGSearchWidget = ({
  pageType,
  place,
  isDomesticFlight = false,
}: {
  pageType: GraphCMSPageType;
  place: TravelGuideTypes.DestinationPlace;
  isDomesticFlight?: boolean;
}) => {
  const locale = useActiveLocale();
  const topServicesWhere = getServicesWhereCondition(place.id);
  const { sectionData } = useTGSectionQuery({
    where: topServicesWhere,
    locale,
    skip: !topServicesWhere,
  });
  const servicesObjects = getServicesObjects(sectionData?.landingPages);
  if (!servicesObjects) return null;
  const activeTab = getSearchWidgetActiveTab(pageType);
  const { searchTab, title } = activeTab;
  const context = getSearchWidgetContext(pageType, searchTab, place, isDomesticFlight);
  const activeService = findActiveService(servicesObjects, pageType);
  // TODO: get correct Icon already have function for it.

  if (activeService) {
    const activeServices = getActiveServices(activeService, pageType);
    const IconToRender = pageType === undefined ? Experiences : iconsByPageType[pageType];
    const Icon = styled(IconToRender)`
      margin: auto;
      width: 20px;
      height: 20px;
      fill: ${whiteColor};
    `;
    return (
      <FrontSearchStateContextProviderContainer context={context as FrontSearchStateContext}>
        <TitleWrapper key={`${pageType}-searchwrap`}>
          <StyledTabLabel key={`${pageType}-searchlabel`} data-id={pageType}>
            <Icon />
            <StyledLabelTextDesktop>{title}</StyledLabelTextDesktop>
          </StyledTabLabel>
          <StyledFrontSearchWidgetContainer
            activeServices={activeServices}
            runTabChangeOnMount={false}
            hideTabs
            shouldInitializeInputs
            useDesktopStyle={false}
          />
        </TitleWrapper>
        <FrontMobileStepsContainer activeServices={activeServices} />
      </FrontSearchStateContextProviderContainer>
    );
  }
  return null;
};

export default TGSearchWidget;
