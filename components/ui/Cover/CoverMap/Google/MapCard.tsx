import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useGetMapDirectionsUrlBuilder } from "../hooks/useGetMapDirectionsUrlBuilder";

import MapCardFooter from "./MapCardFooter";
import { getGoogleMapStreetViewPageUrl } from "./mapUtils";

import DirectionIcon from "components/icons/diagram-arrow-corner-point-right-square.svg";
import LocationUserIcon from "components/icons/location-user-colorized.svg";
import PlusIcon from "components/icons/plus.svg";
import { skeletonPulse, skeletonPulseBlue, clampLinesWithFixedHeight } from "styles/base";
import { MapPointType } from "types/enums";
import {
  gutters,
  greyColor,
  whiteColor,
  blueColor,
  carColor,
  hotelColor,
  dayTourColor,
  attractionColor,
  fontWeightBold,
  fontWeightSemibold,
  fontSizeCaptionSmall,
  borderRadius,
  buttercupColor,
  borderRadius20,
  zIndex,
} from "styles/variables";
import {
  typographyCaption,
  typographyCaptionSemibold,
  typographySubtitle2,
} from "styles/typography";
import ReviewSummaryScore from "components/ui/ReviewSummary/ReviewSummaryScore";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";
import ReviewStars, { Star } from "components/ui/ReviewStars";
import { getDefaultReviewCountTextTranslation } from "components/ui/ReviewSummary/utils";
import { useTranslation } from "i18n";
import DestinationIcon from "components/icons/pin-location-1.svg";
import DayTourIcon from "components/icons/traveler.svg";
import HotelIcon from "components/icons/bedroom-hotel.svg";
import CarIcon from "components/icons/car.svg";
import AttractionIcon from "components/icons/camera-1.svg";
import ImageComponent from "components/ui/ImageComponent";

const CardImageWrapper = styled.div<{
  showTopShadow?: boolean;
  height: number;
}>([
  ({ height }) =>
    css`
      position: relative;
      height: ${height}px;
    `,
  ({ showTopShadow }) =>
    showTopShadow &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        border-radius: ${borderRadius} ${borderRadius} 0px 0px;
        background: linear-gradient(360deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%);
      }
    `,
]);

const StyledImage = styled(ImageComponent, { shouldForwardProp: () => true })`
  border-radius: ${borderRadius} ${borderRadius} 0px 0px;
  width: 100%;
  height: 100%;
  background-color: ${rgba(greyColor, 0.5)};
  color: rgba(0, 0, 0, 0);
  object-fit: cover;
`;

const MapCardTitle = styled.div`
  padding: ${gutters.small / 4}px ${gutters.small / 2}px;
  color: ${blueColor};
  ${typographyCaption}
  font-weight: ${fontWeightBold};
  text-align: center;
  ${clampLinesWithFixedHeight({ numberOfLines: 3, lineHeight: 16 })}
`;

const StyledMapActionLinkWrapper = styled.div`
  padding: 0 ${gutters.large / 2}px ${gutters.large / 2}px;
`;

const StyledMapActionLink = styled.a(
  ({ theme, type = "Direction" }: { theme?: Theme; type: "Direction" | "SeeOutside" }) => [
    css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${borderRadius20};
      ${typographyCaptionSemibold};
      padding: ${gutters.small / 2}px;

      > svg {
        position: absolute;
        left: ${gutters.small}px;
        max-height: 16px;
      }

      &:nth-of-type(2n) {
        margin-top: ${gutters.small / 2}px;
      }
    `,
    type === "Direction" &&
      css`
        background-color: ${theme?.colors.primary};
        color: ${whiteColor};
      `,
    type === "SeeOutside" &&
      css`
        border: 1px solid ${theme?.colors.primary};
        color: ${theme?.colors.primary};
      `,
  ]
);

const ImageSkeleton = styled.div<{ height: number }>([
  skeletonPulseBlue,
  ({ height }) => css`
    border-radius: ${borderRadius} ${borderRadius} 0px 0px;
    height: ${height}px;
  `,
]);

const alternateCardWidth = 229;

export const MapCardWrapperAlternate = styled.div`
  position: relative;
  display: block;
  /* this transparent border is used for close button positioning */
  border: 12px solid transparent;
  width: ${alternateCardWidth + 2 * 12}px;
`;

const MapCardWrapperAlternateContent = styled.div([
  ({ theme }) => css`
    position: relative;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: ${borderRadius};
    width: ${alternateCardWidth}px;
    background: ${whiteColor};

    ${StyledMapActionLink} + ${StyledMapActionLink} {
      margin-top: ${gutters.small / 2}px;
    }

    ${MapCardTitle} {
      color: ${theme.colors.primary};
    }
  `,
  ({ withStreetViewButton }: { withStreetViewButton: boolean }) => css`
    min-height: ${withStreetViewButton ? 220 : 180}px;
  `,
]);

const MapCardWrapperRegular = styled.div<{
  isLink: boolean;
}>([
  css`
    position: relative;
    display: block;
    border-radius: ${borderRadius};
    width: 160px;
    min-height: 136px;
    background-color: ${whiteColor};
  `,
  ({ isLink }) =>
    isLink &&
    css`
      :hover ${MapCardTitle} {
        cursor: pointer;
        text-decoration: underline;
      }
    `,
]);

const ReviewWrapper = styled.div`
  position: absolute;
  top: ${gutters.small / 2}px;
  left: ${gutters.small / 2}px;
  display: flex;
  margin-right: 20px;
`;

const ReviewSummaryScoreStyled = styled(ReviewSummaryScore)`
  ${typographySubtitle2};
  font-weight: ${fontWeightBold};
`;

const ReviewSummaryCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${gutters.small / 4}px;

  ${ReviewTotalCountText} {
    font-size: ${fontSizeCaptionSmall};
    font-weight: ${fontWeightSemibold};
    line-height: 1.2;
  }

  ${Star} {
    width: 7px;
    height: 7px;
  }
`;

const CardIdentifier = styled.div<{ bgColor?: string }>(
  ({ bgColor }) => css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 ${borderRadius} 0 ${borderRadius};
    width: 20px;
    height: 20px;
    background-color: ${bgColor || blueColor};
    svg {
      width: 12px;
      height: 12px;
      fill: ${whiteColor};
    }
  `
);

const TitleSkeleton = styled.div([
  skeletonPulse,
  css`
    height: 10px;
  `,
]);

const StyledLocationUserIcon = styled(LocationUserIcon)(
  ({ theme }) => `
  .location-user-colorized_svg__user {
    fill: ${buttercupColor};
  }

  .location-user-colorized_svg__circle {
    fill: ${rgba(theme.colors.action, 0.2)};
  }
`
);

const StyledDirection = styled(DirectionIcon)`
  max-width: 16px;
  fill: ${whiteColor};
`;

const StyledCardContentWrapper = styled.div`
  display: block;
`;

const StyledX = styled(PlusIcon)`
  transform: rotate(45deg);
`;

const StyledClose = styled.div`
  position: absolute;
  top: -24px;
  right: 0;
  z-index: ${zIndex.z1};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background: ${whiteColor};
  transform: translate(50%, 50%);

  &:hover {
    cursor: pointer;
  }

  ${StyledX} {
    width: 10px;
    height: 10px;
    fill: ${rgba(greyColor, 0.7)};
  }
`;

const StyledText = styled.span`
  color: ${whiteColor};
`;

type CardIdentifierType = {
  icon: any;
  color: string;
};

const CARD_IDENTIFIER_BY_TYPE: {
  [type: string]: CardIdentifierType;
} = {
  [MapPointType.TOUR]: {
    icon: DayTourIcon,
    color: dayTourColor,
  },
  [MapPointType.DAY_TOUR]: {
    icon: DayTourIcon,
    color: dayTourColor,
  },
  [MapPointType.PACKAGE_TOUR]: {
    icon: DayTourIcon,
    color: dayTourColor,
  },
  [MapPointType.SELF_DRIVE_TOUR]: {
    icon: DayTourIcon,
    color: dayTourColor,
  },
  [MapPointType.HOTEL]: {
    icon: HotelIcon,
    color: hotelColor,
  },
  [MapPointType.CAR]: {
    icon: CarIcon,
    color: carColor,
  },
  [MapPointType.ATTRACTION]: {
    icon: AttractionIcon,
    color: attractionColor,
  },
  [MapPointType.DESTINATION]: {
    icon: DestinationIcon,
    color: blueColor,
  },
};

const getCardIdentifier = (pointType: MapPointType): CardIdentifierType => {
  const identifier = CARD_IDENTIFIER_BY_TYPE[pointType];

  return identifier || CARD_IDENTIFIER_BY_TYPE[MapPointType.DESTINATION];
};

const MapCardImage = ({
  pointData,
  width,
  height,
}: {
  pointData: SharedTypes.MapPoint;
  width: number;
  height: number;
}) => {
  const { t: commonT } = useTranslation();

  const hasReviews = Boolean(pointData.reviewTotalScore && pointData.reviewTotalCount);

  return (
    <CardImageWrapper showTopShadow={hasReviews} height={height}>
      {pointData.image ? (
        <>
          <StyledImage
            width={width}
            height={height}
            imageUrl={pointData.image.url}
            imgixParams={{ "min-w": 160, fit: "crop" }}
          />
          {hasReviews ? (
            <ReviewWrapper>
              <ReviewSummaryScoreStyled reviewTotalScore={pointData.reviewTotalScore.toFixed(1)} />
              <ReviewSummaryCount>
                <ReviewStars reviewScore={pointData.reviewTotalScore} />
                <ReviewTotalCountText>
                  {getDefaultReviewCountTextTranslation(
                    commonT,
                    pointData.reviewTotalCount,
                    pointData.isGoogleReview
                  )}
                </ReviewTotalCountText>
              </ReviewSummaryCount>
            </ReviewWrapper>
          ) : null}
        </>
      ) : (
        <ImageSkeleton height={height} />
      )}
    </CardImageWrapper>
  );
};

const MapCardContentAlternate = ({
  pointData,
  onClose,
  isStreetViewStatusLoading,
  isStreetViewAvailable,
  isDirectionsEnabled = true,
  className,
}: {
  className?: string;
  pointData: SharedTypes.MapPoint;
  onClose?: () => void;
  isStreetViewAvailable?: boolean;
  isDirectionsEnabled?: boolean;
  isStreetViewStatusLoading?: boolean;
}) => {
  const { t: commonT } = useTranslation();

  const getDirections = useGetMapDirectionsUrlBuilder();

  const href = pointData.url;
  const maybeDisplayAsLink = useMemo(() => {
    return href ? { as: "a", target: "_blank", href } : {};
  }, [href]);

  return (
    <MapCardWrapperAlternate className={className}>
      {typeof onClose === "function" && (
        <StyledClose onClick={onClose}>
          <StyledX />
        </StyledClose>
      )}
      <MapCardWrapperAlternateContent
        withStreetViewButton={Boolean(isStreetViewStatusLoading || isStreetViewAvailable)}
      >
        <StyledCardContentWrapper {...maybeDisplayAsLink}>
          <MapCardImage pointData={pointData} width={alternateCardWidth} height={112} />
          <MapCardTitle>{pointData.title ? pointData.title : <TitleSkeleton />}</MapCardTitle>
          {pointData.price && (
            <MapCardFooter price={pointData.price} displayValue={pointData.priceDisplayValue} />
          )}
        </StyledCardContentWrapper>

        {!isStreetViewStatusLoading && (
          <StyledMapActionLinkWrapper>
            {isStreetViewAvailable && (
              <StyledMapActionLink
                type="SeeOutside"
                href={getGoogleMapStreetViewPageUrl(pointData as unknown as SharedTypes.Map)}
                target="_blank"
              >
                <StyledLocationUserIcon />
                <StyledText>{commonT("See outside")}</StyledText>
              </StyledMapActionLink>
            )}
            {isDirectionsEnabled && (
              <StyledMapActionLink
                type="Direction"
                href={getDirections(pointData as unknown as SharedTypes.Map)}
                target="_blank"
              >
                <StyledDirection />
                <StyledText>{commonT("Directions")}</StyledText>
              </StyledMapActionLink>
            )}
          </StyledMapActionLinkWrapper>
        )}
      </MapCardWrapperAlternateContent>
    </MapCardWrapperAlternate>
  );
};

const MapCardContentRegular = ({ pointData }: { pointData: SharedTypes.MapPoint }) => {
  const { icon: CardIdentifierIcon, color: identifierColor } = getCardIdentifier(pointData.type);

  const href = pointData.url;

  return (
    <MapCardWrapperRegular
      isLink={href !== undefined}
      {...(href ? { as: "a", target: "_blank", href } : {})}
    >
      <StyledCardContentWrapper>
        <CardIdentifier bgColor={identifierColor}>
          <CardIdentifierIcon />
        </CardIdentifier>
        <MapCardImage pointData={pointData} width={160} height={80} />
        <MapCardTitle>{pointData.title ? pointData.title : <TitleSkeleton />}</MapCardTitle>
        {pointData.price && (
          <MapCardFooter price={pointData.price} displayValue={pointData.priceDisplayValue} />
        )}
      </StyledCardContentWrapper>
    </MapCardWrapperRegular>
  );
};

const MapCard = ({
  pointData,
  useAlternateInfobox,
  isStreetViewAvailable,
  isStreetViewStatusLoading,
  isDirectionsEnabled = true,
  className,
  onClose,
}: {
  pointData?: SharedTypes.MapPoint;
  className?: string;
  useAlternateInfobox: boolean;
  isStreetViewAvailable: boolean;
  isDirectionsEnabled?: boolean;
  isStreetViewStatusLoading: boolean;
  onClose?: () => void;
}) => {
  if (!pointData) {
    return null;
  }

  if (useAlternateInfobox) {
    return (
      <MapCardContentAlternate
        pointData={pointData}
        className={className}
        onClose={onClose}
        isStreetViewStatusLoading={isStreetViewStatusLoading}
        isStreetViewAvailable={isStreetViewAvailable}
        isDirectionsEnabled={isDirectionsEnabled}
      />
    );
  }

  return <MapCardContentRegular pointData={pointData} />;
};

export default MapCard;
