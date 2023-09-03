import React, { memo, useMemo } from "react";
import styled from "@emotion/styled";

// TODO: Move all travelStop related files to its UI folder
import { useTravelStopModal } from "../VacationPackageProductPage/VPTravelStopModal/travelStopModalHooks";
import VPTravelStopModalManager from "../VacationPackageProductPage/VPTravelStopModal/VPTravelStopModalManager";

import GTETourAmenitiesSection from "./GTETourAmenitiesSection";
import GTETourReviewsContainer from "./GTETourReviewsContainer";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidget/GTETourBookingWidgetStateContext";
import {
  constructGTETourProductSpecs,
  constructTourContent,
  constructTourSearchLink,
  isTourPageIndexed,
} from "./utils/gteTourUtils";
import { useGTESimilarToursQuery } from "./useGTESimilarTours";
import GTESimilarToursContainer from "./GTESimilarToursContainer";
import GTETourInfoList from "./GTETourInfoList";
import GTETourSEOContainer from "./GTETourSEOContainer";

import InformationListContainer from "components/ui/InformationListContainer";
import { Content } from "components/ui/PageContentContainer";
import ProductCover from "components/ui/ImageCarousel/ProductCover";
import { MobileContainer } from "components/ui/Grid/Container";
import LandingPageValuePropositions from "components/ui/LandingPages/LandingPageValuePropositions";
import Information from "components/ui/Information/Information";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import Section from "components/ui/Section/Section";
import { TravelStopType, SupportedLanguages } from "types/enums";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { Itinerary } from "components/ui/Itinerary/Itinerary";
import { StyledAttractionsMapContainer } from "components/ui/Map/AttractionsMapContainer";
import { mqMin } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { getMapDataWithMapboxStaticImage } from "components/ui/Cover/CoverMap/Google/mapUtils";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = () => {};

const InformationSection = styled(Section)`
  ${mqMin.large} {
    margin-top: 0;
  }
`;

const OptionsSection = styled(Section)`
  ${mqMin.large} {
    margin-top: 36px;
  }
`;

const GTETourContentContainer = ({
  tourData,
  productId,
  isModalView = false,
  locale = SupportedLanguages.English,
  className,
  tourSEOContainerData,
}: {
  tourData: GTETourTypes.QueryTourContent[];
  productId?: string;
  isModalView?: boolean;
  locale?: SupportedLanguages;
  className?: string;
  tourSEOContainerData?: {
    queryCondition: LandingPageTypes.LandingPageQueryCondition;
    isIndexed: boolean;
    fromPrice: number;
    metadataUri: string;
    startPlace?: {
      tourId: string;
      name: GTETourTypes.Name;
    };
    locale: SupportedLanguages;
  };
}) => {
  const isOnEnglishLocale = locale === SupportedLanguages.English;
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.tourNs);
  const {
    isModalToggled,
    travelStopItems,
    clickedIcon,
    toggleModal,
    handleItemChange,
    createHandleTravelStopModalToggle,
  } = useTravelStopModal();
  const { selectedDates, numberOfTravelers, priceGroups, startingPlace, endingPlace } =
    useGTETourBookingWidgetContext();
  const content = useMemo(
    () => constructTourContent(tourData, t, isOnEnglishLocale),
    [tourData, t, isOnEnglishLocale]
  );
  const { similarTours, similarToursLoading } = useGTESimilarToursQuery({
    startingLocationId: content?.startPlace?.id,
    productId,
  });
  const handleDestinationModalToggle = useMemo(
    () =>
      content?.destinations
        ? createHandleTravelStopModalToggle(content.destinations, TravelStopType.DESTINATION)
        : doNothing,
    [content?.destinations, createHandleTravelStopModalToggle]
  );

  const handleAttractionModalToggle = useMemo(
    () =>
      content?.attractions
        ? createHandleTravelStopModalToggle(content.attractions, TravelStopType.ATTRACTION)
        : doNothing,
    [content?.attractions, createHandleTravelStopModalToggle]
  );
  const specs = useMemo(
    () => constructGTETourProductSpecs(t, tourData?.[0], startingPlace, endingPlace),
    [tourData, startingPlace, endingPlace, t]
  );
  if (!content) return null;
  const {
    destinations,
    includedItems,
    description,
    images,
    mapData,
    review,
    productProps,
    attractions,
    itinerary,
    tourOptions,
    additionalInfo,
    landingPageUri,
    startPlace,
    safetyInfo,
    isLikelyToSellOut,
  } = content;
  const reviewTotalScore = content.review?.totalScore ?? 0;
  const reviewTotalCount = content.review?.totalCount ?? 0;
  const searchUrl = constructTourSearchLink(
    selectedDates,
    numberOfTravelers,
    priceGroups,
    landingPageUri,
    startPlace
  );
  // TODO: remove this override after we resolve the issue with dynamc google map API
  const { coverMapData, contentMapData } = getMapDataWithMapboxStaticImage(
    isMobile,
    mapData,
    920,
    430
  );

  return (
    <>
      <Content className={className}>
        {tourSEOContainerData && (
          <GTETourSEOContainer
            queryCondition={tourSEOContainerData.queryCondition}
            isIndexed={isTourPageIndexed(
              tourSEOContainerData.isIndexed,
              tourSEOContainerData.locale
            )}
            fromPrice={tourSEOContainerData.fromPrice}
            metadataUri={tourSEOContainerData.metadataUri}
            pagePlace={tourSEOContainerData.startPlace}
            review={{ totalScore: reviewTotalScore, totalCount: reviewTotalCount }}
          />
        )}
        <ProductCover
          id={productId}
          images={images}
          reviewScore={review.totalScore}
          reviewCount={review.totalCount}
          mapData={coverMapData}
          crop="center"
          showReviews={review.totalCount > 0 && !isModalView}
          isLikelyToSellOut={isLikelyToSellOut}
          useAlternateStaticImageOnly
        />
        <MobileContainer>
          <LandingPageValuePropositions valueProps={productProps} />
        </MobileContainer>
        <InformationSection id="information" key="information">
          <MobileContainer>
            <Information
              information={description}
              productSpecs={specs}
              lineLimit={4}
              id="tourProductInfo"
            />
          </MobileContainer>
        </InformationSection>
        <GTETourAmenitiesSection
          destinations={destinations}
          includedItems={includedItems}
          onDestinationClick={handleDestinationModalToggle}
        />
        {contentMapData && (
          <StyledAttractionsMapContainer
            attractions={attractions.reduce(
              (acc: SharedTypes.Icon[], curr) => [...acc, curr.info],
              []
            )}
            sectionId="tourAttractions"
            map={contentMapData}
            useAlternateStaticImageOnly
            attractionsTitle={t("Attractions")}
            onIconClick={handleAttractionModalToggle}
          />
        )}
        {tourOptions.length > 1 && (
          <OptionsSection key="includedItems">
            <MobileContainer>
              <LeftSectionHeading>{t("Options")}</LeftSectionHeading>
              <InformationListContainer informationList={tourOptions} capitalize />
            </MobileContainer>
          </OptionsSection>
        )}
        {itinerary && itinerary.length ? (
          <Section id="tourItinerary">
            <MobileContainer>
              <LeftSectionHeading>{t("Daily Itinerary")}</LeftSectionHeading>
              <Itinerary
                itinerary={itinerary}
                itineraryLength={itinerary.length}
                createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
                // TODO: replace with real data when we have dates
                dateFrom={new Date()}
              />
            </MobileContainer>
          </Section>
        ) : null}
        <GTETourInfoList additionalInfo={additionalInfo} safetyInfo={safetyInfo} t={t} />
        {!isModalView && reviewTotalCount > 0 && (
          <GTETourReviewsContainer
            productCode={productId}
            reviewTotalCount={reviewTotalCount}
            reviewTotalScore={reviewTotalScore}
          />
        )}
        {!isModalView && (similarToursLoading || similarTours.length > 0) && (
          <GTESimilarToursContainer
            similarTours={similarTours}
            similarToursLoading={similarToursLoading}
            searchUrl={searchUrl || ""}
          />
        )}
      </Content>
      {isModalToggled && clickedIcon && (
        <VPTravelStopModalManager
          clickedIcon={clickedIcon}
          onToggleModal={toggleModal}
          onSetClickedIcon={handleItemChange}
          items={travelStopItems}
        />
      )}
    </>
  );
};

export default memo(GTETourContentContainer);
