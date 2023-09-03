import React, { memo, useMemo, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getMapDataWithMapboxStaticImage } from "../../ui/Cover/CoverMap/Google/mapUtils";

import { VPStateContext } from "./contexts/VPStateContext";
import { VPModalStateContext } from "./contexts/VPModalStateContext";
import { constructVPIncluded, constructVPProductSpecs } from "./utils/vacationPackageUtils";
import VPFlightSection from "./VPFlightSection/VPFlightSection";
import VPProductContentSearch from "./VPProductContentSearch";
import VPProductContentSearchMobileSteps from "./VPProductContentSearchMobileSteps";
import { VPDaysContentSection } from "./VPDaysContentSection";
import { VPSectionSimilarRoadTrips } from "./VPSectionSimilarRoadTrips";
import VPCarSectionContextWrapper from "./VPCarSection/VPCarSectionContextWrapper";
import { useTravelStopModal } from "./VPTravelStopModal/travelStopModalHooks";
import VPTravelStopModalManager from "./VPTravelStopModal/VPTravelStopModalManager";
import VPContentLocationPicker from "./VPContentLocationPicker";
import VPMobileToggle from "./VPMobileToggle";
import { useVacationPackagePrices } from "./hooks/useVacationPackagePrices";
import { VPStyledSectionContent } from "./vpShared";
import { VPFlightStateContext } from "./contexts/VPFlightStateContext";
import { VPCarStateContext } from "./contexts/VPCarStateContext";
import { VPActionCallbackContext } from "./contexts/VPActionStateContext";
import { VPStayStateContext } from "./contexts/VPStayStateContext";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import LandingPageValuePropositions from "components/ui/LandingPages/LandingPageValuePropositions";
import { Content } from "components/ui/PageContentContainer";
import { gutters } from "styles/variables";
import Information from "components/ui/Information/Information";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import Section from "components/ui/Section/Section";
import IconList from "components/ui/IconList/IconList";
import {
  StyledIconList,
  StyledAttractionsMapContainer,
} from "components/ui/Map/AttractionsMapContainer";
import GridRow from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import GraphCMSIcon from "components/ui/GraphCMSIcon";
import ProductCover from "components/ui/ImageCarousel/ProductCover";
import { MobileContainer } from "components/ui/Grid/Container";
import { mqMax, mqMin } from "styles/base";
import { IconItemWrapper, Text as IconText } from "components/ui/IconList/IconItem";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { DisplayType, TravelStopType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { constructAttractionsList } from "components/features/TravelGuides/utils/travelGuideUtils";
import { getFlightClass } from "components/ui/FlightsShared/flightsSharedUtils";

const Icon = GraphCMSIcon;

export const StyledContentColumn = styled(Column)`
  margin-top: ${gutters.small * 2}px;
  ${mqMin.large} {
    margin-top: 0;
  }
`;

const StyledInformation = styled(Information)`
  ${mqMax.large} {
    margin: ${gutters.small}px 0 0 0;
  }
`;

export const StyledIncludedList = styled(IconList)`
  ${IconItemWrapper} {
    ${IconText} {
      line-height: 20px;
    }
    ${mqMin.large} {
      height: 40px;
    }
  }
`;

const TravelDetailsLeftSectionHeading = styled(LeftSectionHeading)`
  margin-bottom: ${gutters.small}px;
  ${mqMax.large} {
    margin-bottom: -${gutters.small - 2}px;
  }
`;

const StyledLeftSectionHeading = styled(LeftSectionHeading)<{
  showSection: boolean;
}>(
  ({ showSection }) => css`
    display: flex;
    margin-bottom: ${gutters.small / 2}px;
    ${mqMin.large} {
      display: ${showSection ? "block" : "none"};
    }
  `
);

const StyledVPContentLocationPicker = styled(VPContentLocationPicker)`
  ${mqMin.large} {
    display: none;
  }
`;

const StyledVPMobileToggle = styled(VPMobileToggle)`
  align-items: flex-start;
  margin-left: ${gutters.small / 2}px;
  height: 20px;
  line-height: 20px;
  ${mqMin.large} {
    display: none;
  }
`;

const StyledVPSection = styled(Section)`
  clear: both;
  contain-intrinsic-size: initial;
  content-visibility: unset;
  overflow-clip-margin: unset;
`;

const VPLeftContent = ({
  images,
  reviewScore,
  reviewCount,
  description,
  vacationPackageAttractions,
  vacationPackageDestinations,
  mapData,
  productSpecs,
  productProps,
  vacationPackageDays,
  destinationCountryId,
  destinationCountryName,
  tripId,
  included,
  vpDestinationsInfo,
  translateOptions,
}: {
  images: ImageWithSizes[];
  reviewScore: number;
  reviewCount: number;
  description: string;
  vacationPackageAttractions: TravelStopTypes.TravelStops[];
  vacationPackageDestinations: TravelStopTypes.TravelStops[];
  mapData?: SharedTypes.Map;
  productSpecs: VacationPackageTypes.Quickfact[];
  productProps: VacationPackageTypes.ValueProp[];
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  destinationCountryId?: string;
  destinationCountryName?: string;
  tripId: string;
  included: VacationPackageTypes.IncludedItems[];
  vpDestinationsInfo: VacationPackageTypes.VPDestinationInfo[];
  translateOptions: VacationPackageTypes.TranslateOptions;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const { t: flightT } = useTranslation(Namespaces.flightSearchNs);
  const isMobile = useIsMobile();
  const { originId, vacationIncludesFlight, cabinType } = useContext(VPFlightStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const {
    isModalToggled,
    travelStopItems,
    clickedIcon,
    toggleModal,
    handleItemChange,
    createHandleTravelStopModalToggle,
  } = useTravelStopModal();
  const { vacationIncludesCar, selectedCarOffer } = useContext(VPCarStateContext);
  const { onIncludeVPCarsToggle, onIncludeVPFlightsToggle } = useContext(VPActionCallbackContext);
  const { selectedDates, vacationLength } = useContext(VPStateContext);
  const { isMobileSteps } = useContext(VPModalStateContext);
  const includedItems = useMemo(
    () =>
      constructVPIncluded({
        tFunc: t,
        included,
        vacationLength: vacationPackageDays?.length,
        vacationIncludesCar,
      }),
    [t, included, vacationPackageDays?.length, vacationIncludesCar]
  );
  const productSpecItems = useMemo(
    () =>
      constructVPProductSpecs({
        productSpecs,
        vacationIncludesCar,
        vacationIncludesFlight,
        quickFactsNsT: t,
        vpDestinationsInfo,
        translateOptions: {
          ...translateOptions,
          flightClass: getFlightClass(cabinType, flightT),
          pickupDestination: selectedCarOffer?.pickupName,
          dropoffDestination: selectedCarOffer?.dropoffName,
          carType: selectedCarOffer?.title,
        },
      }),
    [
      productSpecs,
      vacationIncludesCar,
      translateOptions,
      flightT,
      t,
      cabinType,
      vacationIncludesFlight,
      selectedCarOffer,
      vpDestinationsInfo,
    ]
  );
  const handleDestinationModalToggle = useMemo(
    () =>
      createHandleTravelStopModalToggle(vacationPackageDestinations, TravelStopType.DESTINATION),
    [createHandleTravelStopModalToggle, vacationPackageDestinations]
  );

  const handleAttractionModalToggle = useMemo(
    () => createHandleTravelStopModalToggle(vacationPackageAttractions, TravelStopType.ATTRACTION),
    [createHandleTravelStopModalToggle, vacationPackageAttractions]
  );

  const displayFlightSection = Boolean(vacationIncludesFlight && selectedDates.from && originId);
  // TODO: remove this override after we resolve the issue with dynamc google map API
  const { coverMapData, contentMapData } = getMapDataWithMapboxStaticImage(
    isMobile,
    mapData,
    920,
    430
  );

  useVacationPackagePrices();
  return (
    <>
      <Content data-testid="vpContentContainer">
        <ProductCover
          images={images}
          reviewScore={reviewScore}
          reviewCount={reviewCount}
          mapData={coverMapData}
          showReviews={false}
          useAlternateStaticImageOnly
        />
        {/* TODO: Verify if we need the fourth value prop that only appears in medium or smaller resolutions */}
        <MobileContainer>
          <LandingPageValuePropositions
            valueProps={productProps as LandingPageTypes.LandingPageValueProposition[]}
            maxDesktopColumns={3}
          />
        </MobileContainer>
        <MobileContainer>
          <StyledInformation
            id="vpInformation"
            information={description}
            productSpecs={productSpecItems}
            lineLimit={8}
            clampedTextExtraHeight={12}
          />
        </MobileContainer>
        <StyledVPSection id="vpAmenities">
          <MobileContainer>
            <GridRow>
              <Column columns={{ small: 1, large: 2 }}>
                <LeftSectionHeading>
                  <Trans ns={Namespaces.vacationPackageNs}>Included</Trans>
                </LeftSectionHeading>
                <StyledIncludedList
                  sectionId="vpIncluded"
                  iconList={
                    includedItems.map(includes => ({
                      id: includes.title,
                      title: includes.title,
                      Icon: Icon(includes.icon?.handle),
                    })) as SharedTypes.Icon[]
                  }
                  iconLimit={8}
                  inGrid
                  columns={{ small: 2 }}
                />
              </Column>
              <StyledContentColumn columns={{ small: 1, large: 2 }}>
                <LeftSectionHeading>
                  <Trans ns={Namespaces.vacationPackageNs}>Destinations</Trans>
                </LeftSectionHeading>
                <StyledIconList
                  sectionId="vpDestinations"
                  iconList={
                    vacationPackageDestinations.reduce(
                      (acc: SharedTypes.Icon[], curr) => [...acc, curr.info],
                      []
                    ) as SharedTypes.Icon[]
                  }
                  shouldUseDynamicLimit
                  iconLimit={7}
                  onClick={handleDestinationModalToggle}
                  inGrid
                  columns={{ small: 2 }}
                />
              </StyledContentColumn>
            </GridRow>
          </MobileContainer>
        </StyledVPSection>
        {contentMapData && (
          <StyledAttractionsMapContainer
            attractions={constructAttractionsList(vacationPackageAttractions)}
            sectionId="vpAttractions"
            map={contentMapData}
            attractionsTitle={t("Attractions")}
            onIconClick={handleAttractionModalToggle}
            shouldUseDynamicLimit
            useAlternateStaticImageOnly
          />
        )}
        <StyledVPSection id="vpFlightSearch">
          <MobileContainer>
            <TravelDetailsLeftSectionHeading>
              <Trans ns={Namespaces.vacationPackageNs}>Travel details</Trans>
            </TravelDetailsLeftSectionHeading>
            <VPProductContentSearch />
            {isMobileSteps ? <VPProductContentSearchMobileSteps /> : null}
          </MobileContainer>
        </StyledVPSection>
        <StyledVPSection id="vpFlightSection">
          <MobileContainer>
            <StyledLeftSectionHeading showSection={displayFlightSection}>
              <Trans ns={Namespaces.vacationPackageNs}>Flights</Trans>
              <StyledVPMobileToggle
                id="Flights"
                labelText=""
                isTooltipVisible={!originId}
                checked={vacationIncludesFlight}
                onChange={onIncludeVPFlightsToggle}
                tooltip={t("Please select your flight's origin to search")}
              />
            </StyledLeftSectionHeading>

            <StyledVPContentLocationPicker vacationIncludesFlight={vacationIncludesFlight} />
            {displayFlightSection && (
              <VPStyledSectionContent>
                <VPFlightSection />
              </VPStyledSectionContent>
            )}
          </MobileContainer>
        </StyledVPSection>
        <StyledVPSection id="vpCarSection">
          <MobileContainer>
            {/* Mobile Cars heading with toggle */}
            <MediaQuery toDisplay={DisplayType.Large}>
              <StyledLeftSectionHeading showSection>
                <Trans ns={Namespaces.vacationPackageNs}>Car</Trans>
                <StyledVPMobileToggle
                  id="Cars"
                  labelText=""
                  checked={vacationIncludesCar}
                  onChange={onIncludeVPCarsToggle}
                />
              </StyledLeftSectionHeading>
            </MediaQuery>
            {/* Desktop Cars heading without toggle */}
            <MediaQuery fromDisplay={DisplayType.Large}>
              {vacationIncludesCar && (
                <Section id="vpCarSection">
                  <LeftSectionHeading>
                    <Trans ns={Namespaces.vacationPackageNs}>Car</Trans>
                  </LeftSectionHeading>
                </Section>
              )}
            </MediaQuery>
            {vacationIncludesCar && (
              <VPStyledSectionContent>
                <VPCarSectionContextWrapper vacationLength={vacationLength} />
              </VPStyledSectionContent>
            )}
          </MobileContainer>
        </StyledVPSection>
        <StyledVPSection id="vpItinerary">
          <MobileContainer>
            <LeftSectionHeading>
              <Trans ns={Namespaces.vacationPackageNs}>Personalize</Trans>
            </LeftSectionHeading>
            <VPDaysContentSection
              vacationPackageDays={vacationPackageDays}
              vacationLength={vacationLength}
              createHandleTravelStopModalToggle={createHandleTravelStopModalToggle}
              vacationIncludesCar={vacationIncludesCar}
              vacationIncludesFlight={vacationIncludesFlight}
            />
          </MobileContainer>
        </StyledVPSection>
        <VPSectionSimilarRoadTrips
          occupancies={occupancies}
          selectedDates={selectedDates}
          tripId={tripId}
          destinationCountryId={destinationCountryId}
          destinationCountryName={destinationCountryName}
        />
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

export default memo(VPLeftContent);
