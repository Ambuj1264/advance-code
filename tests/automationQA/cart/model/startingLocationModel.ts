export type StartingLocationModelType = {
  locationName: string;
  __typename: string;
};

export const getStartingLocationModelType = (): StartingLocationModelType => ({
  locationName: "Jökulsárlón, Iceland",
  __typename: "OrderTourCartLocation",
});
