import React from "react";

import ClientLink from "components/ui/ClientLink";
import { LandingPageTileProductCardWithCurrency } from "components/ui/LandingPages/LandingPageCard";
import { GraphCMSPageType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";

const TGDProductCard = ({
  sectionCard,
}: {
  sectionCard: LandingPageTypes.LandingPageSectionCard;
}) => {
  const clientRoute = {
    query: {
      slug: sectionCard.slug,
      country: sectionCard.country,
    },
    as: urlToRelative(sectionCard.linkUrl),
    route: `/${GraphCMSPageType.TourProductPage}`,
  };

  return (
    <ClientLink key={sectionCard.title} clientRoute={clientRoute} title={sectionCard.title}>
      <LandingPageTileProductCardWithCurrency
        clientRoute={clientRoute}
        cardContent={sectionCard}
        isSmallDevice={false}
        useDivHeadline
      />
    </ClientLink>
  );
};

export default TGDProductCard;
