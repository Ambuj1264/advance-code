import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { singleLineTruncation } from "styles/base";
import { fontSizeCaption, fontWeightSemibold, whiteColor } from "styles/variables";
import Ribbon from "components/icons/ribbon-one-sided.svg";

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  height: 26px;
  overflow: hidden;
`;

const RibbonImage = styled(Ribbon, { shouldForwardProp: () => false })<{
  ribbonSide: string;
}>(
  ({ theme, ribbonSide }) => css`
    width: 24px;
    transform: ${ribbonSide === "left" ? "none" : "scaleX(-1)"};
    fill: ${rgba(theme.colors.primary, 0.8)};
  `
);

const Label = styled.span<{ ribbonSide: string }>(({ theme, ribbonSide }) => [
  singleLineTruncation,
  css`
    flex-grow: 1;
    padding-right: ${ribbonSide === "right" ? "0" : "9px"};
    padding-left: ${ribbonSide === "left" ? "0" : "9px"};
    background-color: ${rgba(theme.colors.primary, 0.8)};
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
  `,
]);

const RibbonLabel = ({
  className,
  ribbonSide = "left",
  children,
}: {
  className?: string;
  ribbonSide?: "left" | "right";
  children: React.ReactNode;
}) => (
  <Wrapper className={className}>
    {ribbonSide === "left" && <RibbonImage ribbonSide={ribbonSide} />}
    <Label ribbonSide={ribbonSide}>{children}</Label>
    {ribbonSide === "right" && <RibbonImage ribbonSide={ribbonSide} />}
  </Wrapper>
);

export default RibbonLabel;
