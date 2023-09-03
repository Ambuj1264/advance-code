import React from "react";

import { TGDSectionType } from "../types/travelGuideEnums";
import { getSectionCondition } from "../utils/travelGuideUtils";
import TGProductSectionContainer from "../productSections/TGProductSectionContainer";

import TGDSectionContainer from "./TGDSectionContainer";
import TGDNoQueryContent from "./TGDNoQueryContent";

const TGDSections = ({
  section,
  sectionType,
  conditions,
  place,
  attractions,
  map,
  ssrRender = true,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  sectionType: TGDSectionType;
  conditions: TravelGuideTypes.TGSectionCondition[];
  place: TravelGuideTypes.DestinationPlace;
  attractions: TravelStopTypes.TravelStops[];
  map?: SharedTypes.Map;
  ssrRender?: boolean;
}) => {
  const sectionCondition = getSectionCondition(conditions, sectionType);
  const isDestinationSection =
    sectionType === TGDSectionType.TopDestinations ||
    sectionType === TGDSectionType.AllBestDestinationsInCountry ||
    sectionType === TGDSectionType.PopularDestinationsInCountry;
  if (sectionCondition?.domain) {
    return (
      <TGProductSectionContainer
        section={section}
        place={place}
        domain={sectionCondition.domain}
        sectionCondition={sectionCondition}
        ssrRender={ssrRender}
        flightId={place.flightId}
      />
    );
  }
  if (sectionCondition || isDestinationSection) {
    return (
      <TGDSectionContainer
        section={section}
        place={place}
        sectionCondition={sectionCondition}
        conditions={conditions}
        sectionType={sectionType}
        ssrRender={ssrRender}
        isDestinationSection={isDestinationSection}
      />
    );
  }
  return (
    <TGDNoQueryContent
      section={section}
      sectionType={sectionType}
      attractions={attractions}
      place={place}
      map={map}
    />
  );
};

export default TGDSections;
