import React from "react";

import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { PageType } from "types/enums";
import { getProductSlugFromHref, removeLocaleCode } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import TeaserSideCardHorizontal from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import TeaserOverlayBanner from "components/ui/Teaser/TeaserOverlayBanner";
import useActiveLocale from "hooks/useActiveLocale";

const TeaserCard = ({
  bannerId,
  url,
  title,
  metadata,
  author,
  image,
  pageType,
  clientRoute,
  linkTarget,
}: SharedTypes.TopArticle & {
  pageType: PageType;
  image: Image;
  clientRoute?: SharedTypes.ClientRoute;
  linkTarget?: string;
}) => {
  const activeLocale = useActiveLocale();
  const OverlayBanner = bannerId ? <TeaserOverlayBanner icon={bannerId} /> : null;
  const relativeUrl = urlToRelative(url);
  return (
    <ClientLinkPrefetch
      linkUrl={relativeUrl}
      clientRoute={
        clientRoute || {
          query: {
            slug: getProductSlugFromHref(relativeUrl),
            category:
              pageType !== PageType.ARTICLE
                ? removeLocaleCode(url, activeLocale).split("/")[1]
                : undefined,
          },
          route: `/${pageType}`,
          as: relativeUrl,
        }
      }
      target={linkTarget}
      title={title}
    >
      <TeaserSideCardHorizontal
        url={url}
        title={title}
        description={metadata.description}
        image={image}
        hasCallToAction={false}
        teaserSize="medium"
        overlay={OverlayBanner}
        author={author}
      />
    </ClientLinkPrefetch>
  );
};

export default TeaserCard;
