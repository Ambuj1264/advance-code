import React, { ElementType } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";
import { useTranslation } from "react-i18next";

import { PostBookingTypes } from "../types/postBookingTypes";

import { StyledBookingIcon, StyledTravelplanIcon } from "./PBProductCardShared";
import {
  StyledProductCardActionHeader,
  StyledProductCardFooterContainer,
  StyledProductCardOverviewList,
} from "./PBSharedComponents";

import {
  ProductCardActionButton,
  ProductCardActionButtonsWrapper,
} from "components/ui/ProductCard/ProductCardActionButton";
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
import { mqMax, mqMin } from "styles/base";
import ReviewSummary, {
  ReviewSummaryCountStyled,
  ReviewSummaryScoreStyled,
} from "components/ui/ReviewSummary/ReviewSummaryWhite";
import { Leaf } from "components/ui/ReviewSummary/ReviewSummaryScore";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";

const StyledReview = styled(ReviewSummary)`
  position: absolute;

  ${mqMax.medium} {
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

  ${mqMin.medium} {
    top: ${gutters.large / 2 + 24}px;
    right: ${gutters.large / 2}px;
  }
`;

export const PBProductReservationCard = ({
  rating,
  reviewsCount,
  heading,
  title,
  isExpired,
  image,
  quickfacts,
  HeadingIcon,
  className,
  travelplanClientRoute,
  reservationsClientRoute,
}: PostBookingTypes.ProductCard & {
  HeadingIcon: ElementType;
  travelplanClientRoute?: SharedTypes.ClientRoute;
  reservationsClientRoute?: SharedTypes.ClientRoute;
  className?: string;
}) => {
  const theme: Theme = useTheme();
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);
  const hasReview = Boolean(rating && reviewsCount);

  return (
    <ProductCardContainer themeBorderColor={!isExpired} className={className}>
      <StyledProductCardActionHeader
        grayOut={isExpired}
        title={heading}
        Icon={HeadingIcon}
        isExpiredOffer={false}
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
      />
      <StyledProductCardFooterContainer grayOut={isExpired}>
        <ProductCardActionButtonsWrapper
          isTileCard={false}
          isSingleButton={reservationsClientRoute === undefined}
        >
          {!isExpired && (
            <ProductCardActionButton
              Icon={StyledTravelplanIcon}
              title={postbookingT("Travel plan")}
              displayType="primary"
              clientRoute={travelplanClientRoute}
            />
          )}

          {reservationsClientRoute && (
            <ProductCardActionButton
              Icon={StyledBookingIcon}
              displayType="secondary"
              title={postbookingT("Reservations")}
              clientRoute={reservationsClientRoute}
            />
          )}
        </ProductCardActionButtonsWrapper>
      </StyledProductCardFooterContainer>
    </ProductCardContainer>
  );
};
