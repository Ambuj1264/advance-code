import React from "react";
import styled from "@emotion/styled";
import { CSSTransition } from "react-transition-group";

const transitionName = "fadeIn";
const transitionDuration = 200;

const FadeInTransition = styled.div`
  width: 100%;
  height: 100%;
  transition: opacity ${transitionDuration}ms ease-in;
  will-change: opacity;
  &.${transitionName}-exit {
    opacity: 1;
  }
  &.${transitionName}-exit-active {
    opacity: 0.1;
  }

  &.${transitionName}-enter {
    opacity: 0.1;
  }
  &.${transitionName}-enter-active {
    opacity: 1;
  }
`;

const FadeIn = ({
  children,
  show,
  transitionKey,
}: {
  children: React.ReactNode;
  show: boolean;
  transitionKey?: string;
}) => (
  <CSSTransition
    in={show}
    timeout={transitionDuration}
    classNames={transitionName}
    key={transitionKey}
    unmountOnExit
  >
    <FadeInTransition>{children}</FadeInTransition>
  </CSSTransition>
);

export default FadeIn;
