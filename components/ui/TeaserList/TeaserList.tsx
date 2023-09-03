import React from "react";

import TeaserListVertical from "./variants/TeaserListVertical";
import TeaserListHorizontal from "./variants/TeaserListHorizontal";

import { TeaserListVariant } from "types/enums";
import { isRenderable } from "components/ui/Teaser/Teaser";

const TeaserList = (props: TeaserListTypes.TeaserList) => {
  const { variant, teasers } = props;

  if (!teasers.some(isRenderable)) {
    return null;
  }

  switch (variant) {
    case TeaserListVariant.VERTICAL:
      return <TeaserListVertical {...props} />;
    case TeaserListVariant.HORIZONTAL:
      return <TeaserListHorizontal {...props} />;
    default:
      /* TODO: Teaser list variant {variant} is not implemented yet */
      return null;
  }
};

export default TeaserList;
