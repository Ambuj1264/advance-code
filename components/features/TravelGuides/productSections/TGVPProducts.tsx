import React from "react";

import useTGVPSectionQuery from "../hooks/useTGVPSectionQuery";
import TGDSection from "../sectionsContent/TGDSection";

import TGProductSection from "./TGProductSection";

import { constructVacationPackageSectionCard } from "components/features/VacationPackages/utils/vacationPackagesUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const TGVPProducts = ({
  section,
  flightId,
  ssrRender = true,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  flightId: string;
  ssrRender?: boolean;
}) => {
  const { sectionData, sectionError } = useTGVPSectionQuery({
    flightId,
  });
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  if (
    !sectionData ||
    !sectionData.vacationPackageSections?.nodes ||
    sectionData.vacationPackageSections?.nodes.length <= 0 ||
    sectionError
  )
    return null;

  const sectionCards = sectionData.vacationPackageSections.nodes.map(vpCard =>
    constructVacationPackageSectionCard({
      vacationPackageT,
      vacationProduct: vpCard,
    })
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

export default TGVPProducts;
