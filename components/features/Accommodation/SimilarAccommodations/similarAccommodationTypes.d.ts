declare namespace SimilarAccommodationTypes {
  export type QuerySimilarAccommodation = {
    id: number;
    name: string;
    minPrice: number;
    image: Image;
    url: string;
    slug: string;
    props: SharedTypes.QueryProductProp[];
    specs: SharedTypes.QueryProductSpec[];
    reviewTotalScore: string;
    reviewTotalCount: number;
  };

  export type QuerySimilarAccommodationData = {
    similarAccommodation: {
      accommodations: QuerySimilarAccommodation[];
      seeMoreLink: string;
      totalQuantity: number;
    };
  };
}
