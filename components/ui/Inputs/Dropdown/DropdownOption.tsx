import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import CheckMarkIcon from "@travelshift/ui/icons/checkmark.svg";

import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { gutters, whiteColor, greyColor, redColor } from "styles/variables";

type Props = {
  id: string;
  isSelected: boolean;
  label: string;
  extraInfo?: string | JSX.Element;
  disabled?: boolean;
  className?: string;
};

const SelectedOptionIcon = styled(CheckMarkIcon)`
  width: 10px;
  min-width: 10px;
  height: auto;
  fill: ${whiteColor};
`;

type IconContainerProps = {
  isSelected: boolean;
};

export const ExtraInfo = styled.div<{ disabled: boolean }>(({ disabled }) => [
  typographySubtitle2,
  css`
    flex-shrink: 0;
    color: ${disabled ? redColor : greyColor};
    text-align: right;
  `,
]);

const IconContainer = styled.div<IconContainerProps>(
  ({ theme, isSelected }) =>
    css`
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      border: 1px solid ${isSelected ? theme.colors.action : rgba(greyColor, 0.4)};
      border-radius: 10px;
      width: 20px;
      height: 20px;
      background-color: ${isSelected ? theme.colors.action : whiteColor};
    `
);

const OptionLabel = styled.div<{ disabled: boolean }>(({ disabled }) => [
  typographyBody2,
  css`
    padding-left: ${gutters.small}px;
    text-decoration: ${disabled ? "line-through" : "none"};
  `,
]);

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div<{ disabled: boolean; isSelected?: boolean }>(
  ({ disabled }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 44px;
      &:hover {
        cursor: ${disabled ? "auto" : "pointer"};
      }
    `
);

const DropdownOption = ({
  id,
  isSelected,
  label,
  extraInfo,
  disabled = false,
  className,
}: Props) => (
  <Wrapper id={id} disabled={disabled} isSelected={isSelected} className={className}>
    <LabelWrapper>
      <IconContainer isSelected={isSelected}>
        <SelectedOptionIcon />
      </IconContainer>
      <OptionLabel id="optionLabel" disabled={disabled}>
        {label}
      </OptionLabel>
    </LabelWrapper>
    {extraInfo && <ExtraInfo disabled={disabled}>{extraInfo}</ExtraInfo>}
  </Wrapper>
);

export default DropdownOption;
