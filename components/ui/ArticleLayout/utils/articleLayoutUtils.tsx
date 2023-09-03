import { some } from "fp-ts/lib/Option";

import constructQuickFacts from "./constructQuickFacts";

import { lightRedColor } from "styles/variables";
import { constructProductSpecs } from "components/ui/Information/informationUtils";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { PageType, TeaserListVariant, ContentWidgetType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import { getProductSlugFromHref } from "utils/routerUtils";
import { constructImage } from "utils/globalUtils";
import { constructProductSpecs as constructCarProductSpecs } from "components/features/CarSearchPage/utils/carSearchUtils";
import { constructHeadline as constructCarHeadline } from "utils/sharedCarUtils";
import { getTourDiscountPrice } from "components/features/TourBookingWidget/utils/tourBookingWidgetUtils";
import { getTotalSaved } from "components/features/SearchPage/utils/searchUtils";

const PRODUCT_SPECS_NUMBER_DEFAULT = 4;
const PRODUCT_SPECS_NUMBER_REDUCED = 2;

export const processTableOfContents = (
  widget: ArticleWidgetTypes.ArticleWidgetCommonData &
    ArticleWidgetTypes.QueryArticleWidgetTableOfContents
): ArticleWidgetTypes.ArticleWidgetCommonData & ArticleWidgetTypes.ArticleWidgetTableOfContents => {
  const levelNumbering = [-1, -1];
  return {
    type: widget.type,
    items: widget.tableOfContentsList.map(item => {
      const result = {
        prefix: "",
        caption: item.value.trim(),
        level: Number(item.level),
        link: item.link,
        imgUrl: item.firstImageUrl,
      };
      /* eslint-disable functional/immutable-data, no-plusplus */
      switch (result.level) {
        case 0:
          if (levelNumbering[0] < 0) {
            levelNumbering[0] = 1;
          } else {
            levelNumbering[0]++;
          }
          result.prefix = `${levelNumbering[0]}.`;
          levelNumbering[1] = -1;
          break;
        case 1:
        default:
          if (levelNumbering[1] < 0) {
            levelNumbering[1] = 1;
          } else {
            levelNumbering[1]++;
          }
          result.prefix = levelNumbering[0] < 0 ? "" : `${levelNumbering[0]}.${levelNumbering[1]}`;
          break;
      }
      /* eslint-enable functional/immutable-data, no-plusplus */
      return result;
    }),
  };
};

export type ConstructContentOptions = {
  commonNsT: TFunction;
  commonCarNsT: TFunction;
  quickFactsNsT: TFunction;
  pageType?: PageType;
};

type ProcessOptions = {
  reduceNumberOfSpecs?: boolean;
  skipProductProps?: boolean;
} & ConstructContentOptions;

export const constructTour = (
  queryTour: TeaserTypes.QueryTour,
  options?: ProcessOptions
): TeaserTypes.Tour => {
  const specsNumberToRender = options?.reduceNumberOfSpecs
    ? PRODUCT_SPECS_NUMBER_REDUCED
    : PRODUCT_SPECS_NUMBER_DEFAULT;
  const specs = queryTour.specs.slice(0, specsNumberToRender);

  const props = options?.skipProductProps ? [] : queryTour.props;

  const price = getTourDiscountPrice(queryTour.basePrice, some(queryTour.discount?.value || 0));

  return {
    ...queryTour,
    price,
    totalSaved: getTotalSaved(price, queryTour.basePrice),
    ribbonLabelText: queryTour.banner?.text,
    image: constructImage(queryTour.image),
    averageRating: parseFloat(`${queryTour.averageRating}`),
    specs: constructProductSpecs(specs),
    props: constructProductProps(props),
    clientRoute: {
      route: `/${PageType.TOUR}`,
      query: {
        slug: queryTour.slug,
      },
      as: urlToRelative(queryTour.linkUrl),
    },
  };
};

export const constructHotel = (
  queryHotel: TeaserTypes.QueryHotel,
  options?: ProcessOptions
): TeaserTypes.Hotel => {
  const specsNumberToRender = options?.reduceNumberOfSpecs
    ? PRODUCT_SPECS_NUMBER_REDUCED
    : PRODUCT_SPECS_NUMBER_DEFAULT;
  const specs = queryHotel.specs.slice(0, specsNumberToRender);

  const props = options?.skipProductProps ? [] : queryHotel.props;

  return {
    ...queryHotel,
    image: constructImage(queryHotel.image),
    averageRating: parseFloat(`${queryHotel.averageRating}`),
    specs: constructProductSpecs(specs),
    props: constructProductProps(props),
    clientRoute: {
      route: `/${PageType.ACCOMMODATION}`,
      query: {
        slug: queryHotel.slug,
      },
      as: urlToRelative(queryHotel.linkUrl),
    },
  };
};

export const constructCar = (
  queryCar: TeaserTypes.QueryCar,
  options: ProcessOptions,
  isGTI: boolean
): TeaserTypes.Car => {
  const carQuickFacts = {
    category: queryCar.category,
    passengerQuantity: queryCar.passengerQuantity,
    bagQuantity: queryCar.bagQuantity,
    manualTransmission: !queryCar.automaticTransmission,
    fuelPolicy: queryCar.fuelPolicy,
    milage: {
      unlimited: queryCar.kmUnlimited,
      distance: queryCar.kmIncluded,
    },
    model: queryCar.model,
    depositRequired: queryCar.depositRequired,
    doors: queryCar.doors,
    highlandCapabilities: queryCar.highlandCapabilities,
    airConIncluded: queryCar.airConIncluded,
    minAge: queryCar.minAge,
    year: queryCar.year,
  };
  const productSpecs = constructCarProductSpecs(
    isGTI,
    options.commonCarNsT as TFunction,
    carQuickFacts,
    [],
    (value: number) => value,
    "ISK"
  );

  const specsNumberToRender = options?.reduceNumberOfSpecs
    ? PRODUCT_SPECS_NUMBER_REDUCED
    : PRODUCT_SPECS_NUMBER_DEFAULT;
  const specs = productSpecs.slice(0, specsNumberToRender);

  return {
    ...queryCar,
    name: constructCarHeadline(options?.commonCarNsT as TFunction, queryCar.name),
    image: constructImage(queryCar.image),
    averageRating: parseFloat(`${queryCar.establishment.reviewTotalScore}`),
    reviewsCount: queryCar.establishment.reviewCount,
    specs,
    props: [],
    clientRoute: {
      route: `/${PageType.CAR}`,
      query: {
        slug: queryCar.slug,
      },
      as: urlToRelative(queryCar.linkUrl),
    },
    establishment: {
      name: queryCar.establishment.name,
      image: constructImage(queryCar.establishment.image),
    },
  };
};

const getTourCategorySearchClientRoute = (
  categoryLink?: string
): SharedTypes.ClientRoute | undefined => {
  if (!categoryLink) {
    return undefined;
  }
  const slug = getProductSlugFromHref(categoryLink);
  const linkAs = urlToRelative(categoryLink);
  const isSearchRoute = `/${slug}` === linkAs;
  const route = isSearchRoute ? `/${PageType.TOURSEARCH}` : `/${PageType.TOURCATEGORY}`;

  return {
    query: { slug },
    route,
    as: linkAs,
  };
};

export const getRegularLinkClientRoute = (link: string): SharedTypes.ClientRoute => {
  const linkAs = urlToRelative(link);
  const route = `/${PageType.PAGE}`;
  return {
    as: linkAs,
    route,
  };
};

export const processListOfTours = (
  widget: ArticleWidgetTypes.QueryArticleWidget,
  options: ProcessOptions
): ArticleWidgetTypes.ArticleWidget => {
  const categoryLink = widget.data.titleLink;
  const categoryLinkTitle = options.commonNsT(`See all tours`);
  const categoryLinkClientRoute = getTourCategorySearchClientRoute(categoryLink);

  return {
    type: widget.type,
    ...(widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts),
    items: (widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts)?.listOfTours.map(
      (tourData: TeaserTypes.QueryTour) => constructTour(tourData, options)
    ),
    categoryLink,
    categoryLinkClientRoute,
    categoryLinkTitle,
  };
};

export const processListOfHotels = (
  widget: ArticleWidgetTypes.QueryArticleWidget,
  options: ProcessOptions
): ArticleWidgetTypes.ArticleWidget => {
  const categoryLink = widget.data.titleLink;
  const categoryLinkTitle = options.commonNsT(`See all hotels`);
  // hotel categories are not launched
  const categoryLinkClientRoute = categoryLink
    ? getRegularLinkClientRoute(categoryLink)
    : undefined;

  return {
    type: widget.type,
    ...(widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts),
    items: (widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts)?.listOfHotels.map(
      (hotelData: TeaserTypes.QueryHotel) => constructHotel(hotelData, options)
    ),
    categoryLink,
    categoryLinkTitle,
    categoryLinkClientRoute,
  };
};

export const processListOfCars = (
  widget: ArticleWidgetTypes.QueryArticleWidget,
  options: ProcessOptions,
  isGTI: boolean
): ArticleWidgetTypes.ArticleWidget => {
  const categoryLink = widget.data.titleLink;
  const categoryLinkTitle = options.commonNsT(`See all cars`);
  // no car category in the types/enums
  const categoryLinkClientRoute = categoryLink
    ? getRegularLinkClientRoute(categoryLink)
    : undefined;

  return {
    type: widget.type,
    ...(widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts),
    items: (widget.data as ArticleWidgetTypes.QueryContentWidgetListOfProducts)?.listOfCars.map(
      (carData: TeaserTypes.QueryCar) => constructCar(carData, options, isGTI)
    ),
    categoryLink,
    categoryLinkTitle,
    categoryLinkClientRoute,
  };
};

const processQuickFacts = (
  widget: ArticleWidgetTypes.QueryArticleWidget,
  options: ProcessOptions
): ArticleWidgetTypes.ArticleWidget => {
  const widgetData = widget.data as ArticleWidgetTypes.QueryArticleWidgetListOfQuickFacts;
  return {
    ...widgetData,
    type: widgetData.type || widget.type,
    listOfQuickFacts: constructQuickFacts(widgetData.listOfQuickFacts, options),
  };
};

export const transformWidget = (
  widget: ArticleWidgetTypes.QueryArticleWidget,
  options: ProcessOptions,
  isGTI: boolean
): ArticleWidgetTypes.ArticleWidget => {
  switch (widget.type) {
    case ContentWidgetType.TABLE_OF_CONTENTS:
      return processTableOfContents({
        type: widget.type,
        ...(widget.data as ArticleWidgetTypes.QueryArticleWidgetTableOfContents),
      } as ArticleWidgetTypes.ArticleWidgetCommonData & ArticleWidgetTypes.QueryArticleWidgetTableOfContents);

    case ContentWidgetType.LIST_OF_TOURS:
      return processListOfTours(widget as ArticleWidgetTypes.QueryArticleWidget, options);

    case ContentWidgetType.LIST_OF_HOTELS:
      return processListOfHotels(widget as ArticleWidgetTypes.QueryArticleWidget, options);

    case ContentWidgetType.LIST_OF_CARS:
      return processListOfCars(widget as ArticleWidgetTypes.QueryArticleWidget, options, isGTI);

    case ContentWidgetType.LIST_OF_QUICK_FACTS:
      return processQuickFacts(widget, options);

    default:
  }

  return {
    ...(widget.data as ArticleWidgetTypes.ArticleWidget),
    type: widget.data?.type || widget.type,
    ...(options.pageType && { pageType: options.pageType }),
  };
};

export const processWidget =
  (options: ProcessOptions, isGTI: boolean) => (widget: ArticleWidgetTypes.QueryArticleWidget) => {
    return transformWidget(widget, options, isGTI);
  };

const shouldBelongToBottom = (widget: ArticleWidgetTypes.ArticleWidget): boolean => {
  switch (widget.type) {
    case ContentWidgetType.LIST_OF_TEASERS:
      return (
        (widget as ArticleWidgetTypes.ArticleWidgetListOfTeasers).variant ===
        TeaserListVariant.HORIZONTAL
      );
    default:
      return false;
  }
};

export const extractWideWidgetsToBottom = (
  sources: ArticleWidgetTypes.ArticleWidget[][]
): ArticleWidgetTypes.ArticleWidget[] => {
  return sources.reduce((acc, source) => {
    return [...acc, ...source.filter(shouldBelongToBottom)];
  }, []);
};

export const extractOnlyLastWideBottomWidget = (
  widgetList: ArticleWidgetTypes.ArticleWidget[]
): ArticleWidgetTypes.ArticleWidget[] => {
  if (!widgetList.length) {
    return widgetList;
  }

  const isLastElementWideTeaserList = shouldBelongToBottom(widgetList[widgetList.length - 1]);

  if (isLastElementWideTeaserList) {
    return widgetList.slice(-1);
  }

  return [];
};

export const filterWideWidgets = (
  source: ArticleWidgetTypes.ArticleWidget[]
): ArticleWidgetTypes.ArticleWidget[] => {
  return source.filter(widget => !shouldBelongToBottom(widget));
};

// Return widgetList without TeaserLists elements on the bottom
export const filterWideBottomWidget = (
  widgetList: ArticleWidgetTypes.ArticleWidget[]
): ArticleWidgetTypes.ArticleWidget[] => {
  if (!widgetList.length) {
    return widgetList;
  }

  const isLastElementWideTeaserList = shouldBelongToBottom(widgetList[widgetList.length - 1]);

  if (isLastElementWideTeaserList) {
    return widgetList.slice(0, -1);
  }

  return widgetList;
};

export const extractTOCWidget = (
  sources: ArticleWidgetTypes.ArticleWidget[][]
): ArticleWidgetTypes.ArticleWidgetTableOfContents | undefined => {
  // The syntax for (const source of sources) { is disabled by eslint
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];

    const toc = source.find(
      widget => widget.type === ContentWidgetType.TABLE_OF_CONTENTS
    ) as ArticleWidgetTypes.ArticleWidgetTableOfContents;

    if (toc && toc.items.length) {
      return toc;
    }
  }
  return undefined;
};

export const filterRedundantRightBarTeasers = (
  source: ArticleWidgetTypes.ArticleWidget[]
): ArticleWidgetTypes.ArticleWidget[] => {
  /*
   * For now only firs two teasers are relevant. First is a teaser with popular categories,
   * the second with popular products
   * The other teasers just mocked data for tests.
   * */
  return source.slice(0, 2);
};

export const convertTableOfContentIntoStructuredDataList = (
  url: string,
  tableOfContent?: ArticleWidgetTypes.ArticleWidgetTableOfContents
): Array<{ url: string; title: string; imgUrl: string }> => {
  if (!tableOfContent) {
    return [];
  }

  return tableOfContent.items.map(item => ({
    url: `${url}${item.link}`,
    title: item.caption,
    imgUrl: item.imgUrl,
  }));
};

export const getPageColor = (pageType: PageType | undefined, theme: Theme): string => {
  switch (pageType) {
    case PageType.BLOG: {
      return theme.colors.primary;
    }

    case PageType.ARTICLE: {
      return lightRedColor;
    }

    default: {
      return theme.colors.primary;
    }
  }
};
