import React from "react";

import Locale from "../../Locale";

import { mockUser0, mockUser1 } from "./mockUserData";

import ReviewStars from "components/ui/ReviewStars";
import { redColor } from "styles/variables";
import { ThemeColor } from "types/enums";
import { mockImage0, mockImage1 } from "utils/mockData/mockGlobalData";

export const mockText0 = "Amazing tour!";
export const mockText1 = "Amazing experience! Highly recommend!";

export const mockReviewScore0 = 1;
export const mockReviewScore1 = 2;
export const mockReviewScore2 = 3;
export const mockReviewScore3 = 4;
export const mockReviewScore4 = 5;

export const mockReviewScoreText0 = { text: "Bad", color: redColor };
export const mockReviewScoreText1 = { text: "Just okay", color: redColor };
export const mockReviewScoreText2 = {
  text: "Good!",
  color: ThemeColor.Action,
};
export const mockReviewScoreText3 = {
  text: "Great!",
  color: ThemeColor.Action,
};
export const mockReviewScoreText4 = {
  text: "Amazing!",
  color: ThemeColor.Action,
};

export const mockQueryCreatedDate0 = "2019-06-20 20:47:22";
export const mockQueryCreatedDate1 = "2019-07-10 10:46:50";

export const mockCreatedDate0 = "20/06/2019, 20:47";
export const mockCreatedDate1 = "10/07/2019, 10:46";

export const mockIsVerified0 = true;
export const mockIsVerified1 = false;

export const mockQueryReview0: QueryReview = {
  id: 0,
  text: mockText0,
  user: mockUser0,
  reviewScore: mockReviewScore2,
  createdDate: mockQueryCreatedDate0,
  isVerified: mockIsVerified0,
};
export const mockQueryReview1: QueryReview = {
  id: 1,
  text: mockText1,
  user: mockUser1,
  reviewScore: mockReviewScore4,
  createdDate: mockQueryCreatedDate1,
  isVerified: mockIsVerified1,
};

export const mockQueryReviews0: Array<QueryReview> = [mockQueryReview0, mockQueryReview1];

export const mockReview0: Review = {
  id: "0",
  text: mockText0,
  userName: mockUser0.name,
  userAvatarImage: mockImage0,
  reviewScore: mockReviewScore2,
  reviewScoreText: mockReviewScoreText2,
  createdDate: mockCreatedDate0,
  isVerified: mockIsVerified0,
};
export const mockReview1: Review = {
  id: "1",
  text: mockText1,
  userName: mockUser1.name,
  userAvatarImage: mockImage1,
  reviewScore: mockReviewScore4,
  reviewScoreText: mockReviewScoreText4,
  createdDate: mockCreatedDate1,
  isVerified: mockIsVerified1,
};

export const mockReviews0: Array<Review> = [mockReview0, mockReview1];

export const mockReviewsAllLocaleOption: SelectOption = {
  value: undefined,
  label: "All languages",
  nativeLabel: "All languages",
};

export const mockZhLocaleOption: SelectOption = {
  value: "zh_CN",
  label: <Locale localeCode="zh_CN" name="Chinese" />,
  nativeLabel: "Chinese",
};

export const mockFrLocaleOption: SelectOption = {
  value: "fr",
  label: <Locale localeCode="fr" name="French" />,
  nativeLabel: "French",
};

export const mockReviewsDeLocaleOption: SelectOption = {
  value: "de",
  label: <Locale localeCode="de" name="German" />,
  nativeLabel: "German",
};

export const mockReviewsItLocaleOption: SelectOption = {
  value: "it",
  label: <Locale localeCode="it" name="Italian" />,
  nativeLabel: "Italian",
};

export const mockReviewsJaLocaleOption: SelectOption = {
  value: "ja",
  label: <Locale localeCode="ja" name="Japanese" />,
  nativeLabel: "Japanese",
};

export const mockReviewsKoLocaleOption: SelectOption = {
  value: "ko",
  label: <Locale localeCode="ko" name="Korean" />,
  nativeLabel: "Korean",
};

export const mockReviewsPlLocaleOption: SelectOption = {
  value: "pl",
  label: <Locale localeCode="pl" name="Polish" />,
  nativeLabel: "Polish",
};

export const mockReviewsRuLocaleOption: SelectOption = {
  value: "ru",
  label: <Locale localeCode="ru" name="Russian" />,
  nativeLabel: "Russian",
};

export const mockReviewsEsLocaleOption: SelectOption = {
  value: "es",
  label: <Locale localeCode="es" name="Spanish" />,
  nativeLabel: "Spanish",
};

export const mockReviewsThLocaleOption: SelectOption = {
  value: "th",
  label: <Locale localeCode="th" name="Thai" />,
  nativeLabel: "Thai",
};

export const mockReviewsEnLocaleOption: SelectOption = {
  value: "en",
  label: <Locale localeCode="en" name="English" />,
  nativeLabel: "English",
};

export const mockReviewsLocaleOptions: Array<SelectOption> = [
  mockReviewsAllLocaleOption,
  mockZhLocaleOption,
  mockFrLocaleOption,
  mockReviewsDeLocaleOption,
  mockReviewsItLocaleOption,
  mockReviewsJaLocaleOption,
  mockReviewsKoLocaleOption,
  mockReviewsPlLocaleOption,
  mockReviewsRuLocaleOption,
  mockReviewsEsLocaleOption,
  mockReviewsThLocaleOption,
  mockReviewsEnLocaleOption,
];

export const mockReviewsScoreOptions: Array<SelectOption> = [
  { value: undefined, label: "All ratings", nativeLabel: "All ratings" },
  { value: "5", label: <ReviewStars reviewScore={5} /> },
  { value: "4", label: <ReviewStars reviewScore={4} /> },
  { value: "3", label: <ReviewStars reviewScore={3} /> },
  { value: "2", label: <ReviewStars reviewScore={2} /> },
  { value: "1", label: <ReviewStars reviewScore={1} /> },
];
