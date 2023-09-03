import React from "react";

import SEOContainer from "components/features/SEO/SEOContainer";
import { OpenGraphType } from "types/enums";

const TravelCommunityCategorySEO = ({ tours }: { tours: SharedTypes.Product[] }) => {
  const images = tours.length > 0 ? [tours[0].image] : [];

  return <SEOContainer isIndexed images={images} openGraphType={OpenGraphType.WEBSITE} />;
};

export default TravelCommunityCategorySEO;
