import {
  stringify,
  encodeQueryParams,
  StringParam,
  NumberParam,
  NumericArrayParam,
} from "use-query-params";

import { constructImage } from "utils/globalUtils";
import { urlToRelative } from "utils/apiUtils";
import { PageType, FilterQueryParam } from "types/enums";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructProductSpecs } from "components/ui/Information/informationUtils";

export const constructSimilarTours = (
  similarTours: ReadonlyArray<QuerySimilarTour>
): SharedTypes.SimilarProduct[] =>
  similarTours.map((similarTour: QuerySimilarTour) => ({
    id: similarTour.id.toString(),
    clientRoute: {
      route: `/${PageType.TOUR}`,
      query: {
        slug: similarTour.slug,
        title: similarTour.name,
      },
      as: urlToRelative(similarTour.linkUrl),
    },
    name: similarTour.name,
    lowestPrice: similarTour.lowestPricePerAdult,
    image: constructImage(similarTour.image),
    review: {
      totalScore: Number(similarTour.reviewTotalScore),
      totalCount: similarTour.reviewTotalCount,
    },
    linkUrl: similarTour.linkUrl,
    productProps: constructProductProps(similarTour.props),
    productSpecs: constructProductSpecs(similarTour.specs),
    ribbonText: similarTour.banner?.text,
  }));

export default constructSimilarTours;

export const constructSimilarToursSearchQuery = (
  adults: number,
  childrenAges: number[],
  startingLocationName: string,
  startingLocationId?: string,
  dateFrom?: string,
  dateTo?: string
) => {
  if (adults && dateFrom && startingLocationName) {
    const queryString = stringify(
      encodeQueryParams(
        {
          [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
          [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
          [FilterQueryParam.ADULTS]: NumberParam,
          [FilterQueryParam.CHILDREN]: NumberParam,
          [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
          [FilterQueryParam.DATE_FROM]: StringParam,
          [FilterQueryParam.DATE_TO]: StringParam,
        },
        {
          [FilterQueryParam.STARTING_LOCATION_ID]: startingLocationId,
          [FilterQueryParam.STARTING_LOCATION_NAME]: startingLocationName,
          [FilterQueryParam.ADULTS]: adults,
          [FilterQueryParam.CHILDREN]: childrenAges.length,
          [FilterQueryParam.CHILDREN_AGES]: childrenAges,
          [FilterQueryParam.DATE_FROM]: dateFrom,
          [FilterQueryParam.DATE_TO]: dateTo,
        }
      )
    );
    return queryString;
  }

  return "";
};
