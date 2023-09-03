import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { MapLoadingSkeleton } from "../../PostBooking/components/PBLoadingSkeletons/PBItineraryLoading";
import { TGDSectionType } from "../types/travelGuideEnums";
import { StyledProductSpecsSkeleton } from "../TGDestinationContent";

import TGSearchWidget from "./TGSearchWidget";
import TGAttractionsIconList from "./TGAttractionsIconList";
import TGDSection from "./TGDSection";

import { GraphCMSPageType } from "types/enums";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { mqMin, skeletonPulseBlue } from "styles/base";
import { borderRadiusSmall } from "styles/variables";
import ProductMapContainer from "components/ui/Cover/CoverMap/ProductMapContainer";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";

export const StyledProductMapContainer = styled(ProductMapContainer)`
  ${CoverMapWrapper} {
    height: 400px;
  }
`;

const SearchWidgetLoading = styled.div([
  skeletonPulseBlue,
  css`
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 350px;
    ${mqMin.large} {
      height: 400px;
    }
  `,
]);

const NoQuery = ({
  sectionType,
  attractions,
  place,
  map,
}: {
  sectionType: TGDSectionType;
  attractions: TravelStopTypes.TravelStops[];
  place: TravelGuideTypes.DestinationPlace;
  map?: SharedTypes.Map;
}) => {
  switch (sectionType) {
    case TGDSectionType.TGDTopAttractionsDestination:
      return (
        // TODO: link to attraction pages when ready
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Tiny}
          loadingElement={<StyledProductSpecsSkeleton itemsCount={10} fullWidth />}
        >
          <TGAttractionsIconList attractions={attractions} />
        </LazyComponent>
      );
    case TGDSectionType.MapOfAttractionsDestination:
      return map ? (
        <LazyComponent lazyloadOffset={LazyloadOffset.Tiny} loadingElement={<MapLoadingSkeleton />}>
          <StyledProductMapContainer mapData={map} mapId={`tg-attractions${sectionType}`} />
        </LazyComponent>
      ) : null;
    case TGDSectionType.TourSearchWidgetDestination:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.Tours} place={place} />
        </LazyComponent>
      );
    case TGDSectionType.VPSearchWidgetDestination:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.VpProductPage} place={place} />
        </LazyComponent>
      );
    case TGDSectionType.FindFlightsToDestination:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.Flights} place={place} />
        </LazyComponent>
      );
    case TGDSectionType.DestinationTravelGuideSection_28:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.Flights} place={place} isDomesticFlight />
        </LazyComponent>
      );
    case TGDSectionType.StaysSearchWidgetDestination:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.Stays} place={place} />
        </LazyComponent>
      );
    case TGDSectionType.SearchForCarsDestination:
      return (
        <LazyComponent
          lazyloadOffset={LazyloadOffset.Small}
          loadingElement={<SearchWidgetLoading />}
        >
          <TGSearchWidget pageType={GraphCMSPageType.Cars} place={place} />
        </LazyComponent>
      );
    default:
      return null;
  }
};

const TGDNoQueryContent = ({
  section,
  sectionType,
  attractions,
  place,
  map,
}: {
  section: TravelGuideTypes.ConstructedDestinationSection;
  sectionType: TGDSectionType;
  attractions: TravelStopTypes.TravelStops[];
  place: TravelGuideTypes.DestinationPlace;
  map?: SharedTypes.Map;
}) => {
  return (
    <TGDSection
      key={`tg-section${section.id}`}
      section={section}
      isSubsection={section.level > 0}
      image={section.image}
      bottomContent={
        <NoQuery sectionType={sectionType} attractions={attractions} place={place} map={map} />
      }
    />
  );
};

export default TGDNoQueryContent;
