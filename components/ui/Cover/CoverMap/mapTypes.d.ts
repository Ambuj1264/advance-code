declare namespace MapTypes {
  export type MarkerWithDataByTypes = {
    [key in SharedTypes.MapPointTypeValues]: (
      | GoogleMapTypes.MarkerWithData
      | BaiduMapTypes.MarkerWithData
    )[];
  };

  export type MapCardAttractionsType = {
    name: string;
    url: string;
    image?: SharedTypes.Image;
    isGoogleReview: boolean;
    reviewTotalCount: number;
    reviewTotalScore: string;
    __typename: string;
  };

  export type MapCardTourType = {
    name: string;
    image?: SharedTypes.Image;
    /* eslint-disable camelcase */
    front_url: string;
    review_score: number;
    review_count: number;
    /* eslint-enable camelcase */
    __typename: string;
  };

  // TODO: add other entities https://app.asana.com/0/44356902189869/1199219488083808/f
  export type MapCardInfoType = MapCardAttractionsType | MapCardTourType;
}
