import React from "react";

import { bittersweetRedColor } from "styles/variables";
import RibbonContainer from "components/ui/Ribbon/RibbonContainer";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const CarRibbon = ({ discount, expired = false }: { discount?: number; expired?: boolean }) => {
  const { t } = useTranslation(Namespaces.commonCarNs);
  const { t: carT } = useTranslation(Namespaces.carNs);
  const banner = {
    text: expired
      ? carT("Offer expired")
      : t("{discountPercentage}% discount", {
          discountPercentage: discount,
        }),
    type: expired ? "custom" : "product-ribbon-discount",
  };

  if (!discount && !expired) {
    return null;
  }

  return <RibbonContainer banner={banner} customColor={bittersweetRedColor} />;
};

export default CarRibbon;
