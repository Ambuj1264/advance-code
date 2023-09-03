export type EndingLocationModelType = {
  locationName: string;
  __typename: string;
};

export const getEndingLocationModel = (): EndingLocationModelType => ({
  locationName: "Jökulsárlón, Iceland",
  __typename: "OrderTourCartLocation",
});
