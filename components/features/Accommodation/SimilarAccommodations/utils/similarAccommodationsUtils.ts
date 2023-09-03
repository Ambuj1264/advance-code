import { urlToRelative } from "utils/apiUtils";
import { PageType } from "types/enums";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructProductSpecs } from "components/ui/Information/informationUtils";

export const constructParams = (asPath: string) => {
  const urlPrams = asPath.split("?")[1];
  return urlPrams ? `?${urlPrams}` : "";
};

export const constructSimilarAccommodations = (
  accommodations: SimilarAccommodationTypes.QuerySimilarAccommodation[],
  asPath: string
): SharedTypes.SimilarProduct[] =>
  accommodations.map(
    ({
      id,
      name,
      minPrice,
      image,
      url,
      slug,
      props,
      specs,
      reviewTotalScore,
      reviewTotalCount,
    }) => ({
      id: id.toString(),
      name,
      lowestPrice: minPrice,
      image,
      clientRoute: {
        query: {
          slug,
          title: name,
        },
        route: `/${PageType.ACCOMMODATION}`,
        as: urlToRelative(`${url}${constructParams(asPath)}`),
      },
      productProps: constructProductProps(props),
      productSpecs: constructProductSpecs(specs),
      linkUrl: url,
      review: {
        totalCount: reviewTotalCount,
        totalScore: parseFloat(reviewTotalScore),
      },
    })
  );
