import { CategoryModelType, getCategoryModel } from "./categoryModel";
import { EndingLocationModelType, getEndingLocationModel } from "./endingLocationModel";
import { SpecModelType, getSpecModel } from "./specModel";
import { StartingLocationModelType, getStartingLocationModelType } from "./startingLocationModel";
import { ValuePropModelType, getValuePropModel } from "./valuePropModel";
import { WhatToBringItemModelType, getWhatToBringItemModel } from "./whatToBringItemModel";

export type TourModelType = {
  id: number;
  tourId: number;
  linkUrl: string;
  category: CategoryModelType;
  type: string;
  adults: number;
  teenagers: number;
  children: number;
  departureInformation?: string;
  discountAmount: number;
  discountPercentage: number;
  extras: any[];
  valueProps: ValuePropModelType[];
  specs: SpecModelType[];
  durationSec: number;
  durationText: string;
  title: string;
  cartItemId: string;
  totalPrice: number;
  imageUrl: string;
  available: boolean;
  editable: boolean;
  from: string;
  to: string;
  updated: string;
  createdTime: string;
  advancedNoticeSec: number;
  whatToBringItems: WhatToBringItemModelType[];
  pickup: string;
  pickupLocation?: any;
  startingLocation: StartingLocationModelType;
  endingLocation: EndingLocationModelType;
  __typename: string;
};

export const getTourModel = (title?: string, totalPrice?: number): TourModelType => ({
  id: 820,
  tourId: 820,
  departureInformation: "Please bring your voucher to the ticket desk for entry.",
  linkUrl: "/book-holiday-trips/glacier-caving-in-vatnajokull",
  category: getCategoryModel(),
  type: "Day tours",
  adults: 1,
  teenagers: 0,
  children: 0,
  discountAmount: 0,
  discountPercentage: 0,
  extras: [],
  valueProps: [getValuePropModel()],
  specs: [getSpecModel()],
  durationSec: 10800,
  durationText: "3 hours",
  title: title ?? "Test Best Ice Cave Tour Lagoon",
  cartItemId: "tours-1",
  totalPrice: totalPrice ?? 19900,
  imageUrl:
    "https://guidetoiceland.imgix.net/526962/x/0/ice-cave-breidamerkurjokull-2019-2.jpg?crop=faces&fit=crop&h=239&ixlib=php-3.3.0&w=239",
  available: true,
  editable: true,
  from: "2022-11-24T11:30:00.000Z",
  to: "2022-11-24T14:30:00.000Z",
  updated: "2021-11-24T09:00:34.000Z",
  createdTime: "2021-11-24T09:00:34.000Z",
  advancedNoticeSec: 0,
  whatToBringItems: [getWhatToBringItemModel()],
  pickup: "NO_PICKUP",
  pickupLocation: null,
  startingLocation: getStartingLocationModelType(),
  endingLocation: getEndingLocationModel(),
  __typename: "OrderTourCartInfo",
});
