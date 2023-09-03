import React from "react";

import useTGStaysQuery from "../hooks/useTGStaysQuery";
import TGDSection from "../sectionsContent/TGDSection";

import TGProductSection from "./TGProductSection";

import useActiveLocale from "hooks/useActiveLocale";
import { constructLandingPageStayProductSectionCards } from "components/ui/LandingPages/utils/productSectionLandingPageUtils";
import { GraphCMSPageVariation } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const TGStayProducts = ({
  section,
  sectionCondition,
  ssrRender = true,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  sectionCondition: TravelGuideTypes.TGSectionCondition;
  ssrRender?: boolean;
}) => {
  const locale = useActiveLocale();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { sectionData, sectionError } = useTGStaysQuery({
    where: sectionCondition?.where,
    locale,
  });

  if (sectionData.length === 0 || sectionError) return null;

  const sectionCards = constructLandingPageStayProductSectionCards(
    sectionData,
    GraphCMSPageVariation.inCityWithType,
    t
  );

  return (
    <TGDSection
      key={`tg-section${section.id}`}
      section={section}
      isSubsection={section.level > 0}
      image={section.image}
      bottomContent={<TGProductSection sectionCards={sectionCards} ssrRender={ssrRender} />}
    />
  );
};

export default TGStayProducts;
