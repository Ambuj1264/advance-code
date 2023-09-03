import React, { ElementType, ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Trans } from "react-i18next";

import CalendarIcon from "components/icons/calendar-empty.svg";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import MobileStickyFooter, {
  MobileFooterContainer,
} from "components/ui/StickyFooter/MobileStickyFooter";
import {
  MobileFooterFilterButton,
  MobileFooterButton,
} from "components/ui/Filters/MobileFooterButton";
import { gutters, whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";

const iconWidth = 14;

const IconWrapper = styled.div();
const TextWrapper = styled.div();

const MobileFooterLeftButton = styled(MobileFooterButton)(css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${whiteColor};
  ${IconWrapper} {
    flex-grow: 0;
    flex-shrink: 0;

    svg {
      flex-shrink: 0;
      margin-right: ${gutters.small / 2}px;
      width: ${iconWidth}px;
      height: ${iconWidth}px;
      fill: ${whiteColor};
    }
  }

  ${TextWrapper} {
    flex-grow: 0;
    max-width: calc(100% - ${iconWidth - gutters.small / 2}px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
`);

const StyledMobileFooterFilterButton = styled(MobileFooterFilterButton)(css`
  border: 1px solid ${whiteColor};
`);

const LeftButton = ({
  onLeftButtonClick,
  leftButtonLabel,
  SvgIcon,
}: {
  SvgIcon: ElementType;
  onLeftButtonClick: () => void;
  leftButtonLabel: ReactNode | string;
}) => (
  <MobileFooterLeftButton onClick={onLeftButtonClick}>
    <IconWrapper>
      <SvgIcon />
    </IconWrapper>
    <TextWrapper>{leftButtonLabel}</TextWrapper>
  </MobileFooterLeftButton>
);

const StyledMobileStickyFooter = styled(MobileStickyFooter)(
  ({ theme, isSearchResults = false }: { isSearchResults?: boolean; theme?: Theme }) => css`
    background: ${isSearchResults ? whiteColor : theme?.colors.primary};
    ${MobileFooterContainer} {
      background: ${isSearchResults ? whiteColor : theme?.colors.primary};
    }
  `
);

const SearchAndFilterMobileFooter = ({
  onLeftButtonClick,
  onFilterButtonClick,
  numberOfSelectedFilters,
  leftButtonLabel,
  leftButtonLabelNs = Namespaces.tourSearchNs,
  leftButtonSvgIcon = CalendarIcon,
  isSearchResults = true,
}: {
  onLeftButtonClick: () => void;
  onFilterButtonClick: () => void;
  numberOfSelectedFilters?: number;
  leftButtonLabel?: ReactNode | string;
  leftButtonLabelNs?: Namespaces;
  leftButtonSvgIcon?: ElementType;
  isSearchResults?: boolean;
}) => {
  const label = leftButtonLabel ?? <Trans ns={leftButtonLabelNs}>Travel details</Trans>;

  return (
    <MediaQuery toDisplay={DisplayType.Large}>
      {isSearchResults ? (
        <StyledMobileStickyFooter
          isSearchResults
          leftContent={
            <LeftButton
              onLeftButtonClick={onLeftButtonClick}
              leftButtonLabel={label}
              SvgIcon={leftButtonSvgIcon}
            />
          }
          rightContent={
            <StyledMobileFooterFilterButton
              onClick={onFilterButtonClick}
              numberOfSelectedFilters={numberOfSelectedFilters}
            />
          }
        />
      ) : (
        <StyledMobileStickyFooter
          fullWidthContent={
            <LeftButton
              onLeftButtonClick={onLeftButtonClick}
              leftButtonLabel={leftButtonLabel}
              SvgIcon={leftButtonSvgIcon}
            />
          }
        />
      )}
    </MediaQuery>
  );
};

export default SearchAndFilterMobileFooter;
