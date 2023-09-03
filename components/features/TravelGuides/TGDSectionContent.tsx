import React, { useMemo } from "react";

import destinationTGSectionsWhereCondition from "./utils/destinationTGSectionsWhereCondition";
import TGDSections from "./sectionsContent/TGDSections";
import { getWhereConditionProps } from "./utils/travelGuideQueryUtils";

const TGDSectionContent = ({
  sections,
  place,
  attractions,
  map,
  metadataUri,
}: {
  sections: TravelGuideTypes.ConstructedDestinationSection[];
  place: TravelGuideTypes.DestinationPlace;
  attractions: TravelStopTypes.TravelStops[];
  map?: SharedTypes.Map;
  metadataUri?: string;
}) => {
  const { destinationPlaceId, destinationCountryCode } = getWhereConditionProps(place);
  const conditions = useMemo(
    () =>
      destinationTGSectionsWhereCondition({
        destinationPlaceId,
        destinationCountryCode,
        metadataUri,
      }),
    [destinationCountryCode, destinationPlaceId, metadataUri]
  );
  return (
    <React.Fragment key="tgd-query-sections">
      {sections.map(section => {
        return (
          <TGDSections
            key={`tgsection-${section.id}`}
            section={section}
            place={place}
            conditions={conditions}
            sectionType={section.sectionType}
            attractions={attractions}
            map={map}
          />
        );
      })}
    </React.Fragment>
  );
};

export default TGDSectionContent;
