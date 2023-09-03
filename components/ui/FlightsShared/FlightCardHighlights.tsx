import React from "react";

import ProductFeaturesList from "../Search/ProductFeaturesList";

import FlightIcon from "components/icons/plane-1.svg";
import ShieldIcon from "components/icons/check-shield.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const FlightCardHighlights = ({ flightClass }: { flightClass: string }) => {
  const { t } = useTranslation(Namespaces.flightNs);
  return (
    <ProductFeaturesList
      productProps={[
        {
          title: t("All taxes included"),
          Icon: ShieldIcon,
        },
        {
          title: flightClass,
          Icon: FlightIcon,
        },
      ]}
    />
  );
};

export default FlightCardHighlights;
