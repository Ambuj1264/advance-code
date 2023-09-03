import React from "react";

import useTGToursSectionQuery from "../hooks/useTGToursSectionQuery";
import TGDSection from "../sectionsContent/TGDSection";

import TGProductSection from "./TGProductSection";

import useActiveLocale from "hooks/useActiveLocale";
import { constructLandingPageTourProductSectionCards } from "components/ui/LandingPages/utils/productSectionLandingPageUtils";
import { GraphCMSPageVariation } from "types/enums";
import HideElementById from "components/ui/TravelGuides/HideElementById";

const TGToursProducts = ({
  section,
  sectionCondition,
  t,
  ssrRender = true,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  sectionCondition: TravelGuideTypes.TGSectionCondition;
  t: TFunction;
  ssrRender?: boolean;
}) => {
  const locale = useActiveLocale();
  const { sectionData, sectionError } = useTGToursSectionQuery({
    where: sectionCondition?.where,
    locale,
  });

  if (sectionData.length === 0 || sectionError)
    return <HideElementById elementId={section.sectionType} />;

  const sectionContent = sectionData as GTETourTypes.QueryTourSectionContent[];
  const sectionCards = constructLandingPageTourProductSectionCards(
    sectionContent,
    GraphCMSPageVariation.inCity,
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

export default TGToursProducts;
