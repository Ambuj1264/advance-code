import { getTravelerPriceText } from "utils/helperUtils";
import { convertImage } from "utils/imageUtils";
import { PageType, TeaserVariant } from "types/enums";
import { urlToRelative } from "utils/apiUtils";

const constructPriceDescription = (
  groups: {
    adults?: {
      lowestPriceGroupSize: number;
    };
    children?: {
      lowestPriceGroupSize: number;
    };
    teenagers?: {
      lowestPriceGroupSize: number;
    };
  },
  translateFn: TFunction
): string => {
  const adults = groups?.adults?.lowestPriceGroupSize ?? 0;
  const children = groups?.children?.lowestPriceGroupSize ?? 0;
  const teenagers = groups?.teenagers?.lowestPriceGroupSize ?? 0;

  const numberOfTravelers = { adults, children, teenagers };

  return getTravelerPriceText(numberOfTravelers, translateFn);
};

const getPriceValue = (price: string): number => {
  return +price.replace(/,/g, "");
};

export const constructPopularTour = (
  tour: QueryTour,
  translateFn: TFunction
): ArticleWidgetTypes.ArticleWidgetTourItem => {
  return {
    ...tour,
    name: tour.name,
    clientRoute: {
      slug: tour.slug!,
      route: `/${PageType.TOUR}`,
      as: urlToRelative(tour.url),
    },
    image: convertImage(tour.image as QueryImage),
    id: `${tour.id}`,
    lowestPrice: getPriceValue(`${tour.localePrice.price}`),
    currency: tour.localePrice.currency,
    linkUrl: tour.url,
    review: {
      totalScore: +tour.reviewTotalScore,
      totalCount: +tour.reviewTotalCount,
    },
    priceDescription: constructPriceDescription(tour.priceGroups, translateFn),
  };
};

export const constructArticleTeaser = (
  article: Omit<TeaserTypes.Teaser, "variant">
): TeaserTypes.Teaser => {
  return {
    ...article,
    variant: TeaserVariant.VERTICAL_CARD,
  };
};
