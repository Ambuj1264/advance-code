import { getPaginationRange } from "./paginatedContentUtils";

const mockProps = {
  currentPage: 1,
  totalPages: 50,
  pagesToShow: 3,
};

describe("paginatedContentUtils", () => {
  describe("getPaginationRange", () => {
    test("should return expected pagination range", () => {
      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 5,
        })
      ).toEqual({
        start: 4, // currentPage - 1
        end: 7, // start + pagesToShow
        dotsIndex: 7, // (totalPages - end) / 2 + end
      });

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 5,
          pagesToShow: 7,
        })
      ).toEqual({
        start: 1,
        end: 8,
        dotsIndex: 8,
      });
    });

    test("should handle start of the range", () => {
      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 1,
        })
      ).toEqual({
        start: 1,
        end: 4,
        dotsIndex: 4,
      });

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 2,
        })
      ).toEqual({
        start: 1,
        end: 4,
        dotsIndex: 4,
      });

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 3,
        })
      ).toEqual({
        start: 2,
        end: 5,
        dotsIndex: 5,
      });
    });

    test("should handle end of the range", () => {
      const expectedRangeEnd = {
        start: 47,
        end: 50,
        dotsIndex: -1,
      };

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 50,
        })
      ).toEqual(expectedRangeEnd);

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 49,
        })
      ).toEqual(expectedRangeEnd);

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 48,
        })
      ).toEqual(expectedRangeEnd);

      expect(
        getPaginationRange({
          ...mockProps,
          currentPage: 47,
        })
      ).toEqual({
        start: 46,
        end: 49,
        dotsIndex: 49,
      });
    });

    test("should handle totalPages lesser or equal then pagesToShow", () => {
      expect(
        getPaginationRange({
          currentPage: 1,
          totalPages: 1,
          pagesToShow: 3,
        })
      ).toEqual({
        start: 1,
        end: 1,
        dotsIndex: -1,
      });

      expect(
        getPaginationRange({
          currentPage: 1,
          totalPages: 2,
          pagesToShow: 3,
        })
      ).toEqual({
        start: 1,
        end: 2,
        dotsIndex: -1,
      });
    });
  });

  test("should handle no need to show dots when only 1 page to hide", () => {
    const expectedRangeEnd = {
      start: 1,
      end: 5,
      dotsIndex: -1,
    };

    expect(
      getPaginationRange({
        ...mockProps,
        totalPages: 5,
      })
    ).toEqual(expectedRangeEnd);

    expect(
      getPaginationRange({
        ...mockProps,
        totalPages: 5,
        currentPage: 3,
      })
    ).toEqual({
      start: 2,
      end: 5,
      dotsIndex: -1,
    });
  });
});
