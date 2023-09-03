type QuerySimilarTour = Readonly<{
  id: number;
  slug: string;
  name: string;
  lowestPricePerAdult: number;
  priceGroups: QueryPriceGroups;
  image: QueryImage;
  reviewTotalScore: string;
  reviewTotalCount: number;
  durationAsText: string;
  linkUrl: string;
  props: SharedTypes.QueryProductProp[];
  specs: SharedTypes.QueryProductSpec[];
  banner?: {
    text: string;
  };
}>;

type QuerySimilarToursData = Readonly<{
  similarTours: {
    tours: ReadonlyArray<QuerySimilarTour>;
    seeMoreLink: string;
    totalQuantity: number;
  };
}>;
