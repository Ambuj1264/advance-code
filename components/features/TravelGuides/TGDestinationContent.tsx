import React from "react";
import styled from "@emotion/styled";

import TGDSection from "./sectionsContent/TGDSection";
import { getIntroSectionObj } from "./utils/travelGuideUtils";

import ProductCover from "components/ui/ImageCarousel/ProductCover";
import { MobileContainer } from "components/ui/Grid/Container";
import LandingPageValuePropositions from "components/ui/LandingPages/LandingPageValuePropositions";
import ProductSpecsSkeleton, {
  StyledQFGroup,
} from "components/ui/Information/ProductSpecsSkeleton";
import ProductSpecs, { IconWrapper, QuickFact } from "components/ui/Information/ProductSpecs";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import LazyComponent from "components/ui/Lazy/LazyComponent";
import { gutters } from "styles/variables";
import Column from "components/ui/Grid/Column";

const StyledProductCover = styled(ProductCover)`
  margin: 0;
`;

const StyledProductSpecs = styled(ProductSpecs)`
  ${mqMin.large} {
    float: none;
    width: 100%;
    padding: 0;
  }
  ${IconWrapper} {
    width: 50px;
    height: 40px;
  }
`;

export const StyledProductSpecsSkeleton = styled(ProductSpecsSkeleton)`
  ${QuickFact} {
    flex: 0 0 50%;
    margin-top: ${gutters.large}px;
    max-width: unset;
    height: 46px;
  }
  ${StyledQFGroup} {
    width: 50%;
  }
`;

const StyledLandingPageValuePropositions = styled(LandingPageValuePropositions)`
  ${Column} {
    justify-content: flex-start;
    width: 50%;
  }
`;

const TGDestinationContent = ({
  images,
  destinationData,
  SectionContent,
  coverMapData,
}: {
  images?: ImageWithSizes[];
  destinationData: TravelGuideTypes.ConstructedDestinationContent;
  SectionContent: React.ReactNode;
  coverMapData?: SharedTypes.Map;
}) => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  return (
    <>
      <StyledProductCover
        images={images}
        reviewScore={0}
        reviewCount={0}
        mapData={coverMapData}
        showReviews={false}
      />
      <MobileContainer>
        <StyledLandingPageValuePropositions
          valueProps={
            (destinationData.valueProps as LandingPageTypes.LandingPageValueProposition[]) ?? []
          }
          maxDesktopColumns={4}
        />
      </MobileContainer>
      <TGDSection
        key="tg-section-intro"
        section={getIntroSectionObj(
          destinationData.title,
          travelGuidesT,
          destinationData.description
        )}
        bottomContent={
          destinationData.destinationSpecs && (
            <LazyComponent
              loadingElement={
                <StyledProductSpecsSkeleton
                  itemsCount={destinationData.destinationSpecs.length}
                  fullWidth
                />
              }
            >
              <StyledProductSpecs
                id="destinationSpecs"
                fullWidth={false}
                productSpecs={destinationData.destinationSpecs}
              />
            </LazyComponent>
          )
        }
        ssrOnly
      />
      {SectionContent}
    </>
  );
};

export default TGDestinationContent;
