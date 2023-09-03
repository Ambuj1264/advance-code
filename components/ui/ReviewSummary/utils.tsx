export const getDefaultReviewCountTextTranslation = (
  t: TFunction,
  reviewTotalCount: number,
  isGoogleReview?: boolean
) => {
  return isGoogleReview
    ? t("{reviewTotalCount} Google reviews", {
        reviewTotalCount,
      })
    : `${reviewTotalCount} ${t("Verified reviews", {
        reviewTotalCount,
      })}`;
};
