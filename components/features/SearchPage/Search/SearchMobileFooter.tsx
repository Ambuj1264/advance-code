import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { StepsEnum } from "components/ui/AdvancedFilterMobileSteps/advancedFilterHelpers";
import { DisplayType, FilterQueryParam } from "types/enums";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters, whiteColor } from "styles/variables";
import CalendarIcon from "components/icons/calendar.svg";
import MediaQuery from "components/ui/MediaQuery";
import MobileStickyFooter from "components/ui/StickyFooter/MobileStickyFooter";
import TextDateRangeFromQuery from "components/ui/Filters/TextDateRangeFromQuery";
import {
  MobileFooterButton,
  MobileFooterFilterButton,
} from "components/ui/Filters/MobileFooterButton";

const StyledCalendarIcon = styled(CalendarIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 12px;
  min-width: 12px;
  height: 12px;
  vertical-align: middle;
  fill: ${whiteColor};
`;

const SearchMobileFooter = ({
  onFilterButtonClick,
  numberOfSelectedFilters,
  setContextState,
  onButtonClick,
  translationNs = Namespaces.tourSearchNs,
  translationLabel = "Travel details",
}: {
  onFilterButtonClick: () => void;
  numberOfSelectedFilters?: number;
  setContextState?: (state: Partial<any>) => void;
  onButtonClick?: () => void;
  translationNs?: Namespaces;
  translationLabel?: string;
}) => {
  const onCalendarButtonClick = useCallback(() => {
    if (setContextState)
      setContextState({
        isAdvancedSearchModalOpen: true,
        advancedSearchCurrentStep: StepsEnum.Details,
        isFullStepsModal: true,
      });
  }, [setContextState]);

  return (
    <MediaQuery toDisplay={DisplayType.Large}>
      <MobileStickyFooter
        alwaysDisplay
        leftContent={
          <MobileFooterButton onClick={onButtonClick || onCalendarButtonClick}>
            <StyledCalendarIcon />
            <TextDateRangeFromQuery from={FilterQueryParam.DATE_FROM} to={FilterQueryParam.DATE_TO}>
              <Trans ns={translationNs}>{translationLabel}</Trans>
            </TextDateRangeFromQuery>
          </MobileFooterButton>
        }
        rightContent={
          <MobileFooterFilterButton
            onClick={onFilterButtonClick}
            numberOfSelectedFilters={numberOfSelectedFilters}
          />
        }
      />
    </MediaQuery>
  );
};

export default SearchMobileFooter;
