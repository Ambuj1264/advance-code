export type CategoryModelType = {
  id: number;
  name: string;
  uri: string;
  __typename: string;
};

export const getCategoryModel = (): CategoryModelType => ({
  id: 17,
  name: "Ice Cave Tours",
  uri: "/book-trips-holiday/nature-tours/caves",
  __typename: "OrderTourCartCategory",
});
