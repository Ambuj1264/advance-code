/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import React from "react";
import { object, text, boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import {
  mockName0,
  mockImage0,
  mockImages0,
  mockParagraphText0,
} from "utils/mockData/mockGlobalData";
import WithDarkBackground from "@stories/decorators/WithDarkBackground";
import WithContainer from "@stories/decorators/WithContainer";
import ItemCard from "components/ui/ContentTemplates/ItemCard/ItemCard";
import ItineraryExpandButton from "components/features/Tour/ItineraryItem/ItineraryMoreInformation/ItineraryExpandButton";
import ImageCarousel from "components/ui/ImageCarousel/ImageCarousel";
import ItineraryItem from "components/features/Tour/ItineraryItem/ItineraryItem";

const heading = "Tour";

storiesOf(`${heading}/ImageCarousel`, module).add("default", () => (
  <div style={{ height: "360px" }}>
    <ImageCarousel
      id=""
      imageUrls={object("imageUrls", mockImages0)}
      showThumbnails={boolean("showThumbnails", true)}
      showArrows={boolean("showArrows", true)}
      sizes="100vw"
    />
  </div>
));

storiesOf(`${heading}/ItemCard`, module)
  .addDecorator(WithContainer)
  .addDecorator(WithDarkBackground)
  .add("ItemCard", () => (
    <ItemCard
      id=""
      name={text("name", mockName0)}
      images={object("images", mockImages0)}
    >
      <div>{text("information", mockParagraphText0)}</div>
    </ItemCard>
  ));

storiesOf(`${heading}/ItineraryItem`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ItineraryItem
      itineraryItem={object("itineraryItem", {
        id: "0",
        title: mockName0,
        name: mockName0,
        information: mockParagraphText0,
        image: mockImage0,
      })}
      slug=""
    />
  ));

storiesOf(`${heading}/ItineraryExpandButton`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ItineraryExpandButton id="" title="Day 1">
      Foo
    </ItineraryExpandButton>
  ));
