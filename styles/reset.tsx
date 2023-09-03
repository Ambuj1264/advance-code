import { css } from "@emotion/core";

export const resetAll = css`
  margin: 0;
  border: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  vertical-align: baseline;
`;

export const resetHeading = resetAll;

export const resetParagraph = resetAll;

export const resetButton = css(
  resetAll,
  css`
    background: transparent;
    cursor: pointer;
    appearance: none;
    &:disabled {
      cursor: default;
    }
  `
);

export const resetAnchor = css`
  cursor: pointer;
  color: inherit;
  text-decoration: none;
`;

export const resetSelect = css(
  resetAll,
  css`
    background: transparent;
    appearance: none;
  `
);
