import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { headerHeight, zIndex, borderRadiusSmall } from "styles/variables";
import useToggle from "hooks/useToggle";

const LOADING_BAR_CONTAINER_HEIGHT = 12;
const LOADING_BAR_HEIGHT = 4;
const LOADING_BAR_TOP_POSITION =
  parseInt(headerHeight, 10) - (LOADING_BAR_CONTAINER_HEIGHT - LOADING_BAR_HEIGHT) / 2;

const Wrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: 100%;
    height: ${LOADING_BAR_HEIGHT}px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
  `
);

const FirstLoad = styled.div`
  position: absolute;
  width: 35%;
  height: 100%;
  overflow: hidden;
`;

const SecondLoad = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Progress = styled.div<{ duration: number; delay: number }>(
  ({ theme, duration, delay }) => css`
    @keyframes progress {
      0% {
        transform: translate3d(-100%, 0, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.primary};
    transform: translate3d(-100%, 0, 0);
    animation: progress ${duration}s linear ${delay}s 1 normal forwards;
  `
);

export const LoadingBarWrapper = styled.div`
  position: sticky;
  top: ${LOADING_BAR_TOP_POSITION}px;
  z-index: ${zIndex.z1};
  display: flex;
  align-items: center;
  height: ${LOADING_BAR_CONTAINER_HEIGHT}px;
  pointer-events: none;
`;

const LoadingBar = ({ isLoading }: { isLoading?: boolean }) => {
  const [isHidden, toggleIsHidden] = useToggle(!isLoading);
  useEffect(() => {
    if (isLoading && isHidden) {
      toggleIsHidden();
    } else if (!isLoading && !isHidden) {
      setTimeout(toggleIsHidden, 2100);
    }
  }, [isHidden, isLoading, toggleIsHidden]);

  return (
    <LoadingBarWrapper>
      {!isHidden && (
        <Wrapper>
          <FirstLoad>
            <Progress duration={5} delay={0} />
          </FirstLoad>
          {!isLoading && (
            <SecondLoad>
              <Progress duration={2} delay={0} />
            </SecondLoad>
          )}
        </Wrapper>
      )}
    </LoadingBarWrapper>
  );
};

export default LoadingBar;
