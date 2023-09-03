import React from "react";
import styled from "@emotion/styled";

import { constructRibbon } from "./utils/ribbonUtils";
import Ribbon from "./Ribbon";

const RibbonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 0px;
  width: 162px;
`;

const StyledRibbon = styled(Ribbon)`
  border-right: 12px solid transparent;
  border-left: 33px solid transparent;
  transform: rotate(31deg);
`;

const RibbonContainer = ({
  banner,
  customColor,
}: {
  banner: RibbonTypes.Banner;
  customColor?: string;
}) => {
  const ribbon = constructRibbon(banner);
  return (
    <RibbonWrapper>
      <StyledRibbon customColor={customColor} ribbonType={ribbon.type} ribbonText={ribbon.text} />
    </RibbonWrapper>
  );
};

export default RibbonContainer;
