import React from "react";
import { object, boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import WithContainer from "@stories/decorators/WithContainer";

import CoverGoogleMap from "components/ui/Cover/CoverMap/Google/CoverGoogleMap";
import MapCard from "components/ui/Cover/CoverMap/Google/MapCard";
import {
  mockMapPoints,
  mockMapTourPoint,
  mockMapHotelPoint,
  mockMapCarPoint,
  mockMapAttractionPoint,
  mockMapDestinationPoint,
} from "utils/mockData/mockGlobalData";

const heading = "Map";

storiesOf(`${heading}/Cover with map`, module)
  .addDecorator(WithContainer)
  .add(`Cover with streetview and direction buttons`, () => (
    <CoverGoogleMap
      map={object("map", {
        latitude: 64.143035888672,
        longitude: -21.912405014038,
        zoom: 10,
        location: "Laugavegur 128, Reykjavík, Iceland",
      })}
    />
  ))
  .add("With products/attractions/destionations points", () => (
    <CoverGoogleMap
      map={object("map", {
        latitude: 64.143035888672,
        longitude: -21.912405014038,
        zoom: 10,
        location: "Laugavegur 128, Reykjavík, Iceland",
        points: mockMapPoints,
      })}
    />
  ));


const getCommonProps = () => ({
  useAlternateInfobox:boolean("useAlternateInfobox",false),
  isStreetViewAvailable:boolean("isStreetViewAvailable", false),
  isStreetViewStatusLoading:boolean("isStreetViewStatusLoading",false),
  onClose:() => {console.log('onClose')}
})

storiesOf(`${heading}/Map Cards`, module)
  .addDecorator(WithContainer)
  .add("Tour Card", () => (
    <MapCard pointData={object("pointData", mockMapTourPoint)} {...getCommonProps()} />
  ))
  .add("Hotel Card", () => (
    <MapCard pointData={object("pointData", mockMapHotelPoint)} {...getCommonProps()}/>
  ))
  .add("Car Card", () => (
    <MapCard pointData={object("pointData", mockMapCarPoint)} {...getCommonProps()}/>
  ))
  .add("Attraction Card", () => (
    <MapCard pointData={object("pointData", mockMapAttractionPoint)} {...getCommonProps()}/>
  ))
  .add("Destination Card", () => (
    <MapCard pointData={object("pointData", mockMapDestinationPoint)} {...getCommonProps()}/>
  ));
