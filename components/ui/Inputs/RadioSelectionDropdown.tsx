import React, { useCallback } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import ContentDropdown, {
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
  ArrowIcon,
} from "components/ui/Inputs/ContentDropdown";
import RadioButton from "components/ui/Inputs/RadioButton";
import useToggle from "hooks/useToggle";
import { typographySubtitle3 } from "styles/typography";
import { gutters, whiteColor, blackColor } from "styles/variables";

export const ContentDropdownStyled = styled(ContentDropdown)<{
  directionOverflow: "right" | "left";
}>(
  ({ directionOverflow }) =>
    css`
      flex-grow: 0;
      margin: ${gutters.small / 2}px 0 0 0;
      padding: 0;
      user-select: none;
      color: ${rgba(blackColor, 0.7)};
      ${DropdownContentWrapper} {
        padding: ${gutters.small}px;
      }
      ${DropdownContainer} {
        top: ${gutters.large}px;
        right: ${directionOverflow === "right" ? "unset" : 0};
        left: ${directionOverflow === "right" ? `-${gutters.large}px` : "unset"};
      }
      ${DisplayValue} {
        position: relative;
        justify-content: flex-start;
        margin: 0;
        border: none;
        height: 24px;
        padding: 0;
        background: none;
      }
      ${ArrowIcon} {
        margin-left: ${gutters.large / 4}px;
        fill: ${whiteColor};
      }
    `
);

export const ContentWrapper = styled.div<{ dropdownWidth: number }>(
  ({ dropdownWidth }) =>
    css`
      min-width: ${dropdownWidth}px;
    `
);

const CabinTypeWrapper = styled.div`
  :not(:last-of-type) {
    margin-bottom: ${gutters.small / 2}px;
  }
`;

export const DisplayWrapper = styled.div([
  typographySubtitle3,
  css`
    margin-left: -${gutters.large}px;
    color: ${whiteColor};
  `,
]);

export const DropdownDisplay = ({
  selectedValue,
  onClick,
  className,
  title,
}: {
  selectedValue: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}) => {
  return (
    <DisplayWrapper className={className} onClick={onClick} title={title}>
      {selectedValue}
    </DisplayWrapper>
  );
};

const RadioSelectionDropdown = ({
  id,
  selectedValue,
  options,
  onChange,
  onClick,
  dropdownWidth = 160,
  directionOverflow = "right",
  shouldDisplayArrowIcon = true,
  shouldDisplayTitle,
  className,
}: {
  id: string;
  selectedValue?: SharedTypes.AutocompleteItem;
  options: SharedTypes.AutocompleteItem[];
  onChange: (id: string) => void;
  onClick?: () => void;
  dropdownWidth?: number;
  directionOverflow?: "right" | "left";
  shouldDisplayArrowIcon?: boolean;
  shouldDisplayTitle?: boolean;
  className?: string;
}) => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  const onChangeCallback = useCallback(
    (optionId: string) => {
      onChange(optionId);
      toggleIsOpen();
    },
    [onChange, toggleIsOpen]
  );
  return (
    <ContentDropdownStyled
      id={id}
      className={className}
      displayValue={
        <DropdownDisplay
          selectedValue={selectedValue?.name ?? ""}
          title={shouldDisplayTitle ? selectedValue?.name : undefined}
        />
      }
      isContentOpen={isOpen}
      toggleContent={onClick || toggleIsOpen}
      onOutsideClick={() => {
        if (!isOpen) return;
        toggleIsOpen();
      }}
      directionOverflow={directionOverflow}
      shouldDisplayArrowIcon={shouldDisplayArrowIcon}
    >
      <ContentWrapper dropdownWidth={dropdownWidth}>
        {options.map(({ id: optionId, name }) => (
          <CabinTypeWrapper key={optionId}>
            <RadioButton
              checked={selectedValue?.id === optionId}
              label={name}
              name={name}
              value={optionId}
              id={`${name}Option`}
              onChange={() => {
                onChangeCallback(optionId);
              }}
            />
          </CabinTypeWrapper>
        ))}
      </ContentWrapper>
    </ContentDropdownStyled>
  );
};

export default RadioSelectionDropdown;
