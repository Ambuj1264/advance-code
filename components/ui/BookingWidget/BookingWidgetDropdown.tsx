import React, { ElementType, ReactNode, useCallback } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { useModalHistoryContext } from "contexts/ModalHistoryContext";
import { Namespaces } from "shared/namespaces";
import useToggle from "hooks/useToggle";
import { ContentDropdownStyled } from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import {
  ArrowIcon,
  DisplayValue,
  DropdownContainer,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import { borderRadiusSmall, greyColor, whiteColor, gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { styledWebkitScrollbar, singleLineTruncation } from "styles/base";

const DropdownWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

export const StyledContentDropdown = styled(ContentDropdownStyled)<{
  isSelected: boolean;
  matchesDefaultSelectedItem?: boolean;
}>(({ theme, isSelected, matchesDefaultSelectedItem = false }) => [
  css`
    ${DropdownContainer} {
      ${styledWebkitScrollbar};
      /* 80px footer margin, 150px top margin */
      max-height: calc(100vh - 230px);
      overflow: auto;
    }
    ${DropdownContentWrapper} {
      padding: 0;
    }
    ${ArrowIcon} {
      fill: ${isSelected ? whiteColor : greyColor};
    }
    ${DisplayValue} {
      border: 1px solid ${theme.colors.primary};
    }
  `,
  matchesDefaultSelectedItem &&
    css`
      border-radius: ${borderRadiusSmall};
      background-color: ${whiteColor};
      color: ${greyColor};
      ${ArrowIcon} {
        fill: ${greyColor};
      }
    `,
]);

export const DisplayWrapper = styled.span<{
  isSelected: boolean;
  matchesDefaultSelectedItem?: boolean;
}>(({ isSelected, theme, matchesDefaultSelectedItem = false }) => [
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${isSelected ? "0px" : borderRadiusSmall};
    width: 100%;
    height: 100%;
    background-color: ${isSelected ? theme.colors.primary : whiteColor};
    color: ${isSelected ? whiteColor : greyColor};
  `,
  matchesDefaultSelectedItem &&
    css`
      border-radius: ${borderRadiusSmall};
      background-color: ${whiteColor};
      color: ${greyColor};
    `,
]);

const iconStyles = ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => css`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  fill: ${isSelected ? whiteColor : theme.colors.primary};
`;

const DropdownTitleWrapper = styled.div`
  display: flex;
  max-width: 80%;
`;

const StyledDropdownTitle = styled.span([singleLineTruncation]);

const BookingWidgetDropdown = ({
  id,
  className,
  isSelected,
  isOpen: isOpenExternal,
  isDisabled,
  selectedTitle,
  Icon,
  isLoading,
  children,
  matchesDefaultSelectedItem,
  onOpenStateChange,
  defaultTitle,
  onClick,
  alwaysCloseOnOutsideClick = false,
}: {
  id: string;
  className?: string;
  isSelected: boolean;
  isOpen?: boolean;
  matchesDefaultSelectedItem?: boolean;
  isDisabled?: boolean;
  selectedTitle: string;
  Icon?: ElementType;
  isLoading?: boolean;
  children?: ReactNode;
  defaultTitle?: string;
  onClick?: () => void;
  alwaysCloseOnOutsideClick?: boolean;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const dropdownTitle = defaultTitle || commonT("Select");
  const theme: Theme = useTheme();
  const isExternallyControlled = typeof isOpenExternal === "boolean";
  const [isOpenInternal, toggleIsOpen] = useToggle(false);
  const isOpen = isExternallyControlled ? isOpenExternal : isOpenInternal;

  const { currentId } = useModalHistoryContext();
  const toggleIsOpenCb = useCallback(() => {
    toggleIsOpen();
    onOpenStateChange?.(!isOpen);
  }, [isOpen, onOpenStateChange, toggleIsOpen]);
  const onToggle = useCallback(() => {
    if (!isDisabled) {
      toggleIsOpenCb();
    }
  }, [isDisabled, toggleIsOpenCb]);
  const onOutsideClick = useCallback(() => {
    if (isOpen && (!currentId || alwaysCloseOnOutsideClick)) toggleIsOpenCb();
  }, [isOpen, toggleIsOpenCb, currentId, alwaysCloseOnOutsideClick]);

  return (
    <DropdownWrapper data-testid={id}>
      <StyledContentDropdown
        className={className}
        id={`${id}Dropdown`}
        matchesDefaultSelectedItem={matchesDefaultSelectedItem}
        displayValue={
          <DisplayWrapper
            isSelected={isSelected}
            matchesDefaultSelectedItem={matchesDefaultSelectedItem}
            onClick={onClick}
          >
            {Icon && (
              <Icon
                css={iconStyles({
                  theme,
                  isSelected: !matchesDefaultSelectedItem && isSelected,
                })}
              />
            )}
            {isLoading ? (
              <Bubbles theme={theme} color="primary" />
            ) : (
              <DropdownTitleWrapper>
                <StyledDropdownTitle>
                  {isSelected ? selectedTitle : dropdownTitle}
                </StyledDropdownTitle>
              </DropdownTitleWrapper>
            )}
          </DisplayWrapper>
        }
        isContentOpen={isOpen}
        onOutsideClick={onOutsideClick}
        toggleContent={onToggle}
        isSelected={isSelected}
      >
        {children}
      </StyledContentDropdown>
    </DropdownWrapper>
  );
};

export default BookingWidgetDropdown;
