export type SpecModelType = {
  iconId: string;
  name: string;
  value: string;
  __typename: string;
};

export const getSpecModel = (): SpecModelType => ({
  iconId: "tourStarts",
  name: "Tour starts",
  value: "Jökulsárlón, Iceland",
  __typename: "OrderProductSpec",
});
