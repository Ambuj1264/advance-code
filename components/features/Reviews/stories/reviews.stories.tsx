/* eslint-disable import/no-unresolved */
import React from "react";
import { text, number, boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import Review from "../Review";
import EmptyReviews from "../EmptyReviews";
import ReviewsLoading from "../ReviewsLoading";

import Locale from "components/features/Reviews/Locale";

const heading = "Reviews";

const getReviewProps = () => ({
  id: "25355",
  text: text(
    "text",
    "What a great experience ! I have been dreaming of Iceland for long and this trip was really important to me. Wonderfull organization, magic country and great people. Unforgettable trip, will come back for sure and will contact and promote Guide of Iceland."
  ),
  userAvatarImage: {
    id: "535257",
    url: "https://guidetoiceland.imgix.net/535257/x/0/1-is.jpg",
  },
  userName: "sandra",
  reviewScore: number("reviewScore", 5),
  reviewScoreText: { text: "Amazing!", color: "action" },
  createdDate: text("createdDate", "07/02/2020, 18:37"),
  isVerified: boolean("isVerified", true),
  isCompact: false,
});

storiesOf(`${heading}/Locale`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <Locale
      localeCode={text("localeCode", "en")}
      name={text("name", "English")}
    />
  ));

storiesOf(`${heading}/Review`, module)
  .addDecorator(WithContainer)
  .add("Review", () => <Review {...getReviewProps()} />)
  .add("Compact Review", () => (
    <Review {...getReviewProps()} isCompact={boolean("isCompact", true)} />
  ))
  .add("Review With Link", () => (
    <Review
      {...getReviewProps()}
      isCompact={boolean("isCompact", true)}
      itemName="Guide To Iceland"
      itemUrl="https://google.com"
    />
  ))
  .add("Review With Fixed Height", () => (
    <Review {...getReviewProps()} numberOfLinesInText={4} />
  ));

storiesOf(`${heading}/Review`, module)
  .addDecorator(WithContainer)
  .add("EmptyReviews", () => <EmptyReviews clearFilters={() => {}} href="" />);

storiesOf(`${heading}/Review`, module)
  .addDecorator(WithContainer)
  .add("ReviewsLoading", () => <ReviewsLoading />);
