import React from "react";
import styled from "@emotion/styled";

import { constructDestinationsSidebar, getSectionCondition } from "../utils/travelGuideUtils";
import { TGDSectionType } from "../types/travelGuideEnums";
import useTGTopDestinationsQuery from "../hooks/useTGTopDestinationsQuery";

import TGSideDestinationsLoading from "./TGSideDestinationsLoading";

import TGContentSideImageCard from "components/features/TravelGuides/sidebar/TGContentSideImageCard";
import LocationIcon from "components/icons/gps.svg";
import { gutters } from "styles/variables";
import { GraphCMSDisplayType } from "types/enums";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledLocationIcon = styled(LocationIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 13px;
  height: 20px;
`;

const TGContentTopDestinations = ({
  sectionType,
  conditions,
  ssrRender = true,
  className,
}: {
  sectionType: TGDSectionType;
  conditions: TravelGuideTypes.TGSectionCondition[];
  ssrRender?: boolean;
  className?: string;
}) => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  const sectionCondition = getSectionCondition(conditions, sectionType);
  const { topDestinationData, destinationsLoading, destinationsError } = useTGTopDestinationsQuery({
    sectionCondition,
  });
  if (destinationsLoading && !destinationsError) {
    return <TGSideDestinationsLoading className={className} />;
  }
  const sideBarDestinations = constructDestinationsSidebar(topDestinationData, travelGuidesT);
  if (sideBarDestinations.length > 0) {
    return (
      <div className={className}>
        <LazyHydratedSection ssrRender={ssrRender} key="top-destinations-sidebar">
          <TGContentSideImageCard
            Icon={StyledLocationIcon}
            title={travelGuidesT("Popular destinations in {countryName}", {
              countryName: sideBarDestinations[0].country,
            })}
            displayType={GraphCMSDisplayType.SIDE_IMAGE}
            cardContent={sideBarDestinations}
          />
        </LazyHydratedSection>
      </div>
    );
  }
  return null;
};

export default TGContentTopDestinations;
