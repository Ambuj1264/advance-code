import React from "react";

import TeaserSideCard from "./variants/TeaserSideCard";
import TeaserSideCardHorizontal from "./variants/TeaserSideCardHorizontal";
import TeaserImageTitleOnly from "./variants/TeaserImageTitleOnly";
import TeaserImageDistanceReview from "./variants/TeaserImageDistanceReview";
import TeaserImageWithAction from "./variants/TeaserImageWithAction";
import TeaserCategoryBanner from "./variants/TeaserCategoryBanner";

import { isProd } from "utils/globalUtils";
import { TeaserVariant } from "types/enums";
import { ExternalLink } from "components/ui/Teaser/TeaserComponents";

export const isRenderable = (teaser: TeaserTypes.Teaser) => {
  switch (teaser.variant) {
    case TeaserVariant.SIDE_CARD:
    case TeaserVariant.VERTICAL_CARD:
    case TeaserVariant.IMAGE_TITLE_ONLY:
    case TeaserVariant.IMAGE_WITH_ACTION:
    case TeaserVariant.IMAGE_TITLE_DISTANCE:
      // those variants are implemented
      return true;

    default:
      // those variants are not implemented
      // so we temporary render TeaserSideCard instead of them
      // but if the teaser doesn't have an image, TeaserSideCard
      // shouldn't be rendered
      return Boolean(teaser.image);
  }
};

const Teaser = (props: TeaserTypes.Teaser) => {
  const { variant } = props;

  // TODO: make all links internal
  // (if we do so, we should also cancel Lazy Hydration for TeaserLists
  // and let the teaser Lists data into the client-side apollo cache)

  switch (variant) {
    case TeaserVariant.SIDE_CARD:
      return <TeaserSideCard {...props} LinkComponent={ExternalLink} />;

    case TeaserVariant.VERTICAL_CARD:
      return <TeaserSideCardHorizontal {...props} LinkComponent={ExternalLink} />;

    case TeaserVariant.IMAGE_TITLE_DISTANCE:
      return <TeaserImageDistanceReview {...props} LinkComponent={ExternalLink} />;

    case TeaserVariant.IMAGE_TITLE_ONLY:
      return <TeaserImageTitleOnly {...props} LinkComponent={ExternalLink} />;

    case TeaserVariant.IMAGE_WITH_ACTION:
      return <TeaserImageWithAction {...props} LinkComponent={ExternalLink} />;

    case TeaserVariant.CATEGORY_BANNER:
      return <TeaserCategoryBanner {...props} />;

    default:
      if (!isProd()) {
        // eslint-disable-next-line no-console
        console.warn("HEADS UP! Using non-implemented variant of Teaser: ", variant);
      }
      // eslint-disable-next-line react/destructuring-assignment
      if (!props.image) {
        if (!isProd()) {
          // eslint-disable-next-line no-console
          console.warn("HEADS UP! Non-implemented variant of Teaser with empty image ", props);
        }
        return null;
      }
      /* TODO: Implement missing teaser variants */
      return <TeaserSideCard {...props} LinkComponent={ExternalLink} />;
  }
};

export default Teaser;
