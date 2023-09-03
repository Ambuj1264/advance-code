import React, { useCallback } from "react";
import styled from "@emotion/styled";

import Section from "components/ui/Section/Section";
import PaginatedContent from "components/ui/PaginatedContent/PaginatedContent";
import ReviewsGrid from "components/features/Reviews/ReviewsGrid";
import SectionHeading from "components/ui/Section/SectionHeading";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledReviewSection = styled(Section)`
  margin-right: auto;
  margin-left: auto;
  max-width: 1024px;
`;

const ReviewsSection = ({
  pagesToShow = 3,
  reviews,
  onPageChange,
  reviewPage,
  totalPages,
  isLoading,
}: {
  onPageChange: (current: number) => void;
  pagesToShow?: number;
  reviews: ReadonlyArray<Review>;
  reviewPage: number;
  totalPages: number;
  isLoading: boolean;
}) => {
  const numberOfLinesInText = 4;
  const reviewPageQueryParam = "reviewPage";

  const pageChangeHandler = useCallback(
    ({ current }) => {
      onPageChange(current);
    },
    [onPageChange]
  );

  return (
    <StyledReviewSection>
      <SectionHeading>
        <Trans ns={Namespaces.commonSearchNs}>Verified customer reviews</Trans>
      </SectionHeading>
      <SectionSubHeading>
        <Trans ns={Namespaces.commonSearchNs}>
          Read first hand reviews by customers from across the world
        </Trans>
      </SectionSubHeading>

      <PaginatedContent
        name={reviewPageQueryParam}
        isLoading={false}
        initialPage={reviewPage}
        totalPages={totalPages}
        pagesToShow={pagesToShow}
        onPageChange={pageChangeHandler}
        runPageChangeOnMount={false}
      >
        <ReviewsGrid
          reviews={reviews}
          numberOfLinesInText={numberOfLinesInText}
          isLoading={isLoading}
        />
      </PaginatedContent>
    </StyledReviewSection>
  );
};

export default ReviewsSection;
