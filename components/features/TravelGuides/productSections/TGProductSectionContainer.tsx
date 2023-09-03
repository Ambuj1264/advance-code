import React from "react";

import {
  findActiveService,
  getServicesObjects,
  getServicesWhereCondition,
} from "../utils/travelGuideUtils";
import useTGSectionQuery from "../hooks/useTGSectionQuery";

import TGToursProducts from "./TGTourProducts";
import TGVPProducts from "./TGVPProducts";
import TGStayProducts from "./TGStayProducts";

import { GraphCMSPageType } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import CTASection from "components/ui/TravelGuides/CTASection";
import useActiveLocale from "hooks/useActiveLocale";

const TGProductSectionContainer = ({
  section,
  place,
  domain,
  sectionCondition,
  flightId,
  ssrRender = true,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  place: TravelGuideTypes.DestinationPlace;
  domain: GraphCMSPageType;
  sectionCondition: TravelGuideTypes.TGSectionCondition;
  flightId: string;
  ssrRender?: boolean;
}) => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  const locale = useActiveLocale();
  const topServicesWhere = getServicesWhereCondition(place.id);
  const { sectionData } = useTGSectionQuery({
    where: topServicesWhere,
    locale,
    skip: !topServicesWhere,
  });
  const servicesObjects = getServicesObjects(sectionData?.landingPages);
  const currentServiceObject = servicesObjects
    ? findActiveService(servicesObjects, domain)
    : undefined;

  const destinationName = place.name.value;

  switch (domain) {
    case GraphCMSPageType.Tours:
      return (
        <>
          <TGToursProducts
            section={section}
            sectionCondition={sectionCondition}
            t={travelGuidesT}
            ssrRender={ssrRender}
          />
          {currentServiceObject && (
            <CTASection
              mainText={travelGuidesT("All Experiences in {destinationName}", {
                destinationName,
              })}
              uri={currentServiceObject?.metadataUri}
              pageType={GraphCMSPageType.Tours}
              t={travelGuidesT}
            />
          )}
        </>
      );
    case GraphCMSPageType.VpProductPage:
      return (
        <>
          <TGVPProducts section={section} ssrRender={ssrRender} flightId={flightId} />
          {currentServiceObject && (
            <CTASection
              mainText={travelGuidesT("All Vacations in {destinationName}", {
                destinationName,
              })}
              uri={currentServiceObject?.metadataUri}
              pageType={GraphCMSPageType.VacationPackages}
              t={travelGuidesT}
            />
          )}
        </>
      );
    case GraphCMSPageType.Stays:
      return (
        <>
          <TGStayProducts
            section={section}
            sectionCondition={sectionCondition}
            ssrRender={ssrRender}
          />
          {currentServiceObject && (
            <CTASection
              mainText={travelGuidesT("All Stays in {destinationName}", {
                destinationName,
              })}
              uri={currentServiceObject?.metadataUri}
              pageType={GraphCMSPageType.Stays}
              t={travelGuidesT}
            />
          )}
        </>
      );
    default:
      return null;
  }
};

export default TGProductSectionContainer;
