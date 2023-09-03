import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getColor } from "./utils/ribbonUtils";

import { whiteColor, gutters } from "styles/variables";
import { typographyCaptionSemibold } from "styles/typography";

type RibbonProps = {
  ribbonType: RibbonTypes.RibbonType;
  customColor?: string;
};

const CoverRibbon = styled.div<RibbonProps>(({ theme, ribbonType, customColor }) => [
  typographyCaptionSemibold,
  css`
    position: relative;

    border-right: 33px solid transparent;
    border-bottom: 20px solid
      ${ribbonType === "custom" && customColor
        ? customColor
        : rgba(getColor(ribbonType, theme), 0.8)};
    border-left: 12px solid transparent;
    box-sizing: content-box;
    width: 152px;
    height: 0;
    color: ${whiteColor};
    text-align: center;
    transform: rotate(-31deg);
  `,
]);

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${gutters.small / 2}px;
  height: 20px;
`;

const Ribbon = ({
  ribbonText,
  ribbonType,
  className,
  customColor,
}: {
  ribbonType: RibbonTypes.RibbonType;
  ribbonText: string;
  className?: string;
  customColor?: string;
}) => {
  return (
    <CoverRibbon
      id="ribbon"
      customColor={customColor}
      ribbonType={ribbonType}
      className={className}
    >
      <Wrapper>{ribbonText}</Wrapper>
    </CoverRibbon>
  );
};

export default Ribbon;
