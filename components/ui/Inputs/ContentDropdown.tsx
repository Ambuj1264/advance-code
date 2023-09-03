import React, { useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import useOnOutsideClick from "@travelshift/ui/components/Popover/useOnOutsideClick";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import InformationBanner from "../InformationBanner";

import { capitalize } from "utils/globalUtils";
import { typographyBody2 } from "styles/typography";
import {
  gutters,
  greyColor,
  zIndex,
  boxShadowStrong,
  borderRadius,
  whiteColor,
  blackColor,
} from "styles/variables";
import { container, mqMin } from "styles/base";

type DropdownContentProps = {
  hasInputLabel: boolean;
  directionOverflow: "right" | "left" | null;
};

export const Wrapper = styled.div(
  css`
    ${container};
    margin-top: ${gutters.small}px;
  `
);

export const DisplayValue = styled.div([
  typographyBody2,
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${gutters.small / 2}px;
    border: 1px solid ${rgba(greyColor, 0.5)};
    border-radius: 4px;
    width: 100%;
    height: 45px;
    padding: 0 ${gutters.small}px;
    cursor: pointer;
    color: ${greyColor};
  `,
]);

export const DropdownContentWrapper = styled.div`
  padding: ${gutters.large}px;
`;

export const DropdownContainer = styled.div<DropdownContentProps>(
  ({ hasInputLabel, directionOverflow }) =>
    css`
      @keyframes fadeInContent {
        100% {
          opacity: 1;
          transform: translateY(4px);
        }
      }
      position: absolute;
      top: ${hasInputLabel ? 80 : 54}px;
      right: ${directionOverflow === "right" ? "unset" : 0};
      left: ${directionOverflow === "left" ? "unset" : 0};
      z-index: ${zIndex.z10};
      box-shadow: ${boxShadowStrong};
      border: 1px solid ${rgba(greyColor, 0.5)};
      border-radius: ${borderRadius};
      background-color: ${whiteColor};
      ${mqMin.large} {
        opacity: 0;
        transform: translateY(-8px);
        animation: fadeInContent 0.2s ease-out forwards;
      }
    `
);

export const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputLabel = styled.div([
  typographyBody2,
  css`
    color: ${rgba(blackColor, 0.7)};
  `,
]);

export const ArrowIcon = styled(Arrow)`
  width: 12px;
  height: 12px;
  fill: ${greyColor};
`;

const ContentDropdown = ({
  id,
  inputLabel,
  displayValue,
  children,
  isContentOpen,
  toggleContent,
  information,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOutsideClick = () => {},
  className,
  shouldDisplayArrowIcon = true,
  directionOverflow,
}: {
  id: string;
  inputLabel?: string;
  displayValue: React.ReactElement | React.ReactElement[];
  children: React.ReactElement | React.ReactElement[] | React.ReactNode;
  isContentOpen: boolean;
  toggleContent: () => void;
  onOutsideClick?: () => void;
  information?: string;
  className?: string;
  shouldDisplayArrowIcon?: boolean;
  directionOverflow?: "right" | "left";
}) => {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  useOnOutsideClick(contentWrapperRef, onOutsideClick);
  return (
    <Wrapper data-testid={id} onClick={e => e.stopPropagation()} className={className}>
      <ContentWrapper ref={contentWrapperRef}>
        {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
        <DisplayValue data-testid={`toggle${capitalize(id)}`} onClick={toggleContent}>
          {displayValue}
          {shouldDisplayArrowIcon && (
            <ArrowIcon
              css={css`
                transform: rotate(${isContentOpen ? "270deg" : "90deg"});
              `}
            />
          )}
        </DisplayValue>
        {isContentOpen && (
          <DropdownContainer
            hasInputLabel={inputLabel !== undefined}
            directionOverflow={directionOverflow || null}
          >
            <DropdownContentWrapper data-testid={`${id}Wrapper`}>{children}</DropdownContentWrapper>
            {information && <InformationBanner text={information} />}
          </DropdownContainer>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

export default ContentDropdown;
