import React, { useMemo } from "react";
import styled from "@emotion/styled";

import { TGDSectionType } from "../types/travelGuideEnums";
import destinationTGSectionsWhereCondition from "../utils/destinationTGSectionsWhereCondition";
import { getWhereConditionProps } from "../utils/travelGuideQueryUtils";

import TGDGuideToContinent from "./TGDGuideToContinent";

import TGContentTopDestinations from "components/features/TravelGuides/sidebar/TGContentTopDestinations";
import TGContentPWA from "components/features/TravelGuides/sidebar/TGContentPWA";
import { guttersPx } from "styles/variables";

const TGContentTopDestinationsStyled = styled(TGContentTopDestinations)`
  margin-bottom: ${guttersPx.small};
`;

const TGDestinationContentRightSection = ({
  place,
  metadataUri,
  ssrRender = true,
}: {
  place: TravelGuideTypes.DestinationPlace;
  metadataUri?: string;
  ssrRender?: boolean;
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
    <>
      <TGContentTopDestinationsStyled
        sectionType={TGDSectionType.TopDestinations}
        conditions={conditions}
        ssrRender={ssrRender}
      />
      <TGContentPWA />
      <TGDGuideToContinent
        place={place}
        sectionType={TGDSectionType.GuideToContinentSideBar}
        conditions={conditions}
        ssrRender={ssrRender}
      />
    </>
  );
};

export default TGDestinationContentRightSection;
