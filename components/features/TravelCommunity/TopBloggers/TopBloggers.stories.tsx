import React from "react";
import IcelandFlag from "@travelshift/ui/icons/Flags/iceland-flag.svg";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import TopBloggerCard from "./TopBloggerCard";

const mockTopBlogger = {
  id: 123,
  name: "Anna Jónsdóttir",
  url: "/1234",
  image: {
    id: "351611",
    name: "pictures-of-snaefellsnes-peninsula-2.jpg",
    url:
      "https://guidetoiceland.imgix.net/189222/x/0/alongside-the-sun-voyager-perlan-dome-and-hallgrimskirkja-harpa-concert-hall-constitutes-one-of-the-city-s-most-recognisable-landmarks-17",
  },
  faceImage: {
    id: "351611",
    name: "pictures-of-snaefellsnes-peninsula-2.jpg",
    url:
      "https://guidetoiceland.imgix.net/350109/x/0/the-south-coast-of-iceland-4-jpg?auto=format%2Ccompress&ch=Width%2CDPR&dpr=1&ixlib=react-8.6.4&s=5e8bc04e33410cc45f3bf15d59296da6&fit=crop&h=240&w=540",
  },
  country: "Iceland",
  Icon: undefined,
  languages: ["en", "is"],
};

const mockTravelTopBlogger = {
  ...mockTopBlogger,
  Icon: IcelandFlag,
};

storiesOf(`Components/TopBloggers`, module)
  .addDecorator(WithContainer)
  .add("LocalBloggerCard", () => <TopBloggerCard cardInfo={mockTopBlogger} />)
  .add("TravelBloggerCard", () => (
    <TopBloggerCard cardInfo={mockTravelTopBlogger} />
  ));
