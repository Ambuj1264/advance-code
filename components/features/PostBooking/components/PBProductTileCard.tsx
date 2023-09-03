import React, { ElementType } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { PostBookingTypes } from "../types/postBookingTypes";
import { castTravelModeType } from "../utils/postBookingCardUtils";

import { PBProductCardButtons } from "./PBProductCardButtons";
import { PBMapModal } from "./PBMapModal";
import {
  PhoneTooltip,
  StyledProductCardActionHeader,
  StyledProductCardFooterContainer,
  StyledProductCardOverviewTile,
} from "./PBSharedComponents";
import { useTogglePhoneNumberTooltip } from "./hooks/useTogglePhoneNumberTooltip";
import { usePBOpenMap } from "./hooks/usePBOpenMap";

import { ProductCardContainer } from "components/ui/ProductCard/ProductCardContainer";
import { Namespaces } from "shared/namespaces";
import {
  blackColor,
  blueColor,
  fontSizeCaption,
  fontWeightBold,
  gutters,
  whiteColor,
} from "styles/variables";
import ReviewSummary, {
  ReviewSummaryCountStyled,
  ReviewSummaryScoreStyled,
} from "components/ui/ReviewSummary/ReviewSummaryWhite";
import { Leaf } from "components/ui/ReviewSummary/ReviewSummaryScore";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";
import useToggle from "hooks/useToggle";

const StyledReview = styled(ReviewSummary)`
  position: absolute;
  top: ${gutters.small / 2}px;
  left: ${gutters.small / 2}px;
  flex-flow: row-reverse;
  color: ${whiteColor};
  line-height: initial;
  text-shadow: 1px 1px 3px ${rgba(blackColor, 0.4)};

  ${ReviewSummaryScoreStyled} {
    color: ${whiteColor};
    ${Leaf} {
      fill: ${whiteColor};
      filter: drop-shadow(1px 1px 1px ${rgba(blueColor, 0.4)});
    }
  }

  ${ReviewSummaryCountStyled} {
    margin-right: 0;
    margin-left: ${gutters.small / 2}px;
    text-align: left;
    ${ReviewTotalCountText} {
      color: ${whiteColor};
      font-size: ${fontSizeCaption};
      font-weight: ${fontWeightBold};
    }
  }
`;

export const StyledProductCardTileContainer = styled(ProductCardContainer)(css`
  display: flex;
  flex-flow: row wrap;
  height: 100%;

  ${StyledProductCardFooterContainer} {
    align-self: flex-end;
  }
`);

export const PBProductTileCard = ({
  HeadingIcon,
  rating,
  reviewsCount,
  heading,
  title,
  image,
  placeImage,
  quickfacts,
  coords,
  phoneno,
  streetViewEnabled = false,
  travelMode,
  isExpired,
}: PostBookingTypes.ProductCard & {
  HeadingIcon: ElementType;
}) => {
  const hasReview = Boolean(rating > 0 && reviewsCount > 0);
  const theme: Theme = useTheme();
  const [phoneTooltipOpen, togglePhoneTooltip] = useTogglePhoneNumberTooltip(phoneno ?? "");

  const castedTravelMode = castTravelModeType(travelMode);
  const { openMapUrl } = usePBOpenMap(
    castedTravelMode,
    coords && coords.lat && coords.lon
      ? {
          title,
          latitude: coords.lat,
          longitude: coords.lon,
        }
      : undefined
  );

  const [streetViewModalOpen, toggleStreetView, , closeStreetView] = useToggle();

  return (
    <>
      <StyledProductCardTileContainer themeBorderColor={!isExpired}>
        <StyledProductCardActionHeader
          title={heading}
          Icon={HeadingIcon}
          isExpiredOffer={false}
          grayOut={isExpired}
        />
        <StyledProductCardOverviewTile
          grayOut={isExpired}
          imageUrl={placeImage ?? image}
          quickFacts={quickfacts}
          title={title}
          iconColor={theme.colors.primary}
          namespace={Namespaces.postBookingNs}
          imgixHeightDesktop={192}
          imgixHeightMobile={192}
          extraLeftColumnContent={
            hasReview ? (
              <StyledReview
                reviewTotalCount={reviewsCount}
                reviewTotalScore={rating}
                isLink={false}
              />
            ) : null
          }
          hasReview={hasReview}
        />
        {isExpired && <StyledProductCardFooterContainer grayOut />}
        {!isExpired && (
          <StyledProductCardFooterContainer grayOut={false}>
            {phoneTooltipOpen && <PhoneTooltip phoneno={phoneno!} />}
            <PBProductCardButtons
              isTileCard
              directionsUrl={openMapUrl}
              onStreetView={coords && streetViewEnabled ? toggleStreetView : undefined}
              onPhoneno={phoneno ? togglePhoneTooltip : undefined}
            />
          </StyledProductCardFooterContainer>
        )}
      </StyledProductCardTileContainer>
      {streetViewModalOpen && coords?.lat && coords.lon && (
        <PBMapModal
          Icon={HeadingIcon}
          title={title}
          point={{ latitude: coords?.lat, longitude: coords?.lon }}
          closeModal={closeStreetView}
        />
      )}
    </>
  );
};
