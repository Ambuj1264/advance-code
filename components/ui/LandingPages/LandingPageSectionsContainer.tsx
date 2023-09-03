/* eslint-disable react/no-array-index-key */

import React, { memo } from "react";

import LazyComponent, { LazyloadOffset } from "../Lazy/LazyComponent";

import { getSectionsPagesWhereCondition } from "./utils/landingPageQueryUtils";
import { getDestinationCountryCode } from "./utils/landingPageUtils";
import LandingPageTGCardSection from "./LandingPageTGCardSection";
import LandingPageProductSectionLoading from "./LandingPageProductSectionLoading";

import LandingPageTourProductSection from "components/ui/LandingPages/LandingPageTourProductSection";
import LandingPageVpProductSection from "components/ui/LandingPages/LandingPageVpProductSection";
import LandingPageStayProductSection from "components/ui/LandingPages/LandingPageStayProductSection";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import LandingPageSection from "components/ui/LandingPages/LandingPageSection";
import { GraphCMSPageType, GraphCMSPageVariation, SupportedLanguages } from "types/enums";
import { SECTIONS_TO_RENDER_ON_SSR } from "utils/constants";
import TGLandingSectionContent, {
  TGLandingLoading,
} from "components/features/TravelGuideLanding/TGLandingSectionContent";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const LandingPageSectionsContainer = ({
  activeLocale,
  pageType = GraphCMSPageType.Flights,
  subType,
  pageVariation,
  origin,
  destination,
  queryCondition,
  sectionSkeletons,
}: {
  activeLocale: string;
  pageType?: GraphCMSPageType;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  subType?: LandingPageTypes.LandingPageSubType;
  pageVariation: GraphCMSPageVariation;
  origin?: LandingPageTypes.Place;
  destination?: LandingPageTypes.Place;
  sectionSkeletons: JSX.Element[];
}) => {
  const isMobile = useIsMobile();
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const sectionConditions = getSectionsPagesWhereCondition({
    subtype: subType?.subtype,
    destinationPlaceId: destination?.id,
    domain: pageType,
    metadataUri: queryCondition.metadataUri,
    locale: activeLocale as SupportedLanguages,
    destinationCountryCode,
  });
  return (
    <>
      {sectionConditions.map((condition, index) => {
        if (condition?.domain === GraphCMSPageType.VpProductPage) {
          return (
            <LazyHydratedSection
              ssrRender={index <= 1}
              key={`${pageType}-section-condition-${index}`}
            >
              <LandingPageVpProductSection
                key={`${pageType}VPProductSection${index}`}
                isFirstSection={index === 0}
                destination={destination}
                sectionCondition={condition}
                subType={subType}
                isFrontOrCountry
              />
            </LazyHydratedSection>
          );
        }
        if (condition?.domain === GraphCMSPageType.StaysProductPage) {
          return (
            <LazyHydratedSection
              ssrRender={index <= 1}
              key={`${pageType}-section-condition-${index}`}
            >
              <LandingPageStayProductSection
                key={`${pageType}StayProductSection${index}`}
                isFirstSection={index === 0}
                destination={destination}
                pageVariation={pageVariation}
                sectionCondition={condition}
                isFrontOrCountry
              />
            </LazyHydratedSection>
          );
        }
        if (condition?.domain === GraphCMSPageType.TourProductPage) {
          return (
            <LazyHydratedSection
              ssrRender={index <= SECTIONS_TO_RENDER_ON_SSR}
              key="TourLazyHydratedProductSection"
            >
              <LandingPageTourProductSection
                key="TourLazyHydratedProductSection"
                sectionCondition={condition}
                isFirstSection={index === 0}
                pageVariation={pageVariation}
                destination={destination}
                subtype={subType?.subtype}
                isFrontOrCountry
              />
            </LazyHydratedSection>
          );
        }
        if (condition?.domain === GraphCMSPageType.TravelGuides) {
          return (
            <LazyComponent
              lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
              loadingElement={<LandingPageProductSectionLoading customTotalCards={4} />}
              key="TGLazyHydratedSection"
            >
              <LandingPageTGCardSection
                key="TGLazyHydratedProductSection"
                sectionCondition={condition}
                isFirstSection={index === 0}
                destination={destination}
                isFrontOrCountry
              />
            </LazyComponent>
          );
        }
        if (condition?.domain === GraphCMSPageType.TravelGuidesLanding) {
          return (
            <LazyComponent
              lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
              loadingElement={<TGLandingLoading pageType={GraphCMSPageType.TravelGuidesLanding} />}
              key="TGLazyLandingSection"
            >
              <TGLandingSectionContent
                key={`tg-section-${index}`}
                pageType={GraphCMSPageType.TravelGuidesLanding}
                sectionCondition={condition}
              />
            </LazyComponent>
          );
        }
        return (
          <LandingPageSection
            key={`${pageType}${queryCondition.metadataUri}${index}`}
            pageType={pageType}
            origin={origin}
            destination={destination}
            queryCondition={queryCondition}
            metadataUri={queryCondition.metadataUri}
            isFirstSection={index === 0}
            ssrRender={index < SECTIONS_TO_RENDER_ON_SSR}
            sectionCondition={condition}
            SectionSkeleton={sectionSkeletons.length ? sectionSkeletons[index] : undefined}
          />
        );
      })}
    </>
  );
};

export default memo(LandingPageSectionsContainer);
