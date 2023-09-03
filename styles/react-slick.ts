import { css } from "@emotion/core";

export default css`
  .slick-slider {
    position: relative;
    z-index: 0;
    display: block;
    box-sizing: border-box;
    height: 100%;
    user-select: none;
    touch-action: pan-y;
  }

  .slick-list {
    position: relative;
    display: block;
    margin: 0;
    height: 100%;
    padding: 0;
    overflow: hidden;
  }

  .slick-list:focus {
    outline: none;
  }

  .slick-list.dragging {
    cursor: pointer;
  }

  .slick-slider .slick-track,
  .slick-slider .slick-list {
    transform: translate3d(0, 0, 0);
  }

  .slick-track {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
  }

  /* stylelint-disable-next-line selector-max-type */
  .slick-track > div,
  .slick-slide > div {
    height: 100%;
  }

  .slick-slide {
    display: none;
    float: left;
    height: 100%;
    min-height: 1px;
  }

  /* stylelint-disable-next-line selector-max-type */
  .slick-slide img {
    display: block;
  }

  /* stylelint-disable-next-line selector-max-type */
  .slick-slide.dragging img {
    pointer-events: none;
  }

  .slick-initialized .slick-slide {
    display: block;
  }
`;
