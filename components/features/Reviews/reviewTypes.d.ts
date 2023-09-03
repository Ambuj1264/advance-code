type QueryReviewMeta = Readonly<{
  locales: string;
  pages: number;
}>;

type QueryReview = Readonly<{
  id: number;
  text: string;
  user: QueryUser;
  reviewScore: number;
  createdDate: string;
  isVerified: boolean;
  itemName?: string;
  itemUrl?: string;
  itemImageId?: string;
}>;

type QueryReviewData = Readonly<{
  reviews: {
    meta: QueryReviewMeta;
    reviews?: QueryReview[];
  };
}>;

type QueryLocale = {
  code: string;
  name: string;
};

type QueryLocalesData = {
  locales: QueryLocale[];
};

type ReviewScoreText = Readonly<{
  text: string;
  color: Color;
}>;

type ReviewOwnerResponse = {
  text: string;
  userName: string;
  userAvatarImage?: Image;
  createdDate: string;
};

type Review = Readonly<{
  id: string;
  text: string;
  userName: string;
  userAvatarImage?: Image;
  reviewScore: number;
  reviewScoreText: ReviewScoreText;
  itemName?: string;
  itemUrl?: string;
  createdDate: string;
  isVerified: boolean;
  itemImageUrl?: string;
  helpfulVotes?: number;
  ownerResponse?: ReviewOwnerResponse;
}>;

type QueryReviewPaginatedData = Readonly<{
  meta: MetaPaginated;
  reviews?: QueryReview[];
}>;

type MetaPaginated = {
  page: number;
  pages: number;
  per_page: number;
  total_count: number;
};
