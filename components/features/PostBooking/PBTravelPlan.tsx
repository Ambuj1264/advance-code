import React from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { MaxWidthWrapper } from "./components/MaxWidthWrapper";
import PBMapPagination from "./PBMapPagination";
import PBTimeline from "./components/PBTimeline";
import TravelplanMobileModalWrapper from "./components/TravelplanMobileModalWrapper";
import { StyledContainer, TravelplanContentWrapper } from "./components/PBSharedComponents";
import { PBError } from "./components/PBError";
import useCheckGenerationStatus from "./hooks/useCheckGenerationStatus";
import PBItineraryGenerating from "./components/PBLoadingSkeletons/PBItineraryGenerating";
import useFetchItineraryData from "./hooks/useFetchItineraryData";
import PBItineraryLoading from "./components/PBLoadingSkeletons/PBItineraryLoading";
import useFetchMapData from "./hooks/useFetchMapData";
import { POSTBOOKING_NAVIGATION } from "./types/postBookingEnums";
import PBMobileMap from "./PBMobileMap";
import {
  constructItineraryMapPointsData,
  constructItineraryNavigationData,
} from "./utils/postBookingUtils";
import { usePostBookingQueryParams } from "./components/hooks/usePostBookingQueryParams";

import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import ProductHeader from "components/ui/ProductHeader";
import ArticleLayoutCoverMapWrapper from "components/ui/ArticleLayout/ArticleLayoutCoverMapWrapper";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";
import { mqMin } from "styles/base";
import { blackColor, guttersPx } from "styles/variables";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { getMetadataTitle } from "components/ui/utils/uiUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { constructMapData, StartingLocationTypes } from "components/ui/Map/utils/mapUtils";
import { mockImage0 } from "utils/mockData/mockGlobalData";

const StyledCoverMapWrapper = styled(ArticleLayoutCoverMapWrapper)`
  display: none;
  ${CoverMapWrapper} {
    ${mqMin.medium} {
      height: 358px;
    }
  }
  ${mqMin.large} {
    display: block;
    margin-bottom: ${guttersPx.large};
  }
`;
const ProductHeaderStyled = styled(ProductHeader)`
  display: none;
  ${mqMin.large} {
    display: flex;
    justify-content: center;
    padding-top: ${guttersPx.small};
  }
`;

const StyledPBMapPaginationDesktop = styled(PBMapPagination)(
  () => css`
    position: absolute;
    background-color: ${rgba(blackColor, 0.4)};
  `
);

const PBTravelPlan = ({
  isMobile,
  nav,
  websiteName,
}: {
  isMobile: boolean;
  nav: string;
  websiteName: string;
}) => {
  const [{ tripId, day: dayNumber = 1 }] = usePostBookingQueryParams();
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const { generationData, generationLoading } = useCheckGenerationStatus();

  const {
    data: itineraryDataResponse,
    loading: itineraryDataLoading,
    error: itineraryDataError,
  } = useFetchItineraryData({
    skip: !generationData,
  });

  const { data: itineraryMapResponse, loading: itineraryMapResponseLoading } = useFetchMapData({
    skip: !generationData,
  });
  if (itineraryDataLoading || (generationLoading && !generationData)) return <DefaultPageLoading />;

  if (generationData === false) return <PBItineraryGenerating />;

  if (itineraryDataLoading || itineraryMapResponseLoading) return <PBItineraryLoading />;

  const currentDayData = itineraryDataResponse?.itinerary?.days?.find(
    d => d.dayNumber === dayNumber
  );

  if (!currentDayData || itineraryDataError) {
    return (
      <PBError
        error={
          itineraryDataError ?? new Error("No itinerary data found for the given travelplan day")
        }
      />
    );
  }

  const mapData = () => {
    const points = constructItineraryMapPointsData(itineraryMapResponse, dayNumber, tripId);

    const defaultPoint = points?.length ? points[0] : undefined;

    return constructMapData({
      defaultCoords: defaultPoint && {
        latitude: defaultPoint.latitude,
        longitude: defaultPoint.longitude,
      },
      frontBestPlacesMapImage: mockImage0,
      startingLocationTypes: [StartingLocationTypes.LOCALITY],
      isMobile,
      points,
    });
  };

  const navigationDays = constructItineraryNavigationData(itineraryDataResponse);

  const itineraryPageTitle = itineraryDataResponse?.itinerary?.title ?? "";
  const totalDays = itineraryDataResponse?.itinerary?.days?.length ?? 0;
  const nextDayNumber =
    currentDayData && totalDays > 1
      ? // loop through the available days - once we reach end date - display the day number 1
        (currentDayData.dayNumber % totalDays) + 1
      : undefined;
  switch (nav) {
    case POSTBOOKING_NAVIGATION.MOBILEMAP:
      return (
        <PBMobileMap
          mapData={mapData()}
          navigationDays={navigationDays}
          pageTitle={itineraryPageTitle ?? ""}
          day={dayNumber}
        />
      );
    case POSTBOOKING_NAVIGATION.TRAVELPLAN:
      return (
        <>
          <DefaultHeadTags
            title={
              itineraryPageTitle ?? getMetadataTitle(postbookingT("My travelplan"), websiteName)
            }
          />
          <TravelplanMobileModalWrapper pageTitle={itineraryPageTitle}>
            <>
              {isMobile && (
                <PBMapPagination activeDay={dayNumber} navigationDays={navigationDays} />
              )}
              <TravelplanContentWrapper>
                <StyledContainer>
                  <MaxWidthWrapper>
                    <ProductHeaderStyled title={itineraryPageTitle} />
                    {!isMobile && (
                      <StyledCoverMapWrapper>
                        <Global
                          styles={css`
                            .leaflet-control-zoom {
                              top: 40px;
                            }
                          `}
                        />
                        <CoverMap
                          mapId="pb-desktop-map"
                          map={mapData()}
                          isDirectionsEnabled={false}
                          isStreetViewEnabled={false}
                          useAlternateInfobox
                          skipCoverImage
                        >
                          <StyledPBMapPaginationDesktop
                            navigationDays={navigationDays}
                            activeDay={dayNumber}
                          />
                        </CoverMap>
                      </StyledCoverMapWrapper>
                    )}
                    <PBTimeline dayData={currentDayData} nextDayNumber={nextDayNumber} />
                  </MaxWidthWrapper>
                </StyledContainer>
              </TravelplanContentWrapper>
            </>
          </TravelplanMobileModalWrapper>
        </>
      );
    default:
      return null;
  }
};

export default PBTravelPlan;
