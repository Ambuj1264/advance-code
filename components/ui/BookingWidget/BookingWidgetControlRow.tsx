import React, { ReactNode, useEffect, useRef, useState } from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { DisplayValue, ArrowIcon } from "../Inputs/ContentDropdown";
import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import BookingWidgetDateRangeDropdown from "./BookingWidgetDateRangeDropdown";

import { errorAsterisk } from "styles/base";
import Tooltip, { TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import {
  ToggleButtonLabel,
  ToggleButtonOption,
  ToggleButtonSmall,
} from "components/ui/Inputs/ToggleButton";
import { Namespaces } from "shared/namespaces";
import InformationIcon from "components/icons/information-circle.svg";
import { typographyCaption, typographyCaptionSemibold } from "styles/typography";
import { blackColor, gutters, guttersPx, zIndex } from "styles/variables";
import { useTranslation } from "i18n";
import { getInfoTextWidth } from "components/ui/Tooltip/utils/tooltipUtils";
import InformationTooltip, {
  InformationCircleIcon,
} from "components/ui/Tooltip/InformationTooltip";

export const BookingWidgetRow = styled.div<{ offsetTop?: number }>(({ offsetTop = 0 }) => [
  css`
    padding: ${guttersPx.small} ${guttersPx.large} 0 ${guttersPx.large};

    ${BookingWidgetDateRangeDropdown} {
      margin: 0;
      padding: 0;
    }
    ${DisplayValue} {
      margin-top: 0;

      ${ArrowIcon} {
        margin-left: ${gutters.small / 4}px;
        width: 8px;
        height: 8px;
      }
    }
  `,
  offsetTop
    ? css`
        transform: translateX(0);
        transition: transform 0.2s ease-in-out;
        will-change: transform;

        &[data-isopen="true"] {
          position: relative;
          z-index: ${zIndex.z3};
          transform: translateY(${-offsetTop}px);
        }
        &[data-isopen="false"] {
          transform: none;
          will-change: auto;
        }
      `
    : "",
]);

export const BookingWidgetInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${guttersPx.smallHalf};
`;

export const BookingWidgetLabel = styled.div<{ isRequired: boolean }>(({ isRequired }) => [
  typographyCaptionSemibold,
  isRequired && errorAsterisk,
  css`
    padding-right: ${guttersPx.smallHalf};
    color: ${rgba(blackColor, 0.7)};
  `,
]);

const BookingWidgetSubtitle = styled.span(({ theme }) => [
  typographyCaption,
  css`
    flex-grow: 1;
    color: ${theme.colors.action};
    text-align: right;
  `,
]);

const StyledInformationIcon = styled(InformationIcon)(
  ({ theme }) => css`
    margin-bottom: 4px;
    width: 12px;
    height: 12px;
    fill: ${theme.colors.primary};
  `
);

const BookingWidgetInfoIcon = styled.div`
  margin-right: ${guttersPx.smallHalf};
  width: 12px;
  height: 16px;
  cursor: pointer;
`;

export const StyledToggleButtonSmall = styled(ToggleButtonSmall)<{
  alwaysUseThemeToggleColor: boolean;
}>(
  ({ alwaysUseThemeToggleColor, theme }) =>
    alwaysUseThemeToggleColor &&
    css`
      ${ToggleButtonLabel} {
        background: ${theme.colors.primary};
      }
      ${ToggleButtonOption} {
        color: ${theme.colors.primary};
      }
    `
);

const StyledInformationTooltip = styled(InformationTooltip)(
  ({ theme }) => css`
    ${TooltipWrapper} {
      padding: ${gutters.small}px;
    }
    ${InformationCircleIcon} {
      margin-bottom: ${gutters.large / 4}px;
      margin-left: -${gutters.large / 4}px;
      width: 12px;
      height: 12px;
      fill: ${theme.colors.primary};
    }
  `
);

const StyledDoubleLabel = styled(DoubleLabel)`
  margin: ${gutters.small}px 0 0 0;
  width: 100%;
`;

const BookingWidgetControlRow = ({
  title,
  rightTitle,
  subtitle,
  onInfoClick,
  onToggleChange,
  isChecked,
  children,
  className,
  tooltipInfo,
  isTooltipVisible = false,
  isOpen,
  alwaysUseThemeToggleColor = false,
  informationTooltipContent,
  isRequired = false,
}: {
  title: string;
  rightTitle?: string;
  subtitle?: string;
  onInfoClick?: () => void;
  isChecked?: boolean;
  onToggleChange?: (checked: boolean) => void;
  children: ReactNode;
  className?: string;
  tooltipInfo?: string;
  isTooltipVisible?: boolean;
  isOpen?: boolean;
  alwaysUseThemeToggleColor?: boolean;
  informationTooltipContent?: string | React.ReactNode;
  isRequired?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const rowRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const tooltipWidth = tooltipInfo ? getInfoTextWidth(tooltipInfo, 220) + gutters.large : undefined;

  useEffect(() => {
    const rowRefCurrent = rowRef.current;
    if (rowRefCurrent && isOpen) {
      const wrapperScrollPos = (rowRefCurrent.parentNode as HTMLDivElement)?.scrollTop;

      let offsetValue;
      if (wrapperScrollPos < 36) {
        offsetValue = rowRefCurrent.offsetTop - wrapperScrollPos - gutters.large - gutters.small;
      } else {
        offsetValue = rowRefCurrent.offsetTop - wrapperScrollPos;
      }

      setOffsetTop(offsetValue);
    }
  }, [isOpen]);

  return (
    <BookingWidgetRow className={className} ref={rowRef} offsetTop={offsetTop} data-isopen={isOpen}>
      <BookingWidgetInfoWrapper>
        {informationTooltipContent && (
          <StyledInformationTooltip
            information={informationTooltipContent}
            direction="right"
            tooltipWidth={300}
            topThreshold={500}
          />
        )}
        {onInfoClick && (
          <BookingWidgetInfoIcon onClick={onInfoClick}>
            <StyledInformationIcon />
          </BookingWidgetInfoIcon>
        )}
        {title && rightTitle ? (
          <StyledDoubleLabel leftLabel={title} rightLabel={rightTitle} />
        ) : (
          <BookingWidgetLabel isRequired={isRequired}>{title}</BookingWidgetLabel>
        )}
        {isChecked !== undefined && onToggleChange && (
          <Tooltip
            title={tooltipInfo}
            direction="right"
            tooltipWidth={tooltipWidth}
            isVisible={isTooltipVisible}
          >
            <StyledToggleButtonSmall
              checked={isChecked}
              onChange={onToggleChange}
              offValue={t("No")}
              onValue={t("Yes")}
              alwaysUseThemeToggleColor={alwaysUseThemeToggleColor}
              id={`bookingWidgetIncludeToggle${title.replace(" ", "")}`}
            />
          </Tooltip>
        )}
        {subtitle && <BookingWidgetSubtitle>{subtitle}</BookingWidgetSubtitle>}
      </BookingWidgetInfoWrapper>
      {children}
    </BookingWidgetRow>
  );
};

export default BookingWidgetControlRow;
