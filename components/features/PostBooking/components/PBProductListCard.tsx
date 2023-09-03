import React, { ElementType } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";

import { PB_ACTIVE_MODAL, PB_CARD_TYPE } from "../types/postBookingEnums";

import { PBMapModal } from "./PBMapModal";
import {
  PhoneTooltip,
  StyledProductCardActionHeader,
  StyledProductCardFooterContainer,
  StyledProductCardOverviewList,
} from "./PBSharedComponents";
import { useTogglePhoneNumberTooltip } from "./hooks/useTogglePhoneNumberTooltip";
import { useTogglePBModal } from "./hooks/useTogglePBModal";
import { usePBOpenMap } from "./hooks/usePBOpenMap";

import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";
import { PBProductCardButtons } from "components/features/PostBooking/components/PBProductCardButtons";
import { ProductCardContainer } from "components/ui/ProductCard/ProductCardContainer";
import { Namespaces } from "shared/namespaces";
import PBItineraryModalManager from "components/features/PostBooking/components/PBItineraryModalManager";
import { castTravelModeType } from "components/features/PostBooking/utils/postBookingCardUtils";
import {
  blackColor,
  blueColor,
  fontSizeCaption,
  fontWeightBold,
  gutters,
  whiteColor,
} from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import ReviewSummary, {
  ReviewSummaryCountStyled,
  ReviewSummaryScoreStyled,
} from "components/ui/ReviewSummary/ReviewSummaryWhite";
import { Leaf } from "components/ui/ReviewSummary/ReviewSummaryScore";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";
import { productIsVoucher } from "components/features/PostBooking/utils/postBookingUtils";
import useToggle from "hooks/useToggle";

const StyledReview = styled(ReviewSummary)`
  position: absolute;

  ${mqMax.large} {
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
      ${ReviewTotalCountText} {
        color: ${whiteColor};
        font-size: ${fontSizeCaption};
        font-weight: ${fontWeightBold};
      }
    }
  }

  ${mqMin.large} {
    top: ${gutters.large / 2 + 24}px;
    right: ${gutters.large / 2}px;
  }
`;

export const PBProductListCard = ({
  type,
  HeadingIcon,
  bookingId,
  orderId,
  googlePlaceId,
  rating,
  reviewsCount,
  phoneno,
  heading,
  image,
  coords,
  bookingReference,
  quickfacts,
  title,
  streetViewEnabled = false,
  id,
  tourId,
  ticket,
  travelMode,
  isExpired,
}: PostBookingTypes.ProductCard & {
  HeadingIcon: ElementType;
}) => {
  const theme: Theme = useTheme();
  const hasReview = Boolean(rating && reviewsCount);
  const { modalType, closeModals, openBookingModal, openInfoModal } = useTogglePBModal();

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

  const [phoneTooltipOpen, togglePhoneTooltip] = useTogglePhoneNumberTooltip(phoneno ?? "");

  const isVoucher = productIsVoucher(type);
  const isCityCard = type === PB_CARD_TYPE.CITY;
  const isTourCard = type === PB_CARD_TYPE.TOUR;
  const hideInfoButton = isCityCard || isTourCard || isExpired;
  return (
    <ProductCardContainer themeBorderColor={!isExpired}>
      <StyledProductCardActionHeader
        title={heading}
        Icon={HeadingIcon}
        onInformationClick={hideInfoButton ? undefined : openInfoModal}
        isExpiredOffer={false}
        grayOut={isExpired}
      />
      <StyledProductCardOverviewList
        grayOut={isExpired}
        imageUrl={image}
        quickFacts={quickfacts}
        title={title}
        iconColor={theme.colors.primary}
        namespace={Namespaces.postBookingNs}
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
        imageBackgroundColor="transparent"
      />
      {isExpired && <StyledProductCardFooterContainer grayOut />}
      {!isExpired && (
        <StyledProductCardFooterContainer grayOut={isExpired}>
          {phoneTooltipOpen && <PhoneTooltip phoneno={phoneno!} />}
          <PBProductCardButtons
            isTileCard={false}
            onBooking={bookingReference || isVoucher ? openBookingModal : undefined}
            ticket={ticket}
            onPhoneno={!isCityCard && phoneno ? togglePhoneTooltip : undefined}
            directionsUrl={!isCityCard ? openMapUrl : undefined}
            onStreetView={!isCityCard && coords && streetViewEnabled ? toggleStreetView : undefined}
          />
        </StyledProductCardFooterContainer>
      )}
      {modalType !== PB_ACTIVE_MODAL.NONE && (
        <PBItineraryModalManager
          productType={type}
          modalId={id}
          modalTitle={title}
          toggleModal={closeModals}
          bookingId={bookingId}
          orderId={orderId}
          googlePlaceId={googlePlaceId}
          tourId={tourId}
          modalType={modalType}
        />
      )}
      {streetViewModalOpen && coords?.lat && coords.lon && (
        <PBMapModal
          Icon={HeadingIcon}
          title={title}
          point={{ latitude: coords.lat, longitude: coords.lon }}
          closeModal={closeStreetView}
        />
      )}
    </ProductCardContainer>
  );
};
