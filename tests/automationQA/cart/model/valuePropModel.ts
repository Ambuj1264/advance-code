export type ValuePropModelType = {
  iconId?: any;
  title: string;
  __typename: string;
};

export const getValuePropModel = (): ValuePropModelType => ({
  iconId: null,
  title: "Free cancellation",
  __typename: "OrderValueProp",
});
