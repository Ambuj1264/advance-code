import React from "react";
import styled from "@emotion/styled";

import BookingHeadingWidget from "components/ui/ArticleLayout/BookingHeadingWidget";
import { gutters } from "styles/variables";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ContentReviewSummary, {
  ReviewSummaryScoreStyled,
} from "components/ui/ArticleLayout/ContentReviewSummary";
import { getDefaultReviewCountTextTranslation } from "components/ui/ReviewSummary/utils";

const BookButtonWrapper = styled.div`
  :not(:only-child) {
    margin-top: ${gutters.small}px;
  }
  a {
    min-width: 100%;
  }
`;

const StyledContentReviewSummary = styled(ContentReviewSummary)`
  ${ReviewSummaryScoreStyled} {
    margin-left: 0;
  }
`;

const getBookingWidgetContent = (
  attraction: ArticleLayoutTypes.Attraction
):
  | {
      bookUrl: string;
      widgetText: any;
    }
  | undefined => {
  if (attraction.toursSearchUrl) {
    return {
      bookUrl: attraction.toursSearchUrl,
      widgetText: (
        <Trans
          ns={Namespaces.commonNs}
          i18nKey="See tours around {attraction}"
          defaults="See related trips"
          values={{ attraction: attraction.name }}
        />
      ),
    };
  }

  if (attraction.hotelsSearchUrl) {
    return {
      bookUrl: attraction.hotelsSearchUrl,
      widgetText: <Trans>See related stays</Trans>,
    };
  }

  if (attraction.carsSearchUrl) {
    return {
      bookUrl: attraction.carsSearchUrl,
      widgetText: <Trans>See related cars</Trans>,
    };
  }

  return undefined;
};

const AttractionLeftColumnContent = ({
  attraction,
}: {
  attraction: ArticleLayoutTypes.Attraction;
}) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);

  const bookingWidgetContent = getBookingWidgetContent(attraction);

  return (
    <>
      {attraction.reviewTotalScore && attraction.reviewTotalCount ? (
        <StyledContentReviewSummary
          reviewTotalScore={attraction.reviewTotalScore}
          reviewTotalCount={attraction.reviewTotalCount}
          reviewsCountText={getDefaultReviewCountTextTranslation(
            commonT,
            attraction.reviewTotalCount,
            attraction.isGoogleReview
          )}
        />
      ) : null}
      {bookingWidgetContent ? (
        <BookButtonWrapper>
          <BookingHeadingWidget bookUrl={bookingWidgetContent.bookUrl}>
            {bookingWidgetContent.widgetText}
          </BookingHeadingWidget>
        </BookButtonWrapper>
      ) : null}
    </>
  );
};

export default AttractionLeftColumnContent;
