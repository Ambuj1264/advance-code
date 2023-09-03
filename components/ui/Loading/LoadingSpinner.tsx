import styled from "@emotion/styled";
import { css } from "@emotion/core";

export const spinnerStyles = (
  theme: Theme,
  size?: { height: number; width: number },
  animationSpeed = 1.5,
  borderWidth = 3
) => css`
  display: inline-block;
  border: ${borderWidth}px solid ${theme.colors.primary};
  border-radius: 50%;
  width: ${size?.width ?? 43}px;
  height: ${size?.height ?? 43}px;
  animation: rotateSpinner ${animationSpeed}s infinite cubic-bezier(0.25, 0.1, 0.5, 0.25);
  border-top-color: transparent;
`;

export default styled.div<{
  size?: { height: number; width: number };
  animationSpeed?: number;
  borderWidth?: number;
}>(
  ({ theme, size, animationSpeed, borderWidth }) => css`
    @keyframes rotateSpinner {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 160px;

    &:before {
      content: "";
      ${spinnerStyles(theme, size, animationSpeed, borderWidth)};
    }
  `
);
