import React from "react";

import useTGTopDestinationsQuery from "../hooks/useTGTopDestinationsQuery";
import { TGDSectionType } from "../types/travelGuideEnums";
import { getSectionCondition, constructTGIconList } from "../utils/travelGuideUtils";

import TGDSection from "./TGDSection";

import { StyledIconList } from "components/ui/Map/AttractionsMapContainer";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import HideElementById from "components/ui/TravelGuides/HideElementById";

const TGDestinationIconList = ({
  section,
  conditions,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  conditions: TravelGuideTypes.TGSectionCondition[];
}) => {
  const sectionCondition = getSectionCondition(conditions, TGDSectionType.TopDestinations);
  const { topDestinationData, destinationsLoading, destinationsError } = useTGTopDestinationsQuery({
    sectionCondition,
  });
  if (destinationsLoading && !destinationsError) return null;
  const destinations = topDestinationData ?? [];
  if (destinations.length > 0) {
    return (
      <TGDSection
        key={`tg-section${section.id}`}
        section={section}
        isSubsection={section.level > 0}
        image={section.image}
        bottomContent={
          <LazyComponent lazyloadOffset={LazyloadOffset.Tiny}>
            <StyledIconList
              sectionId="vpDestinations"
              iconList={constructTGIconList(destinations) as SharedTypes.Icon[]}
              shouldUseDynamicLimit
              iconLimit={7}
              onClick={() => {}}
              inGrid
              columns={{ small: 2 }}
            />
          </LazyComponent>
        }
      />
    );
  }
  return <HideElementById elementId={section.sectionType} />;
};

export default TGDestinationIconList;
