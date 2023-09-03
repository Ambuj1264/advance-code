/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import React from "react";
import { object, text, boolean, number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import {
  mockName0,
  mockImage0,
  mockParagraphText0,
  mockProductSpecs0,
  mockProductProps0,
  getMockNameRandom,
} from "utils/mockData/mockGlobalData";
import styled from "@emotion/styled";
import { column } from "styles/base";
import WithContainer from "@stories/decorators/WithContainer";
import TileProductCard from "components/ui/Search/TileProductCard";
import TileItemCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import ListProductCard from "components/ui/Search/ListProductCard";
import ListItemCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import ProductFeaturesList from "components/ui/Search/ProductFeaturesList";
import LoadingBar from "components/ui/Search/LoadingBar";
import Row from "components/ui/Grid/Row";
import TilePlaceCard from "../TilePlaceCard";
import TilePlaceCardSkeleton from "../TilePlaceCardSkeleton";
import AttractionIcon from "components/icons/camera-1.svg";
import { attractionColor, blueColor } from "styles/variables";
import ListPlaceCard from "../ListPlaceCard";
import ListPlaceCardSkeleton from "../ListPlaceCardSkeleton";

const heading = "Search";

// use closure to allow knobs editing in storybook
const createItemCardProps = () => ({
  id: 1,
  namespace: "",
  image: object("image", mockImage0),
  headline: text("headline", mockName0),
  description: text("description", mockParagraphText0),
  linkUrl: text("linkUrl", "https://guidetoiceland.is/"),
  productLabel: text("discountLabelText", "10% discount"),
  averageRating: number("averageRating", 4.5),
  reviewsCount: number("reviewsCount", 999),
  ribbonLabelText: text("ribbonLabelText", "Recommended"),
  productSpecs: object("specs", mockProductSpecs0),
  productProps: object("props", mockProductProps0),
  price: number("price", 199),
  currency: text("currency", "EUR"),
  isMobile: boolean("isMobile", false),
});

storiesOf(`${heading}/ProductCard`, module)
  .addDecorator(WithContainer)
  .add(
    "ProductCard Tile view grid",
    () => {
      const ItemCardColumn = styled.div([column({ small: 1 / 3 })]);

      return (
        <>
          <br />
          <Row>
            <ItemCardColumn>
              <TileProductCard {...createItemCardProps()} />
            </ItemCardColumn>
            <ItemCardColumn>
              <TileProductCard {...createItemCardProps()} />
            </ItemCardColumn>
            <ItemCardColumn>
              <TileProductCard {...createItemCardProps()} />
            </ItemCardColumn>
          </Row>
        </>
      );
    },
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add("ProductCard Tile view single", () => {
    return (
      <>
        <br />
        <TileProductCard {...createItemCardProps()} />
      </>
    );
  })
  .add("ProductCard Skeleton for Tile view", () => {
    return (
      <>
        <br />
        <TileItemCardSkeleton />
      </>
    );
  })
  .add(
    "ProductCard List view",
    () => (
      <>
        <br />
        <ListProductCard {...createItemCardProps()} />
      </>
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add(
    "ProductCard Skeleton for List view",
    () => (
      <>
        <br />
        <ListItemCardSkeleton />
      </>
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  );

const createPlaceCardProps = () => ({
  id: 1,
  image: object("image", mockImage0),
  headline: text("headline", getMockNameRandom()),
  address: text("address", "Hallgrímstorg 1"),
  description: text("description", mockParagraphText0),
  linkUrl: text("linkUrl", "https://guidetoiceland.is/"),
  averageRating: number("averageRating", 4.5),
  reviewsCount: number("reviewsCount", 999),
  ribbonLabelText: text("ribbonLabelText", "Recommended"),
  isMobile: boolean("isMobile", false),
  TopRightIcon: AttractionIcon,
  topRightBackground: attractionColor,
});

storiesOf(`${heading}/PlaceCard`, module)
  .addDecorator(WithContainer)
  .add(
    "PlaceCard Tile view grid",
    () => {
      const ItemCardColumn = styled.div([column({ small: 1 / 3 })]);

      return (
        <>
          <br />
          <Row>
            <ItemCardColumn>
              <TilePlaceCard
                {...createPlaceCardProps()}
                {...{ headline: getMockNameRandom() }} // hack for storybook random property 🤷‍
              />
            </ItemCardColumn>
            <ItemCardColumn>
              <TilePlaceCard
                {...createPlaceCardProps()}
                {...{ headline: getMockNameRandom() }}
                {...{ topRightBackground: blueColor }}
              />
            </ItemCardColumn>
            <ItemCardColumn>
              <TilePlaceCard
                {...createPlaceCardProps()}
                {...{ headline: getMockNameRandom() }}
              />
            </ItemCardColumn>
          </Row>
        </>
      );
    },
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add("PlaceCard Tile view single", () => {
    return (
      <>
        <br />
        <TilePlaceCard {...createPlaceCardProps()} />
      </>
    );
  })
  .add("PlaceCard Skeleton for Tile view", () => {
    return (
      <>
        <br />
        <TilePlaceCardSkeleton />
      </>
    );
  })
  .add(
    "PlaceCard List view",
    () => (
      <>
        <br />
        <ListPlaceCard {...createPlaceCardProps()} />
      </>
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  )
  .add(
    "PlaceCard Skeleton for List view",
    () => (
      <>
        <br />
        <ListPlaceCardSkeleton />
      </>
    ),
    {
      viewport: {
        defaultViewport: "responsive",
      },
    }
  );

storiesOf(`${heading}/ProductFeaturesList`, module)
  .addDecorator(WithContainer)
  .add("default", () => (
    <ProductFeaturesList
      productProps={object("productProps", mockProductProps0)}
    />
  ));

storiesOf(`${heading}/LoadingBar`, module)
  .addDecorator(WithContainer)
  .add("default", () => <LoadingBar />);
