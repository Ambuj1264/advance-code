import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { CSSTransition } from "react-transition-group";

import { WaypointWrapperForMobileFooter } from "components/ui/Lazy/WaypointWrapper";
import { zIndex } from "styles/variables";

const transitionName = "SearchTourListHeader";
const transitionDuration = 200;
const blockHeight = 400;

const Container = styled.div`
  position: relative;
  z-index: ${zIndex.z1};
  transition: opacity ${transitionDuration}ms ease-in, height ${transitionDuration}ms ease-in;
  will-change: height, opacity;
  &.${transitionName}-exit {
    height: ${blockHeight}px;
    opacity: 1;
  }
  &.${transitionName}-exit-active {
    height: 0;
    opacity: 0.1;
  }

  &.${transitionName}-enter {
    height: 0;
    opacity: 0.1;
  }
  &.${transitionName}-enter-active {
    height: ${blockHeight}px;
    opacity: 1;
  }
`;

const LandingHeaderWrapper = ({ children, isShow }: { children: ReactNode; isShow: boolean }) => {
  return (
    <CSSTransition
      in={isShow}
      timeout={transitionDuration}
      classNames={transitionName}
      unmountOnExit
    >
      <Container>
        <WaypointWrapperForMobileFooter lazyloadOffset="-150px" />
        {children}
      </Container>
    </CSSTransition>
  );
};

export default LandingHeaderWrapper;
