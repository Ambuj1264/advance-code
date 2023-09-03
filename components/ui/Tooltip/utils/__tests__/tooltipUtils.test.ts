import { constructTooltipDirecton, constructTooltipWidth } from "../tooltipUtils";

describe("constructTooltipDirecton", () => {
  const blockWidth = 300;
  const titleWidth = 200;
  const tooltipWidth = 250;
  test("left position when a title occupies more than a half of block and half of tooltip bigger than empty space in a block", () => {
    expect(constructTooltipDirecton(blockWidth, titleWidth, tooltipWidth)).toEqual("left");
  });

  const blockWidth1 = 300;
  const titleWidth1 = 250;
  const tooltipWidth1 = 90;
  test("center position when a title occupies more than half of block and half of tooltip less than empty space in block", () => {
    expect(constructTooltipDirecton(blockWidth1, titleWidth1, tooltipWidth1)).toEqual("center");
  });

  const blockWidth2 = 300;
  const titleWidth2 = 250;
  const tooltipWidth2 = 100;
  test("center position when a title occupies more than half of block and a half of tooltip equals to empty space in block", () => {
    expect(constructTooltipDirecton(blockWidth2, titleWidth2, tooltipWidth2)).toEqual("center");
  });

  const blockWidth3 = 300;
  const titleWidth3 = 100;
  const tooltipWidth3 = 250;
  test("right position when a title occupies less than half of block and half of tooltip bigger than a title width", () => {
    expect(constructTooltipDirecton(blockWidth3, titleWidth3, tooltipWidth3)).toEqual("right");
  });

  const blockWidth4 = 300;
  const titleWidth4 = 100;
  const tooltipWidth4 = 200;
  test("center position when a title occupies less than half of block and half of tooltip equals to half of title width", () => {
    expect(constructTooltipDirecton(blockWidth4, titleWidth4, tooltipWidth4)).toEqual("center");
  });

  const blockWidth5 = 300;
  const titleWidth5 = 100;
  const tooltipWidth5 = 180;
  test("center position when a title occupies less than half of block and half of tooltip less than half of title width", () => {
    expect(constructTooltipDirecton(blockWidth5, titleWidth5, tooltipWidth5)).toEqual("center");
  });

  const blockWidth6 = 300;
  const titleWidth6 = 100;
  const tooltipWidth6 = 150;
  test("center position when a title width equals to half of block", () => {
    expect(constructTooltipDirecton(blockWidth6, titleWidth6, tooltipWidth6)).toEqual("center");
  });
});

describe("constructTooltipWidth", () => {
  const blockWidth = 300;
  const titleWidth = 200;
  const tooltipWidth = 160;
  test("the width should be equals to tooltip width when title occupies more than half of block and tooltip width less than a title width", () => {
    expect(constructTooltipWidth(blockWidth, titleWidth, tooltipWidth)).toEqual(tooltipWidth);
  });

  const blockWidth1 = 300;
  const titleWidth1 = 200;
  const tooltipWidth1 = 200;
  test("the width should be equals to tooltip width when title occupies more than a half of block and tooltip width equals to a title width", () => {
    expect(constructTooltipWidth(blockWidth1, titleWidth1, tooltipWidth1)).toEqual(tooltipWidth1);
  });

  const blockWidth2 = 300;
  const titleWidth2 = 200;
  const tooltipWidth2 = 210;
  test("the width should be equals to title width when title occupies more than a half of block and tooltip width more than title width and half of the tooltip more than empty space in block", () => {
    expect(constructTooltipWidth(blockWidth2, titleWidth2, tooltipWidth2)).toEqual(titleWidth2);
  });

  const blockWidth3 = 300;
  const titleWidth3 = 100;
  const tooltipWidth3 = 200;
  test("the width should be equals to tooltip width when title occupies less than a half of block and half of tooltip width equals to a title width", () => {
    expect(constructTooltipWidth(blockWidth3, titleWidth3, tooltipWidth3)).toEqual(tooltipWidth3);
  });

  const blockWidth4 = 300;
  const titleWidth4 = 100;
  const tooltipWidth4 = 180;
  test("the width should be equals to tooltip width when title occupies less than a half of block and half of the tooltip width less than a title width", () => {
    expect(constructTooltipWidth(blockWidth4, titleWidth4, tooltipWidth4)).toEqual(tooltipWidth4);
  });

  const blockWidth5 = 500;
  const titleWidth5 = 100;
  const tooltipWidth5 = 220;
  test("the width should be equals to tooltip width when title occupies less than a half of block and half of the tooltip bigger than a title width but less than block empty space", () => {
    expect(constructTooltipWidth(blockWidth5, titleWidth5, tooltipWidth5)).toEqual(tooltipWidth5);
  });

  const blockWidth6 = 300;
  const titleWidth6 = 100;
  const tooltipWidth6 = 250;
  test("the width should be equals to block empty space when title occupies less than a half of block and a half of tooltip width more than title width", () => {
    expect(constructTooltipWidth(blockWidth6, titleWidth6, tooltipWidth6)).toEqual(
      blockWidth6 - titleWidth6
    );
  });

  const blockWidth7 = 500;
  const titleWidth7 = 250;
  const tooltipWidth7 = 600;
  test("the width should be equals to block width when title occupies half of the block and title width more than block width", () => {
    expect(constructTooltipWidth(blockWidth7, titleWidth7, tooltipWidth7)).toEqual(blockWidth7);
  });
});
