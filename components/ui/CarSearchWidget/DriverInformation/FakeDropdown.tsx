import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import { useTheme } from "emotion-theming";

import { mqMin, singleLineTruncation } from "styles/base";
import { typographyBody2 } from "styles/typography";
import {
  borderRadiusSmall,
  greyColor,
  gutters,
  separatorColorLight,
  whiteColor,
} from "styles/variables";
import { SelectLoadingComponent, SelectLoadingContentWrapper } from "components/ui/Inputs/Select";

const FakeDropdownWrapper = styled.button<{
  buttonHeight?: number;
  maxHeight?: string;
}>(({ buttonHeight, maxHeight }) => [
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${rgba(greyColor, 0.5)};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: ${buttonHeight ? `${buttonHeight}px` : "40px"};
    max-height: ${maxHeight || "initial"};
    padding: 0 ${gutters.small / 2}px;
    background-color: ${whiteColor};
    color: ${greyColor};

    ${mqMin.medium} {
      padding: 0 ${gutters.small}px;
      padding-right: ${gutters.small / 2}px;
    }

    ${mqMin.large} {
      justify-content: space-around;
      border: 1px solid ${separatorColorLight};
      padding-right: ${gutters.small}px;
    }
  `,
]);

export const StyledSelectLoadingComponent = styled(SelectLoadingComponent)<{
  maxElementHeight?: number;
}>(({ maxElementHeight }) => [
  css`
    border: 1px solid ${rgba(greyColor, 0.5)};
    width: 100%;
    max-height: ${maxElementHeight ? `${maxElementHeight}px` : "40px"};
    ${mqMin.large} {
      border: 1px solid ${separatorColorLight};
    }
    ${SelectLoadingContentWrapper} {
      border-radius: ${borderRadiusSmall};
    }
  `,
]);

const BubblesWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ArrowIcon = styled(Arrow)`
  width: 12px;
  height: 12px;
  transform: rotate(90deg);
  fill: ${greyColor};
`;

const TextContainer = styled.span([
  singleLineTruncation,
  css`
    display: inline-block;
    max-width: 55%;
    text-align: center;
  `,
]);
const FakeDropdown = ({
  loading = false,
  height,
  mobileHeight,
  maxHeight,
  text,
  onClick,
  id,
  Icon,
  className,
  extraSelectLoadingLabel,
}: {
  loading?: boolean;
  height?: number;
  mobileHeight?: number;
  maxHeight?: string;
  text: string;
  onClick: () => void;
  id: string;
  Icon?: React.ElementType;
  className?: string;
  extraSelectLoadingLabel?: React.ReactNode;
}) => {
  const theme: Theme = useTheme();
  return !loading ? (
    <FakeDropdownWrapper
      buttonHeight={height}
      type="button"
      id={id}
      onClick={onClick}
      maxHeight={maxHeight}
      className={className}
    >
      {Icon && <Icon />}
      <TextContainer>{text}</TextContainer>
      <ArrowIcon />
    </FakeDropdownWrapper>
  ) : (
    <div className={className}>
      {extraSelectLoadingLabel}
      <StyledSelectLoadingComponent
        selectHeight={height}
        maxElementHeight={height}
        mobileHeight={mobileHeight}
      >
        <BubblesWrapper>
          <Bubbles theme={theme} color="primary" size="small" />
        </BubblesWrapper>
      </StyledSelectLoadingComponent>
    </div>
  );
};

export default FakeDropdown;
