import Slider, { Settings } from "react-slick";
import { MutableRefObject, Ref } from "react";

// https://github.com/akiran/react-slick/blob/master/src/inner-slider.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SliderExtType = Settings & {
  outerRef: MutableRefObject<ReactSlickInner>;
};

class SliderExt extends Slider {
  innerSlider: Ref<ReactSlickInner>;

  constructor(props: SliderExtType) {
    super(props);
    this.innerSlider = null;
  }

  innerSliderRefHandler = (ref: Ref<ReactSlickInner>) => {
    this.innerSlider = ref;
    const { outerRef } = this.props as SliderExtType;
    if (outerRef) {
      outerRef.current = ref;
    }
  };
}

export default SliderExt;
