import { isBrowser } from "utils/helperUtils";

export const constructTooltipDirecton = (
  blockWidth: number,
  titleWidth: number,
  tooltipWidth: number
): TooltipTypes.Direction => {
  const halfBlockWidth = blockWidth / 2;
  const halfTooltipWidth = tooltipWidth / 2;

  const isTitleWiderThanHalfBlock = titleWidth > halfBlockWidth;
  const isHalfTooltipWiderThanBlockEmptySpace = halfTooltipWidth > blockWidth - titleWidth;

  const isTitleNarrowThanHalfBlock = titleWidth < halfBlockWidth;
  const isHalfTooltipWiderThanTitle = halfTooltipWidth > titleWidth;

  let direction = "center";
  if (isTitleWiderThanHalfBlock && isHalfTooltipWiderThanBlockEmptySpace) {
    direction = "left";
  } else if (isTitleNarrowThanHalfBlock && isHalfTooltipWiderThanTitle) {
    direction = "right";
  }

  return direction as TooltipTypes.Direction;
};

/* eslint-disable functional/immutable-data */
export const getInfoTextWidth = (text: string, defaultWidth = 300) => {
  if (isBrowser) {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-999em";
    container.style.whiteSpace = "nowrap";
    container.style.fontSize = "12px";
    container.innerHTML = text;
    document.body.appendChild(container);
    const result = container.clientWidth;
    document.body.removeChild(container);
    return result;
  }

  return defaultWidth;
};

export const constructTooltipWidth = (
  blockWidth: number,
  titleWidth: number,
  tooltipWidth: number
): number => {
  const halfBlockWidth = blockWidth / 2;
  const blockEmptyWidth = blockWidth - titleWidth;

  const isTitleWiderThanHalfBlock = titleWidth > halfBlockWidth;
  const isTooltipWiderThanTitle = tooltipWidth > titleWidth;

  const isTitleNarrowerThanHalfBlock = titleWidth < halfBlockWidth;
  const isTooltipWiderThanBlockEmptySpace = tooltipWidth > blockEmptyWidth;

  const isTooltipWiderThanBlock = tooltipWidth > blockWidth;

  let width = tooltipWidth;
  if (isTitleWiderThanHalfBlock && isTooltipWiderThanTitle) {
    width = titleWidth;
  } else if (isTitleNarrowerThanHalfBlock && isTooltipWiderThanBlockEmptySpace) {
    width = blockEmptyWidth;
  } else if (isTooltipWiderThanBlock) {
    width = blockWidth;
  }

  return width;
};
