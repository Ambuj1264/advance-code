import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { TGDSectionType } from "../types/travelGuideEnums";
import { constructTGSectionsContent } from "../utils/travelGuideUtils";

import TeaserTitleAndSvgIconOnly from "components/ui/Teaser/variants/TeaserTitleAndSvgIconOnly";
import { PageType, TeaserVariant } from "types/enums";
import TeaserImageCardWithAction, {
  TitleHolder,
} from "components/ui/Teaser/variants/TeaserImageCardWithAction";
import TeaserImageTitleOnly from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import { useIsSmallDevice, useIsTabletStrict } from "hooks/useMediaQueryCustom";
import { blackColor, teaserHeight, gutters, whiteColor, zIndex } from "styles/variables";
import { useTranslation } from "i18n";
import RightArrow from "components/icons/arrow-right.svg";
import LandingPageCardOverlay from "components/ui/LandingPages/LandingPageCardOverlay";

const StyledTeaserImageCardWithAction = styled(TeaserImageCardWithAction)`
  margin: 0;
  &::before {
    background: unset;
  }
  ${TitleHolder} {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: ${rgba(blackColor, 0.3)};
  }
`;

// TODO: create a file for this? and translate text inside
const StyledRightArrow = styled(RightArrow)`
  margin-left: ${gutters.small / 2}px;
  width: 12px;
  height: 12px;
  fill: ${whiteColor};
`;

const TextArrowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLandingPageCardOverlay = styled(LandingPageCardOverlay)`
  z-index: ${zIndex.z1};
`;

const CustomDiscoverMore = (
  <TextArrowContainer>
    Discover More
    <StyledRightArrow />
  </TextArrowContainer>
);

const styledTeaserWidth = (isLargeImage: boolean, isTablet: boolean, isSmallDevice: boolean) => {
  if (isLargeImage) return 334;
  if (isTablet) return 254;
  if (isSmallDevice) return 174;
  return 218;
};

const TGDSectionCard = ({
  sectionCard,
  sectionType,
}: {
  sectionCard: TravelGuideTypes.SingleSectionResult;
  sectionType: TGDSectionType;
}) => {
  const { t } = useTranslation();
  const isFlightSection =
    sectionType === TGDSectionType.PopularFlightToDestination ||
    sectionType === TGDSectionType.PopularDomesticFlightsFromDestination;
  const {
    image,
    placeImage,
    staticMap,
    title,
    pageType,
    metadataUri,
    subTypeImage,
    destinationFlag,
    originFlag,
  } = constructTGSectionsContent(sectionCard, t, isFlightSection);
  const isSmallDevice = useIsSmallDevice();
  const isTablet = useIsTabletStrict();
  // TODO: get display type from graphcms
  const isLargeImage = false;
  const teaserWidth = styledTeaserWidth(isLargeImage, isTablet, isSmallDevice);
  switch (sectionType) {
    case TGDSectionType.TGDTopServices:
      return (
        <TeaserTitleAndSvgIconOnly
          title={title}
          url={metadataUri}
          variant={TeaserVariant.IMAGE_TITLE_ONLY}
          height={teaserHeight.small}
          pageType={pageType as PageType}
          tagType="div"
        />
      );
    case TGDSectionType.TGDLearnMoreCountry:
      return (
        <StyledTeaserImageCardWithAction
          title={title}
          smallTitle={CustomDiscoverMore}
          imageAlt={placeImage?.caption ?? ""}
          imageUrl={placeImage?.url}
          overlay={
            <StyledLandingPageCardOverlay
              originFlag={originFlag}
              destinationFlag={destinationFlag}
            />
          }
          width={660}
          imgixParams={{ fit: "crop", crop: "center" }}
          tagType="div"
        />
      );
    case TGDSectionType.PopularExperiencesInDestination:
    case TGDSectionType.PopularFlightToDestination:
    case TGDSectionType.PopularTypesOfVPsDestination:
    case TGDSectionType.PopularTypesOfStaysInDestination:
    case TGDSectionType.PopularTypesCarRentalDestination:
    case TGDSectionType.PopularDomesticFlightsFromDestination:
      return (
        <TeaserImageTitleOnly
          variant={TeaserVariant.IMAGE_TITLE_ONLY}
          url="/"
          title={title}
          smallTitle
          height={isLargeImage ? teaserHeight.large : teaserHeight.small}
          width={teaserWidth}
          image={isFlightSection ? staticMap : subTypeImage ?? image}
          overlay={
            isFlightSection && (
              <LandingPageCardOverlay
                originFlag={originFlag}
                destinationFlag={destinationFlag}
                allowSameFlag
              />
            )
          }
          tagType="div"
        />
      );
    default:
      return null;
  }
};

export default TGDSectionCard;
