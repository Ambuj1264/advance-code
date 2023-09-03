import React, { useCallback } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { constructCabinTypes } from "./utils/flightSearchWidgetUtils";
import FlightFareCategoryPicker from "./FlightFareCategoryPicker";

import { Namespaces } from "shared/namespaces";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import ContentDropdown, {
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
  ArrowIcon,
} from "components/ui/Inputs/ContentDropdown";
import { mqMin, singleLineTruncation } from "styles/base";
import useToggle from "hooks/useToggle";
import { gutters, whiteColor, blackColor, greyColor, borderRadiusSmall } from "styles/variables";
import { typographySubtitle3, typographyBody2 } from "styles/typography";
import { useTranslation } from "i18n";
import EconomyIcon from "components/icons/economy.svg";

const Wrapper = styled.div<{ noBackground: boolean }>(
  ({ noBackground }) =>
    css`
      width: ${noBackground ? "auto" : "calc(50% - 8px)"};
    `
);

export const ContentDropdownStyled = styled(ContentDropdown)<{
  noBackground: boolean;
  autoHeight: boolean;
}>(({ noBackground, autoHeight = false }) => [
  noBackground &&
    css`
      flex-grow: 0;
    `,
  css`
    margin: ${noBackground ? gutters.small / 2 : 0}px 0 0 0;
    border: ${noBackground ? "none" : `1px solid ${rgba(greyColor, 0.5)}`};
    border-radius: ${noBackground ? 0 : borderRadiusSmall};
    padding-left: ${gutters.large / 2}px;
    background-color: ${noBackground ? "transparent" : whiteColor};
    user-select: none;
    color: ${rgba(blackColor, 0.7)};
    ${mqMin.large} {
      padding-right: ${gutters.small / 2}px;
      padding-left: ${gutters.small}px;
    }
    ${DropdownContentWrapper} {
      ${mqMin.large} {
        padding: ${gutters.small}px;
      }
    }
    ${DropdownContainer} {
      top: ${noBackground ? `${gutters.large}px` : "auto"};
    }
    ${DisplayValue} {
      position: relative;
      margin: 0;
      border: none;
      height: ${noBackground ? 24 : 40}px;
      padding: 0;
      background: none;
      ${mqMin.large} {
        height: ${noBackground ? 24 : 48}px;
      }
    }
    ${ArrowIcon} {
      position: ${noBackground ? "static" : "absolute"};
      right: ${noBackground ? "auto" : `0`};
      margin-left: ${noBackground ? `${gutters.large / 4}px` : "auto"};
      ${noBackground ? `fill: ${whiteColor}` : ""}
    }
  `,
  autoHeight &&
    css`
      ${DisplayValue} {
        height: auto;
      }
    `,
]);

const ContentWrapper = styled.div`
  min-width: 170px;
`;

export const NoBackgroundDisplay = styled.div([
  typographySubtitle3,
  css`
    margin-left: -${gutters.large}px;
    color: ${whiteColor};
  `,
]);

export const DisplayWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
  ${mqMin.large} {
    ${typographySubtitle3}
  }
`;

const DisplayItemWrapper = styled.div([
  singleLineTruncation,
  typographyBody2,
  css`
    position: relative;
    display: flex;
    align-items: center;
    width: 78%;
    height: 100%;
    color: ${greyColor};
  `,
]);

const Item = styled.div`
  ${singleLineTruncation};
  display: block;
  margin-left: ${gutters.small / 2}px;
  width: 100%;
`;

const StyledEconomyIcon = styled(EconomyIcon)(
  ({ theme }) => css`
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

const FlightFareCategoryDisplay = ({
  selectedValue,
  noBackground,
}: {
  selectedValue: string;
  noBackground?: boolean;
}) => {
  if (noBackground) {
    return <NoBackgroundDisplay>{selectedValue}</NoBackgroundDisplay>;
  }
  return (
    <DisplayWrapper>
      <DisplayItemWrapper>
        <StyledEconomyIcon />
        <Item>{selectedValue}</Item>
      </DisplayItemWrapper>
    </DisplayWrapper>
  );
};

const FlightFareCategoryContainer = ({
  id,
  noBackground = false,
  autoHeight = false,
  onClick,
  cabinType,
  onCabinTypeChange,
  className,
}: {
  id: string;
  noBackground?: boolean;
  onClick?: () => void;
  cabinType: FlightSearchTypes.CabinType;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  className?: string;
  autoHeight?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const isMobile = useIsMobile();
  const [isOpen, toggleIsOpen] = useToggle(false);
  const cabinTypes = constructCabinTypes(t);
  const selectedValue = cabinTypes.find(type => type.id === cabinType)?.name ?? "";
  const onChangeCallback = useCallback(
    (chosenCabinType: FlightSearchTypes.CabinType) => {
      onCabinTypeChange(chosenCabinType);
      toggleIsOpen();
    },
    [onCabinTypeChange, toggleIsOpen]
  );
  return (
    <Wrapper noBackground={noBackground} className={className}>
      <ContentDropdownStyled
        id={id}
        className={className}
        displayValue={
          <FlightFareCategoryDisplay selectedValue={selectedValue} noBackground={noBackground} />
        }
        isContentOpen={isOpen}
        toggleContent={isMobile && onClick ? onClick : toggleIsOpen}
        onOutsideClick={() => {
          if (!isOpen) return;
          toggleIsOpen();
        }}
        noBackground={noBackground}
        autoHeight={autoHeight}
        directionOverflow={isMobile ? "left" : "right"}
      >
        <ContentWrapper>
          <FlightFareCategoryPicker
            cabinType={cabinType}
            onCabinTypeChange={onChangeCallback}
            cabinTypes={cabinTypes}
          />
        </ContentWrapper>
      </ContentDropdownStyled>
    </Wrapper>
  );
};

export default FlightFareCategoryContainer;
