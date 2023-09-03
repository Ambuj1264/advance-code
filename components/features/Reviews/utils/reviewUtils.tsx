import { parseISO } from "date-fns";

import { redColor } from "styles/variables";
import { SupportedLanguages, ThemeColor } from "types/enums";
import { constructImage } from "utils/globalUtils";
import { dayMonthYearWithTimeFormat, getFormattedDate } from "utils/dateUtils";
import { removeDuplicates } from "utils/helperUtils";

export const constructReviewScoreText = (reviewScore: number): ReviewScoreText => {
  if (reviewScore === 1) return { text: "Bad", color: redColor };
  if (reviewScore === 2) return { text: "Just okay", color: redColor };
  if (reviewScore === 3) return { text: "Good!", color: ThemeColor.Action };
  if (reviewScore === 4) return { text: "Great!", color: ThemeColor.Action };
  return { text: "Amazing!", color: ThemeColor.Action };
};

export const constructReviews = (
  reviews?: ReadonlyArray<QueryReview>,
  imageHostingUrl?: string,
  excludeLink?: boolean
) => {
  return reviews
    ? reviews.map((review: QueryReview) => ({
        id: review.id.toString(),
        text: review.text,
        userName: review.user.name,
        userAvatarImage: review.user.avatarImage
          ? constructImage(review.user.avatarImage)
          : undefined,
        reviewScore: review.reviewScore,
        reviewScoreText: constructReviewScoreText(review.reviewScore),
        itemName: review.itemName,
        itemUrl: excludeLink ? undefined : review.itemUrl,
        createdDate: getFormattedDate(parseISO(review.createdDate), dayMonthYearWithTimeFormat),
        isVerified: review.isVerified,
        itemImageUrl:
          imageHostingUrl && review?.itemImageId
            ? `${imageHostingUrl}/${review.itemImageId}`
            : undefined,
      }))
    : [];
};

export const shouldShowSeeMoreReviewsButton = ({
  stateReviewsLength,
  reviewTotalCount,
  responseReviewsLength,
  limit,
  showEmptyReviewsMessage,
}: {
  stateReviewsLength: number;
  reviewTotalCount: number;
  responseReviewsLength: number;
  limit: number;
  showEmptyReviewsMessage: boolean;
}) => {
  if (showEmptyReviewsMessage) return false;
  return (
    stateReviewsLength !== reviewTotalCount &&
    responseReviewsLength !== 0 &&
    responseReviewsLength === limit
  );
};

export const shouldShowEmptyReviewsMessage = (reviewsLength: number, reviewsLoading: boolean) =>
  reviewsLength === 0 && !reviewsLoading;

export const getReviewsView = (
  stateReviews: Review[],
  responseReviews: ReadonlyArray<QueryReview>,
  reviewsLoading: boolean,
  limit: number,
  reviewTotalCount: number
) => {
  const showEmptyReviewsMessage = shouldShowEmptyReviewsMessage(
    responseReviews.length,
    reviewsLoading
  );
  const showSeeMoreReviewsButton = shouldShowSeeMoreReviewsButton({
    stateReviewsLength: stateReviews.length,
    responseReviewsLength: responseReviews.length,
    limit,
    reviewTotalCount,
    showEmptyReviewsMessage,
  });
  return {
    showSeeMoreReviewsButton,
    showEmptyReviewsMessage,
  };
};

export const filterReviewLocales = (locales: QueryLocale[], localeOptions: string[]) =>
  locales.filter((locale: QueryLocale) => localeOptions.find(option => option === locale.code));

export const constructLocaleOptions = (
  dataLocales: string,
  activeLocale: SupportedLanguages
): SupportedLanguages[] => {
  const dataLocaleOptions = dataLocales.split("|").filter(Boolean) as SupportedLanguages[];

  return dataLocaleOptions.includes(activeLocale)
    ? dataLocaleOptions
    : [activeLocale, ...dataLocaleOptions];
};

export const constructUpdatedUniqueReviews = ({
  dataReviews,
  stateReviews,
  currentPage,
  keyToFilterReviewsBy,
}: {
  dataReviews: ReadonlyArray<QueryReview>;
  stateReviews: Review[];
  currentPage: number;
  keyToFilterReviewsBy?: string;
}): Review[] => {
  const reviews = constructReviews(dataReviews);

  const updatedReviews = currentPage > 1 ? stateReviews.concat(reviews) : reviews;
  const uniqueReviews = removeDuplicates(
    updatedReviews as unknown as GenericObject[],
    keyToFilterReviewsBy ?? "id"
  ) as unknown as Review[];

  return uniqueReviews;
};

export const getFirstLetter = (name?: string) => {
  if (!name) return undefined;
  const letter = name.charAt(0);
  return letter.toUpperCase();
};
