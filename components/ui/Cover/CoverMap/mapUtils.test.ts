import { constructMapCardQueryVariables } from "./mapUtils";

import { MapPointType, MAP_TYPE, Marketplace } from "types/enums";

const point: SharedTypes.MapPoint = {
  id: 10,
  latitude: 10,
  longitude: 10,
  type: MapPointType.ATTRACTION,
  isGoogleReview: false,
  reviewTotalCount: 0,
  reviewTotalScore: 0,
  title: "",
};

describe("constructMapCardQueryVariables", () => {
  describe("BAIDU maps query variables construction", () => {
    it("attraction card", () => {
      expect(
        constructMapCardQueryVariables(
          { ...point, orm_name: MapPointType.ATTRACTION },
          MAP_TYPE.BAIDU,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: true,
        isPostBooking: false,
        isTour: false,
      });
    });
    it("tour card", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            orm_name: MapPointType.TOUR,
          },
          MAP_TYPE.BAIDU,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: false,
        isPostBooking: false,
        isTour: true,
      });
    });
    it("should construct tour card based on orm_name for GOOGLE map and non-GTE marketplace", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            type: MapPointType.FALLBACK_POINT,
            orm_name: MapPointType.TOUR,
          },
          MAP_TYPE.GOOGLE,
          Marketplace.GUIDE_TO_ICELAND
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: false,
        isPostBooking: false,
        isTour: true,
      });
    });
    it("when bookingId is in the context", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            context: {
              bookingId: 100,
            },
            orm_name: MapPointType.TOUR,
          },
          MAP_TYPE.BAIDU,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: 100,
        id: 10,
        isAttraction: false,
        isPostBooking: true,
        isTour: false,
      });
    });
    it("unknown card", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            orm_name: "not-important",
            type: "not-important",
          },
          MAP_TYPE.BAIDU,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: false,
        isPostBooking: false,
        isTour: false,
      });
    });
  });

  describe("GOOGLE maps query variables construction", () => {
    it("attraction card", () => {
      expect(
        constructMapCardQueryVariables(
          { ...point, type: MapPointType.ATTRACTION },
          MAP_TYPE.GOOGLE,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: true,
        isPostBooking: false,
        isTour: false,
      });
    });
    it("tour card", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            type: MapPointType.TOUR,
            orm_name: "not-important",
          },
          MAP_TYPE.GOOGLE,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: false,
        isPostBooking: false,
        isTour: true,
      });
    });
    it("when bookingId is in the context", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            context: {
              bookingId: 10,
            },
            orm_name: MapPointType.TOUR,
          },
          MAP_TYPE.GOOGLE,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: 10,
        id: 10,
        isAttraction: false,
        isPostBooking: true,
        isTour: false,
      });
    });
    it("unknown card", () => {
      expect(
        constructMapCardQueryVariables(
          {
            ...point,
            orm_name: "not-important",
            type: "not-important",
          },
          MAP_TYPE.GOOGLE,
          Marketplace.GUIDE_TO_EUROPE
        )
      ).toEqual({
        bookingId: -1,
        id: 10,
        isAttraction: false,
        isPostBooking: false,
        isTour: false,
      });
    });
  });
});
