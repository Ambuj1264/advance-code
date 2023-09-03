import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";

import { cover, container, row, column, mqMin, mqMax } from "styles/base";
import { columns } from "styles/variables";
import { KeyboardKey } from "types/enums";

const wrapper = (visible: boolean) =>
  css(
    cover,
    css`
      z-index: 9999999;
      display: ${visible ? "flex" : "none"};
      pointer-events: none;
      opacity: 0.1;
    `
  );

const gridRow = css(
  row,
  css`
    height: 100%;
  `
);

const col = css(
  column({
    small: 1 / columns.small,
    medium: 1 / columns.medium,
    large: 1 / columns.large,
    desktop: 1 / columns.desktop,
  }),
  css`
    display: flex;
    height: 100%;

    ${mqMax.medium} {
      &:nth-of-type(${columns.small}) ~ & {
        display: none;
      }
    }

    ${mqMin.medium} {
      ${mqMax.large} {
        &:nth-of-type(${columns.medium}) ~ & {
          display: none;
        }
      }
    }

    ${mqMax.large} {
      &:nth-of-type(${columns.large}) ~ & {
        display: none;
      }
    }

    ${mqMin.large} {
      ${mqMax.desktop} {
        &:nth-of-type(${columns.large}) ~ & {
          display: none;
        }
      }
    }

    ${mqMin.desktop} {
      &:nth-of-type(${columns.desktop}) ~ & {
        display: none;
      }
    }
  `
);

const innerCol = css`
  width: 100%;
  height: 100%;
  background-color: blue;
`;

const GridOverlay = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === KeyboardKey.Escape) {
        setVisible(!visible);
      }
    };
    document.addEventListener("keyup", keyHandler);
    return () => {
      document.removeEventListener("keyup", keyHandler);
    };
  });
  return (
    <div css={wrapper(visible)}>
      <div css={container}>
        <div css={gridRow}>
          {[...Array(12).keys()].map(i => (
            <div key={i} css={col}>
              <div css={innerCol} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridOverlay;
