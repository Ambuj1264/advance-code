import React from "react";
import styled from "@emotion/styled";

import { getClientRoute } from "../utils/travelGuideUtils";
import { TGDSectionType } from "../types/travelGuideEnums";
import useTGSectionQuery from "../hooks/useTGSectionQuery";
import TGDSectionCard from "../sectioncards/TGDSectionCard";

import TGDSection from "./TGDSection";
import TGDestinationMapContainer from "./TGDestinationMapContainer";
import TGDestinationIconList from "./TGDestinationIconList";

import ClientLink from "components/ui/ClientLink";
import useActiveLocale from "hooks/useActiveLocale";
import {
  Column,
  ScrollSnapCarouselStyled,
} from "components/ui/LandingPages/LandingPageCardSection";
import LandingPageSectionLoading, {
  Column as LoadingColumn,
  SectionHeaderWrapper,
} from "components/ui/LandingPages/LandingPageSectionLoading";
import { LazyHydratedSection } from "components/ui/LandingPages/LazyHydratedSection";
import { column, mqMax, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { StyledScrollSnapRow } from "components/ui/ScrollSnapCarousel";
import HideElementById from "components/ui/TravelGuides/HideElementById";
import { ArrowButtonWrapper } from "components/ui/ContentCarousel";

const ColumnSizes = {
  small: 0.5,
  large: 0.5,
  desktop: 0.33,
};

const TGSectionContent = styled.div`
  margin-top: ${gutters.large / 2}px;
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

export const TGScrollSnapCarouselStyled = styled(ScrollSnapCarouselStyled)`
  margin-bottom: -${gutters.small}px;
  ${StyledScrollSnapRow} {
    ${mqMax.large} {
      margin: 0;
      padding-top: ${gutters.small / 2}px;
    }
  }
  ${ArrowButtonWrapper} {
    top: calc(50% - 32px);
  }
`;

const StyledLandingPageSectionLoading = styled(LandingPageSectionLoading)`
  ${mqMin.large} {
    margin-top: 0;
  }
  ${SectionHeaderWrapper} {
    display: none;
  }
  ${LoadingColumn} {
    ${column({ small: 1 / 2, large: 1 / 3 })};
  }
`;

const TGDSectionContainer = ({
  section,
  place,
  sectionType,
  sectionCondition,
  conditions,
  ssrRender = true,
  isDestinationSection = false,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  place: TravelGuideTypes.DestinationPlace;
  sectionType: TGDSectionType;
  sectionCondition?: TravelGuideTypes.TGSectionCondition;
  conditions: TravelGuideTypes.TGSectionCondition[];
  ssrRender?: boolean;
  isDestinationSection?: boolean;
}) => {
  const locale = useActiveLocale();
  const { sectionData, sectionDataLoading } = useTGSectionQuery({
    where: sectionCondition?.where,
    locale,
    skip: isDestinationSection,
  });
  if (isDestinationSection) {
    switch (sectionType) {
      case TGDSectionType.AllBestDestinationsInCountry:
        return <TGDestinationMapContainer section={section} conditions={conditions} />;
      case TGDSectionType.PopularDestinationsInCountry:
        return <TGDestinationIconList section={section} conditions={conditions} />;
      default:
        return null;
    }
  }
  if (sectionDataLoading && !sectionData) {
    return (
      <StyledLandingPageSectionLoading
        key={`${sectionType}LandingPageSectionLoading`}
        customTotalCards={6}
        isLargeImage
      />
    );
  }
  if (sectionData?.landingPages && sectionData.landingPages.length > 0) {
    const isSingle =
      sectionData.landingPages.length === 1 && sectionType === TGDSectionType.TGDLearnMoreCountry;
    return isSingle ? (
      <TGDSection
        key={`tg-section${section.id}`}
        section={section}
        isSubsection={section.level > 0}
        image={section.image}
        bottomContent={sectionData.landingPages.map(sectionCard => (
          <LazyHydratedSection ssrRender={ssrRender} key={sectionCard.id}>
            <ClientLink
              key={sectionCard.title}
              clientRoute={getClientRoute(sectionCard, place)}
              title={sectionCard.title}
            >
              <TGDSectionCard sectionCard={sectionCard} sectionType={sectionType} />
            </ClientLink>
          </LazyHydratedSection>
        ))}
      />
    ) : (
      <TGDSection
        key={`tg-section${section.id}`}
        section={section}
        isSubsection={section.level > 0}
        image={section.image}
        bottomContent={
          <TGSectionContent>
            <TGScrollSnapCarouselStyled
              key={sectionType}
              itemsPerPage={6}
              mobileRows={1}
              mobileCardWidth={190}
              ssrRender={ssrRender}
              columnSizes={ColumnSizes}
              ItemWrapper={Column}
            >
              {sectionData.landingPages.map(sectionCard => (
                <ClientLink
                  key={sectionCard.id}
                  clientRoute={getClientRoute(sectionCard, place)}
                  title={sectionCard.title}
                >
                  <TGDSectionCard sectionCard={sectionCard} sectionType={sectionType} />
                </ClientLink>
              ))}
            </TGScrollSnapCarouselStyled>
          </TGSectionContent>
        }
      />
    );
  }
  return <HideElementById elementId={sectionType} />;
};

export default TGDSectionContainer;
