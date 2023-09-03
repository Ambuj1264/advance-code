import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import LocalesDropdown from "./LocalesDropdown";

import ReviewStars from "components/ui/ReviewStars";
import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import LazyImage from "components/ui/Lazy/LazyImage";
import Row from "components/ui/Grid/Row";
import { gutters, borderRadius } from "styles/variables";
import { mqMin, mqMax, column } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ReviewSummaryNoLeafs from "components/ui/ReviewSummary/ReviewSummaryNoLeafs";
import { SupportedLanguages } from "types/enums";

type Props = {
  reviewTotalScore: number;
  reviewTotalCount: number;
  localeFilter: string;
  scoreFilter: string;
  changeReviewsLocaleFilter: (reviewsLocaleFilter: string) => void;
  changeReviewsScoreFilter: (reviewsScoreFilter: string) => void;
  localeOptions: SupportedLanguages[];
  reviewsLogo?: Image;
  disableRatingFilter?: boolean;
  hideTotalRatings?: boolean;
};

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

const SummaryColumn = styled.div([
  column({ small: 1, medium: 1 / 3, desktop: 1 / 2 }),
  css`
    display: flex;
    align-items: center;
    ${mqMax.medium} {
      justify-content: space-between;
    }
  `,
]);

const FilterColumn = styled.div([
  column({ small: 1 / 2, medium: 1 / 3, desktop: 1 / 4 }),
  css`
    margin-top: ${gutters.small / 2}px;
    ${mqMin.large} {
      margin-top: 0;
    }
  `,
]);

const ReviewsHeaderImage = styled.div`
  flex-shrink: 0;
  margin-left: ${gutters.large}px;
  border-radius: ${borderRadius};
  max-width: 80px;
  height: 44px;
  overflow: hidden;
`;

const ReviewsHeader = ({
  reviewTotalScore,
  reviewTotalCount,
  changeReviewsLocaleFilter,
  changeReviewsScoreFilter,
  localeFilter,
  scoreFilter,
  localeOptions,
  reviewsLogo,
  disableRatingFilter = false,
  hideTotalRatings = false,
}: Props) => {
  const { t } = useTranslation();
  const { t: reviewsT } = useTranslation(Namespaces.reviewsNs);
  const reviewScoreOptions = [
    {
      value: "",
      label: reviewsT("All ratings"),
      nativeLabel: reviewsT("All ratings"),
    },
    { value: "5", label: <ReviewStars reviewScore={5} />, nativeLabel: "5" },
    { value: "4", label: <ReviewStars reviewScore={4} />, nativeLabel: "4" },
    { value: "3", label: <ReviewStars reviewScore={3} />, nativeLabel: "3" },
    { value: "2", label: <ReviewStars reviewScore={2} />, nativeLabel: "2" },
    { value: "1", label: <ReviewStars reviewScore={1} />, nativeLabel: "1" },
  ];
  return (
    <StyledRow>
      <SummaryColumn>
        {!hideTotalRatings && (
          <>
            <ReviewSummaryNoLeafs
              reviewText={t("{reviewTotalCount} reviews", { reviewTotalCount })}
              reviewTotalScore={reviewTotalScore}
            />
            {reviewsLogo && (
              <ReviewsHeaderImage>
                <LazyImage
                  src={reviewsLogo.url}
                  imgixParams={{ fit: "clamp" }}
                  width={44}
                  height={44}
                  alt={reviewsLogo.name}
                />
              </ReviewsHeaderImage>
            )}
          </>
        )}
      </SummaryColumn>
      <FilterColumn>
        <LocalesDropdown
          onChange={changeReviewsLocaleFilter}
          selectedValue={localeFilter}
          localeOptions={localeOptions}
        />
      </FilterColumn>
      {!disableRatingFilter && (
        <FilterColumn>
          <BaseDropdown
            id="reviewRatingFilterDropdown"
            onChange={changeReviewsScoreFilter}
            options={reviewScoreOptions}
            defaultValue={reviewScoreOptions[0]}
            selectedValue={scoreFilter}
            maxHeight="205px"
          />
        </FilterColumn>
      )}
    </StyledRow>
  );
};

export default ReviewsHeader;
