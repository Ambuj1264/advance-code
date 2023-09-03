import {
  processTableOfContents,
  extractTOCWidget,
  extractOnlyLastWideBottomWidget,
  filterWideBottomWidget,
  processWidget,
  processListOfTours,
  processListOfHotels,
  processListOfCars,
} from "../articleLayoutUtils";
import {
  mockQueryTour,
  mockQueryTourSpec,
  mockQueryTourProc,
  mockQueryData,
} from "../mockContentData";

const mockMandatoryOptions = {
  commonCarNsT: jest.fn(),
  commonNsT: jest.fn(),
  quickFactsNsT: jest.fn(),
};

describe("processTableOfContents", () => {
  const type = "tableOfContents";
  const testCases = [
    {
      title: "First level",
      tableOfContentsList: [
        {
          value: "abc",
          level: "0",
          link: "",
          firstImageUrl:
            "https://guidetoiceland.imgix.net/5263/x/0/geothermal-areas-beautiful-steamy-smelly-spots-13",
        },
        {
          value: "def",
          level: "0",
          link: "",
          firstImageUrl:
            "https://guidetoiceland.imgix.net/5263/x/0/geothermal-areas-beautiful-steamy-smelly-spots-13",
        },
      ],
      resultItems: [
        {
          caption: "abc",
          level: 0,
          link: "",
          prefix: "1.",
          imgUrl:
            "https://guidetoiceland.imgix.net/5263/x/0/geothermal-areas-beautiful-steamy-smelly-spots-13",
        },
        {
          caption: "def",
          level: 0,
          link: "",
          prefix: "2.",
          imgUrl:
            "https://guidetoiceland.imgix.net/5263/x/0/geothermal-areas-beautiful-steamy-smelly-spots-13",
        },
      ],
    },
    {
      title: "Second level",
      tableOfContentsList: [
        { value: "abc", level: "1", link: "", firstImageUrl: "fake-url" },
        { value: "def", level: "1", link: "", firstImageUrl: "fake-url" },
      ],
      resultItems: [
        { caption: "abc", level: 1, link: "", prefix: "", imgUrl: "fake-url" },
        { caption: "def", level: 1, link: "", prefix: "", imgUrl: "fake-url" },
      ],
    },
    {
      title: "Nested",
      tableOfContentsList: [
        { value: "abc", level: "0", link: "", firstImageUrl: "" },
        { value: "abc.abc", level: "1", link: "", firstImageUrl: "" },
        { value: "abc.def", level: "1", link: "", firstImageUrl: "" },
        { value: "def", level: "0", link: "", firstImageUrl: "" },
        { value: "def.abc", level: "1", link: "", firstImageUrl: "" },
        { value: "def.def", level: "1", link: "", firstImageUrl: "" },
      ],
      resultItems: [
        { caption: "abc", level: 0, link: "", prefix: "1.", imgUrl: "" },
        { caption: "abc.abc", level: 1, link: "", prefix: "1.1", imgUrl: "" },
        { caption: "abc.def", level: 1, link: "", prefix: "1.2", imgUrl: "" },
        { caption: "def", level: 0, link: "", prefix: "2.", imgUrl: "" },
        { caption: "def.abc", level: 1, link: "", prefix: "2.1", imgUrl: "" },
        { caption: "def.def", level: 1, link: "", prefix: "2.2", imgUrl: "" },
      ],
    },
    {
      title: "Destroy current prefixes",
      tableOfContentsList: [
        { value: " 1 .  abc", level: "0", link: "", firstImageUrl: "" },
        { value: " 2)abc", level: "0", link: "", firstImageUrl: "" },
        { value: "31)  abc", level: "0", link: "", firstImageUrl: "" },
        { value: "3.1  abc", level: "0", link: "", firstImageUrl: "" },
        { value: "3.1.abc", level: "0", link: "", firstImageUrl: "" },
      ],
      resultItems: [
        { caption: "1 .  abc", level: 0, link: "", prefix: "1.", imgUrl: "" },
        { caption: "2)abc", level: 0, link: "", prefix: "2.", imgUrl: "" },
        { caption: "31)  abc", level: 0, link: "", prefix: "3.", imgUrl: "" },
        { caption: "3.1  abc", level: 0, link: "", prefix: "4.", imgUrl: "" },
        { caption: "3.1.abc", level: 0, link: "", prefix: "5.", imgUrl: "" },
      ],
    },
    {
      title: "Destroy current prefixes",
      tableOfContentsList: [
        { value: " 1 .  abc", level: "0", link: "", firstImageUrl: "" },
        { value: " 2)abc", level: "0", link: "", firstImageUrl: "" },
        { value: "31)  abc", level: "0", link: "", firstImageUrl: "" },
        { value: "3.1  abc", level: "0", link: "", firstImageUrl: "" },
        { value: "3.1.abc", level: "0", link: "", firstImageUrl: "" },
      ],
      resultItems: [
        { caption: "1 .  abc", level: 0, link: "", prefix: "1.", imgUrl: "" },
        { caption: "2)abc", level: 0, link: "", prefix: "2.", imgUrl: "" },
        { caption: "31)  abc", level: 0, link: "", prefix: "3.", imgUrl: "" },
        { caption: "3.1  abc", level: 0, link: "", prefix: "4.", imgUrl: "" },
        { caption: "3.1.abc", level: 0, link: "", prefix: "5.", imgUrl: "" },
      ],
    },
    {
      title: "Empty Table Of Contents should return empty results array",
      tableOfContentsList: [],
      resultItems: [],
    },
  ];
  testCases.forEach(testCase => {
    test(testCase.title, () => {
      expect(
        processTableOfContents({
          type,
          tableOfContentsList: testCase.tableOfContentsList,
        })
      ).toStrictEqual({
        type,
        items: testCase.resultItems,
      });
    });
  });
});

const emptyTableOfContentsWidget = {
  type: "tableOfContents",
  items: [],
};

const tableOfContentsWidget = {
  type: "tableOfContents",
  items: [
    { value: "abc", level: "0", link: "", firstImageUrl: "" },
    { value: "abc.abc", level: "1", link: "", firstImageUrl: "" },
  ],
};

const horizontalTeaserListWidget = {
  type: "listOfTeasers",
  icon: "compass-1-alternate",
  title: "Attractions Nearby",
  variant: "horizontal",
};

const verticalTeaserListWidget = {
  type: "listOfTeasers",
  icon: "compass-1-alternate",
  title: "Attractions Nearby",
  variant: "vertical",
};

const htmlWidget = {
  type: "html",
  value: "",
};

describe("extractTOCWidget from the page widgets", () => {
  test("it should return undefined if there is no table of contents widget", () => {
    const leftSidebar = [
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const rightSidebar = [
      horizontalTeaserListWidget,
      htmlWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const widgetListWithoutTableOfContents = [rightSidebar, leftSidebar];

    expect(extractTOCWidget(widgetListWithoutTableOfContents)).toBeUndefined();
  });

  test("it should return undefined if there is no elements in the table of contents widget", () => {
    const leftSidebar = [
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const rightSidebar = [
      horizontalTeaserListWidget,
      htmlWidget,
      emptyTableOfContentsWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const widgetList = [rightSidebar, leftSidebar];

    expect(extractTOCWidget(widgetList)).toBeUndefined();
  });

  test("it should return table of contents widget if it exists and has elemenets", () => {
    const leftSidebar = [
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const rightSidebar = [
      horizontalTeaserListWidget,
      tableOfContentsWidget,
      htmlWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];
    const widgetList = [rightSidebar, leftSidebar];

    expect(extractTOCWidget(widgetList)).toBe(tableOfContentsWidget);
  });
});

describe("filterWideBottomWidget", () => {
  test("should return empty array if widgetList is empty", () => {
    expect(filterWideBottomWidget([])).toStrictEqual([]);
  });

  test("should filter out only one last horizontal TeaserList widget", () => {
    const resultWidgetList = filterWideBottomWidget([
      htmlWidget,
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
      horizontalTeaserListWidget,
    ] as ArticleWidgetTypes.ArticleWidget[]);

    expect(resultWidgetList).toHaveLength(3);
    expect([htmlWidget, verticalTeaserListWidget, horizontalTeaserListWidget]).toStrictEqual(
      resultWidgetList
    );
  });

  test("should return same array if last element is not a TeaserList", () => {
    const widgetList = [
      htmlWidget,
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
      horizontalTeaserListWidget,
      htmlWidget,
    ] as ArticleWidgetTypes.ArticleWidget[];

    const resultWidgetList = filterWideBottomWidget(widgetList);
    expect(resultWidgetList).toStrictEqual(widgetList);
  });
});

describe("extractOnlyLastWideBottomWidget", () => {
  test("should return empty array if widgetList is empty", () => {
    expect(extractOnlyLastWideBottomWidget([])).toStrictEqual([]);
  });

  test("should return only one last horizontal TeaserList widget", () => {
    const resultWidgetList = extractOnlyLastWideBottomWidget([
      htmlWidget,
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
      horizontalTeaserListWidget,
    ] as ArticleWidgetTypes.ArticleWidget[]);

    expect(resultWidgetList).toHaveLength(1);
    expect([horizontalTeaserListWidget]).toStrictEqual(resultWidgetList);
  });

  test("should return empty array if last element is not a TeaserList", () => {
    const resultWidgetList = extractOnlyLastWideBottomWidget([
      htmlWidget,
      verticalTeaserListWidget,
      horizontalTeaserListWidget,
      horizontalTeaserListWidget,
      htmlWidget,
    ] as ArticleWidgetTypes.ArticleWidget[]);
    expect(resultWidgetList).toStrictEqual([]);
  });
});

describe("processWidget", () => {
  const queryTour = {
    ...mockQueryTour,
    specs: [
      mockQueryTourSpec,
      mockQueryTourSpec,
      mockQueryTourSpec,
      mockQueryTourSpec,
      mockQueryTourSpec,
    ],
    props: [
      mockQueryTourProc,
      mockQueryTourProc,
      mockQueryTourProc,
      mockQueryTourProc,
      mockQueryTourProc,
    ],
  };
  const listOfToursWidget = {
    ...mockQueryData.listOfToursWidget,
    data: {
      ...mockQueryData.listOfToursWidget.data,
      listOfTours: [queryTour, queryTour, queryTour],
    },
  };
  const contentQueryWidgets = [listOfToursWidget, mockQueryData.listOfCarsWidget];

  test("processWidget should transform query content with product list to product list and reduce specs by default to 4 elements", () => {
    // try processWidget without options
    const contentWidgets = contentQueryWidgets.map(processWidget(mockMandatoryOptions, true));

    expect(contentWidgets).toHaveLength(2);
    // by default we limit specs to 4
    const tourContentWidget = contentWidgets[0] as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(tourContentWidget.items[0].specs).toHaveLength(4);
    // by default we don't limit props
    expect(tourContentWidget.items[0].props).toHaveLength(5);
  });

  test("processWidget with reduceNumberOfSpecs should limit product specs by 2", () => {
    const contentWidgets = contentQueryWidgets.map(
      processWidget(
        {
          ...mockMandatoryOptions,
          reduceNumberOfSpecs: true,
        },
        true
      )
    );
    expect(contentWidgets).toHaveLength(2);
    const tourContentWidget = contentWidgets[0] as ArticleWidgetTypes.ContentWidgetListOfProducts;
    // by default we limit specs to 4
    expect(tourContentWidget.items[0].specs).toHaveLength(2);
    // by default we don't limit props
    expect(tourContentWidget.items[0].props).toHaveLength(5);
  });

  test("processWidget with skipProductProps should return products with empty array of props", () => {
    const contentWidgets = contentQueryWidgets.map(
      processWidget(
        {
          ...mockMandatoryOptions,
          skipProductProps: true,
        },
        true
      )
    );
    expect(contentWidgets).toHaveLength(2);
    // by default we limit specs to 4
    const tourContentWidget = contentWidgets[0] as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(tourContentWidget.items[0].specs).toHaveLength(4);
    // by default we don't limit props
    expect(tourContentWidget.items[0].props).toHaveLength(0);
  });

  test("processWidget with skipProductProps and reduceNumberOfSpecs should return products with empty props and limit specs to 2", () => {
    const contentWidgets = contentQueryWidgets.map(
      processWidget(
        {
          ...mockMandatoryOptions,
          reduceNumberOfSpecs: true,
          skipProductProps: true,
        },
        true
      )
    );
    expect(contentWidgets).toHaveLength(2);
    // by default we limit specs to 4
    const tourContentWidget = contentWidgets[0] as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(tourContentWidget.items[0].specs).toHaveLength(2);
    // by default we don't limit props
    expect(tourContentWidget.items[0].props).toHaveLength(0);
  });

  test("processWidget with Namespaces.commonCarNs option has car product and function should be called", () => {
    const commonCarNsT = jest.fn();
    const commonNsT = jest.fn();
    contentQueryWidgets.map(
      processWidget(
        {
          ...mockMandatoryOptions,
          commonCarNsT,
          commonNsT,
        },
        true
      )
    );
    expect(commonCarNsT).toHaveBeenCalled();
    expect(commonNsT).toHaveBeenCalled();
  });
});

describe("Check product construction with titleLink and clientRoute", () => {
  test("tour list creation produce correct clinetRoute from category link", () => {
    const listOfToursWidget = {
      ...mockQueryData.listOfToursWidget,
      data: {
        ...mockQueryData.listOfToursWidget.data,
        titleLink: "http://www.guidetoiceland.is/link-to-tour",
      },
    };
    const widget = processListOfTours(
      listOfToursWidget,
      mockMandatoryOptions
    ) as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(widget.categoryLinkClientRoute).toStrictEqual({
      as: "/link-to-tour",
      route: "/tourSearch",
      query: {
        slug: "link-to-tour",
      },
    });
  });

  test("car list creation produces clientRoute data to use regular link in the clientLink ", () => {
    const listOfCarsWidget = {
      ...mockQueryData.listOfCarsWidget,
      data: {
        ...mockQueryData.listOfCarsWidget.data,
      },
    };
    const widget = processListOfCars(
      listOfCarsWidget,
      mockMandatoryOptions,
      true
    ) as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(widget.categoryLinkClientRoute).toStrictEqual({
      as: "/iceland-car-rentals/rent-a-car-in-keflavik",
      route: "/page",
    });
  });

  test("hotel list creation produces clientRoute data to use regular link in the clientLink ", () => {
    const listOfHotelsWidget = {
      ...mockQueryData.listOfHotelsWidget,
      data: {
        ...mockQueryData.listOfHotelsWidget.data,
      },
    };
    const widget = processListOfHotels(
      listOfHotelsWidget,
      mockMandatoryOptions
    ) as ArticleWidgetTypes.ContentWidgetListOfProducts;
    expect(widget.categoryLinkClientRoute).toStrictEqual({
      as: "/accommodation/reykjavik",
      route: "/page",
    });
  });
});
